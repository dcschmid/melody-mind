import { defineConfig } from "astro/config";
import fs from "node:fs";
import path from "path";
import { fileURLToPath } from "node:url";
import sitemap from "@astrojs/sitemap";
import metaTags from "astro-meta-tags";
import mdx from "@astrojs/mdx";
import minify from "astro-minify-html-swc";
import icon from "astro-icon";
import matter from "gray-matter";
import { LEGACY_CATEGORY_REDIRECTS } from "./src/constants/categoryRedirects.js";

const redirects = Object.fromEntries(
  Object.entries(LEGACY_CATEGORY_REDIRECTS).map(([slug, destination]) => [
    `/categories/${slug}`,
    destination,
  ])
);

const SITEMAP_INDEXABLE_PATH_PATTERNS = [/^\/$/, /^\/knowledge\/.+/, /^\/taxonomy\/.+/];
const CONFIG_DIR = path.dirname(fileURLToPath(import.meta.url));
const KNOWLEDGE_CONTENT_DIR = path.join(CONFIG_DIR, "src/content/knowledge-en");
const KNOWLEDGE_TAXONOMY_FILE = path.join(CONFIG_DIR, "src/data/musicTaxonomy.ts");

const normalizeSitemapPath = (page) => {
  try {
    return new URL(page).pathname;
  } catch {
    return page.startsWith("/") ? page : `/${page}`;
  }
};

const normalizeSitemapDate = (value) => {
  if (!value) {
    return undefined;
  }

  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.valueOf()) ? undefined : date;
};

const newestDate = (current, candidate) => {
  if (!candidate) {
    return current;
  }

  return !current || candidate.getTime() > current.getTime() ? candidate : current;
};

const parseTaxonomySections = () => {
  const subsectionToSection = new Map();
  const sectionIds = [];
  let currentSectionId = "";

  try {
    const taxonomySource = fs.readFileSync(KNOWLEDGE_TAXONOMY_FILE, "utf8");

    for (const line of taxonomySource.split("\n")) {
      const idMatch = line.match(/^(\s*)id:\s*"([^"]+)"/);

      if (!idMatch) {
        continue;
      }

      const indent = idMatch[1].length;
      const id = idMatch[2];

      if (indent === 4) {
        currentSectionId = id;
        sectionIds.push(id);
      } else if (indent === 8 && currentSectionId) {
        subsectionToSection.set(id, currentSectionId);
      }
    }
  } catch {
    return { sectionIds, subsectionToSection };
  }

  return { sectionIds, subsectionToSection };
};

const buildKnowledgeSitemapLastmodMap = () => {
  const lastmodByPath = new Map();
  const lastmodByTaxonomyPath = new Map();
  const taxonomyFallback = normalizeSitemapDate(
    fs.existsSync(KNOWLEDGE_TAXONOMY_FILE)
      ? fs.statSync(KNOWLEDGE_TAXONOMY_FILE).mtime
      : undefined
  );
  const { sectionIds, subsectionToSection } = parseTaxonomySections();
  let latestKnowledgeUpdate = taxonomyFallback;

  if (!fs.existsSync(KNOWLEDGE_CONTENT_DIR)) {
    return lastmodByPath;
  }

  for (const filename of fs.readdirSync(KNOWLEDGE_CONTENT_DIR)) {
    if (!filename.endsWith(".mdx")) {
      continue;
    }

    const slug = filename.replace(/\.mdx$/, "");
    const filePath = path.join(KNOWLEDGE_CONTENT_DIR, filename);
    const fileSource = fs.readFileSync(filePath, "utf8");
    const { data } = matter(fileSource);
    const articleLastmod =
      normalizeSitemapDate(data.updatedAt) ||
      normalizeSitemapDate(data.createdAt) ||
      normalizeSitemapDate(fs.statSync(filePath).mtime);

    if (!articleLastmod) {
      continue;
    }

    lastmodByPath.set(`/knowledge/${slug}/`, articleLastmod);
    latestKnowledgeUpdate = newestDate(latestKnowledgeUpdate, articleLastmod);

    const sectionId = subsectionToSection.get(String(data.taxonomySubsection || ""));
    if (sectionId) {
      const taxonomyPath = `/taxonomy/${sectionId}/`;
      lastmodByTaxonomyPath.set(
        taxonomyPath,
        newestDate(lastmodByTaxonomyPath.get(taxonomyPath), articleLastmod)
      );
    }
  }

  if (latestKnowledgeUpdate) {
    lastmodByPath.set("/", latestKnowledgeUpdate);
  }

  for (const sectionId of sectionIds) {
    const taxonomyPath = `/taxonomy/${sectionId}/`;
    const sectionLastmod = lastmodByTaxonomyPath.get(taxonomyPath) || taxonomyFallback;

    if (sectionLastmod) {
      lastmodByPath.set(taxonomyPath, sectionLastmod);
    }
  }

  return lastmodByPath;
};

const KNOWLEDGE_SITEMAP_LASTMOD_BY_PATH = buildKnowledgeSitemapLastmodMap();

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
    sitemap({
      filter: (page) => {
        const pathname = normalizeSitemapPath(page);

        return SITEMAP_INDEXABLE_PATH_PATTERNS.some((pattern) => pattern.test(pathname));
      },
      serialize: (item) => {
        const pathname = normalizeSitemapPath(item.url);
        const lastmod = KNOWLEDGE_SITEMAP_LASTMOD_BY_PATH.get(pathname);

        return lastmod ? { ...item, lastmod } : item;
      },
    }),
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
