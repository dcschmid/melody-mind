import { FALLBACK_LANGUAGE, normalizeLanguage } from "@constants/i18n";

import type { Album } from "../../types/game";
import { handleLoadingError } from "../error/errorHandlingUtils";

/**
 * Album Loader Utility
 *
 * Centralized utility for loading album data with language fallback.
 * Eliminates code duplication across different game engines.
 */

/**
 * Load album data for a category with a primary language and a fallback.
 *
 * - Tries the preferred `language` first and then `fallbackLanguage`.
 * - Uses a small helper to keep each fetch attempt isolated, reducing overall complexity.
 * - Returns a validated Album[] or throws with a helpful message.
 *
 * @param {string} category - The music category/genre to load
 * @param {string} language - The preferred language for the data
 * @param {string} [fallbackLanguage='en'] - The fallback language if the preferred one fails
 * @returns {Promise<Album[]>} Array of albums for the category
 * @throws {Error} If no albums can be loaded from any language
 */
/**
 * Load album data for a category with a primary language and a fallback.
 *
 * Tries the normalized preferred language first, then (if different) the global
 * `FALLBACK_LANGUAGE`. A custom `fallbackLanguage` may be provided to facilitate
 * future experimentation, but defaults to the canonical constant.
 *
 * Design notes:
 * - Uses an inner helper for a single fetch attempt to keep the flow linear.
 * - Resilient: errors from primary attempt are logged, not thrown, so fallback proceeds.
 * - Accepts either a raw array or wrapped object `{ albums: Album[] }`.
 *
 * @param {string} category Slug / identifier of the music category
 * @param {string} language Preferred (possibly user / route derived) language
 * @param {string} [fallbackLanguage] Optional explicit fallback (defaults to canonical)
 * @returns {Promise<Album[]>} Resolved array of Album objects
 * @throws {Error} If neither primary nor fallback yield valid album data
 */
export async function loadAlbumsWithFallback(
  category: string,
  language: string,
  fallbackLanguage: string = FALLBACK_LANGUAGE
): Promise<Album[]> {
  const primaryLang = normalizeLanguage(language);
  const fallbackLang = normalizeLanguage(fallbackLanguage);
  // Helper to attempt loading JSON for a specific language and return Album[] | null
  async function tryLoadForLanguage(lang: string): Promise<Album[] | null> {
    try {
      const res = await fetch(`/json/genres/${lang}/${category}.json`);
      if (!res.ok) {
        return null;
      }

      const data = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        return data as Album[];
      }

      if (data && typeof data === "object") {
        const maybe = data as Record<string, unknown>;
        if (Array.isArray(maybe.albums) && (maybe.albums as unknown[]).length > 0) {
          return maybe.albums as Album[];
        }
      }

      return null;
    } catch (err: unknown) {
      // Record the failure but don't throw here so fallback can be attempted
      try {
        handleLoadingError(err, `data for ${category} (${lang})`);
      } catch {
        void err;
      }
      return null;
    }
  }

  // Try preferred language first
  const primary = await tryLoadForLanguage(primaryLang);
  if (primary && primary.length) {
    return primary;
  }

  // Try fallback language
  const fallback = primaryLang === fallbackLang ? null : await tryLoadForLanguage(fallbackLang);
  if (fallback && fallback.length) {
    return fallback;
  }

  // Nothing found — report and throw
  const errMessage = `Category '${category}' not found in languages: ${primaryLang}, ${fallbackLang}.`;
  handleLoadingError(new Error(errMessage), `category loading for ${category}`);
  throw new Error(
    `Category '${category}' not found in any language. Available categories might be: 1950s, 1960s, 1970s, 1980s, 1990s, 2000s, 2010s`
  );
}

/**
 * Validate loaded album data structure.
 * Accepts either an empty array (valid but returns false on every()) or full Album shape.
 *
 * @param {unknown} albums Unknown data parsed from JSON.
 * @returns {albums is Album[]} True if every element conforms to minimal Album shape.
 */
export function validateAlbumsData(albums: unknown): albums is Album[] {
  if (!Array.isArray(albums)) {
    return false;
  }

  // Use a plain boolean-returning predicate here to avoid parser issues
  // with TypeScript type-predicate syntax in some tooling.
  return albums.every((album) => {
    if (!album || typeof album !== "object") {
      return false;
    }
    const rec = album as Record<string, unknown>;
    return (
      typeof rec["artist"] === "string" &&
      typeof rec["album"] === "string" &&
      (typeof rec["year"] === "string" || typeof rec["year"] === "number")
    );
  });
}
