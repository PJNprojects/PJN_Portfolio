// Stands in for the Firebase SDK in the single-file preview build only (see vite.config.ts).
const off = () => { throw new Error('Firebase is not available in the preview build'); };
export const getApps = () => [] as unknown[];
export const initializeApp = () => ({});
export const getFirestore = off, collection = off, addDoc = off, serverTimestamp = off, query = off, where = off, getDocs = off;
export const getAuth = off, isSignInWithEmailLink = () => false, signInWithEmailLink = off, onAuthStateChanged = off, sendSignInLinkToEmail = off;
