import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import lilypond from "astro-lilypond";
import minifyHtml from "astro-minify-html-swc";
import { defineConfig } from "astro/config";
import path from "node:path";

export default defineConfig({
  site: "https://knowledge.melody-mind.de",
  output: "static",
  redirects: { "/page/1": "/" },
  integrations: [
    lilypond({
      autoInstall: { version: "2.26.0" },
      defaults: { version: "2.26.0" },
    }),
    mdx(),
    sitemap({ filter: (page) => new URL(page).pathname !== "/404/" }),
    minifyHtml({
      collapseWhitespace: "conservative",
      removeComments: true,
      minifyCss: true,
    }),
  ],
  build: { inlineStylesheets: "auto", assets: "assets", format: "directory" },
  server: { port: 4325 },
  prefetch: { defaultStrategy: "hover" },
  vite: {
    css: { transformer: "lightningcss" },
    resolve: {
      alias: {
        "@assets": path.resolve("./src/assets"),
        "@components": path.resolve("./src/components"),
        "@layouts": path.resolve("./src/layouts"),
        "@styles": path.resolve("./src/styles"),
        "@utils": path.resolve("./src/utils"),
      },
    },
    build: { treeshake: { preset: "smallest" } },
  },
});
