import sitemap from "@astrojs/sitemap";
import minifyHtml from "astro-minify-html-swc";
import { defineConfig, fontProviders } from "astro/config";
import path from "node:path";
import { getNewestSitemapDate, readSitemapDates } from "../../scripts/sitemap-dates.mjs";

const SITE_URL = "https://quiz.melody-mind.de";
const quizDates = readSitemapDates({
  contentDirectory: new URL("./src/content/quizzes/", import.meta.url),
  extensions: [".md"],
  dateFields: ["checkedAt"],
});
const newestQuizDate = getNewestSitemapDate(quizDates);

export default defineConfig({
  site: SITE_URL,
  output: "static",
  fonts: [
    {
      provider: fontProviders.local(),
      name: "Atkinson Hyperlegible",
      cssVariable: "--font-atkinson",
      fallbacks: ["ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/atkinson-hyperlegible-regular.woff2"],
            weight: "400",
            style: "normal",
          },
          {
            src: ["./src/assets/fonts/atkinson-hyperlegible-bold.woff2"],
            weight: "700",
            style: "normal",
          },
        ],
      },
    },
  ],
  integrations: [
    sitemap({
      namespaces: {
        image: true,
      },
      serialize: (item) => {
        const pathname = new URL(item.url).pathname;
        const lastmod = pathname === "/" ? newestQuizDate : quizDates.get(pathname);
        if (lastmod) item.lastmod = lastmod;

        // Submit the generated social card to image search for quiz pages.
        if (quizDates.has(pathname)) {
          const slug = pathname.slice(1, -1);
          item.img = [{ url: `${SITE_URL}/og/${slug}.jpg` }];
        }
        return item;
      },
    }),
    minifyHtml({
      collapseWhitespace: "conservative",
      removeComments: true,
      removeRedundantAttributes: true,
      minifyCss: true,
      collapseBooleanAttributes: true,
    }),
  ],
  build: {
    inlineStylesheets: "always",
    assets: "assets",
    format: "directory",
  },
  server: {
    port: 4322,
  },
  prefetch: {
    defaultStrategy: "hover",
  },
  vite: {
    css: {
      transformer: "lightningcss",
    },
    resolve: {
      alias: {
        "@assets": path.resolve("./src/assets"),
        "@components": path.resolve("./src/components"),
        "@layouts": path.resolve("./src/layouts"),
        "@scripts": path.resolve("./src/scripts"),
        "@styles": path.resolve("./src/styles"),
        "@quiz-types": path.resolve("./src/types"),
        "@utils": path.resolve("./src/utils"),
      },
    },
    build: {
      treeshake: { preset: "smallest" },
    },
    server: {
      strictPort: true,
      headers: {
        "Content-Security-Policy":
          "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; frame-src 'none'; font-src 'self'; media-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self';",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Permissions-Policy":
          "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()",
      },
    },
  },
});
