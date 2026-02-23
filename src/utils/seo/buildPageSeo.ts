/**
 * High-level SEO Page Builder
 * Central wrapper combining title, description, keywords, canonical, social image and structured data hooks.
 * This reduces repetitive assembly across Astro pages.
 */
import { PLAYLIST_COVER_IMAGE, PODCAST_COVER_IMAGE } from "../../constants/assets";
import { LRUCache } from "@utils/cache/LRUCache";

import buildSeoText from "./textUnified";
import type { BuildSeoTextParams, SeoTextResult } from "./textUnified";

// Minimal JSON-LD structured data shape
export type StructuredData = Record<string, unknown>;

export type PageContentKind = "generic" | "news" | "playlist" | "podcast";

export interface BuildPageSeoParams extends Omit<BuildSeoTextParams, "descriptionBase"> {
  /** Base description text before enrichment */
  description: string;
  /** Absolute canonical URL of the page */
  url: string;
  /** Optional OpenGraph / Twitter image path or absolute URL */
  image?: string;
  /** Explicit OG type override (normally inferred from contentKind) */
  type?: "website" | "article" | "music" | "game" | "podcastEpisode";
  /** High level content kind for automatic type & fallback selection */
  contentKind?: PageContentKind;
  /** Provide explicit fallback image (else inferred via contentKind) */
  fallbackImage?: string;
  /** ISO publish date */
  publishDate?: string | Date;
  /** ISO modified date */
  modifiedDate?: string | Date;
  /** Additional meta tags to surface (raw key/value) */
  extraMeta?: Record<string, string>;
  /** Robots index flag (default true) */
  index?: boolean;
  /** Robots follow flag (default true) */
  follow?: boolean;
  /** Disallow caching of page content (robots noarchive) */
  noArchive?: boolean;
  /** Disallow image indexing (robots noimageindex) */
  noImageIndex?: boolean;
  /** Limit snippet length (characters) */
  maxSnippet?: number;
  /** Limit image preview size */
  maxImagePreview?: "none" | "standard" | "large";
  /** Limit video preview seconds/percent */
  maxVideoPreview?: number;
  /** Optional structured data array (JSON-LD objects) */
  structuredData?: StructuredData[];
  /** OpenGraph primary locale (e.g. en_US) */
  ogLocale?: string;
  /** Alternate OpenGraph locales */
  alternateLocales?: string[];
  /** Twitter creator handle (e.g. @melodymind) */
  twitterCreator?: string;
  /** Optional breadcrumbs to auto inject into structured data augmentation */
  breadcrumbs?: Array<{ name: string; url: string }>;
  /** Page author name for meta tag and structured data */
  authorName?: string;
  /** Alt text for OpenGraph image (accessibility) */
  imageAlt?: string;
  /** Enable memoization (default true) */
  memoize?: boolean;
  /** Automatically generate social image (if no explicit image) using provided generator */
  autoSocialImage?: boolean;
  /** Optional generator producing an image URL given title (and maybe kind). Must be synchronous for now (async stripped). */
  generateSocialImage?: (args: {
    title: string;
    contentKind: PageContentKind;
  }) => string | undefined;
  /** Optional logger invoked when social image generation fails */
  onSocialImageError?: (
    error: unknown,
    context: { title: string; contentKind: PageContentKind }
  ) => void;
}

export interface PageSeoResult extends SeoTextResult {
  title: string;
  canonical: string;
  image?: string;
  type: "website" | "article" | "music" | "game" | "podcastEpisode";
  publishDate?: Date;
  modifiedDate?: Date;
  extraMeta: Record<string, string>;
  robots: string;
  robotsDirectives: {
    index: boolean;
    follow: boolean;
    noarchive?: boolean;
    noimageindex?: boolean;
    maxSnippet?: number;
    maxImagePreview?: string;
    maxVideoPreview?: number;
  };
  openGraph: {
    title: string;
    description: string;
    type: string;
    url: string;
    image?: string;
    locale?: string;
  };
  twitter: {
    card: string; // e.g. summary_large_image
    title: string;
    description: string;
    image?: string;
    creator?: string;
  };
  structuredData: StructuredData[];
  ogLocale?: string;
  alternateLocales?: string[];
  /** Page author name */
  authorName?: string;
  /** Alt text for OpenGraph image */
  imageAlt?: string;
}

const BRAND_SUFFIX = " - MelodyMind";

/**
 * Maximum number of entries in the SEO cache.
 * Prevents memory bloat during long-running dev sessions.
 */
const MAX_SEO_CACHE_SIZE = 100;

// In-memory memoization cache using LRU eviction
const seoCache = new LRUCache<string, PageSeoResult>({ maxSize: MAX_SEO_CACHE_SIZE });

function ensureBrandSuffix(title: string): string {
  return title.endsWith(" - MelodyMind") || title.endsWith(" | Melody Mind")
    ? title.replace(" | Melody Mind", BRAND_SUFFIX)
    : `${title}${BRAND_SUFFIX}`;
}

/**
 * Build complete page-level SEO metadata in one call.
 * Wraps buildSeoText and augments with canonical URL, image, type and dates.
 *
 * @returns {PageSeoResult} Result containing description, keywords, canonical and social meta fields.
 */
function inferType(
  contentKind: PageContentKind,
  explicit?: PageSeoResult["type"]
): PageSeoResult["type"] {
  if (explicit) {
    return explicit;
  }
  switch (contentKind) {
    case "news":
      return "article";
    case "playlist":
      return "music";
    case "podcast":
      return "podcastEpisode";
    default:
      return "website";
  }
}

function resolveFallbackImage(
  contentKind: PageContentKind,
  override?: string
): string | undefined {
  if (override) {
    return override;
  }
  switch (contentKind) {
    case "playlist":
      return PLAYLIST_COVER_IMAGE;
    case "podcast":
      return PODCAST_COVER_IMAGE;
    default:
      return undefined;
  }
}

/**
 * High-level builder composing SEO description/keywords plus canonical, OG/Twitter meta,
 * robots directives, type inference and optional structured data.
 *
 * @returns {PageSeoResult} consolidated SEO result
 */
function buildCacheKey(o: {
  title: string;
  description: string;
  url: string;
  image?: string;
  type?: string;
  contentKind: string;
  enrichedParts?: string[];
  language?: string;
  index: boolean;
  follow: boolean;
}): string {
  return JSON.stringify(o);
}

function augmentStructuredData(
  base: StructuredData[],
  breadcrumbs?: Array<{ name: string; url: string }>
): StructuredData[] {
  if (!breadcrumbs || breadcrumbs.length === 0) {
    return base;
  }
  const hasBreadcrumb = base.some((obj) => obj["@type"] === "BreadcrumbList");
  if (hasBreadcrumb) {
    return base;
  }
  return [
    ...base,
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((b, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: b.name,
        item: b.url,
      })),
    },
  ];
}

function buildRobots(
  index: boolean,
  follow: boolean,
  extras: {
    noArchive?: boolean;
    noImageIndex?: boolean;
    maxSnippet?: number;
    maxImagePreview?: "none" | "standard" | "large";
    maxVideoPreview?: number;
  }
): string {
  const parts = [index ? "index" : "noindex", follow ? "follow" : "nofollow"];
  if (extras.noArchive) {
    parts.push("noarchive");
  }
  if (extras.noImageIndex) {
    parts.push("noimageindex");
  }
  if (typeof extras.maxSnippet === "number") {
    parts.push(`max-snippet:${extras.maxSnippet}`);
  }
  if (extras.maxImagePreview) {
    parts.push(`max-image-preview:${extras.maxImagePreview}`);
  }
  if (typeof extras.maxVideoPreview === "number") {
    parts.push(`max-video-preview:${extras.maxVideoPreview}`);
  }
  return parts.join(",");
}

function parseRobots(robots: string): PageSeoResult["robotsDirectives"] {
  const tokens = robots.split(/\s*,\s*/g).filter(Boolean);
  const map: Record<string, string | true> = {};
  for (const t of tokens) {
    const [k, v] = t.split(":", 2);
    map[k.toLowerCase()] = v ? v : true;
  }
  const index = map["index"] !== undefined ? map["index"] === true : !("noindex" in map);
  const follow =
    map["follow"] !== undefined ? map["follow"] === true : !("nofollow" in map);
  const rd: PageSeoResult["robotsDirectives"] = { index, follow };
  if (map["noarchive"]) {
    rd.noarchive = true;
  }
  if (map["noimageindex"]) {
    rd.noimageindex = true;
  }
  if (map["max-snippet"]) {
    rd.maxSnippet = Number(map["max-snippet"]);
  }
  if (map["max-image-preview"]) {
    rd.maxImagePreview = String(map["max-image-preview"]);
  }
  if (map["max-video-preview"]) {
    rd.maxVideoPreview = Number(map["max-video-preview"]);
  }
  return rd;
}

function prepareSeoText(
  normalizedTitle: string,
  description: string,
  enrichedParts: string[] | undefined,
  rest: Omit<BuildSeoTextParams, "descriptionBase" | "title"> & {
    [k: string]: unknown;
  }
): SeoTextResult {
  return buildSeoText({
    title: normalizedTitle,
    descriptionBase: description,
    enrichedParts,
    ...rest,
  });
}

function inferTypeAndImage(
  contentKind: PageContentKind,
  type: PageSeoResult["type"] | undefined,
  image: string | undefined,
  fallbackImage: string | undefined
): { inferredType: PageSeoResult["type"]; finalImage: string | undefined } {
  const inferredType = inferType(contentKind, type);
  const finalImage = image || resolveFallbackImage(contentKind, fallbackImage);
  return { inferredType, finalImage };
}

/**
 * Build complete page-level SEO object with memoization, type & image inference,
 * OG/Twitter meta model and optional structured data augmentation.
 *
 * @returns {PageSeoResult} SEO result object
 */
// Isolated helper to optionally derive a social image (kept pure & small)
function maybeGenerateSocialImage(
  current: string | undefined,
  flag: boolean,
  generator: BuildPageSeoParams["generateSocialImage"],
  onError: BuildPageSeoParams["onSocialImageError"],
  normalizedTitle: string,
  contentKind: PageContentKind
): string | undefined {
  if (current || !flag || typeof generator !== "function") {
    return current;
  }
  try {
    return generator({ title: normalizedTitle, contentKind });
  } catch (e) {
    if (onError) {
      onError(e, { title: normalizedTitle, contentKind });
    }
    return current; // swallow errors
  }
}

interface NormalizedResultBase {
  exited: false;
  cached?: undefined;
  title: string;
  description: string;
  enrichedParts?: string[];
  url: string;
  image?: string;
  type?: PageSeoResult["type"];
  contentKind: PageContentKind;
  fallbackImage?: string;
  publishDate?: string | Date;
  modifiedDate?: string | Date;
  extraMeta: Record<string, string>;
  index: boolean;
  follow: boolean;
  noArchive?: boolean;
  noImageIndex?: boolean;
  maxSnippet?: number;
  maxImagePreview?: "none" | "standard" | "large";
  maxVideoPreview?: number;
  structuredData: StructuredData[];
  ogLocale?: string;
  alternateLocales?: string[];
  twitterCreator?: string;
  breadcrumbs?: Array<{ name: string; url: string }>;
  authorName?: string;
  imageAlt?: string;
  memoize: boolean;
  autoSocialImage: boolean;
  generateSocialImage?: BuildPageSeoParams["generateSocialImage"];
  onSocialImageError?: BuildPageSeoParams["onSocialImageError"];
  rest: Record<string, unknown>;
  cacheKey: string;
}
interface NormalizedResultCached {
  exited: true;
  cached: PageSeoResult;
}
type NormalizedResult = NormalizedResultBase | NormalizedResultCached;

function normalizeAndMaybeGetCache(options: BuildPageSeoParams): NormalizedResult {
  const {
    title = "",
    description,
    enrichedParts,
    url,
    image,
    type,
    contentKind = "generic",
    fallbackImage,
    publishDate,
    modifiedDate,
    extraMeta = {},
    index = true,
    follow = true,
    noArchive,
    noImageIndex,
    maxSnippet,
    maxImagePreview,
    maxVideoPreview,
    structuredData = [],
    ogLocale,
    alternateLocales,
    twitterCreator,
    breadcrumbs,
    authorName,
    imageAlt,
    memoize = true,
    autoSocialImage = false,
    generateSocialImage,
    ...rest
  } = options;

  const cacheKey = memoize
    ? buildCacheKey({
        title,
        description,
        url,
        image,
        type,
        contentKind,
        enrichedParts,
        language: (rest as { language?: string }).language,
        index,
        follow,
      })
    : "";
  if (memoize && seoCache.has(cacheKey)) {
    return {
      cached: seoCache.get(cacheKey)!,
      exited: true,
    } as NormalizedResultCached;
  }
  return {
    exited: false,
    title,
    description,
    enrichedParts,
    url,
    image,
    type,
    contentKind,
    fallbackImage,
    publishDate,
    modifiedDate,
    extraMeta,
    index,
    follow,
    noArchive,
    noImageIndex,
    maxSnippet,
    maxImagePreview,
    maxVideoPreview,
    structuredData,
    ogLocale,
    alternateLocales,
    twitterCreator,
    breadcrumbs,
    authorName,
    imageAlt,
    memoize,
    autoSocialImage,
    generateSocialImage,
    rest,
    cacheKey,
  };
}

/**
 * Public entry: build consolidated SEO object from higher-level params.
 * Handles memoization, type/image inference, optional social image generation and robots directives.
 */
export function buildPageSeo(options: BuildPageSeoParams): PageSeoResult {
  const norm = normalizeAndMaybeGetCache(options);
  if (norm.exited) {
    return norm.cached; // early cached short path
  }

  const {
    title,
    description,
    enrichedParts,
    url,
    image,
    type,
    contentKind,
    fallbackImage,
    publishDate,
    modifiedDate,
    extraMeta,
    index,
    follow,
    noArchive,
    noImageIndex,
    maxSnippet,
    maxImagePreview,
    maxVideoPreview,
    structuredData,
    ogLocale,
    alternateLocales,
    twitterCreator,
    breadcrumbs,
    authorName,
    imageAlt,
    memoize,
    autoSocialImage,
    generateSocialImage,
    onSocialImageError,
    rest,
    cacheKey,
  } = norm;

  const normalizedTitle = ensureBrandSuffix(title);
  const seoText = prepareSeoText(normalizedTitle, description, enrichedParts, rest);
  const { inferredType, finalImage: baseImage } = inferTypeAndImage(
    contentKind,
    type as PageSeoResult["type"] | undefined,
    image,
    fallbackImage
  );
  const finalImage = maybeGenerateSocialImage(
    baseImage,
    autoSocialImage,
    generateSocialImage,
    onSocialImageError,
    normalizedTitle,
    contentKind
  );
  const robots = buildRobots(index, follow, {
    noArchive,
    noImageIndex,
    maxSnippet,
    maxImagePreview,
    maxVideoPreview,
  });

  // Structured data augmentation hook: inject breadcrumbs if available & not already present
  const augmentedStructured: StructuredData[] = augmentStructuredData(
    structuredData,
    breadcrumbs
  );

  const result: PageSeoResult = {
    title: normalizedTitle,
    description: seoText.description,
    keywords: seoText.keywords,
    keywordArray: seoText.keywordArray,
    enrichedContent: seoText.enrichedContent,
    canonical: url,
    image: finalImage,
    type: inferredType,
    publishDate: publishDate ? new Date(publishDate) : undefined,
    modifiedDate: modifiedDate ? new Date(modifiedDate) : undefined,
    extraMeta,
    robots,
    robotsDirectives: parseRobots(robots),
    openGraph: {
      title,
      description: seoText.description,
      type: inferredType,
      url,
      image: finalImage,
      locale: ogLocale,
    },
    twitter: {
      card: finalImage ? "summary_large_image" : "summary",
      title,
      description: seoText.description,
      image: finalImage,
      creator: twitterCreator,
    },
    structuredData: augmentedStructured,
    ogLocale,
    alternateLocales,
    authorName,
    imageAlt,
  };
  if (memoize) {
    seoCache.set(cacheKey, result);
  }
  return result;
}

/** Clear the SEO memoization cache (useful for dev hot reload). */
export function clearSeoCache(): void {
  seoCache.clear();
}

export default buildPageSeo;
