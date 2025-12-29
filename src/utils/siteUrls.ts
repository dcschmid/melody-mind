const DEFAULT_SITE_URL = "https://melody-mind.de";

type URLLike = { toString(): string };

export function resolveBaseUrl(
  site: string | URLLike | undefined,
  fallback = DEFAULT_SITE_URL
): string {
  const raw = site ? site.toString() : fallback;
  return raw.endsWith("/") ? raw.slice(0, -1) : raw;
}

export function resolvePageUrl(
  site: string | URLLike | undefined,
  pathname: string,
  fallback = DEFAULT_SITE_URL
): string {
  const baseUrl = resolveBaseUrl(site, fallback);
  const normalizedPath = pathname.startsWith("/") ? pathname.slice(1) : pathname;
  return new globalThis.URL(normalizedPath, `${baseUrl}/`).toString();
}

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
