/**
 * Internationalization helper functions for Melody Mind
 *
 * Single-language i18n helpers (English).
 */

import { ui, defaultLang } from "../i18n/ui";

// Type definitions for UI translations
type TranslationKey = string;
type TranslationValue = string;
type LanguageCode = "en";
type TranslationsForLanguage = Record<TranslationKey, TranslationValue>;

/**
 * Returns the current language for the site (English only).
 *
 * Historically parsed URL prefixes, but with single-language support we always
 * return the default language.
 *
 * @param {URL} _url - The URL object from Astro.url (unused)
 * @returns {LanguageCode} The language code (always 'en')
 */
export function getLangFromUrl(_url: URL): LanguageCode {
  return defaultLang as LanguageCode;
}

/**
 * Creates a translation function for the specified language
 *
 * Returns a function that translates keys to strings for the given language,
 * with fallback to the default language if a translation is missing.
 * Supports variable interpolation in translation strings.
 *
 * @param {string} lang - The language code to use for translations
 * @returns {(key: TranslationKey, vars?: Record<string,string|number>) => string} A function that returns translated strings
 */
export function useTranslations(
  lang: string
): (key: TranslationKey, vars?: Record<string, string | number>) => string {
  return function t(key: TranslationKey, vars?: Record<string, string | number>): string {
    // Safe type checking for translation access
    const langTranslations = (ui[lang as LanguageCode] ?? {}) as TranslationsForLanguage;
    const defaultTranslations = ui[defaultLang] as TranslationsForLanguage;

    // Get translation with fallback chain: specified language → default language → key itself
    let text = langTranslations[key] ?? defaultTranslations[key] ?? key;

    // Replace variables in the translation string if provided
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        text = text.replace(new RegExp(`{${k}}`, "g"), v.toString());
      });
    }

    return text;
  };
}

// Export types for TypeScript support
export type UiLanguages = keyof typeof ui;
export type UiKeys<T extends UiLanguages> = keyof (typeof ui)[T];
export { ui, defaultLang };
