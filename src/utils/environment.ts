/**
 * Environment detection utilities for SSR/CSR safety.
 *
 * Provides consistent guards to protect client-only code from running
 * during server-side rendering (SSR) or build time.
 *
 * @module utils/environment
 */

/**
 * True if running in a browser environment.
 * Use this guard to protect client-only code.
 *
 * @example
 * ```typescript
 * if (isBrowser) {
 *   window.localStorage.setItem(key, value);
 * }
 * ```
 */
export const isBrowser: boolean = typeof window !== "undefined";

/**
 * True if running on the server (SSR/build).
 *
 * @example
 * ```typescript
 * if (isServer) {
 *   return fallback; // Skip client-only operations
 * }
 * ```
 */
export const isServer: boolean = typeof window === "undefined";

/**
 * Check if localStorage is available.
 * Returns false in SSR or when storage is blocked (private mode).
 *
 * @example
 * ```typescript
 * if (hasLocalStorage()) {
 *   localStorage.setItem(key, value);
 * }
 * ```
 */
export function hasLocalStorage(): boolean {
  return isBrowser && typeof window.localStorage !== "undefined";
}

/**
 * Check if sessionStorage is available.
 * Returns false in SSR or when storage is blocked.
 *
 * @example
 * ```typescript
 * if (hasSessionStorage()) {
 *   sessionStorage.setItem(key, value);
 * }
 * ```
 */
export function hasSessionStorage(): boolean {
  return isBrowser && typeof window.sessionStorage !== "undefined";
}

/**
 * Check if the crypto.randomUUID function is available.
 * Useful for generating IDs client-side.
 *
 * @example
 * ```typescript
 * const id = hasCryptoUUID() ? crypto.randomUUID() : fallbackId();
 * ```
 */
export function hasCryptoUUID(): boolean {
  return (
    isBrowser && "crypto" in window && typeof window.crypto.randomUUID === "function"
  );
}

/**
 * Execute a function only in browser environment.
 * Returns undefined if on server.
 *
 * @example
 * ```typescript
 * const result = runInBrowser(() => window.innerWidth);
 * ```
 */
export function runInBrowser<T>(fn: () => T): T | undefined {
  return isBrowser ? fn() : undefined;
}
