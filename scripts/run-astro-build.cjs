#!/usr/bin/env node
// Build runner to set sane defaults for Astro without forcing overrides.

const { spawn } = require('node:child_process');
const path = require('node:path');
const fs = require('node:fs');

const repoRoot = path.resolve(__dirname, '..');
const env = { ...process.env };

if (!env.ASTRO_TELEMETRY) {
  env.ASTRO_TELEMETRY = 'off';
}
if (!env.VITE_THREADS) {
  env.VITE_THREADS = '4';
}
if (!env.SHARP_CONCURRENCY) {
  env.SHARP_CONCURRENCY = '2';
}
if (!env.NODE_ENV) {
  env.NODE_ENV = 'production';
}
if (!env.NODE_OPTIONS) {
  env.NODE_OPTIONS = '--max-old-space-size=6144';
}

const binDir = path.join(repoRoot, 'node_modules', '.bin');
const binName = process.platform === 'win32' ? 'astro.cmd' : 'astro';
const binCandidate = path.join(binDir, binName);

let command;
let args;
let shell = false;

if (fs.existsSync(binCandidate)) {
  command = binCandidate;
  args = ['build'];
  shell = process.platform === 'win32';
} else {
  try {
    const astroCli = require.resolve('astro/astro.js', { paths: [repoRoot] });
    command = process.execPath;
    args = [astroCli, 'build'];
  } catch (error) {
    console.error('Unable to locate local Astro CLI. Ensure `yarn install` has been run.');
    if (process.env.DEBUG || process.env.CI) {
      console.error('Lookup error:', error);
    }
    process.exit(1);
  }
}

const child = spawn(command, args, {
  env,
  stdio: 'inherit',
  cwd: repoRoot,
  shell,
});

child.on('error', (error) => {
  console.error('Failed to launch Astro build:', error);
  process.exit(error && typeof error.code === 'number' ? error.code : 1);
});

child.on('exit', (code, signal) => {
  if (typeof code === 'number') {
    process.exit(code);
  }
  const message = signal ? `Process exited due to signal ${signal}` : 'Process exited without code.';
  console.error(message);
  process.exit(1);
});
