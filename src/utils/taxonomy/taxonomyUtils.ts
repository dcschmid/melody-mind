/**
 * Taxonomy Utilities - Helper functions for music taxonomy
 */
import type {
  TaxonomySection,
  TaxonomySubsection,
  TaxonomyGroup,
} from "../../types/taxonomy";
import { musicTaxonomy } from "../../data/musicTaxonomy";

/**
 * Get all taxonomy sections
 */
export function getAllSections(): TaxonomySection[] {
  return musicTaxonomy;
}

/**
 * Get a section by ID
 */
export function getSectionById(sectionId: string): TaxonomySection | undefined {
  return musicTaxonomy.find((s) => s.id === sectionId);
}

/**
 * Get a subsection by ID (searches all sections)
 */
export function getSubsectionById(
  subsectionId: string
): { subsection: TaxonomySubsection; section: TaxonomySection } | undefined {
  for (const section of musicTaxonomy) {
    const subsection = section.subsections.find((s) => s.id === subsectionId);
    if (subsection) {
      return { subsection, section };
    }
  }
  return undefined;
}

/**
 * Get a group by ID (searches all subsections)
 */
export function getGroupById(
  groupId: string
):
  | { group: TaxonomyGroup; subsection: TaxonomySubsection; section: TaxonomySection }
  | undefined {
  for (const section of musicTaxonomy) {
    for (const subsection of section.subsections) {
      const group = subsection.groups?.find((g) => g.id === groupId);
      if (group) {
        return { group, subsection, section };
      }
    }
  }
  return undefined;
}

/**
 * Count total subsections across all sections
 */
export function countSubsections(): number {
  return musicTaxonomy.reduce((acc, section) => acc + section.subsections.length, 0);
}

/**
 * Count total groups across all subsections
 */
export function countGroups(): number {
  return musicTaxonomy.reduce((acc, section) => {
    return (
      acc +
      section.subsections.reduce((subAcc, subsection) => {
        return subAcc + (subsection.groups?.length || 0);
      }, 0)
    );
  }, 0);
}

/**
 * Get flat list of all subsection IDs
 */
export function getAllSubsectionIds(): string[] {
  return musicTaxonomy.flatMap((section) => section.subsections.map((s) => s.id));
}

/**
 * Get flat list of all group IDs
 */
export function getAllGroupIds(): string[] {
  return musicTaxonomy.flatMap((section) =>
    section.subsections.flatMap((subsection) => subsection.groups?.map((g) => g.id) || [])
  );
}

/**
 * Filter articles by taxonomy subsection
 */
export function filterArticlesBySubsection(articles: any[], subsectionId: string): any[] {
  return articles.filter((article) => article.data?.taxonomySubsection === subsectionId);
}

/**
 * Filter articles by taxonomy group
 */
export function filterArticlesByGroup(articles: any[], groupId: string): any[] {
  return articles.filter((article) => article.data?.taxonomyGroup === groupId);
}

/**
 * Filter articles by taxonomy section (any subsection in that section)
 */
export function filterArticlesBySection(articles: any[], sectionId: string): any[] {
  const section = getSectionById(sectionId);
  if (!section) return [];

  const subsectionIds = section.subsections.map((s) => s.id);
  return articles.filter((article) =>
    subsectionIds.includes(article.data?.taxonomySubsection)
  );
}

/**
 * Count articles per subsection
 */
export function countArticlesPerSubsection(articles: any[]): Record<string, number> {
  const counts: Record<string, number> = {};

  for (const article of articles) {
    const subsectionId = article.data?.taxonomySubsection;
    if (subsectionId) {
      counts[subsectionId] = (counts[subsectionId] || 0) + 1;
    }
  }

  return counts;
}

/**
 * Get section with article counts
 */
export function getSectionsWithArticleCounts(
  articles: any[]
): (TaxonomySection & { articleCount: number })[] {
  const subsectionCounts = countArticlesPerSubsection(articles);

  return musicTaxonomy.map((section) => {
    const articleCount = section.subsections.reduce((acc, subsection) => {
      return acc + (subsectionCounts[subsection.id] || 0);
    }, 0);

    return { ...section, articleCount };
  });
}

/**
 * Generate URL paths for static generation
 */
export function getSectionPaths(): string[] {
  return musicTaxonomy.map((section) => section.id);
}

/**
 * Generate URL paths for subsections
 */
export function getSubsectionPaths(): { section: string; subsection: string }[] {
  return musicTaxonomy.flatMap((section) =>
    section.subsections.map((subsection) => ({
      section: section.id,
      subsection: subsection.id,
    }))
  );
}
