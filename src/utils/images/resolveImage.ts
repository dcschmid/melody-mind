import type { ImageMetadata } from "astro";

type GlobImport = Record<string, { default: ImageMetadata }>;

const categoryImages = import.meta.glob<{ default: ImageMetadata }>(
  "../../assets/images/category/*.{jpg,jpeg,png,webp,avif}",
  { eager: true },
);

const mainCategoryImages = import.meta.glob<{ default: ImageMetadata }>(
  "../../assets/images/maincategories/*.{jpg,jpeg,png,webp,avif}",
  { eager: true },
);

const miscImages = import.meta.glob<{ default: ImageMetadata }>(
  "../../assets/images/misc/*.{jpg,jpeg,png,webp,avif}",
  { eager: true },
);

const imageMap = new Map<string, ImageMetadata>();

function toKey(fullPath: string): string {
  const normalized = fullPath.replace(/\\/g, "/");
  const marker = "/assets/images/";
  const idx = normalized.lastIndexOf(marker);
  const after = idx >= 0 ? normalized.slice(idx + marker.length) : normalized;
  const clean = after.replace(/^\/?/, "");
  return `/${clean}`;
}

function register(glob: GlobImport, extraKeys: (key: string) => string[] = () => []) {
  Object.entries(glob).forEach(([fullPath, mod]) => {
    const baseKey = toKey(fullPath);
    const keys = [baseKey, ...extraKeys(baseKey)];
    for (const key of keys) {
      if (!imageMap.has(key)) {
        imageMap.set(key, mod.default);
      }
    }
  });
}

register(categoryImages);
register(mainCategoryImages);
register(miscImages, (key) => {
  // Also allow lookup without the /misc prefix for convenience (e.g., /melody-mind.png)
  if (key.startsWith("/misc/")) {
    return [key.replace("/misc/", "/")];
  }
  return [];
});

function normalizeSrc(src: string): string {
  let normalized = src.trim();
  if (!normalized.startsWith("http")) {
    normalized = normalized.startsWith("/") ? normalized : `/${normalized}`;
    return normalized;
  }

  try {
    const url = new URL(normalized);
    return url.pathname || normalized;
  } catch {
    return normalized;
  }
}

export function resolveImageMetadata(src?: string | null): ImageMetadata | undefined {
  if (!src) return undefined;
  const key = normalizeSrc(src);
  return imageMap.get(key) || imageMap.get(key.toLowerCase());
}

export function buildOptimizedImageUrl(opts: {
  metadata?: ImageMetadata;
  fallbackSrc?: string;
  baseUrl?: string;
}): string | undefined {
  const { metadata, fallbackSrc, baseUrl } = opts;
  if (metadata) {
    return baseUrl ? new URL(metadata.src, baseUrl).toString() : metadata.src;
  }
  if (fallbackSrc) {
    return baseUrl ? new URL(fallbackSrc, baseUrl).toString() : fallbackSrc;
  }
  return undefined;
}
