#!/usr/bin/env node
// Knowledge image frontmatter migration (special slugs -> canonical normalized slug forms).
//
// Only updates the known set of 8 legacy/special cases containing diacritics, ampersands,
// apostrophes, exclamation marks, or symbolic forms. Other slugs are left untouched to
// avoid accidental churn.
//
// Strategy:
//  - Scan pattern: src/content/knowledge-*/**/*.md
//  - Detect lines beginning with: image: /category/<slug>.jpg
//  - If <slug> is in mapping, replace with canonical slug.
//  - Idempotent: re-running produces no further diff.
//  - Adds a comment once per file on first change for traceability.
//
// Safe defaults:
//  - No partial replacements in other frontmatter keys.
//  - Skips binary / non-markdown.
//
// Extend mapping if new legacy variants discovered.

/* eslint-env node */
/* global console, process */
import { readFileSync, writeFileSync } from 'fs';
import globPkg from 'glob';
const globFn = typeof globPkg === 'function' ? globPkg : globPkg.glob || globPkg.default;

// Canonical mapping (raw slug -> canonical slug)
const MAPPING = new Map([
  ['female-r&b-divas', 'female-randb-divas'],
  ['focus-&-concentration', 'focus-and-concentration'],
  ['forró', 'forro'], // target directory will be generated separately if missing
  ['meditation-&-yoga', 'meditation-and-yoga'],
  ['party-on!', 'party-on'],
  ['r&b', 'randb'],
  ["rock-'n'-roll", 'rock-n-roll'],
  ["valentine's-day", 'valentines-day']
]);

const FRONTMATTER_IMAGE_REGEX = /^image:\s*\/category\/([^\s]+)\.jpg\s*$/;

function migrateFile(file) {
  const original = readFileSync(file, 'utf8');
  const lines = original.split(/\r?\n/);
  let changed = false;
  let injectedNotice = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const m = line.match(FRONTMATTER_IMAGE_REGEX);
    if (!m) continue;
    const rawSlug = m[1];
    if (!MAPPING.has(rawSlug)) continue;
    const canonical = MAPPING.get(rawSlug);
    if (rawSlug === canonical) continue;
    lines[i] = `image: /category/${canonical}.jpg`;
    if (!injectedNotice) {
      // Insert a comment directly after the image line for traceability (optional; remove if noise)
      lines.splice(i + 1, 0, `# migrated: ${rawSlug} -> ${canonical}`);
      injectedNotice = true;
    }
    changed = true;
    // Continue scanning; multiple image lines per file unlikely but safe.
  }

  if (!changed) return false;

  const updated = lines.join('\n');
  if (updated !== original) {
    writeFileSync(file, updated, 'utf8');
  }
  return true;
}

async function run() {
  const pattern = 'src/content/knowledge-*/**/*.md';
  let files = [];
  if (globFn && globFn.sync) {
    files = globFn.sync(pattern, { nodir: true });
  } else {
    // crude fallback: shell out via child process (avoid complexity) -> but keep empty to avoid crash
    console.warn('WARN: glob sync not available; no files processed');
  }
  let touched = 0;
  for (const f of files) {
    if (migrateFile(f)) {
      touched++;
      process.stdout.write('.');
    }
  }
  process.stdout.write('\n');
  console.log(`Migration complete. Files updated: ${touched}`);
  if (MAPPING.has('forró')) {
    console.log('NOTE: Ensure optimized variants for canonical slug: forro (run optimizer if missing).');
  }
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
