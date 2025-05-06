import { ui, defaultLang } from "../i18n/ui.js";

// Typ für Übersetzungen
type Translations = Record<string, string>;

/**
 * Gibt eine Übersetzung für einen bestimmten Schlüssel zurück
 * @param key Der Übersetzungsschlüssel
 * @param lang Die Sprache (optional, Standard ist defaultLang)
 * @param params Parameter für die Übersetzung (optional)
 * @returns Die übersetzte Zeichenkette
 */
export function getTranslation(
  key: string,
  lang: string = defaultLang,
  params: Record<string, string | number> = {},
): string {
  // Verwende die angegebene Sprache oder die Standardsprache
  const translations = ui[lang as keyof typeof ui] || ui[defaultLang];

  // Hole die Übersetzung für den Schlüssel
  let translation = (translations as unknown as Translations)[key] || key;

  // Ersetze Parameter in der Übersetzung
  Object.entries(params).forEach(([paramKey, paramValue]) => {
    translation = translation.replace(
      new RegExp(`{${paramKey}}`, "g"),
      String(paramValue),
    );
  });

  return translation;
}

/**
 * Extrahiert die bevorzugte Sprache aus dem Accept-Language-Header
 * @param request Der Request
 * @returns Die bevorzugte Sprache oder die Standardsprache
 */
export function getPreferredLanguage(request: Request): string {
  const acceptLanguage = request.headers.get("accept-language") || "";

  // Extrahiere die Sprachcodes aus dem Accept-Language-Header
  const languages = acceptLanguage
    .split(",")
    .map((lang) => lang.split(";")[0].trim().substring(0, 2).toLowerCase());

  // Finde die erste unterstützte Sprache
  const supportedLanguages = Object.keys(ui);
  const preferredLanguage = languages.find((lang) =>
    supportedLanguages.includes(lang),
  );

  return preferredLanguage || defaultLang;
}

/**
 * Gibt eine Übersetzung basierend auf dem Request zurück
 * @param request Der Request
 * @param key Der Übersetzungsschlüssel
 * @param params Parameter für die Übersetzung (optional)
 * @returns Die übersetzte Zeichenkette
 */
export function t(
  request: Request,
  key: string,
  params: Record<string, string | number> = {},
): string {
  const lang = getPreferredLanguage(request);
  return getTranslation(key, lang, params);
}
