import { Fragment } from 'react';
import { about } from '../content/site';
import { useReveal } from '../lib/useReveal';

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

export default function About() {
  const head = useReveal<HTMLDivElement>();
  const deal = useReveal<HTMLDivElement>();
  const column = (c: { title: string; items: string[] }, className: string) => (
    <div className={className}>
      <h3>{c.title}</h3>
      <ul>{c.items.map((x) => <li key={x}>{x}</li>)}</ul>
    </div>
  );
  return (
    <section className="about" id="about">
      <div className="about-head reveal" ref={head}>
        <h2 className="poster">{about.heading}</h2>
        <p className="story"><Story text={about.story} /></p>
      </div>
      <div className="deal reveal" ref={deal}>
        {column(about.you, 'deal-you')}
        {column(about.we, 'deal-we')}
      </div>
    </section>
  );
}
