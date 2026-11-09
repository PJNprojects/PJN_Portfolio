// Firebase is optional. Without VITE_FIREBASE_* in .env the site still builds and runs:
// the brief builder opens the visitor's mail app and /portal shows a coming-soon note.
import { getApps, initializeApp, type FirebaseApp } from 'firebase/app';

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
};

export const hasFirebase = Boolean(config.apiKey && config.projectId && config.appId);

export function firebaseApp(): FirebaseApp {
  return getApps()[0] ?? initializeApp(config);
}

/** Save a brief from the contact section. Returns false when Firebase isn't configured. */
export async function saveBrief(data: { have: string; needs: string[]; line: string; text: string }) {
  if (!hasFirebase) return false;
  const { getFirestore, collection, addDoc, serverTimestamp } = await import('firebase/firestore');
  await addDoc(collection(getFirestore(firebaseApp()), 'briefs'), {
    ...data,
    createdAt: serverTimestamp(),
    source: typeof location !== 'undefined' ? location.href : '',
  });
  return true;
}
