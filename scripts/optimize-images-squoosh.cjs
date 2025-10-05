#!/usr/bin/env node
/**
 * optimize-images-squoosh.cjs
 *
 * Pure JavaScript / WASM Variante der Bild-Pipeline ohne native sharp Abhängigkeit.
 * Verwendet @squoosh/cli on-demand (npx) um WebP, AVIF UND zusätzlich optimierte JPEGs zu erzeugen.
 *
 * KONZEPT "Input Staging":
 *  - Für jede Gruppe existiert ein definierter Input-Ordner unter: staging/<group>/
 *  - Skript liest dort alle .jpg/.jpeg/.png Dateien.
 *  - Für jede Datei werden responsive Varianten erzeugt und unter src/assets/<group>/<slug>/ abgelegt.
 *  - Optional (--cleanup) wird die Quelldatei nach erfolgreicher Verarbeitung aus staging entfernt.
 *  - Damit bleibt public/ schlank und nur optimierte Assets werden ausgeliefert.
 *
 * NAMING-SCHEMA:
 *   <slug>-<width>.webp | <slug>-<width>.avif | <slug>-<width>.jpg
 *   <slug>.webp (canonical) | <slug>.jpg (canonical JPEG Fallback)
 *
 * AUFRUF BEISPIELE:
 *   node scripts/optimize-images-squoosh.cjs                # alle Gruppen
 *   node scripts/optimize-images-squoosh.cjs --group=podcast
 *   node scripts/optimize-images-squoosh.cjs --group=category --force --cleanup
 *
 * FLAGS:
 *   --group=<name>    Nur eine Gruppe verarbeiten
 *   --force           Existierende Varianten immer neu rendern
 *   --cleanup         Erfolgreich verarbeitete Originale aus staging entfernen
 *   --dry-run         Keine Schreiboperationen (nur Simulation + Report)
 */
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const argv = process.argv.slice(2);
const argMap = Object.fromEntries(argv.filter(a => a.includes('=')).map(a => a.split('=')));
const onlyGroup = argMap['--group'];
const force = argv.includes('--force');
const cleanup = argv.includes('--cleanup');
const dryRun = argv.includes('--dry-run');

const GROUPS = {
  category: {
    stagingDir: path.resolve('staging/category'),
    outBase: path.resolve('src/assets/category'),
    widths: [240, 480, 720, 960],
    canonicalMax: 1200,
    webpQuality: 72,
    avifCqLevel: 33,
    jpegQuality: 78
  },
  podcast: {
    stagingDir: path.resolve('staging/podcast'),
    outBase: path.resolve('src/assets/podcast'),
    widths: [240, 480, 720, 960],
    canonicalMax: 1200,
    webpQuality: 72,
    avifCqLevel: 33,
    jpegQuality: 78
  }
};

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-').replace(/-{2,}/g, '-').replace(/^-|-$/g, '');
}

function collectSources(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => /\.(jpe?g|png)$/i.test(f));
}

function ensureDir(p) { if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }); }

function fileFresh(filePath) {
  if (!fs.existsSync(filePath)) return false;
  const ageMs = Date.now() - fs.statSync(filePath).mtimeMs;
  return ageMs < 1000 * 60 * 60 * 24 * 7; // 7 Tage
}

/**
 * Führt einen einzelnen @squoosh/cli Aufruf aus.
 */
function runSquoosh(args) {
  return new Promise((resolve, reject) => {
    const proc = spawn('npx', ['--yes', '@squoosh/cli', ...args], { stdio: 'inherit' });
    proc.on('close', code => {
      if (code === 0) resolve(); else reject(new Error(`squoosh exit ${code}`));
    });
  });
}

async function generateVariant(cfg, absIn, slug, width, outDir, qualities, stats) {
  const base = `${slug}-${width}`;
  const webpPath = path.join(outDir, `${base}.webp`);
  const avifPath = path.join(outDir, `${base}.avif`);
  const jpgPath = path.join(outDir, `${base}.jpg`);
  if (!force && fileFresh(webpPath) && fileFresh(avifPath) && fileFresh(jpgPath)) {
    stats.skippedFresh += 1; return;
  }
  if (dryRun) { stats.generated += 3; return; }
  // Einzelne Aufrufe, damit wir klar benannte Dateien erhalten
  try {
    await runSquoosh([
      '--resize', `{width:${width}}`,
      '--webp', `{quality:${qualities.webpQuality}}`,
      '--output-dir', outDir,
      absIn
    ]);
    fs.renameSync(path.join(outDir, `${path.basename(absIn, path.extname(absIn))}.webp`), webpPath);
    await runSquoosh([
      '--resize', `{width:${width}}`,
      '--avif', `{cqLevel:${qualities.avifCqLevel}}`,
      '--output-dir', outDir,
      absIn
    ]);
    fs.renameSync(path.join(outDir, `${path.basename(absIn, path.extname(absIn))}.avif`), avifPath);
    await runSquoosh([
      '--resize', `{width:${width}}`,
      '--mozjpeg', `{quality:${qualities.jpegQuality}}`,
      '--output-dir', outDir,
      absIn
    ]);
    fs.renameSync(path.join(outDir, `${path.basename(absIn, path.extname(absIn))}.jpg`), jpgPath);
    stats.generated += 3;
    console.log('✓ variant', base);
  } catch (e) {
    stats.failed += 1; console.warn('[variant-fail]', base, e.message);
  }
}

async function generateCanonical(cfg, absIn, slug, outDir, qualities, stats) {
  const canonicalWebp = path.join(outDir, `${slug}.webp`);
  const canonicalJpg = path.join(outDir, `${slug}.jpg`);
  if (!force && fileFresh(canonicalWebp) && fileFresh(canonicalJpg)) { stats.skippedExisting += 1; return; }
  if (dryRun) { stats.generated += 2; return; }
  try {
    await runSquoosh([
      '--resize', `{width:${cfg.canonicalMax}}`,
      '--webp', `{quality:${qualities.webpQuality}}`,
      '--output-dir', outDir,
      absIn
    ]);
    fs.renameSync(path.join(outDir, `${path.basename(absIn, path.extname(absIn))}.webp`), canonicalWebp);
    await runSquoosh([
      '--resize', `{width:${cfg.canonicalMax}}`,
      '--mozjpeg', `{quality:${qualities.jpegQuality}}`,
      '--output-dir', outDir,
      absIn
    ]);
    fs.renameSync(path.join(outDir, `${path.basename(absIn, path.extname(absIn))}.jpg`), canonicalJpg);
    stats.generated += 2;
    console.log('✓ canonical', slug);
  } catch (e) { stats.failed += 1; console.warn('[canonical-fail]', slug, e.message); }
}

async function processFile(cfgKey, cfg, file, stats) {
  const absIn = path.join(cfg.stagingDir, file);
  const baseNoExt = file.replace(/\.[^.]+$/, '');
  const slug = slugify(baseNoExt);
  const outDir = path.join(cfg.outBase, slug); ensureDir(outDir);
  for (const w of cfg.widths) {
    await generateVariant(cfg, absIn, slug, w, outDir, cfg, stats);
  }
  await generateCanonical(cfg, absIn, slug, outDir, cfg, stats);
  if (cleanup && !dryRun) {
    try { fs.unlinkSync(absIn); stats.cleaned += 1; } catch {/* ignore */}
  }
  stats.processed += 1;
}

async function runGroup(cfgKey) {
  const cfg = GROUPS[cfgKey]; if (!cfg) { console.error('Unknown group', cfgKey); return; }
  ensureDir(cfg.stagingDir); ensureDir(cfg.outBase); ensureDir('tmp');
  const files = collectSources(cfg.stagingDir);
  console.log(`[squoosh] Group ${cfgKey}: ${files.length} staging sources`);
  const stats = { processed: 0, generated: 0, failed: 0, skippedFresh: 0, skippedExisting: 0, cleaned: 0 };
  for (const f of files) { await processFile(cfgKey, cfg, f, stats); }
  const report = {
    group: cfgKey,
    generatedAt: new Date().toISOString(),
    stagingDir: cfg.stagingDir,
    outBase: cfg.outBase,
    counts: stats,
    hint: `Use getOptimizedImageVariants('${cfgKey}', slug)`
  };
  if (!dryRun) fs.writeFileSync(path.join('tmp', `image-optimization-${cfgKey}-squoosh.json`), JSON.stringify(report, null, 2));
  console.log('[squoosh] Report', JSON.stringify(report.counts));
}

(async () => {
  const groups = onlyGroup ? [onlyGroup] : Object.keys(GROUPS);
  for (const g of groups) { await runGroup(g); }
})();
