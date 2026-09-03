/**
 * One-off maintenance script: downsizes oversized story source images in
 * src/assets/ in place. Largest side is capped at MAX_EDGE px; images above
 * MIN_SIZE are recompressed even when already small enough.
 *
 * - Images with an alpha channel stay PNG.
 * - Opaque images are re-encoded in their original format (jpg stays jpg,
 *   png stays png) so content frontmatter references never change.
 *
 * Run once from the repo root: node apps/stories/scripts/downsize-source-images.mjs
 */
import { readdirSync, renameSync, statSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const ASSETS_DIR = new URL("../src/assets/", import.meta.url);
const MAX_EDGE = 2000;
const MIN_SIZE = 400_000; // bytes: recompress anything larger than this

const results = [];

for (const entry of readdirSync(ASSETS_DIR, { withFileTypes: true })) {
  if (!entry.isFile()) continue;
  const filePath = join(ASSETS_DIR.pathname, entry.name);
  const before = statSync(filePath).size;
  if (before < MIN_SIZE) continue;

  const metadata = await sharp(filePath).metadata();
  const hasAlpha = Boolean(metadata.hasAlpha) || (metadata.channels ?? 0) > 3;
  const width = metadata.width ?? 0;
  const height = metadata.height ?? 0;
  const needsResize = Math.max(width, height) > MAX_EDGE;

  let pipeline = sharp(filePath, { animated: false });
  if (needsResize) {
    pipeline = pipeline.resize({
      width: MAX_EDGE,
      height: MAX_EDGE,
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  const ext = entry.name.split(".").pop()?.toLowerCase();
  const tempPath = `${filePath}.tmp`;
  if (ext === "png" && hasAlpha) {
    await pipeline.png({ quality: 85 }).toFile(tempPath);
  } else if (ext === "png") {
    // Opaque PNG: flatten onto white and keep the .png extension so
    // frontmatter references stay valid.
    await pipeline
      .flatten({ background: "#ffffff" })
      .png({ quality: 85 })
      .toFile(tempPath);
  } else {
    await pipeline.jpeg({ quality: 82, mozjpeg: true }).toFile(tempPath);
  }
  renameSync(tempPath, filePath);
  const after = statSync(filePath).size;
  results.push([entry.name, before, after, needsResize]);
}

for (const [name, before, after] of results.sort((a, b) => b[1] - a[1])) {
  console.log(
    `${name}: ${(before / 1048576).toFixed(2)}M -> ${(after / 1048576).toFixed(2)}M`
  );
}
const saved = results.reduce((sum, [, b, a]) => sum + (b - a), 0);
console.log(
  `\n${results.length} files processed, ${(saved / 1048576).toFixed(1)}M saved`
);
