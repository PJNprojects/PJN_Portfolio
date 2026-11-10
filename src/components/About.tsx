import { Fragment } from 'react';
import { about, site } from '../content/site';
import { useReveal } from '../lib/useReveal';
import { Chip, Silk, Traces } from './board';

/** Renders the story with its [[highlighted]] phrases. */
function Story({ text }: { text: string }) {
  return (
    <>
      {text.split(/\[\[(.+?)\]\]/g).map((part, i) =>
        i % 2 === 1 ? <mark key={i}>{part}</mark> : <Fragment key={i}>{part}</Fragment>,
      )}
    </>
  );
}

/** The deal, drawn as a pinout: what goes into the studio on the left, what comes out on the right. */
export default function About() {
  const head = useReveal<HTMLDivElement>();
  const pins = (c: { title: string; items: string[][] }, side: 'in' | 'out', from: number) => (
    <div className={'pins pins-' + side}>
      <h3>{c.title}</h3>
      <ul>
        {c.items.map(([name, note], i) => (
          <li key={name}>
            <span className="pin-no" aria-hidden="true">{from + i}</span>
            <span className="pin-text"><b>{name}</b> {note}</span>
          </li>
        ))}
      </ul>
    </div>
  );
  return (
    <section className="about board" id="about">
      <Traces seed={23} fill={0.4} />
      <div className="about-head reveal" ref={head}>
        <Silk mark="U7">About</Silk>
        <h2 className="poster">{about.heading}</h2>
        <p className="lead"><Story text={about.story} /></p>
      </div>

      <div className="pinout">
        {pins(about.you, 'in', 1)}
        <Chip className="pinout-chip">
          <i className="chip-dot" aria-hidden="true" />
          <p className="chip-part">{about.chip.part}</p>
          <p className="chip-name">{site.name}</p>
          <p className="chip-line">{about.chip.line}</p>
        </Chip>
        {pins(about.we, 'out', about.you.items.length + 1)}
      </div>
    </section>
  );
}
