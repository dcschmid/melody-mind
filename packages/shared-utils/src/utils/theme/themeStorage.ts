/**
 * Minimal runtime helpers for persisted theme selection.
 *
 * This module focuses on the small synchronous operations that many UI entry points need:
 * - validate theme values
 * - read/write the persisted theme preference
 * - resolve the effective theme against the system preference
 * - apply the resolved theme to the document and broadcast a change event
 *
 * It is intentionally focused on low-level theme storage and application concerns,
 * while higher-level UI entry points can compose these helpers as needed.
 */
import { THEME_EVENTS, dispatchCustomEvent } from "../../constants/events";
import { STORAGE_KEYS } from "../../constants/storage";

/** Canonical storage key for the persisted theme preference. */
export const THEME_STORAGE_KEY = STORAGE_KEYS.THEME;

/** Supported resolved theme values used across the UI. */
export type Theme = "light" | "dark";

/** Runtime type guard for persisted or external theme values. */
function isTheme(value: unknown): value is Theme {
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

/** Persists a manual theme override using the shared theme storage key. Pass `null` to clear the stored preference and restore system-following. */
export function setStoredTheme(theme: Theme | null): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    if (theme === null) {
      window.localStorage.removeItem(THEME_STORAGE_KEY);
    } else {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
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
export function applyTheme(theme: Theme, source: "manual" | "system" = "manual"): void {
  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.style.colorScheme = theme;
  const themeColors = document.querySelectorAll<HTMLMetaElement>(
    'meta[name="theme-color"][data-theme-color]'
  );

  themeColors.forEach((themeColor) => {
    const resolvedThemeColor =
      themeColor.dataset[theme === "dark" ? "themeColorDark" : "themeColorLight"];

    if (resolvedThemeColor) {
      themeColor.content = resolvedThemeColor;
      themeColor.removeAttribute("media");
    }
  });

  dispatchCustomEvent(THEME_EVENTS.CHANGED, { theme, source });
}
