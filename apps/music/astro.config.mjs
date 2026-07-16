import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import { satteri } from "@astrojs/markdown-satteri";
import path from "path";
import icon from "astro-icon";
import minifyHtml from "astro-minify-html-swc";

const SITEMAP_EXCLUDED_PATHS = new Set([
  "/404/",
  "/categories/",
  "/knowledge/",
  "/taxonomy/",
]);
// Noindex pages don't belong in the sitemap — listing them sends
// contradictory crawl signals.
const SITEMAP_LEGAL_PATHS = new Set(["/cookies/", "/imprint/", "/privacy/"]);
const SITEMAP_NOINDEX_PREFIXES = ["/music/genre/"];

const getSitemapPath = (url) => {
  try {
    return new URL(url).pathname;
  } catch {
    return url;
  }
};

export default defineConfig({
  site: "https://melody-mind.de",
  output: "static",
  markdown: {
    processor: satteri({
      features: { directive: true },
    }),
  },
  redirects: {
    "/ai-content": "/privacy",
    "/categories": "/",
    "/knowledge": "/",
    "/taxonomy": "/",
  },
  integrations: [
    icon({
      collections: ["tabler", "simple-icons"],
    }),
    mdx({
      optimize: true,
    }),
    sitemap({
      namespaces: {
        news: false,
        video: false,
        image: false,
        xhtml: true,
      },
      filter: (page) => {
        const pathname = getSitemapPath(page);
        return (
          !SITEMAP_EXCLUDED_PATHS.has(pathname) &&
          !SITEMAP_LEGAL_PATHS.has(pathname) &&
          !SITEMAP_NOINDEX_PREFIXES.some((prefix) => pathname.startsWith(prefix))
        );
      },
      serialize: (item) => {
        const pathname = getSitemapPath(item.url);

        if (pathname === "/") {
          item.priority = 1.0;
          item.changefreq = "weekly";
        } else {
          item.priority = 0.8;
          item.changefreq = "monthly";
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
    inlineStylesheets: "auto",
    assets: "assets",
    format: "directory",
  },
  vite: {
    css: {
      transformer: "lightningcss",
    },
    resolve: {
      alias: {
        "@components": path.resolve("./src/components"),
        "@layouts": path.resolve("./src/layouts"),
        "@utils": path.resolve("./src/utils"),
        "@constants": path.resolve("./src/constants"),
        "@scripts": path.resolve("./src/scripts"),
        "@data": path.resolve("./src/data"),
        "@types": path.resolve("./src/types"),
      },
    },
    build: {
      treeshake: { preset: "smallest" },
    },
    server: {
      headers: {
        "Content-Security-Policy":
          "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; media-src 'self' https: blob:; connect-src 'self'; frame-src 'none'; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self';",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "X-XSS-Protection": "1; mode=block",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Permissions-Policy":
          "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()",
      },
    },
  },
  prefetch: {
    defaultStrategy: "hover",
  },
});
