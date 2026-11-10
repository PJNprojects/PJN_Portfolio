import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { brief, site } from '../content/site';
import { useReveal } from '../lib/useReveal';
import { hasFirebase, saveBrief } from '../lib/firebase';
import { Silk, Traces } from './board';

/** A contact card (.vcf) a visitor can save, so the studio's number lands in their phone book. */
const contactCard = 'data:text/vcard;charset=utf-8,' + encodeURIComponent(
  ['BEGIN:VCARD', 'VERSION:3.0', `FN:${site.name}`, `ORG:${site.name}`, `TEL;TYPE=CELL:+${site.phone}`, `EMAIL:${site.email}`, 'END:VCARD'].join('\n'),
);

function list(items: string[]) {
  if (items.length <= 1) return items.join('');
  return items.slice(0, -1).join(', ') + ' and ' + items[items.length - 1];
}

/**
 * A client flips switches for what they have and what they need, writes one line, and the page
 * writes the brief onto the display.
 * With Firebase configured it is saved to the `briefs` collection; otherwise it opens the visitor's
 * mail app with the brief in the body.
 */
export default function Brief() {
  const head = useReveal<HTMLDivElement>();
  const [have, setHave] = useState(brief.have[0][1]);
  const [needs, setNeeds] = useState<string[]>([]);
  const [line, setLine] = useState('');
  const [contact, setContact] = useState('');
  const [state, setState] = useState<'idle' | 'saving' | 'saved' | 'failed'>('idle');

  const text = useMemo(() => {
    let t = `I have ${have}.`;
    t += needs.length ? ` I need ${list(needs)}.` : ' I’m not sure yet what I need.';
    const what = line.trim().replace(/[.\s]+$/, '');
    if (what) t += ` In a line: ${what}.`;
    const reach = contact.trim();
    if (reach) t += ` Reach me at ${reach}.`;
    return t;
  }, [have, needs, line, contact]);

  const mailto = `mailto:${site.email}?subject=${encodeURIComponent(brief.subject)}&body=${encodeURIComponent(text + '\n\nName:\nPhone:\n')}`;

  // WhatsApp click-to-chat: opens a chat with our number and the brief typed in; the visitor presses send.
  const whatsapp = `https://wa.me/${site.phone}?text=${encodeURIComponent(`${brief.subject}\n\n${text}`)}`;

  async function send(e: React.MouseEvent) {
    if (!hasFirebase) return; // the plain mailto link does the work
    e.preventDefault();
    if (state === 'saving') return;
    setState('saving');
    try {
      await saveBrief({ have, needs, line, contact, text });
      setState('saved');
    } catch {
      setState('failed');
      window.location.href = mailto;
    }
  }

  return (
    <section className="brief board" id="brief">
      <Traces seed={31} fill={0.4} />
      <div className="brief-head reveal" ref={head}>
        <Silk mark="SW1">Contact</Silk>
        <h2 className="poster">{brief.heading}</h2>
        <p className="lead">{brief.lead}</p>
      </div>

      <div className="builder" data-ui>
        <div className="builder-ask">
          <div className="q" role="group" aria-labelledby="q-have">
            <p id="q-have">{brief.haveQuestion}</p>
            <div className="chips">
              {brief.have.map(([label, value]) => (
                <button key={value} type="button" className="switch" aria-pressed={have === value} onClick={() => setHave(value)}><i aria-hidden="true" />{label}</button>
              ))}
            </div>
          </div>
          <div className="q" role="group" aria-labelledby="q-need">
            <p id="q-need">{brief.needQuestion}</p>
            <div className="chips">
              {brief.need.map(([label, value]) => {
                const on = needs.includes(value);
                return (
                  <button key={value} type="button" className="switch" aria-pressed={on}
                    onClick={() => setNeeds(on ? needs.filter((n) => n !== value) : [...needs, value])}><i aria-hidden="true" />{label}</button>
                );
              })}
            </div>
          </div>
          <div className="q">
            <p><label htmlFor="brief-line">{brief.lineLabel}</label></p>
            <input id="brief-line" type="text" maxLength={160} placeholder={brief.linePlaceholder} autoComplete="off"
              value={line} onChange={(e) => setLine(e.target.value)} />
          </div>
          <div className="q">
            <p><label htmlFor="brief-contact">{brief.contactLabel}</label></p>
            <input id="brief-contact" type="text" maxLength={80} placeholder={brief.contactPlaceholder} autoComplete="on"
              value={contact} onChange={(e) => setContact(e.target.value)} />
          </div>
        </div>

        <div className="builder-out">
          <h3>{brief.outLabel}</h3>
          <p className="out lcd" aria-live="polite">{state === 'saved' ? brief.hintSaved : text}</p>
          {state !== 'saved' && (
            <div className="send">
              <a className="btn btn-wa" href={whatsapp} target="_blank" rel="noopener noreferrer">{brief.whatsapp}</a>
              <a className="btn" href={mailto} onClick={send} aria-disabled={state === 'saving'}>{brief.send}</a>
              <p className="hint">{brief.hintMail}</p>
              <a className="link hint" href={contactCard} download={`${site.name}.vcf`}>{brief.save}</a>
            </div>
          )}
        </div>
      </div>

      <div className="rows">
        <a href={`https://wa.me/${site.phone}`} target="_blank" rel="noopener noreferrer">WhatsApp {site.phoneShown}</a>
        <a href={`mailto:${site.email}`}>{site.email.replace('@', '@​')}</a>
        <Link to="/portal">{brief.portal}</Link>
      </div>
    </section>
  );
}
