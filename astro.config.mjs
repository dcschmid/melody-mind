import { createRequire } from "node:module";
import { defineConfig } from "astro/config";
import icon from "astro-icon";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import robotsTxt from "astro-robots-txt";
import metaTags from "astro-meta-tags";

const require = createRequire(import.meta.url);
const astroPkgPath = require.resolve("astro/package.json");
const astroBaseDir = path.dirname(astroPkgPath);
const sharpServicePath = path.join(astroBaseDir, "dist/assets/services/sharp.js");
const noopServicePath = path.join(astroBaseDir, "dist/assets/services/noop.js");

let imageServiceEntrypoint = sharpServicePath;
try {
  require("sharp");
} catch (err) {
  imageServiceEntrypoint = noopServicePath;
  console.warn(
    "[astro-config] sharp not available, falling back to noop image service",
    err?.message || err,
  );
}

// https://astro.build/config
export default defineConfig({
  site: "https://melody-mind.de",
  output: "static",

  prefetch: {
    defaultStrategy: "hover",
  },

  integrations: [
    icon(),
    robotsTxt({
      sitemap: ["https://melody-mind.de/sitemap-index.xml"],
      host: "melody-mind.de",
    }),
    sitemap(),
    metaTags(),
  ],

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

  image: {
    service: {
      entrypoint: imageServiceEntrypoint,
      config: {},
    },
  },
});
