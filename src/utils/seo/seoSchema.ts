/**
 * Central Schema.org JSON-LD Builders
 * Consolidates structured data generation for reuse across pages.
 */
import type { PodcastData } from "../../types/podcast";

export interface KnowledgeArticleLike {
  slug: string;
  data: {
    title: string;
    description: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    keywords?: string[];
    image?: string;
  };
}

/**
 * Build PodcastSeries JSON-LD schema.
 */
export function buildPodcastSeriesSchema(opts: {
  name: string;
  description: string;
  url: string;
  inLanguage: string;
  numberOfEpisodes: number;
  publisherName?: string;
}): Record<string, unknown> {
  const { name, description, url, inLanguage, numberOfEpisodes, publisherName = "Melody Mind" } = opts;
  return {
    "@context": "https://schema.org",
    "@type": "PodcastSeries",
    name,
    description,
    url,
    inLanguage,
    numberOfEpisodes,
    publisher: { "@type": "Organization", name: publisherName },
  };
}

/**
 * Build ItemList schema for podcast episodes.
 */
export function buildPodcastEpisodesItemList(opts: {
  episodes: PodcastData[];
  baseUrl: string;
  lang: string;
  chronologicalNumberMap?: Map<string, number>;
}): Record<string, unknown> | undefined {
  const { episodes, baseUrl, lang, chronologicalNumberMap } = opts;
  if (!episodes.length) {
    return undefined;
  }
  const sorted = [...episodes].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  const numberMap = chronologicalNumberMap || new Map(
    [...episodes]
      .sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime())
      .map((e, idx) => [e.id, idx + 1] as const)
  );
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: sorted.map((ep, idx) => {
      const episodeNumber = numberMap.get(ep.id) || undefined;
      return {
        "@type": "ListItem",
        position: idx + 1,
        url: `${baseUrl}/${lang}/podcasts/${ep.id}`,
        item: {
          "@type": "PodcastEpisode",
          name: ep.title,
          datePublished: ep.publishedAt,
          episodeNumber,
          url: `${baseUrl}/${lang}/podcasts/${ep.id}`,
        },
      };
    }),
  };
}

/**
 * Build ItemList schema for knowledge articles.
 */
export function buildKnowledgeArticlesItemList(opts: {
  articles: KnowledgeArticleLike[];
  baseUrl: string | URL;
  lang: string;
  limit?: number;
  name?: string;
  description?: string;
}): Record<string, unknown> {
  const { articles, baseUrl, lang, limit = 10, name = "Knowledge Articles", description = "Music knowledge articles" } = opts;
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    description,
    numberOfItems: articles.length,
    itemListElement: articles.slice(0, limit).map((article, index) => ({
      "@type": "Article",
      position: index + 1,
      name: article.data.title,
      description: article.data.description,
      url: `${baseUrl}/${lang}/knowledge/${article.slug}`,
      datePublished: article.data.createdAt,
      keywords: article.data.keywords?.join(", ") || "",
      author: { "@type": "Organization", name: "MelodyMind" },
    })),
  };
}

/** Build ItemList schema for generic music categories (e.g., playlists or gamehome genres). */
export function buildCategoryItemListSchema(opts: {
  categories: { slug: string; title: string; description?: string; image?: string }[];
  baseUrl: string | URL;
  lang: string;
  limit?: number;
  name?: string;
  description?: string;
  pathPrefix?: string; // e.g. 'playlists' or 'gamehome'
}): Record<string, unknown> | undefined {
  const { categories, baseUrl, lang, limit = 24, name = 'Categories', description = 'Music categories', pathPrefix = 'playlists' } = opts;
  if (!categories || !categories.length) { return undefined; }
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    description,
    numberOfItems: categories.length,
    itemListElement: categories.slice(0, limit).map((cat, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: cat.title,
      description: cat.description || '',
      url: `${baseUrl}/${lang}/${pathPrefix}/${cat.slug}`,
      image: cat.image,
    })),
  };
}

/** Build schema for a single podcast episode (if detail pages exist). */
export function buildPodcastEpisodeSchema(opts: {
  id: string;
  title: string;
  description: string;
  url: string;
  audioUrl?: string;
  imageUrl?: string;
  publishDate?: string | Date;
  episodeNumber?: number;
  seriesName?: string;
  seriesUrl?: string;
  inLanguage?: string;
}): Record<string, unknown> {
  const { id, title, description, url, audioUrl, imageUrl, publishDate, episodeNumber, seriesName = 'MelodyMind Podcast', seriesUrl, inLanguage = 'en' } = opts;
  return {
    '@context': 'https://schema.org',
    '@type': 'PodcastEpisode',
    '@id': id,
    name: title,
    description,
    url,
    inLanguage,
    datePublished: publishDate instanceof Date ? publishDate.toISOString() : publishDate,
    image: imageUrl,
    episodeNumber,
    partOfSeries: seriesUrl ? { '@type': 'PodcastSeries', name: seriesName, url: seriesUrl } : undefined,
    associatedMedia: audioUrl ? { '@type': 'MediaObject', contentUrl: audioUrl } : undefined,
    publisher: { '@type': 'Organization', name: 'Melody Mind' },
  };
}
