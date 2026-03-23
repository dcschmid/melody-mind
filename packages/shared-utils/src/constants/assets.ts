/**
 * Shared asset path constants for globally reused, semantically stable image references.
 *
 * These constants are intentionally narrow in scope: they are meant for fallback or
 * cross-app asset references that should not be duplicated in page-level SEO or UI code.
 * In practice they are currently used by the shared SEO builder to infer a default image
 * when a page declares a `playlist` or `podcast` content kind without providing its own
 * explicit social/share image.
 */

/**
 * Default playlist cover image used as a shared fallback for playlist-related SEO/social
 * metadata when no page-specific image is supplied.
 *
 * The path is site-relative so consuming apps can prepend their own canonical site URL.
 */
export const PLAYLIST_COVER_IMAGE = "/homecategories/playlist.png" as const;

/**
 * Default podcast cover image used as a shared fallback for podcast-related SEO/social
 * metadata when no page-specific image is supplied.
 *
 * Like the playlist image, this remains relative on purpose so callers can resolve it
 * against the active site origin instead of hardcoding a domain here.
 */
export const PODCAST_COVER_IMAGE = "/homecategories/podcast.png" as const;

export default {
  PLAYLIST_COVER_IMAGE,
  PODCAST_COVER_IMAGE,
};
