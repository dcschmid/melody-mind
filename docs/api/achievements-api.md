# Achievements API

## Overview

The Achievements API provides access to all game achievements available in MelodyMind. This endpoint
supports internationalization (i18n) and returns achievement data in the requested language.

![Achievements System Diagram](../../public/docs/achievements-system.png)

## Base URL

```
/[lang]/api/achievements
```

Where `[lang]` is a supported language code (e.g., `en`, `de`, `fr`).

## Authentication

This endpoint currently does not require authentication as achievements are publicly viewable.
Future versions may restrict certain achievement data to authenticated users only.

## Endpoints

### Get All Achievements

Retrieves a complete list of achievements available in the game.

**URL**: `GET /[lang]/api/achievements`

**Method**: `GET`

**Version**: 3.0.0+

**URL Parameters**:

| Parameter | Type   | Required | Description                                   |
| --------- | ------ | -------- | --------------------------------------------- |
| lang      | string | Yes      | Language code (ISO 639-1) for localized texts |

**Query Parameters**: None

**Request Body**: None

**Success Response**: `200 OK`

```typescript
interface AchievementResponse {
  status: "success";
  data: {
    achievements: Achievement[];
  };
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  points: number;
  isSecret: boolean;
  unlockedBy?: string; // Only present for non-secret achievements
  requirements?: AchievementRequirement[]; // Optional array of unlock requirements
}

interface AchievementRequirement {
  type: "score" | "completion" | "streak" | "perfect";
  value: number;
  description: string;
}
```

**Error Responses**:

- `400 Bad Request` - Invalid language parameter

  ```typescript
  {
    status: "error",
    message: string, // Localized error message
    code: "INVALID_LANGUAGE",
    details?: {
      providedLang?: string // The invalid language code that was provided
    }
  }
  ```

- `500 Internal Server Error` - Server error while fetching achievements
  ```typescript
  {
    status: "error",
    message: string, // Localized error message
    code: "ACHIEVEMENT_FETCH_ERROR" | "ACHIEVEMENT_DATABASE_ERROR" | "ACHIEVEMENT_UNKNOWN_ERROR",
    details?: {
      timestamp: string // ISO date string of when the error occurred
    }
  }
  ```

## Example Requests

### Basic Request (English)

```bash
curl -X GET https://melodymind.example.com/en/api/achievements
```

### Localized Request (German)

```bash
curl -X GET https://melodymind.example.com/de/api/achievements
```

## Example Responses

### Success Response

```json
{
  "status": "success",
  "data": {
    "achievements": [
      {
        "id": "perfect-score-easy",
        "name": "Perfect Beginner",
        "description": "Score 100% on any easy quiz",
        "imageUrl": "/icons/achievements/perfect-beginner.png",
        "category": "completion",
        "difficulty": "easy",
        "points": 50,
        "isSecret": false,
        "unlockedBy": "Complete any easy quiz with all correct answers",
        "requirements": [
          {
            "type": "score",
            "value": 500,
            "description": "Maximum score on easy difficulty"
          }
        ]
      },
      {
        "id": "rock-master",
        "name": "Rock Legend",
        "description": "Complete all rock quizzes on hard difficulty",
        "imageUrl": "/icons/achievements/rock-legend.png",
        "category": "genre",
        "difficulty": "hard",
        "points": 200,
        "isSecret": false,
        "unlockedBy": "Win all rock category quizzes on hard difficulty"
      }
    ]
  }
}
```

### Error Response (Invalid Language)

```json
{
  "status": "error",
  "message": "Invalid language parameter. Supported languages: en, de, fr, es, it",
  "code": "INVALID_LANGUAGE",
  "details": {
    "providedLang": "xyz"
  }
}
```

## Internationalization

This endpoint fully supports internationalization:

- Achievement data (names, descriptions) is returned in the requested language
- Error messages are localized based on the requested language
- If an invalid language is provided, error messages default to English

The endpoint uses the following translation keys internally:

```typescript
const i18nKeys = {
  errors: {
    api: {
      invalidLanguage: "errors.api.invalidLanguage",
    },
    achievements: {
      fetch: "errors.achievements.fetch",
    },
  },
};
```

## Performance Considerations

### Caching

The endpoint implements in-memory caching for achievement data with the following characteristics:

- Achievements are cached by language code
- Cache expiration: 5 minutes
- Automatic cache invalidation after expiry
- Promise-based cache to prevent duplicate requests during concurrent calls

### Response Size

Achievement data is kept minimal for performance. For detailed achievement information, use the
specific achievement endpoint.

## Security Considerations

- No authentication required for public achievement data
- Achievement unlock conditions for secret achievements are not exposed
- Input validation for language parameter prevents injection attacks
- Error responses do not expose sensitive system information

## Accessibility Considerations

- Response format is compatible with screen readers
- Achievement images should include alt text in client implementations
- Error messages are clear and descriptive
- Response structure is consistent for predictable screen reader behavior

## Related Endpoints

- `GET /[lang]/api/achievements/:id` - Get details for a specific achievement
- `GET /[lang]/api/user/achievements` - Get achievements for the current user
- `POST /[lang]/api/achievements/check` - Check if user has unlocked new achievements

## Implementation Notes

- The endpoint uses TypeScript for type safety
- Error responses include a specific error code for programmatic handling
- Errors are logged with structured data for easier debugging
- Response format follows the standard API response pattern

## Changelog

- **v3.0.0** - Added caching mechanism, improved error handling, added details to error responses
- **v2.5.0** - Added support for achievement requirements array
- **v2.0.0** - Added internationalization support for all achievement text
- **v1.0.0** - Initial implementation

## TypeScript Interface References

For full type definitions, see:

- `Achievement` in `/src/types/achievement.ts`
- `ApiResponse` in `/src/types/api.ts`
- `UiLanguages` in `/src/utils/i18n.ts`

## Code Example: Fetching and Displaying Achievements

```typescript
/**
 * Fetches achievements in the user's preferred language and displays them in the UI
 *
 * @param {UiLanguages} language - The user's preferred language
 * @returns {Promise<void>}
 */
async function displayAchievements(language: UiLanguages): Promise<void> {
  try {
    const response = await fetch(`/${language}/api/achievements`);
    const result = await response.json();

    if (result.status === "success") {
      const achievements = result.data.achievements;

      // Filter out secret achievements for users who haven't unlocked them
      const visibleAchievements = achievements.filter(
        (achievement) => !achievement.isSecret || userHasUnlocked(achievement.id)
      );

      // Sort achievements by category and then by difficulty
      const sortedAchievements = visibleAchievements.sort((a, b) => {
        if (a.category !== b.category) {
          return a.category.localeCompare(b.category);
        }

        const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      });

      // Render the achievements in the UI
      renderAchievementsList(sortedAchievements);
    } else {
      // Handle error with appropriate UI feedback
      showErrorMessage(result.message);
      logErrorToAnalytics(`Achievement fetch error: ${result.code}`);
    }
  } catch (error) {
    console.error("Error fetching achievements:", error);
    showErrorMessage("Unable to load achievements. Please try again later.");
  }
}
```

## Error Handling Best Practices

When consuming this API, implement the following error handling pattern:

```typescript
async function fetchAchievements(lang: string): Promise<Achievement[]> {
  try {
    const response = await fetch(`/${lang}/api/achievements`);

    // Check for non-200 HTTP status
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${errorData.message} (${errorData.code})`);
    }

    const data = await response.json();

    // Check for error status in response body
    if (data.status === "error") {
      throw new Error(`API Error: ${data.message} (${data.code})`);
    }

    return data.data.achievements;
  } catch (error) {
    // Log the error and show user-friendly message
    console.error("Failed to fetch achievements:", error);
    // Re-throw or handle as needed
    throw error;
  }
}
```
