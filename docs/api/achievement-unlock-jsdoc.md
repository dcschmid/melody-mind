# Achievement Unlock API JSDoc Documentation

## Overview

This document provides comprehensive JSDoc documentation for the key functions and types in the
Achievement Unlock API endpoint.

## API Route Handler

```typescript
/**
 * POST route handler for the achievement unlock endpoint
 *
 * This endpoint unlocks an achievement for the current user.
 * It verifies authentication, validates the request data, and unlocks
 * the achievement in the database.
 *
 * @since 3.1.0
 * @category API
 *
 * @param {Object} context - Astro API route context
 * @param {Request} context.request - The HTTP request object
 * @param {Object} context.params - Route parameters from the URL
 * @param {string} context.params.lang - The language code for i18n translations
 *
 * @returns {Promise<Response>} HTTP response
 * - 200: Achievement successfully unlocked, returns updated user achievement data
 * - 400: Invalid request or parameters
 * - 401: Not authenticated
 * - 500: Server error during unlocking
 *
 * @example
 * // Example client-side request:
 * fetch('/de/api/achievements/unlock', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({ achievementId: "achievement-123" })
 * });
 */
export const POST: APIRoute = async ({ request, params }) => {
  // Implementation details...
};
```

## Core Types

### AchievementId Branded Type

```typescript
/**
 * Achievement ID type with branded type pattern for better type safety
 * This implementation uses a symbol-based branded type for strict nominal typing
 *
 * @since 3.1.0
 * @category Types
 *
 * @typedef {string & {
 *   readonly __brand: unique symbol;
 *   readonly __achievementIdBrand: "AchievementId";
 * }} AchievementId
 *
 * @example
 * // Creating a validated achievement ID
 * function validateId(rawId: string): AchievementId {
 *   // Validation logic here
 *   return rawId as AchievementId;
 * }
 *
 * // Using the type in a function signature
 * function processAchievement(id: AchievementId) {
 *   // Type-safe implementation
 * }
 */
type AchievementId = string & {
  readonly __brand: unique symbol;
  readonly __achievementIdBrand: "AchievementId";
};
```

### HTTP Status Codes

```typescript
/**
 * HTTP status codes used in this API endpoint
 *
 * @since 3.1.0
 * @category Constants
 *
 * @constant
 * @type {Readonly<{
 *   OK: 200,
 *   BAD_REQUEST: 400,
 *   UNAUTHORIZED: 401,
 *   INTERNAL_SERVER_ERROR: 500
 * }>}
 */
const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  INTERNAL_SERVER_ERROR: 500,
} as const;
```

### AchievementUnlockErrorKey Type

```typescript
/**
 * Type definitions for translation keys used in this API endpoint
 *
 * @since 3.1.0
 * @category i18n
 *
 * @typedef {"errors.auth.unauthorized" |
 *           "errors.invalidRequest" |
 *           "errors.invalidParameters" |
 *           "errors.achievements.unlock" |
 *           "errors.achievements.invalidId" |
 *           "errors.achievements.unknownError"} AchievementUnlockErrorKey
 */
type AchievementUnlockErrorKey =
  | "errors.auth.unauthorized"
  | "errors.invalidRequest"
  | "errors.invalidParameters"
  | "errors.achievements.unlock"
  | "errors.achievements.invalidId"
  | "errors.achievements.unknownError";
```

### Translation Function Type

```typescript
/**
 * Type-safe translation function for achievement errors
 * Provides specialized signatures for different error types
 *
 * @since 3.1.0
 * @category i18n
 *
 * @typedef {Object} TranslationFunction
 *
 * @callback TranslationFunctionWithVars
 * @param {string} key - The translation key for invalid request errors
 * @param {{ error: string }} vars - Variables for the translation, including the specific error message
 * @returns {string} The translated error message
 *
 * @callback TranslationFunctionSimple
 * @param {Exclude<AchievementUnlockErrorKey, "errors.invalidRequest">} key - The translation key
 * @returns {string} The translated error message
 *
 * @example
 * // Using the translation function with error details
 * const errorMessage = t("errors.invalidRequest", { error: "JSON parsing failed" });
 *
 * // Using the translation function for simple messages
 * const unauthorizedMessage = t("errors.auth.unauthorized");
 */
type TranslationFunction = {
  (key: "errors.invalidRequest", vars: { error: string }): string;
  (key: Exclude<AchievementUnlockErrorKey, "errors.invalidRequest">): string;
};
```

### Achievement Unlock Payload

```typescript
/**
 * Request payload with proper type constraints
 *
 * @since 3.1.0
 * @category API
 *
 * @typedef {Object} AchievementUnlockPayload
 * @property {string} achievementId - ID of the achievement to unlock
 *
 * @example
 * const validPayload: AchievementUnlockPayload = {
 *   achievementId: "achievement-123"
 * };
 */
interface AchievementUnlockPayload {
  /** ID of the achievement to unlock */
  achievementId: string;
}
```

### Unlock Response

```typescript
/**
 * Response structure for achievement unlock operation
 *
 * @since 3.1.0
 * @category API
 *
 * @typedef {Object} UnlockResponse
 * @property {boolean} success - Whether the operation was successful
 * @property {UserAchievement} [userAchievement] - Updated user achievement data if successful
 * @property {string} [error] - Error message if unsuccessful
 * @property {string} [errorId] - Unique error identifier for log correlation
 *
 * @example
 * // Success response
 * const successResponse: UnlockResponse = {
 *   success: true,
 *   userAchievement: {
 *     id: "ua-123",
 *     userId: "user-456",
 *     achievementId: "achievement-123",
 *     unlockedAt: new Date().toISOString(),
 *     progress: 100,
 *     completed: true
 *   }
 * };
 *
 * // Error response
 * const errorResponse: UnlockResponse = {
 *   success: false,
 *   error: "Invalid achievement ID format",
 *   errorId: "abc123"
 * };
 */
interface UnlockResponse {
  /** Whether the operation was successful */
  success: boolean;
  /** Updated user achievement data if successful */
  userAchievement?: UserAchievement;
  /** Error message if unsuccessful */
  error?: string;
  /** Unique error identifier for log correlation */
  errorId?: string;
}
```

## Error Handling

### AchievementUnlockError Class

```typescript
/**
 * Achievement unlock error class for specialized error handling
 * Provides additional context and information for error responses
 *
 * @since 3.1.0
 * @category Errors
 *
 * @class
 * @extends {Error}
 *
 * @example
 * throw new AchievementUnlockError(
 *   "Invalid achievement ID format",
 *   HTTP_STATUS.BAD_REQUEST,
 *   originalError,
 *   { userId, achievementId }
 * );
 */
class AchievementUnlockError extends Error {
  /**
   * Creates a new achievement unlock error
   *
   * @constructor
   * @param {string} message - Error message
   * @param {number} status - HTTP status code
   * @param {unknown} [cause] - The underlying error that caused this error
   * @param {Record<string, unknown>} [metadata] - Additional contextual information about the error
   */
  constructor(
    message: string,
    public readonly status: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    public readonly cause?: unknown,
    public readonly metadata?: Record<string, unknown>
  ) {
    super(message);
    this.name = "AchievementUnlockError";

    // Capture stack trace (works better with modern Error subclassing)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Serializes the error for logging and debugging purposes
   *
   * @returns {Record<string, unknown>} Serialized representation of the error
   */
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      stack: this.stack,
      cause:
        this.cause instanceof Error
          ? { name: this.cause.name, message: this.cause.message }
          : this.cause,
      metadata: this.metadata,
    };
  }
}
```

### Error Type Guard

```typescript
/**
 * Type guard to check if an error is an AchievementUnlockError
 * Uses instanceof pattern for reliable type narrowing
 *
 * @since 3.1.0
 * @category Utilities
 *
 * @param {unknown} error - The error to check
 * @returns {error is AchievementUnlockError} Type predicate indicating the error type
 *
 * @example
 * try {
 *   // Some operation that might throw
 * } catch (err) {
 *   if (isAchievementUnlockError(err)) {
 *     // Can safely access err.status and other AchievementUnlockError properties
 *     console.error(`Error status: ${err.status}`);
 *   }
 * }
 */
function isAchievementUnlockError(error: unknown): error is AchievementUnlockError {
  return error instanceof AchievementUnlockError;
}
```

## Helper Functions

### Create JSON Response

```typescript
/**
 * Creates a JSON response with appropriate headers
 * Uses memoization pattern to cache common responses
 *
 * @since 3.1.0
 * @category Utilities
 *
 * @function
 * @param {UnlockResponse} data - Response data
 * @param {number} status - HTTP status code
 * @returns {Response} HTTP response
 *
 * @example
 * // Create an error response
 * const errorResponse: UnlockResponse = {
 *   success: false,
 *   error: t("errors.invalidParameters")
 * };
 *
 * return createJsonResponse(errorResponse, HTTP_STATUS.BAD_REQUEST);
 */
const createJsonResponse = (() => {
  const cache = new Map<string, Response>();

  return function (data: UnlockResponse, status: number): Response {
    // Implementation details...
  };
})();
```

### Validate Request

```typescript
/**
 * Validates if a request payload has the correct structure for achievement unlock
 * Uses TypeScript type narrowing for robust type validation
 *
 * @since 3.1.0
 * @category Validation
 *
 * @param {unknown} data - The data to validate
 * @returns {data is AchievementUnlockPayload} Type predicate indicating if data is a valid unlock request
 *
 * @example
 * const data = await request.json();
 *
 * if (!isValidUnlockRequest(data)) {
 *   return createJsonResponse(
 *     { success: false, error: "Invalid request format" },
 *     HTTP_STATUS.BAD_REQUEST
 *   );
 * }
 *
 * // Now TypeScript knows data is an AchievementUnlockPayload
 * const { achievementId } = data;
 */
function isValidUnlockRequest(data: unknown): data is AchievementUnlockPayload {
  // Implementation details...
}
```

### Validate Achievement ID

```typescript
/**
 * Safely creates a typed AchievementId from a string
 * Performs validation before casting to ensure type safety
 *
 * @since 3.1.0
 * @category Validation
 *
 * @param {string} id - The achievement ID to validate and cast
 * @returns {AchievementId} The typed achievement ID
 * @throws {AchievementUnlockError} If the ID is invalid
 *
 * @example
 * try {
 *   // Validate and convert to branded type
 *   const typedId = validateAchievementId("achievement-123");
 *
 *   // Now we can safely use it with functions requiring AchievementId
 *   await unlockAchievement(user.id, typedId);
 * } catch (error) {
 *   // Handle validation error
 * }
 */
function validateAchievementId(id: string): AchievementId {
  // Implementation details...
}
```

## Complete Flow

```typescript
/**
 * The complete achievement unlock process follows these steps:
 *
 * 1. Extract language from URL parameters for localized messages
 * 2. Verify user authentication
 * 3. Parse and validate request body
 * 4. Validate achievement ID format
 * 5. Call achievement service to unlock the achievement
 * 6. Handle specific error cases
 * 7. Return appropriate response with status code
 *
 * Error handling is implemented at multiple levels:
 * - Request validation errors
 * - Authentication errors
 * - Achievement validation errors
 * - Service-level errors
 * - Unexpected server errors
 *
 * Each error type results in an appropriate HTTP status code and localized error message.
 */
```

## Security Considerations

```typescript
/**
 * Security measures implemented in this endpoint:
 *
 * 1. Authentication verification through middleware
 * 2. Input validation before processing
 * 3. Type safety with branded types
 * 4. Proper error handling without information leakage
 * 5. Unique error IDs for correlation without exposing internals
 * 6. Parameterized error messages for localization
 * 7. Cache-Control headers to prevent sensitive data caching
 */
```

## Accessibility and Internationalization

```typescript
/**
 * Accessibility and internationalization features:
 *
 * 1. All error messages use translation keys for localization
 * 2. Translation function supports parameterized messages
 * 3. Response format is consistent for predictable client rendering
 * 4. Error correlation IDs help support staff assist users
 * 5. Clear error categories help users understand issues
 */
```
