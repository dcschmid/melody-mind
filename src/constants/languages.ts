/**
 * Central list of supported UI languages/locales for MelodyMind.
 *
 * IMPORTANT:
 * - Keep in sync with files in `src/i18n/locales/` (excluding `template.ts`).
 * - Always use this constant in `getStaticPaths()` to avoid divergence.
 * - Add new languages at the end to preserve any ordering expectations.
 */
export const SUPPORTED_LANGUAGES = [
  "en",
  "de",
  "fr",
  "es",
  "it",
  "nl",
  "pt",
  "ru",
  "uk",
  "da",
  "sv",
  "fi",
  "jp",
  "cn",
] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

/**
 * Narrow type guard for validating an unknown language string.
 */
export function isSupportedLanguage(lang: string): lang is SupportedLanguage {
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(lang);
}
