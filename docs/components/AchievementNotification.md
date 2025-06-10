# AchievementNotification Component

## Overview

The `AchievementNotification` component displays toast-like notifications when users unlock
achievements in the MelodyMind game. It provides an engaging, accessible, and performant way to
celebrate user accomplishments with animations, sound effects, and comprehensive accessibility
features.

![Achievement Notification Example](../../public/docs/achievement-notification-preview.png)

## Features

- **Animated Toast Notifications**: Smooth slide-in animations with GPU acceleration
- **Audio Support**: Achievement sound effects with multi-format compatibility
- **Accessibility First**: WCAG 2.2 AAA compliance with comprehensive screen reader support
- **Interactive Controls**: Pause, sound toggle, and close functionality
- **Timer System**: Visual countdown with automatic dismissal
- **Responsive Design**: Mobile-first approach with touch-friendly controls
- **Theme Support**: Light/dark theme compatibility with high contrast mode
- **Performance Optimized**: Minimal JavaScript footprint with efficient resource management

## Component Properties

| Property | Type   | Required | Description                    | Default |
| -------- | ------ | -------- | ------------------------------ | ------- |
| `lang`   | string | Yes      | Language code for translations | -       |

## Basic Usage

### Simple Implementation

```astro
---
import AchievementNotification from "../components/Achievements/AchievementNotification.astro";
---

<AchievementNotification lang="en" />
```

### Integration with Achievement System

```typescript
// In your game logic
import { triggerAchievementNotification } from "../../utils/achievements/achievementNotification";

// Trigger notification when achievement is unlocked
const achievement = {
  id: "first-perfect-score",
  title: "Perfect Score",
  description: "Answer all questions correctly on your first try",
  category: "Accuracy",
  rarity: "rare",
};

triggerAchievementNotification(achievement);
```

## Component Structure

### HTML Structure

```astro
<div id="achievement-notification" class="achievement-notification" role="alert" aria-live="polite">
  <!-- Notification content -->
  <div class="achievement-notification__container">
    <!-- Trophy icon -->
    <div class="achievement-notification__icon">
      <Icon name="trophy" />
    </div>

    <!-- Achievement details -->
    <div class="achievement-notification__content">
      <h3 class="achievement-notification__title">Achievement Unlocked!</h3>
      <p class="achievement-notification__description">You've earned a new achievement</p>
    </div>

    <!-- Control buttons -->
    <div class="achievement-notification__controls">
      <button id="achievement-pause">Pause</button>
      <button id="achievement-sound-toggle">Toggle Sound</button>
      <button id="achievement-close">Close</button>
    </div>
  </div>

  <!-- Category badge -->
  <div class="achievement-notification__category"></div>

  <!-- Timer progress bar -->
  <div class="achievement-notification__timer">
    <div class="achievement-notification__timer-progress"></div>
  </div>
</div>
```

### TypeScript Integration

The component integrates with a comprehensive TypeScript utility system:

```typescript
// Achievement notification setup
import { setupAchievementNotificationSystem } from "../../utils/achievements/achievementNotification";

// Initialize the notification system
const cleanup = setupAchievementNotificationSystem();

// Clean up resources when component unmounts
document.addEventListener("beforeunload", cleanup);
```

## Accessibility Features

### WCAG 2.2 AAA Compliance

- **Color Contrast**: 7:1 ratio for normal text, 4.5:1 for large text
- **Focus Management**: Enhanced focus indicators with 3px solid borders
- **Keyboard Navigation**: Full keyboard accessibility for all interactive elements
- **Screen Reader Support**: Comprehensive ARIA implementation
- **Reduced Motion**: Respects `prefers-reduced-motion` preferences
- **High Contrast Mode**: Full support for `forced-colors: active`

### ARIA Implementation

```html
<div
  role="alert"
  aria-live="polite"
  aria-labelledby="achievement-title achievement-category"
  aria-describedby="achievement-description sr-notification-type"
  tabindex="-1"
>
  <!-- Screen reader only content -->
  <span id="sr-notification-type" class="sr-only"> New achievement notification </span>
</div>
```

### Keyboard Controls

| Key             | Action                           |
| --------------- | -------------------------------- |
| `Tab`           | Navigate between control buttons |
| `Enter`/`Space` | Activate focused button          |
| `Escape`        | Close notification               |

### Screen Reader Support

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

## Styling System

### CSS Variables Usage

The component exclusively uses CSS variables from the global design system:

```css
.achievement-notification {
  /* Colors */
  background-color: var(--card-bg);
  color: var(--text-primary);
  border: var(--border-width-thin) solid var(--border-primary);

  /* Spacing */
  padding: var(--space-md);
  right: var(--space-xl);
  bottom: var(--space-xl);

  /* Layout */
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  z-index: var(--z-notification);

  /* Animation */
  transition:
    transform var(--transition-normal),
    opacity var(--transition-normal);
}
```

### BEM Methodology

The component follows strict BEM (Block-Element-Modifier) naming conventions:

```css
/* Block */
.achievement-notification {
}

/* Elements */
.achievement-notification__container {
}
.achievement-notification__icon {
}
.achievement-notification__content {
}
.achievement-notification__title {
}
.achievement-notification__description {
}
.achievement-notification__controls {
}
.achievement-notification__control-button {
}
.achievement-notification__close {
}
.achievement-notification__category {
}
.achievement-notification__timer {
}
.achievement-notification__timer-progress {
}

/* Modifiers */
.achievement-notification--visible {
}
.achievement-notification--paused {
}
```

### Complete Accessible Component Example

```astro
---
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

## Performance Optimizations

### GPU Acceleration

```css
.achievement-notification {
  /* GPU acceleration for smooth animations */
  transform: translateZ(0);
  will-change: transform;
  isolation: isolate;
}

.achievement-notification__timer-progress {
  /* Optimized timer animation */
  transform-origin: left;
  will-change: transform;
}
```

### Animation Performance

- Uses `transform` instead of `scaleX` for better performance
- Implements `will-change` property for GPU acceleration
- Respects `prefers-reduced-motion` for accessibility
- Efficient keyframe animations with minimal repaints

## Audio System

### Multi-Format Support

```html
<audio id="achievement-sound" preload="none">
  <source src="/sounds/achievement-unlocked.mp3" type="audio/mpeg" />
  <source src="/sounds/achievement-unlocked.ogg" type="audio/ogg" />
  <track
    kind="captions"
    src="/sounds/achievement-unlocked-captions.vtt"
    srclang="en"
    label="English"
    default
  />
</audio>
```

### Audio Features

- **Lazy Loading**: `preload="none"` for performance
- **Accessibility**: VTT captions for hearing-impaired users
- **User Control**: Toggle button for sound preferences
- **Format Fallbacks**: MP3 and OGG format support

## Responsive Design

### Breakpoint System

```css
/* Mobile-first base styles */
.achievement-notification {
  max-width: calc(var(--space-3xl) * 6); /* 24rem */
}

/* Tablet and up */
@media (min-width: 40em) {
  .achievement-notification {
    max-width: calc(var(--space-3xl) * 7.5); /* 30rem */
    bottom: var(--space-2xl);
    right: var(--space-2xl);
  }
}

/* Desktop and up */
@media (min-width: 48em) {
  .achievement-notification {
    max-width: calc(var(--space-3xl) * 9); /* 36rem */
  }
}
```

## Achievement Unlock API Integration

### Prerequisites

Before using the Achievement Unlock API, ensure:

1. You have a valid authentication token
2. You know the ID of the achievement to unlock
3. You understand the expected response format

### Core Utility Functions

#### Single Achievement Unlocking

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

#### Batch Achievement Unlocking

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

#### Game Completion Service

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

## Integration Examples

### Game Achievement Trigger

```typescript
// In a quiz completion handler
const handleQuizComplete = (score: number, totalQuestions: number) => {
  if (score === totalQuestions) {
    // Perfect score achievement
    triggerAchievementNotification({
      id: "perfect-score",
      title: "Perfect Score!",
      description: "You answered every question correctly!",
      category: "Accuracy",
      rarity: "epic",
    });
  }
};
```

### Custom Event Listeners

```typescript
// Listen for achievement events
document.addEventListener("achievement:unlocked", (event) => {
  const { achievement } = event.detail;
  console.log(`Achievement unlocked: ${achievement.title}`);
});

// Listen for notification lifecycle events
document.addEventListener("notification:shown", () => {
  console.log("Notification displayed");
});

document.addEventListener("notification:dismissed", () => {
  console.log("Notification dismissed");
});
```

## Testing Considerations

### Accessibility Testing

- Test with screen readers (NVDA, JAWS, VoiceOver)
- Verify keyboard navigation flow
- Check color contrast ratios
- Test with high contrast mode enabled
- Validate reduced motion preferences

### Performance Testing

- Monitor animation frame rates
- Test on low-end devices
- Verify memory cleanup
- Check for memory leaks with repeated notifications

### Cross-Browser Testing

- Test audio format fallbacks
- Verify CSS variable support
- Check animation performance
- Validate touch interactions on mobile

## Related Components

- [`AchievementCard`](./AchievementCard.md) - Display individual achievements
- [`AchievementsList`](./AchievementsList.md) - List all user achievements
- [`NotificationCenter`](./NotificationCenter.md) - Central notification management

## Related Documentation

- [Achievement API Endpoint Reference](../api/achievements-unlock.md)
- [Achievement Types and Interfaces](../types/achievement-api-types.md)
- [Achievement System Overview](../architecture/achievement-system.md)
- [Internationalization in MelodyMind](../i18n/architecture.md)

## Migration Notes

### Version 2.1.0 (Current)

- **Added**: Enhanced batch unlocking utilities
- **Added**: Comprehensive error handling with custom error classes
- **Improved**: TypeScript types and interfaces
- **Improved**: Documentation structure and examples

### Version 2.0.0

- **Breaking**: Removed hardcoded colors in favor of CSS variables
- **Added**: High contrast mode support
- **Added**: Enhanced focus management
- **Improved**: Performance optimizations with GPU acceleration

### Version 1.5.0

- **Added**: Audio caption support for accessibility
- **Added**: Reduced motion preference support
- **Improved**: Timer animation performance

## Browser Support

- **Modern Browsers**: Full support (Chrome 90+, Firefox 88+, Safari 14+)
- **CSS Variables**: Required for theming system
- **Audio**: Graceful degradation for unsupported formats
- **Animations**: Fallbacks for browsers without animation support

## Contributing Guidelines

When modifying this component:

1. **Maintain CSS Variables**: Never hardcode design values
2. **Test Accessibility**: Verify WCAG 2.2 AAA compliance
3. **Performance**: Monitor animation performance impact
4. **Documentation**: Update this documentation for any API changes
5. **Testing**: Add comprehensive test coverage for new features
6. **TypeScript**: Ensure all new code includes proper type definitions
7. **English Documentation**: All documentation must be written in English

## File Structure

```text
src/components/Achievements/
├── AchievementNotification.astro     # Main component
├── AchievementCard.astro            # Individual achievement display
└── AchievementsList.astro           # Achievement collection

src/utils/achievements/
├── achievementNotification.ts        # Core notification logic
├── achievementEvents.ts             # Event system
├── achievementUtils.ts              # Single achievement utilities
├── achievementBatchUtils.ts         # Batch processing utilities
└── achievementData.ts              # Achievement definitions

src/services/
└── gameCompletionService.ts         # Game completion handlers

src/types/
└── achievement.ts                   # TypeScript interfaces
```

---

**Last Updated**: May 29, 2025  
**Component Version**: 2.1.0  
**WCAG Compliance**: AAA (Level 7:1 contrast ratio)  
**Language**: English (as per project documentation standards)
