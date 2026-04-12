/**
 * Small time-formatting and parsing helpers shared by audio and transcript UIs.
 *
 * These utilities intentionally operate on simple clock-style strings rather than full
 * date/time objects. They are meant for durations and cue positions, not timezone-aware time.
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

/**
 * Parses `hh:mm:ss` or `mm:ss`-style strings into total seconds.
 *
 * Parsing is intentionally tolerant:
 * - surrounding tab/space-separated trailing content is ignored
 * - seconds may contain decimal fractions
 * - unsupported or malformed shapes fall back to `0`
 */
export const parseTimeToSeconds = (timeStr: string): number => {
  const clean = (timeStr ?? "").split(/[ \t]/)[0] ?? "";
  const parts = clean.split(":").map((part) => part.trim());

  if (parts.length === 3) {
    const [hours = "0", minutes = "0", seconds = "0"] = parts;
    return parseInt(hours, 10) * 3600 + parseInt(minutes, 10) * 60 + parseFloat(seconds);
  }

  if (parts.length === 2) {
    const [minutes = "0", seconds = "0"] = parts;
    return parseInt(minutes, 10) * 60 + parseFloat(seconds);
  }

  return 0;
};
