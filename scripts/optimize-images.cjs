#!/usr/bin/env node
/**
 * optimize-images.cjs
 *
 * Generic multi-group image optimization pipeline.
 * Consolidates logic used previously in optimize-category-images.cjs
 * and extends it to additional groups (e.g. podcast covers) with
 * per-group configuration.
 *
 * FEATURES
 * - Slugify + normalize filenames
 * - Detect duplicates & produce report per group
 * - Generate responsive variants (configurable widths & formats)
 * - Canonical webp generation
 * - Skips upscaling & recently fresh variants
 * - Idempotent & safe re-run
 *
 * USAGE
 *   yarn optimize:images                # all groups
 *   yarn optimize:images --group=podcast
 *   yarn optimize:images --group=category --force
 *
 * OUTPUT STRUCTURE
 *   src/assets/<group>/<slug>/<slug>-<width>.(webp|avif)
 *   src/assets/<group>/<slug>/<slug>.webp  (canonical)
 *
 * REPORTS
 *   tmp/image-optimization-<group>.json
 *
 * NOTE
 * Existing category specific script remains for backward compatibility.
 * Over time callers should migrate to this generic variant.
 */
const fs = require('fs');
const path = require('path');
let sharp;
try { sharp = require('sharp'); } catch { console.error('[optimize-images] sharp not installed. Run `yarn install:sharp` first.'); process.exit(1); }

const argv = process.argv.slice(2);
const argMap = Object.fromEntries(argv.filter(a => a.includes('=')).map(a => a.split('=')));
const onlyGroup = argMap['--group'];
const force = argv.includes('--force');

/** Group configuration */
const GROUPS = {
  category: {
    srcDir: path.resolve('public/category'),
    outBase: path.resolve('src/assets/category'),
    widths: [240, 480, 720, 960],
    canonicalMax: 1200,
    quality: { webp: 72, avif: 55, canonical: 78 },
    pattern: /\.jpe?g$/i
  },
  podcast: {
    srcDir: path.resolve('public/podcast'),
    outBase: path.resolve('src/assets/podcast'),
    widths: [240, 480, 720, 960],
    canonicalMax: 1200,
    quality: { webp: 72, avif: 55, canonical: 78 },
    pattern: /\.jpe?g$/i
  },
  playlist: {
    // Some playlist covers currently live only as optimized assets under src/assets/playlist.
    // To unify the pipeline we allow sourcing from public/playlist if originals are added there.
    // If the source directory is empty, the script will simply skip generation (idempotent).
    srcDir: path.resolve('public/playlist'),
    outBase: path.resolve('src/assets/playlist'),
    widths: [240, 480, 720, 960],
    canonicalMax: 1200,
    quality: { webp: 72, avif: 55, canonical: 78 },
    pattern: /\.jpe?g$/i
  }
};

const FORMATS = [
  { format: 'webp', key: 'webp' },
  { format: 'avif', key: 'avif' }
];

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '');
}

function ensureDir(p) { if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }); }

function gatherFiles(cfg) {
  if (!fs.existsSync(cfg.srcDir)) return [];
  return fs.readdirSync(cfg.srcDir).filter(f => cfg.pattern.test(f));
}

async function processFile(cfgKey, cfg, file, mapping, duplicates, stats) {
  const abs = path.join(cfg.srcDir, file);
  const baseNoExt = file.replace(/\.[^.]+$/, '');
  const slug = slugify(baseNoExt);
  if (!mapping[slug]) mapping[slug] = [];
  mapping[slug].push(file);
  if (mapping[slug].length > 1) duplicates.add(slug);
  const outDir = path.join(cfg.outBase, slug); ensureDir(outDir);
  let meta;
  try { meta = await sharp(abs).metadata(); } catch (e) { console.warn('[skip] meta', file, e.message); return; }
  const originalWidth = meta.width || 0;
  for (const { format } of FORMATS) {
    for (const w of cfg.widths) {
      if (originalWidth && w > originalWidth) continue;
      const outName = `${slug}-${w}.${format}`;
      const outPath = path.join(outDir, outName);
      if (!force && fs.existsSync(outPath)) {
        const ageMs = Date.now() - fs.statSync(outPath).mtimeMs;
        if (ageMs < 1000 * 60 * 60 * 24 * 7) { // 7 days
          stats.skippedFresh++;
          continue;
        }
      }
      try {
        let pipeline = sharp(abs).resize({ width: w, withoutEnlargement: true });
        if (format === 'webp') pipeline = pipeline.webp({ quality: cfg.quality.webp });
        else if (format === 'avif') pipeline = pipeline.avif({ quality: cfg.quality.avif });
        await pipeline.toFile(outPath);
        stats.generated++;
  console.log('✓', cfgKey, outName);
      } catch (e) { stats.failed++; console.warn('[fail]', outName, e.message); }
    }
  }
  const canonicalWidth = Math.min(originalWidth || cfg.canonicalMax, cfg.canonicalMax);
  const canonicalName = `${slug}.webp`;
  const canonicalPath = path.join(outDir, canonicalName);
  if (force || !fs.existsSync(canonicalPath)) {
    try {
      await sharp(abs).resize({ width: canonicalWidth, withoutEnlargement: true }).webp({ quality: cfg.quality.canonical }).toFile(canonicalPath);
      stats.generated++;
  console.log('✓', cfgKey, canonicalName);
    } catch (e) { stats.failed++; console.warn('[fail canonical]', canonicalName, e.message); }
  } else {
    stats.skippedExisting++;
  }
}

async function runGroup(cfgKey) {
  const cfg = GROUPS[cfgKey];
  if (!cfg) { console.error('Unknown group', cfgKey); return; }
  ensureDir(cfg.outBase); ensureDir('tmp');
  const files = gatherFiles(cfg);
  console.log(`[optimize-images] Group ${cfgKey}: ${files.length} source files`);
  const mapping = {}; const duplicates = new Set();
  const stats = { generated: 0, failed: 0, skippedFresh: 0, skippedExisting: 0 };
  for (const f of files) { await processFile(cfgKey, cfg, f, mapping, duplicates, stats); }
  const report = {
    group: cfgKey,
    generatedAt: new Date().toISOString(),
    sourceDir: cfg.srcDir,
    outBase: cfg.outBase,
    counts: {
      totalSource: files.length,
      uniqueSlugs: Object.keys(mapping).length,
      duplicateSlugs: duplicates.size,
      ...stats
    },
    duplicates: Array.from(duplicates),
    mapping,
    hint: `Use getOptimizedImageVariants('${cfgKey}', slug) to retrieve responsive sets.`
  };
  const reportFile = path.join('tmp', `image-optimization-${cfgKey}.json`);
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
  console.log(`[optimize-images] Report written: ${reportFile}`);
}

(async () => {
  const groups = onlyGroup ? [onlyGroup] : Object.keys(GROUPS);
  for (const g of groups) { await runGroup(g); }
})();
