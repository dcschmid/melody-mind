import { defineConfig } from "astro/config";
import path from "path";
import sitemap from "@astrojs/sitemap";
import robotsTxt from "astro-robots-txt";
import metaTags from "astro-meta-tags";
import mdx from "@astrojs/mdx";
import minify from "astro-minify-html-swc";

// https://astro.build/config
export default defineConfig({
  site: "https://quiz.melody-mind.de",
  output: "static",

  prefetch: {
    defaultStrategy: "hover",
  },

  integrations: [
    mdx(),
    robotsTxt({
      sitemap: ["https://quiz.melody-mind.de/sitemap-index.xml"],
      host: "quiz.melody-mind.de",
    }),
    sitemap(),
    metaTags(),
    minify(),
  ],

  vite: {
    resolve: {
      alias: {
        "@shared-icons": path.resolve("../../packages/shared-icons/src"),
        "@shared-ui": path.resolve("../../packages/shared-ui/src"),
        "@shared-utils": path.resolve("../../packages/shared-utils/src"),
        "@components": path.resolve("./src/components"),
        "@layouts": path.resolve("./src/layouts"),
        "@utils": path.resolve("./src/utils"),
        "@constants": path.resolve("./src/constants"),
        "@content": path.resolve("./src/content"),
        "@types": path.resolve("./src/types"),
        "@data": path.resolve("./src/data"),
        "@styles": path.resolve("./src/styles"),
        "@scripts": path.resolve("./src/scripts"),
      },
    },
    optimizeDeps: {
      exclude: ["@fontsource/atkinson-hyperlegible"],
    },
    css: {
      transformer: "lightningcss",
    },
  },

  markdown: {
    shikiConfig: {
      theme: "github-dark",
    },
  },
});
