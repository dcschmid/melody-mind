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
    const collectionName = `knowledge-${lang}`;
    const articles = await getCollection(collectionName);

    articles.forEach((article) => {
      const lastmod =
        article.data.updatedAt instanceof Date ? article.data.updatedAt.toISOString() : today;

      urls.push({
        url: `${siteUrl}/${lang}/knowledge/${article.slug}`,
        lastmod,
        changefreq: "monthly",
        priority: "0.7",
      });
    });
  } catch (_error) {
    // Collection might not exist for this language
    console.warn(`No knowledge collection found for language: ${lang}`);
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
