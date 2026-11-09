import { Link } from 'react-router-dom';
import { footer, site } from '../content/site';

export default function Footer() {
  return (
    <footer>
      <div className="cols">
        <div><ul><li>{site.name}</li><li>Embedded engineering studio</li><li>India</li></ul></div>
        <div><ul>
          <li>On this page</li>
          <li><a href="#work">Work</a></li>
          <li><a href="#process">Process</a></li>
          <li><a href="#capabilities">What we do</a></li>
          <li><a href="#about">Why the name</a></li>
          <li><a href="#brief">Tell us your idea</a></li>
        </ul></div>
        <div><ul>
          <li>Elsewhere</li>
          {site.social.map((s) => <li key={s.label}><a href={s.href}>{s.label}</a></li>)}
        </ul></div>
        <div><ul>
          <li>Write to us</li>
          <li><a href={`mailto:${site.email}`}>{site.email}</a></li>
          <li><Link to="/portal">Client sign-in</Link></li>
        </ul></div>
      </div>
      <div />
      <div>
        <div className="mark" aria-hidden="true">
          <svg viewBox="0 0 1110 200" preserveAspectRatio="none">
            <text x="0" y="160" fontSize="190" textLength="1110" lengthAdjust="spacingAndGlyphs">{site.name}</text>
          </svg>
        </div>
        <p className="legal">{footer.legal}</p>
      </div>
    </footer>
  );
}
