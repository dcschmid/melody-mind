/**
 * Small persistence helper for "recently viewed" style lists stored in `localStorage`.
 *
 * The module keeps the contract intentionally narrow:
 * - items are validated and sanitized before being returned or persisted
 * - entries are deduplicated by normalized slug
 * - the most recent item is kept at the front of the list
 * - invalid storage contents degrade to an empty array instead of throwing
 *
 * This utility does not add timestamps itself; callers are responsible for providing any
 * `updatedAt` value they want to surface in the UI.
 */
import { safeLocalStorage } from "./safeStorage";

/** Minimal shape rendered by recent-items UIs. */
export interface RecentItem {
  slug: string;
  title: string;
  updatedAt?: string;
  image?: string;
}

const MAX_TITLE_LENGTH = 500;
const MAX_SLUG_LENGTH = 300;

/**
 * Normalizes a slug-like value for storage and comparisons.
 *
 * Leading and trailing slashes are removed so `/foo/bar/` and `foo/bar` collapse to the
 * same identity when recent items are deduplicated.
 */
export const normalizeRecentItemSlug = (value: unknown): string => {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().replace(/^\/+|\/+$/g, "");
};

/**
 * Validates and sanitizes a raw value into the canonical `RecentItem` shape.
 *
 * Items without a usable slug or title are rejected entirely. Optional fields are retained
 * only as trimmed strings, and slug/title lengths are capped to avoid persisting unbounded data.
 */
export const sanitizeRecentItem = (value: unknown): RecentItem | null => {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Partial<RecentItem>;
  const slug = normalizeRecentItemSlug(candidate.slug);
  const title = typeof candidate.title === "string" ? candidate.title.trim() : "";

  if (!slug || !title) {
    return null;
  }

  const updatedAt =
    typeof candidate.updatedAt === "string" && candidate.updatedAt.trim()
      ? candidate.updatedAt.trim()
      : "";
  const image =
    typeof candidate.image === "string" && candidate.image.trim()
      ? candidate.image.trim()
      : "";

  return {
    slug: slug.slice(0, MAX_SLUG_LENGTH),
    title: title.slice(0, MAX_TITLE_LENGTH),
    updatedAt,
    image,
  };
};

/**
 * Loads and sanitizes the recent-item list for a given storage key.
 *
 * Corrupt or unexpected storage payloads are treated as empty so caller code can remain simple.
 */
export const loadRecentItems = (storageKey: string): RecentItem[] => {
  if (!storageKey) {
    return [];
  }

  const items = safeLocalStorage.get<unknown[]>(storageKey, []);
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) => sanitizeRecentItem(item))
    .filter((item): item is RecentItem => item !== null);
};

/**
 * Sanitizes and persists a complete recent-item list.
 *
 * The returned array is the exact sanitized payload written to storage, which allows callers
 * to continue working with the canonical in-memory representation immediately.
 */
export const saveRecentItems = (storageKey: string, items: RecentItem[]): RecentItem[] => {
  if (!storageKey) {
    return items;
  }

  const sanitized = items
    .map((item) => sanitizeRecentItem(item))
    .filter((item): item is RecentItem => item !== null);

  safeLocalStorage.set(storageKey, sanitized);
  return sanitized;
};

/**
 * Inserts or refreshes a single recent item at the front of the stored list.
 *
 * Existing entries with the same normalized slug are removed first, so the newest view wins.
 * The list is then capped to `maxEntries` with a minimum effective size of `1`.
 */
export const upsertRecentItem = (
  storageKey: string,
  item: unknown,
  maxEntries = 5
): RecentItem[] => {
  const sanitizedItem = sanitizeRecentItem(item);
  if (!storageKey || !sanitizedItem) {
    return loadRecentItems(storageKey);
  }

  const existingItems = loadRecentItems(storageKey);
  const nextItems = [
    sanitizedItem,
    ...existingItems.filter((entry) => entry.slug !== sanitizedItem.slug),
  ].slice(0, Math.max(1, maxEntries));

  return saveRecentItems(storageKey, nextItems);
};
