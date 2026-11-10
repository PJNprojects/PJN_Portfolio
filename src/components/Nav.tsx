import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { site } from '../content/site';
import { scrollTo } from '../lib/scroll';

/**
 * Top bar: wordmark, section links, one action. It steps out of the way while the visitor scrolls
 * down and returns on the way up. On a phone the links open as a full-screen sheet.
 */
export default function Nav({ onHome = true }: { onHome?: boolean }) {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    let queued = false;
    const read = () => {
      queued = false;
      const y = window.scrollY;
      setSolid(y > 24);
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > 160);
        last = y;
      }
    };
    const onScroll = () => { if (!queued) { queued = true; requestAnimationFrame(read); } };
    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // The open sheet owns the screen: lock the page behind it and close on Escape.
  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const go = (href: string) => (e: React.MouseEvent) => {
    setOpen(false);
    if (!onHome) return; // a real navigation to /#section
    e.preventDefault();
    // Wait a frame so the sheet has released the scroll lock.
    requestAnimationFrame(() => scrollTo(href));
  };

  const item = (n: { label: string; href: string }, className?: string) =>
    onHome ? (
      <a key={n.href} className={className} href={n.href} onClick={go(n.href)}>{n.label}</a>
    ) : (
      <Link key={n.href} className={className} to={'/' + n.href} onClick={() => setOpen(false)}>{n.label}</Link>
    );

  const state = (hidden && !open ? ' is-hidden' : '') + (solid || open ? ' is-solid' : '') + (open ? ' is-open' : '');

  return (
    <header className={'bar' + state}>
      <Link className="wordmark" to="/" onClick={() => { setOpen(false); if (onHome) window.scrollTo({ top: 0 }); }}>
        {site.name}
      </Link>
      <nav className="bar-links" aria-label="Sections">
        {site.nav.map((n) => item(n))}
      </nav>
      {item(site.cta, 'btn btn-small bar-cta')}
      <button
        type="button"
        className="bar-menu"
        aria-expanded={open}
        aria-controls="menu-sheet"
        onClick={() => setOpen(!open)}
      >
        {open ? 'Close' : 'Menu'}
      </button>
      <div className="sheet" id="menu-sheet" hidden={!open}>
        <nav aria-label="Menu">
          {site.nav.map((n) => item(n))}
          {item(site.cta, 'sheet-cta')}
        </nav>
        <a className="sheet-mail" href={`mailto:${site.email}`}>{site.email}</a>
      </div>
    </header>
  );
}
