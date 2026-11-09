# Panchajanyam — portfolio site and client portal

Vite + React + TypeScript. GSAP for the scroll scenes, Lenis for weighted scrolling on desktop,
Firebase (optional) for the brief inbox and the client portal. Deploys as a static site.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # → dist/  (this is what gets deployed)
npm run typecheck
```

## Deploy (no domain needed yet)

**Cloudflare Pages** — Workers & Pages → Create → Pages → connect this GitHub repo.
Build command `npm run build`, output directory `dist`. Add the `VITE_FIREBASE_*` variables under
Settings → Environment variables when the backend exists. `public/_redirects` is already set so
`/portal` works on refresh.

**Netlify** — Add new site → Import from Git → this repo. `netlify.toml` already has the build
command, publish directory and the SPA redirect.

Either one gives a `*.pages.dev` / `*.netlify.app` address until the real domain is bought.

## Where things live

| What | Where |
| --- | --- |
| Every word on the site | `src/content/site.ts` |
| Colours, type, spacing | `src/styles/global.css` (tokens at the top) |
| Hero scroll scene (sketch → fill → close) | `src/components/Hero.tsx` + `DeviceDrawing.tsx` |
| Brief builder (quote form) | `src/components/Brief.tsx` |
| Client portal | `src/pages/Portal.tsx` |
| Firebase setup | `src/lib/firebase.ts`, `.env.example` |
| Photos and video | `public/media/` (see the README there) |

## Firebase (when ready)

1. Create a project, add a Web app, enable **Authentication → Email link (passwordless)** and
   **Firestore**.
2. Copy `.env.example` to `.env` and fill it in (also add the same variables to the host).
3. The brief builder then saves to the `briefs` collection instead of opening mail.
   The portal signs clients in by email link and lists `projects` where `clientEmail` matches.

Firestore shape:

```
briefs/{id}    { have, needs[], line, text, createdAt, source }
projects/{id}  { name, clientEmail, stage: 'brief'|'design'|'prototype'|'production', lastUpdate }
```

Suggested rules: anyone may create a brief; only a signed-in user may read projects where
`clientEmail == request.auth.token.email`; writes to `projects` only from the Firebase console
or an admin page (not built yet).

## Before launch

- Replace the drawings with real photographs and a short bench clip (`public/media/`).
- Confirm the timings on the project slip (`process.groups` in `site.ts`) — they are samples.
- Fill in the LinkedIn and Instagram links (`site.social`).
- Keep client work described by what it does, never by the parts inside it (NDA).

## Preview without deploying

`npm run build:preview` writes one self-contained `dist-preview/index.html` that can be opened or
shared anywhere (Firebase is stubbed out in that build).
