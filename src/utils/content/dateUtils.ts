/**
 * Date helper utilities for content normalization.
 *
 * Provides consistent date handling across the application, with support
 * for various input formats and fallback logic.
 *
 * @module utils/content/dateUtils
 */

/**
 * Normalize various date input forms into a valid Date or null.
 *
 * Handles:
 * - Date objects (returned if valid)
 * - ISO date strings
 * - Unix timestamps (numbers)
 * - null/undefined (returns null)
 *
 * @param input - The date input to normalize
 * @returns A valid Date object or null if input is invalid
 *
 * @example
 * ```typescript
 * normalizeDate(new Date("2024-01-15")) // Date object
 * normalizeDate("2024-01-15") // Date object
 * normalizeDate(1705276800000) // Date object
 * normalizeDate("invalid") // null
 * normalizeDate(null) // null
 * ```
 */
export function normalizeDate(input: unknown): Date | null {
  if (!input) {
    return null;
  }
  if (input instanceof Date && !isNaN(input.getTime())) {
    return input;
  }
  if (typeof input === "string" || typeof input === "number") {
    const d = new Date(input);
    if (!isNaN(d.getTime())) {
      return d;
    }
  }
  return null;
}

/**
 * Result of deriving publish and modified dates.
 */
export interface DeriveDatesResult {
  /** The derived publish date, or null if unavailable */
  publishDate: Date | null;
  /** The derived modified date, or null if unavailable */
  modifiedDate: Date | null;
}

/**
 * Derive publish and modified dates with intelligent fallbacks.
 *
 * Fallback logic:
 * - If publish exists but modified is missing → use publish for both
 * - If modified exists but publish is missing → use modified for both
 * - If both missing → return nulls
 * - If both exist → use as-is
 *
 * This ensures content always has consistent date information for SEO
 * and display purposes.
 *
 * @param publishRaw - The raw publish date input
 * @param modifiedRaw - The raw modified date input
 * @returns An object with normalized publishDate and modifiedDate
 *
 * @example
 * ```typescript
 * // Both dates provided
 * derivePublishModified("2024-01-01", "2024-01-15")
 * // { publishDate: Date(2024-01-01), modifiedDate: Date(2024-01-15) }
 *
 * // Only publish date - modified falls back to publish
 * derivePublishModified("2024-01-01", null)
 * // { publishDate: Date(2024-01-01), modifiedDate: Date(2024-01-01) }
 *
 * // Neither date - both null
 * derivePublishModified(null, null)
 * // { publishDate: null, modifiedDate: null }
 * ```
 */
export function derivePublishModified(
  publishRaw: unknown,
  modifiedRaw: unknown
): DeriveDatesResult {
  const publish = normalizeDate(publishRaw);
  const modified = normalizeDate(modifiedRaw);
  if (publish && !modified) {
    return { publishDate: publish, modifiedDate: publish };
  }
  if (!publish && modified) {
    return { publishDate: modified, modifiedDate: modified };
  }
  return { publishDate: publish, modifiedDate: modified };
}
