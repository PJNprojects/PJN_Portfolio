import { useLayoutEffect, useRef } from 'react';
import { hero, site } from '../content/site';
import { gsap, hasFinePointer, prefersReducedMotion, scrollTo } from '../lib/scroll';
import { useMagnet } from '../lib/useMagnet';
import { Chip, Parts, Silk, Traces } from './board';

/**
 * First screen: the board itself. The statement on the left, the finished enclosure mounted as
 * the main part on the right, live traces running between them. The part leans toward the pointer.
 */
export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const cta = useMagnet<HTMLAnchorElement>();

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const part = el.querySelector<HTMLElement>('.hero-part .chip');

    const ctx = gsap.context(() => {
      gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true } })
        .to('.hero-part', { yPercent: 10 }, 0)
        .to('.hero .traces', { yPercent: -6 }, 0);
    }, el);

    let off = () => {};
    if (part && hasFinePointer()) {
      const rx = gsap.quickTo(part, 'rotationX', { duration: 0.8, ease: 'power3.out' });
      const ry = gsap.quickTo(part, 'rotationY', { duration: 0.8, ease: 'power3.out' });
      const move = (e: PointerEvent) => {
        ry((e.clientX / window.innerWidth - 0.5) * 10);
        rx((e.clientY / window.innerHeight - 0.5) * -8);
      };
      el.addEventListener('pointermove', move);
      off = () => el.removeEventListener('pointermove', move);
    }
    return () => { off(); ctx.revert(); };
  }, []);

  const p = hero.picture;
  const jump = (href: string) => (e: React.MouseEvent) => { e.preventDefault(); scrollTo(href); };

  return (
    <section ref={root} className="hero board" aria-label="Introduction">
      <Traces seed={3} fill={0.72} live />

      <div className="hero-copy">
        <h1>
          <span className="line"><span>{hero.line1}</span></span>
          <span className="line l2"><span>{hero.line2}</span></span>
        </h1>
        <p className="hero-support">{site.description}</p>
        <div className="hero-acts">
          <a ref={cta} className="btn" href="#brief" onClick={jump('#brief')}>{hero.cta}</a>
          <a className="link" href="#projects" onClick={jump('#projects')}>{hero.second}</a>
        </div>
      </div>

      <div className="hero-part">
        <Chip>
          <img src={p.src} srcSet={p.srcSet} sizes="(max-width: 760px) 92vw, 52vw" width={p.width} height={p.height}
            alt={p.alt} fetchPriority="high" decoding="async" />
        </Chip>
        <Silk mark={hero.mark}>{hero.markText}</Silk>
      </div>

      <Parts />
    </section>
  );
}
