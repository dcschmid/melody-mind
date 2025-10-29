/**
 * Internationalization helper functions for Melody Mind
 *
 * This module provides utilities for handling multilingual content across the application,
 * including language detection, translation lookup, and URL localization.
 */

import { ui, defaultLang, languages } from "../i18n/ui";

// Type definitions for UI translations
type TranslationKey = string;
type TranslationValue = string;
type LanguageCode = keyof typeof languages;
type TranslationsForLanguage = Record<TranslationKey, TranslationValue>;
type TranslationsObject = Record<LanguageCode, TranslationsForLanguage>;

/**
 * Extracts the current language from a URL
 *
 * Parses the URL path (expected format: /{lang}/...) and returns the language code.
 * Falls back to the default language if no valid language is found.
 *
 * @param {URL} url - The URL object from Astro.url
 * @returns {LanguageCode} The language code (e.g., 'en', 'de', etc.)
 */
export function getLangFromUrl(url: URL): LanguageCode {
  const [, lang] = url.pathname.split("/");
  return isValidLanguage(lang) ? lang : defaultLang;
}

/**
 * Type guard to check if a string is a valid language code
 *
 * @param {string | undefined} lang - String to check
 * @returns {lang is keyof typeof languages} Boolean indicating if the string is a valid language code
 */
function isValidLanguage(lang: string | undefined): lang is keyof typeof languages {
  return Boolean(lang && Object.prototype.hasOwnProperty.call(languages, lang));
}

/**
 * Determines the best language for the user based on browser settings
 *
 * @returns {LanguageCode} A language code from the supported languages
 */
export function determineUserLanguage(): LanguageCode {
  // For server-side rendering, return the default language
  if (typeof navigator === "undefined") {
    return defaultLang;
  }

  // Get browser languages
  const browserLangs = navigator.languages || [navigator.language || "en"];

  // Find the first matching language
  for (const browserLang of browserLangs) {
    const langCode = browserLang.split("-")[0].toLowerCase();
    if (isValidLanguage(langCode)) {
      return langCode;
    }
  }

  // Default fallback
  return defaultLang;
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

/**
 * Creates a localized URL path for a specific language
 *
 * @param {string} lang - The target language code
 * @param {string} path - The path to navigate to (with or without leading slash)
 * @returns {string} A properly formatted URL string for the specified language and path
 */
export function getLocalizedURL(lang: string, path: string): string {
  const safeLang = isValidLanguage(lang) ? lang : defaultLang;
  return `/${safeLang}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Creates a relative URL for a specific language
 *
 * Alias for getLocalizedURL for consistency with Astro's naming conventions
 *
 * @param {string} locale - The language code to use
 * @param {string} path - The path to navigate to
 * @returns {string} A properly formatted relative URL string
 */
export function getRelativeLocaleUrl(locale: string, path: string): string {
  return getLocalizedURL(locale, path);
}

/**
 * Gets translations for a specific key across all supported languages
 *
 * Useful for creating language switchers and other multilingual components
 *
 * @param {TranslationKey} key - The translation key to look up
 * @returns {Record<string,string>} An object mapping language codes to their translations
 */
export function getAllTranslations(key: TranslationKey): Record<string, string> {
  const translations: Record<string, string> = {};

  Object.entries(ui as TranslationsObject).forEach(([lang, langTranslations]) => {
    translations[lang] = langTranslations[key] ?? key;
  });

  return translations;
}

// Export types for TypeScript support
export type UiLanguages = keyof typeof ui;
export type UiKeys<T extends UiLanguages> = keyof (typeof ui)[T];
export { ui, languages, defaultLang };
