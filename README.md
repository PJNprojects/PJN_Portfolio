# Panchajanyam — portfolio site and client portal

Vite + React + TypeScript. GSAP for the scroll-driven parts, Lenis for weighted scrolling on
desktop, Firebase (optional, loaded only when used) for the brief inbox and the client portal.
Deploys as a static site.

## Run it

```bash
npm install        # needed once after pulling: the typeface is now an npm package
npm run dev        # http://localhost:5173
npm run build      # → dist/  (this is what gets deployed)
npm run typecheck
```

## What is on the page

| Section | What it does | File |
| --- | --- | --- |
| Hero | "Idea in. Device out." with the enclosure between the two lines; the picture follows the pointer and sinks on scroll | `src/components/Hero.tsx` |
| Marquee | Band of capabilities that speeds up with the scroll | `src/components/Marquee.tsx` |
| Work | The teardown: a frame that holds while each part of the collar passes (swipeable cards on a phone) | `src/components/Work.tsx` |
| Lab | A working model of tuning the reader antenna, drawn live on a canvas | `src/components/Lab.tsx` |
| Film | The explainer video with chapter buttons; plays only while on screen | `src/components/Film.tsx` |
| Process | Four stages that open one at a time | `src/components/Process.tsx` |
| About | What the client brings, what we bring, and the name | `src/components/About.tsx` |
| Brief | Tap-to-write brief that opens the visitor's mail app (or saves to Firebase) | `src/components/Brief.tsx` |
| Portal | Client sign-in at `/portal` (coming-soon note until Firebase is configured) | `src/pages/Portal.tsx` |

Every word and every picture reference lives in `src/content/site.ts`. Colours, type sizes and
spacing are the tokens at the top of `src/styles/global.css`.

## Photos and video

The site reads its media from `public/media/`. To replace a picture, export the new one under the
same file names and it is picked up with no code change. See `public/media/README.md` for the
sizes and the exact commands.

The untouched originals are in `media-originals/`, which git ignores (the raw video is 221 MB and
GitHub refuses files over 100 MB). Keep originals there, never under `src/` or `public/`.

## Deploy (no domain needed yet)

**Cloudflare Pages** — Workers & Pages → Create → Pages → connect this GitHub repo.
Build command `npm run build`, output directory `dist`. Add the `VITE_FIREBASE_*` variables under
Settings → Environment variables when the backend exists. `public/_redirects` is already set so
`/portal` works on refresh.

**Netlify** — Add new site → Import from Git → this repo. `netlify.toml` already has the build
command, publish directory and the SPA redirect.

Either one gives a `*.pages.dev` / `*.netlify.app` address until the real domain is bought. When
there is a domain, make the `og:image` address in `index.html` absolute (`https://your-domain/media/og.jpg`)
so link previews on WhatsApp and LinkedIn show the picture.

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

- Replace the studio renders and the concept animation with real photographs and bench footage.
- Confirm the timings in `process.stages` (`site.ts`); they are typical values, not promises.
- Confirm every claim in `work.steps` with the team, and with Markwave that the collar may be shown.
- Add the LinkedIn and Instagram links to `site.social` (nothing is shown while it is empty).
- Keep client work described by what it does, never by the parts inside it (NDA).

## Preview without deploying

`npm run build:preview` writes `dist-preview/` — an `index.html` with the code inlined plus the
`media` folder. Open the HTML straight from disk or zip the folder to share it (Firebase is
stubbed out in that build).
