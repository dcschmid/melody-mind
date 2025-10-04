/**
 * Date Formatting Utilities
 * Lightweight helpers to ensure consistent localized date/time presentation.
 */

export interface FormatLocalizedDateOptions {
  dateStyle?: Intl.DateTimeFormatOptions["dateStyle"];
  timeStyle?: Intl.DateTimeFormatOptions["timeStyle"];
  /** Fallback when date is invalid */
  fallback?: string;
}

/**
 * Format a date value using Intl.DateTimeFormat with graceful fallback.
 * Accepts Date | string | number. Returns fallback (default: empty string) on invalid input.
 */
export function formatLocalizedDate(
  lang: string,
  value: Date | string | number | null | undefined,
  opts: FormatLocalizedDateOptions = {}
): string {
  const { dateStyle = "medium", timeStyle, fallback = "" } = opts;
  if (value === null || value === undefined) {
    return fallback;
  }
  const d = value instanceof Date ? value : new Date(value);
  if (isNaN(d.getTime())) {
    return fallback;
  }
  try {
    return new Intl.DateTimeFormat(lang, { dateStyle, timeStyle }).format(d);
  } catch {
    return fallback;
  }
}

export default formatLocalizedDate;
