/**
 * Central registry for browser persistence keys and transient runtime flags.
 *
 * This module defines the canonical names used when shared utilities read from or
 * write to `localStorage` or window-scoped runtime state.
 * Centralizing them here helps with:
 * - avoiding string drift across apps and packages,
 * - keeping migration or versioning work discoverable,
 * - and documenting the intended lifetime of each value.
 *
 * @module constants/storage
 */

/**
 * Stable `localStorage` keys shared across client-side features.
 *
 * Values in this group are intended to survive reloads and browser restarts until
 * the user clears site data or a feature-specific migration replaces the key.
 *
 * Note: some app-specific features may wrap or version these canonical names
 * elsewhere, for example to introduce schema migrations without changing the
 * semantic identifier documented here.
 */
export const STORAGE_KEYS = {
  /** Base identifier for recently viewed content history. */
  RECENT_READS: "mm_recent_reads",
} as const;

/**
 * Union of all canonical shared `localStorage` key names.
 *
 * Useful when utility code should only accept one of the curated storage keys
 * defined in this module.
 */
export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
