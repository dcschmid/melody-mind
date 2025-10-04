/**
 * RSS Feed Image Extraction Utilities
 * -----------------------------------
 * Provides helper functions to extract a representative image URL from a generic
 * RSS/Atom feed item object. The logic consolidates scattered heuristics into a
 * single, testable module so pages (e.g. news) do not re-implement similar code.
 *
 * The extraction strategy:
 * 1. Direct item fields (imageUrl, itunes:image, enclosure.url, media:thumbnail, etc.)
 * 2. Generic fallbacks (image, thumbnail)
 * 3. Parse first <img> (data-src / srcset / src) within `content` or `description`
 * 4. Optional media object fields
 * 5. Fallback asset
 *
 * URL Normalisation:
 *  - protocol-relative (//example.com/img.jpg) => https:
 *  - root-relative (/img.jpg) => baseUrl + path
 *  - already absolute => unchanged
 *  - everything else returned as-is (caller may decide further sanitation)
 *
 * All functions are pure; no DOM APIs. Suitable for server/runtime execution.
 */

// Minimal flexible shape of an RSS item allowing unknown vendor-specific keys.
// We intentionally keep it loose while still documenting salient properties.
export interface RssItem {
  title?: string;
  description?: string;
  content?: string;
  link?: string;
  pubDate?: string;
  source?: string;
  imageUrl?: string;
  image?: string;
  thumbnail?: string;
  enclosure?: { url?: string; [k: string]: unknown } | null;
  media?: { url?: string; [k: string]: unknown } | null;
  [key: string]: unknown; // accommodate namespaced or vendor fields (e.g. 'media:content')
}

export interface GetImageOptions {
  /** Base absolute site URL (no trailing slash enforced internally). */
  baseUrl: string;
  /** Fallback path or full URL to use when no candidate found. Default: '/images/news-fallback.svg' */
  fallbackPath?: string;
}

/** Normalize a possibly relative or protocol-relative URL to absolute form. */
export function normalizeToAbsolute(raw: unknown, baseUrl: string): string | null {
  if (!raw && raw !== 0) {
    return null;
  }
  const url = String(raw).trim();
  if (!url) {
    return null;
  }
  if (url.startsWith("//")) {
    return `https:${url}`;
  }
  if (url.startsWith("/")) {
    return `${baseUrl.replace(/\/$/, "")}${url}`;
  }
  if (/^https?:\/\//i.test(url)) {
    return url;
  }
  return url; // treat as already usable (could be data URI or relative kept intentionally)
}

/** Attempt to resolve a media object or value into a single URL candidate. */
type MediaLike =
  | string
  | { url?: string; [k: string]: unknown }
  | Array<MediaLike>
  | { "@url"?: string; $?: { url?: string } }
  | null
  | undefined;

function tryMedia(media: MediaLike): string | null {
  if (!media) {
    return null;
  }
  if (typeof media === "string") {
    return media;
  }
  if (Array.isArray(media) && media.length) {
    return tryMedia(media[0]);
  }
  if ((media as { url?: string }).url) {
    return (media as { url?: string }).url || null;
  }
  if ((media as { "@url"?: string })["@url"]) {
    return (media as { "@url"?: string })["@url"] || null;
  }
  const mediaObj = media as { $?: { url?: string } } | undefined;
  if (mediaObj?.$?.url) {
    return mediaObj.$.url || null;
  }
  return null;
}

/** Collect direct field-based image URL candidates from an item. */
function pushIf<T>(arr: T[], value: T | null | undefined): void {
  if (value !== null && value !== undefined && value !== ("" as unknown)) {
    arr.push(value);
  }
}

function collectItunesImage(item: RssItem, out: string[]): void {
  const raw = item["itunes:image"] as unknown;
  if (!raw) {
    return;
  }
  if (typeof raw === "string") {
    pushIf(out, raw);
    return;
  }
  const ref1 = raw as { href?: string };
  if (ref1.href) {
    pushIf(out, ref1.href);
    return;
  }
  const ref2 = raw as { url?: string };
  if (ref2.url) {
    pushIf(out, ref2.url);
  }
}

function collectMedia(item: RssItem, out: string[]): void {
  const mediaThumb = tryMedia(
    (item as Record<string, MediaLike>)["media:thumbnail"] ||
      (item as Record<string, MediaLike>)["media:thumbnailUrl"] ||
      (item as Record<string, MediaLike>).thumbnail
  );
  if (mediaThumb) {
    pushIf(out, mediaThumb);
  }
  const mediaContent = tryMedia(
    (item as Record<string, MediaLike>)["media:content"] ||
      (item as Record<string, MediaLike>)["media:contentUrl"] ||
      (item as Record<string, MediaLike>).media
  );
  if (mediaContent) {
    pushIf(out, mediaContent);
  }
}

function collectDirectCandidates(item: RssItem): string[] {
  const out: string[] = [];
  if (!item) {
    return out;
  }
  pushIf(out, item.imageUrl ? String(item.imageUrl) : null);
  collectItunesImage(item, out);
  if (item.enclosure?.url) {
    pushIf(out, item.enclosure.url);
  }
  collectMedia(item, out);
  pushIf(out, item.image ? String(item.image) : null);
  pushIf(out, item.thumbnail ? String(item.thumbnail) : null);
  return out;
}

/** Parse HTML inside content/description to extract first <img> data-src/srcset/src usage. */
function collectHtmlEmbedded(item: RssItem): string[] {
  const html = (item.content || item.description || "") as string;
  const out: string[] = [];
  if (!html) {
    return out;
  }
  try {
    const dataSrc = html.match(/<img[^>]+data-src=["']([^"']+)["']/i);
    if (dataSrc?.[1]) {
      out.push(dataSrc[1]);
    }
    const srcset = html.match(/<img[^>]+srcset=["']([^"']+)["']/i);
    if (srcset?.[1]) {
      const first = srcset[1].split(",")[0].trim().split(" ")[0];
      if (first) {
        out.push(first);
      }
    }
    const src = html.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (src?.[1]) {
      out.push(src[1]);
    }
  } catch {
    // ignore parsing errors; keep robust
  }
  return out;
}

/** Aggregate all potential candidate strings (raw, not yet normalized). */
function gatherCandidates(item: RssItem): string[] {
  return [...collectDirectCandidates(item), ...collectHtmlEmbedded(item)];
}

/**
 * Returns the best-effort image URL for a given RSS item.
 * Falls back to provided or default fallback path when no candidate works.
 */
export function getImageForRssItem(
  item: RssItem | null | undefined,
  options: GetImageOptions
): string {
  const { baseUrl, fallbackPath = "/images/news-fallback.svg" } = options;
  const fallback = normalizeToAbsolute(fallbackPath, baseUrl) || fallbackPath;
  if (!item) {
    return fallback;
  }

  const candidates = gatherCandidates(item);
  for (const c of candidates) {
    if (!c) {
      continue;
    }
    const abs = normalizeToAbsolute(c, baseUrl);
    if (abs) {
      return abs;
    }
  }

  // Final explicit media fallback
  if (item.media && (item.media as { url?: string }).url) {
    const abs = normalizeToAbsolute((item.media as { url?: string }).url, baseUrl);
    if (abs) {
      return abs;
    }
  }
  return fallback;
}

/** Convenience bulk-mapper that enriches items with derived display image + date info. */
export function mapItemsWithDisplayData<T extends RssItem>(
  items: T[] | undefined,
  lang: string,
  options: GetImageOptions
): Array<T & { displayImage: string; displayDate: Date | null; displayDateString: string }> {
  return (items || []).map((it) => {
    const displayImage = getImageForRssItem(it, options);
    const displayDate = it.pubDate ? new Date(it.pubDate) : null;
    const displayDateString = displayDate ? displayDate.toLocaleDateString(lang) : "";
    return { ...it, displayImage, displayDate, displayDateString };
  });
}

// End of module
export default getImageForRssItem;
