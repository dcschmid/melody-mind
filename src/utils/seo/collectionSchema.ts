/**
 * Generic Collection & ItemList Schema Builders
 * --------------------------------------------
 * Centralizes generation of JSON-LD for collection pages that list uniform items
 * (e.g. news articles, playlists, podcasts, categories). Avoids copy-paste of
 * near-identical object literals across Astro pages.
 */

export interface CollectionItemInput {
  position: number; // 1-based position
  url: string;
  name: string; // headline/title
  description?: string;
  image?: string;
  datePublished?: string;
  authorName?: string;
  publisherName?: string;
  type?: string; // default fallback type if not provided
  genre?: string;
  about?: string;
  extra?: Record<string, unknown>; // extensibility hook
}

export interface BuildCollectionSchemaOptions {
  pageName: string;
  description: string;
  url: string;
  inLanguage: string;
  siteName: string;
  siteUrl: string;
  collectionType?: string; // e.g. CollectionPage (default)
  itemTypeDefault?: string; // e.g. NewsArticle, MusicPlaylist
  items: CollectionItemInput[];
  limit?: number; // restrict number of items included in schema (performance)
}

/** Build base CollectionPage + nested ItemList with embedded item objects. */
export function buildCollectionWithItemListSchema(
  options: BuildCollectionSchemaOptions
): Record<string, unknown> {
  const {
    pageName,
    description,
    url,
    inLanguage,
    siteName,
    siteUrl,
    collectionType = "CollectionPage",
    itemTypeDefault = "CreativeWork",
    items,
    limit = 10,
  } = options;

  const sliced = items.slice(0, limit);
  return {
    "@context": "https://schema.org",
    "@type": collectionType,
    name: pageName,
    description,
    url,
    inLanguage,
    isPartOf: {
      "@type": "WebSite",
      name: siteName,
      url: siteUrl,
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: sliced.length,
      itemListElement: sliced.map((item) => ({
        "@type": "ListItem",
        position: item.position,
        item: {
          "@type": item.type || itemTypeDefault,
          headline: item.name,
          name: item.name,
          description: item.description,
          url: item.url,
          image: item.image,
          datePublished: item.datePublished,
          genre: item.genre,
          about: item.about,
          author: item.authorName ? { "@type": "Organization", name: item.authorName } : undefined,
          publisher: item.publisherName
            ? { "@type": "Organization", name: item.publisherName, url: siteUrl }
            : undefined,
          ...(item.extra || {}),
        },
      })),
    },
  };
}

export default buildCollectionWithItemListSchema;
