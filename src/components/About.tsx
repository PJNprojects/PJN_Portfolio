import { Fragment } from 'react';
import { about } from '../content/site';
import { useReveal } from '../lib/useReveal';
import { scrollTo } from '../lib/scroll';

const tones = ['', 'b', 'c'];

/** Renders the story with [[highlighted]] phrases and the studio name in full ink. */
function Story({ text }: { text: string }) {
  const parts = text.split(/\[\[(.+?)\]\]/g);
  let n = 0;
  return (
    <>
      {parts.map((p, i) => {
        if (i % 2 === 1) return <mark key={i} className={tones[n++ % 3]}>{p}</mark>;
        if (i === 0 && p.startsWith('Panchajanyam')) {
          return <Fragment key={i}><span className="name">Panchajanyam</span>{p.slice('Panchajanyam'.length)}</Fragment>;
        }
        return <Fragment key={i}>{p}</Fragment>;
      })}
    </>
  );
}

export default function About() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section className="about" id="about">
      <div className="reveal" ref={ref}>
        <h2>{about.heading}</h2>
        <p className="story">
          <Story text={about.story} />{' '}
          <a className="go" href="#brief" onClick={(e) => { e.preventDefault(); scrollTo('#brief'); }}>{about.link}</a>
        </p>
      </div>
    </section>
  );
}
