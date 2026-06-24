#!/usr/bin/env node

/**
 * Update audio metadata (durationSeconds) in album MDX files.
 *
 * - Reads all MDX files in src/content/albums/*.mdx
 * - Parses YAML frontmatter using js-yaml
 * - For each song with an audioUrl, derives duration via ffprobe or music-metadata
 * - Updates durationSeconds with the derived duration
 *
 * Flags:
 *  --no-write: Dry run mode (do not write changes)
 *  --ffprobe: Prefer local ffprobe (default: try both)
 *  --no-ffprobe: Disable ffprobe usage
 *  --timeout=<ms>: Request timeout in milliseconds (default: 8000)
 *  --max-bytes=<n>: Maximum bytes to fetch for music-metadata (default: 6_000_000)
 *  --no-cache: Ignore the metadata cache
 *  --file=<name>: Only process one MDX file from src/content/albums
 *  --debug: Print ffprobe and fetch failure details
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import * as YAML from "js-yaml";
import * as mm from "music-metadata";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const dataDir = path.join(root, "src", "content", "albums");

const args = process.argv.slice(2);
const isWrite = !args.includes("--no-write");
const useFfprobe = !args.includes("--no-ffprobe");
const timeoutArg = args.find((a) => a.startsWith("--timeout="));
const timeoutMs = timeoutArg ? parseInt(timeoutArg.split("=")[1], 10) : 8000;
const maxBytesArg = args.find((a) => a.startsWith("--max-bytes="));
const maxBytes = maxBytesArg ? parseInt(maxBytesArg.split("=")[1], 10) : 6_000_000;
const noCache = args.includes("--no-cache");
const fileArg = args.find((a) => a.startsWith("--file=") || a.startsWith("--album="));
const fileFilter = fileArg ? fileArg.split("=").slice(1).join("=") : undefined;
const debug = args.includes("--debug");

const cacheDir = path.join(root, ".cache");
const cacheFile = path.join(cacheDir, "audio-metadata-music.json");
let cache = {};
let cacheDirty = false;

async function loadCache() {
  if (noCache) {
    log("Cache disabled");
    return;
  }
  try {
    const data = await fs.readFile(cacheFile, "utf8");
    cache = JSON.parse(data);
    log(`Cache loaded (${Object.keys(cache).length} entries)\n`);
  } catch {
    log("No cache found\n");
  }
}

async function saveCache() {
  if (!isWrite) {
    return;
  }
  if (noCache) {
    return;
  }
  if (!cacheDirty) {
    return;
  }
  await fs.mkdir(cacheDir, { recursive: true });
  await fs.writeFile(cacheFile, JSON.stringify(cache, null, 2) + "\n", "utf8");
}

function log(...msg) {
  console.log("[audio-metadata]", ...msg);
}

function debugLog(...msg) {
  if (!debug) {
    return;
  }
  console.warn("[audio-metadata:debug]", ...msg);
}

function formatError(error) {
  return error instanceof Error ? error.message : String(error);
}

function normalizeMediaUrl(url) {
  try {
    return new URL(url).href;
  } catch {
    return encodeURI(url);
  }
}

async function probeWithFfprobe(url) {
  return new Promise((resolve, reject) => {
    const proc = spawn("ffprobe", [
      "-v",
      "error",
      "-show_entries",
      "format=duration",
      "-of",
      "default=noprint_wrappers=1:nokey=1",
      url,
    ]);
    let out = "";
    let err = "";
    proc.stdout.on("data", (d) => (out += d.toString()));
    proc.stderr.on("data", (d) => (err += d.toString()));
    proc.on("close", (code) => {
      if (code === 0) {
        const dur = parseFloat(out.trim());
        if (!Number.isNaN(dur)) {
          return resolve(Math.round(dur));
        }
        return reject(new Error("no duration"));
      }
      reject(new Error(err.trim()));
    });
  });
}

async function fetchPartial(url, limitBytes) {
  const controller = new AbortController();
  const res = await fetch(url, { signal: controller.signal });
  if (!res.ok) {
    throw new Error("HTTP " + res.status);
  }
  const reader = res.body.getReader();
  let received = 0;
  const chunks = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    received += value.length;
    chunks.push(value);
    if (received >= limitBytes) {
      controller.abort();
      break;
    }
  }
  return Buffer.concat(chunks);
}

async function deriveDuration(url) {
  const mediaUrl = normalizeMediaUrl(url);

  // Try ffprobe first if enabled
  if (useFfprobe) {
    try {
      return await probeWithFfprobe(mediaUrl);
    } catch (e) {
      debugLog(`ffprobe failed for ${mediaUrl}: ${formatError(e)}`);
      // Continue to music-metadata
    }
  }

  // Try music-metadata
  try {
    const buf = await fetchPartial(mediaUrl, maxBytes);
    const meta = await mm.parseBuffer(buf);
    if (meta.format.duration) {
      return Math.round(meta.format.duration);
    }
  } catch (e) {
    debugLog(`music-metadata failed for ${mediaUrl}: ${formatError(e)}`);
    // Failed
  }

  return undefined;
}

/**
 * Parse MDX file and extract frontmatter
 */
function parseMDX(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)/);
  if (!match) {
    return null;
  }

  const yamlStr = match[1];
  const body = match[2];

  try {
    const frontmatter = YAML.load(yamlStr);
    return { frontmatter, body };
  } catch (e) {
    log(`  ⚠️  YAML parse failed: ${e.message}`);
    return null;
  }
}

/**
 * Serialize frontmatter back to YAML
 */
function serializeMDX(frontmatter, body) {
  const yaml = YAML.dump(frontmatter, {
    lineWidth: -1,
    noRefs: true,
  });
  return `---\n${yaml}---\n${body}`;
}

/**
 * Main function
 */
async function main() {
  log("Updating album audio metadata\n");

  await loadCache();

  const files = await fs.readdir(dataDir);
  const mdxFiles = files
    .filter((f) => f.endsWith(".mdx"))
    .filter((f) => fileFilter === undefined || f === fileFilter);

  if (mdxFiles.length === 0) {
    log("No MDX files found");
    return;
  }

  let totalUpdated = 0;

  for (const file of mdxFiles) {
    const filePath = path.join(dataDir, file);
    const content = await fs.readFile(filePath, "utf8");
    const parsed = parseMDX(content);

    if (!parsed) {
      log(`⚠️  ${file}: parse failed`);
      continue;
    }

    const { frontmatter, body } = parsed;
    const songs = frontmatter.songs || [];

    if (songs.length === 0) {
      log(`⏭️  ${file}: no songs`);
      continue;
    }

    log(`📄 ${file} (${songs.length} tracks)`);

    let fileUpdated = 0;

    for (const song of songs) {
      if (!song.audioUrl) {
        continue;
      }

      process.stdout.write(`   Track ${song.trackNumber}: ${song.title.slice(0, 30)}...`);

      const existingDuration =
        Number.isFinite(song.durationSeconds) && song.durationSeconds > 0
          ? song.durationSeconds
          : undefined;

      // Check cache
      if (!noCache && cache[song.audioUrl]) {
        const cachedDuration = cache[song.audioUrl];
        console.log(` ✅ ${cachedDuration}s (cached)`);
        if (song.durationSeconds !== cachedDuration) {
          song.durationSeconds = cachedDuration;
          fileUpdated++;
        }
        continue;
      }

      // Get duration
      const duration = await deriveDuration(song.audioUrl);
      if (duration) {
        cache[song.audioUrl] = duration;
        cacheDirty = true;
        console.log(` ✅ ${duration}s`);
        if (song.durationSeconds !== duration) {
          song.durationSeconds = duration;
          fileUpdated++;
        }
      } else if (existingDuration !== undefined) {
        console.log(` ⚠️  kept ${existingDuration}s (probe failed)`);
      } else {
        console.log(` ❌ (failed)`);
      }
    }

    if (fileUpdated > 0) {
      if (isWrite) {
        const updated = serializeMDX(frontmatter, body);
        await fs.writeFile(filePath, updated, "utf8");
        log(`   ✅ Updated ${fileUpdated} track(s)\n`);
        totalUpdated += fileUpdated;
      } else {
        log(`   📋 [DRY RUN] Would update ${fileUpdated} track(s)\n`);
      }
    } else {
      log(`   ⚠️  No changes\n`);
    }
  }

  await saveCache();

  if (isWrite) {
    log(`✨ Complete! Updated ${totalUpdated} duration(s)`);
  } else {
    log("✨ Dry run complete");
  }
}

main().catch((e) => {
  console.error("Fatal error:", e.message);
  process.exit(1);
});
