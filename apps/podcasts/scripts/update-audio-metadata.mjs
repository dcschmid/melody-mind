#!/usr/bin/env node
/**
 * Update audio metadata (fileSizeBytes, duration) in podcast MDX files.
 *
 * - Reads all MDX files in src/content/podcasts/*.mdx
 * - Extracts YAML frontmatter
 * - Runs a HEAD request for each podcast with an audioUrl
 * - Stores Content-Length as fileSizeBytes
 * - Derives duration via ffprobe or music-metadata
 *
 * Flags:
 *  --write: Persist changes to disk (enabled by default)
 *  --no-write: Disable file writes and run as a dry run
 *  --timeout=<ms>: Request timeout in milliseconds (default: 8000)
 *  --duration: Try to determine duration with music-metadata
 *  --ffprobe: Prefer local ffprobe for more accurate duration detection
 *  --no-duration: Skip duration detection
 *  --no-ffprobe: Disable ffprobe usage
 *  --no-refresh: Disable forced refresh
 *  --max-bytes=<n>: Maximum bytes to fetch for music-metadata (default: 6_000_000)
 *  --no-cache: Ignore the metadata cache
 *  --use-cache: Read from the metadata cache
 *  --refresh: Force a fresh fetch
 *  --available-only: Only process podcasts with isAvailable=true
 *  --ids=a,b,c: Only process the specified podcast IDs
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout as wait } from 'node:timers/promises';
import { spawn } from 'node:child_process';
import * as mm from 'music-metadata';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const dataDir = path.join(root, 'src', 'content', 'podcasts');

const args = process.argv.slice(2);
const isWrite = !args.includes('--no-write');
const timeoutArg = args.find((a) => a.startsWith('--timeout='));
const timeoutMs = timeoutArg ? parseInt(timeoutArg.split('=')[1], 10) : 8000;
const wantDuration = !args.includes('--no-duration');
const useFfprobe = !args.includes('--no-ffprobe');
const maxBytesArg = args.find((a) => a.startsWith('--max-bytes='));
const maxBytes = maxBytesArg ? parseInt(maxBytesArg.split('=')[1], 10) : 6_000_000;
const noCache = !args.includes('--use-cache');
const refresh = !args.includes('--no-refresh');
const availableOnly = args.includes('--available-only');
const idsArg = args.find((a) => a.startsWith('--ids='));
const idFilter = idsArg
  ? idsArg
      .split('=')[1]
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  : null;
const cacheDir = path.join(root, '.cache');
const cacheFile = path.join(cacheDir, 'audio-metadata.json');
let cache = {};
let cacheDirty = false;

async function loadCache() {
  if (noCache) {
    log('Cache disabled (--no-cache)');
    return;
  }
  try {
    const data = await fs.readFile(cacheFile, 'utf8');
    cache = JSON.parse(data);
    log('Cache loaded entries:', Object.keys(cache).length);
  } catch {
    log('No existing cache');
  }
}

async function saveCache() {
  if (noCache) return;
  if (!cacheDirty) return;
  await fs.mkdir(cacheDir, { recursive: true });
  await fs.writeFile(cacheFile, JSON.stringify(cache, null, 2) + '\n', 'utf8');
  log('Cache saved');
}

/** HEAD first, Range-GET fallback if HEAD not allowed */
async function headWithFallback(url, { timeout } = { timeout: timeoutMs }) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { method: 'HEAD', signal: controller.signal });
    clearTimeout(t);
    if (res.ok) return res;
    if (res.status && ![400, 401, 403, 405].includes(res.status)) return res;
  } catch {
    clearTimeout(t);
  }

  const controller2 = new AbortController();
  const t2 = setTimeout(() => controller2.abort(), timeout);
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: { Range: 'bytes=0-0' },
      signal: controller2.signal,
    });
    clearTimeout(t2);
    return res;
  } catch {
    clearTimeout(t2);
    return null;
  }
}

function log(...msg) {
  console.log('[update-audio-metadata]', ...msg);
}

async function probeWithFfprobe(url) {
  return new Promise((resolve, reject) => {
    const proc = spawn('ffprobe', [
      '-v',
      'error',
      '-show_entries',
      'format=duration',
      '-of',
      'default=noprint_wrappers=1:nokey=1',
      url,
    ]);
    let out = '';
    let err = '';
    proc.stdout.on('data', (d) => (out += d.toString()));
    proc.stderr.on('data', (d) => (err += d.toString()));
    proc.on('close', (code) => {
      if (code === 0) {
        const dur = parseFloat(out.trim());
        if (!Number.isNaN(dur)) return resolve(dur);
        return reject(new Error('ffprobe no duration'));
      }
      reject(new Error('ffprobe failed: ' + err.trim()));
    });
  });
}

async function fetchPartial(url, limitBytes) {
  const controller = new AbortController();
  const res = await fetch(url, { signal: controller.signal });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const reader = res.body.getReader();
  let received = 0;
  const chunks = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
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
  if (useFfprobe) {
    try {
      return await probeWithFfprobe(url);
    } catch (e) {
      log('ffprobe fallback to partial read:', e.message);
    }
  }
  try {
    const buf = await fetchPartial(url, maxBytes);
    const meta = await mm.parseBuffer(buf, undefined, { duration: true });
    if (meta.format.duration) return meta.format.duration;
  } catch (e) {
    log('music-metadata failed', e.message);
  }
  return undefined;
}

/**
 * Parse MDX frontmatter into key-value object.
 * Supports: single-line values, quoted strings, dates, numbers, booleans.
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { frontmatter: {}, body: content };

  const yaml = match[1];
  const body = content.slice(match[0].length);
  const frontmatter = {};

  // Minimal YAML parser for frontmatter
  for (const line of yaml.split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;

    const key = line.slice(0, colonIdx).trim();
    let value = line.slice(colonIdx + 1).trim();

    if (!key || !value) continue;

    // Remove wrapping quotes
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    // Parse primitive types
    if (value === 'true') frontmatter[key] = true;
    else if (value === 'false') frontmatter[key] = false;
    else if (value === 'null') frontmatter[key] = null;
    else if (/^\d+$/.test(value)) frontmatter[key] = parseInt(value, 10);
    else if (/^\d+\.\d+$/.test(value)) frontmatter[key] = parseFloat(value);
    else frontmatter[key] = value;
  }

  return { frontmatter, body };
}

/**
 * Stringify frontmatter object back to YAML.
 */
function stringifyFrontmatter(frontmatter) {
  const lines = [];
  for (const [key, value] of Object.entries(frontmatter)) {
    if (value === undefined) continue;

    let serialized;
    if (typeof value === 'string') {
      // Quote strings that could break YAML parsing
      if (value.includes(':') || value.includes('#') || value.includes('\n')) {
        serialized = `"${value.replace(/"/g, '\\"')}"`;
      } else {
        serialized = value;
      }
    } else if (value instanceof Date) {
      serialized = value.toISOString();
    } else if (typeof value === 'boolean') {
      serialized = value ? 'true' : 'false';
    } else if (value === null) {
      serialized = 'null';
    } else {
      serialized = String(value);
    }

    lines.push(`${key}: ${serialized}`);
  }
  return lines.join('\n');
}

/**
 * Rebuild MDX content with updated frontmatter.
 */
function rebuildMdx(frontmatter, body) {
  const yaml = stringifyFrontmatter(frontmatter);
  return `---\n${yaml}\n---${body}`;
}

async function processFile(filePath) {
  const base = path.basename(filePath);
  log(`Processing ${base}...`);

  const raw = await fs.readFile(filePath, 'utf8');
  const { frontmatter, body } = parseFrontmatter(raw);

  if (!frontmatter.id) {
    log('No id found in', base);
    return;
  }

  if (idFilter && !idFilter.includes(frontmatter.id)) {
    log('Skip (filtered by id)', frontmatter.id);
    return;
  }

  if (availableOnly && !frontmatter.isAvailable) {
    log('Skip (not available)', frontmatter.id);
    return;
  }

  if (!frontmatter.audioUrl) {
    log('No audioUrl in', frontmatter.id);
    return;
  }

  let changed = false;
  const cacheKey = frontmatter.audioUrl;
  const cached = cache[cacheKey];
  const canReuse = cached && !refresh;

  if (canReuse) {
    if (cached.fileSizeBytes && frontmatter.fileSizeBytes !== cached.fileSizeBytes) {
      frontmatter.fileSizeBytes = cached.fileSizeBytes;
      changed = true;
    }
    if (wantDuration && cached.durationSeconds && !frontmatter.durationSeconds) {
      frontmatter.durationSeconds = cached.durationSeconds;
      changed = true;
    }
    log('REUSE', frontmatter.audioUrl);
  }

  if (!canReuse || !frontmatter.fileSizeBytes || (wantDuration && !frontmatter.durationSeconds)) {
    log('HEAD', frontmatter.audioUrl);
    const res = await headWithFallback(frontmatter.audioUrl);
    if (!res || !res.ok) {
      log('WARN status', res?.status, 'for', frontmatter.audioUrl);
      return;
    }

    let len = res.headers.get('content-length');
    if (!len) {
      const cr = res.headers.get('content-range');
      const m = cr && cr.match(/\/(\d+)$/);
      if (m) len = m[1];
    }

    if (len) {
      const num = parseInt(len, 10);
      if (!Number.isNaN(num) && frontmatter.fileSizeBytes !== num) {
        frontmatter.fileSizeBytes = num;
        changed = true;
        log(`  -> fileSizeBytes=${num}`);
      }
    }

    if (wantDuration && (refresh || !frontmatter.durationSeconds)) {
      log('  derive duration...');
      const dur = await deriveDuration(frontmatter.audioUrl);
      if (dur && !Number.isNaN(dur)) {
        const seconds = Math.round(dur);
        if (frontmatter.durationSeconds !== seconds) {
          frontmatter.durationSeconds = seconds;
          changed = true;
          log(`  -> durationSeconds=${seconds}`);
        }
      }
    }

    if (!noCache) {
      cache[cacheKey] = {
        fileSizeBytes: frontmatter.fileSizeBytes,
        durationSeconds: frontmatter.durationSeconds,
      };
      cacheDirty = true;
    }

    await wait(100);
  }

  if (changed) {
    if (isWrite) {
      const newContent = rebuildMdx(frontmatter, body);
      await fs.writeFile(filePath, newContent, 'utf8');
      log('WROTE', base);
    } else {
      log('Dry-Run change detected for', base, '(use --write to persist)');
    }
  } else {
    log('No changes for', base);
  }
}

async function main() {
  await loadCache();
  log(
    'Start (write mode:',
    isWrite,
    ') duration mode:',
    wantDuration,
    'ffprobe:',
    useFfprobe,
    'refresh:',
    refresh,
    'available-only:',
    availableOnly,
    'ids:',
    idFilter || 'all',
  );

  const entries = await fs.readdir(dataDir);
  const files = entries.filter((f) => f.endsWith('.mdx')).map((f) => path.join(dataDir, f));

  if (files.length === 0) {
    log('No MDX files found in', dataDir);
    return;
  }

  log(`Found ${files.length} MDX files`);

  for (const file of files) {
    await processFile(file);
  }

  await saveCache();
  log('Done');

  if (!isWrite) {
    log('Dry run finished. Add --write to save changes.');
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
