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
 * Count articles per subsection
 */
export function countArticlesPerSubsection(
  articles: Array<{ data?: { taxonomySubsection?: string } }>
): Record<string, number> {
  const counts: Record<string, number> = {};

  for (const article of articles) {
    const subsectionId = article.data?.taxonomySubsection;
    if (subsectionId) {
      counts[subsectionId] = (counts[subsectionId] || 0) + 1;
    }
  }

  return counts;
}
