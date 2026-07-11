/**
 * Normalizes a loose date-like input into a valid `Date` instance or `null`.
 *
 * Accepted input forms:
 * - Date objects (returned if valid)
 * - parseable date strings
 * - numeric timestamps
 * - null/undefined (returns null)
 *
 * This helper is intentionally permissive because content frontmatter and derived
 * metadata may arrive as strings, numbers or already-instantiated `Date` objects.
 *
 * @param input - The date input to normalize
 * @returns A valid Date object or null if input is invalid
 *
 * @example
 * ```typescript
 * normalizeDate(new Date("2024-01-15")) // Date object
 * normalizeDate("2024-01-15") // Date object
 * normalizeDate(1705276800000) // Date object
 * normalizeDate("invalid") // null
 * normalizeDate(null) // null
 * ```
 */
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
