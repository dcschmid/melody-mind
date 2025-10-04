/**
 * i18n core constants & helpers
 *
 * Central place for shared internationalization primitives to avoid
 * scattering literal values ("en") and ad-hoc normalization across the
 * codebase.
 */

/** Canonical fallback language (must exist physically in data & locales). */
export const FALLBACK_LANGUAGE = "en" as const;

/**
 * Normalize an incoming language string (route param, user pref, etc.).
 * - Trims whitespace
 * - Lowercases
 * - Falls back to `FALLBACK_LANGUAGE` if falsy
 */
export function normalizeLanguage(input: unknown): string {
  if (typeof input !== "string") {
    return FALLBACK_LANGUAGE;
  }
  const normalized = input.trim().toLowerCase();
  return normalized || FALLBACK_LANGUAGE;
}

/**
 * Simple equality helper to compare languages after normalization.
 */
export function isFallbackLanguage(lang: string): boolean {
  return normalizeLanguage(lang) === FALLBACK_LANGUAGE;
}

export default {
  FALLBACK_LANGUAGE,
  normalizeLanguage,
  isFallbackLanguage,
};
