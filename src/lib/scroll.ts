import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const isTouch = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: none), (pointer: coarse)').matches;

let lenis: Lenis | null = null;

/** Weighted wheel scrolling on desktop only. Touch and reduced motion keep native scroll. */
export function startSmoothScroll() {
  if (lenis || prefersReducedMotion() || isTouch()) return;
  lenis = new Lenis({ lerp: 0.12, autoRaf: false });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis?.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

export function scrollTo(target: string) {
  const el = document.querySelector(target);
  if (!el) return;
  if (lenis) lenis.scrollTo(el as HTMLElement);
  else el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
}

export { gsap, ScrollTrigger };
