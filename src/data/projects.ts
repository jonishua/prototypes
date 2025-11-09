import fs from "node:fs";
import path from "node:path";

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
  order?: number;
};

const gamesDir = path.join(process.cwd(), "games");

function loadProjectsFromDisk(): ProjectEntry[] {
  if (!fs.existsSync(gamesDir)) {
    return [];
  }

  const directories = fs
    .readdirSync(gamesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  const projects: ProjectEntry[] = [];

  for (const dir of directories) {
    const metadataPath = path.join(gamesDir, dir, "metadata.json");

    if (!fs.existsSync(metadataPath)) {
      continue;
    }

    try {
      const raw = fs.readFileSync(metadataPath, "utf8");
      const data = JSON.parse(raw) as ProjectEntry;

      const required: Array<keyof ProjectEntry> = [
        "id",
        "slug",
        "title",
        "blurb",
        "description",
        "ctaLabel",
        "ctaHref",
        "artwork",
        "tags",
        "status"
      ];

      const missing = required.filter((key) => data[key] === undefined || data[key] === "");
      if (missing.length > 0) {
        console.warn(
          `[projects] Skipping ${dir} due to missing fields: ${missing.join(", ")}`
        );
        continue;
      }

      const normalized: ProjectEntry = {
        ...data,
        order: typeof data.order === "number" ? data.order : undefined,
        tags: Array.isArray(data.tags) ? data.tags : []
      };

      projects.push(normalized);
    } catch (error) {
      console.warn(`[projects] Failed to parse metadata for ${dir}:`, error);
    }
  }

  projects.sort((a, b) => {
    const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
    const orderB = b.order ?? Number.MAX_SAFE_INTEGER;

    if (orderA !== orderB) {
      return orderA - orderB;
    }

    return a.title.localeCompare(b.title);
  });

  return projects;
}

export function getAllProjects(): ProjectEntry[] {
  return loadProjectsFromDisk();
}

export function getProjectBySlug(slug: string) {
  return loadProjectsFromDisk().find((project) => project.slug === slug);
}

export function getProjectSlugs(): string[] {
  return loadProjectsFromDisk().map((project) => project.slug);
}

