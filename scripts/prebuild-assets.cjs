#!/usr/bin/env node
/**
 * prebuild-assets.cjs
 *
 * Lightweight pre-build aggregation step to offload heavier image variant generation
 * from the Astro build phase. Intentionally sequential & conservative to avoid
 * spiking memory before the main build starts.
 *
 * Currently delegates to existing optimize-images pipeline for category & podcast
 * images (idempotent). Additional asset pipelines (e.g. knowledge images) can be
 * appended here once stabilized.
 *
 * Design goals:
 * - Fail soft: log warnings, exit(0) unless a truly unexpected error occurs
 * - Skip when sharp not present (install:sharp runs in main build script)
 * - Keep memory peak low via SHARP_CONCURRENCY=2 (already set in build scripts)
 */

const { spawn } = require('child_process');

async function run(cmd, args, label) {
  return new Promise((resolve) => {
    const p = spawn(cmd, args, { stdio: 'inherit' });
    p.on('close', (code) => {
      if (code !== 0) {
        console.warn(`[prebuild-assets] Step '${label}' exited with code ${code}`);
      }
      resolve();
    });
  });
}

(async () => {
  console.log('[prebuild-assets] Starting asset preparations');
  // Image optimization (responsive variants)
  await run('node', ['scripts/optimize-images.cjs', '--group=category'], 'optimize-category');
  await run('node', ['scripts/optimize-images.cjs', '--group=podcast'], 'optimize-podcast');
  console.log('[prebuild-assets] Completed');
})();
