#!/usr/bin/env node

/**
 * Update audio metadata (durationSeconds) in album MDX files.
 *
 * - Reads all MDX files in src/content/albums/*.mdx
 * - Parses YAML frontmatter using js-yaml
 * - For each song with an audioUrl, derives duration by fully decoding the
 *   stream with ffmpeg (falls back to music-metadata if ffmpeg is unavailable)
 * - Updates durationSeconds with the derived duration
 *
 * Why a full decode: many of these MP3s carry an embedded cover image and a
 * VBR/Xing header whose declared length is wrong (often ~2x the real audio),
 * so the cheap `ffprobe format=duration` estimate cannot be trusted. Decoding
 * every frame with `ffmpeg -f null` and reading the final `out_time_us` from
 * `-progress` yields the true playable length.
 *
 * Flags:
 *  --no-write: Dry run mode (do not write changes)
 *  --no-ffmpeg / --no-ffprobe: Disable the local ffmpeg decode (music-metadata only)
 *  --max-bytes=<n>: Max bytes to fetch for the music-metadata fallback (default: 60_000_000)
 *  --no-cache: Ignore the metadata cache
 *  --file=<name>: Only process one MDX file from src/content/albums
 *  --only-issues / --quiet: Only report tracks that change or fail (skip clean albums)
 *  --debug: Print decode and fetch failure details
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
const useFfmpeg = !args.includes("--no-ffmpeg") && !args.includes("--no-ffprobe");
const maxBytesArg = args.find((a) => a.startsWith("--max-bytes="));
const maxBytes = maxBytesArg ? parseInt(maxBytesArg.split("=")[1], 10) : 60_000_000;
const noCache = args.includes("--no-cache");
const fileArg = args.find((a) => a.startsWith("--file=") || a.startsWith("--album="));
const fileFilter = fileArg ? fileArg.split("=").slice(1).join("=") : undefined;
const debug = args.includes("--debug");
// Only report tracks that need a correction or failed to probe; stay silent on
// albums where every duration already matches. Keeps output short across the
// whole (growing) library.
const onlyIssues = args.includes("--only-issues") || args.includes("--quiet");

const cacheDir = path.join(root, ".cache");
const cacheFile = path.join(cacheDir, "audio-metadata-music.json");
// Bump when the duration-derivation method changes so stale (previously wrong)
// values are discarded instead of served from cache. v2 = ffmpeg full decode.
const CACHE_VERSION = 2;
let cache = {};
let cacheDirty = false;

async function loadCache() {
  if (noCache) {
    log("Cache disabled");
    return;
  }
  try {
    const data = await fs.readFile(cacheFile, "utf8");
    const parsed = JSON.parse(data);
    if (parsed && parsed.version === CACHE_VERSION && parsed.durations) {
      cache = parsed.durations;
      log(`Cache loaded (${Object.keys(cache).length} entries)\n`);
    } else {
      log(`Cache ignored (version mismatch, expected v${CACHE_VERSION})\n`);
    }
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
  const payload = { version: CACHE_VERSION, durations: cache };
  await fs.writeFile(cacheFile, JSON.stringify(payload, null, 2) + "\n", "utf8");
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

/**
 * Derive the true playable length by decoding every frame with ffmpeg.
 *
 * `-f null -` decodes the audio to nowhere (fast, no re-encode) while
 * `-progress pipe:1` streams machine-readable `out_time_us=<microseconds>`
 * lines to stdout. The final value is the accurate total duration, immune to
 * the wrong Xing/header length these files often carry.
 */
async function probeWithFfmpeg(url) {
  return new Promise((resolve, reject) => {
    const proc = spawn("ffmpeg", [
      "-nostdin",
      "-v",
      "quiet",
      "-i",
      url,
      "-vn",
      "-f",
      "null",
      "-progress",
      "pipe:1",
      "-",
    ]);
    let out = "";
    let stderr = "";
    proc.stdout.on("data", (d) => (out += d.toString()));
    proc.stderr.on("data", (d) => (stderr += d.toString()));
    proc.on("error", reject);
    proc.on("close", (code) => {
      const matches = [...out.matchAll(/out_time_us=(\d+)/g)];
      if (matches.length > 0) {
        const us = Number(matches[matches.length - 1][1]);
        if (Number.isFinite(us) && us > 0) {
          return resolve(Math.round(us / 1_000_000));
        }
      }
      reject(new Error(`no out_time_us (exit ${code}): ${stderr.trim().slice(-160)}`));
    });
  });
}

async function fetchFull(url, limitBytes) {
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

  // Preferred: decode the whole stream with ffmpeg for an exact length.
  if (useFfmpeg) {
    try {
      return await probeWithFfmpeg(mediaUrl);
    } catch (e) {
      debugLog(`ffmpeg decode failed for ${mediaUrl}: ${formatError(e)}`);
      // Fall through to music-metadata
    }
  }

  // Fallback: fetch the full file and let music-metadata scan every frame.
  // `duration: true` forces a frame scan instead of a header estimate, which
  // matters because these files' header durations are unreliable.
  try {
    const buf = await fetchFull(mediaUrl, maxBytes);
    const meta = await mm.parseBuffer(buf, { duration: true });
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

    // In --only-issues mode the file header is printed lazily, so it appears
    // only for albums that actually have something to report.
    let headerPrinted = false;
    const printHeader = () => {
      if (!headerPrinted) {
        log(`📄 ${file} (${songs.length} tracks)`);
        headerPrinted = true;
      }
    };
    if (!onlyIssues) {
      printHeader();
    }

    const label = (song) => `   Track ${song.trackNumber}: ${song.title.slice(0, 30)}`;

    let fileUpdated = 0;

    for (const song of songs) {
      if (!song.audioUrl) {
        continue;
      }

      const existingDuration =
        Number.isFinite(song.durationSeconds) && song.durationSeconds > 0
          ? song.durationSeconds
          : undefined;

      // Resolve the duration (cache first, then probe).
      let duration;
      let cached = false;
      if (!noCache && cache[song.audioUrl]) {
        duration = cache[song.audioUrl];
        cached = true;
      } else {
        duration = await deriveDuration(song.audioUrl);
        if (duration) {
          cache[song.audioUrl] = duration;
          cacheDirty = true;
        }
      }

      if (duration) {
        const changed = song.durationSeconds !== duration;
        if (changed) {
          printHeader();
          console.log(
            `${label(song)}  ${existingDuration ?? "—"}s → ${duration}s` +
              (cached ? " (cached)" : ""),
          );
          song.durationSeconds = duration;
          fileUpdated++;
        } else if (!onlyIssues) {
          console.log(`${label(song)}... ✅ ${duration}s${cached ? " (cached)" : ""}`);
        }
      } else if (existingDuration !== undefined) {
        printHeader();
        console.log(`${label(song)}... ⚠️  kept ${existingDuration}s (probe failed)`);
      } else {
        printHeader();
        console.log(`${label(song)}... ❌ (failed)`);
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
    } else if (!onlyIssues) {
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
