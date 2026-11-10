import { useLayoutEffect, useRef } from 'react';
import { hero, site } from '../content/site';
import { gsap, hasFinePointer, prefersReducedMotion, scrollTo } from '../lib/scroll';
import { useMagnet } from '../lib/useMagnet';

/**
 * First screen as a poster: "Idea in." top left, "Device out." bottom right, the device between
 * them. The picture drifts with the pointer and sinks away as the page scrolls.
 */
export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const cta = useMagnet<HTMLAnchorElement>();

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      // Scroll: the picture sinks and the two halves of the headline pull apart.
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
      });
      tl.to(q('.hero-pic'), { yPercent: 14, scale: 1.08 }, 0)
        .to(q('.l1'), { xPercent: -6 }, 0)
        .to(q('.l2'), { xPercent: 6 }, 0)
        .to(q('.hero-sticker'), { yPercent: -60 }, 0);
    }, el);

    // Pointer: the device leans a few pixels toward the cursor.
    let off = () => {};
    if (hasFinePointer()) {
      const img = el.querySelector<HTMLElement>('.hero-pic img');
      if (img) {
        const x = gsap.quickTo(img, 'x', { duration: 0.9, ease: 'power3.out' });
        const y = gsap.quickTo(img, 'y', { duration: 0.9, ease: 'power3.out' });
        const move = (e: PointerEvent) => {
          x((e.clientX / window.innerWidth - 0.5) * -28);
          y((e.clientY / window.innerHeight - 0.5) * -18);
        };
        el.addEventListener('pointermove', move);
        off = () => el.removeEventListener('pointermove', move);
      }
    }
    return () => { off(); ctx.revert(); };
  }, []);

  const p = hero.picture;
  const jump = (href: string) => (e: React.MouseEvent) => { e.preventDefault(); scrollTo(href); };

  return (
    <section ref={root} className="hero" aria-label="Introduction">
      <div className="hero-pic">
        <img src={p.src} srcSet={p.srcSet} sizes="(max-width: 760px) 100vw, 112vw" width={p.width} height={p.height}
          alt={p.alt} fetchPriority="high" decoding="async" />
      </div>

      <div className="hero-top">
        <h1>
          <span className="line l1"><span>{hero.line1}</span></span>
          <span className="line l2"><span>{hero.line2}</span></span>
        </h1>
        <p className="hero-support">{site.description}</p>
        <div className="hero-acts">
          <a ref={cta} className="btn" href="#brief" onClick={jump('#brief')}>{hero.cta}</a>
          <a className="link" href="#work" onClick={jump('#work')}>{hero.second}</a>
        </div>
      </div>

      <a className="hero-sticker" href="#work" onClick={jump('#work')} aria-label="Scroll down to see the collar taken apart">
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <defs><path id="sticker-ring" d="M60 60 m-44 0 a44 44 0 1 1 88 0 a44 44 0 1 1 -88 0" /></defs>
          <circle cx="60" cy="60" r="60" className="disc" />
          <g className="ring">
            <text><textPath href="#sticker-ring" textLength="270" lengthAdjust="spacing">{hero.sticker}</textPath></text>
          </g>
          <path className="arrow" d="M60 42v32M47 62l13 13 13-13" />
        </svg>
      </a>
    </section>
  );
}
