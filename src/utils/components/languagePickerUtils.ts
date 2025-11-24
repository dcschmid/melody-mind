/**
 * LanguagePicker Utilities
 *
 * Centralized utilities for managing language picker functionality.
 * Eliminates code duplication in component script tags.
 *
 * Provides a small class wrapper that safely queries DOM elements,
 * binds event handlers (keeping references so they can be removed),
 * and exposes a minimal API for programmatic control and teardown.
 */

import { safeGetElementById } from "../dom/domUtils";

/**
 * Configuration options for the language picker utility
 */
export interface LanguagePickerConfig {
  /**
   * The id of the <select> element that controls language selection.
   * Defaults to `"language-select"`.
   */
  selectId?: string;

  /**
   * Optional callback invoked when the language changes.
   * Receives the new language code (e.g. "en") and the selected URL.
   */
  onLanguageChange?: (newLang: string, newUrl: string) => void;
}

/**
 * Internal references to DOM elements used by the language picker
 */
interface LanguagePickerElements {
  select: HTMLSelectElement | null;
  // Arrow is the decorative element positioned to the right of the select.
  // It may not exist in all DOM variants, so it's optional.
  arrow: HTMLElement | null;
}

/**
 * LanguagePicker utility class
 *
 * Usage:
 * const picker = new LanguagePickerUtils({ selectId: 'language-select' });
 * // later
 * picker.destroy();
 */
export class LanguagePickerUtils {
  private config: Required<LanguagePickerConfig>;
  private elements: LanguagePickerElements;

  // Keep bound references so removeEventListener can remove the exact same function
  private boundChangeHandler: (e: Event) => void;
  private boundFocusHandler: (e: FocusEvent) => void;
  private boundBlurHandler: (e: FocusEvent) => void;
  private boundKeydownHandler: (e: KeyboardEvent) => void;

  /**
   * Construct the utility and initialize it.
   *
   *
   */
  constructor(config: LanguagePickerConfig = {}) {
    this.config = {
      selectId: config.selectId ?? "language-select",
      onLanguageChange:
        config.onLanguageChange ??
        ((_newLang: string, _newUrl: string): void => {}),
    };

    this.elements = {
      select: null,
      arrow: null,
    };

    // Bind handlers and store references
    this.boundChangeHandler = this.handleLanguageChange.bind(this);
    this.boundFocusHandler = this.handleFocus.bind(this);
    this.boundBlurHandler = this.handleBlur.bind(this);
    this.boundKeydownHandler = this.handleKeydown.bind(this);

    // Initialize (safe to call multiple times)
    this.init();
  }

  /**
   * Initialize: cache elements and attach events.
   */
  private init(): void {
    this.cacheElements();
    this.bindEvents();
  }

  /**
   * Cache DOM elements referenced by the picker.
   * Uses `safeGetElementById` which returns null if element not found.
   */
  private cacheElements(): void {
    const selectEl = safeGetElementById<HTMLSelectElement>(
      this.config.selectId,
    );
    this.elements.select = selectEl;

    // Try to find decorative arrow/chevron container that typically is placed
    // next to the select in the LanguagePicker component markup.
    if (selectEl && selectEl.parentElement) {
      const arrowCandidate = selectEl.parentElement.querySelector<HTMLElement>(
        ".pointer-events-none, .language-select-arrow",
      );
      this.elements.arrow = arrowCandidate ?? null;
    } else {
      this.elements.arrow = null;
    }
  }

  /**
   * Attach event listeners to cached elements.
   * If elements are not found, this is a no-op.
   */
  private bindEvents(): void {
    const { select } = this.elements;
    if (!select) {
      return;
    }

    select.addEventListener("change", this.boundChangeHandler, {
      passive: true,
    });
    select.addEventListener("focus", this.boundFocusHandler);
    select.addEventListener("blur", this.boundBlurHandler);
    select.addEventListener("keydown", this.boundKeydownHandler);
  }

  /**
   * Change handler for the language select.
   * This method can be called with an Event (from the DOM) or without arguments
   * to trigger reading the current value programmatically.
   *
   *
   */
  private handleLanguageChange(event?: Event): void {
    const selectEl = this.elements.select;
    if (!selectEl) {
      return;
    }

    // If called from an Event, prefer its target value; otherwise use the select's value
    let selectedValue: string | null = null;
    if (event && event.target instanceof HTMLSelectElement) {
      selectedValue = event.target.value;
    } else {
      selectedValue = selectEl.value;
    }

    if (!selectedValue) {
      return;
    }

    // Derive language code from path like "/en/..." -> "en"
    const segs = selectedValue.split("/");
    const newLang = segs[1] || segs[0] || "";
    const normalizedLang = String(newLang);

    // Persist user preference
    try {
      localStorage.setItem("preferred-language", normalizedLang);
    } catch {
      // localStorage might be unavailable in some environments (privacy mode)
      // We swallow the error intentionally but do not crash.
    }

    // Call optional callback
    try {
      this.config.onLanguageChange(normalizedLang, selectedValue);
    } catch {
      // Don't let callback errors break the picker
      // We purposely do not import a logger here to keep this util focused and dependency-free.
    }

    // Navigate to new URL
    // Note: navigation is the canonical behavior for this control in the app.
    window.location.href = selectedValue;
  }

  /**
   * Focus handler for the select element: use to animate the arrow.
   */
  private handleFocus(): void {
    const { arrow } = this.elements;
    if (arrow) {
      arrow.style.transform = "rotate(180deg)";
    }
  }

  /**
   * Blur handler for the select element: restore arrow orientation.
   */
  private handleBlur(): void {
    const { arrow } = this.elements;
    if (arrow) {
      arrow.style.transform = "rotate(0deg)";
    }
  }

  /**
   * Keyboard handler to support keyboard interactions.
   * When Enter or Space is pressed, focus the select to open it.
   *
   *
   */
  private handleKeydown(e: KeyboardEvent): void {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this.elements.select?.focus();
    }
  }

  /**
   * Returns currently selected language code or null if not available.
   */
  public getCurrentLanguage(): string | null {
    const sel = this.elements.select;
    if (!sel) {
      return null;
    }
    const url = sel.value;
    const parts = url.split("/");
    return parts[1] || parts[0] || null;
  }

  /**
   * Programmatically set the current language by language code.
   * If a matching option is found its `.value` will be applied and the
   * onLanguageChange flow will be invoked (which will navigate).
   *
   *
   */
  public setLanguage(langCode: string): void {
    const sel = this.elements.select;
    if (!sel) {
      return;
    }

    const opts = Array.from(sel.options) as HTMLOptionElement[];
    const target = opts.find((o) => {
      const candidateLang =
        (o.value || "").split("/")[1] || (o.value || "").split("/")[0];
      return candidateLang === langCode;
    });

    if (target) {
      // Set value and trigger change handling programmatically
      sel.value = target.value;
      this.handleLanguageChange();
    }
  }

  /**
   * Read preferred language from localStorage, if present.
   */
  public getPreferredLanguage(): string | null {
    try {
      return localStorage.getItem("preferred-language");
    } catch {
      return null;
    }
  }

  /**
   * Remove event listeners and clear references (teardown).
   * After calling destroy the instance is no longer usable.
   */
  public destroy(): void {
    const sel = this.elements.select;
    if (sel) {
      sel.removeEventListener("change", this.boundChangeHandler);
      sel.removeEventListener("focus", this.boundFocusHandler);
      sel.removeEventListener("blur", this.boundBlurHandler);
      sel.removeEventListener("keydown", this.boundKeydownHandler);
    }

    // Clear references to help GC
    this.elements.select = null;
    this.elements.arrow = null;
  }
}

/**
 * Helper to create a new LanguagePickerUtils instance.
 *
 *
 */
export function initLanguagePicker(
  config: LanguagePickerConfig,
): LanguagePickerUtils {
  return new LanguagePickerUtils(config);
}

/**
 * Initialize the default language picker using the common select id.
 * @returns {LanguagePickerUtils}
 */
export function initDefaultLanguagePicker(): LanguagePickerUtils {
  return initLanguagePicker({ selectId: "language-select" });
}
