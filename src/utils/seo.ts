/**
 * SEO Helper Functions for Melody Mind
 *
 * A collection of utility functions to optimize content for search engines
 * and improve discoverability of the Melody Mind application.
 */

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
export function extractKeywords(
  content: string,
  maxKeywords = 10,
  language = "en"
): string {
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
