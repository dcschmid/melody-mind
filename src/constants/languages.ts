/**
 * Central list of supported UI languages/locales for MelodyMind.
 *
 * IMPORTANT:
 * - Keep in sync with files in `src/i18n/locales/` (excluding `template.ts`).
 * - Always use this constant in `getStaticPaths()` to avoid divergence.
 * - Add new languages at the end to preserve any ordering expectations.
 */
// 2025-10 reduction: project now only supports a focused core set of languages.
// Removed: nl, ru, uk, da, sv, fi, jp, cn (and associated locale data will be ignored).
// Order keeps fallback (en) first, followed by major European languages + pt.
export const SUPPORTED_LANGUAGES = ["en", "de", "es", "it", "fr", "pt"] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

/**
 * Narrow type guard for validating an unknown language string.
 */
export function isSupportedLanguage(lang: string): lang is SupportedLanguage {
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(lang);
}

import { FALLBACK_LANGUAGE, normalizeLanguage } from "@constants/i18n";

/**
 * Ensure a caller-supplied language value resolves to a supported language.
 *
 * Steps:
 * 1. Normalize (trim + lowercase) via `normalizeLanguage`.
 * 2. If supported, return it as-is.
 * 3. Otherwise return `FALLBACK_LANGUAGE`.
 *
 * Rationale: Centralizes the common pattern `normalize → validate → fallback` and
 * avoids scattering literal fallback logic across loaders and pages.
 *
 * @param {unknown} input Arbitrary language candidate (route param, query, header)
 * @returns {SupportedLanguage | typeof FALLBACK_LANGUAGE} Guaranteed supported language code
 */
export function ensureSupportedLanguage(
  input: unknown
): SupportedLanguage | typeof FALLBACK_LANGUAGE {
  const norm = normalizeLanguage(input);
  return isSupportedLanguage(norm) ? norm : FALLBACK_LANGUAGE;
}
