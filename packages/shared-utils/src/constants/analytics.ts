/**
 * Shared analytics thresholds and normalization limits used by client-side telemetry.
 *
 * These values are consumed by `clientAnalytics.ts` to keep event naming, engagement
 * timing and search classification consistent across apps. The file intentionally
 * contains only stable, low-level constants and no runtime logic.
 */

/**
 * Time-based thresholds for passive engagement tracking, expressed in milliseconds.
 *
 * The analytics runtime uses these values to distinguish quick exits from engaged
 * sessions and to emit a small set of consistent time-on-page milestones.
 */
export const ENGAGEMENT_TIMING = {
  /**
   * Amount of time a page can stay open without meaningful interaction before the
   * session is treated as a bounce candidate.
   */
  BOUNCE_THRESHOLD_MS: 15_000,
  /**
   * Ordered time milestones that trigger engagement events while a user remains
   * active on the page.
   */
  ENGAGED_MILESTONES_MS: [30_000, 90_000] as const,
} as const;

/**
 * Upper bounds applied while sanitizing analytics payload fragments.
 *
 * These caps help avoid overly long event names or token fragments before values
 * are sent to Fathom.
 */
export const ANALYTICS_LIMITS = {
  /**
   * Maximum length for a final event name after whitespace normalization.
   * Kept conservative to stay within Fathom-friendly event naming.
   */
  EVENT_NAME_MAX_LENGTH: 80,
  /**
   * Maximum length for derived token fragments such as category or search buckets
   * after slug-style sanitization.
   */
  TOKEN_MAX_LENGTH: 30,
} as const;

/**
 * Percent-based read-depth milestones emitted for article scroll tracking.
 *
 * The client analytics layer treats these as checkpoints, not a continuous scale,
 * so changes here directly affect the event vocabulary and dashboard comparability.
 */
export const READING_DEPTH_MILESTONES = [25, 50, 75, 100] as const;

/**
 * Heuristics for grouping on-site search queries into coarse size buckets.
 *
 * Search telemetry uses these values to avoid storing full raw query semantics
 * while still distinguishing short exploratory searches from more specific intent.
 */
export const SEARCH_QUERY_BUCKETS = {
  /**
   * Minimum number of whitespace-separated tokens required before a query is
   * treated as "long".
   */
  LONG_QUERY_MIN_TOKENS: 4,
  /**
   * Minimum character count required before a query is treated as "medium"
   * instead of "short".
   */
  MEDIUM_QUERY_MIN_CHARS: 16,
} as const;
