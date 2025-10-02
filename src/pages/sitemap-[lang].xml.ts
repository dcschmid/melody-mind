/**
 * Language-specific XML Sitemap Generator for Melody Mind (TypeScript version)
 */
import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";

import enPodcastsJson from "../data/podcasts/en.json" assert { type: "json" };
import { getSupportedLanguages } from "../utils/i18n/staticPaths";

interface SitemapEntry {
  url: string;
  lastmod: string;
  changefreq: string;
  priority: string;
}

/** Build podcast sitemap entries (English only). */
function buildPodcastEntries(lang: string, siteUrl: string, today: string): SitemapEntry[] {
  if (lang !== "en") {
    return [];
  }
  const entries: SitemapEntry[] = [
    {
      url: `${siteUrl}/${lang}/podcasts/`,
      lastmod: today,
      changefreq: "weekly",
      priority: "0.7",
    },
  ];
  try {
    interface PodcastLike { id: string; publishedAt?: string; isAvailable?: boolean }
    const raw = (enPodcastsJson as unknown as { podcasts?: PodcastLike[] }).podcasts || [];
    const podcasts: PodcastLike[] = Array.isArray(raw) ? raw : [];
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
    const msg = (e as Error)?.message || e;
    globalThis.console?.warn?.("sitemap: failed to process podcasts", msg);
  }
  return entries;
}

export const prerender = true;

/** Generate static paths for language-specific sitemaps. */
export async function getStaticPaths(): Promise<{ params: { lang: string } }[]> {
  const langs = getSupportedLanguages();
  return langs.map((lang) => ({ params: { lang } }));
}

/** Build the XML sitemap for a given language. */
export async function get({ params }: { params: { lang: string } }): Promise<{ body: string; headers: Record<string, string> }> {
  const { lang } = params;
  const siteUrl: string = (import.meta.env.SITE as string) || "https://melodymind.app";
  const today = new Date().toISOString();
  const urls: SitemapEntry[] = [];

  const push = (entry: SitemapEntry): void => { urls.push(entry); };

  push({ url: `${siteUrl}/${lang}/`, lastmod: today, changefreq: "weekly", priority: "1.0" });
  push({ url: `${siteUrl}/${lang}/knowledge/`, lastmod: today, changefreq: "weekly", priority: "0.9" });
  push({ url: `${siteUrl}/${lang}/playlists/`, lastmod: today, changefreq: "weekly", priority: "0.8" });
  push({ url: `${siteUrl}/${lang}/gamehome/`, lastmod: today, changefreq: "weekly", priority: "0.8" });

  urls.push(...buildPodcastEntries(lang, siteUrl, today));

  try {
    const collectionName = `knowledge-${lang}`;
    const articles = await getCollection(collectionName).catch(() => null);
    if (Array.isArray(articles) && articles.length > 0) {
      (articles as CollectionEntry<typeof collectionName>[]).slice(0, 500).forEach((article) => {
        const lastmod = article.data.updatedAt instanceof Date ? article.data.updatedAt.toISOString() : today;
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

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls
    .map(
      (entry) => `\n  <url>\n    <loc>${entry.url}</loc>\n    <lastmod>${entry.lastmod}</lastmod>\n    <changefreq>${entry.changefreq}</changefreq>\n    <priority>${entry.priority}</priority>\n  </url>`
    )
    .join("")}\n</urlset>`;

  return {
    body: sitemap,
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "max-age=3600",
    },
  };
}
