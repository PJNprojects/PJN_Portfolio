import { work } from '../content/site';
import { useReveal } from '../lib/useReveal';
import DeviceDrawing from './DeviceDrawing';

export default function Work() {
  const head = useReveal<HTMLDivElement>();
  const ledger = useReveal<HTMLDivElement>();
  return (
    <section className="work" id="work">
      <div className="grid12 reveal" ref={head}>
        <h2 className="poster">{work.heading}</h2>
        <p className="statement">{work.statement}</p>
        <p className="note">{work.note}</p>
      </div>
      <figure className="figure">
        {/* Swap for <img src="/media/collar-board.jpg" …> or a muted <video> when the photographs exist. */}
        <DeviceDrawing id="work-device" className="work-drawing" />
        <figcaption>{work.figureCaption}</figcaption>
      </figure>
      <div className="ledger reveal" ref={ledger}>
        <h3>{work.ledgerTitle}</h3>
        <ul>
          {work.ledger.map((r) => (
            <li key={r.name}>
              <span>{r.name}</span>
              <span className="kind">{r.kind}</span>
              <span className="where">{r.where}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
