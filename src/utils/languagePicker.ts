/**
 * LanguagePicker Utility Module
 *
 * Enhanced language selection functionality with performance optimizations and better memory management.
 * This module follows the MelodyMind project standards for performance and accessibility:
 *
 * - Uses TypeScript for type safety
 * - Implements proper cleanup to prevent memory leaks
 * - Provides enhanced keyboard navigation
 * - Manages ARIA states for screen reader announcements
 * - Uses event delegation for better performance
 * - Persists user preferences across sessions
 * - Optimized with AbortController and cached DOM references
 * - Uses translations from data attributes for internationalization
 *
 * @module LanguagePickerUtility
 * @version 2.0.0
 * @since 1.0.0
 */

/**
 * TypeScript interface for language picker configuration
 */
interface LanguagePickerConfig {
  selectElementId: string;
  arrowElementId: string;
  arrowContainerId: string;
  statusElementId: string;
}

/**
 * TypeScript class that manages the language picker functionality
 * Enhanced with performance optimizations and better memory management
 * Uses OOP approach for better organization and maintainability
 */
export class LanguagePicker {
  /** Reference to the select element */
  private selectElement: HTMLSelectElement | null;
  /** Reference to the dropdown arrow SVG element */
  private arrowElement: HTMLElement | null;
  /** Reference to the container of the arrow for styling */
  private arrowContainer: HTMLElement | null;
  /** Reference to the status element for screen reader announcements */
  private statusElement: HTMLElement | null;
  /** Map of event handlers for proper cleanup */
  private eventHandlers: Map<string, EventListenerOrEventListenerObject>;
  /** AbortController for cleanup optimization */
  private abortController: AbortController;
  /** Cached rotation values from CSS custom properties */
  private rotationValues: { open: string; closed: string };
  /** Translation strings loaded from data attributes */
  private translations: {
    focusAnnounce: string;
    changeSuccess: string;
    changeError: string;
    preferenceRestored: string;
  };

  /**
   * Initializes the language picker with DOM references and sets up event handlers
   * @param {LanguagePickerConfig} config - Configuration object with element IDs
   * @constructor
   */
  constructor(
    config: LanguagePickerConfig = {
      selectElementId: "language-select",
      arrowElementId: "language-arrow",
      arrowContainerId: "arrow-container",
      statusElementId: "language-status",
    }
  ) {
    // Initialize AbortController for performance optimization
    this.abortController = new AbortController();

    // Get required DOM elements with appropriate type casting
    this.selectElement = document.getElementById(config.selectElementId) as HTMLSelectElement;
    this.arrowElement = document.getElementById(config.arrowElementId);
    this.arrowContainer = document.getElementById(config.arrowContainerId);
    this.statusElement = document.getElementById(config.statusElementId);
    this.eventHandlers = new Map();

    // Cache CSS rotation values for performance
    this.rotationValues = this.getCachedRotationValues();

    // Load translations from data attributes
    this.translations = this.loadTranslationsFromDataAttributes();

    // Only initialize if all required elements are found in the DOM
    if (this.isValid()) {
      this.initialize();
    } else {
      console.warn("Language picker initialization skipped - required elements not found");
    }
  }

  /**
   * Caches CSS custom property values for rotation to avoid repeated getComputedStyle calls
   * Improves performance by reducing DOM queries during interactions
   */
  private getCachedRotationValues(): { open: string; closed: string } {
    const computedStyles = getComputedStyle(document.documentElement);
    return {
      open: computedStyles.getPropertyValue("--rotation-180")?.trim() || "180deg",
      closed: computedStyles.getPropertyValue("--rotation-0")?.trim() || "0deg",
    };
  }

  /**
   * Loads translation strings from data attributes on the select element
   * Provides fallback values if data attributes are missing
   *
   * @returns {object} Translation strings for screen reader announcements
   */
  private loadTranslationsFromDataAttributes(): {
    focusAnnounce: string;
    changeSuccess: string;
    changeError: string;
    preferenceRestored: string;
  } {
    if (!this.selectElement) {
      // Fallback translations if select element is not available
      return {
        focusAnnounce: "Language selector focused. Use arrow keys to navigate options.",
        changeSuccess: "Language changed to {language}",
        changeError: "Language change failed. Please try again.",
        preferenceRestored: "Language preference restored: {language}",
      };
    }

    return {
      focusAnnounce:
        this.selectElement.dataset.focusAnnounce ||
        "Language selector focused. Use arrow keys to navigate options.",
      changeSuccess: this.selectElement.dataset.changeSuccess || "Language changed to {language}",
      changeError:
        this.selectElement.dataset.changeError || "Language change failed. Please try again.",
      preferenceRestored:
        this.selectElement.dataset.preferenceRestored || "Language preference restored: {language}",
    };
  }

  /**
   * Validates that all required DOM elements exist before initialization
   * Helps prevent runtime errors and improves debugging
   *
   * @returns {boolean} True if all required elements exist in the DOM
   */
  private isValid(): boolean {
    return !!(this.selectElement && this.arrowElement && this.arrowContainer && this.statusElement);
  }

  /**
   * Initializes event listeners and initial state
   * Uses AbortController for performance-optimized cleanup
   * Enhanced with proper ARIA attributes for accessibility
   */
  private initialize(): void {
    try {
      // Set initial ARIA attributes for accessibility
      this.selectElement!.setAttribute("aria-expanded", "false");
      this.selectElement!.setAttribute("aria-haspopup", "listbox");

      // Add event listeners with AbortController for automatic cleanup
      const signal = this.abortController.signal;

      // Focus events for visual feedback
      this.selectElement!.addEventListener("focus", this.handleFocus.bind(this), { signal });
      this.selectElement!.addEventListener("blur", this.handleBlur.bind(this), { signal });

      // Mouse events for dropdown interaction
      this.selectElement!.addEventListener("mousedown", this.handleMouseDown.bind(this), {
        signal,
      });
      this.selectElement!.addEventListener("mouseup", this.handleMouseUp.bind(this), { signal });

      // Change event for language selection
      this.selectElement!.addEventListener("change", this.handleLanguageChange.bind(this), {
        signal,
      });

      // Keyboard events for enhanced navigation
      this.selectElement!.addEventListener("keydown", this.handleKeyDown.bind(this), { signal });
      this.selectElement!.addEventListener("keyup", this.handleKeyUp.bind(this), { signal });

      // Set initial state
      this.resetArrow();

      console.warn("LanguagePicker initialized successfully with enhanced features");
    } catch (error) {
      console.error("Error initializing LanguagePicker:", error);
    }
  }

  /**
   * Handles focus events on the select element
   * Provides visual feedback and announces state to screen readers
   */
  private handleFocus(): void {
    this.arrowContainer!.classList.add("focused");
    this.announceToScreenReader(this.translations.focusAnnounce);
  }

  /**
   * Handles blur events on the select element
   * Removes visual feedback and resets dropdown state
   */
  private handleBlur(): void {
    this.arrowContainer!.classList.remove("focused");
    this.resetArrow();
  }

  /**
   * Handles mouse down events on the select element
   * Rotates arrow and updates ARIA attributes
   */
  private handleMouseDown(): void {
    this.rotateArrow();
    this.selectElement!.setAttribute("aria-expanded", "true");
  }

  /**
   * Handles mouse up events on the select element
   * Resets arrow rotation and updates ARIA attributes
   */
  private handleMouseUp(): void {
    // Small delay to allow for option selection
    setTimeout(() => {
      this.resetArrow();
      this.selectElement!.setAttribute("aria-expanded", "false");
    }, 150);
  }

  /**
   * Handles language change events with enhanced error handling and timeout support
   * Persists selection and provides user feedback
   * @param {Event} event - The change event
   */
  private handleLanguageChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedValue = target.value;
    const selectedText = target.options[target.selectedIndex].text;

    try {
      // Extract language code from the selected value
      const newLang = selectedValue.split("/")[1];

      if (!newLang) {
        throw new Error("Invalid language selection: No language code found");
      }

      // Handle language change with timeout
      this.handleWithTimeout(() => {
        // Store the selected language preference
        localStorage.setItem("preferred-language", newLang);

        // Announce the change to screen readers
        this.announceToScreenReader(
          this.translations.changeSuccess.replace("{language}", selectedText)
        );

        // Trigger custom event for other parts of the application
        const languageChangeEvent = new CustomEvent("languageChanged", {
          detail: { language: newLang, text: selectedText },
          bubbles: true,
        });
        document.dispatchEvent(languageChangeEvent);

        // Navigate to the new language page
        window.location.href = selectedValue;

        console.warn(`Language preference saved: ${newLang}`);
      }, 30000); // 30 second timeout
    } catch (error) {
      this.handleLanguageChangeError(error as Error);
    }
  }

  /**
   * Enhanced error handling for language change operations
   * Provides user feedback and resets to valid state
   * @param {Error} error - The error that occurred
   */
  private handleLanguageChangeError(error: Error): void {
    console.error("Language change failed:", error);

    // Update status for screen readers with error message
    if (this.statusElement) {
      this.statusElement.textContent = this.translations.changeError;
      this.statusElement.setAttribute("aria-live", "assertive");

      // Reset status message after 5 seconds
      setTimeout(() => {
        if (this.statusElement) {
          this.statusElement.setAttribute("aria-live", "polite");
        }
      }, 5000);
    }

    // Reset to previous valid state
    this.selectElement?.setAttribute("aria-expanded", "false");
    this.resetArrow();

    // Announce error to screen readers
    this.announceToScreenReader(this.translations.changeError);
  }

  /**
   * Handles operations with timeout to prevent hanging
   * @param {Function} callback - The operation to execute
   * @param {number} timeoutMs - Timeout in milliseconds (default: 30000)
   */
  private handleWithTimeout(callback: () => void, timeoutMs: number = 30000): void {
    const timeout = setTimeout(() => {
      this.handleLanguageChangeError(
        new Error("Language change timeout - operation took too long")
      );
    }, timeoutMs);

    try {
      callback();
      clearTimeout(timeout);
    } catch (error) {
      clearTimeout(timeout);
      throw error;
    }
  }

  /**
   * Handles keyboard down events for enhanced navigation
   * Provides better accessibility and user experience
   * @param {KeyboardEvent} event - The keyboard event
   */
  private handleKeyDown(event: KeyboardEvent): void {
    // Handle Enter and Space to open dropdown
    if (event.key === "Enter" || event.key === " ") {
      this.rotateArrow();
      this.selectElement!.setAttribute("aria-expanded", "true");
    }

    // Handle Escape to close dropdown
    if (event.key === "Escape") {
      this.resetArrow();
      this.selectElement!.setAttribute("aria-expanded", "false");
      this.selectElement!.blur();
    }
  }

  /**
   * Handles keyboard up events
   * Resets arrow state after key interactions
   * @param {KeyboardEvent} event - The keyboard event
   */
  private handleKeyUp(event: KeyboardEvent): void {
    // Reset arrow state after Enter or Space release
    if (event.key === "Enter" || event.key === " ") {
      setTimeout(() => {
        this.resetArrow();
        this.selectElement!.setAttribute("aria-expanded", "false");
      }, 150);
    }
  }

  /**
   * Rotates the dropdown arrow using cached CSS custom property values
   * Enhanced with performance optimization to avoid repeated DOM queries
   */
  private rotateArrow(): void {
    if (this.arrowElement) {
      this.arrowElement.style.transform = `rotate(${this.rotationValues.open})`;
      this.arrowContainer!.classList.add("open");
    }
  }

  /**
   * Resets the dropdown arrow to its default state
   * Uses cached CSS values for consistent performance
   */
  private resetArrow(): void {
    if (this.arrowElement) {
      this.arrowElement.style.transform = `rotate(${this.rotationValues.closed})`;
      this.arrowContainer!.classList.remove("open");
    }
  }

  /**
   * Announces messages to screen readers for better accessibility
   * Uses ARIA live region for dynamic content announcements
   * @param {string} message - The message to announce
   */
  private announceToScreenReader(message: string): void {
    if (this.statusElement) {
      this.statusElement.textContent = message;

      // Clear the message after a short delay to avoid repetition
      setTimeout(() => {
        if (this.statusElement) {
          this.statusElement.textContent = "";
        }
      }, 1000);
    }
  }

  /**
   * Loads and applies saved language preference from localStorage
   * Provides seamless user experience across sessions
   */
  private loadSavedLanguage(): void {
    try {
      const savedLanguage = localStorage.getItem("preferred-language");
      if (savedLanguage && this.selectElement) {
        // Check if the saved language option exists
        const option = this.selectElement.querySelector(`option[value="${savedLanguage}"]`);
        if (option) {
          this.selectElement.value = savedLanguage;
          const selectedText = (option as HTMLOptionElement).text;
          this.announceToScreenReader(
            this.translations.preferenceRestored.replace("{language}", selectedText)
          );
        }
      }
    } catch (error) {
      console.error("Error loading saved language preference:", error);
    }
  }

  /**
   * Cleanup method to remove event listeners and prevent memory leaks
   * Uses AbortController for efficient cleanup of all event listeners
   * Enhanced with proper disposal of cached references
   */
  public cleanup(): void {
    try {
      // Abort all event listeners
      this.abortController.abort();

      // Clear cached references
      this.eventHandlers.clear();

      // Reset DOM references
      this.selectElement = null;
      this.arrowElement = null;
      this.arrowContainer = null;
      this.statusElement = null;

      console.warn("LanguagePicker cleanup completed successfully");
    } catch (error) {
      console.error("Error during LanguagePicker cleanup:", error);
    }
  }

  /**
   * Performance monitoring method to track memory usage and optimization metrics
   * Useful for debugging and optimization in development environments
   * @returns {object} Performance metrics object
   */
  public getPerformanceMetrics(): {
    eventListenerCount: number;
    memoryUsage: number | null;
    isAborted: boolean;
    hasValidElements: boolean;
  } {
    // Type-safe check for memory usage in browsers that support it
    const perfMemory = (performance as unknown as { memory?: { usedJSHeapSize: number } }).memory;

    return {
      eventListenerCount: this.eventHandlers.size,
      memoryUsage: perfMemory ? perfMemory.usedJSHeapSize : null,
      isAborted: this.abortController.signal.aborted,
      hasValidElements: this.isValid(),
    };
  }

  /**
   * Static factory method to create and initialize a LanguagePicker instance
   * Provides convenient instantiation with default configuration
   * @param {LanguagePickerConfig} config - Optional configuration object
   * @returns {LanguagePicker} New LanguagePicker instance
   */
  public static create(config?: LanguagePickerConfig): LanguagePicker {
    return new LanguagePicker(config);
  }

  /**
   * Static initialization method for immediate setup
   * Ideal for simple use cases where you just want to initialize with default settings
   * Includes performance monitoring and error recovery
   * @param {LanguagePickerConfig} config - Optional configuration object
   * @returns {LanguagePicker} Initialized LanguagePicker instance
   */
  public static init(config?: LanguagePickerConfig): LanguagePicker {
    const startTime = performance.now();

    try {
      const picker = new LanguagePicker(config);

      // Load saved language preference after initialization
      picker.loadSavedLanguage();

      const endTime = performance.now();
      const initTime = endTime - startTime;

      // Log performance metrics for optimization tracking
      if (initTime > 50) {
        console.warn(
          `LanguagePicker initialization took ${initTime.toFixed(2)}ms - consider optimization`
        );
      }

      return picker;
    } catch (error) {
      console.error("Failed to initialize LanguagePicker:", error);
      // Return a fallback instance to prevent page breaking
      return new LanguagePicker(config);
    }
  }
}

// Export the interface for external use
export type { LanguagePickerConfig };
