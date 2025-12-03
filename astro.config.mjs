import { defineConfig } from "astro/config";
import icon from "astro-icon";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import robotsTxt from "astro-robots-txt";
import metaTags from "astro-meta-tags";

import playformCompress from "@playform/compress";

// https://astro.build/config
export default defineConfig({
  site: "https://melody-mind.de",
  output: "static",
  
  prefetch: {
    defaultStrategy: "hover",
  },

  integrations: [icon(), robotsTxt({
    sitemap: ["https://melody-mind.de/sitemap-index.xml"],
    host: "melody-mind.de",
  }), sitemap(), metaTags(), playformCompress({			Image: false,})],
  
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
    routing: { prefixDefaultLocale: false },
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