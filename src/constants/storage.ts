/**
 * Centralized localStorage and sessionStorage key constants.
 * Prevents typos and makes refactoring easier.
 *
 * @module constants/storage
 */

/**
 * localStorage keys used across the application.
 */
export const STORAGE_KEYS = {
  /** Bookmark data storage */
  BOOKMARKS: "mm_bookmarks",
  /** Cookie consent preferences */
  COOKIE_CONSENT: "cookie_consent",
  /** Recent reads history */
  RECENT_READS: "mm_recent_reads",
  /** Theme preference (light/dark) */
  THEME: "themePreference",
  /** Reading mode preference */
  READING_MODE: "mm_reading_mode",
  /** Font size preference */
  FONT_SIZE: "mm_font_size",
} as const;

/**
 * sessionStorage keys used across the application.
 */
export const SESSION_KEYS = {
  /** User journey tracking (previous page) */
  JOURNEY: "mm_journey_previous",
  /** A/B test variant assignments */
  AB_TESTS: "mm_ab_variants",
} as const;

/**
 * Type for localStorage keys.
 */
export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

/**
 * Type for sessionStorage keys.
 */
export type SessionKey = (typeof SESSION_KEYS)[keyof typeof SESSION_KEYS];

/**
 * Runtime analytics flag set on window object.
 */
export const RUNTIME_FLAGS = {
  /** Whether analytics tracking is allowed */
  ANALYTICS_ALLOWED: "__mmAnalyticsAllowed",
} as const;
