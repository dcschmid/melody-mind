import { defineConfig } from "astro/config";
import icon from "astro-icon";
import node from "@astrojs/node";
import path from "path";

import sitemap from "@astrojs/sitemap";
import robotsTxt from "astro-robots-txt";

import metaTags from "astro-meta-tags";

// https://astro.build/config
export default defineConfig({
  site: "https://melody-mind.de",
  output: "server",
  // Astro 5.0+ optimizations
  build: {
    inlineStylesheets: 'auto',
    assets: '_astro',
  },
  // Image optimization (Astro 5.0+ uses Sharp by default)
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
  integrations: [
    icon(),
    robotsTxt({
      sitemap: [
        "https://melody-mind.de/sitemap-index.xml",
        "https://melody-mind.de/sitemap.xml"
      ],
      host: "melody-mind.de"
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
      },
    },
    build: {
      // Astro 5.0+ optimized build settings
      minify: 'esbuild',
      chunkSizeWarningLimit: 1000,
      target: ['es2022', 'chrome89', 'firefox89', 'safari15'],
      rollupOptions: {
        output: {
          // Better chunk splitting for caching
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              if (id.includes('astro')) return 'astro-vendor';
              if (id.includes('@astrojs')) return 'astro-integrations';
              return 'vendor';
            }
            if (id.includes('/src/scripts/')) return 'game-scripts';
            if (id.includes('/src/utils/')) return 'utils';
          },
        },
      },
    },
    // Astro 5.0+ dependency optimization
    optimizeDeps: {
      include: ['@astrojs/node', 'sharp'],
      exclude: ['@fontsource/atkinson-hyperlegible', '@fontsource/source-sans-pro'],
    },
  },
});
