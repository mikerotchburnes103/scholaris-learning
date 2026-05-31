// Scans public/games/*.html and matches thumbnails in public/games/thumbs/
// (or alongside the html), then merges new entries into public/games/manifest.json.
// Existing manifest entries (keyed by url) are preserved as-is.
import { readdirSync, readFileSync, writeFileSync, existsSync, statSync } from "node:fs";
import { join, extname, basename } from "node:path";

const IMG_EXTS = [".png", ".jpg", ".jpeg", ".webp"];

function titleCase(slug) {
  return slug
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

function findThumb(gamesDir, thumbsDir, slug) {
  for (const ext of IMG_EXTS) {
    const inThumbs = join(thumbsDir, slug + ext);
    if (existsSync(inThumbs)) return `/games/thumbs/${slug}${ext}`;
    const beside = join(gamesDir, slug + ext);
    if (existsSync(beside)) return `/games/${slug}${ext}`;
  }
  return null;
}

export function buildGamesManifest(root = process.cwd()) {
  const gamesDir = join(root, "public", "games");
  const thumbsDir = join(gamesDir, "thumbs");
  const manifestPath = join(gamesDir, "manifest.json");
  if (!existsSync(gamesDir)) return;

  let manifest = { games: [] };
  if (existsSync(manifestPath)) {
    try { manifest = JSON.parse(readFileSync(manifestPath, "utf8")); } catch { /* keep default */ }
  }
  if (!Array.isArray(manifest.games)) manifest.games = [];

  const byUrl = new Map(manifest.games.map((g) => [g.url, g]));
  const today = new Date().toISOString().slice(0, 10);

  const htmlFiles = readdirSync(gamesDir).filter(
    (f) => extname(f).toLowerCase() === ".html" && statSync(join(gamesDir, f)).isFile(),
  );

  let added = 0;
  for (const file of htmlFiles) {
    const slug = basename(file, ".html");
    const url = `/games/${file}`;
    if (byUrl.has(url)) continue;
    const img = findThumb(gamesDir, thumbsDir, slug);
    if (!img) continue;
    const entry = {
      name: titleCase(slug),
      url,
      img,
      genre: "Arcade",
      device: "mobile+pc",
      added: today,
    };
    manifest.games.push(entry);
    byUrl.set(url, entry);
    added++;
  }

  if (added > 0) {
    writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
    console.log(`[games-manifest] added ${added} auto-detected entr${added === 1 ? "y" : "ies"}`);
  }
}

export default function gamesManifestPlugin() {
  return {
    name: "games-manifest-autogen",
    buildStart() { buildGamesManifest(); },
    configureServer() { buildGamesManifest(); },
  };
}

// CLI usage: `node scripts/build-games-manifest.mjs`
if (import.meta.url === `file://${process.argv[1]}`) buildGamesManifest();
