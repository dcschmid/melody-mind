# User Achievements API Guide

## Overview

The User Achievements API provides access to user-specific achievement data in the MelodyMind
application. This guide explains how to properly use the API, handle errors, and implement best
practices for achievement-related functionality.

## Available Endpoints

| Endpoint                            | Method | Description                           | Documentation                                                 |
| ----------------------------------- | ------ | ------------------------------------- | ------------------------------------------------------------- |
| `/[lang]/api/achievements/user`     | GET    | Get all achievements for current user | [User Achievements Endpoint](./user-achievements-endpoint.md) |
| `/[lang]/api/achievements/unlock`   | POST   | Trigger achievement unlocking         | [Achievement Unlock](./achievements-unlock.md)                |
| `/[lang]/api/achievements/progress` | PUT    | Update achievement progress           | [Achievement Progress](./achievement-progress.md)             |
| `/[lang]/api/achievements/check`    | POST   | Check for newly unlocked achievements | [Achievement Check](./achievement-check.md)                   |

## Authentication

All achievement endpoints require authentication. Ensure your application:

1. Has a valid user session before making requests
2. Handles authentication errors appropriately
3. Provides proper feedback to users when authentication fails

## Common Response Structure

All achievement API endpoints follow a consistent response pattern using a discriminated union
approach:

```typescript
// Success response
{
  "success": true,
  "achievements": [/* achievement data */]
}

// Error response
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

This structure enables type-safe handling in TypeScript by checking the `success` property. For more
details, see the [Achievement Response Types](./achievement-response-types.md) documentation.

## Error Handling

The API implements a specialized error class for achievement-related errors:

```typescript
class AchievementApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 500,
    public readonly userId?: UserId
  ) {
    super(message);
    this.name = "AchievementApiError";

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AchievementApiError);
    }
  }
}
```

For full documentation of error handling, see
[Achievement Error JSDoc](./achievement-error-jsdoc.md).

### Common Error Codes

| Code                    | Description               | HTTP Status |
| ----------------------- | ------------------------- | ----------- |
| `AUTH_REQUIRED`         | Authentication required   | 401         |
| `ACHIEVEMENT_ERROR`     | General achievement error | 500         |
| `INVALID_ACHIEVEMENT`   | Achievement ID is invalid | 400         |
| `ACHIEVEMENT_NOT_FOUND` | Achievement not found     | 404         |

## Internationalization

Achievement data is localized based on the language code in the URL path (`[lang]`). Supported
languages are:

- `en` - English
- `de` - German
- `es` - Spanish
- `fr` - French
- `it` - Italian
- `nl` - Dutch
- `pt` - Portuguese
- `sv` - Swedish
- `fi` - Finnish

The API returns achievement names, descriptions, and error messages in the requested language.

## Client Implementation Guide

### Fetching User Achievements

```typescript
/**
 * Fetches all achievements for the current user
 * @param {SupportedLanguage} lang - Language code for localized achievements
 * @returns {Promise<LocalizedAchievement[]>} Promise resolving to array of achievements
 * @throws {Error} If request fails or user is not authenticated
 */
async function fetchUserAchievements(lang: SupportedLanguage): Promise<LocalizedAchievement[]> {
  try {
    const response = await fetch(`/${lang}/api/achievements/user`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch achievements");
    }

    const data = await response.json();

    if (data.success) {
      return data.achievements;
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    console.error("Achievement fetch error:", error);
    throw error;
  }
}
```

### Displaying Achievement Progress

```typescript
/**
 * Creates an achievement progress indicator
 * @param {LocalizedAchievement} achievement The achievement data
 * @returns {HTMLElement} Progress indicator element
 */
function createAchievementProgress(achievement: LocalizedAchievement): HTMLElement {
  const container = document.createElement("div");
  container.className = "achievement-progress";
  container.setAttribute("aria-valuemin", "0");
  container.setAttribute("aria-valuemax", "100");
  container.setAttribute("aria-valuenow", achievement.progressPercentage.toString());
  container.setAttribute("role", "progressbar");

  // Status-specific attributes and classes
  if (achievement.status === "unlocked") {
    container.classList.add("achievement-unlocked");
    container.setAttribute("aria-label", `Achievement ${achievement.name} unlocked`);
  } else {
    container.setAttribute(
      "aria-label",
      `Achievement ${achievement.name} progress: ${achievement.progressPercentage}%`
    );
  }

  // Progress bar visual
  const progressBar = document.createElement("div");
  progressBar.className = "progress-bar";
  progressBar.style.width = `${achievement.progressPercentage}%`;

  container.appendChild(progressBar);
  return container;
}
```

## Performance Considerations

1. **Caching:** Consider caching achievement data client-side, refreshing only when needed
2. **Pagination:** For users with many achievements, implement pagination or infinite scrolling
3. **Selective Loading:** Load achievement details on-demand rather than all at once
4. **Optimistic Updates:** Update UI immediately, then confirm with server response

## Accessibility Implementation

When displaying achievement data, implement these accessibility features:

1. **Proper ARIA attributes** for achievement status and progress
2. **Keyboard navigation** for achievement lists and details
3. **Screen reader announcements** for newly unlocked achievements
4. **High-contrast visuals** for achievement icons and progress indicators
5. **Text alternatives** for all achievement visuals

Example of accessible achievement notification:

```typescript
/**
 * Announce a newly unlocked achievement to screen readers
 * @param {LocalizedAchievement} achievement The unlocked achievement
 */
function announceAchievementUnlock(achievement: LocalizedAchievement): void {
  const ariaLive = document.createElement("div");
  ariaLive.setAttribute("aria-live", "assertive");
  ariaLive.setAttribute("role", "status");
  ariaLive.className = "sr-only"; // Visually hidden but announced by screen readers

  ariaLive.textContent = `Achievement unlocked: ${achievement.name}. ${achievement.description}`;

  document.body.appendChild(ariaLive);

  // Remove after announcement (typical screen readers will have announced by then)
  setTimeout(() => {
    document.body.removeChild(ariaLive);
  }, 5000);
}
```

## Related Documentation

- [Achievement System Architecture](../architecture/achievement-system.md)
- [Achievement Types](../types/achievement.md)
- [Game Score and Achievement Integration](../game/score-achievement-integration.md)
