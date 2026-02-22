/**
 * Safe localStorage and sessionStorage utilities.
 *
 * Provides type-safe, browser-checking wrappers around Web Storage APIs.
 * All methods gracefully handle:
 * - SSR/build environments (no window object)
 * - Private browsing mode (storage quota exceeded)
 * - Corrupted data (JSON parse errors)
 *
 * @module utils/storage/safeStorage
 */

import type { StorageKey, SessionKey } from "@constants/storage";

/**
 * Cached availability flags for storage APIs.
 * Avoids repeated try-catch on every operation.
 */
let _localStorageChecked = false;
let _localStorageAvailable = false;
let _sessionStorageChecked = false;
let _sessionStorageAvailable = false;

/**
 * Check if localStorage is available (cached after first check).
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
 * Check if sessionStorage is available (cached after first check).
 */
const isSessionStorageAvailable = (): boolean => {
  // Return cached result if already checked
  if (_sessionStorageChecked) {
    return _sessionStorageAvailable;
  }

  // SSR/build environment check
  if (typeof window === "undefined" || !window.sessionStorage) {
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
 * Reset availability cache (useful for testing or after storage permission changes).
 */
export const resetStorageCache = (): void => {
  _localStorageChecked = false;
  _localStorageAvailable = false;
  _sessionStorageChecked = false;
  _sessionStorageAvailable = false;
};

/**
 * Safe localStorage wrapper with type safety and error handling.
 */
export const safeLocalStorage = {
  /**
   * Get a value from localStorage.
   * Returns fallback if key doesn't exist, storage is unavailable, or JSON parsing fails.
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
   * Get a raw string value from localStorage (no JSON parsing).
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
   * Set a value in localStorage.
   * Returns true if successful, false if storage is unavailable or quota exceeded.
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
   * Set a raw string value in localStorage (no JSON serialization).
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
   * Remove a key from localStorage.
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
   * Check if a key exists in localStorage.
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
   * Check if localStorage is available.
   */
  isAvailable: isLocalStorageAvailable,
};

/**
 * Safe sessionStorage wrapper with type safety and error handling.
 */
export const safeSessionStorage = {
  /**
   * Get a value from sessionStorage.
   * Returns fallback if key doesn't exist, storage is unavailable, or JSON parsing fails.
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
   * Set a value in sessionStorage.
   * Returns true if successful, false if storage is unavailable or quota exceeded.
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
   * Remove a key from sessionStorage.
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
   * Check if a key exists in sessionStorage.
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
   * Check if sessionStorage is available.
   */
  isAvailable: isSessionStorageAvailable,
};
