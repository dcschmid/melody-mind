import { defineConfig } from "astro/config";
import icon from "astro-icon";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import robotsTxt from "astro-robots-txt";
import metaTags from "astro-meta-tags";

// https://astro.build/config
export default defineConfig({
  site: "https://knowledge.melody-mind.de",
  output: "static",
  
  prefetch: {
    defaultStrategy: "hover",
  },

  integrations: [
    icon(),
    robotsTxt({
      sitemap: ["https://knowledge.melody-mind.de/sitemap-index.xml"],
      host: "knowledge.melody-mind.de",
    }),
    sitemap({
      i18n: {
        defaultLocale: "en",
        locales: { en: "en", de: "de", es: "es", it: "it", fr: "fr", pt: "pt" },
      },
    }),
    metaTags(),
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
        "@components": path.resolve("./src/components"),
        "@layouts": path.resolve("./src/layouts"),
        "@utils": path.resolve("./src/utils"),
        "@constants": path.resolve("./src/constants"),
        "@i18n": path.resolve("./src/i18n"),
        "@content": path.resolve("./src/content"),
      },
    },
    optimizeDeps: {
      include: ["sharp"],
      exclude: ["@fontsource/atkinson-hyperlegible"],
    },
  },
  
  markdown: {
    shikiConfig: {
      theme: "github-dark",
    },
  },
});
