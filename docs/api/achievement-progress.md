# Achievement Progress API

## Overview

The Achievement Progress API endpoint allows updating a user's progress on specific achievements in
the MelodyMind application. This endpoint handles authentication, validation, and persistence of
achievement progress.

## Base URL

```
/[lang]/api/achievements/progress
```

Where `[lang]` is the language code (e.g., `en`, `de`, `fr`).

## Authentication

This endpoint requires authentication. Users must be logged in to update their achievement progress.

## Methods

### Update Achievement Progress

Updates the progress value for a specific achievement for the authenticated user.

**URL**: `/[lang]/api/achievements/progress`  
**Method**: `POST`  
**Version**: 3.0+  
**Content-Type**: `application/json`

#### Request Body

```typescript
interface AchievementProgressRequest {
  /**
   * ID of the achievement to update
   * Must be a valid achievement ID
   */
  achievementId: string;

  /**
   * New progress value
   * Must be a non-negative number
   */
  progress: number;
}
```

#### Success Response

**Code**: `200 OK`

```typescript
interface SuccessResponse {
  /** Operation status */
  success: true;

  /** Updated user achievement data */
  userAchievement: {
    /** User ID */
    userId: string;

    /** Achievement ID */
    achievementId: string;

    /** Current progress value */
    progress: number;

    /** Whether the achievement is completed */
    completed: boolean;

    /** Timestamp of when the achievement was completed (if applicable) */
    completedAt?: string;

    /** Timestamp of last update */
    updatedAt: string;
  };
}
```

#### Error Responses

**Unauthorized** (401)

```json
{
  "success": false,
  "error": "You must be logged in to update achievement progress"
}
```

**Bad Request** (400)

```json
{
  "success": false,
  "error": "Invalid request format"
}
```

or

```json
{
  "success": false,
  "error": "Invalid parameters"
}
```

**Server Error** (500)

```json
{
  "success": false,
  "error": "An error occurred while updating achievement progress"
}
```

## Example Usage

### Request

```bash
curl -X POST https://melodymind.example.com/en/api/achievements/progress \
  -H "Content-Type: application/json" \
  -H "Cookie: session=user-session-token" \
  -d '{
    "achievementId": "perfect-score-easy",
    "progress": 3
  }'
```

### Success Response

```json
{
  "success": true,
  "userAchievement": {
    "userId": "user-123",
    "achievementId": "perfect-score-easy",
    "progress": 3,
    "completed": false,
    "updatedAt": "2025-05-17T14:30:45Z"
  }
}
```

## Implementation Notes

The Achievement Progress API uses several optimized components for performance and reliability:

1. **LRU Caching**: Responses are cached using a Least Recently Used (LRU) caching algorithm to
   improve performance for repeated requests.

2. **Type Safety**: The implementation uses TypeScript's branded types for stronger type checking of
   achievement IDs.

3. **Input Validation**: Request payloads undergo strict validation to ensure data integrity:

   - Achievement IDs must match the pattern: `/^[a-zA-Z0-9_-]+$/`
   - Progress values must be non-negative numbers

4. **Error Handling**: The API implements specialized error handling that provides appropriate HTTP
   status codes and localized error messages.

5. **Internationalization**: Error messages are automatically translated based on the language
   specified in the URL.

## Performance Considerations

The endpoint employs several performance optimizations:

- **Response Caching**: Successful responses are cached to reduce database load
- **Minimal Payload**: Only essential data is included in responses
- **Efficient Validation**: Request validation is optimized for quick rejection of invalid requests
- **Type-Safe Operations**: Implementation leverages TypeScript's type system to prevent runtime
  errors

## Security Considerations

- **Authentication Required**: All requests must come from authenticated users
- **User Data Protection**: Users can only update their own achievement progress
- **Input Sanitization**: Achievement IDs are validated against a strict pattern
- **No Sensitive Data in Cache**: Responses containing user IDs are not cached

## Rate Limiting

This endpoint is subject to the global API rate limiting policy:

- 100 requests per minute per authenticated user
- 10 requests per minute per IP address for unauthenticated requests

Exceeding these limits will result in a `429 Too Many Requests` response.

## Related Resources

- [Achievement Types](../types/Achievements.md)
- [Achievement Service](../services/AchievementService.md)
- [Authentication Middleware](../middleware/Authentication.md)
- [LRUCache Utility](../utils/LRUCache.md)

## Changelog

- **v3.1.0** - Added improved caching, enhanced validation, and better error handling
- **v3.0.0** - Initial implementation of achievement progress update endpoint
