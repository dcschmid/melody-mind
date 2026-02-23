import { STORAGE_KEYS } from "@constants/storage";
import { BOOKMARK_EVENTS } from "@constants/events";
import { safeLocalStorage } from "@utils/storage/safeStorage";
import { loggers } from "@utils/logging";
import { isServer, hasCryptoUUID } from "@utils/environment";

// Re-export for backward compatibility with components using inline scripts
export const BOOKMARK_STORAGE_KEY = STORAGE_KEYS.BOOKMARKS;
// Re-export event names for backward compatibility
export const BOOKMARK_CHANGE_EVENT = BOOKMARK_EVENTS.CHANGED;
export const BOOKMARK_UNDO_REMOVE_EVENT = BOOKMARK_EVENTS.UNDO_REMOVE;
export const BOOKMARK_IMPORT_MAX_BYTES = 1_500_000;

/** Maximum length for bookmark title */
const MAX_TITLE_LENGTH = 500;
/** Maximum length for bookmark slug */
const MAX_SLUG_LENGTH = 200;

export const BOOKMARK_CATEGORIES = ["to-read", "favorites", "research"] as const;

export type BookmarkCategory = (typeof BOOKMARK_CATEGORIES)[number];
export const DEFAULT_BOOKMARK_CATEGORY: BookmarkCategory = "to-read";
export const BOOKMARK_CATEGORY_LABELS: Record<BookmarkCategory, string> = {
  "to-read": "To-Read",
  favorites: "Favorites",
  research: "Research",
};
export const BOOKMARK_ACTIONS = {
  add: "add",
  remove: "remove",
  category: "category",
  import: "import",
  replace: "replace",
  sync: "sync",
} as const;
export type BookmarkAction = (typeof BOOKMARK_ACTIONS)[keyof typeof BOOKMARK_ACTIONS];
export const BOOKMARK_ANALYTICS_EVENTS = {
  add: "Bookmark: add",
  remove: "Bookmark: remove",
  categoryChanged: "Bookmark: category changed",
} as const;

export interface Bookmark {
  id: string;
  articleSlug: string;
  articleTitle: string;
  category: BookmarkCategory;
  createdAt: string;
}

export interface BookmarkInput {
  articleSlug: string;
  articleTitle: string;
  category?: BookmarkCategory;
}

type ImportMode = "merge" | "replace";

interface BookmarkChangeDetail {
  action: BookmarkAction;
  count: number;
  bookmark?: Bookmark;
}

interface ImportResult {
  importedCount: number;
  totalCount: number;
  mode: ImportMode;
}

export const normalizeBookmarkSlug = (value: unknown): string => {
  if (typeof value !== "string") return "";

  let slug = value.trim();
  if (!slug) return "";

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

const normalizeDateIso = (value: unknown): string => {
  if (typeof value !== "string") return new Date().toISOString();
  const parsed = new Date(value);
  return Number.isNaN(parsed.valueOf()) ? new Date().toISOString() : parsed.toISOString();
};

const createBookmarkId = (slug: string): string => {
  if (hasCryptoUUID()) {
    return window.crypto.randomUUID();
  }
  return `${slug}-${Date.now()}`;
};

const dispatchChange = (detail: BookmarkChangeDetail): void => {
  if (isServer) return;
  window.dispatchEvent(
    new CustomEvent<BookmarkChangeDetail>(BOOKMARK_EVENTS.CHANGED, {
      detail,
    })
  );
};

const sanitizeBookmark = (item: unknown): Bookmark | null => {
  if (!item || typeof item !== "object") return null;

  const candidate = item as Partial<Bookmark>;

  // Validate and sanitize articleSlug
  const articleSlug = normalizeBookmarkSlug(candidate.articleSlug);
  if (!articleSlug || articleSlug.length > MAX_SLUG_LENGTH) return null;

  // Validate and sanitize articleTitle
  let articleTitle =
    typeof candidate.articleTitle === "string" ? candidate.articleTitle.trim() : "";
  if (!articleTitle) return null;

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

const isBookmark = (value: Bookmark | null): value is Bookmark => value !== null;

const dedupeBookmarks = (bookmarks: Bookmark[]): Bookmark[] => {
  const map = new Map<string, Bookmark>();
  bookmarks.forEach((bookmark) => {
    const existing = map.get(bookmark.articleSlug);
    if (!existing) {
      map.set(bookmark.articleSlug, bookmark);
      return;
    }

    const existingDate = new Date(existing.createdAt).valueOf();
    const nextDate = new Date(bookmark.createdAt).valueOf();
    if (nextDate >= existingDate) {
      map.set(bookmark.articleSlug, bookmark);
    }
  });

  return Array.from(map.values()).sort(
    (a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf()
  );
};

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

const writeRaw = (bookmarks: Bookmark[]): void => {
  const success = safeLocalStorage.set(BOOKMARK_STORAGE_KEY, bookmarks);
  if (!success) {
    loggers.bookmarks.warn("Failed to save bookmarks to storage");
  }
};

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

export const saveBookmarks = (bookmarks: Bookmark[]): Bookmark[] => {
  const sanitized = dedupeBookmarks(
    bookmarks.map((item) => sanitizeBookmark(item)).filter(isBookmark)
  );
  writeRaw(sanitized);
  dispatchChange({ action: BOOKMARK_ACTIONS.sync, count: sanitized.length });
  return sanitized;
};

export const getBookmarkBySlug = (slug: string): Bookmark | null => {
  const normalizedSlug = normalizeBookmarkSlug(slug);
  if (!normalizedSlug) return null;
  return loadBookmarks().find((item) => item.articleSlug === normalizedSlug) || null;
};

export const getBookmarkCount = (): number => loadBookmarks().length;

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

export const removeBookmark = (slug: string): Bookmark[] => {
  const normalizedSlug = normalizeBookmarkSlug(slug);
  if (!normalizedSlug) return loadBookmarks();
  const current = loadBookmarks();
  const existing = current.find((bookmark) => bookmark.articleSlug === normalizedSlug);
  if (!existing) return current;
  const next = current.filter((bookmark) => bookmark.articleSlug !== normalizedSlug);
  writeRaw(next);
  dispatchChange({
    action: BOOKMARK_ACTIONS.remove,
    count: next.length,
    bookmark: existing,
  });
  return next;
};

export const setBookmarkCategory = (
  slug: string,
  category: BookmarkCategory
): Bookmark[] => {
  const normalizedSlug = normalizeBookmarkSlug(slug);
  if (!normalizedSlug || !isBookmarkCategory(category)) return loadBookmarks();

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

export const exportBookmarksAsJson = (): string =>
  JSON.stringify(loadBookmarks(), null, 2);

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
      if (index === 0 && !cells[index]) return false;
      if (index === cells.length - 1 && !cells[index]) return false;
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

    if (cells.length < 4) return;
    if (cells[0].toLowerCase() === "category") return;

    const category = isBookmarkCategory(cells[0]) ? cells[0] : DEFAULT_BOOKMARK_CATEGORY;
    const articleTitle = (cells[1] || "Untitled").replace(/\\\|/g, "|");
    const articleSlug = normalizeBookmarkSlug(cells[2] || "");
    const createdAt = normalizeDateIso(cells[3]);

    if (!articleSlug) return;

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

const parseImport = (input: string): Bookmark[] => {
  const normalized = input.trim();
  if (!normalized) return [];

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
