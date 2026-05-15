/**
 * Collapses repeated whitespace into a single-space plain text string.
 */
export const normalizeWhitespace = (input: string): string =>
  input.replace(/\s+/g, " ").trim();
