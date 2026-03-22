/**
 * Small formatting helpers shared by page and content utilities.
 *
 * These helpers intentionally cover only a narrow set of presentation concerns:
 * - human-readable calendar dates
 * - compact meta-description shaping for SEO-like contexts
 *
 * They do not attempt heavy validation or locale orchestration beyond the immediate use case.
 */

/**
 * Formats an ISO-like date string into a human-readable calendar date.
 *
 * The function delegates to `Date` and `toLocaleDateString()`, so callers should pass values
 * that the JavaScript runtime can parse reliably.
 */
export const formatDate = (dateString: string, locale: string = "en-US"): string => {
  return new Date(dateString).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Builds a bounded meta-description-style string from arbitrary text.
 *
 * Behavior:
 * - collapses whitespace in the base text and optional suffix
 * - truncates with `...` when the text exceeds the allowed length
 * - appends the suffix with ` — ` only when it fits within the overall budget
 *
 * This is intentionally simple and deterministic, making it suitable for small page-level
 * description assembly where full SEO text generation would be unnecessary.
 */
export const buildMetaDescription = (
  text: string,
  maxLength: number = 160,
  suffix?: string
): string => {
  const normalizedText = text.replace(/\s+/g, " ").trim();
  const normalizedSuffix = suffix?.replace(/\s+/g, " ").trim();

  if (!normalizedSuffix) {
    if (normalizedText.length <= maxLength) {
      return normalizedText;
    }

    return `${normalizedText.slice(0, Math.max(0, maxLength - 3)).trimEnd()}...`;
  }

  const separator = " — ";
  const maxBaseLength = maxLength - separator.length - normalizedSuffix.length;

  if (maxBaseLength <= 0) {
    if (normalizedText.length <= maxLength) {
      return normalizedText;
    }

    return `${normalizedText.slice(0, Math.max(0, maxLength - 3)).trimEnd()}...`;
  }

  const baseText =
    normalizedText.length <= maxBaseLength
      ? normalizedText
      : `${normalizedText.slice(0, Math.max(0, maxBaseLength - 3)).trimEnd()}...`;

  return `${baseText}${separator}${normalizedSuffix}`.trim();
};
