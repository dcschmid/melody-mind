#!/usr/bin/env node
/**
 * Migration Script: Convert category JSON imageUrl fields from full paths (/category/foo.jpg)
 * to plain slug values (foo). Idempotent: running twice will not break existing slug-only values.
 *
 * Steps:
 * 1. Load each *_categories.json in src/json
 * 2. For each category entry: if imageUrl matches /^\/category\/(.+?)\.(jpg|jpeg|png|webp|avif)$/ replace value with captured slug
 * 3. Write file back (pretty formatted with two spaces)
 * 4. Produce a migration report summarizing counts
 */

const fs = require('fs');
const path = require('path');

const JSON_DIR = path.join(__dirname, '..', 'src', 'json');

function findCategoryJsonFiles(dir) {
  return fs.readdirSync(dir).filter(f => /_categories\.json$/i.test(f));
}

function migrateFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    console.error('[migrate-category-images] Failed to parse JSON:', filePath, e.message);
    return { file: filePath, updated: 0, skipped: true };
  }
  if (!Array.isArray(data)) {
    console.warn('[migrate-category-images] File does not contain array:', filePath);
    return { file: filePath, updated: 0, skipped: true };
  }
  let updated = 0;
  for (const item of data) {
    if (item && typeof item.imageUrl === 'string') {
  const m = item.imageUrl.match(/^\/category\/([^/]+?)\.(jpg|jpeg|png|webp|avif)$/i);
      if (m) {
        const slug = m[1].toLowerCase();
        if (item.imageUrl !== slug) {
          item.imageUrl = slug; // replace with slug only
          updated++;
        }
      }
    }
  }
  // Only write back if something changed
  if (updated > 0) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
  }
  return { file: path.basename(filePath), updated, skipped: false };
}

function run() {
  console.log('[migrate-category-images] Starting migration...');
  if (!fs.existsSync(JSON_DIR)) {
    console.error('[migrate-category-images] JSON directory missing:', JSON_DIR);
    process.exit(1);
  }
  const files = findCategoryJsonFiles(JSON_DIR);
  if (files.length === 0) {
    console.warn('[migrate-category-images] No _categories.json files found.');
    return;
  }
  const report = [];
  let totalUpdated = 0;
  for (const file of files) {
    const full = path.join(JSON_DIR, file);
    const res = migrateFile(full);
    totalUpdated += res.updated;
    report.push(res);
  }
  const reportPath = path.join(process.cwd(), 'tmp', 'category-image-migration-report.json');
  try {
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, JSON.stringify({ totalUpdated, files: report }, null, 2));
    console.log('[migrate-category-images] Report written to', reportPath);
  } catch (e) {
    console.warn('[migrate-category-images] Failed to write report:', e.message);
  }
  console.log(`[migrate-category-images] Migration complete. Updated fields: ${totalUpdated}`);
}

run();
