import { access, cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const appDir = path.resolve(scriptDir, "..");
const sourceDir = path.join(appDir, "dist");
const targetDir = path.join(appDir, "dist-embed");
const sourceAssetsDir = path.join(sourceDir, "assets");
const targetAssetsDir = path.join(targetDir, "assets");

await rm(targetDir, { recursive: true, force: true });
await mkdir(targetDir, { recursive: true });

await Promise.all([
  cp(path.join(sourceDir, "embed", "album"), path.join(targetDir, "album"), {
    recursive: true,
  }),
  cp(path.join(sourceDir, "embed", "series"), path.join(targetDir, "series"), {
    recursive: true,
  }),
]);

/* The embed service only serves embed pages, so ship just the assets those
   pages reference instead of mirroring the whole site's asset directory. */
const collectHtmlAssetRefs = async (rootDir) => {
  const refs = new Set();
  const entries = await readdir(rootDir, { withFileTypes: true, recursive: true });
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".html")) continue;
    const html = await readFile(path.join(entry.parentPath, entry.name), "utf8");
    for (const match of html.matchAll(/\/assets\/[\p{L}\p{N}._/-]+/gu)) {
      refs.add(match[0].slice("/assets/".length));
    }
  }
  return refs;
};

const exists = async (filePath) => {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
};

const copied = new Set();
const copyAsset = async (relativePath) => {
  if (copied.has(relativePath)) return;
  copied.add(relativePath);
  const from = path.join(sourceAssetsDir, relativePath);
  const to = path.join(targetAssetsDir, relativePath);
  await mkdir(path.dirname(to), { recursive: true });
  await cp(from, to);
};

await Promise.all([...(await collectHtmlAssetRefs(targetDir))].map(copyAsset));

/* Follow relative ES import specifiers inside copied JS chunks so lazily
   imported modules are included as well. */
const queue = [...copied].filter((ref) => ref.endsWith(".js"));
while (queue.length > 0) {
  const ref = queue.shift();
  const js = await readFile(path.join(targetAssetsDir, ref), "utf8");
  const specifiers = [...js.matchAll(/(?:import|from)\s*\(?\s*"\.\/([^"]+)"/g)].map(
    (match) => match[1]
  );
  for (const specifier of specifiers) {
    const resolved = path.posix.normalize(
      path.posix.join(path.posix.dirname(ref), specifier)
    );
    if (copied.has(resolved)) continue;
    if (!(await exists(path.join(sourceAssetsDir, resolved)))) continue;
    await copyAsset(resolved);
    if (resolved.endsWith(".js")) queue.push(resolved);
  }
}

const rootPage =
  '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex,nofollow"><meta name="referrer" content="no-referrer"><title>MelodyMind Embed</title></head><body><p>Choose an album or series player on <a href="https://melody-mind.de/">MelodyMind Music</a>.</p></body></html>';

await Promise.all([
  writeFile(path.join(targetDir, "index.html"), rootPage),
  writeFile(path.join(targetDir, "robots.txt"), "User-agent: *\nDisallow: /\n"),
]);

console.log(
  `Prepared isolated embed output at ${targetDir} with ${copied.size} referenced assets.`
);
