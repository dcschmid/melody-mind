# Achievement Unlock API Endpoint

## Overview

The Achievement Unlock API endpoint allows clients to unlock achievements for the currently
authenticated user. This endpoint verifies authentication, validates the request data, and updates
the achievement status in the database. It's a critical component of the MelodyMind game's reward
and progression system.

![Achievement System Architecture](../architecture/images/achievement-system-diagram.png)

## API Details

| Property       | Value                             |
| -------------- | --------------------------------- |
| **Endpoint**   | `/[lang]/api/achievements/unlock` |
| **Method**     | `POST`                            |
| **Version**    | Since 3.1.0                       |
| **Auth**       | Required                          |
| **Rate Limit** | 60 requests per minute            |

## URL Parameters

| Parameter | Type     | Required | Description                                                |
| --------- | -------- | -------- | ---------------------------------------------------------- |
| `lang`    | `string` | Yes      | The language code for i18n translations (e.g., 'en', 'de') |

## Request Body

The request must contain a JSON object with the following structure:

```typescript
interface AchievementUnlockPayload {
  /** ID of the achievement to unlock */
  achievementId: string; // Must follow the format 'achievement-{number}'
}
```

### Example Request Body

```json
{
  "achievementId": "achievement-123"
}
```

## Response Format

The response is a JSON object with the following structure:

```typescript
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

### UserAchievement Structure

```typescript
interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  unlockedAt: string; // ISO 8601 date string
  progress: number; // Progress percentage (0-100)
  completed: boolean;
}
```

## Response Status Codes

| Status Code | Description                       |
| ----------- | --------------------------------- |
| 200         | Achievement successfully unlocked |
| 400         | Invalid request or parameters     |
| 401         | Not authenticated                 |
| 500         | Server error during unlocking     |

## Headers

### Request Headers

| Header          | Value                | Required | Description                 |
| --------------- | -------------------- | -------- | --------------------------- |
| `Content-Type`  | `application/json`   | Yes      | Indicates JSON request body |
| `Authorization` | `Bearer {jwt-token}` | Yes      | User authentication token   |

### Response Headers

| Header          | Value                                 | Description                        |
| --------------- | ------------------------------------- | ---------------------------------- |
| `Content-Type`  | `application/json`                    | Indicates JSON response            |
| `Cache-Control` | `no-store, no-cache, must-revalidate` | Prevents caching of sensitive data |

## Authentication

This endpoint requires authentication. The request must include a valid JWT token in the
Authorization header. If authentication fails, the endpoint returns a 401 Unauthorized response or
redirects to the login page.

## Error Handling

The endpoint uses structured error handling with specific error types for different failure
scenarios:

### Error Types

- **Invalid Request Format**: Occurs when the request body is not valid JSON
- **Invalid Parameters**: Occurs when the request body does not match the expected structure
- **Invalid Achievement ID**: Occurs when the achievement ID format is invalid
- **Achievement Not Found**: Occurs when the requested achievement does not exist
- **Authentication Error**: Occurs when the user is not authenticated
- **Internal Server Error**: Occurs for unexpected server-side issues

Each error response includes:

- A `success: false` flag
- An error message localized to the requested language
- A unique `errorId` for log correlation (in case of server errors)

### Error Example

```json
{
  "success": false,
  "error": "Invalid achievement ID format. Expected format: achievement-{number}",
  "errorId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

## Example Requests

### cURL

```bash
curl -X POST https://melodymind.com/en/api/achievements/unlock \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{"achievementId": "achievement-123"}'
```

### JavaScript (Fetch API)

```javascript
const unlockAchievement = async (achievementId, lang = "en") => {
  try {
    const response = await fetch(`/${lang}/api/achievements/unlock`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`, // User token from auth system
      },
      body: JSON.stringify({ achievementId }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Failed to unlock achievement: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Achievement unlock error:", error);
    throw error;
  }
};

// Usage
try {
  const result = await unlockAchievement("achievement-123");
  console.log("Achievement unlocked:", result.userAchievement);
} catch (err) {
  console.error("Failed to unlock achievement:", err.message);
}
```

### TypeScript (Axios)

```typescript
import axios from "axios";
import type { UnlockResponse, UserAchievement } from "../types/achievement";

interface UnlockAchievementOptions {
  achievementId: string;
  lang?: string;
}

/**
 * Unlocks an achievement for the current user
 *
 * @since 3.1.0
 * @param {UnlockAchievementOptions} options - The options for unlocking an achievement
 * @returns {Promise<UserAchievement>} The updated user achievement
 * @throws {Error} If the achievement cannot be unlocked
 */
async function unlockAchievement({
  achievementId,
  lang = "en",
}: UnlockAchievementOptions): Promise<UserAchievement> {
  try {
    const response = await axios.post<UnlockResponse>(
      `/${lang}/api/achievements/unlock`,
      { achievementId },
      {
        headers: {
          "Content-Type": "application/json",
          // Authorization header added by axios interceptor
        },
      }
    );

    if (!response.data.success || !response.data.userAchievement) {
      throw new Error(response.data.error || "Failed to unlock achievement");
    }

    return response.data.userAchievement;
  } catch (error) {
    // Enhance error with more context
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error || error.message;
      const errorId = error.response?.data?.errorId;

      throw new Error(
        `Achievement unlock failed: ${errorMessage}${errorId ? ` [ErrorID: ${errorId}]` : ""}`
      );
    }

    throw error;
  }
}
```

## Success Response Example

```json
{
  "success": true,
  "userAchievement": {
    "id": "ua-456",
    "userId": "user-789",
    "achievementId": "achievement-123",
    "unlockedAt": "2025-05-17T14:32:10.432Z",
    "progress": 100,
    "completed": true
  }
}
```

## Error Response Examples

### Invalid Achievement ID

```json
{
  "success": false,
  "error": "Invalid achievement ID format"
}
```

### Authentication Error

```json
{
  "success": false,
  "error": "User authentication required"
}
```

### Server Error

```json
{
  "success": false,
  "error": "An error occurred while unlocking the achievement",
  "errorId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

## Internationalization

The endpoint supports localization through the `lang` URL parameter. Error messages are
automatically translated into the requested language. Translation keys include:

- `errors.auth.unauthorized` - For authentication errors
- `errors.invalidRequest` - For invalid JSON format
- `errors.invalidParameters` - For missing or invalid parameters
- `errors.achievements.invalidId` - For invalid achievement ID format
- `errors.achievements.unlock` - For general unlock errors
- `errors.achievements.unknownError` - For unexpected errors

## Implementation Notes

### Type Safety

The endpoint uses TypeScript's branded types to ensure type safety for achievement IDs:

```typescript
type AchievementId = string & {
  readonly __brand: unique symbol;
  readonly __achievementIdBrand: "AchievementId";
};
```

This approach prevents accidental assignment of raw strings to achievement ID parameters, enforcing
validation.

### Caching Strategy

- Success responses are never cached (uses `no-store, no-cache` headers)
- Error responses with identical messages are cached in memory for performance
- Each request uses a unique correlation ID for tracking in logs

### Error Correlation

All server errors generate a unique `errorId` that is:

1. Included in the error response to the client
2. Logged in the server logs with detailed error information
3. Can be used by support staff to locate specific error instances

## Security Considerations

- The endpoint validates all input data before processing
- Achievement IDs must follow the `achievement-{number}` pattern
- Request bodies are limited to 4KB to prevent abuse
- All requests require valid authentication
- Error messages are designed to avoid information disclosure

## Performance Optimization

- Common error responses are memoized to reduce overhead
- Achievement ID validation uses regex pattern matching for efficiency
- Database operations use optimized queries with proper indexes

## Related Endpoints

- [Achievement Check](./achievement-check.md) - Check if an achievement is unlocked
- [Achievement Progress](./achievement-progress.md) - Update achievement progress
- [Achievement List](./achievements.md) - Get all available achievements

## Breaking Changes

### Version 3.1.0

- Added `errorId` field to error responses
- Enhanced error handling with more specific error types
- Improved validation for achievement ID format

### Version 3.0.0

- Changed response format to always include `success` flag
- Added branded type for achievement IDs
- Achievement ID format now strictly enforces `achievement-{number}` pattern

## Testing

When testing this endpoint, consider the following scenarios:

```typescript
// Test cases to cover:
// 1. Successfully unlocking a new achievement
// 2. Attempting to unlock an already unlocked achievement
// 3. Attempting to unlock with invalid achievement ID format
// 4. Attempting to unlock a non-existent achievement
// 5. Requesting without authentication
// 6. Requesting with malformed JSON
```

## Technical Support

If users encounter issues with this endpoint, ask them to provide:

1. The full request they attempted (without authentication tokens)
2. The complete error response, including the `errorId`
3. The timestamp of the request
4. The language code used in the request

## Accessibility Considerations

While this is an API endpoint without direct UI components, consider these accessibility factors:

- Error messages are designed to be clear and descriptive for screen readers
- The endpoint follows RESTful principles for predictable behavior
- Response structures are consistent for reliable client-side rendering
