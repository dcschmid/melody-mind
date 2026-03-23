/**
 * Safe wrappers around `localStorage` and `sessionStorage`.
 *
 * These helpers exist so the rest of the codebase can treat browser storage as an optional
 * capability instead of a guaranteed runtime primitive. Every operation degrades safely in:
 * - SSR or build contexts
 * - browsers that block storage access
 * - quota or private-mode failures
 * - corrupted JSON payloads
 *
 * The wrappers intentionally swallow storage errors and return predictable fallbacks instead
 * of surfacing exceptions to feature code.
 */

import type { StorageKey, SessionKey } from "../../constants/storage";
import { isServer } from "../environment";

/** Cached availability flags so each storage backend is probed at most once per reset. */
let _localStorageChecked = false;
let _localStorageAvailable = false;
let _sessionStorageChecked = false;
let _sessionStorageAvailable = false;

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
  if (isServer || !window.localStorage) {
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
 * Checks whether `sessionStorage` is actually usable in the current runtime.
 *
 * Like the local-storage probe, this is cached after the first check.
 */
const isSessionStorageAvailable = (): boolean => {
  // Return cached result if already checked
  if (_sessionStorageChecked) {
    return _sessionStorageAvailable;
  }

  // SSR/build environment check
  if (isServer || !window.sessionStorage) {
    _sessionStorageChecked = true;
    _sessionStorageAvailable = false;
    return false;
  }

  // Test actual availability
  try {
    const testKey = "__session_test__";
    window.sessionStorage.setItem(testKey, testKey);
    window.sessionStorage.removeItem(testKey);
    _sessionStorageAvailable = true;
  } catch {
    _sessionStorageAvailable = false;
  }

  _sessionStorageChecked = true;
  return _sessionStorageAvailable;
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
   * Writes a raw string value to `localStorage` without JSON serialization.
   */
  setRaw(key: StorageKey | string, value: string): boolean {
    if (!isLocalStorageAvailable()) {
      return false;
    }

    try {
      window.localStorage.setItem(key, value);
      return true;
    } catch {
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

  /**
   * Returns whether a key currently exists in `localStorage`.
   */
  has(key: StorageKey | string): boolean {
    if (!isLocalStorageAvailable()) {
      return false;
    }

    try {
      return window.localStorage.getItem(key) !== null;
    } catch {
      return false;
    }
  },

  /**
   * Exposes the cached runtime availability probe for callers that need a pre-check.
   */
  isAvailable: isLocalStorageAvailable,
};

/**
 * Safe `sessionStorage` wrapper.
 *
 * This mirrors the JSON-based subset of the local-storage API and is typically used for
 * short-lived per-tab state such as transient analytics journey progress.
 */
export const safeSessionStorage = {
  /**
   * Reads and JSON-parses a value from `sessionStorage`, falling back safely on failure.
   */
  get<T>(key: SessionKey | string, fallback: T): T {
    if (!isSessionStorageAvailable()) {
      return fallback;
    }

    try {
      const raw = window.sessionStorage.getItem(key);
      if (raw === null) {
        return fallback;
      }
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  },

  /**
   * Serializes and writes a value to `sessionStorage`.
   */
  set<T>(key: SessionKey | string, value: T): boolean {
    if (!isSessionStorageAvailable()) {
      return false;
    }

    try {
      window.sessionStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Removes a key from `sessionStorage`, ignoring runtime failures.
   */
  remove(key: SessionKey | string): void {
    if (!isSessionStorageAvailable()) {
      return;
    }

    try {
      window.sessionStorage.removeItem(key);
    } catch {
      // Ignore errors on removal
    }
  },

  /**
   * Returns whether a key currently exists in `sessionStorage`.
   */
  has(key: SessionKey | string): boolean {
    if (!isSessionStorageAvailable()) {
      return false;
    }

    try {
      return window.sessionStorage.getItem(key) !== null;
    } catch {
      return false;
    }
  },

  /**
   * Exposes the cached runtime availability probe for callers that need a pre-check.
   */
  isAvailable: isSessionStorageAvailable,
};
