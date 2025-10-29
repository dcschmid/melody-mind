/**
 * Utilities for assigning sequential numbers (e.g., episode, category ordering)
 * based on a chronological ordering of items.
 */

export interface SequentialMapOptions<T> {
  /** Extract a stable id string from the item */
  id(item: T): string;
  /** Extract a date used for chronological ordering */
  date(item: T): Date;
  /** Whether numbering starts at 1 (default) */
  startAt?: number;
  /** Sort direction: asc (oldest first) -> natural numbering oldest=1; desc -> newest=1 */
  direction?: "asc" | "desc";
}

/**
 * Build a Map from item id -> sequential number determined by chronological order.
 */
export function buildSequentialNumberMapByDate<T>(
  items: T[],
  opts: SequentialMapOptions<T>
): Map<string, number> {
  const { id, date, startAt = 1, direction = "asc" } = opts;
  const enriched = items
    .map((item) => ({ item, d: date(item), id: id(item) }))
    .filter((e) => e.d instanceof Date && !isNaN(e.d.getTime()) && e.id);
  enriched.sort((a, b) => {
    const diff = a.d.getTime() - b.d.getTime();
    return direction === "asc" ? diff : -diff;
  });
  const map = new Map<string, number>();
  let counter = startAt;
  for (const e of enriched) {
    if (!map.has(e.id)) {
      map.set(e.id, counter++);
    }
  }
  return map;
}

/**
 * Convenience helper: assign a numeric order property onto a shallow clone of each item.
 */
export function assignSequentialNumbers<T, K extends string = "order">(
  items: T[],
  opts: SequentialMapOptions<T> & { key?: K }
): Array<T & { [P in K]: number | undefined }> {
  const map = buildSequentialNumberMapByDate(items, opts);
  const key = (opts.key || "order") as K;
  return items.map((item) => ({
    ...(item as object),
    [key]: map.get(opts.id(item)),
  })) as Array<T & { [P in K]: number | undefined }>;
}
