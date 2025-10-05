#!/usr/bin/env node
/**
 * Migration Script: Convert podcast JSON imageUrl fields from full paths (/podcast/foo.jpg)
 * to plain slug values (foo). Idempotent: running multiple times is safe.
 *
 * Behaviour:
 *  - Scans src/data/podcasts/*.json (language files) and updates each podcast entry
 *  - Matches imageUrl values beginning with /podcast/ and having a typical image extension
 *  - Replaces value with the extracted filename (without extension) => the slug
 *  - Writes a migration report to tmp/podcast-image-migration-report.json
 *  - Supports --dry-run flag (no file writes, only report output)
 *
 * Rationale:
 *  Using slug-only references decouples content from delivery path and allows the build-time
 *  optimized image pipeline (webp/avif variants) to resolve canonical + responsive sources.
 */
const fs = require('fs');
const path = require('path');

const PODCAST_DIR = path.join(__dirname, '..', 'src', 'data', 'podcasts');
const DRY_RUN = process.argv.includes('--dry-run');

function listPodcastJsonFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => f.endsWith('.json'));
}

function migrateFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    console.error('[migrate-podcast-images] Failed to parse JSON:', filePath, e.message);
    return { file: path.basename(filePath), updated: 0, skipped: true, error: e.message };
  }
  if (!data || !Array.isArray(data.podcasts)) {
    console.warn('[migrate-podcast-images] File does not have podcasts[]:', filePath);
    return { file: path.basename(filePath), updated: 0, skipped: true };
  }

  let updated = 0;
  for (const item of data.podcasts) {
    if (item && typeof item.imageUrl === 'string') {
      const m = item.imageUrl.match(/^\/podcast\/([^/]+?)\.(jpg|jpeg|png|webp|avif)$/i);
      if (m) {
        const slug = m[1].toLowerCase();
        if (item.imageUrl !== slug) {
          item.imageUrl = slug;
          updated++;
        }
      }
    }
  }
  if (updated > 0 && !DRY_RUN) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
  }
  return { file: path.basename(filePath), updated, skipped: false, dryRun: DRY_RUN };
}

function run() {
  console.log(`[migrate-podcast-images] Starting migration${DRY_RUN ? ' (dry-run)' : ''}...`);
  const files = listPodcastJsonFiles(PODCAST_DIR);
  if (files.length === 0) {
    console.warn('[migrate-podcast-images] No podcast JSON files found.');
    return;
  }
  const report = [];
  let totalUpdated = 0;
  for (const file of files) {
    const full = path.join(PODCAST_DIR, file);
    const res = migrateFile(full);
    totalUpdated += res.updated;
    report.push(res);
  }
  const out = { totalUpdated, dryRun: DRY_RUN, files: report, timestamp: new Date().toISOString() };
  const reportPath = path.join(process.cwd(), 'tmp', 'podcast-image-migration-report.json');
  try {
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, JSON.stringify(out, null, 2));
    console.log('[migrate-podcast-images] Report written to', reportPath);
  } catch (e) {
    console.warn('[migrate-podcast-images] Failed to write report:', e.message);
  }
  console.log(`[migrate-podcast-images] Migration complete. Updated fields: ${totalUpdated}${DRY_RUN ? ' (dry-run)' : ''}`);
}

run();
