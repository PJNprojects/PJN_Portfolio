import { useLayoutEffect, useRef } from 'react';
import { marquee } from '../content/site';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/scroll';

/** A band of what we do that never stops, and runs faster the harder the page is scrolled. */
export default function Marquee() {
  const track = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = track.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const loop = gsap.to(el, { xPercent: -50, duration: 36, ease: 'none', repeat: -1 });
      ScrollTrigger.create({
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const boost = Math.min(Math.abs(self.getVelocity()) / 350, 6);
          loop.timeScale(1 + boost);
          gsap.to(loop, { timeScale: 1, duration: 0.8, ease: 'power2.out', overwrite: true });
        },
        onToggle: (self) => (self.isActive ? loop.play() : loop.pause()),
      });
    });
    return () => ctx.revert();
  }, []);

  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined}>
      {marquee.map((m) => <li key={m}>{m}</li>)}
    </ul>
  );

  return (
    <div className="marquee" role="group" aria-label="What we do">
      <div className="marquee-track" ref={track}>
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
