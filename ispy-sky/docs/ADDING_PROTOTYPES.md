# Adding a Prototype Pod

All hub islands and project detail pages are driven by `src/data/projects.ts`. Adding a new world requires only a data entry plus its media assets.

## 1. Drop Media Assets

1. Place hero video, GIF, or image files in `public/media`.
2. Optional: add project-specific audio or embeds in `public/media/<project-id>/`.
3. Update the `media` field in your data object to match the public path (e.g. `/media/nebula-sprint.mp4`).

## 2. Update the Data Source

Open `src/data/projects.ts` and append a new object that matches `ProjectEntry`:

```ts
{
  id: "nebula-sprint",
  slug: "nebula-sprint",
  title: "Nebula Sprint",
  blurb: "Zero-g race through luminescent cloud tunnels.",
  description: "A longer-form blurb for the detail view.",
  ctaLabel: "Play Prototype",
  ctaHref: "https://example.com",
  media: "/media/nebula-sprint.mp4",
  tags: ["WebGL", "Arcade"],
  status: "Playable"
}
```

- `slug` is used for the `/projects/[slug]` route.
- `ctaHref` can be an internal path (`/hub`) or an external URL.
- `status` is a union type. Extend `ProjectStatus` if you need new states.

## 3. Optional Audio Overrides

Drop custom loops or SFX into `public/audio/<project-id>/`. Use the `useAudio` hook (e.g. inside a future `ProjectExperience` component) to trigger them conditionally.

## 4. Verify

1. `npm run dev` and open `/hub` to see the new island spawn automatically.
2. Click the CTA and `View Detail` to confirm routing.
3. Run `npm run lint` before committing.

That’s it — no scene wiring required. The generator positions new pods evenly along the orbital ring.

