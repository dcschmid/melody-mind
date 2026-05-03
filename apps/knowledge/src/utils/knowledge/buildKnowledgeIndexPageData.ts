import {
  buildPageSeo,
  type PageSeoResult,
  type StructuredData,
} from "@shared-utils/utils/seo/buildPageSeo";
import {
  buildCollectionPageSchema,
  buildKnowledgeArticlesItemList,
  type KnowledgeArticleLike,
} from "@shared-utils/utils/seo/seoSchema";
import { calculateReadingTime } from "@shared-utils/utils/readingTime";
import { sortEntries } from "@shared-utils/utils/content/sortEntries";
import { getCollection } from "astro:content";
import { getCollectionCached } from "@shared-utils/utils/content/getCollectionCached";
import {
  normalizeDate,
  derivePublishModified,
} from "@shared-utils/utils/content/dateUtils";
import { resolveBaseUrl, resolvePageUrl } from "@shared-utils/utils/siteUrls";
import { loggers } from "@shared-utils/utils/logging";
import { musicTaxonomy } from "../../data/musicTaxonomy";
import type { TaxonomySection } from "../../types/taxonomy";
import { countArticlesPerSubsection } from "../taxonomy/taxonomyUtils";
import {
  getKnowledgeCategoryImageUrl,
  knowledgeHeroImageUrl,
} from "@utils/knowledgeImages";

type KnowledgeIndexArticle = {
  id?: string;
  slug?: string;
  body?: string;
  data: {
    title?: string;
    description?: string;
    createdAt?: Date | string | null;
    updatedAt?: Date | string | null;
    readingTime?: number;
    keywords?: string[];
    image?: string;
    taxonomySubsection?: string;
  };
};

export type KnowledgeIndexSection = TaxonomySection & {
  subsectionCount: number;
  articleCount: number;
};

type BuildKnowledgeIndexPageDataResult = {
  pageSeo: PageSeoResult;
  taxonomySections: KnowledgeIndexSection[];
};

const KNOWLEDGE_INDEX_TITLE = "Music Knowledge";
const KNOWLEDGE_INDEX_DESCRIPTION =
  "Curated genre deep dives from roots to today's sounds, with stories, listening cues, and playlists that help you explore faster and hear music with more context.";

const normalizeKnowledgeArticles = (
  articles: KnowledgeIndexArticle[]
): KnowledgeIndexArticle[] =>
  articles.map((article) => {
    const createdAt = normalizeDate(article?.data?.createdAt);
    const updatedAt = normalizeDate(article?.data?.updatedAt);
    const readingTime =
      article.data.readingTime || calculateReadingTime(article.body || "");

    return {
      ...article,
      data: {
        ...article.data,
        createdAt,
        updatedAt,
        readingTime,
      },
    };
  });

const buildTaxonomySections = (
  articles: KnowledgeIndexArticle[]
): KnowledgeIndexSection[] => {
  const subsectionArticleCounts = countArticlesPerSubsection(articles);

  return musicTaxonomy.map((section) => ({
    ...section,
    subsectionCount: section.subsections.length,
    articleCount: section.subsections.reduce((acc, subsection) => {
      return acc + (subsectionArticleCounts[subsection.id] || 0);
    }, 0),
  }));
};

const buildKnowledgeSchemaArticles = (
  articles: KnowledgeIndexArticle[],
  baseUrl: string
): KnowledgeArticleLike[] =>
  articles.flatMap((article) => {
    const slug = article.id || "";
    const title = typeof article.data.title === "string" ? article.data.title.trim() : "";
    const description =
      typeof article.data.description === "string" ? article.data.description.trim() : "";

    if (!slug || !title || !description) {
      return [];
    }

    return [
      {
        slug,
        data: {
          title,
          description,
          createdAt: article.data.createdAt || undefined,
          updatedAt: article.data.updatedAt || undefined,
          keywords: article.data.keywords,
          image: getKnowledgeCategoryImageUrl(article.data.image, baseUrl),
        },
      },
    ];
  });

export const buildKnowledgeIndexPageData = async (
  site: URL | undefined
): Promise<BuildKnowledgeIndexPageDataResult> => {
  let baseArticles: KnowledgeIndexArticle[] = [];

  try {
    baseArticles = (await getCollectionCached("knowledge-en", {
      getCollection,
    })) as KnowledgeIndexArticle[];
  } catch (e) {
    loggers.pages.warn("knowledge index: collection load issue", {
      error: (e as any)?.message || e,
    });
  }

  const lang = "en";
  const baseUrl = resolveBaseUrl(site);
  const currentUrl = resolvePageUrl(site, "/");
  const normalizedArticles = normalizeKnowledgeArticles(baseArticles);
  const sortedArticles = sortEntries(normalizedArticles) as KnowledgeIndexArticle[];
  const taxonomySections = buildTaxonomySections(sortedArticles);

  let earliestCreated: Date | null = null;
  let latestUpdated: Date | null = null;

  for (const article of normalizedArticles) {
    const createdAt = normalizeDate(article.data.createdAt);
    const updatedAt = normalizeDate(article.data.updatedAt);

    if (
      createdAt &&
      (!earliestCreated || createdAt.getTime() < earliestCreated.getTime())
    ) {
      earliestCreated = createdAt;
    }

    if (updatedAt && (!latestUpdated || updatedAt.getTime() > latestUpdated.getTime())) {
      latestUpdated = updatedAt;
    }
  }

  const collectionDates = derivePublishModified(earliestCreated, latestUpdated);
  const articleCollectionId = `${currentUrl}#knowledge-itemlist`;
  const schemaArticles = buildKnowledgeSchemaArticles(sortedArticles, baseUrl);
  const articleCollectionSchema = buildKnowledgeArticlesItemList({
    articles: schemaArticles,
    baseUrl,
    lang,
    listName: "Knowledge Articles",
    itemListId: articleCollectionId,
  });
  const collectionPageSchema = buildCollectionPageSchema({
    url: currentUrl,
    name: KNOWLEDGE_INDEX_TITLE,
    description: KNOWLEDGE_INDEX_DESCRIPTION,
    lang,
    image: knowledgeHeroImageUrl(baseUrl),
    mainEntityId: articleCollectionId,
  });

  const keywordPool = sortedArticles.flatMap((article) => article.data.keywords || []);
  const fallbackKeywords = keywordPool
    .slice(0, 10)
    .map((keyword) => keyword.trim())
    .filter(Boolean);

  const pageSeo = buildPageSeo({
    title: KNOWLEDGE_INDEX_TITLE,
    description: KNOWLEDGE_INDEX_DESCRIPTION,
    url: currentUrl,
    contentKind: "generic",
    structuredData: [collectionPageSchema, articleCollectionSchema].filter(
      Boolean
    ) as StructuredData[],
    enrichedParts: [
      KNOWLEDGE_INDEX_TITLE,
      KNOWLEDGE_INDEX_DESCRIPTION,
      keywordPool.slice(0, 25).join(" "),
    ],
    fallbackKeywords,
    keywordLimit: 28,
    maxDescription: 150,
    image: knowledgeHeroImageUrl(baseUrl),
    imageAlt: "Melody Mind - Music Knowledge Platform",
    publishDate: collectionDates.publishDate || undefined,
    modifiedDate: collectionDates.modifiedDate || undefined,
    index: true,
    follow: true,
    autoSocialImage: false,
    authorName: "Melody Mind",
  });

  return {
    pageSeo,
    taxonomySections,
  };
};
