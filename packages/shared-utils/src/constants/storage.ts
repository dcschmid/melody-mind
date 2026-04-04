/**
 * Central registry for browser persistence keys and transient runtime flags.
 *
 * This module defines the canonical names used when shared utilities read from or
 * write to `localStorage`, `sessionStorage`, or window-scoped runtime state.
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
  /** Stores the serialized bookmark collection for saved articles or items. */
  BOOKMARKS: "mm_bookmarks",
  /** Base identifier for recently viewed content history. */
  RECENT_READS: "mm_recent_reads",
  /** Stores the user's explicit light/dark theme preference. */
  THEME: "themePreference",
  /** Stores the preferred reading mode or content presentation mode. */
  READING_MODE: "mm_reading_mode",
  /** Stores the preferred reading font size override. */
  FONT_SIZE: "mm_font_size",
} as const;

/**
 * `sessionStorage` keys whose values should only live for the current browser tab.
 *
 * Use these for ephemeral state that should reset when the tab or window closes,
 * such as in-session journey tracking or temporary experiment assignments.
 */
export const SESSION_KEYS = {
  /** Tracks the previous journey step so cross-page navigation patterns can be inferred in-session. */
  JOURNEY: "mm_journey_previous",
  /** Stores experiment variant assignments scoped to the active tab session. */
  AB_TESTS: "mm_ab_variants",
} as const;

/**
 * Union of all canonical shared `localStorage` key names.
 *
 * Useful when utility code should only accept one of the curated storage keys
 * defined in this module.
 */
export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

/**
 * Union of all canonical shared `sessionStorage` key names.
 */
export type SessionKey = (typeof SESSION_KEYS)[keyof typeof SESSION_KEYS];
