import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { fileURLToPath } from 'node:url';

// The preview never talks to Firebase, so its bundle swaps the SDK for a tiny stub.
const stub = fileURLToPath(new URL('./src/lib/firebase-stub.ts', import.meta.url));

// `npm run build`          → dist/          (deploy this to Cloudflare Pages or Netlify)
// `npm run build:preview`  → dist-preview/  (index.html with the code inlined, plus the media folder;
//                                            opens straight from disk, for sharing a preview)
export default defineConfig(({ mode }) => ({
  base: mode === 'preview' ? './' : '/',
  plugins: [react(), ...(mode === 'preview' ? [viteSingleFile()] : [])],
  resolve: mode === 'preview' ? { alias: { 'firebase/app': stub, 'firebase/auth': stub, 'firebase/firestore': stub } } : {},
  build: mode === 'preview' ? { outDir: 'dist-preview' } : { outDir: 'dist', sourcemap: false },
}));
