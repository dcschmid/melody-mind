/**
 * Simplified i18n configuration for quiz app (English only)
 */
import { FALLBACK_LANGUAGE } from "@constants/i18n";
import en from "./locales/en";

export const defaultLang: string = FALLBACK_LANGUAGE;
export const ui: Record<string, Record<string, string>> = { en };

export function getLangFromUrl(_url: URL): string {
  return "en";
}

export function useTranslatedPath(_lang: string) {
  return function translatePath(path: string) {
    return path;
  };
}

export function getRouteFromUrl(_url: URL): string | undefined {
  return undefined;
}
