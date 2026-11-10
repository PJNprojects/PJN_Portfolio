import { useState } from 'react';
import { process } from '../content/site';
import { useReveal } from '../lib/useReveal';

/** Four verbs. Each opens to show what happens in that stage and roughly how long it takes. */
export default function Process() {
  const head = useReveal<HTMLDivElement>();
  const list = useReveal<HTMLOListElement>();
  const [open, setOpen] = useState(0);

  return (
    <section className="process" id="process">
      <div className="process-head reveal" ref={head}>
        <h2 className="poster">{process.heading}</h2>
        <p className="lead">{process.intro}</p>
      </div>

      <ol className="stages reveal" ref={list}>
        {process.stages.map((s, i) => {
          const on = open === i;
          return (
            <li key={s.verb} className={on ? 'is-open' : ''}>
              <h3>
                <button type="button" aria-expanded={on} aria-controls={`stage-${i}`} onClick={() => setOpen(on ? -1 : i)}>
                  <span className="verb poster">{s.verb}</span>
                  <span className="sum">{s.sum}</span>
                  <span className="sign" aria-hidden="true" />
                </button>
              </h3>
              <div className="stage-body" id={`stage-${i}`} role="region" aria-label={s.verb}>
                <ul>
                  {s.rows.map(([what, when]) => (
                    <li key={what}><span>{what}</span><span className="when">{when}</span></li>
                  ))}
                </ul>
              </div>
            </li>
          );
        })}
      </ol>

      <p className="process-result">{process.result}</p>
    </section>
  );
}
