/**
 * LanguagePicker Utilities
 * 
 * Centralized utilities for managing language picker functionality.
 * Eliminates code duplication in component script tags.
 */

import { safeGetElementById, safeQuerySelector } from "../dom/domUtils";

/**
 * LanguagePicker configuration interface
 */
interface LanguagePickerConfig {
  selectId: string;
  arrowSelector: string;
}

/**
 * LanguagePicker utility class
 */
export class LanguagePickerUtils {
  private select: HTMLSelectElement | null;
  private arrow: HTMLElement | null;

  /**
   *
   */
  constructor(config: LanguagePickerConfig) {
    this.select = safeGetElementById<HTMLSelectElement>(config.selectId);
    this.arrow = safeQuerySelector<HTMLElement>(config.arrowSelector);
    
    this.init();
  }

  /**
   * Initialize language picker functionality
   */
  private init(): void {
    if (!this.select) {
      return;
    }

    // Add change event listener
    this.select.addEventListener("change", () => this.handleLanguageChange());
    
    // Add focus event listeners for accessibility
    this.select.addEventListener("focus", () => this.handleFocus());
    this.select.addEventListener("blur", () => this.handleBlur());
    
    // Add keyboard event listeners
    this.select.addEventListener("keydown", (e) => this.handleKeydown(e));
  }

  /**
   * Handle language change
   */
  private handleLanguageChange(): void {
    if (!this.select) {
      return;
    }

    const newLang = this.select.value.split('/')[1];
    
    // Store preferred language in localStorage
    localStorage.setItem('preferred-language', newLang);
    
    // Navigate to new language
    window.location.href = this.select.value;
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
    return url.split('/')[1] || null;
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
    const targetOption = options.find(option => {
      const optionLang = option.value.split('/')[1];
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
    return localStorage.getItem('preferred-language');
  }

  /**
   * Destroy event listeners
   */
  public destroy(): void {
    if (this.select) {
      this.select.removeEventListener("change", () => this.handleLanguageChange());
      this.select.removeEventListener("focus", () => this.handleFocus());
      this.select.removeEventListener("blur", () => this.handleBlur());
      this.select.removeEventListener("keydown", (e) => this.handleKeydown(e));
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
    arrowSelector: ".arrow-container svg"
  });
}
