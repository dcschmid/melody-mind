/**
 * SEO Text Utilities
 * Provides normalized keyword extraction & meta description generation.
 * Lightweight fallback (no external deps) and deterministic.
 */

interface GenerateMetaOptions {
  maxLength?: number;
  ellipsis?: string;
}

/**
 * Generate a meta description bounded by length (UTF-16 safe slicing).
 * @deprecated Use buildPageSeo (description field) with text enrichment logic in textUnified instead.
 */
export function generateMetaDescription(
  content: string,
  opts: GenerateMetaOptions = {},
): string {
  const maxLength = opts.maxLength ?? 158;
  const ellipsis = opts.ellipsis ?? "...";
  if (!content) {
    return "";
  }
  const trimmed = content.replace(/\s+/g, " ").trim();
  if (trimmed.length <= maxLength) {
    return trimmed;
  }
  return trimmed.slice(0, maxLength - ellipsis.length).trimEnd() + ellipsis;
}

/**
 * Basic keyword extraction fallback (frequency + length filter).
 * @deprecated Prefer buildPageSeo + textUnified enrichment; keep for legacy pages or data migrations.
 */
export function extractKeywordsFallback(
  content: string,
  limit: number = 12,
  locale: string = "en",
): string[] {
  if (!content) {
    return [];
  }
  const stopWords = new Set(
    [
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
    ].map((w) => w.toLowerCase()),
  );
  const words = content
    .toLowerCase()
    .replace(/[^a-z0-9äöüßàáâãåèéêëìíîïñóôõöùúûüç\s]/gi, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !stopWords.has(w));

  const freq: Record<string, number> = {};
  for (const w of words) {
    freq[w] = (freq[w] || 0) + 1;
  }
  const sorted = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([w]) => w);

  // Simple locale hint injection (optional)
  if (locale && !sorted.includes(locale.toLowerCase())) {
    sorted.push(locale.toLowerCase());
  }
  return sorted;
}

/**
 * Combine and normalize keyword list into a comma-separated string.
 * @deprecated buildPageSeo returns keywords array; join there if raw string needed.
 */
export function buildKeywordsString(
  keywords: string[],
  extra?: string | string[],
): string {
  const extraList = Array.isArray(extra) ? extra : extra ? [extra] : [];
  const merged = [...keywords, ...extraList]
    .map((k) => k.trim())
    .filter(Boolean);
  const uniq = Array.from(new Set(merged));
  return uniq.join(", ");
}
