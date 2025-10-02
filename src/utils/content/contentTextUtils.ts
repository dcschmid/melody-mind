/**
 * Content Text / Naming Utilities
 * Centralizes small helpers used across pages to avoid inline duplications.
 */

/**
 * Extract a decade label (e.g. '1980s') from a string containing a year.
 * Falls back to 'Other' when no 4-digit year is found.
 */
export function getDecadeFromHeadline(headline: string): string {
  const yearMatch = headline.match(/\b(\d{4})\b/);
  if (yearMatch) {
    return `${yearMatch[1].substring(0, 3)}0s`;
  }
  return "Other";
}

/**
 * Extract a bare image name (without extension) from a URL or path.
 */
export function getImageName(url: string): string {
  const filename = url.split("/").pop() || "";
  return filename.replace(/\.[^/.]+$/, "");
}
