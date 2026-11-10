import { Link } from 'react-router-dom';
import { footer, site } from '../content/site';
import { useMagnet } from '../lib/useMagnet';
import { Traces } from './board';

/** The close: one invitation, the ways to reach us, the name in silkscreen, and the board's edge connector. */
export default function Footer() {
  const cta = useMagnet<HTMLAnchorElement>();
  return (
    <footer className="foot board">
      <Traces seed={41} fill={0.5} />
      <div className="foot-top">
        <div className="foot-invite">
          <p className="poster">{footer.invite}</p>
          <a ref={cta} className="btn" href={`mailto:${site.email}`}>{footer.button}</a>
        </div>
        <ul className="foot-links">
          <li><a href={`https://wa.me/${site.phone}`} target="_blank" rel="noopener noreferrer">WhatsApp {site.phoneShown}</a></li>
          <li><a href={`mailto:${site.email}`}>{site.email}</a></li>
          {site.social.map((s) => <li key={s.label}><a href={s.href} rel="noopener">{s.label}</a></li>)}
          <li><Link to="/portal">Client sign-in</Link></li>
        </ul>
      </div>
      <div className="foot-legal">
        <span>{footer.place}</span>
        <span>{footer.rev} · {footer.legal}</span>
      </div>
      {/* The name, fitted to the width by measurement. */}
      <svg className="foot-mark" viewBox="0 0 1200 132" aria-hidden="true" focusable="false">
        <text x="0" y="118" textLength="1200" lengthAdjust="spacingAndGlyphs">{site.name.toUpperCase()}</text>
      </svg>
      <div className="fingers" aria-hidden="true" />
    </footer>
  );
}
