/**
 * Language-specific XML Sitemap Generator for Melody Mind
 *
 * This file generates a sitemap for each supported language, listing all pages
 * available in that language. It dynamically fetches content collections and
 * builds URLs for all pages, articles, and categories.
 */
import { getCollection } from "astro:content";

import enPodcastsJson from "../data/podcasts/en.json" assert { type: "json" };

/**
 * Add podcast URLs for the sitemap (only published episodes)
 * @param {string} lang
 * @param {string} siteUrl
 * @param {string} today
 * @returns {Array<{url:string,lastmod:string,changefreq:string,priority:string}>}
 */
function buildPodcastEntries(lang, siteUrl, today) {
  if (lang !== "en") {
    return [];
  }
  const entries = [];
  entries.push({
    url: `${siteUrl}/${lang}/podcasts/`,
    lastmod: today,
    changefreq: "weekly",
    priority: "0.7",
  });
  try {
    const podcasts = Array.isArray(enPodcastsJson.podcasts) ? enPodcastsJson.podcasts : [];
    podcasts
      .filter((p) => p && p.isAvailable)
      .forEach((p) => {
        let pubDate = today;
        if (p.publishedAt) {
          const d = new Date(p.publishedAt);
          if (!isNaN(d.getTime())) {
            pubDate = d.toISOString();
          }
        }
        entries.push({
          url: `${siteUrl}/${lang}/podcasts/${p.id}/`,
          lastmod: pubDate,
          changefreq: "monthly",
          priority: "0.5",
        });
      });
  } catch (e) {
    globalThis.console?.warn?.("sitemap: failed to process podcasts", e?.message || e);
  }
  return entries;
}

// Enable prerendering for static generation
export const prerender = true;

// Central supported languages (imported lazily to keep file side-effect free at import time)
let supportedLanguages;
async function loadSupportedLanguages() {
  if (!supportedLanguages) {
    const mod = await import("../utils/i18n/staticPaths.ts");
    supportedLanguages = mod.getSupportedLanguages();
  }
  return supportedLanguages;
}

// Generate static paths for all supported languages
/**
 *
 */
export async function getStaticPaths() {
  const langs = await loadSupportedLanguages();
  return langs.map((lang) => ({ params: { lang } }));
}

/**
 *
 */
export async function get({ params }) {
  const { lang } = params;

  // Base URL from environment or fallback
  const siteUrl = import.meta.env.SITE || "https://melodymind.app";

  // Current date in ISO format for lastmod
  const today = new Date().toISOString();

  // Collect all URLs for this language
  const urls = [];

  // Add static pages
  urls.push({
    url: `${siteUrl}/${lang}/`,
    lastmod: today,
    changefreq: "weekly",
    priority: "1.0",
  });

  urls.push({
    url: `${siteUrl}/${lang}/knowledge/`,
    lastmod: today,
    changefreq: "weekly",
    priority: "0.9",
  });

  urls.push({
    url: `${siteUrl}/${lang}/playlists/`,
    lastmod: today,
    changefreq: "weekly",
    priority: "0.8",
  });

  urls.push({
    url: `${siteUrl}/${lang}/gamehome/`,
    lastmod: today,
    changefreq: "weekly",
    priority: "0.8",
  });

  // Podcast entries (published only)
  urls.push(...buildPodcastEntries(lang, siteUrl, today));

  // Add knowledge articles
  try {
    // Avoid loading massive collections for every language which can spike memory usage.
    // We only attempt to load the English collection as a representative fallback and
    // skip per-language collections when not present to keep the sitemap build lightweight.
    const collectionName = `knowledge-${lang}`;
    const articles = await getCollection(collectionName).catch(() => null);

    if (Array.isArray(articles) && articles.length > 0) {
      // Limit entries per language to 500 to avoid generating exceptionally large sitemaps
      const limited = articles.slice(0, 500);
      limited.forEach((article) => {
        const lastmod =
          article.data.updatedAt instanceof Date ? article.data.updatedAt.toISOString() : today;

        urls.push({
          url: `${siteUrl}/${lang}/knowledge/${article.slug}`,
          lastmod,
          changefreq: "monthly",
          priority: "0.7",
        });
      });
    }
  } catch (err) {
    // If anything goes wrong, continue gracefully; sitemap should not fail the build
    // Use globalThis.console?.warn to satisfy linting rules in environments where console may be restricted
    globalThis.console?.warn?.(
      `sitemap: failed to add knowledge articles for ${lang}:`,
      err?.message || err
    );
  }

  // Generate sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls
    .map(
      (entry) => `
  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
    )
    .join("")}
</urlset>`;

  return {
    body: sitemap,
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "max-age=3600",
    },
  };
}
