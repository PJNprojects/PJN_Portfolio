import { useLayoutEffect, useRef, useState } from 'react';
import Nav from './Nav';
import DeviceDrawing from './DeviceDrawing';
import { hero, site } from '../content/site';
import { gsap, ScrollTrigger, prefersReducedMotion, scrollTo, isTouch } from '../lib/scroll';

/**
 * The hero is a scroll scene: the stage holds still for three screens while the device is
 * sketched, filled and closed. Without script or with reduced motion it is an ordinary first
 * screen showing the finished composition.
 */
export default function Hero() {
  const scene = useRef<HTMLElement>(null);
  // Decided before the first paint so the scene's height is right when ScrollTrigger measures it.
  const [live] = useState(() => !prefersReducedMotion());

  useLayoutEffect(() => {
    const root = scene.current;
    if (!root || !live) return;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);
      const parts = q<SVGGElement>('.part');
      const sk = q<SVGGeometryElement>('.sk');
      const ink = q<SVGElement>('.ink');
      const caps = q<HTMLElement>('.captions p');

      gsap.set(sk, { drawSVG: '0%' });

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom bottom',
          scrub: isTouch() ? true : 0.5,
          invalidateOnRefresh: true,
        },
      });

      // 0–0.10: the first statement and its support step aside
      tl.to(q('.l1, .support, .cue'), { opacity: 0, y: -20, duration: 0.1 }, 0);

      // 0.08–0.42: the sketch is drawn, one part after another
      tl.to(sk, { drawSVG: '100%', duration: 0.26, stagger: { each: 0.012, from: 'end' } }, 0.08);
      tl.to(caps[0], { opacity: 1, duration: 0.05 }, 0.12).to(caps[0], { opacity: 0, duration: 0.05 }, 0.38);

      // 0.42–0.58: the drawing fills in
      tl.to(ink, { fillOpacity: 1, strokeOpacity: 1, duration: 0.12 }, 0.42);
      tl.to(sk, { opacity: 0, duration: 0.08 }, 0.48);
      tl.to(caps[1], { opacity: 1, duration: 0.05 }, 0.45).to(caps[1], { opacity: 0, duration: 0.05 }, 0.70);

      // 0.60–0.85: the parts close into one device
      tl.to(parts, {
        y: (_i, el) => Number((el as SVGGElement).dataset.y || 0),
        duration: 0.25,
        ease: 'power2.inOut',
      }, 0.60);

      // 0.78–1: the finished device, and the statement completed
      tl.to(caps[2], { opacity: 1, duration: 0.06 }, 0.78);
      tl.to(q('.l1'), { opacity: 1, y: 0, duration: 0.1 }, 0.86);
      tl.to(q('.l2'), { opacity: 1, y: 0, duration: 0.1 }, 0.9);
    }, root);

    ScrollTrigger.refresh();
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => ctx.revert();
  }, [live]);

  return (
    <section ref={scene} className={'scene' + (live ? ' live' : '')} aria-label="Introduction">
      <div className="stage">
        <Nav />
        <div className="stage-mid">
          <h1>
            <span className="l1">{hero.line1}</span>
            <span className="l2">{hero.line2}</span>
          </h1>
          <div className="device">
            <DeviceDrawing id="hero-device" />
          </div>
        </div>
        <div className="stage-foot">
          <p className="support">{site.description}</p>
          <div className="captions" aria-hidden="true">
            {hero.captions.map((c) => <p key={c}>{c}</p>)}
          </div>
          <a className="btn" href="#brief" onClick={(e) => { e.preventDefault(); scrollTo('#brief'); }}>{hero.cta}</a>
          <p className="cue">{hero.scrollCue}</p>
        </div>
      </div>
    </section>
  );
}
