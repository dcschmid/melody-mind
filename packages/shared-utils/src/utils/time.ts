const safeNumber = (value: unknown, fallback: number = 0): number => {
  if (value === null || value === undefined) {
    return fallback;
  }

  return Number.isFinite(value as number) ? (value as number) : fallback;
};

export interface FormatOptions {
  includeHours?: boolean;
  padMinutes?: boolean;
}

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

export const formatDuration = (totalSeconds: number): string => {
  return formatTime(totalSeconds, { includeHours: false });
};

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
