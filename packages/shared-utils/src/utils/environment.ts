/**
 * Small runtime-environment helpers shared across browser-aware utilities.
 *
 * The main purpose of this module is to give the rest of the codebase one consistent place
 * for SSR-vs-browser guards. The exported surface is intentionally small and limited to the
 * runtime checks that are actually reused across packages.
 */

/** True when a browser `window` object is available. */
export const isBrowser: boolean = typeof window !== "undefined";

/**
 * True during SSR/build execution where browser globals are unavailable.
 *
 * This is the primary guard used by shared client-side helpers before touching `window`,
 * `document`, storage APIs or other browser-only capabilities.
 */
export const isServer: boolean = typeof window === "undefined";

/**
 * Checks whether `crypto.randomUUID()` is available for client-side ID generation.
 */
export function hasCryptoUUID(): boolean {
  return (
    isBrowser && "crypto" in window && typeof window.crypto.randomUUID === "function"
  );
}
