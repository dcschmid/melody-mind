import sitemap from "@astrojs/sitemap";
import minifyHtml from "astro-minify-html-swc";
import { defineConfig } from "astro/config";
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
  redirects: { "/page/1": "/" },
  integrations: [
    sitemap({
      namespaces: {
        image: true,
      },
      filter: (page) => getPathname(page) !== "/404/",
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
