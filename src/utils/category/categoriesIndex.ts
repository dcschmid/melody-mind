/**
 * categoriesIndex.ts
 *
 * This file statically imports all category JSON files from `src/json/` and exports
 * a language -> Category[] map so category data is guaranteed to be present at
 * runtime (no dynamic import/glob required).
 *
 * Replace or extend the import list below if you add additional languages.
 *
 * NOTE:
 * - Paths are relative to this file: src/utils/category -> ../../json
 * - The JSON files are plain arrays of category objects (see src/json/*.json).
 */

export interface Category {
  slug: string;
  headline: string;
  imageUrl?: string;
  introSubline?: string;
  text?: string;
  categoryUrl?: string;
  categoryType?: string;
  isPlayable?: boolean;
  spotifyPlaylist?: string;
  deezerPlaylist?: string;
  appleMusicPlaylist?: string;
  knowledgeUrl?: string;
  [key: string]: unknown;
}

/*
  Static JSON imports
  (explicit so bundlers include them deterministically)
*/
import cnCategories from "../../json/cn_categories.json";
import daCategories from "../../json/da_categories.json";
import deCategories from "../../json/de_categories.json";
import enCategories from "../../json/en_categories.json";
import esCategories from "../../json/es_categories.json";
import fiCategories from "../../json/fi_categories.json";
import frCategories from "../../json/fr_categories.json";
import itCategories from "../../json/it_categories.json";
import jpCategories from "../../json/jp_categories.json";
import nlCategories from "../../json/nl_categories.json";
import ptCategories from "../../json/pt_categories.json";
import ruCategories from "../../json/ru_categories.json";
import svCategories from "../../json/sv_categories.json";
import ukCategories from "../../json/uk_categories.json";

/**
 * categoriesMap
 *
 * Language code (two-letter) -> Category[].
 * Uses explicit imports to guarantee the data is bundled and available at runtime.
 */
const categoriesMap: Record<string, Category[]> = {
  cn: cnCategories as unknown as Category[],
  da: daCategories as unknown as Category[],
  de: deCategories as unknown as Category[],
  en: enCategories as unknown as Category[],
  es: esCategories as unknown as Category[],
  fi: fiCategories as unknown as Category[],
  fr: frCategories as unknown as Category[],
  it: itCategories as unknown as Category[],
  jp: jpCategories as unknown as Category[],
  nl: nlCategories as unknown as Category[],
  pt: ptCategories as unknown as Category[],
  ru: ruCategories as unknown as Category[],
  sv: svCategories as unknown as Category[],
  uk: ukCategories as unknown as Category[],
};

/**
 * getCategoriesForLang
 * Safe accessor for categoriesMap; returns an empty array if language not found.
 */
export function getCategoriesForLang(lang: string | undefined | null): Category[] {
  if (!lang) {
    return [];
  }
  const key = String(lang).toLowerCase();
  return categoriesMap[key] ?? [];
}

/**
 * getCategoryBySlug
 * Helper to find a category by slug for a given language (falls back to `en`).
 */
export function getCategoryBySlug(lang: string | undefined, slug: string): Category | null {
  if (!slug) {
    return null;
  }
  const candidates = getCategoriesForLang(lang ?? undefined);
  const found = candidates.find((c) => c.slug === slug);
  if (found) {
    return found;
  }
  // fallback to English
  const en = categoriesMap["en"] ?? [];
  return en.find((c) => c.slug === slug) ?? null;
}

/**
 * availableLanguages
 * List of languages included in the static map.
 */
export const availableLanguages = Object.keys(categoriesMap);

/**
 * Default export - full map
 */
export default categoriesMap;
