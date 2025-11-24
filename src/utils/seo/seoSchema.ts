/**
 * Central Schema.org JSON-LD Builders
 * Consolidates structured data generation for reuse across pages.
 * Podcast-related functions moved to separate subdomain.
 */

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

/**
 * Build ItemList schema for knowledge articles.
 */
export function buildKnowledgeArticlesItemList(opts: {
  articles: KnowledgeArticleLike[];
  baseUrl: string;
  lang: string;
  listName?: string;
}): Record<string, unknown> | undefined {
  const { articles, baseUrl, lang, listName = "Knowledge Articles" } = opts;
  if (!articles.length) {
    return undefined;
  }
  const sorted = [...articles].sort((a, b) => {
    const aDate = a.data.updatedAt || a.data.createdAt;
    const bDate = b.data.updatedAt || b.data.createdAt;
    return (
      new Date(String(bDate)).getTime() - new Date(String(aDate)).getTime()
    );
  });

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName,
    numberOfItems: sorted.length,
    itemListElement: sorted.map((article, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Article",
        name: article.data.title,
        description: article.data.description,
        url: `${baseUrl}/${lang}/knowledge/${article.slug}`,
        dateCreated: article.data.createdAt
          ? new Date(String(article.data.createdAt)).toISOString()
          : undefined,
        dateModified: article.data.updatedAt
          ? new Date(String(article.data.updatedAt)).toISOString()
          : undefined,
        keywords: article.data.keywords?.join(", "),
      },
    })),
  };
}

/**
 * Build ItemList schema for music categories.
 */
export function buildCategoryItemListSchema(opts: {
  categories: Array<{ id: string; name: string; description?: string }>;
  baseUrl: string;
  lang: string;
  listName?: string;
}): Record<string, unknown> | undefined {
  const { categories, baseUrl, lang, listName = "Music Categories" } = opts;
  if (!categories.length) {
    return undefined;
  }

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName,
    numberOfItems: categories.length,
    itemListElement: categories.map((category, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Thing",
        "@id": `${baseUrl}/${lang}/game-${category.id}`,
        name: category.name,
        description: category.description,
        url: `${baseUrl}/${lang}/game-${category.id}`,
      },
    })),
  };
}
