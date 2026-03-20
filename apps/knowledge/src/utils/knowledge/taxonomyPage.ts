/**
 * Search-focused metadata overrides for taxonomy landing pages.
 * These stay centralized so routing pages do not each maintain their own SEO maps.
 */
export const TAXONOMY_SECTION_SEO_DESCRIPTION_OVERRIDES: Record<string, string> = {
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

export const TAXONOMY_SECTION_SEO_TITLE_OVERRIDES: Record<string, string> = {
  "emotional-seasonal-situational": "Emotional, Seasonal & Situational Music",
};

/**
 * Returns the best available SEO title for a taxonomy section page.
 */
export function getTaxonomySectionSeoTitle(
  sectionId: string,
  sectionTitle: string
): string {
  return TAXONOMY_SECTION_SEO_TITLE_OVERRIDES[sectionId] || `${sectionTitle} Topics`;
}

/**
 * Returns the best available SEO description for a taxonomy section page.
 */
export function getTaxonomySectionSeoDescription(params: {
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
