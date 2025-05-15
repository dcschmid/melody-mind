/**
 * SEO Helper Functions for Melody Mind
 *
 * A collection of utility functions to optimize content for search engines
 * and improve discoverability of the Melody Mind application.
 */

/**
 * Creates an SEO-friendly URL slug from a string
 *
 * Takes any text input and converts it to a URL-friendly format by:
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
export function calculateReadingTime(content: string, wordsPerMinute = 225): number {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes;
}

/**
 * Extracts keywords from text content for SEO meta tags
 *
 * Analyzes the provided content to identify potential keywords by:
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
 * Extracts keywords from text content for SEO meta tags using advanced techniques
 *
 * Analyzes the provided content to identify potential keywords by:
 * - Removing language-specific stop words
 * - Extracting both single words and meaningful n-grams (phrases)
 * - Calculating word and phrase frequency with TF-IDF-like weighting
 * - Selecting the most relevant terms as keywords
 *
 * This helps in generating highly relevant meta keywords for SEO optimization.
 *
 * @param content The text content to extract keywords from
 * @param maxKeywords Maximum number of keywords to return, default: 10
 * @param language Language code for stop words, default: 'en'
 * @returns A comma-separated list of keywords
 * @example
 * // might return "music quiz, melody mind, interactive game, music history"
 * extractKeywords("Melody Mind is a music quiz game with interactive music history categories...", 5, 'en');
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
 * Creates a concise, meaningful description suitable for meta tags by:
 * - Removing HTML tags
 * - Trimming to the specified maximum length
 * - Ensuring the description ends with a complete sentence when possible
 *
 * This helps improve search engine results and click-through rates.
 *
 * @param content The full content to extract a description from
 * @param maxLength Maximum length of the description, default: 160 characters
 * @returns An optimized meta description
 * @example
 * // returns "Learn about music history through interactive quizzes..."
 * generateMetaDescription("<p>Learn about music history through interactive quizzes. Test your knowledge and earn points.</p>");
 */
/**
 * Generates an optimized meta description from content with intelligent sentence selection
 *
 * Creates a concise, meaningful description suitable for meta tags by:
 * - Removing HTML tags
 * - Analyzing sentence importance and relevance
 * - Selecting the most informative sentences
 * - Ensuring the description ends with a complete sentence when possible
 * - Optimizing for readability and click-through rates
 *
 * This helps improve search engine results and user engagement.
 *
 * @param content The full content to extract a description from
 * @param maxLength Maximum length of the description, default: 160 characters
 * @returns An optimized meta description
 * @example
 * // returns "Learn about music history through our interactive quizzes. Test your knowledge with challenging questions."
 * generateMetaDescription("<p>Learn about music history through our interactive quizzes. Test your knowledge with challenging questions. Earn points and compete with friends.</p>");
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
