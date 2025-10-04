/**
 * Category type (single canonical definition)
 *
 * Centralized to avoid duplication across loaders and utilities.
 * This matches the structure found in the localized *_categories.json files.
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
  [key: string]: unknown; // Allow forward-compatible fields
}
