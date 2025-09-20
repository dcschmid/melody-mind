import { defineConfig } from "astro/config";
import icon from "astro-icon";
import node from "@astrojs/node";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

import sitemap from "@astrojs/sitemap";
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
      sitemap: ["https://melody-mind.de/sitemap-index.xml", "https://melody-mind.de/sitemap.xml"],
      host: "melody-mind.de",
    }),
    sitemap({
      filter: (page) =>
        // Exclude our custom sitemap files from the default sitemap
        !page.includes("sitemap-") && !page.includes("sitemap-index"),
      i18n: {
        defaultLocale: "en",
        locales: {
          cn: "cn",
          da: "da",
          de: "de",
          en: "en",
          es: "es",
          fi: "fi",
          fr: "fr",
          it: "it",
          jp: "jp",
          nl: "nl",
          pt: "pt",
          ru: "ru",
          sv: "sv",
          uk: "uk",
        },
      },
      // Use our custom sitemap-index.xml as the main sitemap
      customPages: ["https://melody-mind.de/sitemap-index.xml"],
    }),
    metaTags(),
    // HTML minification disabled due to memory issues with large projects
    // minify(),
  ],
  adapter: node({
    mode: "standalone",
  }),
  security: {
    checkOrigin: true,
  },
  server: {
    host: "0.0.0.0",
    port: import.meta.env.PORT,
  },
  routes: [
    {
      src: "/api/health",
      dest: "src/pages/api/health.ts",
    },
  ],
  i18n: {
    defaultLocale: "en",
    locales: ["cn", "da", "de", "en", "es", "fi", "fr", "it", "jp", "nl", "pt", "ru", "sv", "uk"],
    routing: {
      prefixDefaultLocale: true,
    },
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
        port: 4321,
      },
    },
  },
});
