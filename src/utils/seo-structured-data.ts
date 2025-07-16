/**
 * SEO structured data generation utilities
 * Provides reusable functions for generating JSON-LD schemas
 */

export interface StructuredDataConfig {
  baseUrl: string;
  currentUrl: string;
  lang: string;
  title: string;
  description: string;
}

export interface CategoryData {
  headline: string;
  introSubline: string;
  categoryUrl?: string;
}

/**
 * Generates WebApplication schema for game pages
 */
export function generateGameApplicationSchema(config: StructuredDataConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `MelodyMind - ${config.title}`,
    description: config.description,
    url: config.currentUrl,
    applicationCategory: "GameApplication",
    applicationSubCategory: "MusicTrivia",
    operatingSystem: "Web Browser",
    genre: "Music Trivia",
    inLanguage: config.lang,
    creator: {
      "@type": "Organization",
      name: "MelodyMind Team",
    },
    datePublished: "2024-01-01",
    dateModified: new Date().toISOString(),
    isAccessibleForFree: true,
  };
}

/**
 * Generates ItemList schema for category lists
 */
export function generateCategoryListSchema(
  config: StructuredDataConfig,
  categories: CategoryData[]
) {
  const validCategories = categories.filter((cat) => cat.categoryUrl);

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Music Game Categories",
    description: "Available music trivia categories in MelodyMind",
    numberOfItems: validCategories.length,
    itemListElement: validCategories.slice(0, 10).map((category, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Game",
        name: category.headline,
        description: category.introSubline,
        url: `${config.baseUrl}/${config.lang}${category.categoryUrl}`,
        genre: "Music Trivia",
        applicationCategory: "Game",
      },
    })),
  };
}

/**
 * Generates enhanced meta tags for better SEO
 */
export function generateEnhancedMetaTags(config: StructuredDataConfig) {
  return {
    robots: "index, follow, max-image-preview:large",
    googlebot: "index, follow",
    canonical: config.currentUrl,
    ogType: "website",
    ogLocale: `${config.lang}_${config.lang.toUpperCase()}`,
    articleSection: "Gaming",
    articleTags: ["Music Trivia", "Online Game", "Music Knowledge", "Interactive Quiz"],
  };
}

/**
 * Generates client-side translation object for consistent structure
 */
export function generateClientTranslations(translationFunction: (key: string) => string) {
  return {
    search: {
      placeholder: translationFunction("game.search.label") || "Search genres...",
      showingAll: translationFunction("game.search.showing.all") || "Showing all genres",
      resultsFound: translationFunction("game.search.results") || "genres found",
      noResults:
        translationFunction("game.search.no.results") || "No genres found matching your search",
      clear: translationFunction("game.search.clear") || "Clear search",
    },
    accessibility: {
      skipToContent: translationFunction("accessibility.skip.to.content") || "Skip to main content",
      searchLabel: translationFunction("game.search.label") || "Search music genres",
    },
  };
}
