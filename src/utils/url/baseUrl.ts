/**
 * getBaseUrl Helper
 * Normalizes the logic of deriving a base URL from Astro.site with a fallback.
 */
export function getBaseUrl(site: string | URL | undefined, fallback = "https://melody-mind.de"): string {
  if (!site) {
    return fallback;
  }
  const s = site.toString().trim();
  return s.endsWith("/") ? s.slice(0, -1) : s;
}

export default getBaseUrl;
