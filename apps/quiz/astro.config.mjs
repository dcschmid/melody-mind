import { defineConfig } from "astro/config";
import path from "path";
import sitemap from "@astrojs/sitemap";
import metaTags from "astro-meta-tags";
import mdx from "@astrojs/mdx";
import minify from "astro-minify-html-swc";
import icon from "astro-icon";
import cookieConsent from "@zdenekkurecka/astro-consent";

// https://astro.build/config
export default defineConfig({
  site: "https://quiz.melody-mind.de",
  output: "static",
  devToolbar: {
    enabled: false,
  },

  prefetch: {
    defaultStrategy: "hover",
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
        url: "https://melody-mind.de/cookies/",
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
