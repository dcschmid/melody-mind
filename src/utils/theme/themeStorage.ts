import { safeLocalStorage } from "@utils/storage/safeStorage";

export const THEME_STORAGE_KEY = "themePreference";

export type Theme = "light" | "dark";

export function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark";
}

export function getStoredTheme(): Theme | null {
  const raw = safeLocalStorage.getRaw(THEME_STORAGE_KEY);
  return isTheme(raw) ? raw : null;
}

export function setStoredTheme(theme: Theme): boolean {
  return safeLocalStorage.setRaw(THEME_STORAGE_KEY, theme);
}

export function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function getResolvedTheme(): Theme {
  const stored = getStoredTheme();
  return stored ?? getSystemTheme();
}

export function applyTheme(theme: Theme, source: "manual" | "system" = "manual"): void {
  document.documentElement.setAttribute("data-theme", theme);
  window.dispatchEvent(
    new CustomEvent("theme:change", {
      detail: { theme, source },
    })
  );
}

export function toggleTheme(): Theme {
  const current = getResolvedTheme();
  const next: Theme = current === "dark" ? "light" : "dark";
  setStoredTheme(next);
  applyTheme(next, "manual");
  return next;
}

export function initTheme(): void {
  const stored = getStoredTheme();
  const resolved = stored ?? getSystemTheme();
  applyTheme(resolved, stored ? "manual" : "system");
}
