import { defineConfig } from "astro/config";
import icon from "astro-icon";
import node from "@astrojs/node";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

import sitemap from "@astrojs/sitemap";
import enPodcastsJson from "./src/data/podcasts/en.json" assert { type: "json" };
import robotsTxt from "astro-robots-txt";

import metaTags from "astro-meta-tags";

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
    robotsTxt({
      // Rely solely on the sitemap plugin output (sitemap-index.xml + chunked sitemaps)
      sitemap: ["https://melody-mind.de/sitemap-index.xml"],
      host: "melody-mind.de",
    }),
    sitemap({
      filter: (page) => {
        // Exclude unavailable podcast episode pages from sitemap output.
        // Generated pages look like /{lang}/podcasts/{episode-id}/
        if (page.includes("/podcasts/")) {
          const parts = page.split("/podcasts/");
          if (parts.length > 1) {
            const tail = parts[1];
            const id = tail.split("/").filter(Boolean)[0];
            if (id) {
              try {
                const list = (enPodcastsJson.podcasts || []).filter((p) => p && p.isAvailable);
                const isAvailable = list.some((p) => p.id === id);
                if (!isAvailable) return false;
              } catch {
                // Never fail build due to filter errors
              }
            }
          }
        }
        return true;
      },
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
  ],
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
