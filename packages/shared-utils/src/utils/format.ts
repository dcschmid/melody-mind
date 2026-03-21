export const formatDate = (dateString: string, locale: string = "en-US"): string => {
  return new Date(dateString).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

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
