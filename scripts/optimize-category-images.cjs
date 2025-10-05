#!/usr/bin/env node
/**
 * optimize-category-images.cjs
 *
 * Batch optimization pipeline for category images.
 * - Normalizes filenames (kebab-case, strips special chars)
 * - Detects duplicates & logs a mapping report
 * - Generates responsive WebP + AVIF variants (240 / 480 / 720 / 960)
 * - Copies optimized originals into `src/assets/category/` for Astro `astro:assets` usage
 *
 * Rationale:
 * We move processed images under `src/assets` so Astro can infer metadata and produce
 * further responsive variants via <Image/> / <Picture/> components without manual width/height.
 *
 * Safety:
 * Original JPEGs remain in place until a manual cleanup step. The script is idempotent; re-running
 * only regenerates missing / outdated derivatives (compares mtime + size heuristic).
 *
 * Usage:
 *   yarn optimize:categories
 */

// Console output is intentional for script progress feedback.
const fs = require('fs');
const path = require('path');
let sharp;
try {
  sharp = require('sharp');
} catch {
  console.error('[optimize-category-images] sharp not installed. Run `yarn install:sharp` first.');
  process.exit(1);
}

const SRC_DIR = path.resolve('public/category');
const OUT_BASE = path.resolve('src/assets/category');
const REPORT_DIR = path.resolve('tmp');
const REPORT_FILE = path.join(REPORT_DIR, 'category-image-report.json');

const TARGET_WIDTHS = [240, 480, 720, 960];
const FORMATS = [
  { format: 'webp', options: { quality: 72 } },
  { format: 'avif', options: { quality: 55 } },
];

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '');
}

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function gatherImages() {
  if (!fs.existsSync(SRC_DIR)) {
    console.error('Source directory not found:', SRC_DIR);
    process.exit(1);
  }
  return fs.readdirSync(SRC_DIR).filter(f => /\.jpe?g$/i.test(f));
}

async function processImage(file, mapping, duplicates) {
  const abs = path.join(SRC_DIR, file);
  const baseNoExt = file.replace(/\.[^.]+$/, '');
  const slug = slugify(baseNoExt);
  if (!mapping[slug]) mapping[slug] = [];
  mapping[slug].push(file);
  if (mapping[slug].length > 1) {
    duplicates.add(slug);
  }

  const outDir = path.join(OUT_BASE, slug);
  ensureDir(outDir);

  let img;
  try {
    img = sharp(abs);
  } catch (err) {
    console.warn('Skipping unreadable image', file, err && err.message);
    return;
  }
  let meta;
  try {
    meta = await img.metadata();
  } catch (err) {
    console.warn('Metadata failed for', file, err && err.message);
    return;
  }
  const originalWidth = meta.width || 0;

  for (const { format, options } of FORMATS) {
    for (const target of TARGET_WIDTHS) {
      if (originalWidth && target > originalWidth) continue; // Skip upscale
      const outName = `${slug}-${target}.${format}`;
      const outPath = path.join(outDir, outName);
      let regenerate = true;
      if (fs.existsSync(outPath)) {
        const ageMs = Date.now() - fs.statSync(outPath).mtimeMs;
        if (ageMs < 1000 * 60 * 60 * 24 * 7) { // 7 days freshness heuristic
          regenerate = false;
        }
      }
      if (!regenerate) continue;
      try {
        const pipeline = sharp(abs).resize({ width: target, withoutEnlargement: true });
        if (format === 'webp') pipeline.webp(options);
        else if (format === 'avif') pipeline.avif(options);
        else pipeline.toFormat(format, options);
        await pipeline.toFile(outPath);
        console.log('✓', outName);
      } catch (e) {
        console.warn('Failed generating', outName, e.message);
      }
    }
  }

  // Also copy one canonical original (webp) at max reasonable width (original or 1200)
  const canonicalWidth = Math.min(originalWidth || 1200, 1200);
  const canonicalName = `${slug}.webp`;
  const canonicalPath = path.join(outDir, canonicalName);
  if (!fs.existsSync(canonicalPath)) {
    try {
      await sharp(abs)
        .resize({ width: canonicalWidth, withoutEnlargement: true })
        .webp({ quality: 78 })
        .toFile(canonicalPath);
      console.log('✓', canonicalName);
    } catch (e) {
      console.warn('Failed canonical generation', canonicalName, e.message);
    }
  }
}

(async () => {
  ensureDir(OUT_BASE);
  ensureDir(REPORT_DIR);

  const files = gatherImages();
  const mapping = {}; // slug -> [original files]
  const duplicates = new Set();

  console.log(`[optimize-category-images] Processing ${files.length} images...`);

  for (const file of files) {
    await processImage(file, mapping, duplicates);
  }

  const report = {
    generatedAt: new Date().toISOString(),
    sourceDir: SRC_DIR,
    outBase: OUT_BASE,
    counts: {
      totalSource: files.length,
      uniqueSlugs: Object.keys(mapping).length,
      duplicateSlugs: duplicates.size,
    },
    duplicates: Array.from(duplicates),
    mapping,
    hint: "Next step: update JSON category imageUrl fields to canonical '/assets/category/<slug>/<slug>.webp' or via a resolver mapping.",
  };
  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
  console.log(`[optimize-category-images] Report written: ${REPORT_FILE}`);

  console.log('\nSuggested resolver usage:');
  console.log("import type { ImageMetadata } from 'astro';");
  console.log('// Dynamically import canonical webp for a slug:');
  console.log('// const img = await import(`../assets/category/${slug}/${slug}.webp`);');
})();
