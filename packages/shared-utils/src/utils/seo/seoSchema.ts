/**
 * Central Schema.org JSON-LD Builders
 * Consolidates structured data generation for reuse across pages.
 * Podcast-related functions moved to separate subdomain.
 */
import { normalizeDate } from "@shared-utils/utils/content/dateUtils";

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

export interface QuizLike {
  slug: string;
  title: string;
  description: string;
  url: string;
  image?: string;
  keywords?: string[];
  numberOfQuestions?: number;
  topics?: string[];
}

export interface SiteIdentitySchemaOptions {
  siteUrl: string;
  siteName: string;
  description?: string;
  logoUrl?: string;
  searchPathTemplate?: string;
}

export interface CollectionPageSchemaOptions {
  url: string;
  name: string;
  description?: string;
  lang?: string;
  image?: string;
  mainEntityId?: string;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface ArticleSchemaOptions {
  canonical: string;
  title: string;
  description: string;
  imageUrl?: string;
  imageWidth?: number;
  imageHeight?: number;
  keywords?: string[];
  lang?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  body?: string;
  schemaType?: "Article" | "PodcastEpisode";
  articleSection?: string;
  authorName?: string;
  publisherName?: string;
  publisherLogoUrl?: string;
  isPartOf?: Record<string, unknown>;
  potentialAction?: Record<string, unknown>;
}

export interface QuizSchemaOptions {
  title: string;
  description: string;
  url: string;
  numberOfQuestions?: number;
  keywords?: string[];
  topics?: string[];
}

export interface FaqPageItem {
  question: string;
  answer: string;
}

export interface PodcastSeriesSchemaOptions {
  siteUrl: string;
  title: string;
  description: string;
  locale?: string;
  imageUrl: string;
  feedUrl?: string;
  sameAs?: string[];
  authorNames?: string[];
  publisherName?: string;
  publisherLogoUrl?: string;
  searchPathTemplate?: string;
}

export interface PodcastEpisodeSchemaOptions {
  title: string;
  description: string;
  url: string;
  seriesTitle: string;
  seriesUrl: string;
  locale?: string;
  imageUrl?: string;
  publishedAt?: Date | string;
  modifiedAt?: Date | string;
  episodeNumber?: number;
  durationIso?: string;
  audioUrl?: string;
  authorNames?: string[];
  publisherName?: string;
  publisherLogoUrl?: string;
}

export interface PodcastEpisodeListItem {
  title: string;
  description: string;
  url: string;
  image?: string;
  publishedAt?: Date | string;
  durationIso?: string;
}

function countWords(text: string | undefined): number | undefined {
  if (!text) {
    return undefined;
  }

  const normalized = text
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!normalized) {
    return undefined;
  }

  return normalized.split(" ").length;
}

/**
 * Build Organization schema for the site owner / publisher.
 */
export function buildOrganizationSchema(
  opts: SiteIdentitySchemaOptions
): Record<string, unknown> {
  const {
    siteUrl,
    siteName,
    description,
    logoUrl = `${siteUrl.replace(/\/$/, "")}/melody-mind.png`,
  } = opts;

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl.replace(/\/$/, "")}#organization`,
    name: siteName,
    url: siteUrl,
    description,
    logo: {
      "@type": "ImageObject",
      url: logoUrl,
    },
  };
}

/**
 * Build WebSite schema with optional SearchAction for internal site search.
 */
export function buildWebSiteSchema(
  opts: SiteIdentitySchemaOptions
): Record<string, unknown> {
  const {
    siteUrl,
    siteName,
    description,
    searchPathTemplate = "/search?q={search_term_string}",
  } = opts;
  const normalizedSiteUrl = siteUrl.replace(/\/$/, "");
  const target = `${normalizedSiteUrl}${searchPathTemplate}`;

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${normalizedSiteUrl}#website`,
    url: normalizedSiteUrl,
    name: siteName,
    description,
    publisher: {
      "@id": `${normalizedSiteUrl}#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target,
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Build BreadcrumbList schema from shared breadcrumb navigation items.
 */
export function buildBreadcrumbListSchema(
  breadcrumbs: BreadcrumbItem[]
): Record<string, unknown> | undefined {
  if (!breadcrumbs.length) {
    return undefined;
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

/**
 * Build CollectionPage schema for indexable hub pages.
 */
export function buildCollectionPageSchema(
  opts: CollectionPageSchemaOptions
): Record<string, unknown> {
  const { url, name, description, lang, image, mainEntityId } = opts;
  const normalizedUrl = url.replace(/\/$/, "");

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${normalizedUrl}#collectionpage`,
    url: normalizedUrl,
    name,
    description,
    inLanguage: lang || "en",
    image,
    isPartOf: {
      "@id": `${normalizedUrl.split("/").slice(0, 3).join("/")}#website`,
    },
    about: {
      "@id": `${normalizedUrl.split("/").slice(0, 3).join("/")}#organization`,
    },
    ...(mainEntityId
      ? {
          mainEntity: {
            "@id": mainEntityId,
          },
        }
      : {}),
  };
}

/**
 * Build reusable Article or PodcastEpisode schema with normalized dates and word count.
 */
export function buildArticleSchema(opts: ArticleSchemaOptions): Record<string, unknown> {
  const {
    canonical,
    title,
    description,
    imageUrl,
    imageWidth,
    imageHeight,
    keywords = [],
    lang = "en",
    createdAt,
    updatedAt,
    body,
    schemaType = "Article",
    articleSection,
    authorName = "Melody Mind",
    publisherName = "Melody Mind",
    publisherLogoUrl = "https://melody-mind.de/melody-mind.png",
    isPartOf,
    potentialAction,
  } = opts;

  const publishedDate = normalizeDate(createdAt);
  const modifiedDate = normalizeDate(updatedAt);
  const wordCount = countWords(body);

  return {
    "@context": "https://schema.org",
    "@type": schemaType,
    headline: title,
    name: title,
    description,
    ...(imageUrl
      ? {
          image: {
            "@type": "ImageObject",
            url: imageUrl,
            ...(typeof imageWidth === "number" ? { width: imageWidth } : {}),
            ...(typeof imageHeight === "number" ? { height: imageHeight } : {}),
          },
        }
      : {}),
    url: canonical,
    author: { "@type": "Organization", name: authorName },
    publisher: {
      "@type": "Organization",
      name: publisherName,
      logo: {
        "@type": "ImageObject",
        url: publisherLogoUrl,
      },
    },
    ...(isPartOf ? { isPartOf } : {}),
    ...(potentialAction ? { potentialAction } : {}),
    ...(publishedDate ? { datePublished: publishedDate.toISOString() } : {}),
    ...(modifiedDate ? { dateModified: modifiedDate.toISOString() } : {}),
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    inLanguage: lang,
    ...(keywords.length ? { keywords: keywords.join(", ") } : {}),
    ...(articleSection ? { articleSection } : {}),
    ...(typeof wordCount === "number" ? { wordCount } : {}),
  };
}

/**
 * Build Quiz schema for quiz detail pages.
 */
export function buildQuizSchema(opts: QuizSchemaOptions): Record<string, unknown> {
  const { title, description, url, numberOfQuestions, keywords = [], topics = [] } = opts;

  return {
    "@context": "https://schema.org",
    "@type": "Quiz",
    name: title,
    description,
    url,
    ...(typeof numberOfQuestions === "number" ? { numberOfQuestions } : {}),
    ...(topics.length
      ? {
          about: topics.map((topic) => ({
            "@type": "Thing",
            name: topic,
          })),
        }
      : {}),
    ...(keywords.length ? { keywords: keywords.join(", ") } : {}),
  };
}

/**
 * Build FAQPage schema for static support and policy pages.
 */
export function buildFaqPageSchema(
  items: FaqPageItem[]
): Record<string, unknown> | undefined {
  if (!items.length) {
    return undefined;
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

/**
 * Build PodcastSeries schema for podcast app home/search pages.
 */
export function buildPodcastSeriesSchema(
  opts: PodcastSeriesSchemaOptions
): Record<string, unknown> {
  const {
    siteUrl,
    title,
    description,
    locale = "en-US",
    imageUrl,
    feedUrl,
    sameAs = [],
    authorNames = [],
    publisherName = title,
    publisherLogoUrl = imageUrl,
    searchPathTemplate = "/search?q={search_term_string}",
  } = opts;

  return {
    "@context": "https://schema.org",
    "@type": "PodcastSeries",
    name: title,
    description,
    url: siteUrl,
    inLanguage: locale,
    image: imageUrl,
    genre: ["Music", "History"],
    isAccessibleForFree: true,
    ...(sameAs.length ? { sameAs } : {}),
    publisher: {
      "@type": "Organization",
      name: publisherName,
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: publisherLogoUrl,
      },
    },
    ...(feedUrl ? { webFeed: feedUrl } : {}),
    ...(authorNames.length
      ? {
          author: authorNames.map((name) => ({
            "@type": "Person",
            name,
          })),
        }
      : {}),
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl.replace(/\/$/, "")}${searchPathTemplate}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Build PodcastEpisode schema for podcast detail pages.
 */
export function buildPodcastEpisodeSchema(
  opts: PodcastEpisodeSchemaOptions
): Record<string, unknown> {
  const {
    title,
    description,
    url,
    seriesTitle,
    seriesUrl,
    locale = "en-US",
    imageUrl,
    publishedAt,
    modifiedAt,
    episodeNumber,
    durationIso,
    audioUrl,
    authorNames = [],
    publisherName = seriesTitle,
    publisherLogoUrl = imageUrl,
  } = opts;

  const publishDate = normalizeDate(publishedAt);
  const updateDate = normalizeDate(modifiedAt ?? publishedAt);

  return {
    "@context": "https://schema.org",
    "@type": "PodcastEpisode",
    name: title,
    description,
    url,
    partOfSeries: {
      "@type": "PodcastSeries",
      name: seriesTitle,
      url: seriesUrl,
    },
    ...(typeof episodeNumber === "number" ? { episodeNumber } : {}),
    ...(publishDate ? { datePublished: publishDate.toISOString() } : {}),
    ...(updateDate ? { dateModified: updateDate.toISOString() } : {}),
    inLanguage: locale,
    ...(imageUrl ? { image: imageUrl } : {}),
    genre: ["Music", "History"],
    isAccessibleForFree: true,
    ...(durationIso ? { timeRequired: durationIso } : {}),
    ...(authorNames.length
      ? {
          author: authorNames.map((name) => ({
            "@type": "Person",
            name,
          })),
        }
      : {}),
    ...(audioUrl
      ? {
          audio: {
            "@type": "AudioObject",
            url: audioUrl,
            encodingFormat: "audio/mpeg",
            ...(durationIso ? { duration: durationIso } : {}),
          },
        }
      : {}),
    publisher: {
      "@type": "Organization",
      name: publisherName,
      ...(publisherLogoUrl
        ? {
            logo: {
              "@type": "ImageObject",
              url: publisherLogoUrl,
            },
          }
        : {}),
    },
  };
}

/**
 * Build ItemList schema for podcast episode collections.
 */
export function buildPodcastEpisodesItemListSchema(opts: {
  episodes: PodcastEpisodeListItem[];
  listName?: string;
  itemListId?: string;
}): Record<string, unknown> | undefined {
  const { episodes, listName = "Podcast Episodes", itemListId } = opts;
  if (!episodes.length) {
    return undefined;
  }

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    ...(itemListId ? { "@id": itemListId } : {}),
    name: listName,
    numberOfItems: episodes.length,
    itemListElement: episodes.map((episode, index) => {
      const publishedAt = normalizeDate(episode.publishedAt);

      return {
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "PodcastEpisode",
          name: episode.title,
          description: episode.description,
          url: episode.url,
          ...(episode.image ? { image: episode.image } : {}),
          ...(publishedAt ? { datePublished: publishedAt.toISOString() } : {}),
          ...(episode.durationIso ? { timeRequired: episode.durationIso } : {}),
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
  baseUrl: string;
  lang: string;
  listName?: string;
  itemListId?: string;
}): Record<string, unknown> | undefined {
  const { articles, baseUrl, lang, listName = "Knowledge Articles", itemListId } = opts;
  if (!articles.length) {
    return undefined;
  }
  const sorted = [...articles].sort((a, b) => {
    const aDate = a.data.updatedAt || a.data.createdAt;
    const bDate = b.data.updatedAt || b.data.createdAt;
    return new Date(String(bDate)).getTime() - new Date(String(aDate)).getTime();
  });

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    ...(itemListId ? { "@id": itemListId } : {}),
    name: listName,
    numberOfItems: sorted.length,
    itemListElement: sorted.map((article, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Article",
        name: article.data.title,
        description: article.data.description,
        url: `${baseUrl.replace(/\/$/, "")}/knowledge/${article.slug}`,
        dateCreated: article.data.createdAt
          ? new Date(String(article.data.createdAt)).toISOString()
          : undefined,
        dateModified: article.data.updatedAt
          ? new Date(String(article.data.updatedAt)).toISOString()
          : undefined,
        keywords: article.data.keywords?.join(", "),
        inLanguage: lang || "en",
      },
    })),
  };
}

/**
 * Build ItemList schema for quiz collections.
 */
export function buildQuizItemListSchema(opts: {
  quizzes: QuizLike[];
  listName?: string;
  itemListId?: string;
}): Record<string, unknown> | undefined {
  const { quizzes, listName = "Quizzes", itemListId } = opts;
  if (!quizzes.length) {
    return undefined;
  }

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    ...(itemListId ? { "@id": itemListId } : {}),
    name: listName,
    numberOfItems: quizzes.length,
    itemListElement: quizzes.map((quiz, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Quiz",
        name: quiz.title,
        description: quiz.description,
        url: quiz.url,
        ...(quiz.image ? { image: quiz.image } : {}),
        ...(quiz.keywords?.length ? { keywords: quiz.keywords.join(", ") } : {}),
      },
    })),
  };
}

/**
 * Build ItemList schema for music categories.
 */
