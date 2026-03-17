/**
 * Basic utility functions for the podcast repository
 */

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function extractKeywords(text: string, maxKeywords: number = 10): string[] {
  // Simple keyword extraction - split by spaces and filter common words
  const commonWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did',
    'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those'
  ]);

  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !commonWords.has(word))
    .slice(0, maxKeywords);
}

export function buildMetaDescription(
  text: string,
  maxLength: number = 160,
  suffix?: string,
): string {
  const normalizedText = text.replace(/\s+/g, " ").trim();
  const normalizedSuffix = suffix?.replace(/\s+/g, " ").trim();

  if (!normalizedSuffix) {
    if (normalizedText.length <= maxLength) {return normalizedText;}
    return `${normalizedText.slice(0, Math.max(0, maxLength - 3)).trimEnd()}...`;
  }

  const separator = " — ";
  const maxBaseLength = maxLength - separator.length - normalizedSuffix.length;

  if (maxBaseLength <= 0) {
    if (normalizedText.length <= maxLength) {return normalizedText;}
    return `${normalizedText.slice(0, Math.max(0, maxLength - 3)).trimEnd()}...`;
  }

  const baseText =
    normalizedText.length <= maxBaseLength
      ? normalizedText
      : `${normalizedText.slice(0, Math.max(0, maxBaseLength - 3)).trimEnd()}...`;

  return `${baseText}${separator}${normalizedSuffix}`.trim();
}
