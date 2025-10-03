/**
 * Central asset path constants to avoid scattering literal strings across pages.
 * Extend cautiously; keep only widely reused stable references.
 */
export const NEWS_FALLBACK_IMAGE = "/images/news-fallback.svg" as const;
export const PLAYLIST_COVER_IMAGE = "/homecategories/playlist.png" as const;
export const PODCAST_COVER_IMAGE = "/homecategories/podcast.png" as const;

export default {
  NEWS_FALLBACK_IMAGE,
};
