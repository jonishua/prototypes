import fs from "node:fs/promises";
import path from "node:path";

const outDir = path.resolve(process.cwd(), "out");
const repoRoot = path.resolve(process.cwd(), "..");

async function ensureOutDir() {
  try {
    const stat = await fs.stat(outDir);
    if (!stat.isDirectory()) {
      throw new Error("`out/` exists but is not a directory");
    }
  } catch (error) {
    if (error && error.code === "ENOENT") {
      throw new Error("No `out/` folder found. Run `npm run export` first.");
    }
    throw error;
  }
}

async function sync() {
  await ensureOutDir();
  const entries = await fs.readdir(outDir);

  for (const entry of entries) {
    const source = path.join(outDir, entry);
    const target = path.join(repoRoot, entry);
    await fs.rm(target, { recursive: true, force: true });
    await fs.cp(source, target, { recursive: true });
  }
}

sync()
  .then(() => {
    console.log("Static export synced to repository root. Stage and commit the updated files.");
  })
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });

