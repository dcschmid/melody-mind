/**
 * Language-specific XML Sitemap Generator for Melody Mind (TypeScript version)
 */
import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";

import { getSupportedLanguages } from "../utils/i18n/staticPaths";

interface SitemapEntry {
  url: string;
  lastmod: string;
  changefreq: string;
  priority: string;
}

export const prerender = true;

/** Generate static paths for language-specific sitemaps. */
export async function getStaticPaths(): Promise<{ params: { lang: string } }[]> {
  const langs = getSupportedLanguages();
  return langs.map((lang) => ({ params: { lang } }));
}

/** Build the XML sitemap for a given language. */
export async function get({
  params,
}: {
  params: { lang: string };
}): Promise<{ body: string; headers: Record<string, string> }> {
  const { lang } = params;
  const siteUrl: string = (import.meta.env.SITE as string) || "https://melody-mind.de";
  const today = new Date().toISOString();
  const urls: SitemapEntry[] = [];

  const push = (entry: SitemapEntry): void => {
    urls.push(entry);
  };

  // Main pages
  push({ url: `${siteUrl}/${lang}/`, lastmod: today, changefreq: "weekly", priority: "1.0" });
  push({
    url: `${siteUrl}/${lang}/knowledge/`,
    lastmod: today,
    changefreq: "weekly", 
    priority: "0.9",
  });
  push({
    url: `${siteUrl}/${lang}/playlists/`,
    lastmod: today,
    changefreq: "weekly",
    priority: "0.8",
  });
  push({
    url: `${siteUrl}/${lang}/gamehome/`,
    lastmod: today,
    changefreq: "weekly",
    priority: "0.8",
  });
  push({
    url: `${siteUrl}/${lang}/news/`,
    lastmod: today,
    changefreq: "weekly",
    priority: "0.7",
  });

  // Knowledge articles
  try {
    const collectionName = `knowledge-${lang}`;
    const articles = await getCollection(collectionName).catch(() => null);
    if (Array.isArray(articles) && articles.length > 0) {
      (articles as CollectionEntry<typeof collectionName>[]).slice(0, 500).forEach((article) => {
        const lastmod =
          article.data.updatedAt instanceof Date ? article.data.updatedAt.toISOString() : today;
        push({
          url: `${siteUrl}/${lang}/knowledge/${article.slug}`,
          lastmod,
          changefreq: "monthly",
          priority: "0.7",
        });
      });
    }
  } catch (err) {
    const msg = (err as Error)?.message || err;
    globalThis.console?.warn?.(`sitemap: failed to add knowledge articles for ${lang}:`, msg);
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls
    .map(
      (entry) =>
        `
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
