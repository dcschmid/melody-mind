/**
 * LanguagePicker Utilities
 *
 * Centralized utilities for managing language picker functionality.
 * Eliminates code duplication in component script tags.
 */

import { safeGetElementById } from "../dom/domUtils";

/**
 * LanguagePicker configuration interface
 */
interface LanguagePickerConfig {
  selectId?: string;
  onLanguageChange?: (newLang: string, newUrl: string) => void;
}

/**
 * LanguagePicker utility class
 */
export class LanguagePickerUtils {
  private config: LanguagePickerConfig;
  private elements: LanguagePickerElements;

  /**
   *
   */
  constructor(config: LanguagePickerConfig) {
    this.config = config;
    this.elements = { select: null };
    this.init();
  }

  /**
   * Initialize language picker functionality
   */
  private init(): void {
    this.cacheElements();
    this.bindEvents();
  }

  private cacheElements(): void {
    this.elements.select = safeGetElementById<HTMLSelectElement>(
      this.config.selectId || "language-select"
    );
  }

  private bindEvents(): void {
    if (this.elements.select) {
      this.elements.select.addEventListener("change", this.handleLanguageChange.bind(this));
    }
  }

  /**
   * Handle language change
   */
  private handleLanguageChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newUrl = target.value;
    const newLang = newUrl.split("/")[1];

    // Store preferred language in localStorage
    localStorage.setItem("preferred-language", newLang);

    // Call custom handler if provided
    if (this.config.onLanguageChange) {
      this.config.onLanguageChange(newLang, newUrl);
    }

    // Navigate to new URL
    window.location.href = newUrl;
  }

  /**
   * Handle focus events
   */
  private handleFocus(): void {
    if (this.arrow) {
      this.arrow.style.transform = "rotate(180deg)";
    }
  }

  /**
   * Handle blur events
   */
  private handleBlur(): void {
    if (this.arrow) {
      this.arrow.style.transform = "rotate(0deg)";
    }
  }

  /**
   * Handle keyboard navigation
   */
  private handleKeydown(e: KeyboardEvent): void {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this.select?.focus();
    }
  }

  /**
   * Get current selected language
   */
  public getCurrentLanguage(): string | null {
    if (!this.select) {
      return null;
    }

    const url = this.select.value;
    return url.split("/")[1] || null;
  }

  /**
   * Set language programmatically
   */
  public setLanguage(langCode: string): void {
    if (!this.select) {
      return;
    }

    // Find option with matching language code
    const options = Array.from(this.select.options);
    const targetOption = options.find((option) => {
      const optionLang = option.value.split("/")[1];
      return optionLang === langCode;
    });

    if (targetOption) {
      this.select.value = targetOption.value;
      this.handleLanguageChange();
    }
  }

  /**
   * Get preferred language from localStorage
   */
  public getPreferredLanguage(): string | null {
    return localStorage.getItem("preferred-language");
  }

  /**
   * Destroy event listeners
   */
  public destroy(): void {
    if (this.elements.select) {
      this.elements.select.removeEventListener("change", this.handleLanguageChange.bind(this));
    }
  }
}

/**
 * Initialize language picker functionality
 */
export function initLanguagePicker(config: LanguagePickerConfig): LanguagePickerUtils {
  return new LanguagePickerUtils(config);
}

/**
 * Default language picker initialization
 */
export function initDefaultLanguagePicker(): LanguagePickerUtils {
  return initLanguagePicker({
    selectId: "language-select",
  });
}
