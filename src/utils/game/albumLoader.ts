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
 * @param {string} [fallbackLanguage='de'] - The fallback language if the preferred one fails
 * @returns {Promise<Album[]>} Array of albums for the category
 * @throws {Error} If no albums can be loaded from any language
 */
export async function loadAlbumsWithFallback(
  category: string,
  language: string,
  fallbackLanguage: string = "de"
): Promise<Album[]> {
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
  const primary = await tryLoadForLanguage(language);
  if (primary && primary.length) {
    return primary;
  }

  // Try fallback language
  const fallback = await tryLoadForLanguage(fallbackLanguage);
  if (fallback && fallback.length) {
    return fallback;
  }

  // Nothing found — report and throw
  const errMessage = `Category '${category}' not found in languages: ${language}, ${fallbackLanguage}.`;
  handleLoadingError(new Error(errMessage), `category loading for ${category}`);
  throw new Error(
    `Category '${category}' not found in any language. Available categories might be: 1950s, 1960s, 1970s, 1980s, 1990s, 2000s, 2010s`
  );
}

/**
 * Validates that loaded album data is in the correct format
 *
 * @param albums - The albums data to validate
 * @returns boolean - True if the data is valid
 */
/**
 * Validates that loaded album data is in the correct format
 *
 * @param {unknown} albums - The albums data to validate
 * @returns {albums is Album[]} True if the data is valid
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
