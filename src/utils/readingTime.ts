/**
 * Reading Time Calculation Utility
 *
 * This module provides functions to estimate the time it takes to read a given text.
 * It uses language-specific word counting and reading speed adjustments to provide
 * accurate estimates across different content types and languages.
 *
 * @module readingTime
 */

/**
 * Options for calculating reading time
 */
export interface ReadingTimeOptions {
  /** Average words per minute reading speed */
  wordsPerMinute?: number;
  /** Minimum reading time to return in minutes */
  minTime?: number;
  /** Whether to include image viewing time in the calculation */
  includeImageTime?: boolean;
  /** Estimated seconds to view each image */
  imageTimeSeconds?: number;
  /** Language code for potential language-specific adjustments */
  languageCode?: string;
}

/**
 * Result of the reading time calculation
 */
export interface ReadingTimeResult {
  /** Estimated minutes to read the text */
  minutes: number;
  /** Estimated reading time as a formatted string (e.g. "3 min read") */
  text: string;
  /** Number of words counted in the content */
  words: number;
  /** Number of images detected (if applicable) */
  images?: number;
}

/**
 * Default values used in calculations
 */
const DEFAULTS = {
  WORDS_PER_MINUTE: 225,
  MIN_TIME: 1,
  IMAGE_TIME_SECONDS: 12,
  IMAGE_REGEX: /<Image\s[^>]*>/g,
};

/**
 * Language-specific reading speed adjustments (multipliers)
 * Based on research about relative reading speeds in different languages
 */
const LANGUAGE_MULTIPLIERS: Record<string, number> = {
  en: 1.0, // English (baseline)
  de: 0.9, // German (longer words)
  es: 1.1, // Spanish
  fr: 1.05, // French
  it: 1.05, // Italian
  pt: 1.1, // Portuguese
  da: 0.95, // Danish
  nl: 0.95, // Dutch
  sv: 0.95, // Swedish
  fi: 0.85, // Finnish (complex words)
};

/**
 * Calculates the estimated reading time for a given text
 *
 * @param text - The text content to analyze
 * @param options - Optional configuration parameters
 * @returns The estimated reading time in minutes (rounded up)
 */
/**
 * Calculate estimated reading time in minutes for a given text.
 *
 * @param {string} text - The text content to analyze
 * @param {ReadingTimeOptions} options - Optional configuration parameters
 * @returns {number} The estimated reading time in minutes (rounded up)
 */
export function calculateReadingTime(
  text: string,
  options: ReadingTimeOptions = {},
): number {
  if (!text) {
    return options.minTime || DEFAULTS.MIN_TIME;
  }

  const {
    wordsPerMinute = DEFAULTS.WORDS_PER_MINUTE,
    minTime = DEFAULTS.MIN_TIME,
    includeImageTime = false,
    imageTimeSeconds = DEFAULTS.IMAGE_TIME_SECONDS,
    languageCode,
  } = options;

  // Apply language-specific reading speed adjustment
  const adjustedWpm =
    languageCode && LANGUAGE_MULTIPLIERS[languageCode]
      ? wordsPerMinute * LANGUAGE_MULTIPLIERS[languageCode]
      : wordsPerMinute;

  // Count words using a regex that works across different languages
  const words = text.trim().split(/\s+/).length;

  // Calculate base reading time
  let minutes = words / adjustedWpm;

  // Add time for images if requested
  if (includeImageTime && text.includes("<Image")) {
    const imageMatches = text.match(DEFAULTS.IMAGE_REGEX) || [];
    const imageCount = imageMatches.length;
    minutes += (imageCount * imageTimeSeconds) / 60;
  }

  // Apply minimum time and round up to nearest minute
  return Math.max(Math.ceil(minutes), minTime);
}

/**
 * Returns a detailed reading time result with formatted text
 *
 * @param text - The text content to analyze
 * @param options - Optional configuration parameters
 * @returns A ReadingTimeResult object with minutes, formatted text, and word count
 */
/**
 * Return a detailed reading time result object.
 *
 * @param {string} text - The text content to analyze
 * @param {ReadingTimeOptions} options - Optional configuration parameters
 * @returns {ReadingTimeResult} Detailed reading time information
 */
export function getReadingTime(
  text: string,
  options: ReadingTimeOptions = {},
): ReadingTimeResult {
  if (!text) {
    return {
      minutes: options.minTime || DEFAULTS.MIN_TIME,
      text: `${options.minTime || DEFAULTS.MIN_TIME} min read`,
      words: 0,
    };
  }
  // Stellt sicher, dass readingTime definiert ist
  const words = text.trim().split(/\s+/).length;
  let images: number | undefined = undefined;

  if (options.includeImageTime && text.includes("<Image")) {
    const imageMatches = text.match(DEFAULTS.IMAGE_REGEX) || [];
    images = imageMatches.length;
  }

  const minutes = calculateReadingTime(text, options);

  return {
    minutes,
    text: `${minutes} min read`,
    words,
    ...(images !== undefined ? { images } : {}),
  };
}
