import { useState } from 'react';
import { process } from '../content/site';
import { useReveal } from '../lib/useReveal';
import { Silk } from './board';

/**
 * The process, on the bench: four chips in a breadboard, wired in order. Picking one puts its
 * datasheet on the page — what happens in that stage and how long it typically takes.
 */
export default function Process() {
  const head = useReveal<HTMLDivElement>();
  const [open, setOpen] = useState(0);
  const stage = process.stages[open];

  return (
    <section className="bench" id="process">
      <div className="process-head reveal" ref={head}>
        <Silk mark="BB1">Process</Silk>
        <h2 className="poster">{process.heading}</h2>
        <p className="lead">{process.intro}</p>
      </div>

      <div className="bench-grid">
        <div className="bread" data-ui>
          <div className="bread-rail" aria-hidden="true" />
          <div className="bread-field" role="tablist" aria-label={process.heading}>
            {process.stages.map((s, i) => (
              <button key={s.verb} type="button" role="tab" id={`stage-tab-${i}`} className="dip"
                aria-selected={i === open} aria-controls="stage-sheet" tabIndex={i === open ? 0 : -1}
                onClick={() => setOpen(i)}
                onKeyDown={(e) => {
                  const d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
                  if (!d) return;
                  e.preventDefault();
                  const next = (i + d + process.stages.length) % process.stages.length;
                  setOpen(next);
                  document.getElementById(`stage-tab-${next}`)?.focus();
                }}>
                <span className="dip-body">
                  <i className="led" aria-hidden="true" />
                  <b>{s.verb}</b>
                  <em>{s.sum}</em>
                </span>
              </button>
            ))}
          </div>
          <div className="bread-rail" aria-hidden="true" />
        </div>

        <div className="sheet" id="stage-sheet" role="tabpanel" aria-labelledby={`stage-tab-${open}`} data-ui>
          <p className="sheet-top"><b>{process.sheet}</b><span>PJN · {stage.verb.toUpperCase()}</span></p>
          <h3>{stage.verb}<span>{stage.sum}</span></h3>
          <table>
            <thead><tr><th scope="col">{process.columns[0]}</th><th scope="col">{process.columns[1]}</th></tr></thead>
            <tbody>
              {stage.rows.map(([what, when]) => <tr key={what}><td>{what}</td><td>{when}</td></tr>)}
            </tbody>
          </table>
          <p className="sheet-result">{process.result}</p>
        </div>
      </div>
    </section>
  );
}
