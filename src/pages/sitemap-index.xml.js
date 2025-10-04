/**
 * XML Sitemap Generator for Melody Mind
 *
 * This file generates a sitemap index that references language-specific sitemaps.
 * It helps search engines discover and crawl all pages of the website efficiently.
 */

// Enable static generation for better caching
export const prerender = false;

/**
 *
 */
export async function get() {
  return {
    status: 404,
    body: "",
  };
}
