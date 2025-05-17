/\*\*

- AchievementApiError Class
-
- @since 3.0.0
- @class
- @extends Error
- @category API Errors
- @description Specialized error class for achievement-related API operations that provides
- additional context such as HTTP status code and associated user identifier.
-
- @example
- // Creating a basic error with default status code (500)
- throw new AchievementApiError("Failed to fetch user achievements");
-
- @example
- // Creating an error with custom status code
- throw new AchievementApiError("Achievement not found", 404);
-
- @example
- // Creating an error with user context
- throw new AchievementApiError(
- "User has no permission to view this achievement",
- 403,
- user.id
- );
-
- @example
- // Error handling with type guard
- try {
- await getUserAchievements(userId);
- } catch (error) {
- if (isAchievementApiError(error)) {
-     console.error(`Achievement API error (${error.statusCode}): ${error.message}`);
-     if (error.userId) {
-       console.error(`Affected user: ${error.userId}`);
-     }
- } else {
-     console.error("Unknown error:", error);
- }
- } \*/ export class AchievementApiError extends Error { /\*\*
  - Creates a new AchievementApiError instance
  -
  - @param {string} message - Error message describing what went wrong
  - @param {number} [statusCode=500] - HTTP status code to be used in the API response
  - @param {UserId} [userId] - Optional identifier of the user related to this error \*/
    constructor( message: string, public readonly statusCode: number = 500, public readonly userId?:
    UserId ) { super(message); this.name = "AchievementApiError";


      // Maintains proper stack trace for where our error was thrown (only available on V8)
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, AchievementApiError);
      }
  } }

/\*\*

- Type guard to check if an error is an AchievementApiError
-
- @since 3.0.0
- @function isAchievementApiError
- @category Type Guards
- @description Provides type safety when handling errors by checking if an unknown error
- is specifically an AchievementApiError instance.
-
- @param {unknown} error - The error to check
- @returns {boolean} True if the error is an AchievementApiError, false otherwise
-
- @example
- // Using in a catch block with type narrowing
- try {
- const achievements = await fetchUserAchievements(userId);
- } catch (error: unknown) {
- if (isAchievementApiError(error)) {
-     // TypeScript now knows error is AchievementApiError
-     console.error(`API error ${error.statusCode}: ${error.message}`);
-
-     // Handle based on status code
-     if (error.statusCode === 404) {
-       // Handle not found
-     } else if (error.statusCode === 403) {
-       // Handle forbidden
-     }
- } else if (error instanceof Error) {
-     // Handle generic Error
- } else {
-     // Handle unknown error type
- }
- } \*/ export function isAchievementApiError(error: unknown): error is AchievementApiError { return
  error instanceof AchievementApiError; }
