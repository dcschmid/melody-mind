import type { StructuredData } from "@shared-utils/utils/seo/buildPageSeo";
import { normalizeDate } from "@shared-utils/utils/content/dateUtils";
import { getReadingTime } from "@shared-utils/utils/readingTime";
import { resolvePageUrl } from "@shared-utils/utils/siteUrls";
import { getGroupById, getSubsectionById } from "@utils/taxonomy/taxonomyUtils";

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
    podcastSlug?: string;
    podcast?: string;
    podcastUrl?: string;
  };
}

export interface RelatedKnowledgeArticle {
  slug: string;
  title: string;
  description: string;
  image?: string;
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
    {
      "@context": "https://schema.org",
      "@type": schemaType,
      headline: title,
      name: title,
      description,
      image: {
        "@type": "ImageObject",
        url: imageAbsolute,
        width: imageWidth,
        height: imageHeight,
      },
      url: canonical,
      author: { "@type": "Organization", name: "Melody Mind" },
      publisher: {
        "@type": "Organization",
        name: "Melody Mind",
        logo: {
          "@type": "ImageObject",
          url: "https://melody-mind.de/melody-mind.png",
        },
      },
      ...(podcastUrl
        ? {
            isPartOf: {
              "@type": "PodcastSeries",
              name: "Melody Mind Podcasts",
              url: podcastBase,
            },
            potentialAction: {
              "@type": "ListenAction",
              target: podcastUrl,
            },
          }
        : {}),
      datePublished:
        createdAt instanceof Date ? createdAt.toISOString() : createdAt?.toString(),
      dateModified:
        updatedAt instanceof Date ? updatedAt.toISOString() : updatedAt?.toString(),
      mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
      inLanguage: lang,
      keywords: keywords.join(", "),
      articleSection: "Music Knowledge",
      wordCount: body?.length || 0,
    },
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
        image: typeof article?.data?.image === "string" ? article.data.image : undefined,
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
