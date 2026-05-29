/**
 * Deterministically sorts entry-like objects by `slug`, falling back to `id`.
 *
 * Characteristics:
 * - non-mutating: the input array is never changed,
 * - shallow: entries themselves are not cloned,
 * - deterministic for the provided runtime locale via `localeCompare`,
 * - and tolerant of partial data by treating missing `slug`/`id` as empty strings.
 *
 * This helper is intentionally simple and is mainly used where Melody Mind needs a
 * stable alphabetical order for content groupings without introducing date- or
 * score-based ranking logic.
 *
 * @template T extends object
 * @param entries - Array of objects containing an optional `slug` or `id` field
 * @returns A new shallow-copied array sorted lexicographically by `slug` then `id`
 */
export function sortEntries<T extends { slug?: string; id?: string }>(
  entries: readonly T[]
): T[] {
  if (!Array.isArray(entries) || entries.length === 0) {
    return Array.isArray(entries) ? [...entries] : [];
  }
  return [...entries].sort((a, b) => {
    const aSlug: string = (a.slug ?? a.id ?? "").toString();
    const bSlug: string = (b.slug ?? b.id ?? "").toString();
    return aSlug.localeCompare(bSlug);
  });
}
