import { useEffect, useState } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { hasFirebase, firebaseApp } from '../lib/firebase';

type Project = { id: string; name: string; stage: string; lastUpdate?: string };

/**
 * Client portal, first version. Sign in by email link (no password); then list the projects
 * whose `clientEmail` matches. Until Firebase is configured it shows a coming-soon note.
 *
 * Firestore shape, for the admin side:
 *   projects/{id}: { name, clientEmail, stage: 'brief' | 'design' | 'prototype' | 'production', lastUpdate }
 *   briefs/{id}:   written by the site's brief builder
 */
export default function Portal() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [user, setUser] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (!hasFirebase) return;
    (async () => {
      const { getAuth, isSignInWithEmailLink, signInWithEmailLink, onAuthStateChanged } = await import('firebase/auth');
      const auth = getAuth(firebaseApp());
      if (isSignInWithEmailLink(auth, window.location.href)) {
        const saved = window.localStorage.getItem('pjn-signin-email') || window.prompt('Confirm your email to finish signing in') || '';
        try {
          await signInWithEmailLink(auth, saved, window.location.href);
          window.localStorage.removeItem('pjn-signin-email');
          history.replaceState(null, '', '/portal');
        } catch {
          setStatus('That link has expired. Ask for a new one below.');
        }
      }
      onAuthStateChanged(auth, async (u) => {
        setUser(u?.email ?? null);
        if (!u?.email) return;
        const { getFirestore, collection, query, where, getDocs } = await import('firebase/firestore');
        const snap = await getDocs(query(collection(getFirestore(firebaseApp()), 'projects'), where('clientEmail', '==', u.email)));
        setProjects(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Project, 'id'>) })));
      });
    })();
  }, []);

  async function sendLink(e: React.FormEvent) {
    e.preventDefault();
    const { getAuth, sendSignInLinkToEmail } = await import('firebase/auth');
    try {
      await sendSignInLinkToEmail(getAuth(firebaseApp()), email, { url: window.location.origin + '/portal', handleCodeInApp: true });
      window.localStorage.setItem('pjn-signin-email', email);
      setStatus('Check your mail for a sign-in link.');
    } catch {
      setStatus('That address isn’t on a project yet. Write to us and we’ll add it.');
    }
  }

  async function signOut() {
    const { getAuth } = await import('firebase/auth');
    await getAuth(firebaseApp()).signOut();
    setProjects([]);
  }

  return (
    <>
      <main>
        <Nav onHome={false} />
        <section className="portal">
          <h1 className="poster">Your project</h1>
          {!hasFirebase && (
            <p className="lead">Client sign-in opens here once the backend is connected. Until then, project updates come by phone and mail.</p>
          )}
          {hasFirebase && !user && (
            <>
              <p className="lead">Sign in with the email we have for you. No password: we send a link.</p>
              <form onSubmit={sendLink} className="line">
                <label htmlFor="portal-email">Email</label>
                <input id="portal-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                <button className="btn" type="submit">Send me a link</button>
              </form>
            </>
          )}
          {hasFirebase && user && (
            <>
              <p className="lead">Signed in as {user}.</p>
              <ul className="projects">
                {projects.length === 0 && <li>No project is on this address yet.</li>}
                {projects.map((p) => (
                  <li key={p.id}>
                    <p>{p.name}</p>
                    <p className="stage-name">Stage: {p.stage}{p.lastUpdate ? ` · ${p.lastUpdate}` : ''}</p>
                  </li>
                ))}
              </ul>
              <button className="btn" type="button" onClick={signOut}>Sign out</button>
            </>
          )}
          {status && <p className="status">{status}</p>}
        </section>
      </main>
      <Footer />
    </>
  );
}
