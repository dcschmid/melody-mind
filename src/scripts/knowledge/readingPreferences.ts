/**
 * Reading Preferences Client Script
 *
 * Manages user preferences for font size, line height, and reading mode.
 * Persists settings to localStorage and applies them to the article.
 * Extracted from [...slug].astro for caching and maintainability.
 */

import { VERSIONED_KEYS } from "@constants/storageVersions";

type FontSize = "small" | "medium" | "large";
type LineHeight = "compact" | "normal" | "relaxed";

interface ReadingPrefs {
  fontSize: FontSize;
  lineHeight: LineHeight;
  readingMode: boolean;
}

const DEFAULTS: ReadingPrefs = {
  fontSize: "medium",
  lineHeight: "normal",
  readingMode: false,
};

const isFontSize = (value: unknown): value is FontSize =>
  value === "small" || value === "medium" || value === "large";

const isLineHeight = (value: unknown): value is LineHeight =>
  value === "compact" || value === "normal" || value === "relaxed";

export function initReadingPreferences(): void {
  const root = document.querySelector<HTMLElement>(".knowledge");
  if (!root) return;

  const modeToggle = document.querySelector<HTMLButtonElement>(
    "[data-reading-mode-toggle]"
  );
  const fontButtons = Array.from(
    document.querySelectorAll<HTMLButtonElement>("[data-reading-font-size]")
  );
  const lineButtons = Array.from(
    document.querySelectorAll<HTMLButtonElement>("[data-reading-line-height]")
  );

  const read = (): ReadingPrefs => {
    try {
      const raw = window.localStorage?.getItem(VERSIONED_KEYS.READING_PREFERENCES);
      const parsed = raw ? JSON.parse(raw) : null;

      return {
        fontSize: isFontSize(parsed?.fontSize) ? parsed.fontSize : DEFAULTS.fontSize,
        lineHeight: isLineHeight(parsed?.lineHeight)
          ? parsed.lineHeight
          : DEFAULTS.lineHeight,
        readingMode:
          typeof parsed?.readingMode === "boolean"
            ? parsed.readingMode
            : DEFAULTS.readingMode,
      };
    } catch {
      return { ...DEFAULTS };
    }
  };

  const write = (prefs: ReadingPrefs): void => {
    try {
      window.localStorage?.setItem(
        VERSIONED_KEYS.READING_PREFERENCES,
        JSON.stringify(prefs)
      );
    } catch {
      // Ignore storage failures
    }
  };

  const render = (prefs: ReadingPrefs): void => {
    root.dataset.readingFontSize = prefs.fontSize;
    root.dataset.readingLineHeight = prefs.lineHeight;
    root.classList.toggle("knowledge--reading-mode", prefs.readingMode);

    fontButtons.forEach((button) => {
      const isActive = button.dataset.readingFontSize === prefs.fontSize;
      button.dataset.active = isActive ? "true" : "false";
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    lineButtons.forEach((button) => {
      const isActive = button.dataset.readingLineHeight === prefs.lineHeight;
      button.dataset.active = isActive ? "true" : "false";
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    if (modeToggle) {
      modeToggle.setAttribute("aria-pressed", prefs.readingMode ? "true" : "false");
      modeToggle.textContent = prefs.readingMode
        ? "Reading mode: on"
        : "Reading mode: off";
    }

    window.dispatchEvent(
      new CustomEvent("reading-preferences:change", {
        detail: { preferences: prefs },
      })
    );
  };

  let prefs = read();
  render(prefs);

  fontButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const next = button.dataset.readingFontSize;
      if (!isFontSize(next)) return;
      prefs = { ...prefs, fontSize: next };
      write(prefs);
      render(prefs);
    });
  });

  lineButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const next = button.dataset.readingLineHeight;
      if (!isLineHeight(next)) return;
      prefs = { ...prefs, lineHeight: next };
      write(prefs);
      render(prefs);
    });
  });

  modeToggle?.addEventListener("click", () => {
    prefs = { ...prefs, readingMode: !prefs.readingMode };
    write(prefs);
    render(prefs);
  });

  window.addEventListener("reading-settings:open", () => {
    const controls = document.querySelector<HTMLElement>(".reading-controls");
    controls?.scrollIntoView({ behavior: "smooth", block: "center" });
    const firstControl = controls?.querySelector<HTMLButtonElement>("button");
    firstControl?.focus();
  });
}

// Auto-initialize when script loads
initReadingPreferences();
