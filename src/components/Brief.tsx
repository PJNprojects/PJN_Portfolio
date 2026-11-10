import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { brief, site } from '../content/site';
import { useReveal } from '../lib/useReveal';
import { hasFirebase, saveBrief } from '../lib/firebase';

function list(items: string[]) {
  if (items.length <= 1) return items.join('');
  return items.slice(0, -1).join(', ') + ' and ' + items[items.length - 1];
}

/**
 * A client taps what they have and what they need, writes one line, and the page writes the brief.
 * With Firebase configured it is saved to the `briefs` collection; otherwise it opens the visitor's
 * mail app with the brief in the body.
 */
export default function Brief() {
  const head = useReveal<HTMLDivElement>();
  const [have, setHave] = useState(brief.have[0][1]);
  const [needs, setNeeds] = useState<string[]>([]);
  const [line, setLine] = useState('');
  const [state, setState] = useState<'idle' | 'saving' | 'saved' | 'failed'>('idle');

  const text = useMemo(() => {
    let t = `I have ${have}.`;
    t += needs.length ? ` I need ${list(needs)}.` : ' I’m not sure yet what I need.';
    const what = line.trim().replace(/[.\s]+$/, '');
    if (what) t += ` In a line: ${what}.`;
    return t;
  }, [have, needs, line]);

  const mailto = `mailto:${site.email}?subject=${encodeURIComponent(brief.subject)}&body=${encodeURIComponent(text + '\n\nName:\nPhone:\n')}`;

  async function send(e: React.MouseEvent) {
    if (!hasFirebase) return; // the plain mailto link does the work
    e.preventDefault();
    if (state === 'saving') return;
    setState('saving');
    try {
      await saveBrief({ have, needs, line, text });
      setState('saved');
    } catch {
      setState('failed');
      window.location.href = mailto;
    }
  }

  return (
    <section className="brief" id="brief">
      <div className="brief-head reveal" ref={head}>
        <h2 className="poster">{brief.heading}</h2>
        <p className="lead">{brief.lead}</p>
      </div>

      <div className="builder">
        <div className="builder-ask">
          <div className="q" role="group" aria-labelledby="q-have">
            <p id="q-have">{brief.haveQuestion}</p>
            <div className="chips">
              {brief.have.map(([label, value]) => (
                <button key={value} type="button" className="chip" aria-pressed={have === value} onClick={() => setHave(value)}>{label}</button>
              ))}
            </div>
          </div>
          <div className="q" role="group" aria-labelledby="q-need">
            <p id="q-need">{brief.needQuestion}</p>
            <div className="chips">
              {brief.need.map(([label, value]) => {
                const on = needs.includes(value);
                return (
                  <button key={value} type="button" className="chip" aria-pressed={on}
                    onClick={() => setNeeds(on ? needs.filter((n) => n !== value) : [...needs, value])}>{label}</button>
                );
              })}
            </div>
          </div>
          <div className="q">
            <p><label htmlFor="brief-line">{brief.lineLabel}</label></p>
            <input id="brief-line" type="text" maxLength={160} placeholder={brief.linePlaceholder} autoComplete="off"
              value={line} onChange={(e) => setLine(e.target.value)} />
          </div>
        </div>

        <div className="builder-out">
          <h3>{brief.outLabel}</h3>
          <p className="out" aria-live="polite">{state === 'saved' ? brief.hintSaved : text}</p>
          {state !== 'saved' && (
            <div className="send">
              <a className="btn btn-ink" href={mailto} onClick={send} aria-disabled={state === 'saving'}>{brief.send}</a>
              {!hasFirebase && <p className="hint">{brief.hintMail}</p>}
            </div>
          )}
        </div>
      </div>

      <div className="rows">
        <a href={`mailto:${site.email}`}>{site.email.replace('@', '@​')}</a>
        <Link to="/portal">{brief.portal}</Link>
      </div>
    </section>
  );
}
