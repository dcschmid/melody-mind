# Using the Achievement Unlock API

This guide demonstrates how to use the Achievement Unlock API endpoint in different contexts within
the MelodyMind application.

## Overview

The Achievement Unlock API allows you to mark achievements as completed for the currently
authenticated user. This functionality is essential for rewarding players for their progress and
accomplishments within the game.

## Prerequisites

Before using the Achievement Unlock API, ensure:

1. You have a valid authentication token
2. You know the ID of the achievement to unlock
3. You understand the expected response format

## Basic Implementation Examples

### Component Integration (TypeScript + Astro)

Here's how to integrate achievement unlocking within an Astro component:

```astro
---
// filepath: src/components/GameComplete.astro
import type { UserAchievement } from "../types/achievement";
import { getTranslation } from "../utils/i18n";

interface Props {
  score: number;
  achievementId: string;
  lang: string;
}

const { score, achievementId, lang } = Astro.props;

// Get translations for the current language
const t = getTranslation(lang);

// Function to unlock achievement
async function unlockPlayerAchievement(id: string): Promise<UserAchievement | null> {
  try {
    const response = await fetch(`/${lang}/api/achievements/unlock`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ achievementId: id }),
    });

    const result = await response.json();

    if (!result.success) {
      console.error(`Failed to unlock achievement: ${result.error}`);
      return null;
    }

    return result.userAchievement;
  } catch (error) {
    console.error("Achievement unlock error:", error);
    return null;
  }
}
---

<div class="game-complete-container">
  <h1>{t("game.complete.title")}</h1>
  <p>{t("game.complete.score", { score })}</p>

  <button
    id="unlock-achievement"
    data-achievement-id={achievementId}
    class="achievement-button"
    aria-label={t("achievements.unlock.button")}
  >
    {t("achievements.unlock.button")}
  </button>

  <div id="achievement-result" class="achievement-result" aria-live="polite"></div>
</div>

<script>
  // Client-side JavaScript for handling achievement unlocking
  document.addEventListener("DOMContentLoaded", () => {
    const unlockButton = document.getElementById("unlock-achievement");
    const resultElement = document.getElementById("achievement-result");

    if (!unlockButton || !resultElement) return;

    unlockButton.addEventListener("click", async () => {
      const achievementId = unlockButton.getAttribute("data-achievement-id");
      if (!achievementId) return;

      try {
        // Show loading state
        unlockButton.setAttribute("disabled", "true");
        unlockButton.classList.add("loading");

        // Get language from URL
        const lang = window.location.pathname.split("/")[1] || "en";

        // Call the API
        const response = await fetch(`/${lang}/api/achievements/unlock`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ achievementId }),
        });

        const data = await response.json();

        // Handle response
        if (data.success) {
          resultElement.textContent = "Achievement unlocked!";
          resultElement.classList.add("success");

          // Dispatch custom event for other components to react to
          window.dispatchEvent(
            new CustomEvent("achievementUnlocked", {
              detail: { achievement: data.userAchievement },
            })
          );
        } else {
          resultElement.textContent = `Error: ${data.error}`;
          resultElement.classList.add("error");
        }
      } catch (error) {
        console.error("Error unlocking achievement:", error);
        resultElement.textContent = "An unexpected error occurred";
        resultElement.classList.add("error");
      } finally {
        // Reset button state
        unlockButton.removeAttribute("disabled");
        unlockButton.classList.remove("loading");
      }
    });
  });
</script>

<style>
  .game-complete-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem;
    border-radius: 8px;
    background-color: var(--color-bg-card);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .achievement-button {
    padding: 0.75rem 1.5rem;
    background-color: var(--color-primary);
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .achievement-button:hover {
    background-color: var(--color-primary-dark);
  }

  .achievement-button.loading {
    opacity: 0.7;
    cursor: wait;
  }

  .achievement-result {
    margin-top: 1rem;
    padding: 0.75rem;
    border-radius: 4px;
  }

  .achievement-result.success {
    background-color: var(--color-success-bg);
    color: var(--color-success);
  }

  .achievement-result.error {
    background-color: var(--color-error-bg);
    color: var(--color-error);
  }
</style>
```

### Utility Function (TypeScript)

For reusable achievement unlocking across your application, create a dedicated utility function:

```typescript
// filepath: src/utils/achievementUtils.ts

import type { UserAchievement } from "../types/achievement";

/**
 * Error class for achievement operations
 */
export class AchievementError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly errorId?: string
  ) {
    super(message);
    this.name = "AchievementError";
  }
}

/**
 * Type for unlock achievement options
 */
export interface UnlockAchievementOptions {
  /** ID of the achievement to unlock */
  achievementId: string;
  /** Language code for the request */
  lang?: string;
  /** Whether to show a notification when unlocked */
  showNotification?: boolean;
}

/**
 * Type for unlock achievement result
 */
export interface UnlockResult {
  /** The unlocked achievement data */
  achievement: UserAchievement;
  /** Whether the achievement was already unlocked */
  wasAlreadyUnlocked: boolean;
}

/**
 * Unlocks an achievement for the current user
 *
 * @since 3.2.0
 * @param {UnlockAchievementOptions} options - Options for unlocking the achievement
 * @returns {Promise<UnlockResult>} The result of the unlock operation
 * @throws {AchievementError} If the achievement cannot be unlocked
 *
 * @example
 * try {
 *   const result = await unlockAchievement({
 *     achievementId: 'achievement-123',
 *     showNotification: true
 *   });
 *
 *   if (result.wasAlreadyUnlocked) {
 *     console.log('Achievement was already unlocked');
 *   } else {
 *     console.log('Newly unlocked achievement:', result.achievement);
 *   }
 * } catch (error) {
 *   if (error instanceof AchievementError) {
 *     console.error(`Achievement error (${error.status}): ${error.message}`);
 *   } else {
 *     console.error('Unknown error:', error);
 *   }
 * }
 */
export async function unlockAchievement({
  achievementId,
  lang = document.documentElement.lang || "en",
  showNotification = false,
}: UnlockAchievementOptions): Promise<UnlockResult> {
  try {
    // Validate achievement ID format
    if (!/^achievement-\d+$/.test(achievementId)) {
      throw new AchievementError(
        `Invalid achievement ID format: ${achievementId}. Expected format: achievement-{number}`,
        400
      );
    }

    // Call the API
    const response = await fetch(`/${lang}/api/achievements/unlock`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ achievementId }),
    });

    const data = await response.json();

    // Check if the request was successful
    if (!response.ok) {
      throw new AchievementError(
        data.error || `Failed to unlock achievement (${response.status})`,
        response.status,
        data.errorId
      );
    }

    // Check if there's an informational message about already being unlocked
    const wasAlreadyUnlocked = data.success && data.error?.includes("already unlocked");

    // If the achievement data is missing, throw an error
    if (!data.userAchievement && !wasAlreadyUnlocked) {
      throw new AchievementError("Achievement data missing from successful response", 500);
    }

    // Show notification if requested
    if (showNotification && window.notificationSystem) {
      window.notificationSystem.show({
        type: "achievement",
        title: wasAlreadyUnlocked ? "Achievement Already Unlocked" : "Achievement Unlocked!",
        message: `${achievementId.replace("achievement-", "Achievement #")}`,
        duration: 5000,
      });
    }

    // Return the result
    return {
      achievement: data.userAchievement,
      wasAlreadyUnlocked,
    };
  } catch (error) {
    // Re-throw as AchievementError if it's not already one
    if (!(error instanceof AchievementError)) {
      throw new AchievementError(error instanceof Error ? error.message : String(error));
    }
    throw error;
  }
}
```

## Advanced Usage Scenarios

### Batch Unlocking Multiple Achievements

For scenarios where multiple achievements need to be unlocked in sequence:

```typescript
// filepath: src/utils/achievementBatchUtils.ts

import { unlockAchievement, type UnlockAchievementOptions } from "./achievementUtils";

/**
 * Results of a batch unlock operation
 */
interface BatchUnlockResult {
  /** Achievements that were successfully unlocked */
  succeeded: string[];
  /** Achievements that failed to unlock with their errors */
  failed: Array<{ id: string; error: string }>;
  /** Achievements that were already unlocked */
  alreadyUnlocked: string[];
}

/**
 * Unlocks multiple achievements in sequence
 *
 * @since 3.3.0
 * @param {string[]} achievementIds - Array of achievement IDs to unlock
 * @param {Omit<UnlockAchievementOptions, 'achievementId'>} options - Options for unlocking
 * @returns {Promise<BatchUnlockResult>} Results of the batch operation
 *
 * @example
 * const results = await unlockAchievementBatch(
 *   ['achievement-101', 'achievement-102', 'achievement-103'],
 *   { showNotification: true }
 * );
 *
 * console.log(`Unlocked: ${results.succeeded.length}`);
 * console.log(`Already unlocked: ${results.alreadyUnlocked.length}`);
 * console.log(`Failed: ${results.failed.length}`);
 */
export async function unlockAchievementBatch(
  achievementIds: string[],
  options: Omit<UnlockAchievementOptions, "achievementId"> = {}
): Promise<BatchUnlockResult> {
  const result: BatchUnlockResult = {
    succeeded: [],
    failed: [],
    alreadyUnlocked: [],
  };

  // Process achievements in sequence (not parallel to avoid rate limits)
  for (const id of achievementIds) {
    try {
      const unlockResult = await unlockAchievement({
        ...options,
        achievementId: id,
        // Only show notification for the first achievement if multiple
        showNotification: options.showNotification && result.succeeded.length === 0,
      });

      if (unlockResult.wasAlreadyUnlocked) {
        result.alreadyUnlocked.push(id);
      } else {
        result.succeeded.push(id);
      }
    } catch (error) {
      result.failed.push({
        id,
        error: error instanceof Error ? error.message : String(error),
      });
    }

    // Add a small delay between requests to avoid overwhelming the server
    if (achievementIds.length > 5) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  return result;
}
```

### Game Completion Handler

When a player completes a game, you might need to check and unlock multiple achievements:

```typescript
// filepath: src/services/gameCompletionService.ts

import type { GameResult } from "../types/game";
import { unlockAchievementBatch } from "../utils/achievementBatchUtils";

/**
 * Handles all achievement processing for a completed game
 *
 * @since 3.2.0
 * @param {GameResult} result - The game result data
 * @returns {Promise<void>}
 */
export async function processGameCompletion(result: GameResult): Promise<void> {
  // Determine which achievements should be unlocked based on the game result
  const achievementsToUnlock: string[] = [];

  // Check for perfect score
  if (result.score === result.maxPossibleScore) {
    achievementsToUnlock.push("achievement-201"); // Perfect score achievement
  }

  // Check for completed games count milestones
  if (result.totalGamesCompleted === 10) {
    achievementsToUnlock.push("achievement-101"); // 10 games completed
  } else if (result.totalGamesCompleted === 50) {
    achievementsToUnlock.push("achievement-102"); // 50 games completed
  } else if (result.totalGamesCompleted === 100) {
    achievementsToUnlock.push("achievement-103"); // 100 games completed
  }

  // Check for genre mastery (90%+ correct in a specific genre)
  if (result.correctAnswers / result.totalQuestions >= 0.9) {
    switch (result.genre) {
      case "rock":
        achievementsToUnlock.push("achievement-301"); // Rock master
        break;
      case "pop":
        achievementsToUnlock.push("achievement-302"); // Pop master
        break;
      case "jazz":
        achievementsToUnlock.push("achievement-303"); // Jazz master
        break;
      // Additional genres...
    }
  }

  // Check for speed demon (all answers within time bonus)
  if (result.averageAnswerTime < 5000) {
    achievementsToUnlock.push("achievement-401"); // Speed demon
  }

  // If there are achievements to unlock, process them
  if (achievementsToUnlock.length > 0) {
    await unlockAchievementBatch(achievementsToUnlock, {
      showNotification: true,
      lang: result.language,
    });
  }
}
```

## Testing Achievement Unlock

When developing and testing the achievement system, you can use this utility function to test the
unlock functionality:

```typescript
// filepath: src/utils/testAchievementUnlock.ts
// IMPORTANT: This file should only be included in development builds!

/**
 * Development utility for testing achievement unlocking
 * This should NEVER be included in production builds!
 *
 * @param {string} achievementId - The achievement ID to test
 * @returns {Promise<void>}
 */
export async function testAchievementUnlock(achievementId: string): Promise<void> {
  if (process.env.NODE_ENV === "production") {
    console.error("Achievement test utility should not be used in production!");
    return;
  }

  console.log(`Testing unlock for achievement: ${achievementId}`);

  try {
    const response = await fetch(`/en/api/achievements/unlock`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ achievementId }),
    });

    const data = await response.json();
    console.log("Unlock test result:", data);

    // Log the achievement data to the console in a readable format
    if (data.success && data.userAchievement) {
      console.table({
        "Achievement ID": data.userAchievement.achievementId,
        "Unlocked At": new Date(data.userAchievement.unlockedAt).toLocaleString(),
        Progress: `${data.userAchievement.progress}%`,
        Completed: data.userAchievement.completed ? "Yes" : "No",
      });
    }
  } catch (error) {
    console.error("Test unlock failed:", error);
  }
}

// Example usage in development console:
// import { testAchievementUnlock } from './utils/testAchievementUnlock';
// testAchievementUnlock('achievement-123');
```

## Accessibility Considerations

When implementing achievement unlocking in your UI, consider these accessibility best practices:

1. **Notifications**: Ensure achievement notifications are announced to screen readers
2. **Keyboard Support**: Make all achievement-related actions accessible via keyboard
3. **Focus Management**: Return focus appropriately after achievement modals are closed
4. **Color Contrast**: Achievement UI elements should meet WCAG AAA standards (7:1 ratio)
5. **Motion Sensitivity**: Provide options to reduce or eliminate animations
6. **Audio Cues**: Include non-visual feedback when achievements are unlocked

Example of an accessible achievement notification component:

```astro
---
// filepath: src/components/AchievementNotification.astro
interface Props {
  title: string;
  description: string;
  id: string;
}

const { title, description, id } = Astro.props;
---

<div
  class="achievement-notification"
  role="alert"
  aria-live="assertive"
  id={`achievement-notification-${id}`}
>
  <div class="achievement-icon" aria-hidden="true">🏆</div>
  <div class="achievement-content">
    <h3 class="achievement-title">{title}</h3>
    <p class="achievement-description">{description}</p>
  </div>
  <button
    class="achievement-close"
    aria-label="Dismiss achievement notification"
    data-achievement-id={id}
  >
    <span aria-hidden="true">×</span>
  </button>
</div>

<script>
  // Client-side code for handling the notification
  document.addEventListener("DOMContentLoaded", () => {
    const closeButtons = document.querySelectorAll(".achievement-close");

    closeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const achievementId = button.getAttribute("data-achievement-id");
        const notification = document.getElementById(`achievement-notification-${achievementId}`);

        if (notification) {
          // Add exit animation class
          notification.classList.add("exiting");

          // Remove from DOM after animation completes
          setTimeout(() => {
            notification.remove();
          }, 500);

          // Return focus to the game area
          const gameArea = document.getElementById("game-area");
          if (gameArea) {
            gameArea.focus();
          }
        }
      });
    });

    // Auto-dismiss after 10 seconds (but still accessible to screen readers)
    const notifications = document.querySelectorAll(".achievement-notification");
    notifications.forEach((notification) => {
      setTimeout(() => {
        if (document.body.contains(notification)) {
          notification.classList.add("exiting");
          setTimeout(() => {
            notification.remove();
          }, 500);
        }
      }, 10000);
    });
  });
</script>

<style>
  .achievement-notification {
    display: flex;
    align-items: center;
    padding: 1rem;
    background-color: var(--color-achievement-bg, #4a1a8c);
    color: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    margin-bottom: 1rem;
    animation: slide-in 0.5s ease forwards;
    max-width: 100%;
    width: 400px;
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    z-index: 1000;
  }

  .achievement-notification.exiting {
    animation: slide-out 0.5s ease forwards;
  }

  .achievement-icon {
    font-size: 2rem;
    margin-right: 1rem;
  }

  .achievement-content {
    flex: 1;
  }

  .achievement-title {
    margin: 0 0 0.25rem 0;
    font-size: 1.1rem;
    font-weight: bold;
  }

  .achievement-description {
    margin: 0;
    font-size: 0.9rem;
    opacity: 0.9;
  }

  .achievement-close {
    background: transparent;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.25rem;
    margin-left: 0.5rem;
    line-height: 1;
    opacity: 0.8;
    transition: opacity 0.2s;
  }

  .achievement-close:hover,
  .achievement-close:focus {
    opacity: 1;
    outline: none;
    text-decoration: none;
  }

  .achievement-close:focus {
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5);
    border-radius: 4px;
  }

  @keyframes slide-in {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slide-out {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }

  /* Reduce motion setting support */
  @media (prefers-reduced-motion: reduce) {
    .achievement-notification {
      animation: fade-in 0.3s ease forwards;
    }

    .achievement-notification.exiting {
      animation: fade-out 0.3s ease forwards;
    }

    @keyframes fade-in {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @keyframes fade-out {
      from {
        opacity: 1;
      }
      to {
        opacity: 0;
      }
    }
  }
</style>
```

## Related Documentation

- [Achievement API Endpoint Reference](../api/achievements-unlock.md)
- [Achievement Types and Interfaces](../types/achievement-api-types.md)
- [Achievement System Overview](../database/achievement-system.md)
- [Internationalization in MelodyMind](../i18n/architecture.md)
