/**
 * Meta utilities (legacy) for consistent SEO output.
 * All functions are pure and side-effect free.
 *
 * DEPRECATION NOTICE:
 * These helpers are being phased out in favor of the unified text pipeline
 * implemented in `textUnified.ts` and high-level builder `buildPageSeo.ts`.
 * New code SHOULD NOT import from this module. It remains temporarily to
 * avoid breaking existing pages and will be removed after a migration pass.
 */

/**
 * Normalize repeated whitespace (including newlines and tabs) to single spaces and trim.
 * @deprecated Use sanitizeWhitespace in textUnified (planned) or inline minimal regex.
 */
// NOTE: normalizeWhitespace removed (legacy). Use direct inline regex below.

/**
 * Truncate a string to a maximum length and append an ellipsis if truncated.
 * Attempts to avoid cutting mid-word when possible (basic heuristic).
 * @param {string} text Input text
 * @param {number} [limit] Max characters (default 158 – common meta description safe length)
 * @param {{ preserveWord?: boolean; ellipsis?: string }} [options] Optional config: preserveWord, ellipsis
 */
/**
 * Truncate meta text with optional word preservation.
 * @deprecated Use buildPageSeo (auto description generation) instead of direct truncateMeta.
 */
/**
 * Legacy meta text truncator.
 * @internal @deprecated Replaced by buildPageSeo auto description pipeline.
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
  const normalized = (text || "").replace(/\s+/g, " ").trim();
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
 * @deprecated Superseded by buildPageSeo (internal description pipeline).
 */
/**
 * Legacy meta description builder wrapper.
 * @internal @deprecated Use buildPageSeo generated description.
 */
export function buildMetaDescription(text: string, limit = 158): string {
  if (!text) {
    return "";
  }
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= limit) {
    return normalized;
  }
  let slice = normalized.slice(0, limit);
  const lastSpace = slice.lastIndexOf(" ");
  if (lastSpace > limit * 0.6) {
    slice = slice.slice(0, lastSpace);
  }
  return `${slice}...`;
}

/**
 * Ensure a title isn't accidentally blank after trimming.
 * @deprecated Superseded by buildPageSeo title normalization.
 */
/**
 * Legacy title normalizer fallback.
 * @internal @deprecated Title normalization handled upstream.
 */
export function ensureTitle(text: string, fallback: string): string {
  if (!text) {
    return fallback;
  }
  const t = text.replace(/\s+/g, " ").trim();
  return t || fallback;
}

// Breadcrumb helpers moved to ./breadcrumbs.ts
