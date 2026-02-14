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
 * Check if localStorage is available.
 */
const isLocalStorageAvailable = (): boolean => {
  if (typeof window === "undefined" || !window.localStorage) {
    return false;
  }

  // Test actual availability (can throw in private mode)
  try {
    const testKey = "__storage_test__";
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

/**
 * Check if sessionStorage is available.
 */
const isSessionStorageAvailable = (): boolean => {
  if (typeof window === "undefined" || !window.sessionStorage) {
    return false;
  }

  try {
    const testKey = "__session_test__";
    window.sessionStorage.setItem(testKey, testKey);
    window.sessionStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
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
