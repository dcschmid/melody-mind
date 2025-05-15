/**
 * Helper functions for date formatting
 *
 * These functions support date formatting
 * with consideration of user language and WCAG AAA requirements.
 */

/**
 * Formats a date according to the specified language
 *
 * @param dateString - The date to format as a string or Date object
 * @param locale - The language for formatting (e.g. 'de', 'en')
 * @returns Formatted date as string
 */
export function formatDate(dateString: string | Date, locale: string = "de"): string {
  try {
    const date = typeof dateString === "string" ? new Date(dateString) : dateString;

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date");
    }

    // Formatting options for better readability (WCAG AAA)
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch (err) {
    console.error("Error formatting date:", err);
    return String(dateString);
  }
}

/**
 * Formats a date as a relative date (e.g. "2 days ago")
 *
 * @param dateString - The date to format as a string or Date object
 * @param locale - The language for formatting (e.g. 'de', 'en')
 * @returns Formatted relative date as string
 */
export function formatRelativeDate(dateString: string | Date, locale: string = "de"): string {
  try {
    const date = typeof dateString === "string" ? new Date(dateString) : dateString;

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date");
    }

    // Relative time formatting
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    // Time difference in various units
    if (diffInSeconds < 60) {
      return rtf.format(-diffInSeconds, "second");
    } else if (diffInSeconds < 3600) {
      return rtf.format(-Math.floor(diffInSeconds / 60), "minute");
    } else if (diffInSeconds < 86400) {
      return rtf.format(-Math.floor(diffInSeconds / 3600), "hour");
    } else if (diffInSeconds < 2592000) {
      return rtf.format(-Math.floor(diffInSeconds / 86400), "day");
    } else if (diffInSeconds < 31536000) {
      return rtf.format(-Math.floor(diffInSeconds / 2592000), "month");
    } else {
      return rtf.format(-Math.floor(diffInSeconds / 31536000), "year");
    }
  } catch (err) {
    console.error("Error formatting relative date:", err);
    return String(dateString);
  }
}

/**
 * Formats a date as a short date (e.g. "05.08.2025")
 *
 * @param dateString - The date to format as a string or Date object
 * @param locale - The language for formatting (e.g. 'de', 'en')
 * @returns Formatted short date as string
 */
export function formatShortDate(dateString: string | Date, locale: string = "de"): string {
  try {
    const date = typeof dateString === "string" ? new Date(dateString) : dateString;

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date");
    }

    // Short date formatting
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  } catch (err) {
    console.error("Error formatting short date:", err);
    return String(dateString);
  }
}
