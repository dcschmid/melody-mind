#!/usr/bin/env node
// Build runner to set sane defaults for Astro without forcing overrides.

const { spawn } = require('node:child_process');
const path = require('node:path');

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

const astroCommand = process.platform === 'win32' ? 'astro.cmd' : 'astro';

const child = spawn(astroCommand, ['build'], {
  env,
  stdio: 'inherit',
  cwd: path.resolve(__dirname, '..'),
  shell: process.platform === 'win32',
});

child.on('exit', (code, signal) => {
  if (typeof code === 'number') {
    process.exit(code);
  }
  const message = signal ? `Process exited due to signal ${signal}` : 'Process exited without code.';
  console.error(message);
  process.exit(1);
});
