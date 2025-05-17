# Achievement API Types and Interfaces

## Overview

This document describes the core data types and interfaces used in the MelodyMind achievement
system, particularly focusing on the achievement unlock API endpoint.

## Type Definitions

### Achievement ID

```typescript
/**
 * A branded type for Achievement IDs ensuring type safety and validation.
 * This implementation uses a symbol-based branded type for strict nominal typing.
 *
 * @since 3.1.0
 * @category Types
 */
type AchievementId = string & {
  readonly __brand: unique symbol;
  readonly __achievementIdBrand: "AchievementId";
};
```

Branded types like `AchievementId` provide several benefits:

1. Type safety: Cannot accidentally use a regular string where an AchievementId is required
2. Validated values: Only properly validated values can be converted to this type
3. Compile-time checking: TypeScript can catch errors at compile time

### User Achievement

```typescript
/**
 * Represents an achievement that has been unlocked by a user.
 *
 * @since 3.0.0
 * @category Types
 */
interface UserAchievement {
  /** Unique identifier for this user-achievement relationship */
  id: string;

  /** ID of the user who unlocked the achievement */
  userId: string;

  /** ID of the unlocked achievement */
  achievementId: string;

  /** Timestamp when the achievement was unlocked (ISO 8601 format) */
  unlockedAt: string;

  /** Progress percentage toward completion (0-100) */
  progress: number;

  /** Whether the achievement is fully completed */
  completed: boolean;
}
```

### Achievement

```typescript
/**
 * Represents an achievement that can be unlocked in the game.
 *
 * @since 3.0.0
 * @category Types
 */
interface Achievement {
  /** Unique identifier for the achievement */
  id: string;

  /** Translation key for the achievement name */
  nameKey: string;

  /** Translation key for the achievement description */
  descriptionKey: string;

  /** Points awarded when unlocking this achievement */
  points: number;

  /** Category the achievement belongs to */
  category: AchievementCategory;

  /** Difficulty level of the achievement */
  difficulty: AchievementDifficulty;

  /** Whether the achievement is secret (not shown until unlocked) */
  isSecret: boolean;

  /** Conditions that must be met to unlock the achievement */
  requirements: AchievementRequirement[];

  /** Related achievements that may be of interest */
  relatedAchievements?: string[];
}
```

### Achievement Category

```typescript
/**
 * Categories for grouping achievements.
 *
 * @since 3.0.0
 * @category Types
 */
type AchievementCategory =
  | "gameplay"
  | "progression"
  | "collection"
  | "social"
  | "challenge"
  | "hidden";
```

### Achievement Difficulty

```typescript
/**
 * Difficulty levels for achievements.
 *
 * @since 3.0.0
 * @category Types
 */
type AchievementDifficulty = "bronze" | "silver" | "gold" | "platinum";
```

### Achievement Requirement

```typescript
/**
 * Defines a condition that must be met to unlock an achievement.
 *
 * @since 3.0.0
 * @category Types
 */
interface AchievementRequirement {
  /** Type of requirement */
  type: RequirementType;

  /** Target value that must be reached */
  target: number;

  /** Additional parameters specific to the requirement type */
  params?: Record<string, unknown>;
}
```

### Requirement Type

```typescript
/**
 * Types of conditions for achievement requirements.
 *
 * @since 3.0.0
 * @category Types
 */
type RequirementType =
  | "complete_games"
  | "answer_correctly"
  | "perfect_score"
  | "use_jokers"
  | "consecutive_logins"
  | "time_played"
  | "genre_mastery";
```

## API Request/Response Types

### Achievement Unlock Payload

```typescript
/**
 * Request payload for unlocking an achievement.
 *
 * @since 3.1.0
 * @category API
 */
interface AchievementUnlockPayload {
  /** ID of the achievement to unlock (must follow format: achievement-{number}) */
  achievementId: string;
}
```

### Unlock Response

```typescript
/**
 * Response structure for achievement unlock operation.
 *
 * @since 3.1.0
 * @category API
 */
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

### Type-safe Translation Function

```typescript
/**
 * Type definitions for translation keys used in achievement API endpoints.
 *
 * @since 3.1.0
 * @category i18n
 */
type AchievementUnlockErrorKey =
  | "errors.auth.unauthorized"
  | "errors.invalidRequest"
  | "errors.invalidParameters"
  | "errors.achievements.unlock"
  | "errors.achievements.invalidId"
  | "errors.achievements.unknownError";

/**
 * Type-safe translation function for achievement errors.
 * Provides specialized signatures for different error types.
 *
 * @since 3.1.0
 * @category i18n
 */
type TranslationFunction = {
  /**
   * Translates an invalid request error with additional error details.
   *
   * @param {string} key - The translation key for invalid request errors
   * @param {{ error: string }} vars - Variables for the translation, including the specific error message
   * @returns {string} The translated error message
   */
  (key: "errors.invalidRequest", vars: { error: string }): string;

  /**
   * Translates other error types without additional variables.
   *
   * @param {Exclude<AchievementUnlockErrorKey, "errors.invalidRequest">} key - The translation key
   * @returns {string} The translated error message
   */
  (key: Exclude<AchievementUnlockErrorKey, "errors.invalidRequest">): string;
};
```

## Error Types

### Achievement Unlock Error

```typescript
/**
 * Achievement unlock error class for specialized error handling.
 * Provides additional context and information for error responses.
 *
 * @since 3.1.0
 * @category Errors
 */
class AchievementUnlockError extends Error {
  /**
   * Creates a new achievement unlock error.
   *
   * @param {string} message - Error message
   * @param {number} status - HTTP status code
   * @param {unknown} [cause] - The underlying error that caused this error
   * @param {Record<string, unknown>} [metadata] - Additional contextual information about the error
   */
  constructor(
    message: string,
    public readonly status: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    public readonly cause?: unknown,
    public readonly metadata?: Record<string, unknown>
  ) {
    super(message);
    this.name = "AchievementUnlockError";

    // Capture stack trace (works better with modern Error subclassing)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Serializes the error for logging and debugging purposes.
   *
   * @returns {Record<string, unknown>} Serialized representation of the error
   */
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      stack: this.stack,
      cause:
        this.cause instanceof Error
          ? { name: this.cause.name, message: this.cause.message }
          : this.cause,
      metadata: this.metadata,
    };
  }
}
```

## HTTP Status Codes

```typescript
/**
 * HTTP status codes used in the achievement API endpoints.
 *
 * @since 3.1.0
 * @category API
 */
const HTTP_STATUS = {
  /** Success */
  OK: 200,
  /** Invalid request or parameters */
  BAD_REQUEST: 400,
  /** Not authenticated */
  UNAUTHORIZED: 401,
  /** Internal server error */
  INTERNAL_SERVER_ERROR: 500,
} as const;
```

## Type Guards

```typescript
/**
 * Type guard to check if an error is an AchievementUnlockError.
 * Uses instanceof pattern for reliable type narrowing.
 *
 * @param {unknown} error - The error to check
 * @returns {error is AchievementUnlockError} Type predicate indicating the error type
 *
 * @example
 * try {
 *   // Some operation that might throw
 * } catch (err) {
 *   if (isAchievementUnlockError(err)) {
 *     // Can safely access err.status and other AchievementUnlockError properties
 *     console.error(`Error status: ${err.status}`);
 *   }
 * }
 */
function isAchievementUnlockError(error: unknown): error is AchievementUnlockError {
  return error instanceof AchievementUnlockError;
}

/**
 * Validates if a request payload has the correct structure for achievement unlock.
 * Uses TypeScript type narrowing for robust type validation.
 *
 * @param {unknown} data - The data to validate
 * @returns {data is AchievementUnlockPayload} Type predicate indicating if data is a valid unlock request
 */
function isValidUnlockRequest(data: unknown): data is AchievementUnlockPayload {
  if (!data || typeof data !== "object") {
    return false;
  }

  const candidate = data as Record<string, unknown>;

  // Check if achievementId exists and is a non-empty string
  if (typeof candidate.achievementId !== "string") {
    return false;
  }

  // Ensure achievementId is not empty and has proper format
  const achievementId = candidate.achievementId.trim();
  if (achievementId.length === 0) {
    return false;
  }

  // Validate format requirements with regex pattern
  const achievementIdPattern = /^achievement-\d+$/;
  return achievementIdPattern.test(achievementId);
}
```

## Achievement Service

The achievement service handles the business logic for interacting with achievements:

```typescript
/**
 * Unlocks an achievement for a user.
 *
 * @since 3.0.0
 * @category Services
 *
 * @param {string} userId - The ID of the user
 * @param {AchievementId} achievementId - The ID of the achievement to unlock
 * @returns {Promise<UserAchievement>} The updated user achievement
 * @throws {Error} If the achievement couldn't be unlocked
 */
async function unlockAchievement(
  userId: string,
  achievementId: AchievementId
): Promise<UserAchievement> {
  // Implementation details in achievementService.ts
}
```

## Type Relationships

The diagram below illustrates the relationships between the different types:

```
┌────────────────────┐       ┌───────────────────┐
│                    │       │                   │
│     Achievement    │       │  UserAchievement  │
│                    │       │                   │
└────────────────────┘       └───────────────────┘
      ↑         ↑                     ↑
      │         │                     │
      │     references             creates
      │         │                     │
┌─────┴─────┐   │                     │
│           │   │                     │
│ Achieve-  │   │  ┌─────────────────┐│
│ mentId    │───┴──┤  Unlock API     ├┘
│           │      │  Endpoint       │
└───────────┘      └─────────────────┘
                          │ ↑
                          │ │
                  throws  │ │ returns
                          │ │
                          ↓ │
                   ┌──────────────┐
                   │              │
                   │  UnlockError │
                   │              │
                   └──────────────┘
```

## Migration Notes

### v3.1.0 to v4.0.0 (Future)

- Planning to change `AchievementId` from branded type to a class implementation
- Will replace array-based requirements with a more structured approach

### v3.0.0 to v3.1.0

- Added `errorId` to `UnlockResponse` interface
- Enhanced `AchievementUnlockError` with metadata support
- Improved type validation with more specific regex patterns

### v2.0.0 to v3.0.0

- Changed achievement ID format from simple strings to branded types
- Updated response structure to include `success` flag
- Added i18n support with type-safe translation functions

## Best Practices

### Using Branded Types

```typescript
// ❌ AVOID - Unsafe type usage
function processAchievement(id: string) {
  // String could be any format, no validation
}

// ✅ RECOMMENDED - Type-safe approach
function processAchievement(id: AchievementId) {
  // We know id has been validated and is the correct format
}

// How to convert safely:
function getValidatedId(rawId: string): AchievementId {
  // Validate format
  if (!/^achievement-\d+$/.test(rawId)) {
    throw new Error("Invalid achievement ID format");
  }
  // Safe cast after validation
  return rawId as AchievementId;
}
```

### Error Handling

```typescript
// ❌ AVOID - Generic error handling
try {
  await unlockAchievement(userId, achievementId);
} catch (err) {
  console.error("Error:", err);
  return { success: false };
}

// ✅ RECOMMENDED - Type-aware error handling
try {
  await unlockAchievement(userId, achievementId);
} catch (err) {
  if (isAchievementUnlockError(err)) {
    // Handle specific error with status code
    return {
      success: false,
      error: err.message,
      status: err.status,
    };
  }
  // Handle other errors
  return {
    success: false,
    error: "Unknown error",
    status: 500,
  };
}
```

## Related Documentation

- [Achievement System Overview](../database/achievement-system.md)
- [Achievement Check API](./achievement-check.md)
- [Achievement Progress API](./achievement-progress.md)
- [Achievement List API](./achievements.md)
- [Authentication Types](../authentication/types.md)
