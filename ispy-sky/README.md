# iSpySky — The Cloud Arcade

Next.js + Three.js portfolio hub for showcasing experimental prototypes from the sky.

## Getting Started

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to explore the hero landing and `/hub` for the interactive sky arcade.

## Project Structure

- `src/app` — App Router pages: landing, hub, and project detail routes.
- `src/components` — UI, audio, and Three.js scene components.
- `src/data/projects.ts` — Single source of truth for all prototype metadata.
- `public/media` & `public/audio` — Drop video loops, posters, and soundscapes.

## Adding a New Prototype

1. Add media assets to `public/media` (video, gif, or image) and optional CTA targets.
2. Update `src/data/projects.ts` with a new object (see in-file typing).
3. `npm run lint` ensures type coverage; the hub and detail routes render the new entry automatically.

See `docs/ADDING_PROTOTYPES.md` for extended guidance.

## Deployment

The repo is configured for Vercel/Netlify:

- `npm run build` generates the production bundle.
- Set `NEXT_PUBLIC_` environment variables if needed for future integrations.
- Enable static file caching for `/media` and `/audio`.

## Audio Notes

Ambient wind, hover bell, and vapor click MP3 placeholders are expected under `public/audio`. Replace with your own loops to match the atmosphere.

