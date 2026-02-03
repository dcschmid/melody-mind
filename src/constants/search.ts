/**
 * Centralized debounce thresholds for heuristic selection based on item count.
 * Largest threshold first to allow first match return.
 */
export const DEBOUNCE_THRESHOLDS: Array<{ min: number; delay: number }> = [
  { min: 401, delay: 300 },
  { min: 201, delay: 220 },
  { min: 121, delay: 160 },
  { min: 61, delay: 100 },
  { min: 31, delay: 60 },
];

/** Resolve a debounce delay for a given count (or undefined if no debounce). */
export function resolveDebounceForCount(count: number): number | undefined {
  for (const t of DEBOUNCE_THRESHOLDS) {
    if (count >= t.min) {
      return t.delay;
    }
  }
  return undefined;
}
