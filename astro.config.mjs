import { defineConfig } from "astro/config";
import icon from "astro-icon";
import node from "@astrojs/node";
import compressor from "astro-compressor";
import playformCompress from "@playform/compress";
import { remarkReadingTime } from "./src/utils/remark-reading-time.mjs";
import path from "path";

import tailwindcss from "@tailwindcss/vite";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://melody-mind.de",
  output: "server",
  integrations: [icon(), compressor(), playformCompress(), sitemap()],
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
  // Enable content collections
  content: {
    markdown: {
      remarkPlugins: [remarkReadingTime],
      shikiConfig: {
        theme: "dracula",
        wrap: true,
      },
    },
  },
  vite: {
    resolve: {
      alias: {
        "@json": path.resolve("./src/json"),
        // ...other aliases...
      },
    },

    plugins: [tailwindcss()],
  },
});