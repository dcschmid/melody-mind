/**
 * Theme initialization and management utilities.
 *
 * The inline theme script in Layout.astro runs before page render to prevent FOUC.
 * This module provides utilities for other components that need to interact with theme.
 *
 * @module scripts/theme-init
 */

import { STORAGE_KEYS } from "@constants/storage";
import { THEME_EVENTS } from "@constants/events";
import { safeLocalStorage } from "@utils/storage/safeStorage";

/** CSS dark mode media query */
const DARK_QUERY = "(prefers-color-scheme: dark)";

/** Theme source identifier */
export type ThemeSource = "manual" | "system";

/** Theme change event detail */
export interface ThemeChangeDetail {
  theme: "light" | "dark";
  source: ThemeSource;
}

/** Re-export for backward compatibility */
export const THEME_CHANGE_EVENT = THEME_EVENTS.CHANGED;
export const THEME_STORAGE_KEY = STORAGE_KEYS.THEME;

/**
 * Check if a value is a valid theme.
 */
export const isValidTheme = (value: unknown): value is "light" | "dark" =>
  value === "light" || value === "dark";

/**
 * Read the stored theme preference from localStorage.
 * Returns null if not set or invalid.
 */
export const readStoredTheme = (): "light" | "dark" | null => {
  const stored = safeLocalStorage.getRaw(STORAGE_KEYS.THEME);
  return isValidTheme(stored) ? stored : null;
};

/**
 * Get the system's preferred color scheme.
 */
export const getSystemTheme = (): "light" | "dark" =>
  window.matchMedia(DARK_QUERY).matches ? "dark" : "light";

/**
 * Apply a theme to the document.
 * Dispatches a custom event for other components to react.
 */
export const applyTheme = (theme: "light" | "dark", source: ThemeSource): void => {
  document.documentElement.setAttribute("data-theme", theme);
  window.dispatchEvent(
    new CustomEvent<ThemeChangeDetail>(THEME_EVENTS.CHANGED, {
      detail: { theme, source },
    })
  );
};

/**
 * Store the theme preference in localStorage.
 */
export const storeTheme = (theme: "light" | "dark"): void => {
  safeLocalStorage.setRaw(STORAGE_KEYS.THEME, theme);
};

/**
 * Initialize theme system.
 * Sets up system preference listener and applies stored or system theme.
 *
 * Note: The inline script in Layout.astro handles initial theme application
 * to prevent FOUC. This function is for use by interactive components.
 */
export const initThemeSystem = (): void => {
  const storedTheme = readStoredTheme();
  const resolvedTheme = storedTheme ?? getSystemTheme();
  applyTheme(resolvedTheme, storedTheme ? "manual" : "system");

  // Listen for system preference changes
  window.matchMedia(DARK_QUERY).addEventListener("change", () => {
    // Only update if no manual preference is stored
    if (!readStoredTheme()) {
      applyTheme(getSystemTheme(), "system");
    }
  });
};

/**
 * Set theme manually and persist the preference.
 */
export const setTheme = (theme: "light" | "dark"): void => {
  storeTheme(theme);
  applyTheme(theme, "manual");
};

/**
 * Toggle between light and dark themes.
 */
export const toggleTheme = (): void => {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  setTheme(next);
};
