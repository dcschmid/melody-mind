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

export interface SiteIdentitySchemaOptions {
  siteUrl: string;
  siteName: string;
  description?: string;
  logoUrl?: string;
  searchPathTemplate?: string;
}

export interface CollectionPageSchemaOptions {
  url: string;
  name: string;
  description?: string;
  lang?: string;
  image?: string;
  mainEntityId?: string;
}

/**
 * Build Organization schema for the site owner / publisher.
 */
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
 * Build WebSite schema with optional SearchAction for internal site search.
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

/**
 * Build CollectionPage schema for indexable hub pages.
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
 * Build ItemList schema for knowledge articles.
 */
export function buildKnowledgeArticlesItemList(opts: {
  articles: KnowledgeArticleLike[];
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
    return new Date(String(bDate)).getTime() - new Date(String(aDate)).getTime();
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
        dateCreated: article.data.createdAt
          ? new Date(String(article.data.createdAt)).toISOString()
          : undefined,
        dateModified: article.data.updatedAt
          ? new Date(String(article.data.updatedAt)).toISOString()
          : undefined,
        keywords: article.data.keywords?.join(", "),
        inLanguage: lang || "en",
      },
    })),
  };
}

/**
 * Build ItemList schema for music categories.
 */
