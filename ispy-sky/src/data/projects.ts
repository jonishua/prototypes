export type ProjectStatus = "Playable" | "Coming Soon" | "In Pre-Production";

export type ProjectEntry = {
  id: string;
  slug: string;
  title: string;
  blurb: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  artwork: string;
  tags: string[];
  status: ProjectStatus;
};

export const projects: ProjectEntry[] = [
  {
    id: "idle-garden",
    slug: "idle-garden",
    title: "Idle Garden",
    blurb: "Relaxed incremental gardening sim built for web.",
    description:
      "Cultivate a serene pocket world where time is your ally. Idle Garden blends incremental systems with lush micro-interactions, letting players coax bioluminescent flora to life while the vaporwave skyline drifts overhead.",
    ctaLabel: "Play Prototype",
    ctaHref: "/idle-garden/index.html",
    artwork: "/media/idle-garden-reborn.jpg",
    tags: ["WebGL", "Cursor AI", "Incremental"],
    status: "Playable"
  },
  {
    id: "gold-mine",
    slug: "gold-mine",
    title: "Gold Mine Tycoon",
    blurb: "Mining management loop with cascading upgrades.",
    description:
      "Drill deep into neon-veined caverns and orchestrate a cascade of autonomous rigs. Gold Mine Tycoon explores tactile automation, resource alchemy, and synth-forward UI design for stratified empire building.",
    ctaLabel: "Play Prototype",
    ctaHref: "/gold-mine/index.html",
    artwork: "/media/gold-mine-tycoon.jpg",
    tags: ["Prototype", "Economy"],
    status: "Playable"
  },
  {
    id: "mafia-syndicate",
    slug: "mafia-syndicate",
    title: "Mafia Syndicate",
    blurb: "Narrative-driven strategy set in a neon-noir city.",
    description:
      "An orchestration of influence, loyalty, and neon-lit intrigue. Mafia Syndicate experiments with branching timelines, faction drama, and high-contrast environmental storytelling carved from vaporwave noir.",
    ctaLabel: "View Concept",
    ctaHref: "#",
    artwork: "/media/mafia-syndicate.jpg",
    tags: ["Narrative", "Strategy"],
    status: "In Pre-Production"
  }
];

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}

