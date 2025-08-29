/**
 * categoriesIndex.ts
 *
 * Build-time index of all category JSON files located in `src/json/*_categories.json`.
 * This file uses Vite's `import.meta.globEager` so the JSON files are included in the
 * build output and a simple map (language -> categories[]) is exported for easy reuse.
 *
 * Usage:
 *   import categoriesIndex, { getCategoriesForLang, availableLanguages } from '@utils/category/categoriesIndex';
 *
 * Notes:
 * - The pattern '../../json/*_categories.json' is written relative to this file's location.
 * - If your bundler doesn't support `import.meta.globEager`, this file will fall back to
 *   producing an empty map and consumers should handle the empty case.
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
  // optional playlist links
  spotifyPlaylist?: string;
  deezerPlaylist?: string;
  appleMusicPlaylist?: string;
  // link to knowledge article, if present
  knowledgeUrl?: string;
  // allow extra keys
  [key: string]: unknown;
}

/**
 * Typed shape for the Vite eager glob result.
 * When using `globEager`, each matched module should export a `default` value
 * that contains the parsed JSON (Category[]).
 */
type EagerGlobResult = Record<string, { default: Category[] }>;

/**
 * Build the categories map using import.meta.globEager when available.
 * If the feature is not available in the current environment, return an empty map.
 */
const buildCategoriesMap = (): Record<string, Category[]> => {
  // Try to access import.meta.globEager in a typed way.
  // Many bundlers provide this; when not present we return an empty map.
  const meta = import.meta as unknown as { globEager?: (pattern: string) => EagerGlobResult };

  const map: Record<string, Category[]> = {};

  if (typeof meta.globEager !== "function") {
    // Not available in this environment; return an empty map.
    return map;
  }

  // Pattern is relative to this file location: src/utils/category -> ../../json
  const modules = meta.globEager("../../json/*_categories.json") as EagerGlobResult;

  for (const filePath in modules) {
    try {
      const mod = modules[filePath];
      const categories = Array.isArray(mod?.default) ? mod!.default : [];

      // Extract language code from file name like '../../json/de_categories.json'
      const m = filePath.match(/([a-z]{2})_categories\.json$/i);
      if (m && m[1]) {
        const lang = m[1].toLowerCase();
        map[lang] = categories;
        continue;
      }

      // Fallback: try match '/de_categories.json' segments
      const m2 = filePath.match(/\/([a-z]{2})_categories\.json$/i);
      if (m2 && m2[1]) {
        const lang = m2[1].toLowerCase();
        map[lang] = categories;
        continue;
      }

      // As a last resort, use the entire filename as key
      const parts = filePath.split("/").pop()?.split(".")[0] ?? filePath;
      map[parts] = categories;
    } catch (err) {
      // Defensive: if any module fails to read/parse, skip it and continue.
      // Consumers should handle missing languages gracefully.
      // eslint-disable-next-line no-console
      console.warn(`[categoriesIndex] Failed loading ${filePath}:`, err);
    }
  }

  return map;
};

const categoriesMap: Record<string, Category[]> = buildCategoriesMap();

/**
 * Public helpers
 */

/**
 * Get categories for a specific language code (e.g. 'de', 'en').
 * Returns an empty array when no categories are available for the requested language.
 */
export function getCategoriesForLang(lang: string): Category[] {
  if (!lang) return [];
  const key = String(lang).toLowerCase();
  return categoriesMap[key] ?? [];
}

/**
 * Returns the list of available language codes found in the index.
 */
export const availableLanguages = Object.keys(categoriesMap);

/**
 * Default export: the complete map (language -> Category[])
 */
export default categoriesMap;
