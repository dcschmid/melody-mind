/**
 * Shared helpers for resolving site-relative and absolute URLs.
 *
 * These utilities are used by SEO, schema and page-data builders that need a stable absolute
 * URL regardless of whether the caller passes an Astro `site` value, a plain string or nothing.
 */

const DEFAULT_SITE_URL = "https://melody-mind.de";

/** Minimal URL-like input accepted by the helpers, e.g. Astro's `site` config value. */
type URLLike = { toString(): string };

/**
 * Resolves the configured site base URL into a normalized origin-like string.
 *
 * The returned value never ends with a trailing slash so it can be joined consistently with
 * path segments elsewhere.
 */
export function resolveBaseUrl(
  site: string | URLLike | undefined,
  fallback = DEFAULT_SITE_URL
): string {
  const raw = site ? site.toString() : fallback;
  return raw.endsWith("/") ? raw.slice(0, -1) : raw;
}

/**
 * Resolves a pathname against the configured site base and returns an absolute URL string.
 *
 * The input path may be passed with or without a leading slash.
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
 * Resolves a value into an absolute URL while tolerating already-absolute inputs.
 *
 * Behavior:
 * - empty input resolves to the normalized base URL
 * - `http`/`https` URLs are returned unchanged
 * - relative paths are resolved against the configured site base
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
