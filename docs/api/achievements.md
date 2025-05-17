# MelodyMind Achievements API

## Overview

The Achievements API provides endpoints for retrieving, updating, and interacting with the
MelodyMind achievement system. This API allows clients to access all available achievements, check a
user's progress, update achievement status, and unlock achievements.

The achievement system is designed to enhance user engagement by rewarding players for their
accomplishments in the game. Achievements are categorized by difficulty (bronze, silver, gold,
platinum, diamond) and type (games played, perfect games, score milestones, etc.).

## Base URL

All API endpoints are relative to the base URL and include a language parameter:

```
/{lang}/api/achievements
```

Where `{lang}` is a supported language code (e.g., `en`, `de`).

## Authentication

Most achievement endpoints require authentication:

- **Public endpoints**: Achievements list (`GET /{lang}/api/achievements`)
- **Authenticated endpoints**: User achievements, progress updates, unlocks

Authentication is handled via session cookies. Unauthenticated requests to protected endpoints will
receive a `401 Unauthorized` response or be redirected to the login page.

## Endpoints

### Get All Achievements

Retrieves a list of all available achievements in the system.

**URL**: `GET /{lang}/api/achievements`  
**Authentication**: Not required  
**Parameters**:

- `lang` (path): Language code for translations

**Success Response** (200 OK):

```json
{
  "status": "success",
  "data": {
    "achievements": [
      {
        "id": "ach_games_50",
        "code": "games_played_50",
        "categoryId": "cat_silver",
        "conditionType": "games_played",
        "conditionValue": 50,
        "rarityPercentage": 35.8,
        "iconPath": "/icons/achievements/games_played_50.svg",
        "category": {
          "id": "cat_silver",
          "code": "silver",
          "points": 25,
          "iconPath": "/icons/achievements/categories/silver.svg",
          "sortOrder": 2
        },
        "translations": [
          {
            "achievementId": "ach_games_50",
            "language": "en",
            "name": "Dedicated Player",
            "description": "Play 50 music quiz games"
          }
        ]
      }
      // Additional achievements...
    ]
  }
}
```

**Error Responses**:

- `400 Bad Request`: Invalid language parameter

  ```json
  {
    "status": "error",
    "message": "Invalid language specified",
    "code": "INVALID_LANGUAGE"
  }
  ```

- `500 Internal Server Error`: Server-side error
  ```json
  {
    "status": "error",
    "message": "Error retrieving achievements",
    "code": "ACHIEVEMENT_FETCH_ERROR"
  }
  ```

### Get User Achievements

Retrieves the achievements and progress for the authenticated user.

**URL**: `GET /{lang}/api/achievements/user`  
**Authentication**: Required  
**Parameters**:

- `lang` (path): Language code for translations

**Success Response** (200 OK):

```json
{
  "success": true,
  "achievements": [
    {
      "id": "ach_games_50",
      "code": "games_played_50",
      "categoryId": "cat_silver",
      "conditionType": "games_played",
      "conditionValue": 50,
      "rarityPercentage": 35.8,
      "iconPath": "/icons/achievements/games_played_50.svg",
      "category": {
        "id": "cat_silver",
        "code": "silver",
        "points": 25,
        "iconPath": "/icons/achievements/categories/silver.svg",
        "sortOrder": 2
      },
      "name": "Dedicated Player",
      "description": "Play 50 music quiz games",
      "progressPercentage": 64,
      "status": "in-progress",
      "userProgress": {
        "userId": "user-123",
        "achievementId": "ach_games_50",
        "currentProgress": 32,
        "unlockedAt": null
      }
    }
    // Additional achievements...
  ]
}
```

**Error Responses**:

- `401 Unauthorized`: User is not authenticated

  ```json
  {
    "success": false,
    "error": "Authentication required"
  }
  ```

- `500 Internal Server Error`: Server-side error
  ```json
  {
    "success": false,
    "error": "Error retrieving user achievements"
  }
  ```

### Update Achievement Progress

Updates the progress of an achievement for the authenticated user.

**URL**: `POST /{lang}/api/achievements/progress`  
**Authentication**: Required  
**Parameters**:

- `lang` (path): Language code for translations

**Request Body**:

```json
{
  "achievementId": "ach_games_50",
  "progress": 35
}
```

**Success Response** (200 OK):

```json
{
  "success": true,
  "userAchievement": {
    "userId": "user-123",
    "achievementId": "ach_games_50",
    "currentProgress": 35,
    "unlockedAt": null
  }
}
```

**Error Responses**:

- `400 Bad Request`: Invalid request parameters

  ```json
  {
    "success": false,
    "error": "Invalid parameters"
  }
  ```

- `401 Unauthorized`: User is not authenticated

  ```json
  {
    "success": false,
    "error": "Authentication required"
  }
  ```

- `500 Internal Server Error`: Server-side error
  ```json
  {
    "success": false,
    "error": "Error updating achievement progress"
  }
  ```

### Unlock Achievement

Unlocks an achievement for the authenticated user.

**URL**: `POST /{lang}/api/achievements/unlock`  
**Authentication**: Required  
**Parameters**:

- `lang` (path): Language code for translations

**Request Body**:

```json
{
  "achievementId": "ach_games_50"
}
```

**Success Response** (200 OK):

```json
{
  "success": true,
  "userAchievement": {
    "userId": "user-123",
    "achievementId": "ach_games_50",
    "currentProgress": 50,
    "unlockedAt": "2025-05-17T15:30:45.123Z"
  }
}
```

**Error Responses**:

- `400 Bad Request`: Invalid request parameters

  ```json
  {
    "success": false,
    "error": "Invalid parameters"
  }
  ```

- `401 Unauthorized`: User is not authenticated

  ```json
  {
    "success": false,
    "error": "Authentication required"
  }
  ```

- `500 Internal Server Error`: Server-side error
  ```json
  {
    "success": false,
    "error": "Error unlocking achievement"
  }
  ```

### Check Achievements After Game

Checks and updates achievements after a game session.

**URL**: `POST /{lang}/api/achievements/check`  
**Authentication**: Required  
**Parameters**:

- `lang` (path): Language code for translations

**Request Body**:

```json
{
  "gameState": {
    "score": 450,
    "correctAnswers": 9,
    "totalQuestions": 10,
    "roundIndex": 9,
    "currentQuestion": null,
    "category": {
      "id": "genre-123",
      "name": "Rock"
    },
    "lastAnswerTime": 8500,
    "lastAnswerCorrect": true,
    "endOfSession": true
  },
  "isPerfectGame": false
}
```

**Success Response** (200 OK):

```json
{
  "success": true,
  "timestamp": "2025-05-17T15:35:45.123Z",
  "data": {
    "unlockedAchievements": [
      {
        "id": "ach_games_50",
        "code": "games_played_50",
        "categoryId": "cat_silver",
        "conditionType": "games_played",
        "conditionValue": 50,
        "rarityPercentage": 35.8,
        "iconPath": "/icons/achievements/games_played_50.svg"
      }
    ],
    "updatedAchievements": [
      {
        "id": "ach_perfect_games_10",
        "code": "perfect_games_10",
        "categoryId": "cat_gold",
        "conditionType": "perfect_games",
        "conditionValue": 10,
        "rarityPercentage": 12.3,
        "iconPath": "/icons/achievements/perfect_games_10.svg",
        "userProgress": {
          "userId": "user-123",
          "achievementId": "ach_perfect_games_10",
          "currentProgress": 5,
          "unlockedAt": null
        }
      }
    ]
  }
}
```

**Error Responses**:

- `400 Bad Request`: Invalid request parameters

  ```json
  {
    "success": false,
    "error": "Invalid parameters"
  }
  ```

- `401 Unauthorized`: User is not authenticated
  ```json
  {
    "success": false,
    "error": "Authentication required"
  }
  ```

## Achievement Types and Structures

The MelodyMind achievement system utilizes several core data types:

### Achievement

```typescript
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
  /** Category of the achievement */
  category?: AchievementCategory;
  /** Translations of the achievement */
  translations?: AchievementTranslation[];
  /** Current progress of the user */
  userProgress?: UserAchievement;
}
```

### Achievement Category

```typescript
interface AchievementCategory {
  /** Unique ID of the category */
  id: string;
  /** Category code (bronze, silver, gold, platinum, diamond) */
  code: "bronze" | "silver" | "gold" | "platinum" | "diamond";
  /** Point value of the category */
  points: number;
  /** Path to the category icon */
  iconPath: string;
  /** Sort order of the category */
  sortOrder: number;
}
```

### Achievement Condition Types

These are the different types of conditions that can be used for achievements:

```typescript
type AchievementConditionType =
  | "games_played" // Number of games played
  | "perfect_games" // Number of games with perfect scores
  | "total_score" // Total accumulated score
  | "daily_streak" // Consecutive days of play
  | "daily_games" // Number of games in a single day
  | "genre_explorer" // Number of different genres played
  | "game_series" // Consecutive games in one session
  | "quick_answer" // Number of fast answers
  | "seasonal_event"; // Participation in seasonal events
```

### User Achievement

```typescript
interface UserAchievement {
  /** ID of the user */
  userId: string;
  /** ID of the achievement */
  achievementId: string;
  /** Current progress of the user */
  currentProgress: number;
  /** Time of unlocking (null if not unlocked) */
  unlockedAt: string | null;
}
```

## Achievement Events

The achievement system includes a client-side event system that allows UI components to respond to
achievement events. This is particularly useful for displaying notifications when achievements are
unlocked.

### Subscribe to Achievement Events

```typescript
import { subscribeToAchievementEvents } from "../utils/achievements/achievementEvents.ts";

const unsubscribe = subscribeToAchievementEvents((event) => {
  if (event.type === "achievement_unlocked") {
    // Handle the unlocked achievement
    console.log(`Achievement unlocked: ${event.achievement.name}`);
    displayNotification(event.achievement);
  }
});

// Later, when no longer needed
unsubscribe();
```

### Achievement Event Structure

```typescript
interface AchievementEvent {
  /** Type of the event */
  type: "achievement_unlocked";
  /** Affected achievement */
  achievement: LocalizedAchievement;
  /** Timestamp of the event */
  timestamp: string;
}
```

## Accessibility Considerations

The Achievements API adheres to WCAG AAA standards through:

1. **Clear error messages**: All error responses include descriptive error messages that can be
   properly announced by screen readers
2. **Consistent response structure**: The API maintains a consistent response structure for easier
   client-side processing
3. **Internationalization support**: Error messages and achievement data are available in multiple
   languages via the `lang` parameter
4. **Time-based information**: All timestamps are provided in ISO format for consistent
   representation across clients
5. **Error handling**: Robust error handling with appropriate status codes and descriptive messages

### Client-Side Implementation Guidelines

When implementing achievement notifications in the client:

- Ensure achievements are announced properly to screen readers with ARIA live regions
- Provide both visual and audio cues for unlocked achievements
- Maintain sufficient color contrast (7:1 ratio) for achievement displays
- Allow keyboard dismissal of achievement notifications
- Ensure focus management doesn't disrupt user flow

## Internationalization

All achievement-related messages and content can be displayed in multiple languages. The system
uses:

1. **URL-based language selection**: The `/{lang}/` prefix in all API endpoints
2. **Validated language codes**: All language codes are validated against supported languages
3. **Fallback mechanism**: English (en) is used as a fallback for unsupported languages
4. **Translations stored in database**: Achievement names and descriptions are stored in
   language-specific tables

## Error Handling

All API endpoints implement consistent error handling:

1. **Typed error responses**: All errors follow a consistent structure
2. **Error codes**: Specific error codes help identify the type of error
3. **HTTP status codes**: Appropriate HTTP status codes are used (400, 401, 500, etc.)
4. **Detailed logging**: Errors are logged with contextual information for debugging

## Implementation Examples

### Client-Side: Displaying User Achievements

```typescript
async function loadUserAchievements() {
  try {
    const response = await fetch("/en/api/achievements/user");

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      console.error("Failed to load achievements:", result.error);
      return;
    }

    // Display achievements on the page
    displayAchievements(result.achievements);

    // Calculate statistics
    const totalAchievements = result.achievements.length;
    const unlockedAchievements = result.achievements.filter((a) => a.status === "unlocked").length;
    const progressPercentage = Math.round((unlockedAchievements / totalAchievements) * 100);

    // Update UI with statistics
    updateStatistics({
      total: totalAchievements,
      unlocked: unlockedAchievements,
      progress: progressPercentage,
    });
  } catch (error) {
    console.error("Error loading achievements:", error);
    showErrorMessage("Failed to load achievements. Please try again later.");
  }
}
```

### Client-Side: Handling Achievement Notifications

```typescript
import {
  subscribeToAchievementEvents,
  initAchievementEventSystem,
} from "../utils/achievements/achievementEvents.ts";

// Initialize the achievement event system
initAchievementEventSystem();

// Subscribe to achievement events
const unsubscribe = subscribeToAchievementEvents((event) => {
  if (event.type === "achievement_unlocked") {
    // Play a sound effect if enabled in user settings
    if (localStorage.getItem("achievement-sound-enabled") !== "false") {
      const sound = document.getElementById("achievement-sound") as HTMLAudioElement;
      if (sound) {
        sound.currentTime = 0;
        sound.play().catch((err) => console.warn("Could not play achievement sound:", err));
      }
    }

    // Show visual notification
    const notification = document.getElementById("achievement-notification");
    if (notification) {
      // Set notification content
      const titleElement = notification.querySelector(".title");
      const descriptionElement = notification.querySelector(".description");

      if (titleElement) titleElement.textContent = event.achievement.name;
      if (descriptionElement) descriptionElement.textContent = event.achievement.description;

      // Make notification visible
      notification.classList.add("visible");

      // Add to achievement count badge
      updateAchievementBadge();

      // Hide notification after delay
      setTimeout(() => {
        notification.classList.remove("visible");
      }, 5000);
    }
  }
});
```

## Version History

- **3.1.0** (Current)

  - Added enhanced type safety with branded types for IDs
  - Improved performance with memoized responses
  - Better structural error handling

- **3.0.0**

  - Complete TypeScript rewrite with improved type definitions
  - Added support for WCAG AAA compliance
  - Added achievement event system
  - Enhanced error handling with specialized error classes

- **2.5.0**

  - Added achievement categories and point values
  - Introduced rarity percentage tracking
  - Added localized achievement descriptions

- **2.0.0**
  - Initial public release of the achievements API
  - Basic achievement types and progress tracking

## See Also

- [User Authentication Documentation](../authentication/usage-guide.md)
- [Achievement Database Schema](../database/achievement-system.md)
- [Game API Documentation](./game.md)
