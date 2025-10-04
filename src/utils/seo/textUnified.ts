/**
 * Unified SEO Text Utilities
 * (Post‑deprecation version – legacy helpers `seoText.ts` & `metaUtils.ts` removed.)
 * Provides a single facade for building meta description + keyword list.
 *
 * Internalized replacements:
 *  - generateMetaDescription (lightweight sentence / length heuristic)
 *  - truncateMeta (inline logic)
 *  - extractKeywordsFallback (frequency fallback) & buildKeywordsString (unique join)
 */
import { extractKeywords } from "../seo";

export interface BuildSeoTextParams {
  title?: string;
  descriptionBase: string;
  enrichedParts?: string[]; // additional content pieces to feed into description/keywords
  maxDescription?: number; // override length
  language?: string;
  keywordLimit?: number;
  fallbackKeywords?: string[]; // static fallback keywords to merge
  combineStrategy?: "truncate-first" | "generate-first"; // control order of operations
  /** Optional sanitize hook to clean raw text (HTML stripping, whitespace collapse) */
  sanitizeFn?: (raw: string) => string;
}

export interface SeoTextResult {
  description: string;
  keywords: string;
  keywordArray: string[];
  enrichedContent: string; // final concatenated content fed to extractors
}

/**
 * Produce a description + keywords from unified parameters.
 * Strategy: Build enriched content, generate description (preferring generateMetaDescription),
 * fallback to truncate if needed, then keyword extraction with fallback extractor.
 */
// --- Internal helpers (formerly from deprecated files) --------------------

function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, " ");
}

function normalizeWhitespace(input: string): string {
  return input.replace(/\s+/g, " ").trim();
}

function truncateSmart(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  const slice = text.slice(0, maxLength);
  // Try end-of-sentence within last 25% of slice
  const windowStart = Math.floor(maxLength * 0.75);
  const periodIndex = slice.lastIndexOf(".", maxLength - 1);
  if (periodIndex >= windowStart) {
    return slice.slice(0, periodIndex + 1).trim();
  }
  const lastSpace = slice.lastIndexOf(" ");
  if (lastSpace > maxLength * 0.5) {
    return `${slice.slice(0, lastSpace).trimEnd()}...`;
  }
  return `${slice.trimEnd()}...`;
}

function internalGenerateMetaDescription(content: string, maxLength: number): string {
  const base = normalizeWhitespace(stripHtml(content));
  if (base.length <= maxLength) {
    return base;
  }
  return truncateSmart(base, maxLength);
}

function extractKeywordsFallbackInternal(
  content: string,
  limit: number,
  language: string
): string[] {
  if (!content) {
    return [];
  }
  const stop = new Set([
    "the",
    "and",
    "der",
    "die",
    "das",
    "und",
    "ein",
    "eine",
    "for",
    "with",
    "this",
    "that",
    "are",
    "was",
    "were",
    "from",
    "oder",
    "ist",
    "sind",
  ]);
  const words = normalizeWhitespace(stripHtml(content))
    .toLowerCase()
    .replace(/[^a-z0-9äöüßàáâãåèéêëìíîïñóôõöùúûüç\s]/gi, " ")
    .split(" ")
    .filter((w) => w.length > 3 && !stop.has(w));
  const freq: Record<string, number> = {};
  for (const w of words) {
    freq[w] = (freq[w] || 0) + 1;
  }
  const sorted = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([w]) => w);
  if (language && !sorted.includes(language.toLowerCase())) {
    sorted.push(language.toLowerCase());
  }
  return sorted;
}

function joinKeywordsUnique(primary: string[], extra: string[]): string {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const k of [...primary, ...extra]) {
    const t = k.trim();
    if (!t) {
      continue;
    }
    const low = t.toLowerCase();
    if (seen.has(low)) {
      continue;
    }
    seen.add(low);
    out.push(t);
  }
  return out.join(", ");
}

function buildDescription(
  enrichedContent: string,
  strategy: "truncate-first" | "generate-first",
  maxLength: number
): string {
  const threshold = Math.min(40, maxLength / 2);
  const gen = (): string => internalGenerateMetaDescription(enrichedContent, maxLength);
  const trunc = (): string =>
    truncateSmart(normalizeWhitespace(stripHtml(enrichedContent)), maxLength);
  if (strategy === "generate-first") {
    let d = gen();
    if (!d || d.length < threshold) {
      d = trunc();
    }
    return d;
  }
  let d = trunc();
  if (!d || d.length < threshold) {
    d = gen();
  }
  return d;
}

function splitKeywords(raw: string): string[] {
  return raw
    .split(",")
    .map((k: string) => k.trim())
    .filter((k) => k.length > 0);
}

function mergeUnique(base: string[], extra: string[]): string[] {
  const seen = new Set(base.map((k) => k.toLowerCase()));
  for (const e of extra) {
    const low = e.toLowerCase();
    if (!seen.has(low)) {
      base.push(e);
      seen.add(low);
    }
  }
  return base;
}

/**
 * High-level convenience wrapper building description + keywords consistently.
 */
export function buildSeoText(params: BuildSeoTextParams): SeoTextResult {
  const {
    title,
    descriptionBase,
    enrichedParts = [],
    maxDescription = 160,
    language = "en",
    keywordLimit = 12,
    fallbackKeywords = [],
    combineStrategy = "generate-first",
    sanitizeFn,
  } = params;
  const rawCombined = [title, descriptionBase, ...enrichedParts].filter(Boolean).join(" ").trim();
  const enrichedContent = sanitizeFn ? sanitizeFn(rawCombined) : rawCombined;

  const description = buildDescription(enrichedContent, combineStrategy, maxDescription);

  const primaryKw = splitKeywords(extractKeywords(enrichedContent, keywordLimit, language));
  let keywordsArr = primaryKw;

  if (keywordsArr.length < Math.max(5, Math.floor(keywordLimit / 2))) {
    const fallbackList = extractKeywordsFallbackInternal(
      enrichedContent,
      keywordLimit,
      language
    ) as string[];
    keywordsArr = mergeUnique([...keywordsArr], fallbackList);
  }

  keywordsArr = mergeUnique([...keywordsArr], fallbackKeywords);
  const keywords = joinKeywordsUnique(keywordsArr, []);
  return { description, keywords, keywordArray: keywordsArr, enrichedContent };
}

export default buildSeoText;
