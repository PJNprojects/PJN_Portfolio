import { useLayoutEffect, useRef, useState } from 'react';
import { work } from '../content/site';
import { gsap, ScrollTrigger, hasFinePointer, prefersReducedMotion, scrollTo } from '../lib/scroll';
import { Chip, Silk, Traces } from './board';

/**
 * The teardown. One frame holds its place while the page scrolls; each step of text that passes
 * swaps the part shown in it. The frame leans toward the pointer. Order comes from the device:
 * outside in, then onto the bench.
 */
export default function Work() {
  const root = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const steps = gsap.utils.toArray<HTMLElement>('.tear-step', el);
    const mm = gsap.matchMedia();

    // Desktop and tablet: the step crossing the middle of the screen is the current one.
    mm.add('(min-width: 761px)', () => {
      steps.forEach((step, i) => {
        ScrollTrigger.create({
          trigger: step,
          start: 'top 58%',
          end: 'bottom 58%',
          onToggle: (self) => { if (self.isActive) setActive(i); },
        });
      });
    });

    // Phone: the steps are cards swiped sideways; the card in the middle is the current one.
    mm.add('(max-width: 760px)', () => {
      const list = el.querySelector('.tear-steps');
      if (!list || !('IntersectionObserver' in window)) return;
      const io = new IntersectionObserver(
        (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(steps.indexOf(e.target as HTMLElement)); }),
        { root: list, rootMargin: '0px -45% 0px -45%' },
      );
      steps.forEach((s) => io.observe(s));
      return () => io.disconnect();
    });

    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => mm.revert();
  }, []);

  // The frame tilts a few degrees toward the pointer.
  useLayoutEffect(() => {
    const el = frame.current;
    if (!el || !hasFinePointer() || prefersReducedMotion()) return;
    const rx = gsap.quickTo(el, 'rotationX', { duration: 0.6, ease: 'power3.out' });
    const ry = gsap.quickTo(el, 'rotationY', { duration: 0.6, ease: 'power3.out' });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      ry(((e.clientX - r.left) / r.width - 0.5) * 9);
      rx(((e.clientY - r.top) / r.height - 0.5) * -7);
    };
    const leave = () => { rx(0); ry(0); };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
      gsap.set(el, { clearProps: 'transform' });
    };
  }, []);

  const goTo = (i: number) => {
    const step = root.current?.querySelectorAll('.tear-step')[i];
    if (!step) return;
    // On a phone the cards sit side by side, so bring the card across rather than the page down.
    if (window.matchMedia('(max-width: 760px)').matches) step.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    else scrollTo(step);
  };

  return (
    <section className="work board" id="work" aria-label="The parts of the collar">
      <Traces seed={11} fill={0.45} />
      <div className="tear" ref={root}>
        <div className="tear-hold">
          <Chip className="tear-frame" ref={frame}>
            {work.steps.map((s, i) => (
              <img key={s.title} className={i <= active ? 'is-on' : ''} src={s.picture.src} srcSet={s.picture.srcSet}
                sizes="(max-width: 760px) 92vw, 40vw" width={s.picture.width} height={s.picture.height}
                alt={s.picture.alt} loading="lazy" decoding="async" />
            ))}
            <div className="tear-dots" role="group" aria-label="Parts of the collar">
              {work.steps.map((s, i) => (
                <button key={s.title} type="button" aria-label={s.title} aria-current={i === active ? 'step' : undefined}
                  onClick={() => goTo(i)} />
              ))}
            </div>
          </Chip>
        </div>

        <ol className="tear-steps">
          {work.steps.map((s, i) => (
            <li key={s.title} className={'tear-step' + (i === active ? ' is-active' : '')}>
              {/* Shown on phones only, where each step is a card with its own picture. */}
              <img className="tear-inline" src={s.picture.src} srcSet={s.picture.srcSet} sizes="86vw"
                width={s.picture.width} height={s.picture.height} alt={s.picture.alt} loading="lazy" decoding="async" />
              <Silk mark={`U${i + 2}`}>{s.label}</Silk>
              <h2 className="poster">{s.title}</h2>
              <p>{s.text}</p>
              <div className="proves">
                <p>{work.provesLabel}</p>
                <ul>{s.proves.map((x) => <li key={x} className="smd">{x}</li>)}</ul>
              </div>
            </li>
          ))}
        </ol>

        <div className="tear-dots tear-dots-phone" role="group" aria-label="Parts of the collar">
          {work.steps.map((s, i) => (
            <button key={s.title} type="button" aria-label={s.title} aria-current={i === active ? 'step' : undefined}
              onClick={() => goTo(i)} />
          ))}
        </div>
      </div>
    </section>
  );
}
