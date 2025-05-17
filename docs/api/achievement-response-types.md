# Achievement API Response Types

## Overview

This document details the type definitions used for API responses in the achievements system,
providing a consistent structure for success and error responses.

## Type Definitions

### API Response Types

The achievement API endpoints use a discriminated union pattern for type-safe responses. All
responses include a `success` boolean field that determines the response shape.

```typescript
/**
 * API Response Type using discriminated union for type safety
 * @since 3.0.0
 */
type ApiResponse = SuccessResponse | ErrorResponse;
```

### Success Response

Used when an operation completes successfully, containing achievement data.

```typescript
/**
 * Type-safe response interface for successful operations
 * @since 3.0.0
 */
interface SuccessResponse {
  /** Indicates successful operation */
  success: true;
  /** Collection of localized achievements */
  achievements: LocalizedAchievement[];
}
```

### Error Response

Used when an operation fails, providing error details and optional error code.

```typescript
/**
 * Error response with consistent structure
 * @since 3.0.0
 */
interface ErrorResponse {
  /** Indicates failed operation */
  success: false;
  /** User-friendly error message (should be localized) */
  error: string;
  /** Optional error code for programmatic handling */
  code?: string;
}
```

## Common Error Codes

| Code                    | Description                          | Typical Status Code |
| ----------------------- | ------------------------------------ | ------------------- |
| `AUTH_REQUIRED`         | User is not authenticated            | 401                 |
| `ACHIEVEMENT_ERROR`     | General achievement processing error | 500                 |
| `ACHIEVEMENT_NOT_FOUND` | Requested achievement doesn't exist  | 404                 |
| `INVALID_REQUEST`       | Request parameters are invalid       | 400                 |

## Usage Examples

### Creating API Responses

```typescript
/**
 * Helper function to create consistent API responses with improved type safety
 *
 * @since 3.0.0
 * @template T - The data type for success responses
 *
 * @param {Object} options - Options for creating the response
 * @param {boolean} options.success - Whether the operation was successful
 * @param {number} options.status - HTTP status code to return
 * @param {T | null} [options.data] - Achievement data for successful responses
 * @param {string | null} [options.errorMessage] - Error message for failed responses
 * @param {string | null} [options.errorCode] - Optional error code for failed responses
 * @returns {Response} A properly formatted HTTP response
 */
const createApiResponse = <T extends LocalizedAchievement[]>({
  success,
  status,
  data = null,
  errorMessage = null,
  errorCode = null,
}: {
  success: boolean;
  status: number;
  data?: T | null;
  errorMessage?: string | null;
  errorCode?: string | null;
}): Response => {
  const responseBody: ApiResponse = success
    ? { success: true, achievements: data as T }
    : {
        success: false,
        error: errorMessage ?? "Unknown error",
        ...(errorCode && { code: errorCode }),
      };

  return new Response(JSON.stringify(responseBody), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
};
```

### Example: Success Response

```typescript
// Return achievements with 200 status
return createApiResponse({
  success: true,
  status: 200,
  data: achievements,
});
```

### Example: Error Response

```typescript
// Return authentication error
return createApiResponse({
  success: false,
  status: 401,
  errorMessage: t("errors.auth.unauthorized"),
  errorCode: "AUTH_REQUIRED",
});
```

## Type Safety Benefits

The discriminated union pattern provides several benefits:

1. **Type narrowing:** Checking the `success` property automatically narrows the type
2. **Exhaustive checks:** TypeScript can verify all possible cases are handled
3. **Consistent structure:** Client code can rely on a predictable API contract
4. **Error prevention:** Prevents mixing success and error response properties

### Example: Client-side Type Narrowing

```typescript
async function fetchUserAchievements(userId: string): Promise<LocalizedAchievement[]> {
  const response = await fetch(`/api/achievements/user`);
  const data: ApiResponse = await response.json();

  if (data.success) {
    // TypeScript knows data.achievements exists
    return data.achievements;
  } else {
    // TypeScript knows data.error exists
    throw new Error(`Failed to fetch achievements: ${data.error}`);
  }
}
```

## Best Practices

1. **Always use the discriminated union:** Never mix success and error properties
2. **Include error codes:** Helps client applications handle errors programmatically
3. **Localize error messages:** All user-facing messages should be translated
4. **Use specific HTTP status codes:** Match the status code to the error situation
5. **Consistent headers:** Always include appropriate Content-Type and cache headers

## Related Types

For complete achievement data types, refer to the [Achievement Types](../../types/achievement.md)
documentation.
