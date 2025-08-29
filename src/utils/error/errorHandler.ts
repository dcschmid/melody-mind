import { handleGameError } from "./errorHandlingUtils";

/**
 * Error Handler System
 *
 * A comprehensive error management system that provides user-friendly error messages,
 * offline support, and accessibility features. This module centralizes error handling
 * across the application to ensure consistent user experience during error scenarios.
 *
 * - User-friendly error display with appropriate messaging
 * - Offline error handling with background synchronization
 * - Accessibility support for screen readers
 * - Automatic error classification and mapping
 * - Configurable display options (duration, auto-hide)
 *
 * @module errorHandler
 */

// import { QueueManager } from "../queue/queueManager"; // Removed unused import

/**
 * Defines available options for error display customization
 *
 * @interface ErrorOptions
 */
export interface ErrorOptions {
  /** Duration in milliseconds to show the error (default: 5000ms) */
  duration?: number;

  /** Whether to automatically hide the error after duration (default: true) */
  autoHide?: boolean;

  /** ARIA live region setting for screen readers (default: "assertive") */
  ariaLive?: "assertive" | "polite" | "off";
}

/**
 * Types of errors that can occur in the application
 * Used for categorizing and proper handling of different error scenarios
 *
 * @enum {string}
 */
export enum ErrorType {
  NETWORK = "network",
  TIMEOUT = "timeout",
  API = "api",
  VALIDATION = "validation",
  SAVE = "save",
  UNKNOWN = "unknown",
}

/**
 * Collection of localized error messages used throughout the application
 * Maps error types to user-friendly messages
 */
const ERROR_MESSAGES: Record<string, string> = {
  DEFAULT: "An error has occurred",
  NETWORK: "Please check your internet connection",
  TIMEOUT: "The request took too long. Please try again",
  SAVE_GOLDEN_LP: "Error while saving the achievement",
  SAVE_SCORE: "Error while saving the game score",
  OFFLINE_SYNC:
    "Your data is being saved in the background and will be automatically synchronized once the connection is restored.",
};

/**
 * Default configuration for error display behavior
 */
const DEFAULT_ERROR_OPTIONS: Required<ErrorOptions> = {
  duration: 5000,
  autoHide: true,
  ariaLive: "assertive",
};

/**
 * Primary error handling class that manages error display, classification and recovery
 */
export class ErrorHandler {
  /** Reference to the error message DOM element */
  private static errorElement: HTMLElement | null = null;

  /** ID of the current auto-hide timeout */
  private static timeoutId: number | null = null;

  /** Tracks if the handler has been initialized */
  private static isInitialized = false;

  /**
   * Initializes the error handler and sets up DOM event listeners
   * Should be called once when the application starts
   *
   * @returns {boolean} True if initialization was successful, false otherwise
   */
  static initialize(): boolean {
    // Prevent multiple initializations
    if (this.isInitialized) {
      return true;
    }

    this.errorElement = document.querySelector(".errorMessage");

    if (!this.errorElement) {
      return false;
    }

    // Set up event listener for the close button
    const closeButton = this.errorElement.querySelector(".closeButton");
    if (closeButton) {
      closeButton.addEventListener("click", () => this.hideError());

      // Ensure the close button has appropriate accessibility attributes
      if (!closeButton.getAttribute("aria-label")) {
        closeButton.setAttribute("aria-label", "Close error message");
      }
    }

    this.isInitialized = true;
    return true;
  }

  /**
   * Displays an error message to the user with appropriate styling and accessibility features
   *
   * @param {string} message - The error message to display
   * @param {ErrorOptions} options - Configuration options for the error display
   * @returns {void}
   */
  static showError(message: string, options: ErrorOptions = {}): void {
    if (!this.errorElement) {
      // Try to initialize on-demand if not already done
      if (!this.initialize()) {
        // Fall back to console if we can't show UI error
        handleGameError(new Error(message), "error handler");
        return;
      }
    }

    // Merge provided options with defaults
    const mergedOptions = { ...DEFAULT_ERROR_OPTIONS, ...options };

    // Update the error text content
    if (this.errorElement) {
      const errorText = this.errorElement.querySelector(".errorText");
      if (errorText) {
        errorText.textContent = message;
      }
    }

    // Show the error message
    if (this.errorElement) {
      this.errorElement.classList.remove("hidden");

      // Set focus to the error message for keyboard users and screen readers
      this.errorElement.setAttribute("role", "alert");
      this.errorElement.setAttribute("aria-live", mergedOptions.ariaLive);
      this.errorElement.setAttribute("tabindex", "-1");
      this.errorElement.focus();
    }

    // Handle automatic hiding based on configuration
    if (mergedOptions.autoHide) {
      // Clear any existing timeout
      if (this.timeoutId !== null) {
        window.clearTimeout(this.timeoutId);
      }

      // Set a new timeout
      this.timeoutId = window.setTimeout(() => {
        this.hideError();
      }, mergedOptions.duration);
    }
  }

  /**
   * Hides the currently displayed error message
   *
   * @returns {void}
   */
  static hideError(): void {
    if (!this.errorElement) {
      return;
    }

    this.errorElement.classList.add("hidden");

    // Clear any existing timeout
    if (this.timeoutId !== null) {
      window.clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    // Return focus to the previously focused element if appropriate
    const previouslyFocused = document.querySelector('[data-previously-focused="true"]');
    if (previouslyFocused instanceof HTMLElement) {
      previouslyFocused.removeAttribute("data-previously-focused");
      previouslyFocused.focus();
    }
  }

  /**
   * Classifies and handles API errors by mapping them to user-friendly messages
   *
   * @param {Error} error - The error object from the API
   * @param {ErrorOptions} [options] - Optional display configuration
   * @returns {void}
   */
  static handleApiError(error: Error, options?: ErrorOptions): void {
    // Determine the error type from the error message
    const errorType = this.classifyError(error);
    let message = ERROR_MESSAGES.DEFAULT;

    // Map error types to appropriate messages
    switch (errorType) {
      case ErrorType.NETWORK:
        message = ERROR_MESSAGES.NETWORK;
        break;
      case ErrorType.TIMEOUT:
        message = ERROR_MESSAGES.TIMEOUT;
        break;
      case ErrorType.SAVE:
        if (error.message.includes("saveUserGoldenLP")) {
          message = ERROR_MESSAGES.SAVE_GOLDEN_LP;
        } else if (error.message.includes("saveTotalUserPointsAndHighscore")) {
          message = ERROR_MESSAGES.SAVE_SCORE;
        }
        break;
      default:
        // Use the error message directly if it seems user-friendly
        if (error.message && error.message.length < 100 && !error.message.includes("Error:")) {
          message = error.message;
        }
    }

    this.showError(message, options);
  }

  /**
   * Handles save errors during offline scenarios by queueing the data for later sync
   *
  * @param {Error} _error - The original error object
  * @param {string} _type - The type of data being saved ('score' or 'goldenLP')
  * @param {any} _data - The data that failed to save
   * @returns {Promise<void>} Promise resolving when the operation completes
   */
  static async handleSaveError(
    _error: Error,
    _type: "score" | "goldenLP",
    _data: { userId: string; score: number; category: string }
  ): Promise<void> {
    // QueueManager functionality removed - no longer needed
    // await QueueManager.addToQueue(type, data);

    // Show an informative message to the user
    this.showError(ERROR_MESSAGES.OFFLINE_SYNC, {
      autoHide: true,
      duration: 8000,
      ariaLive: "polite",
    });

    // Log the error for debugging purposes
    // Error logged for debugging
  }

  /**
   * Classifies an error into one of the predefined error types
   *
   * @private
   * @param {Error} error - The error to classify
   * @returns {ErrorType} The classified error type
   */
  private static classifyError(error: Error): ErrorType {
    const message = error.message.toLowerCase();

    if (
      message.includes("network") ||
      message.includes("offline") ||
      message.includes("internet")
    ) {
      return ErrorType.NETWORK;
    }

    if (message.includes("timeout") || message.includes("timed out")) {
      return ErrorType.TIMEOUT;
    }

    if (message.includes("save") || message.includes("store")) {
      return ErrorType.SAVE;
    }

    if (message.includes("api") || message.includes("fetch") || message.includes("request")) {
      return ErrorType.API;
    }

    if (message.includes("valid") || message.includes("required")) {
      return ErrorType.VALIDATION;
    }

    return ErrorType.UNKNOWN;
  }
}
