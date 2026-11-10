import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const matches = (query: string) => typeof window !== 'undefined' && window.matchMedia(query).matches;

export const prefersReducedMotion = () => matches('(prefers-reduced-motion: reduce)');
export const isTouch = () => matches('(hover: none), (pointer: coarse)');
/** A mouse or trackpad: hover effects and pointer-follow are only worth running here. */
export const hasFinePointer = () => matches('(hover: hover) and (pointer: fine)');

let lenis: Lenis | null = null;

/** Weighted wheel scrolling on desktop only. Touch and reduced motion keep native scroll. */
export function startSmoothScroll() {
  if (lenis || prefersReducedMotion() || isTouch()) return;
  lenis = new Lenis({ lerp: 0.12, autoRaf: false });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis?.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

/** Scroll to a selector or an element. Sections carry their own top padding, so they land at the top. */
export function scrollTo(target: string | Element) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return;
  if (lenis) lenis.scrollTo(el as HTMLElement);
  else el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
}

/** Jump to the top of the page at once (used when the route changes). */
export function resetScroll() {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
  window.scrollTo(0, 0);
}

export { gsap, ScrollTrigger };
