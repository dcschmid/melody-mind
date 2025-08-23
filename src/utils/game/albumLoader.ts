import type { Album } from "../../types/game";
import { handleLoadingError } from "../error/errorHandlingUtils";

/**
 * Album Loader Utility
 *
 * Centralized utility for loading album data with language fallback.
 * Eliminates code duplication across different game engines.
 */

/**
 * Loads album data for a specific category and language with fallback support
 *
 * @param category - The music category/genre to load
 * @param language - The preferred language for the data
 * @param fallbackLanguage - The fallback language if the preferred one fails (default: 'de')
 * @returns Promise<Album[]> - Array of albums for the category
 * @throws Error if no albums can be loaded from any language
 */
export async function loadAlbumsWithFallback(
  category: string,
  language: string,
  fallbackLanguage: string = "de"
): Promise<Album[]> {
  try {
    // Try to load from the preferred language first
    const response = await fetch(`/json/genres/${language}/${category}.json`);

    if (response.ok) {
      const albumsData = await response.json();

      // Ensure we have valid album data
      if (Array.isArray(albumsData) && albumsData.length > 0) {
        return albumsData;
      }

      // If it's an object with an albums property that is an array, use that
      if (albumsData && typeof albumsData === "object" && Array.isArray(albumsData.albums)) {
        return albumsData.albums;
      }

      console.warn(`No albums found for ${language}/${category}, trying fallback`);
    }
  } catch (error) {
    console.warn(`Failed to load ${language}/${category}, trying fallback:`, error);
  }

  // Fallback to the fallback language
  try {
    const fallbackResponse = await fetch(`/json/genres/${fallbackLanguage}/${category}.json`);

    if (!fallbackResponse.ok) {
      throw new Error(`Failed to load albums for category: ${category} from any language`);
    }

    const fallbackData = await fallbackResponse.json();

    // Ensure we have valid album data from fallback
    if (Array.isArray(fallbackData) && fallbackData.length > 0) {
      return fallbackData;
    }

    if (fallbackData && typeof fallbackData === "object" && Array.isArray(fallbackData.albums)) {
      return fallbackData.albums;
    }

    throw new Error(`No albums found for category: ${category} in any language`);
  } catch (fallbackError) {
    handleLoadingError(fallbackError, `fallback data for ${category}`);
    throw new Error(
      `Category '${category}' not found in any language. Available categories might be: 1950s, 1960s, 1970s, 1980s, 1990s, 2000s, 2010s`
    );
  }
}

/**
 * Validates that loaded album data is in the correct format
 *
 * @param albums - The albums data to validate
 * @returns boolean - True if the data is valid
 */
export function validateAlbumsData(albums: unknown): albums is Album[] {
  if (!Array.isArray(albums)) {
    return false;
  }

  return albums.every(
    (album) =>
      album && typeof album === "object" && "artist" in album && "album" in album && "year" in album
  );
}
