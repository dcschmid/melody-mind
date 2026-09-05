import { defineConfig, fontProviders } from "astro/config";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import { satteri } from "@astrojs/markdown-satteri";
import path from "path";
import icon from "astro-icon";
import minifyHtml from "astro-minify-html-swc";
import { getNewestSitemapDate, readSitemapMeta } from "../../scripts/sitemap-dates.mjs";

const SITE_URL = "https://melody-mind.de";
const SITEMAP_EXCLUDED_PATHS = new Set([
  "/404/",
  "/categories/",
  "/drive/",
  "/taxonomy/",
  "/visuals/",
]);
// Noindex pages don't belong in the sitemap — listing them sends
// contradictory crawl signals.
const SITEMAP_LEGAL_PATHS = new Set(["/cookies/", "/imprint/", "/privacy/"]);
const SITEMAP_NOINDEX_PREFIXES = ["/embed/", "/visuals-data/"];
const albumMetaByPath = readSitemapMeta({
  contentDirectory: new URL("./src/content/albums/", import.meta.url),
  extensions: [".mdx"],
  dateFields: ["publishedAt"],
  titleFields: ["title"],
  normalizeSlug: (slug) => slug.toLocaleLowerCase("en").replaceAll(" ", "-"),
});
const albumDates = new Map(
  [...albumMetaByPath]
    .filter(([, meta]) => meta.lastmod)
    .map(([path, meta]) => [path, meta.lastmod])
);
const newestAlbumDate = getNewestSitemapDate(albumDates);

const getSitemapPath = (url) => {
  try {
    return decodeURIComponent(new URL(url).pathname);
  } catch {
    return url;
  }
};

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
  markdown: {
    processor: satteri({
      features: { directive: true },
    }),
  },
  redirects: {
    "/ai-content": "/privacy",
    "/categories": "/",
    "/knowledge": "/",
    "/saints-of-the-empty--hospital": "/saints-of-the-empty-hospital/",
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
        image: true,
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
        const albumMeta = albumMetaByPath.get(pathname);

        if (albumMeta?.lastmod) item.lastmod = albumMeta.lastmod;
        if (pathname === "/" && newestAlbumDate) item.lastmod = newestAlbumDate;

        // Submit the generated social card to image search for album pages.
        if (albumMeta?.title) {
          const slug = pathname.slice(1, -1);
          item.img = [
            {
              url: `${SITE_URL}/og/${slug}.jpg`,
              caption: `Cover art for ${albumMeta.title}`,
            },
          ];
        }

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
  server: {
    port: 4321,
    headers: {
      "Content-Security-Policy":
        "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; media-src 'self' https://eu2.contabostorage.com blob:; connect-src 'self' https://eu2.contabostorage.com; frame-src 'self' https://embed.melody-mind.de; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "SAMEORIGIN",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Permissions-Policy":
        "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()",
    },
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
        "@data": path.resolve("./src/data"),
      },
    },
    build: {
      treeshake: { preset: "smallest" },
    },
    server: {
      strictPort: true,
    },
  },
  prefetch: {
    defaultStrategy: "hover",
  },
});
