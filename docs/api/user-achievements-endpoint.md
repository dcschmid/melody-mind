# User Achievements Endpoint

## Overview

The User Achievements Endpoint retrieves achievements for the currently authenticated user. It
supports internationalization through language-specific routes and implements robust error handling
and authentication validation.

## Base URL

```
/[lang]/api/achievements/user
```

Where `[lang]` is one of the supported language codes: `en`, `de`, `es`, `fr`, `it`, `nl`, `pt`,
`sv`, or `fi`.

## Authentication

This endpoint requires authentication. Requests must include a valid authentication token, which is
typically provided via cookies or authentication headers as configured in the authentication
middleware.

## Methods

### GET

Retrieves all achievements for the currently authenticated user, localized in the requested
language.

**Version**: 1.0.0+

**URL**: `/[lang]/api/achievements/user`

**URL Parameters**:

| Parameter | Type              | Description                                  | Required |
| --------- | ----------------- | -------------------------------------------- | -------- |
| lang      | SupportedLanguage | Language code for localized achievement data | Yes      |

**Request Headers**:

Headers for authentication as required by the `requireAuth` middleware.

**Response**: `200 OK`

```typescript
interface SuccessResponse {
  success: true;
  achievements: Array<{
    id: string; // Unique identifier for the achievement
    code: string; // Achievement code
    categoryId: string; // Category identifier
    name: string; // Localized name in requested language
    description: string; // Localized description in requested language
    conditionType: string; // Type of condition for unlocking
    conditionValue: number; // Value required to meet the condition
    rarityPercentage: number; // Percentage of players who unlocked this
    progressPercentage: number; // Current progress (0-100)
    status: "locked" | "in-progress" | "unlocked"; // Current status
    unlockedAt: string | null; // ISO timestamp when unlocked, or null
    iconPath?: string; // Path to achievement icon
  }>;
}
```

**Error Responses**:

`401 Unauthorized`

```typescript
interface ErrorResponse {
  success: false;
  error: string; // Localized error message
  code: "AUTH_REQUIRED"; // Error code for client handling
}
```

`500 Internal Server Error`

```typescript
interface ErrorResponse {
  success: false;
  error: string; // Localized error message
  code: "ACHIEVEMENT_ERROR"; // Error code for client handling
}
```

**Example Request**:

```bash
curl -X GET https://melody-mind.example.com/en/api/achievements/user \
  -H "Cookie: session=<valid-session-cookie>"
```

**Example Response**:

```json
{
  "success": true,
  "achievements": [
    {
      "id": "perfect-score-easy",
      "code": "PERFECT_EASY",
      "categoryId": "bronze",
      "name": "Perfect Beginner",
      "description": "Complete an easy quiz with 100% correct answers",
      "conditionType": "perfect_games",
      "conditionValue": 1,
      "rarityPercentage": 25.4,
      "progressPercentage": 100,
      "status": "unlocked",
      "unlockedAt": "2025-05-01T10:30:45Z",
      "iconPath": "/icons/achievements/perfect-score-easy.svg"
    },
    {
      "id": "genre-explorer-rock",
      "code": "GEN_EXP_ROCK",
      "categoryId": "silver",
      "name": "Rock Enthusiast",
      "description": "Play 5 rock genre quizzes",
      "conditionType": "genre_explorer",
      "conditionValue": 5,
      "rarityPercentage": 12.7,
      "progressPercentage": 60,
      "status": "in-progress",
      "unlockedAt": null,
      "iconPath": "/icons/achievements/genre-rock.svg"
    }
  ]
}
```

**Example Error Response**:

```json
{
  "success": false,
  "error": "You must be logged in to view achievements",
  "code": "AUTH_REQUIRED"
}
```

## Implementation Details

### Error Handling

The endpoint implements a custom error type (`AchievementApiError`) for better error classification
and handling:

```typescript
class AchievementApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 500,
    public readonly userId?: UserId
  ) {
    super(message);
    this.name = "AchievementApiError";

    // Maintains proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AchievementApiError);
    }
  }
}
```

Error responses include a consistent structure with error codes to help client-side error handling
and internationalization.

### Internationalization

The endpoint supports multiple languages through the route parameter `[lang]`. Achievement data is
retrieved in the requested language using the `getUserAchievements` service, which returns localized
achievements based on the provided language code.

Translation keys used:

- `errors.auth.unauthorized` - Used when authentication is required
- `errors.achievements.log` - Used for logging detailed error information
- `errors.achievements.unknownError` - Used for unknown error types
- `errors.achievements.fetch` - Used for user-facing error messages

### Security

- Authentication is enforced through the `requireAuth` middleware
- Error messages are sanitized to prevent sensitive information leakage
- Proper HTTP status codes are used for different error scenarios
- Cache control headers prevent caching of sensitive achievement data

### Performance Considerations

- Memoized translation function for repeated translations in error handling
- Consistent response format for predictable client processing
- Type-safe implementation using TypeScript for early error detection

## Response Headers

```
Content-Type: application/json
Cache-Control: no-cache, no-store, must-revalidate
```

## Related Services and Components

- [Achievement Service](../services/achievement-service.md) - Handles achievement data retrieval and
  processing
- [Authentication Middleware](../middleware/auth.md) - Manages user authentication
- [Internationalization Utilities](../utils/i18n.md) - Provides translation functionality

## Accessibility

While this is an API endpoint rather than a UI component, the structured response format enables
client-side components to create accessible achievement displays:

- Consistent data structure allows for predictable screen reader announcements
- Progress percentage enables accessible progress indicators
- Error codes assist in providing meaningful error messages to users
- Language-specific achievement data supports multi-language screen readers

## Changelog

- v3.0.0 - Added type-safe error handling with `AchievementApiError` class and improved response
  type safety
- v2.0.0 - Added internationalization support and achievement status information
- v1.0.0 - Initial implementation of user achievements endpoint

## Type Definitions

For complete type definitions related to achievements, refer to the
[Achievement Types](../../types/achievement.md) documentation.

```typescript
// Core response type definitions
type ApiResponse = SuccessResponse | ErrorResponse;

interface SuccessResponse {
  success: true;
  achievements: LocalizedAchievement[];
}

interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
}
```

## Testing

Test this endpoint using the provided curl command or a tool like Postman. Ensure you have a valid
authentication token before testing. For testing unauthorized scenarios, simply omit the
authentication token.
