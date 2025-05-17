# Achievement Types and Interfaces

## Overview

This document describes the core TypeScript types and interfaces used in the MelodyMind achievement
system. These types provide a consistent structure for working with achievements, user progress, and
related API operations.

## Core Type Definitions

### Achievement ID

```typescript
/**
 * Achievement ID type with branded type pattern for better type safety
 *
 * This type uses TypeScript's branded type pattern to prevent accidental assignment
 * of arbitrary strings to achievement IDs, providing stronger compile-time type checking.
 *
 * @since 3.0.0
 */
type AchievementId = string & { readonly __brand: unique symbol };
```

### Achievement Categories

```typescript
/**
 * Achievement categories supported by the system
 *
 * @since 3.0.0
 */
type AchievementCategory =
  | "gameplay" // General gameplay achievements
  | "genres" // Music genre knowledge
  | "streaks" // Achievement streaks and consistency
  | "social" // Social interaction achievements
  | "completionist" // Completion-based achievements
  | "special"; // Limited-time or unique achievements
```

### Achievement Structure

```typescript
/**
 * Core achievement definition
 *
 * Represents the static definition of an achievement in the system.
 * These definitions are typically stored in the database and don't change.
 *
 * @since 3.0.0
 */
interface Achievement {
  /** Unique identifier for the achievement */
  id: AchievementId;

  /** Achievement name translation key */
  nameKey: string;

  /** Achievement description translation key */
  descriptionKey: string;

  /** Achievement category */
  category: AchievementCategory;

  /** Icon identifier for the achievement */
  icon: string;

  /** Points awarded when completing this achievement */
  points: number;

  /** Target progress value to complete this achievement */
  targetValue: number;

  /** Whether achievement progress is hidden until unlocked */
  isHidden: boolean;

  /** Whether this is a secret achievement (not shown until completed) */
  isSecret: boolean;

  /** Related achievements that may unlock after this one */
  nextAchievements?: AchievementId[];

  /** When this achievement was created */
  createdAt: string;

  /** Whether this achievement is currently active */
  isActive: boolean;
}
```

### User Achievement Progress

```typescript
/**
 * User achievement progress record
 *
 * Represents a user's progress toward a specific achievement.
 * These records are created when a user first makes progress on an achievement.
 *
 * @since 3.0.0
 */
interface UserAchievement {
  /** User identifier */
  userId: string;

  /** Achievement identifier */
  achievementId: AchievementId;

  /** Current progress value */
  progress: number;

  /** Whether the achievement is completed */
  completed: boolean;

  /** When the achievement was completed (if applicable) */
  completedAt?: string;

  /** When this record was first created */
  createdAt: string;

  /** When this record was last updated */
  updatedAt: string;
}
```

### API Request/Response Types

```typescript
/**
 * Request payload for achievement progress update
 *
 * @since 3.1.0
 */
interface AchievementProgressPayload {
  /** ID of the achievement to update */
  achievementId: string;

  /**
   * New progress value (must be a non-negative number)
   * @minValue 0
   */
  progress: number;
}

/**
 * Response structure for achievement progress update
 *
 * @since 3.0.0
 */
interface ProgressUpdateResponse {
  /** Whether the operation was successful */
  success: boolean;

  /** Updated user achievement data if successful */
  userAchievement?: UserAchievement;

  /** Error message if unsuccessful */
  error?: string;
}
```

### Error Handling Types

```typescript
/**
 * Achievement error key type definitions
 * Used for type-safe translation of error messages
 *
 * @since 3.1.0
 */
type AchievementErrorKey =
  | "errors.auth.unauthorized"
  | "errors.achievements.update"
  | "errors.invalidRequest"
  | "errors.invalidParameters";

/**
 * Type-safe translation function for achievement errors
 *
 * @since 3.1.0
 */
type TranslationFunction = {
  // Overload for errors.invalidRequest with required error variable
  (key: "errors.invalidRequest", vars: { error: string }): string;

  // Overload for all other error keys without variables
  (key: Exclude<AchievementErrorKey, "errors.invalidRequest">): string;
};

/**
 * Custom error class for achievement API operations
 *
 * @since 3.0.0
 */
class AchievementApiError extends Error {
  constructor(
    message: string,
    public readonly status: number = 500
  ) {
    super(message);
    this.name = "AchievementApiError";
  }
}
```

## Usage Examples

### Creating a Type-Safe Achievement ID

```typescript
// Convert a string to a typed AchievementId
function createAchievementId(id: string): AchievementId {
  // Validate the ID format
  if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
    throw new Error(`Invalid achievement ID format: ${id}`);
  }

  // Cast to branded type
  return id as AchievementId;
}

// Usage
const typedId = createAchievementId("perfect-score-easy");
```

### Updating Achievement Progress

```typescript
// Update achievement progress with type safety
async function incrementAchievement(
  userId: string,
  achievementId: AchievementId,
  incrementBy: number = 1
): Promise<UserAchievement> {
  // Get current progress
  const currentProgress = await getUserAchievementProgress(userId, achievementId);

  // Calculate new progress
  const newProgress = (currentProgress?.progress || 0) + incrementBy;

  // Update progress
  return updateAchievementProgress(userId, achievementId, newProgress);
}

// Usage
const updatedAchievement = await incrementAchievement(
  "user-123",
  createAchievementId("daily-login"),
  1
);

console.log(`New progress: ${updatedAchievement.progress}`);
```

### Error Handling with Custom Error Types

```typescript
// Function that uses custom error types
async function checkAchievementCompletion(
  userId: string,
  achievementId: AchievementId
): Promise<boolean> {
  try {
    const achievement = await getAchievement(achievementId);

    if (!achievement) {
      throw new AchievementApiError("Achievement not found", 404);
    }

    const userProgress = await getUserAchievementProgress(userId, achievementId);

    if (!userProgress) {
      return false;
    }

    return userProgress.progress >= achievement.targetValue;
  } catch (error) {
    // Type guard for our custom error
    if (error instanceof AchievementApiError) {
      console.error(`Achievement API error (${error.status}): ${error.message}`);
    } else {
      console.error("Unknown error during achievement check:", error);
    }
    throw error;
  }
}
```

## Type Safety Considerations

1. **Branded Types**: The `AchievementId` uses TypeScript's branded type pattern to prevent
   accidental assignment of invalid values.

2. **Union Types**: Error keys and achievement categories use union types to restrict values to a
   predefined set.

3. **Function Overloads**: The `TranslationFunction` uses function overloads to enforce correct
   parameter usage based on the key.

4. **Type Guards**: Custom type guards like `isAchievementApiError` provide runtime type checking.

5. **Readonly Properties**: Critical properties are marked as readonly to prevent accidental
   modification.

## Best Practices

When working with these types:

1. **Always use the AchievementId type** for achievement identifiers to leverage TypeScript's type
   checking.

2. **Validate external input** before casting to branded types to ensure type safety at runtime.

3. **Use type guards** when working with unknown values or error types.

4. **Keep translation keys in sync** with the actual translations in the i18n system.

5. **Don't extend interfaces without documentation** to maintain backward compatibility.

## Related Documentation

- [Achievement Service](../services/AchievementService.md)
- [Achievement Progress API](../api/achievement-progress.md)
- [Achievement Tracking System](../features/AchievementTracking.md)

## Changelog

- **v3.1.0** - Enhanced type definitions with better documentation, added template literal types for
  translation keys
- **v3.0.0** - Initial implementation of achievement type system with branded types
