/**
 * Analytics Constants
 *
 * Centralized configuration for client-side analytics tracking.
 */

/**
 * Timing thresholds for engagement tracking (in milliseconds).
 */
export const ENGAGEMENT_TIMING = {
  /** Time without interaction before counting as bounce */
  BOUNCE_THRESHOLD_MS: 15_000,
  /** Milestones for tracking engaged time on page */
  ENGAGED_MILESTONES_MS: [30_000, 90_000] as const,
} as const;

/**
 * Limits for event data sanitization.
 */
export const ANALYTICS_LIMITS = {
  /** Maximum characters for event names (Fathom limit) */
  EVENT_NAME_MAX_LENGTH: 80,
  /** Maximum characters for sanitized tokens */
  TOKEN_MAX_LENGTH: 30,
} as const;

/**
 * Default reading depth milestones to track (percentage).
 */
export const READING_DEPTH_MILESTONES = [25, 50, 75, 100] as const;

/**
 * Search query length buckets for categorization.
 */
export const SEARCH_QUERY_BUCKETS = {
  /** Minimum tokens for "long" query */
  LONG_QUERY_MIN_TOKENS: 4,
  /** Minimum characters for "medium" query */
  MEDIUM_QUERY_MIN_CHARS: 16,
} as const;
