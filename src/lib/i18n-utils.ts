import { ui, defaultLang } from "../i18n/ui.js";

// Type for translations
type Translations = Record<string, string>;

/**
 * Returns a translation for a specific key
 * @param key The translation key
 * @param lang The language (optional, defaults to defaultLang)
 * @param params Parameters for the translation (optional)
 * @returns The translated string
 */
export function getTranslation(
  key: string,
  lang: string = defaultLang,
  params: Record<string, string | number> = {}
): string {
  // Use the specified language or the default language
  const translations = ui[lang as keyof typeof ui] || ui[defaultLang];

  // Get the translation for the key
  let translation = (translations as unknown as Translations)[key] || key;

  // Replace parameters in the translation
  Object.entries(params).forEach(([paramKey, paramValue]) => {
    translation = translation.replace(new RegExp(`{${paramKey}}`, "g"), String(paramValue));
  });

  return translation;
}

/**
 * Extracts the preferred language from the Accept-Language header
 * @param request The request
 * @returns The preferred language or the default language
 */
export function getPreferredLanguage(request: Request): string {
  const acceptLanguage = request.headers.get("accept-language") || "";

  // Extract language codes from the Accept-Language header
  const languages = acceptLanguage
    .split(",")
    .map((lang) => lang.split(";")[0].trim().substring(0, 2).toLowerCase());

  // Find the first supported language
  const supportedLanguages = Object.keys(ui);
  const preferredLanguage = languages.find((lang) => supportedLanguages.includes(lang));

  return preferredLanguage || defaultLang;
}

/**
 * Returns a translation based on the request
 * @param request The request
 * @param key The translation key
 * @param params Parameters for the translation (optional)
 * @returns The translated string
 */
export function t(
  request: Request,
  key: string,
  params: Record<string, string | number> = {}
): string {
  const lang = getPreferredLanguage(request);
  return getTranslation(key, lang, params);
}
