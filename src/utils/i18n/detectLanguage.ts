/**
 * Runtime language detection utility.
 *
 * Determines the current two-letter language code (e.g. 'en', 'de', 'es') based on:
 * 1. Explicit parameter (preferred if provided)
 * 2. URL path prefix (/en/..., /de/..., etc.)
 * 3. <html lang="..."> attribute (reduced to primary subtag)
 * 4. Browser navigator.language
 * 5. Fallback 'en'
 *
 * This stays entirely on the client. For server-side (Astro) you generally already
 * have `Astro.params.lang` and can pass it through to the client.
 */
export interface DetectLanguageOptions {
  /** optional explicit override (e.g. from server param) */
  preferred?: string;
  /** limit detection to these languages (if empty => allow any) */
  allowed?: string[];
  /** fallback language (default 'en') */
  fallback?: string;
}

/** Normalizes a candidate language value to a clean two-letter lowercase code, or null. */
function normalize(code: unknown): string | null {
  if (!code || typeof code !== "string") {
    return null;
  }
  const primary = code.trim().toLowerCase().split(/[-_]/)[0];
  return /^[a-z]{2}$/.test(primary) ? primary : null;
}

// Central fallback import to avoid scattering literal 'en'.
import { FALLBACK_LANGUAGE } from "@constants/i18n";

/**
 * Returns the current document <html lang> normalized to a supported primary subtag
 * or the canonical FALLBACK_LANGUAGE when unavailable. Safe for SSR (returns fallback).
 */
export function getDocumentLanguage(): string {
  if (typeof document === "undefined") {
    return FALLBACK_LANGUAGE;
  }
  const lang = document.documentElement?.lang;
  const primary = normalize(lang);
  return primary || FALLBACK_LANGUAGE;
}

/**
 * Detect current language at runtime.
 */
export function detectRuntimeLanguage(options: DetectLanguageOptions = {}): string {
  const fallback = normalize(options.fallback) || "en";
  const allowed = (options.allowed || []).map(normalize).filter(Boolean) as string[];

  const tryList: Array<string | null> = [];

  // 1. explicit preferred
  if (options.preferred) {
    tryList.push(normalize(options.preferred));
  }

  // 2. URL path prefix
  if (typeof window !== "undefined") {
    const seg = window.location.pathname.split("/")[1];
    tryList.push(normalize(seg));
  }

  // 3. <html lang>
  if (typeof document !== "undefined") {
    tryList.push(normalize(document.documentElement.lang));
  }

  // 4. navigator.language
  if (typeof navigator !== "undefined") {
    tryList.push(normalize(navigator.language));
  }

  // Evaluate
  for (const cand of tryList) {
    if (!cand) {
      continue;
    }
    if (allowed.length > 0 && !allowed.includes(cand)) {
      continue;
    }
    return cand;
  }

  return allowed.length > 0 ? allowed[0]! : fallback;
}

/**
 * Convenience helper: ensure categories are loaded for the detected language and return it.
 * (Lazy import to avoid direct coupling here.)
 */
export async function prepareCategoriesForDetectedLanguage(
  options: DetectLanguageOptions = {}
): Promise<{ lang: string }> {
  const lang = detectRuntimeLanguage(options);
  // Dynamic import to keep this utility generic and tree-shake friendly
  // Import categories index for side-effectful lazy loader priming (optional)
  try {
    const mod = await import("../category/categoriesIndex");
    // Force load language categories to warm cache (non-fatal if it fails)
    if (mod.getCategories) {
      void mod.getCategories(lang);
    }
  } catch {
    // ignore loading errors – caller only needs the language string
  }
  return { lang };
}
