export function safeNumber(value: unknown, fallback: number = 0): number {
  if (value === null || value === undefined) {
    return fallback;
  }
  return Number.isFinite(value) ? (value as number) : fallback;
}

export function safeNumberOrNull(value: unknown): number | null {
  if (value === null || value === undefined) {
    return null;
  }
  return Number.isFinite(value) ? (value as number) : null;
}

export function clamp(value: number, min: number, max: number | null): number {
  if (!Number.isFinite(value)) {
    return min;
  }
  if (max === null) {
    return Math.max(min, value);
  }
  return Math.min(Math.max(min, value), max);
}

export function safeAudioTime(time: number, duration: number | null): number {
  const safeTime = safeNumber(time, 0);
  return clamp(safeTime, 0, duration);
}
