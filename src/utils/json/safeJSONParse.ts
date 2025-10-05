/**
 * safeJSONParse
 * Minimal, allocation-light JSON parse helper returning a discriminated union.
 * Avoids throwing; enables central telemetry hook later without code churn.
 */
export interface SafeJSONParseSuccess<T> {
  ok: true;
  value: T;
}
export interface SafeJSONParseFailure {
  ok: false;
  error: unknown;
}
export type SafeJSONParseResult<T> = SafeJSONParseSuccess<T> | SafeJSONParseFailure;

/**
 * Parse a JSON string safely.
 * @param {string | null | undefined} input Raw JSON string (or null/undefined)
 * @returns {SafeJSONParseResult<T>} Result object with ok flag
 */
export function safeJSONParse<T = unknown>(
  input: string | null | undefined
): SafeJSONParseResult<T> {
  if (input === null || input === undefined || input === "") {
    return { ok: false, error: new Error("EMPTY_INPUT") };
  }
  try {
    return { ok: true, value: JSON.parse(input) as T };
  } catch (error) {
    return { ok: false, error };
  }
}
