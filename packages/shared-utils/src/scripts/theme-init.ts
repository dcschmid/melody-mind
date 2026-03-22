/**
 * Theme initialization and runtime management helpers for browser-only UI code.
 *
 * Responsibilities of this module:
 * - validate persisted theme values,
 * - resolve the current theme from stored preference or system preference,
 * - apply the resolved theme to `document.documentElement`,
 * - emit the shared theme-change event for interested listeners,
 * - and provide small imperative helpers for theme toggles or other controls.
 *
 * Important execution model:
 * - the inline script in `MasterLayout.astro` applies the initial theme early to
 *   avoid a flash of incorrect theme,
 * - this module is then used by interactive components after hydration when they
 *   need to read, change, or re-broadcast theme state.
 *
 * This module builds on the lower-level helpers in `utils/theme/themeStorage.ts` and adds
 * the post-hydration synchronization behavior that interactive pages need.
 *
 * @module scripts/theme-init
 */

import { THEME_EVENTS } from "../constants/events";
import {
  applyTheme,
  getStoredTheme,
  getSystemTheme,
  isTheme,
  setStoredTheme,
  THEME_STORAGE_KEY,
  type Theme,
} from "../utils/theme/themeStorage";

/** Media query used to mirror the operating system's dark-mode preference. */
const DARK_QUERY = "(prefers-color-scheme: dark)";
let hasInitializedThemeSystem = false;
let themeMediaQuery: MediaQueryList | null = null;

const handleThemeSystemChange = (): void => {
  if (!readStoredTheme()) {
    applyTheme(getSystemTheme(), "system");
  }
};

/**
 * Describes where the active theme decision came from.
 *
 * - `manual`: a user explicitly selected a theme and it may be persisted.
 * - `system`: no manual override exists, so the OS/browser preference is in control.
 */
export type ThemeSource = "manual" | "system";

/**
 * Payload shape emitted with the shared `theme:change` browser event.
 *
 * Consumers can use this to distinguish whether a theme update happened because
 * the user toggled it or because the system preference changed.
 */
export interface ThemeChangeDetail {
  theme: Theme;
  source: ThemeSource;
}

/**
 * Shared event name re-exported here for callers that still import theme-related
 * constants from this script module.
 */
export const THEME_CHANGE_EVENT = THEME_EVENTS.CHANGED;

/**
 * Shared storage key re-exported for the same compatibility reason as
 * `THEME_CHANGE_EVENT`.
 */
export { THEME_STORAGE_KEY };

/** Backward-compatible alias for the shared theme type guard. */
export const isValidTheme = isTheme;

/** Backward-compatible alias for reading the stored theme override. */
export const readStoredTheme = getStoredTheme;

/**
 * Initializes post-hydration theme synchronization.
 *
 * Behavior:
 * 1. read any stored manual override,
 * 2. fall back to the current system preference when none exists,
 * 3. apply the resolved theme and emit the shared event,
 * 4. subscribe to future system preference changes,
 * 5. only react to system changes while no manual preference is stored.
 *
 * Note: the inline layout script already applies the initial theme early to avoid
 * FOUC. This initializer is meant for hydrated interactive environments that need
 * the full runtime synchronization behavior.
 */
export const initThemeSystem = (): void => {
  if (hasInitializedThemeSystem) {
    return;
  }
  hasInitializedThemeSystem = true;

  const storedTheme = readStoredTheme();
  const resolvedTheme = storedTheme ?? getSystemTheme();
  applyTheme(resolvedTheme, storedTheme ? "manual" : "system");

  // Keep following the OS only while the user has not stored a manual override.
  themeMediaQuery ??= window.matchMedia(DARK_QUERY);
  themeMediaQuery.addEventListener("change", handleThemeSystemChange);
};

/**
 * Persists and applies a user-selected theme override.
 */
export const setTheme = (theme: Theme): void => {
  setStoredTheme(theme);
  applyTheme(theme, "manual");
};

/**
 * Toggles the current root theme and stores the result as a manual preference.
 *
 * If no `data-theme` attribute is present yet, the function treats the current
 * state as light and switches to dark.
 */
export const toggleTheme = (): void => {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  setTheme(next);
};
