import { languages } from "../i18n/ui.js";

const LANGUAGE_STORAGE_KEY = "preferred-language";

/**
 * Determine the user's preferred language based on storage or browser settings.
 */
export function determineUserLanguage(): string {
  // 1. Prüfe zuerst den LocalStorage
  if (typeof window !== "undefined") {
    const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (storedLanguage && languages[storedLanguage as keyof typeof languages]) {
      return storedLanguage;
    }
  }

  // 2. Prüfe die vom Browser bevorzugte Sprache
  if (
    typeof navigator !== "undefined" &&
    navigator.language &&
    languages[navigator.language as keyof typeof languages]
  ) {
    return navigator.language;
  }

  // 3. Fallback auf die aktuelle Sprache oder Standard
  return "de";
}

/**
 * Persist user language selection to localStorage when available.
 */
export function saveLanguagePreference(language: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }
}

/**
 * Return the list of configured language codes.
 */
export function getAvailableLanguages(): string[] {
  return Object.keys(languages);
}

/**
 * Get the currently stored language or a sensible default.
 */
export function getCurrentLanguage(): string {
  if (typeof window !== "undefined") {
    const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (storedLanguage && languages[storedLanguage as keyof typeof languages]) {
      return storedLanguage;
    }
  }
  return "de"; // Standardsprache als Fallback
}
