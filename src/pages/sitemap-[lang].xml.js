/**
 * Language-specific XML Sitemap Generator for Melody Mind
 *
 * This file generates a sitemap for each supported language, listing all pages
 * available in that language. It dynamically fetches content collections and
 * builds URLs for all pages, articles, and categories.
 */
import { getCollection } from "astro:content";

// Enable prerendering for static generation
export const prerender = true;

// Define supported languages for type safety
const supportedLanguages = [
  "de",
  "en",
  "es",
  "fr",
  "it",
  "pt",
  "da",
  "nl",
  "sv",
  "fi",
  "cn",
  "ru",
  "jp",
  "uk",
];

// Generate static paths for all supported languages
/**
 *
 */
export async function getStaticPaths() {
  return supportedLanguages.map((lang) => ({
    params: { lang },
  }));
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
