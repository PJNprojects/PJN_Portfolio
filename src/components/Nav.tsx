import { Link } from 'react-router-dom';
import { site } from '../content/site';
import { scrollTo } from '../lib/scroll';

export default function Nav({ onHome = true }: { onHome?: boolean }) {
  return (
    <div className="top">
      <Link className="wordmark" to="/">{site.name}</Link>
      <nav aria-label="Sections">
        {site.nav.map((n) =>
          onHome ? (
            <a key={n.href} href={n.href} onClick={(e) => { e.preventDefault(); scrollTo(n.href); }}>{n.label}</a>
          ) : (
            <Link key={n.href} to={'/' + n.href}>{n.label}</Link>
          ),
        )}
      </nav>
    </div>
  );
}
