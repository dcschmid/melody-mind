import type { CollectionEntry } from "astro:content";
import type { TaxonomySection, TaxonomySubsection } from "../../types/taxonomy";
import { sortEntries } from "@shared-utils/utils/content/sortEntries";
import { normalizeDate } from "@shared-utils/utils/content/dateUtils";
import { calculateReadingTime } from "@shared-utils/utils/readingTime";

type KnowledgeEntry = CollectionEntry<"knowledge-en">;

interface TaxonomyArticleData {
  title: string;
  description: string;
  keywords: string[];
  image?: string;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  readingTime?: number;
  taxonomySubsection?: string;
  taxonomyGroup?: string;
}

export interface TaxonomyArticle extends Omit<KnowledgeEntry, "data"> {
  data: TaxonomyArticleData;
}

export interface TaxonomyGroupWithArticles {
  id: string;
  title: string;
  description?: string;
  image?: string;
  anchorId: string;
  articleCount: number;
  articles: TaxonomyArticle[];
}

export interface TaxonomySubsectionWithArticles extends TaxonomySubsection {
  articleCount: number;
  articles: TaxonomyArticle[];
  groupsWithArticles: TaxonomyGroupWithArticles[];
}

export interface TaxonomyJumpTarget {
  anchorId: string;
  title: string;
  articleCount: number;
}

interface BuildTaxonomySectionPageDataParams {
  baseArticles: KnowledgeEntry[];
  section: TaxonomySection;
}

export function buildTaxonomySectionPageData({
  baseArticles,
  section,
}: BuildTaxonomySectionPageDataParams): {
  sectionArticles: TaxonomyArticle[];
  subsectionsData: TaxonomySubsectionWithArticles[];
  jumpTargets: TaxonomyJumpTarget[];
} {
  const articlesWithReadingTime = baseArticles.map((article) => {
    const articleData = article.data as Partial<TaxonomyArticleData>;
    const createdAt = normalizeDate(articleData.createdAt);
    const updatedAt = normalizeDate(articleData.updatedAt);
    const readingTime =
      articleData.readingTime ?? calculateReadingTime(article.body || "");

    const enrichedArticle: TaxonomyArticle = {
      ...article,
      data: {
        title: articleData.title || "",
        description: articleData.description || "",
        keywords: articleData.keywords || [],
        image: articleData.image,
        createdAt,
        updatedAt,
        readingTime,
        taxonomySubsection: articleData.taxonomySubsection,
        taxonomyGroup: articleData.taxonomyGroup,
      },
    };

    return enrichedArticle;
  });

  const subsectionIds = section.subsections.map((subsection) => subsection.id);
  const sectionArticles = sortEntries(
    articlesWithReadingTime.filter((article) =>
      subsectionIds.includes(article.data.taxonomySubsection || "")
    )
  ) as TaxonomyArticle[];

  const subsectionsData = section.subsections.map((subsection: TaxonomySubsection) => {
    const articles = sortEntries(
      articlesWithReadingTime.filter(
        (article) => article.data.taxonomySubsection === subsection.id
      )
    ) as TaxonomyArticle[];

    const groupsWithArticles = (subsection.groups || []).map((group) => {
      const groupArticles = sortEntries(
        articlesWithReadingTime.filter(
          (article) =>
            article.data.taxonomySubsection === subsection.id &&
            article.data.taxonomyGroup === group.id
        )
      ) as TaxonomyArticle[];

      return {
        ...group,
        anchorId: `${subsection.id}--${group.id}`,
        articleCount: groupArticles.length,
        articles: groupArticles,
      };
    });

    return {
      ...subsection,
      articleCount: articles.length,
      articles,
      groupsWithArticles,
    };
  });

  const jumpTargets: TaxonomyJumpTarget[] = subsectionsData.flatMap((subsection) => {
    const groupsWithContent = subsection.groupsWithArticles.filter(
      (group) => group.articleCount > 0
    );

    if (groupsWithContent.length > 0) {
      return groupsWithContent.map((group) => ({
        anchorId: group.anchorId,
        title: group.title,
        articleCount: group.articleCount,
      }));
    }

    if (subsection.articleCount > 0) {
      return [
        {
          anchorId: subsection.id,
          title: subsection.title,
          articleCount: subsection.articleCount,
        },
      ];
    }

    return [];
  });

  return {
    sectionArticles,
    subsectionsData,
    jumpTargets,
  };
}
