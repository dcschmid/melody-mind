import { defineConfig } from "astro/config";
import icon from "astro-icon";
import node from "@astrojs/node";
import compressor from "astro-compressor";
import path from "path";

import tailwindcss from "@tailwindcss/vite";

import sitemap from "@astrojs/sitemap";

import metaTags from "astro-meta-tags";

// https://astro.build/config
export default defineConfig({
  site: "https://melody-mind.de",
  output: "server",
  integrations: [
    icon(),
    compressor(),
    sitemap({
      filter: (page) =>
        // Exclude our custom sitemap files from the default sitemap
        !page.includes("sitemap-") && !page.includes("sitemap-index"),
      i18n: {
        defaultLocale: "en",
        locales: {
          en: "en",
          de: "de",
          es: "es",
          fr: "fr",
          it: "it",
          pt: "pt",
          da: "da",
          nl: "nl",
          sv: "sv",
          fi: "fi",
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
    locales: ["de", "en", "es", "fr", "it", "pt", "da", "nl", "sv", "fi"],
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

    plugins: [tailwindcss()],
  },
});
