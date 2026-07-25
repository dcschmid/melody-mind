import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const appDir = path.resolve(scriptDir, "..");
const sourceDir = path.join(appDir, "dist");
const targetDir = path.join(appDir, "dist-embed");
const sourceEmbedAlbumDir = path.join(sourceDir, "embed", "album");
const sourceEmbedSeriesDir = path.join(sourceDir, "embed", "series");

await rm(targetDir, { recursive: true, force: true });
await mkdir(targetDir, { recursive: true });

await Promise.all([
  cp(sourceEmbedAlbumDir, path.join(targetDir, "album"), { recursive: true }),
  cp(sourceEmbedSeriesDir, path.join(targetDir, "series"), { recursive: true }),
  cp(path.join(sourceDir, "assets"), path.join(targetDir, "assets"), {
    recursive: true,
  }),
  cp(path.join(sourceDir, "fonts"), path.join(targetDir, "fonts"), {
    recursive: true,
  }),
]);

const rootPage =
  '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><meta name="referrer" content="no-referrer"><title>MelodyMind Embed</title></head><body><p>Choose an album or series player on <a href="https://melody-mind.de/">MelodyMind Music</a>.</p></body></html>';

await Promise.all([
  writeFile(path.join(targetDir, "index.html"), rootPage),
  writeFile(path.join(targetDir, "robots.txt"), "User-agent: *\nDisallow: /\n"),
]);

console.log(`Prepared isolated embed output at ${targetDir}`);
