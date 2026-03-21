import { safeLocalStorage } from "./safeStorage";

export interface RecentItem {
  slug: string;
  title: string;
  updatedAt?: string;
  image?: string;
}

const MAX_TITLE_LENGTH = 500;
const MAX_SLUG_LENGTH = 300;

export const normalizeRecentItemSlug = (value: unknown): string => {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().replace(/^\/+|\/+$/g, "");
};

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

export const upsertRecentItem = (
  storageKey: string,
  item: unknown,
  maxEntries = 5
): RecentItem[] => {
  const sanitizedItem = sanitizeRecentItem(item);
  if (!storageKey || !sanitizedItem) {
    return loadRecentItems(storageKey);
  }

  const nextItems = [
    sanitizedItem,
    ...loadRecentItems(storageKey).filter((entry) => entry.slug !== sanitizedItem.slug),
  ].slice(0, Math.max(1, maxEntries));

  return saveRecentItems(storageKey, nextItems);
};
