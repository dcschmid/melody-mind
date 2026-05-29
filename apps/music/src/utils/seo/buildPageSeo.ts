/**
 * High-level page SEO composer used by Astro pages across the monorepo.
 *
 * The helper centralizes the recurring assembly work around:
 * - branded titles and enriched descriptions/keywords via `buildSeoText()`
 * - canonical, Open Graph and Twitter meta payloads
 * - robots directives
 * - optional JSON-LD augmentation such as breadcrumbs
 * - lightweight in-memory memoization for repeated calls during a single process
 */
import { createMemoCache } from "@utils/memoCache";

import buildSeoText from "@utils/seo/textUnified";
import type { BuildSeoTextParams, SeoTextResult } from "@utils/seo/textUnified";

/** Minimal JSON-LD object shape accepted by the builder. */
export type StructuredData = Record<string, unknown>;

/** Coarse page classification used for default OG type and fallback social image inference. */
export type PageContentKind = "generic" | "news" | "playlist" | "podcast";

export interface AlternateLocaleLink {
  locale: string;
  href: string;
}

type PageSeoType =
  | "website"
  | "article"
  | "musicAlbum"
  | "musicPlaylist"
  | "game"
  | "podcastEpisode";

/**
 * Input contract for `buildPageSeo()`.
 *
 * This extends the lower-level SEO text builder with page-level concerns such as
 * canonical URL, social image handling, robots directives and JSON-LD.
 */
export interface BuildPageSeoParams extends Omit<BuildSeoTextParams, "descriptionBase"> {
  /** Base description text before enrichment */
  description: string;
  /** Absolute canonical URL of the page */
  url: string;
  /** Optional OpenGraph / Twitter image path or absolute URL */
  image?: string;
  /** Explicit OG type override (normally inferred from contentKind) */
  type?: PageSeoType;
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
  alternateLocales?: AlternateLocaleLink[];
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
  /** Override default title branding, or disable branding with false */
  brandSuffix?: string | false;
}

export interface PageSeoResult extends SeoTextResult {
  title: string;
  canonical: string;
  image?: string;
  type: PageSeoType;
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
  alternateLocales?: AlternateLocaleLink[];
  /** Page author name */
  authorName?: string;
  /** Alt text for OpenGraph image */
  imageAlt?: string;
}

const BRAND_SUFFIX = " - MelodyMind";

/**
 * Process-local cache only.
 *
 * This improves repeated calls in dev/SSR runs, but it is not persistent across requests,
 * builds or browser sessions.
 */
const seoCache = createMemoCache<string, PageSeoResult>();

/**
 * Ensures page titles follow the shared branding convention exactly once.
 *
 * When the legacy `| Melody Mind` suffix appears, it is normalized to the current
 * ` - MelodyMind` format so downstream pages do not have to care about historical variants.
 */
function ensureBrandSuffix(
  title: string,
  brandSuffix: string | false = BRAND_SUFFIX
): string {
  if (brandSuffix === false) {
    return title;
  }

  if (title.endsWith(brandSuffix)) {
    return title;
  }

  if (brandSuffix === BRAND_SUFFIX && title.endsWith(" | Melody Mind")) {
    return title.replace(" | Melody Mind", BRAND_SUFFIX);
  }

  return `${title}${brandSuffix}`;
}

/** Maps the high-level page kind to the default Open Graph/content type. */
function inferType(contentKind: PageContentKind, explicit?: PageSeoType): PageSeoType {
  if (explicit) {
    return explicit;
  }
  switch (contentKind) {
    case "news":
      return "article";
    case "playlist":
      return "musicPlaylist";
    case "podcast":
      return "podcastEpisode";
    default:
      return "website";
  }
}

function toOpenGraphType(type: PageSeoType): string {
  switch (type) {
    case "podcastEpisode":
      return "article";
    case "musicAlbum":
      return "music.album";
    case "musicPlaylist":
      return "music.playlist";
    default:
      return type;
  }
}

/** Picks a content-kind-specific fallback social image when callers do not provide one. */
function resolveFallbackImage(
  contentKind: PageContentKind,
  override?: string
): string | undefined {
  // Note: PLAYLIST_COVER_IMAGE and PODCAST_COVER_IMAGE were removed because
  // the referenced files (/homecategories/playlist.png, /homecategories/podcast.png)
  // do not exist in any app's public/ directory. If fallback images are needed,
  // add actual image files and update the constants in assets.ts.
  void contentKind;
  return override;
}

function normalizeCacheValue(value: unknown): unknown {
  if (value instanceof Date) {
    return value.toISOString();
  }

  if (Array.isArray(value)) {
    return value.map((entry) => normalizeCacheValue(entry));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, entry]) => [key, normalizeCacheValue(entry)])
    );
  }

  return value;
}

/**
 * Produces the memoization key for the normalized SEO inputs.
 *
 * The key intentionally includes every option that can change the public SEO payload.
 * Objects are normalized recursively so equivalent inputs with different key orderings
 * still resolve to the same cache entry.
 */
function buildCacheKey(value: unknown): string {
  return JSON.stringify(normalizeCacheValue(value));
}

/**
 * Adds a BreadcrumbList JSON-LD object when breadcrumbs are supplied and the caller
 * has not already provided one explicitly.
 */
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

/** Serializes robots booleans and preview limits into a single meta robots string. */
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

/**
 * Builds the structured robots directives object directly from the input booleans
 * instead of parsing the serialized string back.
 */
function buildRobotsDirectives(
  index: boolean,
  follow: boolean,
  extras: {
    noArchive?: boolean;
    noImageIndex?: boolean;
    maxSnippet?: number;
    maxImagePreview?: "none" | "standard" | "large";
    maxVideoPreview?: number;
  }
): PageSeoResult["robotsDirectives"] {
  const rd: PageSeoResult["robotsDirectives"] = { index, follow };
  if (extras.noArchive) {
    rd.noarchive = true;
  }
  if (extras.noImageIndex) {
    rd.noimageindex = true;
  }
  if (typeof extras.maxSnippet === "number") {
    rd.maxSnippet = extras.maxSnippet;
  }
  if (extras.maxImagePreview) {
    rd.maxImagePreview = extras.maxImagePreview;
  }
  if (typeof extras.maxVideoPreview === "number") {
    rd.maxVideoPreview = extras.maxVideoPreview;
  }
  return rd;
}

/** Delegates text generation to `buildSeoText()` while locking in page-level title/description inputs. */
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
    ...(enrichedParts !== undefined && { enrichedParts }),
    ...rest,
  });
}

/** Resolves the effective OG type and base social image before optional image generation runs. */
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
 * Optionally derives a social image if the caller opted in and no explicit image is already present.
 *
 * Generator errors are swallowed so SEO generation remains resilient; callers can still observe
 * failures through `onSocialImageError`.
 */
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

/** Normalized option bag used after defaulting and optional early cache short-circuiting. */
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
  alternateLocales?: AlternateLocaleLink[];
  twitterCreator?: string;
  breadcrumbs?: Array<{ name: string; url: string }>;
  authorName?: string;
  imageAlt?: string;
  brandSuffix: string | false;
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

/**
 * Applies defaults, computes the cache key and returns an early cached result when possible.
 *
 * Keeping this normalization isolated prevents the public builder from mixing option parsing
 * with SEO payload assembly.
 */
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
    brandSuffix = BRAND_SUFFIX,
    memoize = true,
    autoSocialImage = false,
    generateSocialImage,
    onSocialImageError,
    ...rest
  } = options;

  const canMemoize =
    memoize && !(autoSocialImage && typeof generateSocialImage === "function");
  const cacheKey = canMemoize
    ? buildCacheKey({
        title,
        description,
        url,
        image,
        type,
        contentKind,
        fallbackImage,
        publishDate,
        modifiedDate,
        extraMeta,
        enrichedParts,
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
        brandSuffix,
        autoSocialImage,
        rest,
      })
    : "";
  if (canMemoize && seoCache.has(cacheKey)) {
    return {
      cached: seoCache.get(cacheKey)!,
      exited: true,
    } as NormalizedResultCached;
  }
  return {
    exited: false,
    title,
    description,
    ...(enrichedParts !== undefined && { enrichedParts }),
    url,
    ...(image !== undefined && { image }),
    ...(type !== undefined && { type }),
    contentKind,
    ...(fallbackImage !== undefined && { fallbackImage }),
    ...(publishDate !== undefined && { publishDate }),
    ...(modifiedDate !== undefined && { modifiedDate }),
    extraMeta,
    index,
    follow,
    ...(noArchive !== undefined && { noArchive }),
    ...(noImageIndex !== undefined && { noImageIndex }),
    ...(maxSnippet !== undefined && { maxSnippet }),
    ...(maxImagePreview !== undefined && { maxImagePreview }),
    ...(maxVideoPreview !== undefined && { maxVideoPreview }),
    structuredData,
    ...(ogLocale !== undefined && { ogLocale }),
    ...(alternateLocales !== undefined && { alternateLocales }),
    ...(twitterCreator !== undefined && { twitterCreator }),
    ...(breadcrumbs !== undefined && { breadcrumbs }),
    ...(authorName !== undefined && { authorName }),
    ...(imageAlt !== undefined && { imageAlt }),
    brandSuffix,
    memoize: canMemoize,
    ...(autoSocialImage !== undefined && { autoSocialImage }),
    ...(generateSocialImage !== undefined && { generateSocialImage }),
    ...(onSocialImageError !== undefined && { onSocialImageError }),
    rest,
    cacheKey,
  } as NormalizedResultBase;
}

/**
 * Builds the consolidated page SEO model consumed by layouts and page components.
 *
 * The returned object is already normalized for common downstream needs:
 * - branded title
 * - enriched description and keyword list
 * - Open Graph and Twitter payloads
 * - parsed robots directives
 * - breadcrumb-aware structured data
 *
 * The function is pure from the caller's perspective except for optional cache writes and
 * optional error callbacks from social image generation.
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
    brandSuffix,
    memoize,
    autoSocialImage,
    generateSocialImage,
    onSocialImageError,
    rest,
    cacheKey,
  } = norm;

  const normalizedTitle = ensureBrandSuffix(title, brandSuffix);
  const seoText = prepareSeoText(normalizedTitle, description, enrichedParts, rest);
  const { inferredType, finalImage: baseImage } = inferTypeAndImage(
    contentKind,
    type as PageSeoType | undefined,
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
    ...(noArchive !== undefined && { noArchive }),
    ...(noImageIndex !== undefined && { noImageIndex }),
    ...(maxSnippet !== undefined && { maxSnippet }),
    ...(maxImagePreview !== undefined && { maxImagePreview }),
    ...(maxVideoPreview !== undefined && { maxVideoPreview }),
  });

  const robotsDirectives = buildRobotsDirectives(index, follow, {
    ...(noArchive !== undefined && { noArchive }),
    ...(noImageIndex !== undefined && { noImageIndex }),
    ...(maxSnippet !== undefined && { maxSnippet }),
    ...(maxImagePreview !== undefined && { maxImagePreview }),
    ...(maxVideoPreview !== undefined && { maxVideoPreview }),
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
    ...(finalImage !== undefined && { image: finalImage }),
    type: inferredType,
    ...(publishDate !== undefined && { publishDate: new Date(publishDate) }),
    ...(modifiedDate !== undefined && { modifiedDate: new Date(modifiedDate) }),
    extraMeta,
    robots,
    robotsDirectives,
    openGraph: {
      title: normalizedTitle,
      description: seoText.description,
      type: toOpenGraphType(inferredType),
      url,
      ...(finalImage !== undefined && { image: finalImage }),
      ...(ogLocale !== undefined && { locale: ogLocale }),
    },
    twitter: {
      card: finalImage ? "summary_large_image" : "summary",
      title: normalizedTitle,
      description: seoText.description,
      ...(finalImage !== undefined && { image: finalImage }),
      ...(twitterCreator !== undefined && { creator: twitterCreator }),
    },
    structuredData: augmentedStructured,
    ...(ogLocale !== undefined && { ogLocale }),
    ...(alternateLocales !== undefined && { alternateLocales }),
    ...(authorName !== undefined && { authorName }),
    ...(imageAlt !== undefined && { imageAlt }),
  };
  if (memoize) {
    seoCache.set(cacheKey, result);
  }
  return result;
}
