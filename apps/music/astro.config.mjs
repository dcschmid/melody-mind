import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import path from "path";
import icon from "astro-icon";
import minifyHtml from "astro-minify-html-swc";
import cookieConsent from "@zdenekkurecka/astro-consent";

export default defineConfig({
  site: "https://melody-mind.de",
  output: "static",
  redirects: {
    "/categories": "/",
    "/knowledge": "/",
    "/taxonomy": "/",
  },
  integrations: [
    icon({
      collections: ["tabler", "simple-icons"],
    }),
    cookieConsent({
      version: 1,
      storageKey: "melodymind-consent",
      maxAgeDays: 365,
      cookiePolicy: {
        url: "/cookies/",
        label: "Cookie & Storage Policy",
      },
      categories: {
        analytics: {
          label: "Analytics",
          description:
            "Allows privacy-friendly Fathom Analytics to measure aggregate page views.",
          default: false,
        },
      },
      text: {
        bannerText:
          "We use essential browser storage for site features. With your consent, we also use privacy-friendly analytics to understand aggregate site usage.",
        acceptAll: "Accept analytics",
        rejectAll: "Reject analytics",
        manage: "Manage choices",
        modalTitle: "Privacy preferences",
        closeAriaLabel: "Close preferences",
        savePreferences: "Save preferences",
        essentialLabel: "Essential",
        essentialDescription:
          "Required for core site features such as theme and consent preferences. This cannot be disabled.",
      },
    }),
    mdx({
      optimize: true,
    }),
    sitemap({
      xslURL: "/sitemap.xsl",
      namespaces: {
        news: false,
        video: false,
        image: false,
        xhtml: true,
      },
      serialize: (item) => {
        if (item.url.endsWith("/")) {
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
          "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.usefathom.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; media-src 'self' https: blob:; connect-src 'self' https://cdn.usefathom.com; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self';",
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
