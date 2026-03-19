/**
 * Reading Time Calculation Utility
 *
 * Shared helper to estimate how long a body of text will take to read.
 */

export interface ReadingTimeOptions {
  wordsPerMinute?: number;
  minTime?: number;
  includeImageTime?: boolean;
  imageTimeSeconds?: number;
  languageCode?: string;
}

export interface ReadingTimeResult {
  minutes: number;
  text: string;
  words: number;
  images?: number;
}

const DEFAULTS = {
  WORDS_PER_MINUTE: 225,
  MIN_TIME: 1,
  IMAGE_TIME_SECONDS: 12,
  IMAGE_REGEX: /<Image\s[^>]*>/g,
};

const LANGUAGE_MULTIPLIERS: Record<string, number> = {
  en: 1.0,
  de: 0.9,
  es: 1.1,
  fr: 1.05,
  it: 1.05,
  pt: 1.1,
  da: 0.95,
  nl: 0.95,
  sv: 0.95,
  fi: 0.85,
};

export function calculateReadingTime(
  text: string,
  options: ReadingTimeOptions = {}
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

  const adjustedWpm =
    languageCode && LANGUAGE_MULTIPLIERS[languageCode]
      ? wordsPerMinute * LANGUAGE_MULTIPLIERS[languageCode]
      : wordsPerMinute;

  const words = text.trim().split(/\s+/).length;
  let minutes = words / adjustedWpm;

  if (includeImageTime && text.includes("<Image")) {
    const imageMatches = text.match(DEFAULTS.IMAGE_REGEX) || [];
    minutes += (imageMatches.length * imageTimeSeconds) / 60;
  }

  return Math.max(Math.ceil(minutes), minTime);
}

export function getReadingTime(
  text: string,
  options: ReadingTimeOptions = {}
): ReadingTimeResult {
  if (!text) {
    const fallback = options.minTime || DEFAULTS.MIN_TIME;
    return {
      minutes: fallback,
      text: `${fallback} min read`,
      words: 0,
    };
  }

  const words = text.trim().split(/\s+/).length;
  let images: number | undefined;

  if (options.includeImageTime && text.includes("<Image")) {
    images = (text.match(DEFAULTS.IMAGE_REGEX) || []).length;
  }

  const minutes = calculateReadingTime(text, options);

  return {
    minutes,
    text: `${minutes} min read`,
    words,
    ...(images !== undefined ? { images } : {}),
  };
}
