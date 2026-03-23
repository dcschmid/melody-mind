import { getCollection, type RenderedContent } from "astro:content";
import type { LinkPanelItem } from "@shared-ui/components/cards/linkPanel";
import { buildPageSeo, type StructuredData } from "@shared-utils/utils/seo/buildPageSeo";
import { getCollectionCached } from "@shared-utils/utils/content/getCollectionCached";
import { normalizeDate } from "@shared-utils/utils/content/dateUtils";
import { getReadingTime } from "@shared-utils/utils/readingTime";
import { loggers } from "@shared-utils/utils/logging";
import { buildArticleSchema } from "@shared-utils/utils/seo/seoSchema";
import { resolveBaseUrl, resolvePageUrl } from "@shared-utils/utils/siteUrls";
import { getGroupById, getSubsectionById } from "@utils/taxonomy/taxonomyUtils";
import {
  getKnowledgeCategoryImage,
  getKnowledgeCategoryImageSrc,
  getKnowledgeCategoryImageUrl,
  knowledgeHeroImageUrl,
} from "@utils/knowledgeImages";

/**
 * Search-focused title overrides for specific high-value knowledge articles.
 * The visible page headline can stay editorial while the title tag stays descriptive.
 */
export const KNOWLEDGE_ARTICLE_SEO_TITLE_OVERRIDES: Record<string, string> = {
  "1960s": "1960s Music History: Pop, Protest and Psychedelia",
  "1980s": "1980s Music History: MTV, Synths and Global Pop",
  "2010s": "2010s Music History: Streaming and Global Pop",
  "from-asia-pop-to-global-pop": "J-Pop and K-Pop: From Regional Scenes to Global Pop",
  "from-blues-to-breakdown": "Heavy Music History: From Blues to Metalcore",
  "from-folk-to-bedroom-pop": "Intimate Songwriting: From Folk to Bedroom Pop",
  "from-gospel-to-modern-vocal-pop-": "Gospel to Modern Vocal Pop",
  "from-hip-hop-to-trap-drill": "Hip Hop History: Block Parties, Trap and Drill",
  "from-jazz-to-neo-soul": "Jazz to Neo Soul: Fusion, Acid Jazz and Modern Soul",
  "from-latin-to-latin-trap": "Latin Music History: From Salsa to Latin Trap",
  "from-pop-to-streaming-pop": "Pop Music History: From Radio to Streaming",
  "from-post-punk-to-industrial-metal":
    "Industrial Rock History: From Post-Punk to Metal",
  "from-punk-to-indie": "Alternative Music: From Punk to Indie",
  "from-ska-to-global-bass": "Jamaican Music History: From Ska to Global Bass",
  "from-soul-to-modern-dance-music": "Dance Music History: From Soul to House and Techno",
};

export interface KnowledgeArticleLike {
  id?: string;
  slug?: string;
  body?: string;
  data?: {
    title?: string;
    description?: string;
    image?: string;
    keywords?: unknown[];
    createdAt?: Date | string;
    updatedAt?: Date | string;
    readingTime?: number;
    taxonomySubsection?: string;
    taxonomyGroup?: string;
    takeaways?: string[];
    author?: string;
    aiGenerated?: boolean;
    aiTools?: string[];
    playlists?: {
      spotifyPlaylist?: string;
      deezerPlaylist?: string;
    };
    podcastSlug?: string;
    podcast?: string;
    podcastUrl?: string;
  };
}

export interface ArticleHeroLink extends Omit<LinkPanelItem, "href"> {
  href?: string | null;
}

export interface ResolvedKnowledgeEntry extends KnowledgeArticleLike {
  collection: "knowledge-en";
  filePath?: string;
  rendered?: RenderedContent;
  id: string;
  body?: string;
  data: NonNullable<KnowledgeArticleLike["data"]> & {
    title: string;
    description: string;
  };
}

interface BuildKnowledgeArticlePageDataParams {
  site: URL | undefined;
  entry: ResolvedKnowledgeEntry;
  lang: string;
  slugKey: string;
}

export async function getKnowledgeArticleStaticPaths() {
  const entries: any[] = await getCollectionCached("knowledge-en", {
    getCollection,
  }).catch(() => []);
  const paths: Array<{ params: { slug: string }; props: { entry: any } }> = [];

  for (const entry of entries) {
    const slug = entry?.slug || entry?.id;
    if (!slug) {
      continue;
    }

    paths.push({ params: { slug }, props: { entry } });
  }

  return paths;
}

export async function resolveKnowledgeArticleEntry(params: {
  entry?: any;
  slug: string | undefined;
  lang: string;
}): Promise<ResolvedKnowledgeEntry | null> {
  const { entry: initialEntry, slug, lang } = params;
  let entry = initialEntry;

  if (!entry) {
    try {
      const articles: any[] = await getCollectionCached("knowledge-en", {
        getCollection,
      }).catch(() => []);
      if (slug) {
        entry = articles.find((article) => article.slug === slug || article.id === slug);
      }
    } catch (e) {
      loggers.pages.warn("knowledge article: collection load issue (fallback)", {
        error: (e as any)?.message || e,
      });
    }
  }

  if (!entry?.data?.title || !entry?.data?.description) {
    return null;
  }

  if (!entry.data.readingTime && entry.body) {
    try {
      entry = {
        ...entry,
        data: {
          ...entry.data,
          readingTime: getReadingTime(entry.body || "", { languageCode: lang }).minutes,
        },
      };
    } catch {
      // ignore reading time calculation errors
    }
  }

  return entry as ResolvedKnowledgeEntry;
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
      analyticsPodcastTarget: "episode",
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

export interface RelatedKnowledgeArticle {
  slug: string;
  title: string;
  description: string;
  image?: string | import("astro").ImageMetadata;
  createdAt: Date;
  readingTime: number;
}

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
export function getKnowledgeSeoTitle(slugKey: string, title: string): string {
  return KNOWLEDGE_ARTICLE_SEO_TITLE_OVERRIDES[slugKey] || title;
}

/**
 * Resolves the canonical podcast URL from explicit URL first, then from known slug fields.
 */
export function getKnowledgePodcastUrl(
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
export function getKnowledgeTaxonomyMeta(
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
export function buildKnowledgeArticleStructuredData({
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

function toKeywordSet(keywords: unknown[] | undefined): Set<string> {
  return new Set(
    Array.isArray(keywords)
      ? keywords
          .map((keyword) =>
            typeof keyword === "string" ? keyword.trim().toLowerCase() : ""
          )
          .filter(Boolean)
      : []
  );
}

/**
 * Scores and returns the strongest related articles for a knowledge detail page.
 */
export function getRelatedKnowledgeArticles(params: {
  articles: KnowledgeArticleLike[];
  currentKeywords: Set<string>;
  currentTaxonomyGroup: string;
  currentTaxonomySubsection: string;
  currentSlug: string;
  lang: string;
  limit?: number;
}): RelatedKnowledgeArticle[] {
  const {
    articles,
    currentKeywords,
    currentTaxonomyGroup,
    currentTaxonomySubsection,
    currentSlug,
    lang,
    limit = 3,
  } = params;

  return articles
    .filter((article) => {
      const articleSlug = String(article?.slug || article?.id || "");
      return articleSlug && articleSlug !== currentSlug;
    })
    .map((article) => {
      const articleKeywords = toKeywordSet(article.data?.keywords);
      let score = 0;

      if (
        currentTaxonomySubsection &&
        article?.data?.taxonomySubsection === currentTaxonomySubsection
      ) {
        score += 12;
      }

      if (currentTaxonomyGroup && article?.data?.taxonomyGroup === currentTaxonomyGroup) {
        score += 4;
      }

      let keywordOverlap = 0;
      for (const keyword of articleKeywords) {
        if (currentKeywords.has(keyword)) {
          keywordOverlap += 1;
        }
      }
      score += Math.min(keywordOverlap, 4);

      const createdAt = normalizeDate(article?.data?.createdAt) || new Date(0);
      const updatedAt = normalizeDate(article?.data?.updatedAt) || createdAt;
      const readingTime =
        typeof article?.data?.readingTime === "number"
          ? article.data.readingTime
          : getReadingTime(article?.body || "", { languageCode: lang }).minutes;

      return {
        slug: String(article?.slug || article?.id || ""),
        title: String(article?.data?.title || ""),
        description: String(article?.data?.description || ""),
        image: getKnowledgeCategoryImage(
          typeof article?.data?.image === "string" ? article.data.image : undefined
        ),
        createdAt,
        updatedAt,
        readingTime,
        score,
      };
    })
    .filter((article) => article.title && article.description && article.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      if (b.updatedAt.getTime() !== a.updatedAt.getTime()) {
        return b.updatedAt.getTime() - a.updatedAt.getTime();
      }
      return a.slug.localeCompare(b.slug);
    })
    .slice(0, limit)
    .map(({ updatedAt: _updatedAt, score: _score, ...article }) => article);
}
