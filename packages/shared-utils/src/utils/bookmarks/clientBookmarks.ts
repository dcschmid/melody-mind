/**
 * Client-side bookmark persistence and import/export utilities.
 *
 * This module is the browser-side source of truth for Melody Mind bookmarks. It
 * handles:
 * - bookmark normalization and sanitization,
 * - legacy data migration,
 * - deduplication by article slug,
 * - localStorage persistence,
 * - bookmark lifecycle event dispatching,
 * - and JSON/Markdown import-export helpers.
 *
 * Data model assumptions:
 * - bookmarks are uniquely identified by `articleSlug` for dedupe purposes,
 * - a bookmark keeps the most recent `createdAt` entry when duplicates exist,
 * - and all public read/write helpers return already-sanitized bookmark arrays.
 */
import { STORAGE_KEYS } from "../../constants/storage";
import { BOOKMARK_EVENTS } from "../../constants/events";
import { safeLocalStorage } from "../storage/safeStorage";
import { loggers } from "../logging";
import { isServer, hasCryptoUUID } from "../environment";

/** Re-exported storage key for older consumers that still import it from here. */
export const BOOKMARK_STORAGE_KEY = STORAGE_KEYS.BOOKMARKS;
/** Re-exported change event name for backward compatibility. */
export const BOOKMARK_CHANGE_EVENT = BOOKMARK_EVENTS.CHANGED;
/** Re-exported undo-remove event name for backward compatibility. */
export const BOOKMARK_UNDO_REMOVE_EVENT = BOOKMARK_EVENTS.UNDO_REMOVE;
/** Maximum accepted bookmark import payload size, in bytes. */
export const BOOKMARK_IMPORT_MAX_BYTES = 1_500_000;

/** Maximum length for bookmark title */
const MAX_TITLE_LENGTH = 500;
/** Maximum length for bookmark slug */
const MAX_SLUG_LENGTH = 200;

/** Supported bookmark buckets exposed in the UI. */
export const BOOKMARK_CATEGORIES = ["to-read", "favorites", "research"] as const;

/** Union of all supported bookmark category ids. */
export type BookmarkCategory = (typeof BOOKMARK_CATEGORIES)[number];
/** Default category used when input is missing or invalid. */
export const DEFAULT_BOOKMARK_CATEGORY: BookmarkCategory = "to-read";
/** Human-readable labels for each supported bookmark category. */
export const BOOKMARK_CATEGORY_LABELS: Record<BookmarkCategory, string> = {
  "to-read": "To-Read",
  favorites: "Favorites",
  research: "Research",
};

/** Internal action vocabulary emitted with bookmark lifecycle change events. */
export const BOOKMARK_ACTIONS = {
  add: "add",
  remove: "remove",
  category: "category",
  import: "import",
  replace: "replace",
  sync: "sync",
} as const;

/** Union of all bookmark lifecycle actions emitted by this module. */
export type BookmarkAction = (typeof BOOKMARK_ACTIONS)[keyof typeof BOOKMARK_ACTIONS];

/** Human-readable analytics event names consumed by the analytics layer. */
export const BOOKMARK_ANALYTICS_EVENTS = {
  add: "Bookmark: add",
  remove: "Bookmark: remove",
  categoryChanged: "Bookmark: category changed",
} as const;

/** Persisted bookmark record stored in browser storage and returned to callers. */
export interface Bookmark {
  id: string;
  articleSlug: string;
  articleTitle: string;
  category: BookmarkCategory;
  createdAt: string;
}

/** Minimal caller input required to create or toggle a bookmark. */
export interface BookmarkInput {
  articleSlug: string;
  articleTitle: string;
  category?: BookmarkCategory;
}

/** Import behavior used when merging incoming bookmarks with existing ones. */
type ImportMode = "merge" | "replace";

/** Payload emitted with the shared bookmark change event. */
interface BookmarkChangeDetail {
  action: BookmarkAction;
  count: number;
  bookmark?: Bookmark;
}

/** Summary returned after an import operation completes. */
interface ImportResult {
  importedCount: number;
  totalCount: number;
  mode: ImportMode;
}

/**
 * Normalizes arbitrary bookmark slug input to the canonical article slug form.
 *
 * Accepted input may be:
 * - a bare slug like `from-jazz-to-neo-soul`,
 * - a prefixed path like `/knowledge/from-jazz-to-neo-soul`,
 * - or a full URL pointing at a knowledge article.
 */
export const normalizeBookmarkSlug = (value: unknown): string => {
  if (typeof value !== "string") {return "";}

  let slug = value.trim();
  if (!slug) {return "";}

  try {
    if (/^https?:\/\//i.test(slug)) {
      slug = new URL(slug).pathname || slug;
    }
  } catch {
    // ignore URL parse errors
  }

  slug = slug.replace(/^\/+|\/+$/g, "");
  if (slug.startsWith("knowledge/")) {
    slug = slug.slice("knowledge/".length);
  }

  return slug;
};

const isBookmarkCategory = (value: unknown): value is BookmarkCategory =>
  typeof value === "string" &&
  (BOOKMARK_CATEGORIES as readonly string[]).includes(value as BookmarkCategory);

/** Returns a valid ISO timestamp, defaulting to "now" when input is invalid. */
const normalizeDateIso = (value: unknown): string => {
  if (typeof value !== "string") {return new Date().toISOString();}
  const parsed = new Date(value);
  return Number.isNaN(parsed.valueOf()) ? new Date().toISOString() : parsed.toISOString();
};

/** Creates a bookmark id, preferring `crypto.randomUUID()` when available. */
const createBookmarkId = (slug: string): string => {
  if (hasCryptoUUID()) {
    return window.crypto.randomUUID();
  }
  return `${slug}-${Date.now()}`;
};

/** Emits the shared bookmark change event unless code is executing on the server. */
const dispatchChange = (detail: BookmarkChangeDetail): void => {
  if (isServer) {return;}
  window.dispatchEvent(
    new CustomEvent<BookmarkChangeDetail>(BOOKMARK_EVENTS.CHANGED, {
      detail,
    })
  );
};

/**
 * Sanitizes a raw unknown value into a valid bookmark record or `null`.
 *
 * The sanitizer enforces:
 * - valid slug shape and length,
 * - non-empty title,
 * - bounded title/id lengths,
 * - basic title cleanup against obvious script-like input,
 * - valid category fallback,
 * - and normalized ISO timestamps.
 */
const sanitizeBookmark = (item: unknown): Bookmark | null => {
  if (!item || typeof item !== "object") {return null;}

  const candidate = item as Partial<Bookmark>;

  // Validate and sanitize articleSlug
  const articleSlug = normalizeBookmarkSlug(candidate.articleSlug);
  if (!articleSlug || articleSlug.length > MAX_SLUG_LENGTH) {return null;}

  // Validate and sanitize articleTitle
  let articleTitle =
    typeof candidate.articleTitle === "string" ? candidate.articleTitle.trim() : "";
  if (!articleTitle) {return null;}

  // Truncate excessively long titles
  if (articleTitle.length > MAX_TITLE_LENGTH) {
    articleTitle = articleTitle.slice(0, MAX_TITLE_LENGTH);
  }

  // Remove potential XSS vectors from title (basic sanitization)
  // Note: We use textContent when rendering, but extra safety doesn't hurt
  articleTitle = articleTitle
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "");

  // Validate id
  const rawId =
    typeof candidate.id === "string" && candidate.id.trim()
      ? candidate.id.trim()
      : createBookmarkId(articleSlug);

  // Validate id length
  const id = rawId.length > 100 ? rawId.slice(0, 100) : rawId;

  return {
    id,
    articleSlug,
    articleTitle,
    category: isBookmarkCategory(candidate.category)
      ? candidate.category
      : DEFAULT_BOOKMARK_CATEGORY,
    createdAt: normalizeDateIso(candidate.createdAt),
  };
};

/** Convenience type guard for filtered sanitizer results. */
const isBookmark = (value: Bookmark | null): value is Bookmark => value !== null;

const toTimestamp = (value: string): number => {
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

/**
 * Deduplicates bookmarks by `articleSlug`, keeping the newest entry when duplicates
 * exist, then sorts newest-first.
 */
const dedupeBookmarks = (bookmarks: Bookmark[]): Bookmark[] => {
  const map = new Map<string, { bookmark: Bookmark; timestamp: number }>();
  bookmarks.forEach((bookmark) => {
    const timestamp = toTimestamp(bookmark.createdAt);
    const existing = map.get(bookmark.articleSlug);
    if (!existing) {
      map.set(bookmark.articleSlug, { bookmark, timestamp });
      return;
    }

    if (timestamp >= existing.timestamp) {
      map.set(bookmark.articleSlug, { bookmark, timestamp });
    }
  });

  return Array.from(map.values())
    .sort((a, b) => b.timestamp - a.timestamp)
    .map(({ bookmark }) => bookmark);
};

/**
 * Migrates legacy string-only bookmark arrays into the structured bookmark shape.
 *
 * Older storage formats stored only slugs. These are converted into full bookmark
 * objects with generated ids, default category, and a current timestamp.
 */
const fromLegacy = (items: string[]): Bookmark[] =>
  items
    .map((value) => normalizeBookmarkSlug(value))
    .filter(Boolean)
    .map((articleSlug) => ({
      id: createBookmarkId(articleSlug),
      articleSlug,
      articleTitle: articleSlug,
      category: DEFAULT_BOOKMARK_CATEGORY,
      createdAt: new Date().toISOString(),
    }));

/** Reads the raw bookmark storage payload and attempts to parse JSON from it. */
const readRaw = (): { raw: string | null; parsed: unknown } => {
  const raw = safeLocalStorage.getRaw(BOOKMARK_STORAGE_KEY);
  if (raw === null) {
    return { raw: null, parsed: [] };
  }

  try {
    return {
      raw,
      parsed: JSON.parse(raw),
    };
  } catch {
    loggers.bookmarks.warn("Failed to parse bookmarks from storage");
    return { raw: null, parsed: [] };
  }
};

/** Persists a bookmark array to browser storage and logs failures non-fatally. */
const writeRaw = (bookmarks: Bookmark[]): void => {
  const success = safeLocalStorage.set(BOOKMARK_STORAGE_KEY, bookmarks);
  if (!success) {
    loggers.bookmarks.warn("Failed to save bookmarks to storage");
  }
};

/**
 * Loads bookmarks from storage, sanitizes them, performs legacy migration when
 * necessary, and writes back normalized data if the stored payload was dirty.
 */
export const loadBookmarks = (): Bookmark[] => {
  const { raw, parsed } = readRaw();
  if (!Array.isArray(parsed)) {
    return [];
  }

  if (parsed.every((item) => typeof item === "string")) {
    const migrated = dedupeBookmarks(fromLegacy(parsed as string[]));
    const migratedRaw = JSON.stringify(migrated);
    if (raw !== migratedRaw) {
      writeRaw(migrated);
      dispatchChange({ action: BOOKMARK_ACTIONS.sync, count: migrated.length });
    }
    return migrated;
  }

  const sanitized = dedupeBookmarks(
    parsed.map((item) => sanitizeBookmark(item)).filter(isBookmark)
  );
  const sanitizedRaw = JSON.stringify(sanitized);
  if (raw !== sanitizedRaw) {
    writeRaw(sanitized);
  }
  return sanitized;
};

/**
 * Persists a caller-provided bookmark array after full sanitization and dedupe.
 *
 * This is the low-level "replace with normalized state" write path used by other
 * bookmark operations.
 */
export const saveBookmarks = (bookmarks: Bookmark[]): Bookmark[] => {
  const sanitized = dedupeBookmarks(
    bookmarks.map((item) => sanitizeBookmark(item)).filter(isBookmark)
  );
  writeRaw(sanitized);
  dispatchChange({ action: BOOKMARK_ACTIONS.sync, count: sanitized.length });
  return sanitized;
};

/** Returns the bookmark for a slug, or `null` if none exists. */
export const getBookmarkBySlug = (slug: string): Bookmark | null => {
  const normalizedSlug = normalizeBookmarkSlug(slug);
  if (!normalizedSlug) {return null;}
  return loadBookmarks().find((item) => item.articleSlug === normalizedSlug) || null;
};

/** Returns the current bookmark count after normalization. */
export const getBookmarkCount = (): number => loadBookmarks().length;

/**
 * Adds a bookmark when absent or removes it when already present.
 *
 * This is the primary UI-facing convenience helper for bookmark toggles.
 */
export const toggleBookmark = (input: BookmarkInput): Bookmark[] => {
  const articleSlug = normalizeBookmarkSlug(input.articleSlug);
  const articleTitle =
    typeof input.articleTitle === "string" ? input.articleTitle.trim() : "";
  if (!articleSlug || !articleTitle) {
    return loadBookmarks();
  }

  const current = loadBookmarks();
  const existing = current.find((bookmark) => bookmark.articleSlug === articleSlug);

  if (existing) {
    const next = current.filter((bookmark) => bookmark.articleSlug !== articleSlug);
    writeRaw(next);
    dispatchChange({
      action: BOOKMARK_ACTIONS.remove,
      count: next.length,
      bookmark: existing,
    });
    return next;
  }

  const created: Bookmark = {
    id: createBookmarkId(articleSlug),
    articleSlug,
    articleTitle,
    category: isBookmarkCategory(input.category)
      ? input.category
      : DEFAULT_BOOKMARK_CATEGORY,
    createdAt: new Date().toISOString(),
  };
  const next = dedupeBookmarks([created, ...current]);
  writeRaw(next);
  dispatchChange({ action: BOOKMARK_ACTIONS.add, count: next.length, bookmark: created });
  return next;
};

/** Removes a bookmark by slug if present. */
export const removeBookmark = (slug: string): Bookmark[] => {
  const normalizedSlug = normalizeBookmarkSlug(slug);
  if (!normalizedSlug) {return loadBookmarks();}
  const current = loadBookmarks();
  const existing = current.find((bookmark) => bookmark.articleSlug === normalizedSlug);
  if (!existing) {return current;}
  const next = current.filter((bookmark) => bookmark.articleSlug !== normalizedSlug);
  writeRaw(next);
  dispatchChange({
    action: BOOKMARK_ACTIONS.remove,
    count: next.length,
    bookmark: existing,
  });
  return next;
};

/** Updates the category of an existing bookmark and emits a category-change event. */
export const setBookmarkCategory = (
  slug: string,
  category: BookmarkCategory
): Bookmark[] => {
  const normalizedSlug = normalizeBookmarkSlug(slug);
  if (!normalizedSlug || !isBookmarkCategory(category)) {return loadBookmarks();}

  const current = loadBookmarks();
  const next = current.map((bookmark) =>
    bookmark.articleSlug === normalizedSlug ? { ...bookmark, category } : bookmark
  );
  const changed = next.find((bookmark) => bookmark.articleSlug === normalizedSlug);
  writeRaw(next);
  dispatchChange({
    action: BOOKMARK_ACTIONS.category,
    count: next.length,
    bookmark: changed,
  });
  return next;
};

/** Exports the full bookmark set as pretty-printed JSON. */
export const exportBookmarksAsJson = (): string =>
  JSON.stringify(loadBookmarks(), null, 2);

/** Exports the full bookmark set as a Markdown table for human-readable sharing. */
export const exportBookmarksAsMarkdown = (): string => {
  const lines = [
    "# Melody Mind Bookmarks",
    "",
    "| Category | Title | Slug | Saved At |",
    "| --- | --- | --- | --- |",
  ];

  loadBookmarks().forEach((bookmark) => {
    lines.push(
      `| ${bookmark.category} | ${bookmark.articleTitle.replace(/\|/g, "\\|")} | /knowledge/${bookmark.articleSlug} | ${bookmark.createdAt} |`
    );
  });

  return `${lines.join("\n")}\n`;
};

/**
 * Parses bookmark rows from the Markdown export format.
 *
 * The parser is intentionally tolerant: it skips malformed rows and falls back to
 * default categories where needed.
 */
const parseMarkdownBookmarks = (input: string): Bookmark[] => {
  const isMarkdownSeparatorRow = (line: string): boolean =>
    /^\|\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(line);

  const splitMarkdownRow = (line: string): string[] => {
    const cells: string[] = [];
    let current = "";

    for (let index = 0; index < line.length; index += 1) {
      const char = line[index];
      const previous = index > 0 ? line[index - 1] : "";

      if (char === "|" && previous !== "\\") {
        cells.push(current.trim());
        current = "";
        continue;
      }

      current += char;
    }
    cells.push(current.trim());

    const normalized = cells.filter((_, index) => {
      if (index === 0 && !cells[index]) {return false;}
      if (index === cells.length - 1 && !cells[index]) {return false;}
      return true;
    });

    return normalized;
  };

  const rows = input
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => line.startsWith("|") && !isMarkdownSeparatorRow(line));

  const parsed: Bookmark[] = [];
  rows.forEach((line) => {
    const cells = splitMarkdownRow(line);

    if (cells.length < 4) {return;}
    if (cells[0].toLowerCase() === "category") {return;}

    const category = isBookmarkCategory(cells[0]) ? cells[0] : DEFAULT_BOOKMARK_CATEGORY;
    const articleTitle = (cells[1] || "Untitled").replace(/\\\|/g, "|");
    const articleSlug = normalizeBookmarkSlug(cells[2] || "");
    const createdAt = normalizeDateIso(cells[3]);

    if (!articleSlug) {return;}

    parsed.push({
      id: createBookmarkId(articleSlug),
      articleSlug,
      articleTitle,
      category,
      createdAt,
    });
  });

  return dedupeBookmarks(parsed);
};

/**
 * Parses an import payload, trying JSON first and Markdown second.
 *
 * Unsupported or empty input resolves to an empty bookmark list.
 */
const parseImport = (input: string): Bookmark[] => {
  const normalized = input.trim();
  if (!normalized) {return [];}

  try {
    const parsed = JSON.parse(normalized);
    if (Array.isArray(parsed)) {
      return dedupeBookmarks(
        parsed.map((item) => sanitizeBookmark(item)).filter(isBookmark)
      );
    }
  } catch {
    return parseMarkdownBookmarks(normalized);
  }

  return [];
};

/**
 * Imports bookmarks from a JSON or Markdown payload using merge or replace mode.
 *
 * - `merge` keeps existing bookmarks and overlays imported ones.
 * - `replace` swaps the bookmark set entirely, unless the imported payload is empty.
 */
export const importBookmarks = (input: string, mode: ImportMode): ImportResult => {
  const imported = parseImport(input);
  const current = loadBookmarks();

  if (mode === "replace" && imported.length === 0) {
    return {
      importedCount: 0,
      totalCount: current.length,
      mode,
    };
  }

  const next =
    mode === "replace"
      ? dedupeBookmarks(imported)
      : dedupeBookmarks([...imported, ...current]);

  writeRaw(next);
  dispatchChange({
    action: mode === "replace" ? BOOKMARK_ACTIONS.replace : BOOKMARK_ACTIONS.import,
    count: next.length,
  });

  return {
    importedCount: imported.length,
    totalCount: next.length,
    mode,
  };
};
