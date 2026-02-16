/**
 * Taxonomy Types - Hierarchical Music Category Structure
 *
 * Structure:
 * - TaxonomySection (## in MD, e.g. "I. Time, Change & Musical Evolution")
 *   - TaxonomySubsection (### in MD, e.g. "Music Through the Decades")
 *     - TaxonomyGroup (#### in MD, optional, e.g. "Genre Evolution Pathways")
 *
 * Topics/Articles come from knowledge-en/ folder and are linked via frontmatter:
 *   taxonomySubsection: "music-through-decades"
 *   taxonomyGroup: "genre-evolution-pathways" (optional)
 */

export interface TaxonomyGroup {
  /** Unique identifier, e.g. "genre-evolution-pathways" */
  id: string;
  /** Display title, e.g. "Genre Evolution Pathways" */
  title: string;
  /** Optional description */
  description?: string;
  /** Optional image path */
  image?: string;
}

export interface TaxonomySubsection {
  /** Unique identifier, e.g. "music-through-decades" */
  id: string;
  /** Display title, e.g. "Music Through the Decades" */
  title: string;
  /** Optional description */
  description?: string;
  /** Optional image path */
  image?: string;
  /** Optional groups (#### level) */
  groups?: TaxonomyGroup[];
}

export interface TaxonomySection {
  /** Unique identifier, e.g. "time-change-evolution" */
  id: string;
  /** Roman numeral, e.g. "I", "II", "III" */
  numeral: string;
  /** Display title, e.g. "Time, Change & Musical Evolution" */
  title: string;
  /** Full title with numeral, e.g. "XXI. Canon & Key Artists" */
  fullTitle?: string;
  /** Optional description for the section */
  description?: string;
  /** Image path for card displays */
  image?: string;
  /** Subsections within this section */
  subsections: TaxonomySubsection[];
}

/** Flat topic reference for article frontmatter */
export interface TaxonomyReference {
  /** Section ID, e.g. "time-change-evolution" */
  section?: string;
  /** Subsection ID, e.g. "music-through-decades" */
  subsection?: string;
  /** Optional group ID, e.g. "genre-evolution-pathways" */
  group?: string;
}

/** Article with taxonomy info for display */
export interface TaxonomyArticle {
  slug: string;
  title: string;
  description: string;
  image?: string;
  createdAt?: Date;
  readingTime?: number;
  taxonomySubsection?: string;
  taxonomyGroup?: string;
}
