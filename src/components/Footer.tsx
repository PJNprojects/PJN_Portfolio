import { Link } from 'react-router-dom';
import { footer, site } from '../content/site';
import { useMagnet } from '../lib/useMagnet';

/** The close: one invitation, the ways to reach us, and the name too large for the screen. */
export default function Footer() {
  const cta = useMagnet<HTMLAnchorElement>();
  return (
    <footer className="foot">
      <div className="foot-top">
        <div className="foot-invite">
          <p className="poster">{footer.invite}</p>
          <a ref={cta} className="btn btn-ink" href={`mailto:${site.email}`}>{footer.button}</a>
        </div>
        <ul className="foot-links">
          <li><a href={`mailto:${site.email}`}>{site.email}</a></li>
          {site.social.map((s) => <li key={s.label}><a href={s.href} rel="noopener">{s.label}</a></li>)}
          <li><Link to="/portal">Client sign-in</Link></li>
        </ul>
      </div>
      <div className="foot-legal">
        <span>{footer.place}</span>
        <span>{footer.legal}</span>
      </div>
      {/* The name, fitted to the width by measurement and cut by the bottom edge on purpose. */}
      <svg className="foot-mark" viewBox="0 0 1200 196" aria-hidden="true" focusable="false">
        <text x="0" y="222" textLength="1200" lengthAdjust="spacingAndGlyphs">{site.name}</text>
      </svg>
    </footer>
  );
}
