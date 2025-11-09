import fs from "node:fs/promises";
import path from "node:path";

const repoRoot = path.resolve(
  process.env.PROJECT_ROOT ?? process.cwd()
);
const sourceDir = path.join(repoRoot, "games");
const targetDir = path.join(repoRoot, "public", "games");

async function ensureSource() {
  const stat = await fs.stat(sourceDir).catch((error) => {
    if (error?.code === "ENOENT") {
      throw new Error("`games/` directory not found. Create it before syncing.");
    }
    throw error;
  });

  if (!stat.isDirectory()) {
    throw new Error("`games/` exists but is not a directory.");
  }
}

async function copyDirectoryRecursive(source, destination) {
  await fs.mkdir(destination, { recursive: true });
  const entries = await fs.readdir(source, { withFileTypes: true });

  for (const entry of entries) {
    const from = path.join(source, entry.name);
    const to = path.join(destination, entry.name);

    if (entry.isDirectory()) {
      await copyDirectoryRecursive(from, to);
    } else if (entry.isSymbolicLink()) {
      const resolved = await fs.readlink(from);
      await fs.symlink(resolved, to);
    } else {
      await fs.copyFile(from, to);
    }
  }
}

async function syncGames() {
  await ensureSource();
  await fs.rm(targetDir, { recursive: true, force: true });
  await fs.mkdir(path.dirname(targetDir), { recursive: true });

  if (typeof fs.cp === "function") {
    await fs.cp(sourceDir, targetDir, { recursive: true });
  } else {
    await copyDirectoryRecursive(sourceDir, targetDir);
  }
}

syncGames()
  .then(() => {
    console.log("games/ synced to public/games");
  })
  .catch((error) => {
    console.error("Failed to sync games:", error.message ?? error);
    process.exitCode = 1;
  });
