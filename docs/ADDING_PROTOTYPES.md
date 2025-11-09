# Adding a Prototype Pod

The hub now indexes prototypes directly from the `games/` directory. Each prototype is a self-contained folder that ships with the repository.

## 1. Create a Game Folder

Inside `games/`, add a new directory that matches your desired slug:

```
games/nebula-sprint/
  index.html
  game.js
  style.css
  thumbnail.jpg
  metadata.json
```

Static assets can be organised however you like inside the folder (subdirectories for sprites, audio, etc.). Everything under `games/` will be mirrored to `public/games/` during dev/build.

## 2. Define Metadata

Populate `metadata.json` so the hub can surface the project:

```json
{
  "id": "nebula-sprint",
  "slug": "nebula-sprint",
  "title": "Nebula Sprint",
  "blurb": "Zero-g race through luminescent cloud tunnels.",
  "description": "Long-form detail copy for the project view.",
  "ctaLabel": "Play Prototype",
  "ctaHref": "/games/nebula-sprint/index.html",
  "artwork": "/games/nebula-sprint/thumbnail.jpg",
  "tags": ["WebGL", "Arcade"],
  "status": "Playable",
  "order": 4
}
```

- `slug` maps to the `/projects/[slug]` route.
- `ctaHref` should point to the exported HTML inside the mirrored folder.
- `order` controls gallery ordering (lower numbers appear first).

## 3. Sync Assets

Run one of the following to mirror `games/` into `public/games/`:

```bash
npm run sync:games  # ad-hoc sync
npm run dev         # predev hook syncs automatically
npm run build       # prebuild hook syncs automatically
npm run export      # preexport hook syncs automatically
```

During development you can re-run `npm run sync:games` whenever you add or remove files.

## 4. Verify

1. `npm run dev` and open `/hub` to see the new prototype.
2. Launch the CTA (`Play Prototype`) to confirm the HTML bundle loads.
3. Visit `/projects/<slug>` for the detail view, tags, and copy.
4. Run `npm run lint` before committing.

No additional React wiring is required—metadata drives the hub layout and page generation automatically.

