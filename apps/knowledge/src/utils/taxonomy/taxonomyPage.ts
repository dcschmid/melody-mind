/**
 * Search-focused metadata overrides for taxonomy landing pages.
 * These stay centralized so routing pages do not each maintain their own SEO maps.
 */
export { buildTaxonomySectionPageData } from "./buildTaxonomySectionPageData";

import { buildPageSeo, type StructuredData } from "@shared-utils/utils/seo/buildPageSeo";
import {
  buildBreadcrumbListSchema,
  buildCollectionPageSchema,
  buildKnowledgeArticlesItemList,
} from "@shared-utils/utils/seo/seoSchema";
import {
  derivePublishModified,
  normalizeDate,
} from "@shared-utils/utils/content/dateUtils";
import { resolveBaseUrl, resolvePageUrl } from "@shared-utils/utils/siteUrls";
import type { TaxonomySection } from "../../types/taxonomy";
import type { TaxonomyArticle } from "./buildTaxonomySectionPageData";
import {
  getKnowledgeCategoryImageUrl,
  getKnowledgeTaxonomyImageUrl,
} from "@utils/knowledgeImages";

const TAXONOMY_SECTION_SEO_DESCRIPTION_OVERRIDES: Record<string, string> = {
  "canon-key-artists":
    "Discover the artists who shaped music history across genres, eras, and major cultural movements.",
  "countries-regional-traditions":
    "Explore traditional and contemporary music shaped by regional identity, local history, and cultural exchange around the world.",
  "electronic-club-nightlife":
    "Trace electronic music from house and techno to global club culture through the DJs, scenes, and communities that shaped it.",
  "folk-regional-expressions":
    "Explore folk and regional music through storytelling, place, tradition, and evolving cultural identity across communities.",
  "hiphop-rap-culture":
    "Trace hip hop from Bronx origins to global influence through lyrical storytelling, scenes, production, and cultural change.",
  "latin-caribbean-afro-roots":
    "Discover Latin, Caribbean, and Afro-rooted music through rhythm, migration, heritage, and cross-cultural exchange.",
  "live-performance-stagecraft":
    "Explore live performance through stage presence, touring, sound, lighting, and the craft of connecting with audiences.",
  "mainstream-pop-global-hits":
    "Explore chart pop, breakout stars, and global hits through the artists, sounds, and moments that shaped mass audiences.",
  "music-media-technology-industry":
    "Explore the business, media, and technology systems that shape music, from streaming and radio to platforms and AI.",
  "music-theory-composition":
    "Discover harmony, melody, rhythm, form, and composition ideas that shape musical meaning across traditions.",
  "music-therapy-wellness-healing":
    "Explore how music supports wellbeing, recovery, and mental health through therapy, self-care, and research.",
};

const TAXONOMY_SECTION_SEO_TITLE_OVERRIDES: Record<string, string> = {
  "emotional-seasonal-situational": "Emotional, Seasonal & Situational Music",
};

/**
 * Returns the best available SEO title for a taxonomy section page.
 */
function getTaxonomySectionSeoTitle(
  sectionId: string,
  sectionTitle: string
): string {
  return TAXONOMY_SECTION_SEO_TITLE_OVERRIDES[sectionId] || `${sectionTitle} Topics`;
}

/**
 * Returns the best available SEO description for a taxonomy section page.
 */
function getTaxonomySectionSeoDescription(params: {
  sectionId: string;
  sectionTitle: string;
  sectionDescription?: string;
}): string {
  const { sectionId, sectionTitle, sectionDescription } = params;

  return (
    TAXONOMY_SECTION_SEO_DESCRIPTION_OVERRIDES[sectionId] ||
    sectionDescription ||
    `Explore ${sectionTitle} - music knowledge and guides.`
  );
}

interface BuildTaxonomySectionSeoParams {
  site: URL | undefined;
  sectionId: string;
  section: TaxonomySection;
  sectionArticles: TaxonomyArticle[];
}

export function buildTaxonomySectionSeo({
  site,
  sectionId,
  section,
  sectionArticles,
}: BuildTaxonomySectionSeoParams) {
  const currentUrl = resolvePageUrl(site, `/taxonomy/${sectionId}`);
  const baseUrl = resolveBaseUrl(site);
  const sectionImageUrl = getKnowledgeTaxonomyImageUrl(section.image, baseUrl);
  const seoDescription = getTaxonomySectionSeoDescription({
    sectionId,
    sectionTitle: section.title,
    sectionDescription: section.description,
  });
  const breadcrumbs = [
    { name: "Home", url: resolvePageUrl(site, "/") },
    { name: section.title, url: currentUrl },
  ];
  const articleItemListId = `${currentUrl}#article-itemlist`;

  let earliestCreated: Date | null = null;
  let latestUpdated: Date | null = null;

  for (const article of sectionArticles) {
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

  const sectionDates = derivePublishModified(earliestCreated, latestUpdated);
  const breadcrumbSchema = buildBreadcrumbListSchema(breadcrumbs);
  const itemListSchema = buildKnowledgeArticlesItemList({
    articles: sectionArticles.map((article) => ({
      slug: article.id,
      data: {
        title: article.data.title,
        description: article.data.description,
        createdAt: article.data.createdAt || undefined,
        updatedAt: article.data.updatedAt || undefined,
        keywords: article.data.keywords,
        image: getKnowledgeCategoryImageUrl(article.data.image, baseUrl),
      },
    })),
    baseUrl,
    lang: "en",
    listName: `${section.title} articles`,
    itemListId: articleItemListId,
  });
  const collectionPageSchema = buildCollectionPageSchema({
    url: currentUrl,
    name: section.title,
    description: seoDescription,
    lang: "en",
    image: sectionImageUrl,
    mainEntityId: articleItemListId,
  });

  return buildPageSeo({
    title: getTaxonomySectionSeoTitle(sectionId, section.title),
    description: seoDescription,
    url: currentUrl,
    contentKind: "generic",
    breadcrumbs,
    structuredData: [collectionPageSchema, breadcrumbSchema, itemListSchema].filter(
      Boolean
    ) as StructuredData[],
    enrichedParts: [section.title, section.description || ""],
    fallbackKeywords: [],
    keywordLimit: 28,
    maxDescription: 160,
    image: sectionImageUrl,
    imageAlt: `${section.title} - Melody Mind`,
    publishDate: sectionDates.publishDate || undefined,
    modifiedDate: sectionDates.modifiedDate || undefined,
    index: true,
    follow: true,
    autoSocialImage: false,
    authorName: "Melody Mind",
  });
}
