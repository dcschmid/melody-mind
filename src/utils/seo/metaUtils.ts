/**
 * Meta utilities (truncation, whitespace normalization) for consistent SEO output.
 * All functions are pure and side-effect free.
 */

/**
 * Normalize repeated whitespace (including newlines and tabs) to single spaces and trim.
 * @deprecated Internal helper; prefer sanitize utilities in textUnified pipeline.
 */
export function normalizeWhitespace(input: string | null | undefined): string {
  if (!input) {
    return "";
  }
  return input.replace(/\s+/g, " ").trim();
}

/**
 * Truncate a string to a maximum length and append an ellipsis if truncated.
 * Attempts to avoid cutting mid-word when possible (basic heuristic).
 * @param {string} text Input text
 * @param {number} [limit] Max characters (default 158 – common meta description safe length)
 * @param {{ preserveWord?: boolean; ellipsis?: string }} [options] Optional config: preserveWord, ellipsis
 */
/**
 * Truncate meta text with optional word preservation.
 * @deprecated Use buildPageSeo + sanitize instead of direct truncateMeta.
 */
export function truncateMeta(
  text: string | null | undefined,
  limit = 158,
  options: { preserveWord?: boolean; ellipsis?: string } = {}
): string {
  const { preserveWord = true, ellipsis = "..." } = options;
  if (!text) {
    return "";
  }
  const normalized = normalizeWhitespace(text);
  if (normalized.length <= limit) {
    return normalized;
  }
  let slice = normalized.slice(0, limit);
  if (preserveWord) {
    const lastSpace = slice.lastIndexOf(" ");
    if (lastSpace > limit * 0.6) {
      slice = slice.slice(0, lastSpace);
    }
  }
  return slice + ellipsis;
}

/**
 * Build a safe meta description from arbitrary text.
 * @deprecated Superseded by generateMetaDescription + textUnified composition.
 */
export function buildMetaDescription(text: string, limit = 158): string {
  return truncateMeta(text, limit, { preserveWord: true });
}

/**
 * Ensure a title isn't accidentally blank after trimming.
 * @deprecated Use ensureBrandSuffix + sanitize in buildPageSeo.
 */
export function ensureTitle(text: string, fallback: string): string {
  const t = normalizeWhitespace(text);
  return t || fallback;
}

// Breadcrumb helpers moved to ./breadcrumbs.ts
