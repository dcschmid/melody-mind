/**
 * Site URL resolution utilities.
 *
 * Provides consistent URL handling across the application, handling
 * Astro's site configuration with sensible defaults and fallbacks.
 *
 * @module utils/siteUrls
 */

/** Default site URL when Astro site is not configured */
const DEFAULT_SITE_URL = "https://melody-mind.de";

/** Type for objects that can be converted to a URL string */
type URLLike = { toString(): string };

/**
 * Resolve the base URL from Astro's site configuration.
 *
 * Normalizes the URL by removing trailing slashes for consistency.
 *
 * @param site - Astro's site configuration (string, URL object, or undefined)
 * @param fallback - Fallback URL if site is not configured (default: melody-mind.de)
 * @returns The normalized base URL without trailing slash
 *
 * @example
 * ```typescript
 * // With Astro site configured as "https://example.com/"
 * resolveBaseUrl(Astro.site) // "https://example.com"
 *
 * // Without site configuration
 * resolveBaseUrl(undefined) // "https://melody-mind.de"
 * ```
 */
export function resolveBaseUrl(
  site: string | URLLike | undefined,
  fallback = DEFAULT_SITE_URL
): string {
  const raw = site ? site.toString() : fallback;
  return raw.endsWith("/") ? raw.slice(0, -1) : raw;
}

/**
 * Resolve a full page URL from a base site and pathname.
 *
 * Combines the site URL with a pathname to create a complete URL.
 * Uses the URL constructor for proper URL handling.
 *
 * @param site - Astro's site configuration
 * @param pathname - The page path (e.g., "/knowledge/article-slug")
 * @param fallback - Fallback base URL if site is not configured
 * @returns The complete URL as a string
 *
 * @example
 * ```typescript
 * resolvePageUrl(Astro.site, "/knowledge/jazz-basics")
 * // "https://melody-mind.de/knowledge/jazz-basics"
 * ```
 */
export function resolvePageUrl(
  site: string | URLLike | undefined,
  pathname: string,
  fallback = DEFAULT_SITE_URL
): string {
  const baseUrl = resolveBaseUrl(site, fallback);
  const normalizedPath = pathname.startsWith("/") ? pathname.slice(1) : pathname;
  return new globalThis.URL(normalizedPath, `${baseUrl}/`).toString();
}

/**
 * Resolve an absolute URL, handling both relative paths and full URLs.
 *
 * If the path is already a full URL (http/https), returns it unchanged.
 * Otherwise, resolves it relative to the site base URL.
 *
 * @param site - Astro's site configuration
 * @param path - The path or URL to resolve
 * @param fallback - Fallback base URL if site is not configured
 * @returns The absolute URL as a string
 *
 * @example
 * ```typescript
 * // Relative path
 * resolveAbsoluteUrl(Astro.site, "/images/cover.jpg")
 * // "https://melody-mind.de/images/cover.jpg"
 *
 * // Already absolute URL
 * resolveAbsoluteUrl(Astro.site, "https://cdn.example.com/image.jpg")
 * // "https://cdn.example.com/image.jpg"
 *
 * // Empty path returns base URL
 * resolveAbsoluteUrl(Astro.site, "")
 * // "https://melody-mind.de"
 * ```
 */
export function resolveAbsoluteUrl(
  site: string | URLLike | undefined,
  path: string,
  fallback = DEFAULT_SITE_URL
): string {
  if (!path) {
    return resolveBaseUrl(site, fallback);
  }
  if (/^https?:\/\//i.test(path)) {
    return path;
  }
  return resolvePageUrl(site, path, fallback);
}
