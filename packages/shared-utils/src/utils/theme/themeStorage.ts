/**
 * Minimal runtime helpers for persisted theme selection.
 *
 * This module focuses on the small synchronous operations that many UI entry points need:
 * - validate theme values
 * - read/write the persisted theme preference
 * - resolve the effective theme against the system preference
 * - apply the resolved theme to the document and broadcast a change event
 *
 * It is intentionally narrower than `scripts/theme-init.ts`. The script handles early-page
 * bootstrapping and reactive system/theme synchronization, while this file provides the
 * lightweight imperative helpers used after the page is already running.
 */
import { THEME_EVENTS, dispatchCustomEvent } from "../../constants/events";
import { STORAGE_KEYS } from "../../constants/storage";

/** Canonical storage key for the persisted theme preference. */
export const THEME_STORAGE_KEY = STORAGE_KEYS.THEME;

/** Supported resolved theme values used across the UI. */
export type Theme = "light" | "dark";

/** Runtime type guard for persisted or external theme values. */
export function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark";
}

/** Reads the stored manual theme override, or `null` if none is present/valid. */
export function getStoredTheme(): Theme | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(raw) ? raw : null;
  } catch {
    return null;
  }
}

/** Persists a manual theme override using the shared theme storage key. */
export function setStoredTheme(theme: Theme): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    return true;
  } catch {
    return false;
  }
}

/**
 * Resolves the current system theme preference.
 *
 * On the server this falls back to `"dark"` as a deterministic default, because there is no
 * browser `matchMedia` state available during SSR/build execution.
 */
export function getSystemTheme(): Theme {
  if (typeof window === "undefined") {
    return "dark";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/** Returns the effective theme, preferring a stored manual override over the system theme. */
export function getResolvedTheme(): Theme {
  const stored = getStoredTheme();
  return stored ?? getSystemTheme();
}

/**
 * Applies the theme to the document root and emits the shared theme-change event.
 *
 * The function does not persist anything by itself; persistence stays separate so callers can
 * choose whether a theme change is manual and durable or only a transient system application.
 */
export function applyTheme(theme: Theme, source: "manual" | "system" = "manual"): void {
  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.style.colorScheme = theme;
  dispatchCustomEvent(THEME_EVENTS.CHANGED, { theme, source });
}
