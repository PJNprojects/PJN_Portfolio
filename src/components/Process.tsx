import { process } from '../content/site';
import { useReveal } from '../lib/useReveal';

export default function Process() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section className="process" id="process">
      <div className="grid12 reveal" ref={ref}>
        <h2 className="poster">{process.heading}</h2>
        <p className="intro">{process.intro}</p>
        <div className="slip">
          <h3>{process.slipTitle}</h3>
          <p className="sub">{process.slipSub}</p>
          {process.groups.map((g) => (
            <div key={g.title}>
              <h4>{g.title}</h4>
              {g.rows.map(([what, when]) => (
                <div className="row" key={what}>
                  <span className="what">{what}</span>
                  <span className="dots" />
                  <span className="when">{when}</span>
                </div>
              ))}
            </div>
          ))}
          <div className="result">{process.result}</div>
        </div>
      </div>
    </section>
  );
}
