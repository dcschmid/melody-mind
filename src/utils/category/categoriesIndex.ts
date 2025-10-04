/**
 * categoriesIndex.ts (Simplified Lazy Loader)
 *
 * Single-responsibility module to lazily load category JSON per language.
 * - No Proxy export, no ENV language filtering (can be re-added if needed later)
 * - Unified public API: getCategories(lang), getCategory(lang, slug)
 * - Internal cache avoids duplicate loads
 * - Consistent fallback to FALLBACK_LANGUAGE
 *
 * Language Source: Pages should derive the language from the dynamic route param (e.g. Astro.params.lang).
 * Avoid client-side guessing – this keeps logic deterministic and reduces code.
 */

import type { Category } from "../../types/category";

const FALLBACK_LANGUAGE = "en"; // canonical source

// Glob pattern (lazy) – each file becomes its own chunk only when needed.
const categoryLoaders = import.meta.glob<{ default: Category[] }>("../../json/*_categories.json", {
  eager: false,
});

// In-memory cache per language code
const cache: Record<string, Category[] | undefined> = {};

// Extract language code from path `.../de_categories.json` → `de`
function extractLangFromPath(path: string): string | null {
  const m = path.match(/\/([a-z]{2})_categories\.json$/i);
  return m ? m[1].toLowerCase() : null;
}

// All languages physically present
export const availableLanguages: string[] = Object.keys(categoryLoaders)
  .map(extractLangFromPath)
  .filter((v): v is string => Boolean(v));

async function loadLanguage(lang: string): Promise<Category[]> {
  const key = lang.toLowerCase();
  if (cache[key]) {
    return cache[key]!;
  }
  const entry = Object.entries(categoryLoaders).find(([p]) => extractLangFromPath(p) === key);
  if (!entry) {
    cache[key] = [];
    return cache[key]!;
  }
  try {
    const [, loader] = entry;
    const mod = await loader();
    const data = (mod as unknown as { default: unknown }).default;
    cache[key] = Array.isArray(data) ? (data as Category[]) : [];
  } catch (err) {
    console.warn(`[categoriesIndex] failed to load '${key}':`, err);
    cache[key] = [];
  }
  return cache[key]!;
}

/**
 * Load all categories for a language (with fallback if empty & language != fallback)
 */
export async function getCategories(lang: string): Promise<Category[]> {
  const primary = await loadLanguage(lang);
  if (primary.length > 0 || lang.toLowerCase() === FALLBACK_LANGUAGE) {
    return primary;
  }
  return loadLanguage(FALLBACK_LANGUAGE);
}

/**
 * Load single category by slug with fallback
 */
export async function getCategory(lang: string, slug: string): Promise<Category | null> {
  if (!slug) {
    return null;
  }
  const list = await getCategories(lang);
  const found = list.find((c) => c.slug === slug);
  if (found) {
    return found;
  }
  if (lang.toLowerCase() !== FALLBACK_LANGUAGE) {
    const fb = await loadLanguage(FALLBACK_LANGUAGE);
    return fb.find((c) => c.slug === slug) || null;
  }
  return null;
}

/**
 * Debug helper (non-critical). Not exported by default to keep API tiny –
 * re-export if needed later.
 */
export function __getLoadedCacheSnapshot(): Record<string, number> {
  const o: Record<string, number> = {};
  for (const k of Object.keys(cache)) {
    o[k] = cache[k]?.length || 0;
  }
  return o;
}

export default { getCategories, getCategory, availableLanguages };
