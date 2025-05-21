/**
 * Internationalization utilities for MelodyMind
 *
 * Provides server-side translation utilities with type safety for keys and parameters.
 * Includes language detection from request headers and translation helper functions.
 *
 * @since 1.0.0
 * @category Internationalization
 */
import { ui, defaultLang, languages } from "../i18n/ui.js";
import type { TranslationKey, TranslationParams } from "../utils/typed-i18n";

/**
 * Brand for language codes to distinguish them from regular strings
 */
declare const enum LanguageCodeBrand {
  Brand = 'LANGUAGE_CODE_BRAND'
}

/**
 * Branded type for language codes to prevent mixing with regular strings
 */
export type LanguageCode = string & { readonly __brand: LanguageCodeBrand };

/**
 * Type for translations dictionary for a specific language
 */
type TranslationDictionary = Record<string, string>;

/**
 * Type-safe language codes from the available languages
 */
export type SupportedLanguage = keyof typeof languages;

/**
 * Possible errors that can occur during translation
 *
 * @since 1.0.0
 * @category Internationalization
 */
export class TranslationError extends Error {
  /**
   * Creates a new TranslationError instance
   *
   * @param {string} message - Error message describing the issue
   * @param {string} key - The translation key that caused the error
   * @param {string} lang - The language code that was being used
   */
  constructor(
    message: string,
    public readonly key: string,
    public readonly lang: string
  ) {
    super(message);
    this.name = "TranslationError";
  }
}

/**
 * Optimized cache for frequently used translations
 */
const translationCache = new Map<string, string>();

/**
 * Maximum size for the translation cache to prevent memory leaks
 */
const MAX_CACHE_SIZE = 500;

/**
 * Creates a cache key from translation parameters
 *
 * @since 1.0.0
 * @category Internationalization
 *
 * @param {string} key - The translation key
 * @param {string} lang - The language code
 * @param {Record<string, string | number>} [params] - Optional translation parameters
 * @returns {string} A unique cache key string
 *
 * @example
 * // Creates a cache key for a translation without parameters
 * const simpleKey = createCacheKey("auth.login.welcome", "en");
 *
 * // Creates a cache key with parameters
 * const paramKey = createCacheKey("game.score", "de", { points: 100 });
 */
function createCacheKey(
  key: string,
  lang: string,
  params?: Record<string, string | number>
): string {
  return params ? `${lang}:${key}:${JSON.stringify(params)}` : `${lang}:${key}`;
}

/**
 * Returns a translation for a specific key with type-safe parameters
 *
 * @since 1.0.0
 * @category Internationalization
 *
 * @template K - Translation key type constraint
 * @param {K} key - The translation key
 * @param {string} lang - The language (optional, defaults to defaultLang)
 * @param {TranslationParams<K>} [params] - Type-safe parameters for the translation
 * @returns {string} The translated string
 *
 * @throws {TranslationError} When the translation key is missing and no fallback is available
 *
 * @example
 * // Basic usage without parameters
 * const welcomeText = getTypedTranslation("auth.login.welcome", "de");
 *
 * // With parameter replacement (type-checked)
 * const scoreText = getTypedTranslation("game.score.result", "en", { points: 450, total: 500 });
 */
export function getTypedTranslation<K extends TranslationKey>(
  key: K,
  lang: string = defaultLang,
  params?: TranslationParams<K>
): string {
  // Check cache first for better performance
  const cacheKey = createCacheKey(key, lang, params as Record<string, string | number> | undefined);

  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  // Use the specified language or the default language
  const translations = ui[lang as keyof typeof ui] || ui[defaultLang];

  // Get the translation for the key
  let translation = (translations as TranslationDictionary)[key];

  // If translation is missing, try fallback language or use key as last resort
  if (!translation) {
    const fallbackTranslation = (ui[defaultLang] as TranslationDictionary)[key];

    if (fallbackTranslation) {
      translation = fallbackTranslation;
    } else {
      // For strict error checking, could throw here instead of silently using the key
      // throw new TranslationError(`Missing translation for key: ${key}`, key, lang);
      translation = key;
    }
  }

  // Replace parameters in the translation if provided
  if (params && Object.keys(params).length > 0) {
    // More efficient single-pass parameter replacement
    translation = Object.entries(params).reduce(
      (result, [paramKey, paramValue]) =>
        result.replace(new RegExp(`{${paramKey}}`, "g"), String(paramValue)),
      translation
    );
  }

  // Cache the result if it's not too long
  if (translation.length < 1000 && translationCache.size < MAX_CACHE_SIZE) {
    translationCache.set(cacheKey, translation);

    // Simple LRU-like cache management - clear half when reaching max size
    if (translationCache.size === MAX_CACHE_SIZE) {
      const keysToDelete = Array.from(translationCache.keys()).slice(0, MAX_CACHE_SIZE / 2);
      keysToDelete.forEach((k) => translationCache.delete(k));
    }
  }

  return translation;
}

/**
 * Returns a translation for a specific key (compatibility version)
 *
 * Legacy version maintained for backwards compatibility.
 * New code should use getTypedTranslation for improved type safety.
 *
 * @since 1.0.0
 * @category Internationalization
 * @deprecated Use getTypedTranslation for better type safety
 *
 * @param {string} key - The translation key
 * @param {string} lang - The language (optional, defaults to defaultLang)
 * @param {Record<string, string | number>} [params] - Parameters for the translation
 * @returns {string} The translated string
 */
export function getTranslation(
  key: string,
  lang: string = defaultLang,
  params?: Record<string, string | number>
): string {
  return getTypedTranslation(
    key as TranslationKey,
    lang,
    params as TranslationParams<TranslationKey>
  );
}

/**
 * Extracts the preferred language from the Accept-Language header
 *
 * @since 1.0.0
 * @category Internationalization
 *
 * @param {Request} request - The HTTP request object
 * @returns {string} The preferred language code or the default language
 *
 * @example
 * const request = new Request("https://example.com");
 * const lang = getPreferredLanguage(request);
 * console.log(`Detected language: ${lang}`);
 */
export function getPreferredLanguage(request: Request): string {
  const acceptLanguage = request.headers.get("accept-language") || "";

  // Extract language codes from the Accept-Language header
  const languageCodes = acceptLanguage
    .split(",")
    .map((lang) => lang.split(";")[0].trim().substring(0, 2).toLowerCase());

  // Find the first supported language
  const supportedLanguages = Object.keys(ui);
  const preferredLanguage = languageCodes.find((lang) => supportedLanguages.includes(lang));

  return preferredLanguage || defaultLang;
}

/**
 * Returns a translation based on the request
 *
 * @since 1.0.0
 * @category Internationalization
 *
 * @param {Request} request - The HTTP request object
 * @param {string} key - The translation key
 * @param {Record<string, string | number>} [params] - Parameters for the translation
 * @returns {string} The translated string
 *
 * @example
 * // In an API route or server component:
 * import { t } from "../lib/i18n-utils";
 *
 * export function GET(request) {
 *   const welcomeMessage = t(request, "common.welcome");
 *   const scoreMessage = t(request, "game.score.result", { points: 450, total: 500 });
 *   // ...
 * }
 */
export function t(request: Request, key: string, params?: Record<string, string | number>): string {
  const lang = getPreferredLanguage(request);
  return getTranslation(key, lang, params);
}

/**
 * Type-safe version of the request-based translation function
 *
 * @since 1.0.0
 * @category Internationalization
 *
 * @template K - Translation key type constraint
 * @param {Request} request - The HTTP request object
 * @param {K} key - The translation key with type checking
 * @param {TranslationParams<K>} [params] - Type-safe parameters for the translation
 * @returns {string} The translated string
 *
 * @example
 * // In an API route or server component with type safety:
 * import { tTyped } from "../lib/i18n-utils";
 *
 * export function GET(request) {
 *   // Type-safe translations
 *   const welcomeMessage = tTyped(request, "common.welcome");
 *   const scoreMessage = tTyped(request, "game.score.result", { points: 450, total: 500 });
 *
 *   // This would cause a TypeScript error:
 *   // const error = tTyped(request, "game.score.result", { wrongParam: 123 });
 * }
 */
export function tTyped<K extends TranslationKey>(
  request: Request,
  key: K,
  params?: TranslationParams<K>
): string {
  const lang = getPreferredLanguage(request);
  return getTypedTranslation(key, lang, params);
}
