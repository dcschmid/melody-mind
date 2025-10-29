/**
 * Date helper utilities for content normalization.
 */

/** Normalize various date input forms into a valid Date or null. */
export function normalizeDate(input: unknown): Date | null {
  if (!input) {
    return null;
  }
  if (input instanceof Date && !isNaN(input.getTime())) {
    return input;
  }
  if (typeof input === "string" || typeof input === "number") {
    const d = new Date(input);
    if (!isNaN(d.getTime())) {
      return d;
    }
  }
  return null;
}

export interface DeriveDatesResult {
  publishDate: Date | null;
  modifiedDate: Date | null;
}

/**
 * Derive publish/modified dates with fallbacks.
 * If modified missing -> use publish; if publish missing -> try modified; else nulls.
 */
export function derivePublishModified(
  publishRaw: unknown,
  modifiedRaw: unknown
): DeriveDatesResult {
  const publish = normalizeDate(publishRaw);
  const modified = normalizeDate(modifiedRaw);
  if (publish && !modified) {
    return { publishDate: publish, modifiedDate: publish };
  }
  if (!publish && modified) {
    return { publishDate: modified, modifiedDate: modified };
  }
  return { publishDate: publish, modifiedDate: modified };
}
