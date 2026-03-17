/**
 * Error Handling Utilities
 *
 * Provides consistent error handling across the application.
 * Used by: async operations, fetch requests, event handlers
 */

/** Prefix for all logged messages */
const LOG_PREFIX = '[MelodyMind]';

/** Error categories for classification */
export type ErrorCategory =
  | 'network'
  | 'audio'
  | 'transcript'
  | 'storage'
  | 'validation'
  | 'unknown';

/** Structured error information */
export interface ErrorInfo {
  message: string;
  category: ErrorCategory;
  originalError?: unknown;
  context?: Record<string, unknown>;
}

/**
 * Logs an error with consistent formatting.
 * In production, this could be extended to send to an error tracking service.
 *
 * @param error - The error to log
 * @param context - Additional context about where the error occurred
 */
export function logError(error: unknown, context?: string | Record<string, unknown>): void {
  const errorInfo = extractErrorInfo(error);

  const contextStr = typeof context === 'string' ? context : context ? JSON.stringify(context) : '';
  const message = `${LOG_PREFIX} [${errorInfo.category}] ${errorInfo.message}${
    contextStr ? ` (${contextStr})` : ''
  }`;
  const report = typeof reportError === 'function' ? reportError : undefined;
  const errorToReport =
    errorInfo.originalError instanceof Error
      ? new Error(message, { cause: errorInfo.originalError })
      : new Error(message);

  if (report) {
    report(errorToReport);
  }
}

/**
 * Extracts structured error information from an unknown error.
 */
function extractErrorInfo(error: unknown): ErrorInfo {
  if (error instanceof Error) {
    return {
      message: error.message,
      category: categorizeError(error),
      originalError: error,
    };
  }

  if (typeof error === 'string') {
    return {
      message: error,
      category: 'unknown',
    };
  }

  return {
    message: 'An unknown error occurred',
    category: 'unknown',
    originalError: error,
  };
}

/**
 * Categorizes an error based on its properties.
 */
function categorizeError(error: Error): ErrorCategory {
  const message = error.message.toLowerCase();
  const name = error.name.toLowerCase();

  if (
    name.includes('network') ||
    message.includes('fetch') ||
    message.includes('network') ||
    message.includes('failed to fetch')
  ) {
    return 'network';
  }

  if (
    name.includes('audio') ||
    message.includes('audio') ||
    message.includes('play') ||
    message.includes('media')
  ) {
    return 'audio';
  }

  if (message.includes('transcript') || message.includes('vtt')) {
    return 'transcript';
  }

  if (message.includes('storage') || message.includes('localstorage')) {
    return 'storage';
  }

  if (
    message.includes('invalid') ||
    message.includes('required') ||
    message.includes('validation')
  ) {
    return 'validation';
  }

  return 'unknown';
}

/**
 * Wraps a promise with consistent error handling.
 * Logs errors and returns a fallback value if provided.
 *
 * @param promise - The promise to handle
 * @param fallback - Optional fallback value if the promise rejects
 * @param context - Context for logging
 * @returns The resolved value or fallback
 *
 * @example
 * const data = await handleAsyncError(fetchData(), null, "loading podcast data");
 */
export async function handleAsyncError<T>(
  promise: Promise<T>,
  fallback?: T,
  context?: string,
): Promise<T | undefined> {
  try {
    return await promise;
  } catch (error) {
    logError(error, context);
    return fallback;
  }
}

/**
 * Creates a safe async handler that catches errors.
 * Useful for event handlers and callbacks.
 *
 * @param fn - The async function to wrap
 * @param fallback - Optional fallback value on error
 * @returns A function that never throws
 *
 * @example
 * button.addEventListener('click', safeAsyncHandler(async () => {
 *   await doSomethingRisky();
 * }));
 */
export function safeAsyncHandler<T>(
  fn: () => Promise<T>,
  fallback?: T,
): () => Promise<T | undefined> {
  return async () => handleAsyncError(fn(), fallback);
}

/**
 * Safely executes a function and returns a result object.
 * Useful for operations that might fail.
 *
 * @param fn - The function to execute
 * @returns A result object with success status
 *
 * @example
 * const result = safeExecute(() => JSON.parse(data));
 * if (result.success) {
 *   console.log(result.data);
 * } else {
 *   console.error(result.error);
 * }
 */
export function safeExecute<T>(
  fn: () => T,
): { success: true; data: T } | { success: false; error: ErrorInfo } {
  try {
    return { success: true, data: fn() };
  } catch (error) {
    return { success: false, error: extractErrorInfo(error) };
  }
}

/**
 * Safely executes an async function and returns a result object.
 *
 * @param fn - The async function to execute
 * @returns A promise resolving to a result object
 */
export async function safeAsyncExecute<T>(
  fn: () => Promise<T>,
): Promise<{ success: true; data: T } | { success: false; error: ErrorInfo }> {
  try {
    return { success: true, data: await fn() };
  } catch (error) {
    return { success: false, error: extractErrorInfo(error) };
  }
}
