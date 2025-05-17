/**
 * Utility module for handling album type conversions between different interfaces
 * This helps resolve type compatibility issues between different modules
 *
 * @module albumConverter
 */

import type { Album as GetRandomAlbum } from "./getRandomQuestion";
import type { Album as LoadQuestionAlbum } from "./loadQuestionUtils";

/**
 * Helper function to convert GetRandomAlbum to Album type for use with loadQuestion function
 * This resolves type compatibility issues between different modules
 *
 * @param {GetRandomAlbum} album - Album from getRandomQuestion
 * @returns {LoadQuestionAlbum} Album compatible with loadQuestion
 */
export function convertAlbum(album: GetRandomAlbum): LoadQuestionAlbum {
  return {
    coverSrc: album.coverSrc,
    artist: album.artist,
    album: album.album,
    year: album.year,
  };
}
