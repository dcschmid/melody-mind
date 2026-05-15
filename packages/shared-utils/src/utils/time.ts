/**
 * Small time-formatting helpers shared by audio UIs.
 *
 * These utilities intentionally operate on simple clock-style labels rather than full
 * date/time objects. They are meant for durations, not timezone-aware time.
 */

/** Normalizes a numeric input and falls back to a safe default for invalid values. */
const safeNumber = (value: unknown, fallback: number = 0): number => {
  if (value === null || value === undefined) {
    return fallback;
  }

  return Number.isFinite(value as number) ? (value as number) : fallback;
};

/** Formatting options for `formatTime()`. */
export interface FormatOptions {
  includeHours?: boolean;
  padMinutes?: boolean;
}

/**
 * Formats a duration in seconds as a clock-like label.
 *
 * Output examples:
 * - `03:15`
 * - `1:02:09`
 *
 * Hours are shown when explicitly requested or when the value naturally exceeds one hour.
 */
export const formatTime = (seconds: number, options?: FormatOptions): string => {
  const { includeHours = false, padMinutes = true } = options ?? {};
  const safeSeconds = safeNumber(seconds, 0);
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const secs = Math.floor(safeSeconds % 60);
  const mm = minutes.toString().padStart(2, "0");
  const ss = secs.toString().padStart(2, "0");
  const showHours = includeHours || hours > 0;

  if (showHours) {
    return `${hours}:${mm}:${ss}`;
  }

  if (padMinutes) {
    return `${mm}:${ss}`;
  }

  return `${minutes}:${ss}`;
};
