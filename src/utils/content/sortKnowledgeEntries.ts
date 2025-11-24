/**
 * Deterministically sort knowledge collection entries by `slug` (fallback `id`).
 * Pure (non-mutating) – always returns a shallow-copied sorted array.
 * Locale aware via `String.localeCompare` (default runtime locale).
 *
 * @template T extends object
 * @param {T[]} entries Array of entries containing an optional `slug` or `id` field.
 * @returns {T[]} New sorted array (original order left intact).
 */
export function sortKnowledgeEntries<T extends { slug?: string; id?: string }>(
  entries: readonly T[],
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
