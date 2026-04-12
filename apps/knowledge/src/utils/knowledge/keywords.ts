/**
 * Shared keyword normalization helpers for Knowledge article utilities.
 */

/**
 * Normalizes a raw keyword array into a clean list of lowercase, trimmed strings.
 */
export function normalizeKeywords(keywords: unknown[] | undefined): string[] {
  return Array.isArray(keywords)
    ? keywords
        .map((keyword) =>
          typeof keyword === "string" ? keyword.trim().toLowerCase() : ""
        )
        .filter(Boolean)
    : [];
}

/**
 * Returns a deduplicated Set of normalized keywords.
 */
export function toKeywordSet(keywords: unknown[] | undefined): Set<string> {
  return new Set(normalizeKeywords(keywords));
}
