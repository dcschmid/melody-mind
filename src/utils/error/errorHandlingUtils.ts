/**
 * Error Handling Utilities
 *
 * Centralized utilities for common error handling patterns.
 * Eliminates code duplication across different components.
 */

/**
 * Common error types used across the application
 */
export enum ErrorType {
  LOADING = "loading",
  INITIALIZATION = "initialization",
  VALIDATION = "validation",
  NETWORK = "network",
  DOM = "dom",
  GAME = "game",
  AUDIO = "audio",
  UNKNOWN = "unknown",
}

/**
 * Interface for error context information
 */
export interface ErrorContext {
  component?: string;
  action?: string;
  data?: Record<string, unknown>;
  timestamp?: Date;
}

/**
 * Interface for error handling options
 */
export interface ErrorHandlingOptions {
  logToConsole?: boolean;
  showUserMessage?: boolean;
  throwError?: boolean;
  context?: ErrorContext;
}

/**
 * Default error handling options
 */
const DEFAULT_ERROR_OPTIONS: ErrorHandlingOptions = {
  logToConsole: true,
  showUserMessage: false,
  throwError: false,
  context: {},
};

/**
 * Handles common loading errors with consistent logging
 *
 * @param error - The error that occurred
 * @param resource - The resource that failed to load
 * @param options - Error handling options
 */
/**
 * Handle loading errors with typed JSDoc annotations.
 *
 * @param {unknown} error - The captured error object or value
 * @param {string} resource - Human-friendly resource name that failed to load
 * @param {ErrorHandlingOptions} [options={}] - Optional handling overrides
 * @returns {void}
 */
export function handleLoadingError(
  error: unknown,
  resource: string,
  options: ErrorHandlingOptions = {}
): void {
  const opts = { ...DEFAULT_ERROR_OPTIONS, ...options };
  const errorMessage = `Failed to load ${resource}`;

  handleError(error, errorMessage, ErrorType.LOADING, opts);
}

/**
 * Handles common initialization errors with consistent logging
 *
 * @param error - The error that occurred
 * @param component - The component that failed to initialize
 * @param options - Error handling options
 */
/**
 * Handle initialization errors with typed JSDoc annotations.
 *
 * @param {unknown} error - The error thrown during initialization
 * @param {string} component - Component name that failed to initialize
 * @param {ErrorHandlingOptions} [options={}] - Optional handling overrides
 * @returns {void}
 */
export function handleInitializationError(
  error: unknown,
  component: string,
  options: ErrorHandlingOptions = {}
): void {
  const opts = { ...DEFAULT_ERROR_OPTIONS, ...options };
  const errorMessage = `Failed to initialize ${component}`;

  handleError(error, errorMessage, ErrorType.INITIALIZATION, opts);
}

/**
 * Handles common validation errors with consistent logging
 *
 * @param error - The error that occurred
 * @param field - The field that failed validation
 * @param options - Error handling options
 */
/**
 * Handle validation errors with typed JSDoc annotations.
 *
 * @param {unknown} error - The validation error or details
 * @param {string} field - The field that failed validation
 * @param {ErrorHandlingOptions} [options={}] - Optional handling overrides
 * @returns {void}
 */
export function handleValidationError(
  error: unknown,
  field: string,
  options: ErrorHandlingOptions = {}
): void {
  const opts = { ...DEFAULT_ERROR_OPTIONS, ...options };
  const errorMessage = `Validation failed for ${field}`;

  handleError(error, errorMessage, ErrorType.VALIDATION, opts);
}

/**
 * Handles common network errors with consistent logging
 *
 * @param error - The error that occurred
 * @param endpoint - The endpoint that failed
 * @param options - Error handling options
 */
/**
 * Handle network errors with typed JSDoc annotations.
 *
 * @param {unknown} error - The network error or response object
 * @param {string} endpoint - The endpoint or resource requested
 * @param {ErrorHandlingOptions} [options={}] - Optional handling overrides
 * @returns {void}
 */
export function handleNetworkError(
  error: unknown,
  endpoint: string,
  options: ErrorHandlingOptions = {}
): void {
  const opts = { ...DEFAULT_ERROR_OPTIONS, ...options };
  const errorMessage = `Network request failed for ${endpoint}`;

  handleError(error, errorMessage, ErrorType.NETWORK, opts);
}

/**
 * Handles common DOM errors with consistent logging
 *
 * @param error - The error that occurred
 * @param element - The DOM element that caused the error
 * @param options - Error handling options
 */
/**
 * Handle DOM-related errors with typed JSDoc annotations.
 *
 * @param {unknown} error - The error encountered during DOM operations
 * @param {string} element - Description or selector of the element involved
 * @param {ErrorHandlingOptions} [options={}] - Optional handling overrides
 * @returns {void}
 */
export function handleDOMError(
  error: unknown,
  element: string,
  options: ErrorHandlingOptions = {}
): void {
  const opts = { ...DEFAULT_ERROR_OPTIONS, ...options };
  const errorMessage = `DOM operation failed for ${element}`;

  handleError(error, errorMessage, ErrorType.DOM, opts);
}

/**
 * Handles common game errors with consistent logging
 *
 * @param error - The error that occurred
 * @param gameAction - The game action that failed
 * @param options - Error handling options
 */
/**
 * Handle game errors with typed JSDoc annotations.
 *
 * @param {unknown} error - The error that occurred within game logic
 * @param {string} gameAction - Description of the failing game action
 * @param {ErrorHandlingOptions} [options={}] - Optional handling overrides
 * @returns {void}
 */
export function handleGameError(
  error: unknown,
  gameAction: string,
  options: ErrorHandlingOptions = {}
): void {
  const opts = { ...DEFAULT_ERROR_OPTIONS, ...options };
  const errorMessage = `Game operation failed: ${gameAction}`;

  handleError(error, errorMessage, ErrorType.GAME, opts);
}

/**
 * Handles common audio errors with consistent logging
 *
 * @param error - The error that occurred
 * @param audioAction - The audio action that failed
 * @param options - Error handling options
 */
/**
 * Handle audio-related errors with typed JSDoc annotations.
 *
 * @param {unknown} error - The audio error or details
 * @param {string} audioAction - Description of the failing audio action
 * @param {ErrorHandlingOptions} [options={}] - Optional handling overrides
 * @returns {void}
 */
export function handleAudioError(
  error: unknown,
  audioAction: string,
  options: ErrorHandlingOptions = {}
): void {
  const opts = { ...DEFAULT_ERROR_OPTIONS, ...options };
  const errorMessage = `Audio operation failed: ${audioAction}`;

  handleError(error, errorMessage, ErrorType.AUDIO, opts);
}

/**
 * Central error handling function
 *
 * @param error - The error that occurred
 * @param message - Human-readable error message
 * @param type - Type of error
 * @param options - Error handling options
 */
/**
 * Central error handling implementation.
 *
 * @param {unknown} error - The original error object or value
 * @param {string} message - Human readable message for logging / UI
 * @param {ErrorType} type - Categorized error type
 * @param {ErrorHandlingOptions} options - Options controlling logging/throwing behavior
 * @returns {void}
 */
function handleError(
  error: unknown,
  message: string,
  type: ErrorType,
  options: ErrorHandlingOptions
): void {
  const opts = { ...DEFAULT_ERROR_OPTIONS, ...options };
  const timestamp = new Date();

  // Create error context
  const context: ErrorContext = {
    ...opts.context,
    timestamp,
  };

  // Log to console if requested
  if (opts.logToConsole) {
    const errorDetails = {
      message,
      type,
      context,
      originalError: error,
      stack: error instanceof Error ? error.stack : undefined,
    };
    // Output structured error details for easier debugging
    // Use console.error to ensure visibility in dev tools
    try {
      // Prefer structured logging when available
      if (typeof console !== "undefined" && typeof console.error === "function") {
        console.error("[app][error]", errorDetails);
      }
    } catch {
      // ignore console errors in restricted environments
    }
  }

  // Show user message if requested (safely)
  if (opts.showUserMessage) {
    try {
      showUserErrorMessage(message, type);
    } catch (uiErr) {
      // If UI display fails, don't allow it to break error handling flow
      try {
        if (typeof console !== "undefined" && typeof console.warn === "function") {
          console.warn("[app][error] showUserErrorMessage failed", uiErr);
        }
      } catch {
        // ignore
      }
    }
  }

  // Throw error if requested
  if (opts.throwError) {
    const enhancedError = new Error(message);
    (enhancedError as Error & { type?: ErrorType }).type = type;
    (enhancedError as Error & { context?: ErrorContext }).context = context;
    (enhancedError as Error & { originalError?: unknown }).originalError = error;
    throw enhancedError;
  }
}

/**
 * Shows a user-friendly error message
 *
 * @param message - Error message to show
 * @param type - Type of error
 */
/**
 * Show a user-friendly error message in a dismissible toast.
 *
 * The function is defensive: it wraps DOM operations in try/catch to avoid
 * throwing while handling errors.
 *
 * @param {string} message - Message to display to the user
 * @param {ErrorType} _type - Categorized error type (currently unused; reserved for future enhancements)
 * @returns {void}
 */
function showUserErrorMessage(message: string, _type: ErrorType): void {
  try {
    // Create error notification element
    const notification = document.createElement("div");
    notification.className = "error-notification";
    notification.setAttribute("role", "alert");
    notification.setAttribute("aria-live", "assertive");

    // Style the notification (kept inline to avoid dependency on CSS in build scripts)
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ef4444;
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      z-index: 10000;
      max-width: 300px;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
      line-height: 1.4;
    `;

    notification.textContent = message;

    // Add to DOM in a safe manner
    if (typeof document !== "undefined" && document.body) {
      document.body.appendChild(notification);

      // Auto-remove after 5 seconds (capture the timer id so we can clear on manual close)
      const timer = setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 5000);

      // Allow manual dismissal
      notification.addEventListener(
        "click",
        () => {
          try {
            if (notification.parentNode) {
              notification.parentNode.removeChild(notification);
            }
          } finally {
            clearTimeout(timer);
          }
        },
        { once: true }
      );
    }
  } catch {
    // Swallow any errors while trying to show a user message to avoid recursion
    try {
      if (typeof console !== "undefined" && typeof console.warn === "function") {
        console.warn("[app][error] Failed to display user error message");
      }
    } catch {
      // ignore
    }
  }
}

/**
 * Creates a standardized error message for common scenarios
 *
 * @param type - Type of error
 * @param resource - Resource that failed
 * @param fallback - Fallback message if type is unknown
 * @returns Standardized error message
 */
/**
 * Create a standardized, localized-friendly error message.
 *
 * @param {ErrorType} type - Category of the error
 * @param {string} resource - The resource or context associated with the error
 * @param {string} [fallback] - Optional fallback message when type is unknown
 * @returns {string} The final user-facing error message
 */
export function createErrorMessage(type: ErrorType, resource: string, fallback?: string): string {
  const messages: Record<ErrorType, string> = {
    [ErrorType.LOADING]: `Failed to load ${resource}. Please try again.`,
    [ErrorType.INITIALIZATION]: `Failed to initialize ${resource}. Please refresh the page.`,
    [ErrorType.VALIDATION]: `Invalid data for ${resource}. Please check your input.`,
    [ErrorType.NETWORK]: `Network error while accessing ${resource}. Please check your connection.`,
    [ErrorType.DOM]: `Interface error with ${resource}. Please refresh the page.`,
    [ErrorType.GAME]: `Game error: ${resource}. Please try again.`,
    [ErrorType.AUDIO]: `Audio error with ${resource}. Please check your audio settings.`,
    [ErrorType.UNKNOWN]: fallback || `An unexpected error occurred with ${resource}.`,
  };

  return messages[type] || messages[ErrorType.UNKNOWN];
}

/**
 * Checks if an error is recoverable
 *
 * @param error - The error to check
 * @returns boolean - True if the error is recoverable
 */
/**
 * Determine if an error is likely recoverable.
 *
 * This is a heuristic used by recovery logic to decide whether to attempt
 * an automated retry or fallback action.
 *
 * @param {unknown} error - The error to inspect
 * @returns {boolean} True if the error looks recoverable
 */
export function isRecoverableError(error: unknown): boolean {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();

    // Network-related errors are usually recoverable
    if (msg.includes("network") || msg.includes("fetch") || msg.includes("timeout")) {
      return true;
    }

    // Validation errors are usually recoverable by correcting input
    if (msg.includes("validation") || msg.includes("invalid")) {
      return true;
    }

    // DOM errors might be recoverable depending on timing / rendering
    if (msg.includes("dom") || msg.includes("element") || msg.includes("not found")) {
      return true;
    }
  }

  return false;
}

/**
 * Attempts to recover from an error
 *
 * @param error - The error to recover from
 * @param recoveryAction - Function to execute for recovery
 * @returns boolean - True if recovery was attempted
 */
/**
 * Attempt to recover from a recoverable error by invoking a recovery action.
 *
 * The function will run the provided recoveryAction synchronously or asynchronously
 * and will swallow errors thrown by the recovery attempt while logging them.
 *
 * @param {unknown} error - The error to attempt recovery from
 * @param {() => void | Promise<void>} recoveryAction - Recovery callback to execute
 * @returns {boolean} True if a recovery attempt was initiated, false otherwise
 */
export function attemptRecovery(
  error: unknown,
  recoveryAction: () => void | Promise<void>
): boolean {
  if (isRecoverableError(error)) {
    try {
      const result = recoveryAction();
      if (result instanceof Promise) {
        result.catch((recoveryError) => {
          // Log recovery promise rejection for diagnostics
          try {
            if (typeof console !== "undefined" && typeof console.warn === "function") {
              console.warn("Recovery action promise rejected", recoveryError);
            }
          } catch {
            // ignore logging errors
          }
        });
      }
      return true;
    } catch (recoveryError) {
      // Log synchronous recovery error for diagnostics and return false
      try {
        if (typeof console !== "undefined" && typeof console.warn === "function") {
          console.warn("Recovery action threw", recoveryError);
        }
      } catch {
        // ignore logging errors
      }
      return false;
    }
  }

  return false;
}
