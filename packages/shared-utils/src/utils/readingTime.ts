/**
 * Reading-time estimation helpers for article-like content.
 *
 * The implementation is intentionally heuristic rather than editorially exact. It provides
 * stable, low-cost estimates that work well for article cards, detail pages and taxonomy views.
 */

/** Optional knobs for the reading-time heuristic. */
export interface ReadingTimeOptions {
  wordsPerMinute?: number;
  minTime?: number;
  includeImageTime?: boolean;
  imageTimeSeconds?: number;
  languageCode?: string;
}

/** Structured reading-time result used by UI-facing callers. */
export interface ReadingTimeResult {
  minutes: number;
  text: string;
  words: number;
  images?: number;
}

/** Shared defaults for text-only and image-adjusted reading-time estimates. */
const DEFAULTS = {
  WORDS_PER_MINUTE: 225,
  MIN_TIME: 1,
  IMAGE_TIME_SECONDS: 12,
  IMAGE_REGEX: /<Image\s[^>]*>/g,
};

/**
 * Coarse language-specific reading-speed multipliers.
 *
 * These values adjust the base words-per-minute rate and are meant as lightweight tuning,
 * not as scientifically precise reading models.
 */
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

/**
 * Calculates the estimated reading time in whole minutes.
 *
 * Behavior:
 * - counts words using whitespace splitting (or reuses provided count)
 * - adjusts the base words-per-minute rate by optional language multiplier
 * - optionally adds fixed time per `<Image ...>` occurrence
 * - rounds up and enforces a minimum result
 */
export function calculateReadingTime(
  text: string,
  options: ReadingTimeOptions & { wordCount?: number } = {}
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
    wordCount,
  } = options;

  const adjustedWpm =
    languageCode && LANGUAGE_MULTIPLIERS[languageCode]
      ? wordsPerMinute * LANGUAGE_MULTIPLIERS[languageCode]
      : wordsPerMinute;

  const words = wordCount ?? text.trim().split(/\s+/).length;
  let minutes = words / adjustedWpm;

  if (includeImageTime && text.includes("<Image")) {
    const imageMatches = text.match(DEFAULTS.IMAGE_REGEX) || [];
    minutes += (imageMatches.length * imageTimeSeconds) / 60;
  }

  return Math.max(Math.ceil(minutes), minTime);
}

/**
 * Returns a UI-ready reading-time payload including formatted label and source counts.
 *
 * Counts words once, then reuses the count in calculateReadingTime() instead of
 * splitting the text a second time.
 *
 * Results are memoised by `(text, wordsPerMinute, languageCode)` so repeated calls
 * for the same article body (common across content / meta / related utils) return
 * the cached value immediately.
 */
const _readingTimeCache = new Map<string, ReadingTimeResult>();

function _buildCacheKey(text: string, options: ReadingTimeOptions): string {
  return `${text.length}:${options.wordsPerMinute ?? DEFAULTS.WORDS_PER_MINUTE}:${options.languageCode ?? ""}:${options.includeImageTime ? "1" : "0"}`;
}

export function getReadingTime(
  text: string,
  options: ReadingTimeOptions = {}
): ReadingTimeResult {
  const cacheKey = _buildCacheKey(text, options);
  const cached = _readingTimeCache.get(cacheKey);
  if (cached !== undefined) {
    return cached;
  }

  if (!text) {
    const fallback = options.minTime || DEFAULTS.MIN_TIME;
    const result: ReadingTimeResult = {
      minutes: fallback,
      text: `${fallback} min read`,
      words: 0,
    };
    _readingTimeCache.set(cacheKey, result);
    return result;
  }

  const words = text.trim().split(/\s+/).length;
  let images: number | undefined;

  if (options.includeImageTime && text.includes("<Image")) {
    images = (text.match(DEFAULTS.IMAGE_REGEX) || []).length;
  }

  const minutes = calculateReadingTime(text, { ...options, wordCount: words });

  const result: ReadingTimeResult = {
    minutes,
    text: `${minutes} min read`,
    words,
    ...(images !== undefined ? { images } : {}),
  };

  _readingTimeCache.set(cacheKey, result);
  return result;
}
