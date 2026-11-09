import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from './scroll';

/** Marks a block's children to arrive in reading order the first time it scrolls into view. */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    Array.from(el.children).forEach((c, i) => (c as HTMLElement).style.setProperty('--i', String(i)));
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      el.classList.add('in');
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { el.classList.add('in'); io.disconnect(); } }),
      { rootMargin: '0px 0px -12% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}
