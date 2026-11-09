import { capabilities } from '../content/site';
import { useReveal } from '../lib/useReveal';

export default function Capabilities() {
  const ref = useReveal<HTMLUListElement>();
  return (
    <section className="caps" id="capabilities">
      <ul className="reveal" ref={ref}>
        <li><h2 className="poster">{capabilities.heading}</h2><span className="desc" /></li>
        {capabilities.items.map(([name, desc]) => (
          <li key={name}>
            <span className="name poster">{name}</span>
            <p className="desc">{desc}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
