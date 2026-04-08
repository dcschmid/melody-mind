import { buildPageSeo, type StructuredData } from "@shared-utils/utils/seo/buildPageSeo";
import { buildArticleSchema } from "@shared-utils/utils/seo/seoSchema";
import { resolveBaseUrl, resolvePageUrl } from "@shared-utils/utils/siteUrls";
import { getGroupById, getSubsectionById } from "@utils/taxonomy/taxonomyUtils";
import {
  getKnowledgeCategoryImage,
  getKnowledgeCategoryImageSrc,
  getKnowledgeCategoryImageUrl,
  knowledgeHeroImageUrl,
} from "@utils/knowledgeImages";
import { getReadingTime } from "@shared-utils/utils/readingTime";
import type {
  ArticleHeroLink,
  KnowledgeArticleLike,
  ResolvedKnowledgeEntry,
} from "./articlePageTypes";
import { KNOWLEDGE_ARTICLE_SEO_TITLE_OVERRIDES } from "./articlePageTypes";

interface BuildKnowledgeArticleStructuredDataParams {
  canonical: string;
  description: string;
  imageAbsolute: string;
  imageHeight: number;
  imageWidth: number;
  keywords: string[];
  lang: string;
  podcastBase: string;
  podcastUrl: string | null;
  title: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  body?: string;
}

interface BuildKnowledgeArticlePageDataParams {
  site: URL | undefined;
  entry: ResolvedKnowledgeEntry;
  lang: string;
  slugKey: string;
}

/**
 * Normalizes Astro catch-all route params into a slash-separated slug.
 */
export function resolveKnowledgeSlug(
  slugParam: string | string[] | undefined
): string | undefined {
  return Array.isArray(slugParam) ? slugParam.join("/") : slugParam;
}

/**
 * Returns the search-optimized title tag for a knowledge article when one is defined.
 */
function getKnowledgeSeoTitle(slugKey: string, title: string): string {
  return KNOWLEDGE_ARTICLE_SEO_TITLE_OVERRIDES[slugKey] || title;
}

/**
 * Resolves the canonical podcast URL from explicit URL first, then from known slug fields.
 */
function getKnowledgePodcastUrl(
  articleData: KnowledgeArticleLike["data"],
  podcastBase: string
): string | null {
  if (!articleData) {
    return null;
  }

  if (typeof articleData.podcastUrl === "string" && articleData.podcastUrl.trim()) {
    return articleData.podcastUrl.trim();
  }

  const podcastSlug = [articleData.podcastSlug, articleData.podcast]
    .find((value) => typeof value === "string" && value.trim())
    ?.trim();

  return podcastSlug ? `${podcastBase}/${encodeURI(podcastSlug)}` : null;
}

/**
 * Resolves taxonomy metadata for UI pills and breadcrumb generation.
 */
function getKnowledgeTaxonomyMeta(
  site: URL | undefined,
  taxonomySubsection: unknown,
  taxonomyGroup: unknown
) {
  const currentTaxonomySubsection =
    typeof taxonomySubsection === "string" ? taxonomySubsection.trim() : "";
  const currentTaxonomyGroup =
    typeof taxonomyGroup === "string" ? taxonomyGroup.trim() : "";

  const resolvedTaxonomySubsection = currentTaxonomySubsection
    ? getSubsectionById(currentTaxonomySubsection)
    : undefined;
  const resolvedTaxonomyGroup = currentTaxonomyGroup
    ? getGroupById(currentTaxonomyGroup)
    : undefined;

  const seoCategoryCrumb = resolvedTaxonomyGroup
    ? {
        name: resolvedTaxonomyGroup.group.title,
        url: resolvePageUrl(
          site,
          `/taxonomy/${resolvedTaxonomyGroup.section.id}#${resolvedTaxonomyGroup.subsection.id}--${resolvedTaxonomyGroup.group.id}`
        ),
      }
    : resolvedTaxonomySubsection
      ? {
          name: resolvedTaxonomySubsection.subsection.title,
          url: resolvePageUrl(
            site,
            `/taxonomy/${resolvedTaxonomySubsection.section.id}#${resolvedTaxonomySubsection.subsection.id}`
          ),
        }
      : null;

  return {
    currentTaxonomySubsection,
    currentTaxonomyGroup,
    resolvedTaxonomySubsection,
    resolvedTaxonomyGroup,
    seoCategoryCrumb,
    taxonomyPillLabel:
      resolvedTaxonomyGroup?.group.title ||
      resolvedTaxonomySubsection?.subsection.title ||
      "",
  };
}

/**
 * Builds the article or podcast structured data block for a knowledge detail page.
 */
function buildKnowledgeArticleStructuredData({
  canonical,
  description,
  imageAbsolute,
  imageHeight,
  imageWidth,
  keywords,
  lang,
  podcastBase,
  podcastUrl,
  title,
  createdAt,
  updatedAt,
  body,
}: BuildKnowledgeArticleStructuredDataParams): StructuredData[] {
  const schemaType = podcastUrl ? "PodcastEpisode" : "Article";

  return [
    buildArticleSchema({
      canonical,
      title,
      description,
      imageUrl: imageAbsolute,
      imageWidth,
      imageHeight,
      keywords,
      lang,
      createdAt,
      updatedAt,
      body,
      schemaType,
      articleSection: "Music Knowledge",
      isPartOf: podcastUrl
        ? {
            "@type": "PodcastSeries",
            name: "Melody Mind Podcasts",
            url: podcastBase,
          }
        : undefined,
      potentialAction: podcastUrl
        ? {
            "@type": "ListenAction",
            target: podcastUrl,
          }
        : undefined,
    }),
  ];
}

export function buildKnowledgeArticlePageData({
  site,
  entry,
  lang,
  slugKey,
}: BuildKnowledgeArticlePageDataParams) {
  const normalizedKeywords = Array.isArray(entry.data.keywords)
    ? entry.data.keywords.filter(
        (keyword): keyword is string =>
          typeof keyword === "string" && keyword.trim().length > 0
      )
    : [];
  const rawImage = entry.data.image;
  const isValidImage =
    typeof rawImage === "string" && /\.(png|jpg|jpeg|webp|avif)$/i.test(rawImage);
  const baseUrl = resolveBaseUrl(site);
  const imageSource = isValidImage ? getKnowledgeCategoryImage(rawImage) : undefined;
  const title = entry.data.title;
  const seoTitle = getKnowledgeSeoTitle(slugKey, title);
  const description = entry.data.description;
  const optimizedDescription = description || title;
  const imageAbsolute =
    (isValidImage && getKnowledgeCategoryImageUrl(rawImage, baseUrl)) ||
    knowledgeHeroImageUrl(baseUrl);
  const imageWidth = imageSource?.width || 1024;
  const imageHeight = imageSource?.height || 683;
  const canonical = slugKey
    ? resolvePageUrl(site, `/knowledge/${slugKey}`)
    : resolvePageUrl(site, "/");
  const podcastBase = "https://podcasts.melody-mind.de";
  const podcastUrl = getKnowledgePodcastUrl(entry.data, podcastBase);
  const {
    currentTaxonomySubsection,
    currentTaxonomyGroup,
    seoCategoryCrumb,
    taxonomyPillLabel,
  } = getKnowledgeTaxonomyMeta(
    site,
    entry.data.taxonomySubsection,
    entry.data.taxonomyGroup
  );
  const seoBreadcrumbs = [
    { name: "Home", url: resolvePageUrl(site, "/") },
    ...(seoCategoryCrumb ? [seoCategoryCrumb] : []),
    { name: title, url: canonical },
  ];
  const structuredData = buildKnowledgeArticleStructuredData({
    canonical,
    description,
    imageAbsolute,
    imageHeight,
    imageWidth,
    keywords: normalizedKeywords,
    lang,
    podcastBase,
    podcastUrl,
    title,
    createdAt: entry.data.createdAt,
    updatedAt: entry.data.updatedAt,
    body: entry.body,
  });
  const readingResult = getReadingTime(entry.body || "", { languageCode: lang });
  const publishedDate = new Date(
    entry.data.updatedAt || entry.data.createdAt || new Date()
  );
  const publishedDateLabel = publishedDate.toLocaleDateString(lang, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const currentKeywords = (
    Array.isArray(entry.data.keywords)
      ? entry.data.keywords
          .map((keyword: unknown) =>
            typeof keyword === "string" ? keyword.trim().toLowerCase() : ""
          )
          .filter((keyword: string): keyword is string => Boolean(keyword))
      : []
  ).slice();
  const pageSeo = buildPageSeo({
    title: seoTitle,
    description: optimizedDescription,
    url: canonical,
    contentKind: "generic",
    breadcrumbs: seoBreadcrumbs,
    structuredData,
    enrichedParts: [title, description].filter(Boolean) as string[],
    fallbackKeywords: normalizedKeywords.slice(0, 20),
    keywordLimit: 24,
    maxDescription: 155,
    image: imageAbsolute,
    imageAlt: title,
    publishDate: entry.data.createdAt ? new Date(entry.data.createdAt) : new Date(),
    modifiedDate: entry.data.updatedAt ? new Date(entry.data.updatedAt) : new Date(),
    index: true,
    follow: true,
    autoSocialImage: false,
    authorName: entry.data.author || "Melody Mind",
  });
  const articleLinksSource: ArticleHeroLink[] = [
    {
      href: entry.data.playlists?.spotifyPlaylist,
      label: "Spotify",
      icon: "spotify",
      variant: "secondary",
      ariaLabel: `Open Spotify playlist for ${title}`,
    },
    {
      href: entry.data.playlists?.deezerPlaylist,
      label: "Deezer",
      icon: "deezer",
      variant: "secondary",
      ariaLabel: `Open Deezer playlist for ${title}`,
    },
    {
      href: podcastUrl,
      label: "Open podcast episode",
      icon: "headphones",
      variant: "primary",
      ariaLabel: `Open podcast page for ${title}`,
    },
  ];
  const articleLinks = articleLinksSource.filter(
    (link): link is ArticleHeroLink & { href: string } =>
      typeof link.href === "string" && link.href.trim().length > 0
  );

  return {
    articleLinks,
    canonical,
    currentKeywords,
    currentTaxonomyGroup,
    currentTaxonomySubsection,
    description,
    imageSource,
    pageSeo,
    publishedDate,
    publishedDateLabel,
    readingResult,
    taxonomyPillLabel,
    title,
  };
}

export function buildKnowledgeArticleStorageMeta(
  entry: ResolvedKnowledgeEntry,
  slug: string
) {
  const storageUpdatedAtRaw = entry.data.updatedAt || entry.data.createdAt || "";
  const parsedStorageDate = storageUpdatedAtRaw ? new Date(storageUpdatedAtRaw) : null;
  const storageUpdatedAt =
    parsedStorageDate && !Number.isNaN(parsedStorageDate.valueOf())
      ? parsedStorageDate.toISOString()
      : "";

  return {
    storageSlug: slug || entry.id,
    storageUpdatedAt,
    storageImage: getKnowledgeCategoryImageSrc(entry.data.image) || "",
  };
}
