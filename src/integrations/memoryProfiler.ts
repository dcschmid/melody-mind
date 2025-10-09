import { appendFileSync, existsSync, mkdirSync } from 'fs';

import type { AstroIntegration } from 'astro';

/**
 * Simple build-time memory profiler integration.
 * Activated only when process.env.MEMORY_PROFILING === '1'.
 * Writes newline-delimited JSON entries to `tmp/memory-profile.jsonl`.
 * Each entry contains rss, heapUsed, heapTotal, external, arrayBuffers and a label (phase or interval tick).
 */
export default function memoryProfiler(): AstroIntegration {
  const enabled = process.env.MEMORY_PROFILING === '1';
  const logFile = 'tmp/memory-profile.jsonl';
  let interval: NodeJS.Timeout | undefined;

  const writeSample = (label: string): void => {
    try {
      const m = process.memoryUsage();
      // memoryUsage() has these optional fields on recent Node versions
      const { rss, heapUsed, heapTotal } = m;
      const external = (m as NodeJS.MemoryUsage & { external?: number }).external ?? 0;
      const arrayBuffers = (m as NodeJS.MemoryUsage & { arrayBuffers?: number }).arrayBuffers ?? 0;
      const entry = {
        ts: new Date().toISOString(),
        label,
        rss,
        heapUsed,
        heapTotal,
        external,
        arrayBuffers,
      };
      appendFileSync(logFile, `${JSON.stringify(entry)}\n`);
    } catch {
      /* ignore */
    }
  };

  return {
    name: 'memory-profiler',
    hooks: {
      'astro:config:setup': (): void => {
        if (!enabled) {
          return;
        }
        if (!existsSync('tmp')) {
          mkdirSync('tmp');
        }
        writeSample('config:setup');
      },
      'astro:build:start': (): void => {
        if (!enabled) {
          return;
        }
        writeSample('build:start');
        interval = setInterval(() => writeSample('tick'), 2000);
      },
      'astro:build:generated': (): void => {
        if (!enabled) {
          return;
        }
        writeSample('build:generated');
      },
      'astro:build:done': (): void => {
        if (!enabled) {
          return;
        }
        writeSample('build:done');
        if (interval) {
          clearInterval(interval);
        }
      },
    },
  };
}
