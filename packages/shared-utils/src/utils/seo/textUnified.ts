/**
 * Unified SEO text builder for meta descriptions and keyword lists.
 *
 * This module is the single façade for turning page copy into:
 * - a meta-description-sized summary
 * - an ordered keyword array
 * - a comma-separated keyword string for tag output
 *
 * The implementation is intentionally heuristic rather than editorially perfect. It aims
 * for stable, reusable defaults that work across content pages, indexes and programmatic SEO.
 */

/**
 * Language-specific stop words for keyword extraction.
 */
const STOP_WORDS_BY_LANGUAGE: Record<string, string[]> = {
  en: [
    "and",
    "or",
    "but",
    "the",
    "a",
    "an",
    "in",
    "with",
    "for",
    "of",
    "to",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "being",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "will",
    "would",
    "shall",
    "should",
    "can",
    "could",
    "may",
    "might",
    "must",
    "that",
    "this",
    "these",
    "those",
    "they",
    "them",
    "their",
    "there",
    "here",
    "where",
    "when",
    "why",
    "how",
    "which",
    "who",
    "whom",
  ],
  de: [
    "und",
    "oder",
    "aber",
    "der",
    "die",
    "das",
    "ein",
    "eine",
    "in",
    "mit",
    "für",
    "von",
    "zu",
    "ist",
    "sind",
    "war",
    "waren",
    "sein",
    "gewesen",
    "haben",
    "hat",
    "hatte",
    "hatten",
    "werden",
    "wird",
    "wurde",
    "wurden",
    "kann",
    "können",
    "könnte",
    "könnten",
    "muss",
    "müssen",
    "dass",
    "dieser",
    "diese",
    "dieses",
    "jene",
    "jenes",
    "sie",
    "ihr",
    "ihre",
    "dort",
    "hier",
    "wo",
    "wann",
    "warum",
    "wie",
    "welche",
    "welcher",
    "welches",
    "wer",
    "wen",
    "wem",
  ],
  es: [
    "y",
    "o",
    "pero",
    "el",
    "la",
    "los",
    "las",
    "un",
    "una",
    "unos",
    "unas",
    "en",
    "con",
    "para",
    "de",
    "a",
    "es",
    "son",
    "era",
    "eran",
    "ser",
    "sido",
    "estar",
    "tener",
    "tiene",
    "tenía",
    "tenían",
    "hacer",
    "hace",
    "hizo",
    "hicieron",
    "este",
    "esta",
    "estos",
    "estas",
    "ese",
    "esa",
    "esos",
    "esas",
    "ellos",
    "ellas",
    "su",
    "sus",
    "allí",
    "aquí",
    "donde",
    "cuando",
    "por qué",
    "cómo",
    "cuál",
    "cuáles",
    "quién",
    "quiénes",
  ],
  fr: [
    "et",
    "ou",
    "mais",
    "le",
    "la",
    "les",
    "un",
    "une",
    "des",
    "en",
    "avec",
    "pour",
    "de",
    "à",
    "est",
    "sont",
    "était",
    "étaient",
    "être",
    "été",
    "avoir",
    "a",
    "avait",
    "avaient",
    "faire",
    "fait",
    "ce",
    "cette",
    "ces",
    "celui",
    "celle",
    "ceux",
    "celles",
    "ils",
    "elles",
    "leur",
    "leurs",
    "là",
    "ici",
    "où",
    "quand",
    "pourquoi",
    "comment",
    "quel",
    "quelle",
    "quels",
    "quelles",
    "qui",
  ],
};

/**
 * Extracts SEO-style keywords from raw content as a comma-separated string.
 *
 * Lightweight heuristic:
 * - normalize and lowercase the input
 * - remove language-specific stop words
 * - collect unigrams, bigrams and trigrams
 * - weight multi-word phrases above single words
 * - return the top-ranked terms as a comma-separated list
 */
function extractKeywords(content: string, maxKeywords = 10, language = "en"): string {
  const stopWords = STOP_WORDS_BY_LANGUAGE[language] ?? STOP_WORDS_BY_LANGUAGE["en"]!;

  const cleanedContent = content
    .toLowerCase()
    .replace(/[^\w\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const words = cleanedContent
    .split(/\s+/)
    .filter((word) => word.length > 3 && !stopWords.includes(word));

  const bigrams: string[] = [];
  for (let i = 0; i < words.length - 1; i++) {
    const current = words[i];
    const next = words[i + 1];
    if (current && next && current.length > 2 && next.length > 2) {
      bigrams.push(`${current} ${next}`);
    }
  }

  const trigrams: string[] = [];
  for (let i = 0; i < words.length - 2; i++) {
    const curr = words[i];
    const nxt = words[i + 1];
    const nxt2 = words[i + 2];
    if (curr && nxt && nxt2 && curr.length > 2 && nxt.length > 2 && nxt2.length > 2) {
      trigrams.push(`${curr} ${nxt} ${nxt2}`);
    }
  }

  const allTerms = [...words, ...bigrams, ...trigrams];

  const termFrequency: Record<string, number> = {};
  allTerms.forEach((term) => {
    termFrequency[term] = (termFrequency[term] || 0) + 1;
  });

  const weightedTerms = Object.keys(termFrequency).map((term) => {
    const wordCount = term.split(" ").length;
    const frequencyWeight = termFrequency[term] ?? 0;
    const lengthWeight = wordCount > 1 ? 1.5 * wordCount : 1;
    return { term, score: frequencyWeight * lengthWeight };
  });

  const sortedTerms = weightedTerms
    .sort((a, b) => b.score - a.score)
    .map((item) => item.term)
    .slice(0, maxKeywords);

  return sortedTerms.join(", ");
}

/** Input contract for `buildSeoText()`. */
export interface BuildSeoTextParams {
  title?: string;
  descriptionBase: string;
  /** Additional text fragments to feed into description and keyword extraction. */
  enrichedParts?: string[];
  /** Maximum output length for the generated description. */
  maxDescription?: number;
  language?: string;
  keywordLimit?: number;
  /** Static keywords that should be merged after extraction. */
  fallbackKeywords?: string[];
  /** Controls whether summary generation or truncation gets first priority. */
  combineStrategy?: "truncate-first" | "generate-first";
}

/** Final SEO text payload returned to page-level SEO helpers. */
export interface SeoTextResult {
  description: string;
  keywords: string;
  keywordArray: string[];
  /** Final concatenated content used as extraction input after optional sanitization. */
  enrichedContent: string;
}

/**
 * Produces a description and keyword set from normalized text inputs.
 *
 * Strategy overview:
 * 1. concatenate title, base description and optional enrichment fragments
 * 2. optionally sanitize the combined text
 * 3. generate a bounded description using truncation/generation heuristics
 * 4. run the primary keyword extractor
 * 5. fall back to a lightweight frequency-based extractor if the primary result is sparse
 * 6. merge in explicit fallback keywords without duplicates
 */
// --- Internal helpers (formerly from deprecated files) --------------------

/** Removes simple HTML tags before text-based SEO processing. */
function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, " ");
}

import { normalizeWhitespace } from "../format";

/**
 * Truncates text without cutting too aggressively mid-sentence.
 *
 * Preference order:
 * - keep the whole string if already short enough
 * - cut at a late sentence boundary
 * - otherwise cut at the last reasonable word boundary
 * - otherwise fall back to a hard trim plus ellipsis
 */
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

/** Generates a meta-description-sized summary from plain text content. */
function internalGenerateMetaDescription(content: string, maxLength: number): string {
  const base = normalizeWhitespace(stripHtml(content));
  if (base.length <= maxLength) {
    return base;
  }
  return truncateSmart(base, maxLength);
}

/**
 * Secondary keyword extractor used when the primary extractor returns too little signal.
 *
 * This is intentionally simple: it strips markup, removes short/common words and uses
 * frequency as a fallback ranking heuristic.
 */
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

/** Joins keywords into a stable comma-separated string while deduplicating case-insensitively. */
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

/**
 * Builds the final description using the requested strategy.
 *
 * If the preferred strategy yields a result that is too short to be useful, the alternative
 * path is used as a fallback.
 */
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

/** Splits a comma-separated keyword string into trimmed keyword tokens. */
function splitKeywords(raw: string): string[] {
  return raw
    .split(",")
    .map((k: string) => k.trim())
    .filter((k) => k.length > 0);
}

/** Appends missing keywords in-place while preserving the original order of the base list. */
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
 * High-level convenience wrapper for SEO text generation.
 *
 * The returned fields intentionally serve different downstream needs:
 * - `description`: bounded summary for meta tags
 * - `keywordArray`: ordered list for programmatic reuse
 * - `keywords`: comma-separated serialization of that list
 * - `enrichedContent`: the normalized extraction input, useful for inspection/debugging
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
  } = params;
  const rawCombined = [title, descriptionBase, ...enrichedParts]
    .filter(Boolean)
    .join(" ")
    .trim();
  const enrichedContent = rawCombined;

  const description = buildDescription(enrichedContent, combineStrategy, maxDescription);

  const primaryKw = splitKeywords(
    extractKeywords(enrichedContent, keywordLimit, language)
  );
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
