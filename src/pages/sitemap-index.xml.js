/**
 * XML Sitemap Generator for Melody Mind
 *
 * This file generates a sitemap index that references language-specific sitemaps.
 * It helps search engines discover and crawl all pages of the website efficiently.
 */
export async function get() {
  // Base URL from environment or fallback
  const siteUrl = import.meta.env.SITE || "https://melodymind.app";

  // Supported languages
  const languages = ["de", "en", "es", "fr", "it", "pt", "da", "nl", "sv", "fi"];

  // Current date in ISO format for lastmod
  const today = new Date().toISOString();

  // Generate sitemap index XML
  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${languages
    .map(
      (lang) => `
  <sitemap>
    <loc>${siteUrl}/sitemap-${lang}.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>`
    )
    .join("")}
</sitemapindex>`;

  return {
    body: sitemapIndex,
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "max-age=3600",
    },
  };
}
