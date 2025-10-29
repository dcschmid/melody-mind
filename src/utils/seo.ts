/**
 * SEO Helper Functions for Melody Mind
 *
 * A collection of utility functions to optimize content for search engines
 * and improve discoverability of the Melody Mind application.
 */

/**
 * Creates an SEO-friendly URL slug from a string
 *
 * - Converting to lowercase
 * - Removing special characters
 * - Converting spaces to hyphens
 * - Removing redundant hyphens
 *
 * @param text The text to be converted into a slug
 * @returns An SEO-friendly URL slug
 * @example
 * // returns "what-is-melody-mind"
 * createSlug("What is Melody Mind?");
 */
/**
 * Create a URL-friendly slug from given text.
 *
 * @param {string} text - The text to be converted into a slug
 * @returns {string} SEO-friendly URL slug
 */
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove all characters except words, spaces and hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple consecutive hyphens with a single one
    .trim() // Remove whitespace from both ends
    .replace(/^-+|-+$/g, ""); // Remove hyphens from the beginning and end
}

/**
 * Calculates the estimated reading time of a text
 *
 * Uses an average reading speed to determine how long it would take to read
 * the provided content. Useful for providing reading time estimates in
 * articles or blog posts.
 *
 * @param content The text content to calculate reading time for
 * @param wordsPerMinute Average reading speed in words per minute, default: 225
 * @returns The estimated reading time in minutes (rounded up)
 * @example
 * // returns 2 minutes for a 400-word article
 * calculateReadingTime("400 words of content...");
 */
/**
 * Calculate approximate reading time in minutes for provided content.
 * (Types documented via TypeScript signature.)
 */
export function calculateReadingTime(content: string, wordsPerMinute = 225): number {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes;
}

/**
 * Extracts keywords from text content for SEO meta tags
 *
 * - Removing common stop words
 * - Calculating word frequency
 * - Selecting the most common words as keywords
 *
 * This helps in generating relevant meta keywords for SEO optimization.
 *
 * @param content The text content to extract keywords from
 * @param maxKeywords Maximum number of keywords to return, default: 10
 * @returns A comma-separated list of keywords
 * @example
 * // might return "music, quiz, melody, game"
 * extractKeywords("Melody Mind is a music quiz game with multiple categories...");
 */
/**
 * Language-specific stop words for keyword extraction
 * These common words are filtered out when extracting keywords
 */
const stopWordsByLanguage: Record<string, string[]> = {
  en: [
    "and",
    "or",
    "but",
    "the",
    "a",
    "an",
    "in",
    "with",
    "for",
    "of",
    "to",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "being",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "will",
    "would",
    "shall",
    "should",
    "can",
    "could",
    "may",
    "might",
    "must",
    "that",
    "this",
    "these",
    "those",
    "they",
    "them",
    "their",
    "there",
    "here",
    "where",
    "when",
    "why",
    "how",
    "which",
    "who",
    "whom",
  ],
  de: [
    "und",
    "oder",
    "aber",
    "der",
    "die",
    "das",
    "ein",
    "eine",
    "in",
    "mit",
    "für",
    "von",
    "zu",
    "ist",
    "sind",
    "war",
    "waren",
    "sein",
    "gewesen",
    "haben",
    "hat",
    "hatte",
    "hatten",
    "werden",
    "wird",
    "wurde",
    "wurden",
    "kann",
    "können",
    "könnte",
    "könnten",
    "muss",
    "müssen",
    "dass",
    "dieser",
    "diese",
    "dieses",
    "diese",
    "jener",
    "jene",
    "jenes",
    "sie",
    "ihr",
    "ihre",
    "dort",
    "hier",
    "wo",
    "wann",
    "warum",
    "wie",
    "welche",
    "welcher",
    "welches",
    "wer",
    "wen",
    "wem",
  ],
  es: [
    "y",
    "o",
    "pero",
    "el",
    "la",
    "los",
    "las",
    "un",
    "una",
    "unos",
    "unas",
    "en",
    "con",
    "para",
    "de",
    "a",
    "es",
    "son",
    "era",
    "eran",
    "ser",
    "sido",
    "estar",
    "tener",
    "tiene",
    "tenía",
    "tenían",
    "hacer",
    "hace",
    "hizo",
    "hicieron",
    "este",
    "esta",
    "estos",
    "estas",
    "ese",
    "esa",
    "esos",
    "esas",
    "ellos",
    "ellas",
    "su",
    "sus",
    "allí",
    "aquí",
    "donde",
    "cuando",
    "por qué",
    "cómo",
    "cuál",
    "cuáles",
    "quién",
    "quiénes",
  ],
  fr: [
    "et",
    "ou",
    "mais",
    "le",
    "la",
    "les",
    "un",
    "une",
    "des",
    "en",
    "avec",
    "pour",
    "de",
    "à",
    "est",
    "sont",
    "était",
    "étaient",
    "être",
    "été",
    "avoir",
    "a",
    "avait",
    "avaient",
    "faire",
    "fait",
    "ce",
    "cette",
    "ces",
    "celui",
    "celle",
    "ceux",
    "celles",
    "ils",
    "elles",
    "leur",
    "leurs",
    "là",
    "ici",
    "où",
    "quand",
    "pourquoi",
    "comment",
    "quel",
    "quelle",
    "quels",
    "quelles",
    "qui",
  ],
};

/**
 * Extract keywords (words + n-grams) from content for SEO meta tag usage.
 * Uses simple frequency & phrase weighting. (Types via signature.)
 * Example: extractKeywords("Melody Mind is a music quiz...", 5, "en")
 */
export function extractKeywords(content: string, maxKeywords = 10, language = "en"): string {
  // Get language-specific stop words or fall back to English
  const stopWords = stopWordsByLanguage[language] || stopWordsByLanguage.en;

  // Clean the content
  const cleanedContent = content
    .toLowerCase()
    .replace(/[^\w\s-]/g, " ") // Replace non-word chars with spaces, keep hyphens
    .replace(/\s+/g, " ") // Replace multiple spaces with single space
    .trim();

  // Extract single words (unigrams)
  const words = cleanedContent
    .split(/\s+/)
    .filter((word) => word.length > 3 && !stopWords.includes(word));

  // Extract bigrams (two-word phrases)
  const bigrams: string[] = [];
  for (let i = 0; i < words.length - 1; i++) {
    if (words[i].length > 2 && words[i + 1].length > 2) {
      bigrams.push(`${words[i]} ${words[i + 1]}`);
    }
  }

  // Extract trigrams (three-word phrases)
  const trigrams: string[] = [];
  for (let i = 0; i < words.length - 2; i++) {
    if (words[i].length > 2 && words[i + 1].length > 2 && words[i + 2].length > 2) {
      trigrams.push(`${words[i]} ${words[i + 1]} ${words[i + 2]}`);
    }
  }

  // Combine all terms (unigrams, bigrams, trigrams)
  const allTerms = [...words, ...bigrams, ...trigrams];

  // Count frequency of each term
  const termFrequency: Record<string, number> = {};
  allTerms.forEach((term) => {
    termFrequency[term] = (termFrequency[term] || 0) + 1;
  });

  // Apply weighting: favor phrases (n-grams) over single words
  const weightedTerms = Object.keys(termFrequency).map((term) => {
    const wordCount = term.split(" ").length;
    const frequencyWeight = termFrequency[term];
    const lengthWeight = wordCount > 1 ? 1.5 * wordCount : 1; // Boost multi-word terms

    return {
      term,
      score: frequencyWeight * lengthWeight,
    };
  });

  // Sort terms by weighted score
  const sortedTerms = weightedTerms
    .sort((a, b) => b.score - a.score)
    .map((item) => item.term)
    .slice(0, maxKeywords);

  return sortedTerms.join(", ");
}

/**
 * Generates an optimized meta description from content
 *
 * - Removing HTML tags
 * - Trimming to the specified maximum length
 * - Ensuring the description ends with a complete sentence when possible
 *
 * This helps improve search engine results and click-through rates.
 *
 * @param {string} content - The full content to extract a description from
 * @param {number} [maxLength=160] - Maximum length of the description, default: 160 characters
 * @returns {string} An optimized meta description
 * @example
 * // returns "Learn about music history through interactive quizzes..."
 * generateMetaDescription("<p>Learn about music history through interactive quizzes. Test your knowledge and earn points.</p>");
 */
/**
 * Generate an optimized meta description selecting informative early sentences.
 * Strips HTML and trims to maxLength. (Types via signature.)
 */
export function generateMetaDescription(content: string, maxLength = 160): string {
  // Remove HTML tags and excess whitespace
  const text = content
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Return the text if it's already shorter than the maximum length
  if (text.length <= maxLength) {
    return text;
  }

  // Split into sentences
  const sentenceRegex = /([.!?])\s+/g;
  const sentences = text.split(sentenceRegex).reduce((result: string[], item, index, array) => {
    if (index % 2 === 0) {
      // Even indices contain the text before the delimiter
      const nextIndex = index + 1;
      if (nextIndex < array.length) {
        // Add the delimiter back to the sentence
        result.push(item + array[nextIndex]);
      } else {
        // Last item might not have a delimiter
        result.push(item);
      }
    }
    return result;
  }, []);

  // Score sentences based on position and keyword density
  const scoredSentences = sentences.map((sentence, index) => {
    // Position score - earlier sentences are more important (especially the first)
    const positionScore = index === 0 ? 3 : 1 / (index + 1);

    // Length score - prefer sentences of moderate length (not too short, not too long)
    const words = sentence.split(/\s+/).length;
    const lengthScore = words > 5 && words < 20 ? 2 : 1;

    // Keyword score - sentences with important terms get higher scores
    const importantTerms = [
      "music",
      "melody",
      "song",
      "artist",
      "band",
      "genre",
      "playlist",
      "album",
    ];
    const keywordScore = importantTerms.some((term) => sentence.toLowerCase().includes(term))
      ? 2
      : 1;

    // Calculate total score
    const totalScore = positionScore * lengthScore * keywordScore;

    return { sentence, score: totalScore };
  });

  // Sort sentences by score (highest first)
  scoredSentences.sort((a, b) => b.score - a.score);

  // Build description from highest-scoring sentences until we approach max length
  let description = "";
  let currentLength = 0;

  for (const { sentence } of scoredSentences) {
    if (currentLength + sentence.length <= maxLength) {
      description += `${sentence} `;
      currentLength += sentence.length + 1;
    } else {
      break;
    }
  }

  // Trim and ensure we don't end with a space
  description = description.trim();

  // If we're still over the max length, truncate properly
  if (description.length > maxLength) {
    const truncated = description.substring(0, maxLength);
    const lastPeriod = truncated.lastIndexOf(".");

    if (lastPeriod > maxLength * 0.7) {
      // Only use period truncation if it doesn't cut off too much
      return truncated.substring(0, lastPeriod + 1);
    }

    // Otherwise truncate at the last word
    const lastSpace = truncated.lastIndexOf(" ");
    return lastSpace > 0 ? `${truncated.substring(0, lastSpace)}...` : `${truncated}...`;
  }

  return description;
}

/**
 * Ensure a clean canonical URL by joining a site base (Astro.site) and a pathname.
 * - Removes duplicate slashes
 * - Strips query/hash fragments
 * - Forces trailing slash removal (except root)
 *
 * @param {string} siteBase Base site URL (e.g. "https://example.com")
 * @param {string} path URL path (e.g. "/en/podcasts/episode-1")
 * @returns {string} Normalized canonical URL
 * @example buildCanonicalUrl('https://example.com/', '/en/') => 'https://example.com/en'
 */
export function buildCanonicalUrl(siteBase: string, path: string): string {
  if (!siteBase) {
    return path; // fallback if misconfigured
  }
  const base = siteBase.replace(/\/$/, "");
  const cleanPath = path.replace(/https?:\/\/[^/]+/i, ""); // if accidentally passed absolute
  const joined = `${base}${cleanPath.startsWith("/") ? "" : "/"}${cleanPath}`;
  try {
    const url = new URL(joined);
    url.hash = "";
    url.search = "";
    // drop trailing slash (except root)
    if (url.pathname !== "/" && url.pathname.endsWith("/")) {
      url.pathname = url.pathname.replace(/\/$/, "");
    }
    return url.toString();
  } catch {
    return joined; // fallback without normalization
  }
}

/**
 * Build an absolute OpenGraph image URL.
 * Accepts relative or absolute image paths; if already absolute returns unchanged.
 * @param {string} siteBase Base site origin
 * @param {string} imagePath Relative or absolute image path
 * @returns {string} Absolute image URL suitable for OG tags
 */
export function buildOpenGraphImageUrl(siteBase: string, imagePath: string): string {
  if (!imagePath) {
    return imagePath;
  }
  if (/^https?:\/\//i.test(imagePath)) {
    return imagePath;
  }
  const base = siteBase?.replace(/\/$/, "") || "";
  return `${base}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
}

/**
 * Simple breadcrumb item descriptor
 */
export interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Convenience helper to construct a breadcrumb array.
 * Filters out invalid entries and ensures unique consecutive names.
 * Does not inject structured data directly; that is handled by the SEO component.
 *
 * @param {BreadcrumbItem[]} items Raw breadcrumb items
 * @returns {BreadcrumbItem[]} Sanitized items
 * @example
 * buildBreadcrumbs([
 *   { name: 'Home', url: 'https://example.com/en' },
 *   { name: 'Podcasts', url: 'https://example.com/en/podcasts' },
 *   { name: 'Episode 1', url: 'https://example.com/en/podcasts/ep-1' }
 * ]);
 */
export function buildBreadcrumbs(items: BreadcrumbItem[]): BreadcrumbItem[] {
  const seen = new Set<string>();
  return items
    .filter((i) => i && typeof i.name === "string" && typeof i.url === "string")
    .map((i) => ({ name: i.name.trim(), url: i.url.trim() }))
    .filter((i) => i.name.length > 0 && i.url.length > 0)
    .filter((i) => {
      const key = `${i.name}|${i.url}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
}

/**
 * Build previous / next pagination URLs (rel links) from a base path and page numbers.
 * Returns an object only containing properties that exist (undefined omitted when spread in Astro).
 *
 * @param {string} siteBase Base absolute site URL
 * @param {string} lang Current language segment (without surrounding slashes)
 * @param {string} basePath Path segment after language (no leading slash required)
 * @param {number} currentPage Current 1-based page number
 * @param {number} totalPages Total pages
 */
export function buildPaginationRelUrls(
  siteBase: string,
  lang: string,
  basePath: string,
  currentPage: number,
  totalPages: number
): { prevUrl?: string; nextUrl?: string } {
  if (totalPages <= 1) {
    return {};
  }
  const normalize = (p: number): string =>
    buildCanonicalUrl(siteBase, `/${lang}/${basePath}${p > 1 ? `/page/${p}` : ""}`);
  const prevUrl = currentPage > 1 ? normalize(currentPage - 1) : undefined;
  const nextUrl = currentPage < totalPages ? normalize(currentPage + 1) : undefined;
  return { prevUrl, nextUrl };
}
