/**
 * Time Formatting Utility
 *
 * Provides consistent time formatting across the application.
 * Used by: audio-player, transcript, RSS feed generation
 */

/**
 * Formats seconds into a time string.
 *
 * @param seconds - Total seconds to format
 * @param options - Formatting options
 * @param options.includeHours - Always include hours (default: auto-detect)
 * @param options.padMinutes - Zero-pad minutes in MM:SS format (default: true)
 * @returns Formatted time string (HH:MM:SS or M:SS or MM:SS)
 *
 * @example
 * formatTime(65) // "1:05"
 * formatTime(65, { padMinutes: false }) // "1:05"
 * formatTime(3661) // "1:01:01"
 * formatTime(65, { includeHours: true }) // "0:01:05"
 */
import { safeNumber } from './number-helpers';

export function formatTime(
  seconds: number,
  options?: {
    includeHours?: boolean;
    padMinutes?: boolean;
  },
): string {
  const { includeHours = false, padMinutes = true } = options ?? {};

  const safeSeconds = safeNumber(seconds, 0);

  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const secs = Math.floor(safeSeconds % 60);

  const mm = minutes.toString().padStart(2, '0');
  const ss = secs.toString().padStart(2, '0');

  // Auto-detect if hours should be shown
  const showHours = includeHours || hours > 0;

  if (showHours) {
    // HH:MM:SS format (hours not padded for single digit)
    return `${hours}:${mm}:${ss}`;
  }

  // MM:SS or M:SS format
  if (padMinutes) {
    return `${mm}:${ss}`;
  }
  return `${minutes}:${ss}`;
}

/**
 * Formats seconds into iTunes-compatible duration format.
 * iTunes prefers HH:MM:SS for long content, MM:SS for shorter.
 *
 * @param totalSeconds - Total seconds to format
 * @returns Formatted duration string
 */
export function formatDuration(totalSeconds: number): string {
  return formatTime(totalSeconds, { includeHours: false });
}

/**
 * Parses a time string (HH:MM:SS or MM:SS) into seconds.
 *
 * @param timeStr - Time string to parse
 * @returns Total seconds, or 0 if parsing fails
 */
export function parseTimeToSeconds(timeStr: string): number {
  const clean = timeStr.split(/[ \t]/)[0] ?? '';
  const parts = clean.split(':').map((part) => part.trim());

  if (parts.length === 3) {
    const [hours = '0', minutes = '0', seconds = '0'] = parts;
    return parseInt(hours, 10) * 3600 + parseInt(minutes, 10) * 60 + parseFloat(seconds);
  }

  if (parts.length === 2) {
    const [minutes = '0', seconds = '0'] = parts;
    return parseInt(minutes, 10) * 60 + parseFloat(seconds);
  }

  return 0;
}
