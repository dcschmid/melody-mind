/**
 * Specialized error classes for MelodyMind application
 *
 * Provides type-safe error handling patterns with typed error information
 *
 * @since 1.0.0
 * @category Errors
 */

/**
 * Base error class for all application errors
 *
 * @category Errors
 */
export class AppError extends Error {
  /**
   * Creates a new application error
   *
   * @param {string} message - Human-readable error message
   * @param {Object} [options] - Additional error options
   * @param {string} [options.code] - Error code for programmatic identification
   * @param {boolean} [options.isOperational=true] - Whether this is an operational error
   */
  constructor(
    message: string,
    public readonly options: {
      code?: string;
      isOperational?: boolean;
    } = { isOperational: true }
  ) {
    super(message);
    this.name = "AppError";

    // Ensures proper prototype chain for instanceof checks
    // (Required for Error subclasses in TypeScript)
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Error class for authentication-related errors
 *
 * @category Errors
 */
export class AuthError extends AppError {
  /**
   * Creates a new authentication error
   *
   * @param {string} message - Human-readable error message
   * @param {number} statusCode - HTTP status code
   * @param {Object} [additionalInfo] - Additional error information
   */
  constructor(
    message: string,
    public readonly statusCode: number = 401,
    public readonly additionalInfo: Record<string, unknown> = {}
  ) {
    super(message, { code: `AUTH_ERROR_${statusCode}` });
    this.name = "AuthError";

    // Ensures proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, AuthError.prototype);
  }
}

/**
 * Error class for API-related errors
 *
 * @category Errors
 */
export class ApiError extends AppError {
  /**
   * Creates a new API error
   *
   * @param {string} message - Human-readable error message
   * @param {number} statusCode - HTTP status code
   * @param {string} endpoint - API endpoint that triggered the error
   */
  constructor(
    message: string,
    public readonly statusCode: number = 500,
    public readonly endpoint: string = "unknown"
  ) {
    super(message, { code: `API_ERROR_${statusCode}` });
    this.name = "ApiError";

    // Ensures proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/**
 * Error class for database-related errors
 *
 * @category Errors
 */
export class DatabaseError extends AppError {
  /**
   * Creates a new database error
   *
   * @param {string} message - Human-readable error message
   * @param {string} [operation] - Database operation that failed
   * @param {unknown} [originalError] - Original error from database driver
   */
  constructor(
    message: string,
    public readonly operation?: string,
    public readonly originalError?: unknown
  ) {
    super(message, { code: "DATABASE_ERROR" });
    this.name = "DatabaseError";

    // Ensures proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
}

/**
 * Error class for validation-related errors
 *
 * @category Errors
 */
export class ValidationError extends AppError {
  /**
   * Creates a new validation error
   *
   * @param {string} message - Human-readable error message
   * @param {Object} [validationErrors] - Validation errors by field
   */
  constructor(
    message: string,
    public readonly validationErrors: Record<string, string[]> = {}
  ) {
    super(message, { code: "VALIDATION_ERROR" });
    this.name = "ValidationError";

    // Ensures proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Type guards for error checking
 *
 * @category Type Guards
 */

/**
 * Type guard for checking AppError instances
 *
 * @param {unknown} error - Error to check
 * @returns {boolean} Whether the error is an AppError
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

/**
 * Type guard for checking AuthError instances
 *
 * @param {unknown} error - Error to check
 * @returns {boolean} Whether the error is an AuthError
 */
export function isAuthError(error: unknown): error is AuthError {
  return error instanceof AuthError;
}

/**
 * Type guard for checking ApiError instances
 *
 * @param {unknown} error - Error to check
 * @returns {boolean} Whether the error is an ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/**
 * Type guard for checking DatabaseError instances
 *
 * @param {unknown} error - Error to check
 * @returns {boolean} Whether the error is a DatabaseError
 */
export function isDatabaseError(error: unknown): error is DatabaseError {
  return error instanceof DatabaseError;
}

/**
 * Type guard for checking ValidationError instances
 *
 * @param {unknown} error - Error to check
 * @returns {boolean} Whether the error is a ValidationError
 */
export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}
