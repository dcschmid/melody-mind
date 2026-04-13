import { defineConfig } from "astro/config";
import path from "path";
import sitemap from "@astrojs/sitemap";
import metaTags from "astro-meta-tags";
import mdx from "@astrojs/mdx";
import minify from "astro-minify-html-swc";
import icon from "astro-icon";
import { LEGACY_CATEGORY_REDIRECTS } from "./src/constants/categoryRedirects.js";

const redirects = Object.fromEntries(
  Object.entries(LEGACY_CATEGORY_REDIRECTS).map(([slug, destination]) => [
    `/categories/${slug}`,
    destination,
  ])
);

// https://astro.build/config
export default defineConfig({
  site: "https://melody-mind.de",
  output: "static",
  redirects,

  prefetch: {
    defaultStrategy: "hover",
  },

  integrations: [
    icon({
      collections: ["tabler", "simple-icons"],
    }),
    mdx({ optimize: true }),
    sitemap(),
    metaTags(),
    minify(),
  ],

  vite: {
    resolve: {
      alias: {
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
      include: ["sharp"],
    },
    build: {
      treeshake: { preset: "smallest" },
    },
    css: {
      transformer: "lightningcss",
    },
  },

  build: {
    inlineStylesheets: "auto",
  },

  markdown: {
    shikiConfig: {
      theme: "github-dark",
    },
  },
});
