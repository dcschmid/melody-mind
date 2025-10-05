#!/usr/bin/env node
/* eslint-env node */
// Scan for duplicate (legacy) slug directories under src/assets/category using the same
// normalization policy as images/slugNormalization.ts (duplicated here intentionally to avoid TS import friction).

const { readdirSync, statSync, writeFileSync } = require('fs');
const { join } = require('path');

function normalizeImageSlug(raw) {
  if (!raw) return '';
  let s = raw.normalize('NFKD');
  s = s.replace(/\p{M}+/gu, '');
  s = s.toLowerCase();
  s = s.replace(/[&+]/g, ' and ');
  s = s.replace(/@/g, ' at ');
  s = s.replace(/[^a-z0-9!-]+/g, '-');
  s = s.replace(/[!.]+$/g, '');
  s = s.replace(/[^a-z0-9-]+/g, '-');
  s = s.replace(/-{2,}/g, '-');
  s = s.replace(/^-|-$/g, '');
  return s;
}

const base = 'src/assets/category';
let dirs = [];
try {
  dirs = readdirSync(base).filter(d => {
    try { return statSync(join(base,d)).isDirectory(); } catch { return false; }
  });
} catch (e) {
  console.error('Cannot read directory:', base, e.message);
  process.exit(1);
}

const clusters = new Map();
for (const d of dirs) {
  const key = normalizeImageSlug(d);
  if (!clusters.has(key)) clusters.set(key, []);
  clusters.get(key).push(d);
}

const duplicates = {};
for (const [k, arr] of clusters.entries()) {
  if (arr.length > 1) {
    duplicates[k] = arr.sort();
  }
}

const outPath = 'tmp/duplicate-image-slugs.json';
try { writeFileSync(outPath, JSON.stringify(duplicates, null, 2)); } catch { /* ignore write error (best-effort) */ }

const total = Object.keys(duplicates).length;
console.log(`Duplicate slug clusters: ${total}`);
if (total) {
  console.log(JSON.stringify(duplicates, null, 2));
  console.log(`Report written: ${outPath}`);
} else {
  console.log('No duplicates detected.');
}
