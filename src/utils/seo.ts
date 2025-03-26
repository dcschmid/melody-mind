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
export function calculateReadingTime(
  content: string,
  wordsPerMinute = 225,
): number {
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
export function extractKeywords(content: string, maxKeywords = 10): string {
  // Simple keyword extractor
  // In a real application, more advanced logic would be used here
  const stopWords = [
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
  ];

  const words = content
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 3 && !stopWords.includes(word));

  // Count frequency of each word
  const wordFrequency: Record<string, number> = {};
  words.forEach((word) => {
    wordFrequency[word] = (wordFrequency[word] || 0) + 1;
  });

  // Sort words by frequency
  const sortedWords = Object.keys(wordFrequency)
    .sort((a, b) => wordFrequency[b] - wordFrequency[a])
    .slice(0, maxKeywords);

  return sortedWords.join(", ");
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
export function generateMetaDescription(
  content: string,
  maxLength = 160,
): string {
  // Remove HTML tags and excess whitespace
  let text = content
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Return the text if it's already shorter than the maximum length
  if (text.length <= maxLength) return text;

  // Find the last complete sentence within the maximum length
  const truncated = text.substring(0, maxLength);
  const lastPeriod = truncated.lastIndexOf(".");

  if (lastPeriod > 0) {
    return truncated.substring(0, lastPeriod + 1);
  }

  // If no sentence end is found, truncate at the last word
  const lastSpace = truncated.lastIndexOf(" ");
  return lastSpace > 0
    ? truncated.substring(0, lastSpace) + "..."
    : truncated + "...";
}
