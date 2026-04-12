/**
 * Safe wrapper around `localStorage`.
 *
 * This helper exists so the rest of the codebase can treat browser storage as an optional
 * capability instead of a guaranteed runtime primitive. Every operation degrades safely in:
 * - SSR or build contexts
 * - browsers that block storage access
 * - quota or private-mode failures
 * - corrupted JSON payloads
 *
 * The wrapper intentionally swallows storage errors and returns predictable fallbacks instead
 * of surfacing exceptions to feature code.
 */

import type { StorageKey } from "../../constants/storage";

/** Cached availability flags so each storage backend is probed at most once per reset. */
let _localStorageChecked = false;
let _localStorageAvailable = false;

/**
 * Checks whether `localStorage` is actually usable in the current runtime.
 *
 * The result is memoized because probing storage requires guarded browser access and may
 * throw in some environments.
 */
const isLocalStorageAvailable = (): boolean => {
  // Return cached result if already checked
  if (_localStorageChecked) {
    return _localStorageAvailable;
  }

  // SSR/build environment check
  if (typeof window === "undefined" || !window.localStorage) {
    _localStorageChecked = true;
    _localStorageAvailable = false;
    return false;
  }

  // Test actual availability (can throw in private mode)
  try {
    const testKey = "__storage_test__";
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    _localStorageAvailable = true;
  } catch {
    _localStorageAvailable = false;
  }

  _localStorageChecked = true;
  return _localStorageAvailable;
};

/**
 * Safe `localStorage` wrapper.
 *
 * `get()`/`set()` operate on JSON-serialized values, while `getRaw()`/`setRaw()` preserve
 * plain strings for cases where callers manage serialization themselves.
 */
export const safeLocalStorage = {
  /**
   * Reads and JSON-parses a value from `localStorage`.
   *
   * Returns the provided fallback when the key is missing, storage is unavailable or the
   * stored payload cannot be parsed successfully.
   */
  get<T>(key: StorageKey | string, fallback: T): T {
    if (!isLocalStorageAvailable()) {
      return fallback;
    }

    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) {
        return fallback;
      }
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  },

  /**
   * Reads a raw string value from `localStorage` without JSON parsing.
   */
  getRaw(key: StorageKey | string): string | null {
    if (!isLocalStorageAvailable()) {
      return null;
    }

    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },

  /**
   * Serializes and writes a value to `localStorage`.
   *
   * Returns `false` instead of throwing when storage is unavailable or the write fails.
   */
  set<T>(key: StorageKey | string, value: T): boolean {
    if (!isLocalStorageAvailable()) {
      return false;
    }

    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      // Quota exceeded or other error
      return false;
    }
  },

  /**
   * Removes a key from `localStorage`, ignoring runtime failures.
   */
  remove(key: StorageKey | string): void {
    if (!isLocalStorageAvailable()) {
      return;
    }

    try {
      window.localStorage.removeItem(key);
    } catch {
      // Ignore errors on removal
    }
  },
};
