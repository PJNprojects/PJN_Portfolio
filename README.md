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

## What is on the site

The whole site is drawn as a circuit board: solder mask, copper traces, gold pads, white
silkscreen, IC packages, and real parts used as controls.

| Where | What it does | File |
| --- | --- | --- |
| Hero | "Idea in. Device out." beside the enclosure mounted as an IC; live traces; a row of parts (the resistor bands and the crystal both read 133) | `src/components/Hero.tsx` |
| Tape | Capabilities as parts on a reel of carrier tape; speeds up with the scroll | `src/components/Marquee.tsx` |
| Projects | **The gate.** Turn the knob until the coil resonates at a project's frequency (Markwave: 133.33 kHz); the carrier locks and the project page opens | `src/components/Tuner.tsx` |
| Process | Four chips in a breadboard; picking one shows its datasheet | `src/components/Process.tsx` |
| About | The deal as a pinout: what goes in, what comes out | `src/components/About.tsx` |
| Brief | Switches for what you have and need; the brief is written on an LCD and mailed (or saved to Firebase) | `src/components/Brief.tsx` |
| `/markwave` | The project page: teardown in IC frames, then the film on an LCD module sized to fit the window | `src/pages/Markwave.tsx`, `Work.tsx`, `Film.tsx` |
| `/portal` | Client sign-in (coming-soon note until Firebase is configured) | `src/pages/Portal.tsx` |

Shared board parts (traces, IC package, silkscreen label, seven-segment display, the parts row)
are in `src/components/board.tsx`. Every word and picture reference lives in
`src/content/site.ts`. Materials (colours), type sizes and spacing are the tokens at the top of
`src/styles/global.css`.

### How the gate behaves

- The knob can be dragged with a mouse or a thumb and turned with the arrow keys.
- "Auto-tune" sweeps to the frequency for anyone who would rather watch.
- A project opened once stays open for the rest of the visit (shown as "Open" in the channel list).
- `/markwave` also opens from its own address, so the link can be sent to a client directly.

### Adding the next project

1. Add it to `projects` in `site.ts` with a free frequency between 100 and 170 kHz. It appears on
   the dial and in the channel list at once.
2. Add its page under `src/pages/` and its route in `src/App.tsx`.

## Photos and video

The site reads its media from `public/media/`. To replace a picture, export the new one under the
same file names and it is picked up with no code change. See `public/media/README.md` for the
sizes and the exact commands.

The untouched originals are in `media-originals/`, which git ignores (the raw video is 221 MB and
GitHub refuses files over 100 MB). Keep originals there, never under `src/` or `public/`.

## Deploy on Firebase Hosting (free plan)

The address is `<project-id>.web.app`, so the project ID is the site's name. `.firebaserc` assumes
`pjn-projects`; IDs are unique across all of Firebase, so if that one is taken pick another
(`panchajanyam`, `pjn-studio`, …) and put the same ID in `.firebaserc`.

```bash
# once
npm install -g firebase-tools
firebase login                 # opens the browser; sign in with the studio's Google account
# in the Firebase console: Add project, give it the ID from .firebaserc, then Build → Hosting → Get started

# every release
npm run build
firebase deploy --only hosting
```

`firebase.json` already serves `dist/`, sends every address to the app (so `/markwave` and
`/portal` work on refresh) and sets cache headers. When a real domain is bought, add it under
Hosting → Add custom domain; the certificate is issued automatically. Then make the `og:image`
address in `index.html` absolute so link previews show the picture.

`netlify.toml` and `public/_redirects` are still here, so the same repo also deploys on Netlify
or Cloudflare Pages if needed.

## Contact channels

The brief can be sent on WhatsApp (click-to-chat to `site.phone` in `site.ts`, with the brief
typed in) or by email. A "save our number" link downloads a contact card. Neither needs a backend.

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
- Decide whether the tuning gate stays the only way into a project from the home page (see "How the gate behaves").
- Confirm the timings in `process.stages` (`site.ts`); they are typical values, not promises.
- Confirm every claim in `work.steps` with the team, and with Markwave that the collar may be shown.
- Add the LinkedIn and Instagram links to `site.social` (nothing is shown while it is empty).
- Keep client work described by what it does, never by the parts inside it (NDA).

## Preview without deploying

`npm run build:preview` writes `dist-preview/` — an `index.html` with the code inlined plus the
`media` folder. Open the HTML straight from disk or zip the folder to share it (Firebase is
stubbed out in that build).
