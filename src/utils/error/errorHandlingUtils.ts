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
  }

  // Show user message if requested
  if (opts.showUserMessage) {
    showUserErrorMessage(message, type);
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
function showUserErrorMessage(message: string, _type: ErrorType): void {
  // Create error notification element
  const notification = document.createElement("div");
  notification.className = "error-notification";
  notification.setAttribute("role", "alert");
  notification.setAttribute("aria-live", "assertive");

  // Style the notification
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

  // Add to DOM
  document.body.appendChild(notification);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 5000);

  // Allow manual dismissal
  notification.addEventListener("click", () => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  });
}

/**
 * Creates a standardized error message for common scenarios
 *
 * @param type - Type of error
 * @param resource - Resource that failed
 * @param fallback - Fallback message if type is unknown
 * @returns Standardized error message
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
export function isRecoverableError(error: unknown): boolean {
  if (error instanceof Error) {
    // Network errors are usually recoverable
    if (error.message.includes("network") || error.message.includes("fetch")) {
      return true;
    }

    // Validation errors are usually recoverable
    if (error.message.includes("validation") || error.message.includes("invalid")) {
      return true;
    }

    // DOM errors might be recoverable
    if (error.message.includes("DOM") || error.message.includes("element")) {
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
export function attemptRecovery(
  error: unknown,
  recoveryAction: () => void | Promise<void>
): boolean {
  if (isRecoverableError(error)) {
    try {
      const result = recoveryAction();
      if (result instanceof Promise) {
        result.catch((recoveryError) => {});
      }
      return true;
    } catch (recoveryError) {
      return false;
    }
  }

  return false;
}
