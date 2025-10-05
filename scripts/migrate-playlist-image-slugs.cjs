#!/usr/bin/env node
/**
 * migrate-playlist-image-slugs.cjs
 * --------------------------------
 * Migrates playlist JSON entries from absolute category image paths
 *   "/category/<slug>.jpg" -> "<slug>"
 * preparing for a dedicated playlist image group (Option B) that will
 * generate optimized variants under `src/assets/playlist/<slug>/`.
 *
 * After this migration the UI will use `<OptimizedImage group="playlist" slug={imageUrl}>`.
 * A separate step copies the original JPGs into `public/playlist/` so the
 * runtime fallback path `/${group}/${slug}.jpg` continues to work before/while
 * variants are loaded.
 *
 * Usage:
 *   node scripts/migrate-playlist-image-slugs.cjs --dry-run
 *   node scripts/migrate-playlist-image-slugs.cjs              # real run
 *   node scripts/migrate-playlist-image-slugs.cjs --backup     # create .bak alongside each file
 *
 * Flags:
 *   --dry-run  : report changes only, do not write files
 *   --backup   : create <file>.bak with original content before overwriting
 *   --verbose  : list each changed entry
 *
 * Implementation notes:
 * - Only rewrites entries whose imageUrl matches /category/<slug>.jpg
 * - Leaves already-migrated slugs or other custom paths untouched
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PLAYLIST_DIR = path.join(ROOT, 'public', 'json', 'playlist');

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const MAKE_BACKUPS = args.includes('--backup');
const VERBOSE = args.includes('--verbose');

function readJson(file) {
  try {
    const raw = fs.readFileSync(file, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('[migrate-playlist] Failed to parse', file, err.message);
    return null;
  }
}

function writeJson(file, data) {
  const json = JSON.stringify(data, null, 2) + '\n';
  if (MAKE_BACKUPS && !DRY_RUN) {
    fs.writeFileSync(file + '.bak', fs.readFileSync(file));
  }
  if (!DRY_RUN) {
    fs.writeFileSync(file, json, 'utf8');
  }
}

function extractSlug(imageUrl) {
  // Expect pattern /category/<slug>.jpg
  const m = imageUrl.match(/^\/category\/([^/]+)\.jpg$/i);
  if (!m) return null;
  return m[1];
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '');
}

function migrateFile(file) {
  const data = readJson(file);
  if (!Array.isArray(data)) {
    return { file, skipped: true, reason: 'Not an array' };
  }

  let changed = 0;
  let untouched = 0;
  const slugs = new Set();

  for (const entry of data) {
    if (!entry || typeof entry !== 'object') { untouched++; continue; }
    const { imageUrl } = entry;
    if (typeof imageUrl !== 'string') { untouched++; continue; }
    const slug = extractSlug(imageUrl);
    if (!slug) { untouched++; continue; }
    if (VERBOSE) {
      console.log(`[migrate-playlist] ${path.basename(file)}: ${imageUrl} -> ${slug}`);
    }
  entry.imageUrl = slugify(slug); // mutate in place (normalized)
    slugs.add(slug);
    changed++;
  }

  if (changed > 0) {
    writeJson(file, data);
  }
  return { file, changed, untouched, skipped: false, slugs: Array.from(slugs) };
}

function main() {
  if (!fs.existsSync(PLAYLIST_DIR)) {
    console.error('[migrate-playlist] Directory not found:', PLAYLIST_DIR);
    process.exit(1);
  }
  const files = fs.readdirSync(PLAYLIST_DIR).filter(f => f.endsWith('_playlist.json'));
  if (!files.length) {
    console.warn('[migrate-playlist] No *_playlist.json files found.');
    return;
  }

  const report = [];
  const allSlugs = new Set();
  for (const f of files) {
    const full = path.join(PLAYLIST_DIR, f);
    const res = migrateFile(full);
    report.push(res);
    (res.slugs || []).forEach(s => allSlugs.add(s));
  }

  const summary = {
    dryRun: DRY_RUN,
    backups: MAKE_BACKUPS,
    filesProcessed: report.length,
    totalChanged: report.reduce((a, r) => a + (r.changed || 0), 0),
    uniqueSlugs: Array.from(allSlugs).sort(),
  };

  console.log('\n[migrate-playlist] Summary:', JSON.stringify(summary, null, 2));
  if (DRY_RUN) {
    console.log('[migrate-playlist] (dry-run) No files written.');
  }
}

main();
