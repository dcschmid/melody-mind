/**
 * Small runtime-environment helpers shared across browser-aware utilities.
 *
 * The main purpose of this module is to give the rest of the codebase one consistent place
 * for SSR-vs-browser guards. The exported surface is intentionally small and limited to the
 * runtime checks that are actually reused across packages.
 */

/**
 * True during SSR/build execution where browser globals are unavailable.
 *
 * This is the primary guard used by shared client-side helpers before touching `window`,
 * `document`, storage APIs or other browser-only capabilities.
 */
export const isServer: boolean = typeof window === "undefined";
