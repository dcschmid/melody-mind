/**
 * Text Sanitizing Utilities
 * Provides minimal HTML tag stripping, whitespace collapsing and length limiting.
 * Pure + framework agnostic; safe for SEO preprocessing.
 */

/** Strip basic HTML tags. Does not execute scripts; naive regex intentionally simple. */
export function stripTags(input: string): string {
  if (!input) {
    return "";
  }
  return input.replace(/<[^>]+>/g, "");
}

/** Collapse consecutive whitespace (including newlines) to single spaces and trim. */
export function collapseWhitespace(input: string): string {
  if (!input) {
    return "";
  }
  return input.replace(/\s+/g, " ").trim();
}

/**
 * Full sanitize pipeline: strip tags, collapse whitespace, optional length cap.
 * @param {string} text Raw text possibly containing HTML/extra whitespace.
 * @param {number} [max] Optional max length (soft). If exceeded, it truncates at boundary and adds ellipsis.
 */
export function sanitizeText(text: string, max?: number): string {
  const base = collapseWhitespace(stripTags(text));
  if (typeof max === "number" && max > 0 && base.length > max) {
    return `${base.slice(0, Math.max(0, max - 1)).trimEnd()}…`;
  }
  return base;
}

/** Convenience factory returning a sanitizeFn compatible with buildSeoText params. */
export function createSanitizeFn(max?: number): (raw: string) => string {
  return (raw: string): string => sanitizeText(raw, max);
}

export default sanitizeText;
