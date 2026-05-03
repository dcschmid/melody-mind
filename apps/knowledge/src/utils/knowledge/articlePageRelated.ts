import { getCollection } from "astro:content";
import {
  buildRelatedArticleCardItem,
  type RelatedContentCardItem,
} from "@shared-ui/components/cards/relatedContent";
import { getCollectionCached } from "@shared-utils/utils/content/getCollectionCached";
import { normalizeDate } from "@shared-utils/utils/content/dateUtils";
import { loggers } from "@shared-utils/utils/logging";
import { getReadingTime } from "@shared-utils/utils/readingTime";
import { getKnowledgeCategoryImage } from "@utils/knowledgeImages";
import type { KnowledgeArticleLike, RelatedKnowledgeArticle } from "./articlePageTypes";
import { toKeywordSet } from "./keywords";

/**
 * Scores and returns the strongest related articles for a knowledge detail page.
 */
function getRelatedKnowledgeArticles(params: {
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
      const articleSlug = String(article?.id || "");
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
        id: String(article?.id || ""),
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
      return a.id.localeCompare(b.id);
    })
    .slice(0, limit)
    .map(({ updatedAt: _updatedAt, score: _score, ...article }) => article);
}

export async function loadRelatedKnowledgeArticleCardItems(params: {
  currentKeywords: string[];
  currentTaxonomyGroup: string;
  currentTaxonomySubsection: string;
  currentSlug: string;
  lang: string;
}): Promise<RelatedContentCardItem[]> {
  const {
    currentKeywords,
    currentTaxonomyGroup,
    currentTaxonomySubsection,
    currentSlug,
    lang,
  } = params;

  try {
    const allArticles: any[] = await getCollectionCached("knowledge-en", {
      getCollection,
    }).catch((e) => {
      loggers.pages.warn("knowledge article: related articles load issue", {
        error: (e as Error)?.message || e,
      });
      return [];
    });
    const articles = getRelatedKnowledgeArticles({
      articles: allArticles,
      currentKeywords: new Set(currentKeywords),
      currentTaxonomyGroup,
      currentTaxonomySubsection,
      currentSlug,
      lang,
    });

    return articles.map((article, index) =>
      buildRelatedArticleCardItem({
        id: `related-knowledge-${article.id}-${index}`,
        title: article.title,
        description: article.description,
        href: `/knowledge/${article.id}`,
        imageSrc: article.image,
        ctaSrText: "Opens article",
        publishedAt: article.createdAt,
        readingTimeMinutes: article.readingTime,
        locale: lang || "en",
      })
    );
  } catch (e) {
    loggers.pages.warn("knowledge article: related articles load issue", {
      error: (e as any)?.message || e,
    });
    return [];
  }
}
