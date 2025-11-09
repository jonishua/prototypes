# Garden Prototype Hub

A Next.js + Three.js showcase for vaporwave prototypes. The app now lives at the root of this repository and automatically indexes self-contained game folders.

## Getting Started

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` for the landing page and `/hub` for the prototype index.

## Project Structure

- `src/app` — App Router entrypoints for landing, hub, and project detail views.
- `src/components` — UI, audio, and scene components.
- `src/data/projects.ts` — Reads metadata from the filesystem each time the app loads.
- `games/` — Canonical source of truth for every prototype (HTML/JS/CSS + `metadata.json`).
- `public/` — Static assets consumed by Next.js. `npm run sync:games` mirrors `games/` to `public/games/` before builds and dev.
- `docs/` — Additional workflow notes.

## Adding a New Prototype

Create a folder inside `games/` with your slug (e.g. `games/nebula-sprint/`) using this layout:

```
games/nebula-sprint/
  index.html
  game.js (optional)
  style.css (optional)
  thumbnail.jpg
  metadata.json
```

`metadata.json` must include the following fields:

```json
{
  "id": "nebula-sprint",
  "slug": "nebula-sprint",
  "title": "Nebula Sprint",
  "blurb": "Zero-g race through luminescent cloud tunnels.",
  "description": "Long-form copy for the detail page.",
  "ctaLabel": "Play Prototype",
  "ctaHref": "/games/nebula-sprint/index.html",
  "artwork": "/games/nebula-sprint/thumbnail.jpg",
  "tags": ["WebGL", "Arcade"],
  "status": "Playable",
  "order": 4
}
```

Start or restart the dev server (`npm run dev`) or run `npm run sync:games` to refresh the mirrored assets. The hub page and project detail route will automatically pick up the new entry without additional wiring.

## Deployment & Export

- `npm run build` — production bundle (runs `sync:games` beforehand).
- `npm run export` — static export to `out/` (also runs `sync:games`).
- `public/CNAME` — include your custom domain for GitHub Pages or similar static hosting.

After `npm run export`, deploy the contents of `out/` to your static host of choice.

## Audio Notes

Ambient, hover, and click MP3 placeholders still live in `public/audio`. Swap them with your own loops to match the atmosphere or extend the `useAudio` hooks.

For additional context and workflow tips, see `docs/ADDING_PROTOTYPES.md`.

