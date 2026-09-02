import sitemap from "@astrojs/sitemap";
import minifyHtml from "astro-minify-html-swc";
import { defineConfig, fontProviders } from "astro/config";
import path from "node:path";
import { getNewestSitemapDate, readSitemapDates } from "../../scripts/sitemap-dates.mjs";

const getPathname = (url) => {
  try {
    return new URL(url).pathname;
  } catch {
    return url;
  }
};
const SITE_URL = "https://stories.melody-mind.de";
const storyDates = readSitemapDates({
  contentDirectory: new URL("./src/content/stories/", import.meta.url),
  extensions: [".md"],
  dateFields: ["publishedAt"],
});
const newestStoryDate = getNewestSitemapDate(storyDates);

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
    {
      provider: fontProviders.local(),
      name: "Literata",
      cssVariable: "--font-literata",
      fallbacks: ["ui-serif", "Georgia", "serif"],
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/literata-latin-variable.woff2"],
            weight: "400 800",
            style: "normal",
          },
        ],
      },
    },
  ],
  redirects: { "/page/1": "/" },
  integrations: [
    sitemap({
      namespaces: {
        image: true,
      },
      filter: (page) => !new Set(["/404/", "/story-search-index.json"]).has(getPathname(page)),
      serialize: (item) => {
        const pathname = getPathname(item.url);
        const archivePage = pathname === "/" || pathname.startsWith("/page/");
        const lastmod = archivePage ? newestStoryDate : storyDates.get(pathname);
        if (lastmod) item.lastmod = lastmod;
        item.changefreq = archivePage ? "weekly" : "monthly";
        item.priority =
          pathname === "/" ? 1 : archivePage ? 0.7 : pathname === "/about/" ? 0.6 : 0.8;

        // Submit the generated social card to image search for story pages.
        if (storyDates.has(pathname)) {
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
    port: 4323,
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
        "@styles": path.resolve("./src/styles"),
        "@utils": path.resolve("./src/utils"),
      },
    },
    build: {
      treeshake: { preset: "smallest" },
    },
    server: {
      strictPort: false,
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
