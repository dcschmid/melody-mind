/**
 * Central Schema.org JSON-LD builders shared across Knowledge and Quiz.
 *
 * The module provides small, predictable factory functions that convert existing page
 * metadata into JSON-LD objects without coupling callers to Schema.org field names.
 * Most helpers are deliberately tolerant: optional inputs are omitted from the result
 * instead of forcing callers to pre-normalize every value.
 */
import { normalizeDate } from "@shared-utils/utils/content/dateUtils";

/** Minimal shape required to describe a Knowledge article in list schemas. */
export interface KnowledgeArticleListItem {
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

/** Minimal shape required to describe a quiz in list schemas. */
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

/** Shared site identity fields used by organization and website schemas. */
export interface SiteIdentitySchemaOptions {
  siteUrl: string;
  siteName: string;
  description?: string;
  logoUrl?: string;
  searchPathTemplate?: string;
}

/** Options for indexable hub pages such as topic, taxonomy or archive views. */
export interface CollectionPageSchemaOptions {
  url: string;
  name: string;
  description?: string;
  lang?: string;
  image?: string;
  mainEntityId?: string;
}

/** Shared breadcrumb input shape used to build `BreadcrumbList` JSON-LD. */
export interface BreadcrumbItem {
  name: string;
  url: string;
}

/** Normalized article-like input used for article and podcast-episode detail schemas. */
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
  /** Topics the article is about (Schema.org about property) */
  about?: Array<{ name: string; sameAs?: string }>;
  /** Entities mentioned in the article */
  mentions?: Array<{ name: string; sameAs?: string }>;
  /** Related authoritative URLs */
  sameAs?: string[];
  /** Citations or references to other works */
  citations?: Array<{ name: string; url?: string }>;
}

/** Input contract for quiz detail page schema output. */
export interface QuizSchemaOptions {
  title: string;
  description: string;
  url: string;
  numberOfQuestions?: number;
  keywords?: string[];
  topics?: string[];
}

/** FAQ entry contract for static FAQ-style pages. */
export interface FaqPageItem {
  question: string;
  answer: string;
}

/**
 * Derives a lightweight word count from rich text or HTML-ish input.
 *
 * This is intentionally approximate and good enough for schema enrichment; it is not meant
 * to be used as an editorially exact reading metric.
 */
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

const toIsoDate = (value: Date | string | undefined): string | undefined => {
  const normalized = normalizeDate(value);
  return normalized?.toISOString();
};

const toSortableTimestamp = (value: Date | string | undefined): number => {
  const normalized = normalizeDate(value);
  return normalized?.getTime() ?? 0;
};

/** Builds the canonical `Organization` node representing the site owner/publisher. */
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
 * Builds the top-level `WebSite` schema and wires it to the shared organization node.
 *
 * A `SearchAction` is included by default so pages can advertise internal site search
 * without repeating that structure at each call site.
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

/** Converts shared breadcrumb UI data into a `BreadcrumbList` schema, or returns nothing. */
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
 * Builds a `CollectionPage` schema for indexable overview pages.
 *
 * The helper automatically links the page back to the site-wide `WebSite` and
 * `Organization` nodes derived from the URL origin.
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
 * Builds an `Article`-style schema for detail pages.
 *
 * The default output is `Article`, but callers may switch to `PodcastEpisode` when they
 * want to reuse the same article-like structure with different Schema.org typing.
 * Dates are normalized through `normalizeDate()`, and body text is used only to derive
 * an approximate `wordCount`.
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
    about,
    mentions,
    sameAs,
    citations,
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
    ...(about?.length
      ? {
          about: about.map((topic) => ({
            "@type": "Thing",
            name: topic.name,
            ...(topic.sameAs ? { sameAs: topic.sameAs } : {}),
          })),
        }
      : {}),
    ...(mentions?.length
      ? {
          mentions: mentions.map((entity) => ({
            "@type": "Thing",
            name: entity.name,
            ...(entity.sameAs ? { sameAs: entity.sameAs } : {}),
          })),
        }
      : {}),
    ...(sameAs?.length ? { sameAs } : {}),
    ...(citations?.length
      ? {
          citation: citations.map((c) => ({
            "@type": "CreativeWork",
            name: c.name,
            ...(c.url ? { url: c.url } : {}),
          })),
        }
      : {}),
  };
}

/** Builds a `Quiz` schema for quiz detail pages. */
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

/** Builds a `FAQPage` schema when at least one valid FAQ item exists. */
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
 * Builds an `ItemList` for Knowledge article collections.
 *
 * Articles are sorted newest-first using `updatedAt` with `createdAt` as fallback so the
 * schema order reflects the most recently maintained entries rather than filesystem order.
 */
export function buildKnowledgeArticlesItemList(opts: {
  articles: KnowledgeArticleListItem[];
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
    return toSortableTimestamp(bDate) - toSortableTimestamp(aDate);
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
        dateCreated: toIsoDate(article.data.createdAt),
        dateModified: toIsoDate(article.data.updatedAt),
        keywords: article.data.keywords?.join(", "),
        inLanguage: lang || "en",
      },
    })),
  };
}

/** Builds an `ItemList` for quiz index pages and similar collections. */
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
 * Builds a `SpeakableSpecification` schema for voice search optimization.
 *
 * This allows Google Assistant and other voice devices to read article highlights aloud.
 * Uses CSS selectors to identify speakable sections of the page.
 */
export function buildSpeakableSpecificationSchema(opts: {
  cssSelectors?: string[];
  xpathSelectors?: string[];
}): Record<string, unknown> | undefined {
  const { cssSelectors, xpathSelectors } = opts;

  if (
    (!cssSelectors || cssSelectors.length === 0) &&
    (!xpathSelectors || xpathSelectors.length === 0)
  ) {
    return undefined;
  }

  return {
    "@context": "https://schema.org",
    "@type": "SpeakableSpecification",
    ...(cssSelectors?.length ? { cssSelector: cssSelectors } : {}),
    ...(xpathSelectors?.length ? { xpath: xpathSelectors } : {}),
  };
}
