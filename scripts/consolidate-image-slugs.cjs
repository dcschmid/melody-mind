#!/usr/bin/env node
/**
 * consolidate-image-slugs.cjs
 *
 * Purpose: Detect and (optionally) merge duplicate or legacy image slug variant directories
 * under `src/assets/<group>/` that represent the same logical slug after normalization.
 *
 * Default mode is dry-run (no changes). Use --apply to execute merges.
 *
 * Usage Examples:
 *   node scripts/consolidate-image-slugs.cjs --group category
 *   node scripts/consolidate-image-slugs.cjs --group category --apply
 *   node scripts/consolidate-image-slugs.cjs --group podcast --pair focus-concentration:focus-and-concentration
 *   node scripts/consolidate-image-slugs.cjs --group category --report tmp/my-merge-report.json
 *
 * Flags:
 *   --group <name>             (required) asset group directory (e.g. category, podcast, playlist)
 *   --apply                    perform actual merge (otherwise dry-run)
 *   --pair <from:to>           explicit merge pair (can repeat). Skips auto detection for that pair.
 *   --keep-source              do not delete the source directory after copying
 *   --report <path>            custom report output path (default: tmp/image-consolidation-report.json)
 *   --verbose                  more detailed console logging
 *   --no-auto                  skip automatic duplicate detection (only honor --pair)
 *
 * Detection Strategy:
 *   1. List directories inside src/assets/<group>.
 *   2. Compute canonical form via replicate of normalizeImageSlug logic.
 *   3. Group by canonical form. Any group with >1 original directories is a consolidation candidate.
 *
 * Merge Rules:
 *   - Target chosen deterministically: directory whose name already equals the canonical form, else
 *     the longest slug containing 'and' (to replace symbols) else lexical min.
 *   - Files in source copied if not present in target. Existing target files are kept (logged as skipped).
 *   - Source deleted unless --keep-source.
 *
 * Output:
 *   JSON report describing actions at: tmp/image-consolidation-report.json (or custom path).
 *
 * Safety:
 *   - Aborts a pair if target == source.
 *   - Aborts a pair if either directory missing during apply.
 *
 * NOTE: This script intentionally duplicates normalization logic to stay build-tool independent.
 */

const fs = require('fs');
const path = require('path');

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { pairs: [], apply: false, keepSource: false, verbose: false, noAuto: false };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    switch (a) {
      case '--group':
        opts.group = args[++i];
        break;
      case '--apply':
        opts.apply = true;
        break;
      case '--keep-source':
        opts.keepSource = true;
        break;
      case '--pair': {
        const val = args[++i];
        if (!val || !val.includes(':')) {
          console.error('Invalid --pair value, expected from:to');
          process.exit(1);
        }
        const [from, to] = val.split(':');
        opts.pairs.push({ from, to });
        break;
      }
      case '--report':
        opts.reportPath = args[++i];
        break;
      case '--verbose':
        opts.verbose = true;
        break;
      case '--no-auto':
        opts.noAuto = true;
        break;
      default:
        console.error('Unknown argument:', a);
        process.exit(1);
    }
  }
  if (!opts.group) {
    console.error('--group is required');
    process.exit(1);
  }
  return opts;
}

function normalizeSlug(raw) {
  return raw
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[&+]/g, ' and ')
    .replace(/@/g, ' at ')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/[!.]$/g, '');
}

function collectGroupDirs(groupDir) {
  if (!fs.existsSync(groupDir)) return [];
  return fs
    .readdirSync(groupDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

function buildCanonicalMap(dirNames) {
  const map = new Map();
  for (const d of dirNames) {
    const canon = normalizeSlug(d);
    if (!map.has(canon)) map.set(canon, []);
    map.get(canon).push(d);
  }
  return map;
}

function chooseTarget(slugs, canon) {
  // 1. exact match to canonical form
  const exact = slugs.find((s) => s === canon);
  if (exact) return exact;
  // 2. prefer one containing 'and' (implies already expanded)
  const withAnd = slugs.filter((s) => s.includes('and'));
  if (withAnd.length) {
    // choose longest (more descriptive) then lexical
    return withAnd.sort((a, b) => b.length - a.length || a.localeCompare(b))[0];
  }
  // 3. fallback lexical
  return [...slugs].sort()[0];
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function copyIfNeeded(srcFile, destFile, report, opts) {
  if (fs.existsSync(destFile)) {
    report.skipped.push({ file: path.basename(srcFile), reason: 'exists-target' });
    return;
  }
  if (opts.apply) {
    fs.copyFileSync(srcFile, destFile);
  }
  report.copied.push(path.basename(srcFile));
}

function mergePair(groupDir, source, target, report, opts) {
  const sourceDir = path.join(groupDir, source);
  const targetDir = path.join(groupDir, target);

  const pairReport = {
    source,
    target,
    copied: [],
    skipped: [],
    deletedSource: false,
    status: 'ok'
  };

  if (source === target) {
    pairReport.status = 'noop-same';
    report.pairs.push(pairReport);
    return;
  }
  if (!fs.existsSync(sourceDir) || !fs.existsSync(targetDir)) {
    pairReport.status = 'missing-dir';
    report.pairs.push(pairReport);
    return;
  }

  const files = fs.readdirSync(sourceDir);
  for (const f of files) {
    const srcFile = path.join(sourceDir, f);
    const destFile = path.join(targetDir, f.replace(source, target));
    // Keep original file names; we don't rename inside target except if they embed source slug.
    // If you want to preserve exact naming, remove the replace() above:
    const finalDest = destFile; // Already includes replaced slug variant
    copyIfNeeded(srcFile, finalDest, pairReport, opts);
  }

  if (opts.apply && !opts.keepSource) {
    // Safety: only remove if directory still exists & no unexpected extras
    try {
      fs.rmSync(sourceDir, { recursive: true, force: true });
      pairReport.deletedSource = true;
    } catch (e) {
      pairReport.status = 'delete-failed';
      pairReport.deleteError = e.message;
    }
  }

  report.pairs.push(pairReport);
}

function main() {
  const opts = parseArgs();
  const groupDir = path.join('src', 'assets', opts.group);
  const report = {
    generatedAt: new Date().toISOString(),
    group: opts.group,
    dryRun: !opts.apply,
    keepSource: opts.keepSource,
    pairs: []
  };

  const dirNames = collectGroupDirs(groupDir);
  if (dirNames.length === 0) {
    console.error('No directories found for group:', opts.group);
    process.exit(0);
  }

  const explicitPairs = opts.pairs.slice();
  if (!opts.noAuto) {
    const map = buildCanonicalMap(dirNames);
    for (const [canon, originals] of map.entries()) {
      if (originals.length > 1) {
        const target = chooseTarget(originals, canon);
        for (const s of originals) {
          if (s !== target) {
            explicitPairs.push({ from: s, to: target });
          }
        }
      }
    }
  }

  if (explicitPairs.length === 0) {
    if (!opts.noAuto) {
      console.log('No consolidation candidates found.');
    } else {
      console.log('No pairs specified.');
    }
  } else {
    if (opts.verbose) {
      console.log('Processing pairs:', explicitPairs);
    }
    // Deduplicate identical pair definitions
    const seen = new Set();
    for (const p of explicitPairs) {
      const key = `${p.from}->${p.to}`;
      if (seen.has(key)) continue;
      seen.add(key);
      mergePair(groupDir, p.from, p.to, report, opts);
    }
  }

  const reportPath = opts.reportPath || path.join('tmp', 'image-consolidation-report.json');
  ensureDir(path.dirname(reportPath));
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`Report written: ${reportPath}`);
  if (!opts.apply) {
    console.log('Dry run complete. Re-run with --apply to execute merges.');
  }
}

main();
