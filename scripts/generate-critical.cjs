#!/usr/bin/env node

/**
 * generate-critical.cjs
 *
 * Build-time script to extract critical CSS from all HTML files in the `dist` directory
 * and write a combined `dist/critical.css` file.
 *
 * Usage: node scripts/generate-critical.cjs
 *
 * Notes:
 * - Uses the `critical` package programmatic API.
 * - Traverses `dist` recursively, runs critical extraction per HTML file and aggregates CSS.
 * - Keeps the script defensive: if `dist` is missing or extraction fails for a file, it logs and continues.
 *
 * This script is CommonJS to match the project's build scripts.
 */

const fs = require('fs');
const path = require('path');

async function main() {
  const projectRoot = process.cwd();
  const distDir = path.join(projectRoot, 'dist');
  const outFile = path.join(distDir, 'critical.css');

  // Try to require critical; if it's missing, fail with a helpful message.
  let critical;
  try {
    critical = require('critical');
  } catch (err) {
    console.error(
      '\n[generate-critical] The `critical` package is not available. Please install it as a devDependency.\n' +
        'You can run: yarn add -D critical\n'
    );
    process.exitCode = 0; // non-fatal for CI postbuild hook, but signal via logs
    return;
  }

  if (!fs.existsSync(distDir)) {
    console.warn(`[generate-critical] dist directory not found at "${distDir}". Skipping critical CSS generation.`);
    process.exitCode = 0;
    return;
  }

  /**
   * Recursively find .html files under a directory.
   * Returns paths relative to `baseDir`.
   */
  function findHtmlFiles(baseDir) {
    const result = [];

    function walk(dir) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          walk(full);
        } else if (entry.isFile() && full.endsWith('.html')) {
          const rel = path.relative(baseDir, full);
          result.push(rel.split(path.sep).join('/')); // use forward slashes for critical API
        }
      }
    }

    walk(baseDir);
    return result;
  }

  const htmlFiles = findHtmlFiles(distDir);

  if (!htmlFiles.length) {
    console.warn(`[generate-critical] No HTML files found in "${distDir}". Nothing to do.`);
    process.exitCode = 0;
    return;
  }

  console.log(`[generate-critical] Found ${htmlFiles.length} HTML files. Starting extraction...`);

  let aggregatedCss = '';
  const processed = [];
  const failed = [];

  // Process files sequentially to avoid high memory/CPU use
  for (const relPath of htmlFiles) {
    try {
      console.log(`[generate-critical] Processing: ${relPath}`);
      // Use critical.generate programmatic API
      // Options:
      // - base: base directory for resolving assets
      // - src: the HTML file relative to base
      // - inline: false => returns css (not inlined HTML)
      // - extract: true => extract styles used in the page
      // - minify: true => minify generated CSS
      // - width/height: viewport for extraction
      // The API returns an object; when inline=false it usually contains `.css`
      // Wrap in try/catch to continue on individual failures.
      // eslint-disable-next-line no-await-in-loop
      const res = await critical.generate({
        base: distDir,
        src: relPath,
        inline: false,
        extract: true,
        minify: true,
        width: 1300,
        height: 900,
        // ignore options left default; add more options if necessary
      });

      if (res && typeof res.css === 'string') {
        // Add a file comment marker for debugging
        aggregatedCss += `/* ---- Critical CSS from: ${relPath} ---- */\n`;
        aggregatedCss += res.css.trim() + '\n\n';
        processed.push(relPath);
      } else {
        console.warn(`[generate-critical] No CSS returned for ${relPath}.`);
        failed.push(relPath);
      }
    } catch (err) {
      console.error(`[generate-critical] Failed extracting critical CSS for ${relPath}: ${err && err.message ? err.message : err}`);
      failed.push(relPath);
      // continue with next file
    }
  }

  if (!aggregatedCss) {
    console.warn('[generate-critical] No critical CSS was extracted from the HTML files.');
    process.exitCode = 0;
    return;
  }

  // Ensure dist directory exists (should), then write output file
  try {
    fs.writeFileSync(outFile, aggregatedCss, 'utf8');
    console.log(`[generate-critical] Wrote aggregated critical CSS to: ${outFile}`);
    console.log(`[generate-critical] Files processed: ${processed.length}, failed: ${failed.length}`);
    if (failed.length) {
      console.warn(`[generate-critical] Failed files (sample): ${failed.slice(0, 5).join(', ')}`);
    }
  } catch (err) {
    console.error(`[generate-critical] Failed to write output file ${outFile}: ${err && err.message ? err.message : err}`);
    process.exitCode = 1;
    return;
  }

  // Success
  process.exitCode = 0;
}

if (require.main === module) {
  // Run and catch any unhandled rejections
  main().catch((err) => {
    console.error('[generate-critical] Unexpected error:', err);
    // do not crash the entire build pipeline (postbuild is tolerable), but set non-zero to signal issues if you prefer
    process.exitCode = 1;
  });
}

module.exports = { main };
