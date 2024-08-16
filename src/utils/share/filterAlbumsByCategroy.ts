import type { Album } from "../interfaces/albumInterface";

/**
 * Filters an array of albums by a specific category.
 * @param albums The array of albums to filter.
 * @param category The category to filter by.
 * @returns The filtered array of albums.
 */
export function filterAlbumsByCategory(albums: Album[], category: string): Album[] {
  return albums.filter(album => album.category.toLowerCase() === category.toLowerCase());
}
