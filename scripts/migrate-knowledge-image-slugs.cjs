#!/usr/bin/env node
/* eslint-env node */
// Knowledge image frontmatter migration (special slugs -> canonical normalized slug forms).

const { readFileSync, writeFileSync } = require('fs');
const glob = require('glob');

const MAPPING = new Map([
  ['female-r&b-divas', 'female-randb-divas'],
  ['focus-&-concentration', 'focus-and-concentration'],
  ['forró', 'forro'],
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
      lines.splice(i + 1, 0, `# migrated: ${rawSlug} -> ${canonical}`);
      injectedNotice = true;
    }
    changed = true;
  }

  if (!changed) return false;
  const updated = lines.join('\n');
  if (updated !== original) writeFileSync(file, updated, 'utf8');
  return true;
}

function run() {
  const files = glob.sync('src/content/knowledge-*/**/*.md', { nodir: true });
  let touched = 0;
  for (const f of files) {
    if (migrateFile(f)) {
      process.stdout.write('.');
      touched++;
    }
  }
  process.stdout.write('\n');
  console.log(`Migration complete. Files updated: ${touched}`);
  console.log('NOTE: Ensure optimized variants for canonical slug: forro (run optimizer if missing).');
}

run();
