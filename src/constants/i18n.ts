/**
 * i18n core constants & helpers
 *
 * Central place for shared internationalization primitives to avoid
 * scattering literal values ("en") and ad-hoc normalization across the
 * codebase.
 */

/**
 * Canonical fallback language (must exist physically in data & locales).
 * @constant {string}
 */
export const FALLBACK_LANGUAGE = "en" as const;

/**
 * Normalize an incoming language identifier.
 *
 * Behavior:
 * 1. Accepts unknown input (defensive for poorly typed call sites)
 * 2. Coerces only string values; everything else → `FALLBACK_LANGUAGE`
 * 3. Trims surrounding whitespace
 * 4. Lowercases (languages stored in lowercase across repo)
 * 5. Returns `FALLBACK_LANGUAGE` when result is empty
 *
 * @param {unknown} input Arbitrary language-like value (route param, user preference)
 * @returns {string} Normalized, non-empty lowercase language code
 */
export function normalizeLanguage(input: unknown): string {
  if (typeof input !== "string") {
    return FALLBACK_LANGUAGE;
  }
  const normalized = input.trim().toLowerCase();
  return normalized || FALLBACK_LANGUAGE;
}

/**
 * Check if a provided language resolves to the canonical fallback.
 *
 * @param {string} lang Language code candidate
 * @returns {boolean} True if normalized language equals `FALLBACK_LANGUAGE`
 */
export function isFallbackLanguage(lang: string): boolean {
  return normalizeLanguage(lang) === FALLBACK_LANGUAGE;
}

export default {
  FALLBACK_LANGUAGE,
  normalizeLanguage,
  isFallbackLanguage,
};
