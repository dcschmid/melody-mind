# Achievement Check API Endpoint

## Overview

The Achievement Check API endpoint evaluates the player's game performance and updates their
achievements after a completed game session. It processes the game state data, validates player
performance, and returns newly unlocked and updated achievements based on predefined conditions.

![Achievement System Diagram](../public/docs/achievement-system-diagram.png)

## Authentication

This endpoint requires authentication via an HTTP-only cookie containing a JWT token. For
development testing, you can obtain an authentication token by:

```bash
# Login first to get the authentication cookie set
curl -X POST https://api.melodymind.com/en/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "your-password"}' \
  --cookie-jar cookies.txt

# Then use the cookie in subsequent requests
curl -X POST https://api.melodymind.com/en/api/achievements/check \
  -H "Content-Type: application/json" \
  -d '{"gameState": {...}, "isPerfectGame": true}' \
  --cookie cookies.txt
```

## Endpoint Details

**URL**: `/{lang}/api/achievements/check`  
**Method**: `POST`  
**Version**: 3.1.0+  
**Rate Limiting**: Standard API rate limiting applies (60 requests per minute)

### URL Parameters

| Parameter | Type              | Required | Description                                     |
| --------- | ----------------- | -------- | ----------------------------------------------- |
| lang      | SupportedLanguage | Yes      | Language code for i18n (e.g., 'en', 'de', 'es') |

### Request Body

```typescript
interface AchievementCheckRequest {
  /** Game state containing player performance data */
  gameState: GameState;
  /** Whether the player achieved a perfect score */
  isPerfectGame: boolean;
}

interface GameState {
  /** Current player score */
  score: number;
  /** Number of correctly answered questions */
  correctAnswers: number;
  /** Current round/question index */
  roundIndex: number;
  /** The current active question or null if no question is active */
  currentQuestion: Question | null;
}
```

### Success Response

**Status Code**: `200 OK`  
**Content Type**: `application/json`

```typescript
interface AchievementCheckSuccessResponse {
  /** Indicates operation success */
  success: true;
  /** Timestamp when achievements were checked */
  timestamp: string; // ISO format date string
  /** Response data containing achievement information */
  data: {
    /** List of newly unlocked achievements */
    unlockedAchievements: Achievement[];
    /** List of achievements with updated progress */
    updatedAchievements: Achievement[];
  };
}

interface Achievement {
  /** Unique ID of the achievement */
  id: string;
  /** Code of the achievement */
  code: string;
  /** ID of the achievement category */
  categoryId: string;
  /** Type of condition for the achievement */
  conditionType: AchievementConditionType;
  /** Value of the condition for the achievement */
  conditionValue: number;
  /** Percentage of players who have unlocked the achievement */
  rarityPercentage: number;
  /** Path to the achievement icon */
  iconPath?: string;
  /** Current progress of the user */
  userProgress?: UserAchievement;
}
```

### Error Responses

| Status Code               | Description                                  | Possible Causes                                    |
| ------------------------- | -------------------------------------------- | -------------------------------------------------- |
| 400 Bad Request           | Invalid request format or missing parameters | Malformed JSON, missing required fields            |
| 401 Unauthorized          | User is not authenticated                    | Missing or expired JWT token                       |
| 429 Too Many Requests     | Rate limit exceeded                          | Too many requests in a short time period           |
| 500 Internal Server Error | Server-side error                            | Database connection issues, service unavailability |

**Error Response Format**:

```typescript
interface ApiErrorResponse {
  /** Always false for error responses */
  success: false;
  /** Error message explaining what went wrong */
  error: string;
  /** Optional error code for client-side handling */
  code?: string;
}
```

## Request Examples

### Example: Checking Achievements After Completing a Game

```typescript
// TypeScript fetch example
const checkAchievements = async (gameState: GameState, isPerfectGame: boolean) => {
  try {
    const response = await fetch("/en/api/achievements/check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        gameState: {
          score: 450,
          correctAnswers: 9,
          totalQuestions: 10,
          roundIndex: 9,
          currentQuestion: null,
        },
        isPerfectGame: false,
      }),
      credentials: "include", // Important: sends cookies with the request
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const result = await response.json();

    // Handle newly unlocked achievements
    if (result.data.unlockedAchievements.length > 0) {
      displayAchievementNotifications(result.data.unlockedAchievements);
    }

    return result;
  } catch (error) {
    console.error("Achievement check failed:", error);
    throw error;
  }
};
```

### Example: Handling a Perfect Game

```typescript
// Example of checking achievements for a perfect game
const handleGameCompletion = async (gameData: GameData) => {
  const gameState: GameState = {
    score: gameData.score,
    correctAnswers: gameData.correctAnswers,
    roundIndex: gameData.questions.length - 1,
    currentQuestion: null,
  };

  // Check if all questions were answered correctly
  const isPerfectGame = gameData.correctAnswers === gameData.questions.length;

  try {
    const achievementResult = await checkAchievements(gameState, isPerfectGame);

    // Process achievement results
    if (achievementResult.data.unlockedAchievements.length > 0) {
      playAchievementSound();
      showAchievementOverlay(achievementResult.data.unlockedAchievements);
    }

    // Update UI to show progress on partial achievements
    updateAchievementProgress(achievementResult.data.updatedAchievements);
  } catch (error) {
    // Handle errors silently to not disrupt the game flow
    console.error("Could not process achievements:", error);

    // Save achievement check for later retry
    saveOfflineAchievementCheck(gameState, isPerfectGame);
  }
};
```

## Response Examples

### Success Response

```json
{
  "success": true,
  "timestamp": "2025-05-17T14:32:45.123Z",
  "data": {
    "unlockedAchievements": [
      {
        "id": "ach_perfect_game",
        "code": "perfect_game",
        "categoryId": "cat_performance",
        "conditionType": "perfect_games",
        "conditionValue": 1,
        "rarityPercentage": 15.2,
        "iconPath": "/icons/achievements/perfect-game.svg",
        "userProgress": {
          "userId": "usr_12345",
          "achievementId": "ach_perfect_game",
          "currentProgress": 1,
          "unlockedAt": "2025-05-17T14:32:45.123Z"
        }
      }
    ],
    "updatedAchievements": [
      {
        "id": "ach_games_played",
        "code": "games_played",
        "categoryId": "cat_engagement",
        "conditionType": "games_played",
        "conditionValue": 10,
        "rarityPercentage": 45.8,
        "iconPath": "/icons/achievements/games-played.svg",
        "userProgress": {
          "userId": "usr_12345",
          "achievementId": "ach_games_played",
          "currentProgress": 8,
          "unlockedAt": null
        }
      }
    ]
  }
}
```

### Error Response: Unauthorized

```json
{
  "success": false,
  "error": "User authentication required",
  "code": "AUTH_ERROR"
}
```

### Error Response: Invalid Request

```json
{
  "success": false,
  "error": "Invalid parameters: gameState is required",
  "code": "VALIDATION_ERROR"
}
```

## Accessibility Considerations

The Achievement Check API adheres to WCAG AAA standards through:

1. **Clear error messages**: All error responses include descriptive error messages that can be
   properly announced by screen readers
2. **Consistent response structure**: The API maintains a consistent response structure for easier
   client-side processing and presentation
3. **Internationalization support**: Error messages and achievement data are available in multiple
   languages via the `lang` parameter
4. **Time-based information**: All timestamps are provided in ISO format for consistent
   representation across clients
5. **Progressive enhancement**: The API gracefully handles offline scenarios to ensure achievement
   data isn't lost

### Client-Side Implementation Guidelines

When implementing achievement notifications in the client:

- Ensure achievements are announced properly to screen readers
- Use ARIA live regions for dynamic achievement notifications
- Provide both visual and audio cues for unlocked achievements
- Maintain sufficient color contrast (7:1 ratio) for achievement displays
- Allow keyboard dismissal of achievement notifications
- Ensure focus management doesn't disrupt user flow

## Related Endpoints

| Endpoint                            | Method | Description                                               |
| ----------------------------------- | ------ | --------------------------------------------------------- |
| `/{lang}/api/achievements/list`     | GET    | Retrieves a list of all achievements with player progress |
| `/{lang}/api/achievements/unlock`   | POST   | Manually unlocks an achievement (admin only)              |
| `/{lang}/api/achievements/progress` | GET    | Gets detailed progress for a specific achievement         |
| `/{lang}/api/achievements/stats`    | GET    | Retrieves achievement statistics for a player             |

## Implementation Notes

1. The endpoint performs asynchronous database operations to track and update user achievements
2. Achievement checks are idempotent - submitting the same game state multiple times won't result in
   duplicate achievements
3. Perfect games are separately tracked via the `isPerfectGame` flag for specific achievements
4. Some achievements update progress incrementally (e.g., games played) while others are binary
   (e.g., perfect game)
5. The endpoint efficiently processes achievements in batches to minimize database operations

## Version History

| Version | Changes                                                          |
| ------- | ---------------------------------------------------------------- |
| 3.1.0   | Added typed GameState validation with improved error handling    |
| 3.0.0   | Initial public release with basic achievement checking           |
| 2.5.0   | Beta version with limited achievement categories (internal only) |

### Breaking Changes in 3.0.0

- Response format changed to include timestamp field
- Achievement IDs now use the `ach_` prefix instead of numeric IDs
- Achievement icons now use SVG format instead of PNG
- Error response contains code field for more precise error handling

## Security Considerations

1. **Rate limiting**: The endpoint is protected by standard API rate limiting to prevent abuse
2. **Authentication**: All requests require a valid authentication token
3. **Input validation**: Strict validation of the GameState object prevents injection attacks
4. **Error handling**: Error messages are descriptive but don't expose internal system details
5. **Audit logging**: All achievement unlocks are logged for security auditing purposes

## Performance Optimization

The achievement checking process is optimized to handle high-traffic scenarios:

1. Use of efficient database queries with indexed fields
2. Caching of frequently accessed achievement definitions
3. Batch processing of achievement updates to reduce database operations
4. Type-safe implementation to avoid runtime type errors

## Troubleshooting

| Issue                     | Possible Cause               | Solution                                                    |
| ------------------------- | ---------------------------- | ----------------------------------------------------------- |
| 401 Unauthorized          | Missing or expired JWT token | Ensure you're logged in and the session hasn't expired      |
| 400 Bad Request           | Malformed game state         | Verify the game state object matches the required structure |
| 429 Too Many Requests     | Rate limit exceeded          | Implement exponential backoff in client retries             |
| 500 Internal Server Error | Server-side issue            | Check server logs, retry later if persistent                |

## Further Resources

- [Achievement System Overview](../docs/database/achievement-system.md)
- [Game State Management](../docs/game-state.md)
- [Authentication System](../docs/authentication.md)
- [API Rate Limiting](../docs/authentication/rate-limiting.md)
