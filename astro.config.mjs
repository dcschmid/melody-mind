import { defineConfig } from "astro/config";
import icon from "astro-icon";
import node from "@astrojs/node";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

import sitemap from "@astrojs/sitemap";
// Podcast data moved to separate subdomain
import robotsTxt from "astro-robots-txt";

import metaTags from "astro-meta-tags";
import memoryProfiler from "./src/integrations/memoryProfiler";
// Node global typings sometimes not picked by ESLint in ESM config context.
// Use globalThis to reference process safely.

// https://astro.build/config
export default defineConfig({
  site: "https://melody-mind.de",
  output: "server",
  // Prefetch for instant navigation — use a safer strategy for larger sites
  prefetch: {
    // Default to on-hover prefetch to avoid overfetching resources on large, content-heavy sites.
    // Explicit prefetches (link rel="prefetch"/rel="preload") can be used for truly critical assets.
    defaultStrategy: "hover",
    // prefetchAll intentionally disabled to prevent excessive network usage during initial load
  },

  integrations: [
    icon(),
  (globalThis.process && globalThis.process.env.MEMORY_PROFILING === '1') ? memoryProfiler() : undefined,
    robotsTxt({
      // Rely solely on the sitemap plugin output (sitemap-index.xml + chunked sitemaps)
      sitemap: ["https://melody-mind.de/sitemap-index.xml"],
      host: "melody-mind.de",
    }),
    sitemap({
      // Podcasts moved to separate subdomain - no filtering needed
      i18n: {
        // 2025-10 language reduction: only ship core locales
        defaultLocale: "en",
        locales: { en: "en", de: "de", es: "es", it: "it", fr: "fr", pt: "pt" },
      },
      // No customPages: rely entirely on plugin-managed index + chunks.
    }),
    metaTags(),
    // HTML minification disabled due to memory issues with large projects
    // minify(),
  ].filter(Boolean),
  adapter: node({
    mode: "standalone",
  }),
  server: {
    host: "0.0.0.0",
  },
  routes: [
    {
      src: "/api/health",
      dest: "src/pages/api/health.ts",
    },
  ],
  i18n: {
    defaultLocale: "en",
    locales: ["en", "de", "es", "it", "fr", "pt"],
    routing: { prefixDefaultLocale: true },
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@json": path.resolve("./src/json"),
        "@i18n": path.resolve("./src/i18n"),
        "@components": path.resolve("./src/components"),
        "@layouts": path.resolve("./src/layouts"),
        "@utils": path.resolve("./src/utils"),
        "@data": path.resolve("./src/data"),
        "@types": path.resolve("./src/types"),
        "@lib": path.resolve("./src/lib"),
        // Added to mirror tsconfig.json paths and fix Rollup resolution for middleware import
        "@constants": path.resolve("./src/constants"),
        "@scripts": path.resolve("./src/scripts"),
      },
    },
    // Astro 5.0+ dependency optimization
    optimizeDeps: {
      include: ["@astrojs/node", "sharp"],
      exclude: ["@fontsource/atkinson-hyperlegible"],
    },
    // Performance optimizations
    server: {
      hmr: {
        port: 4322,
      },
    },
  },
});
