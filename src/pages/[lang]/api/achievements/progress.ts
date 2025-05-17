/**
 * API Route: Achievement Progress Update Endpoint
 *
 * This endpoint updates the progress of an achievement for the current user.
 * It verifies authentication, validates the request data, and updates the
 * achievement progress in the database.
 *
 * @since 3.0.0
 * @category API
 *
 * Route: POST /[lang]/api/achievements/progress
 *
 * URL Parameters:
 * - lang: The language code for i18n translations
 *
 * Request Body:
 * - achievementId: ID of the achievement
 * - progress: New progress value (must be a non-negative number)
 *
 * Response:
 * - 200: Progress successfully updated, returns updated user achievement
 * - 400: Invalid request or parameters
 * - 401: Not authenticated
 * - 500: Server error during update
 */
import type { APIRoute } from "astro";

import { requireAuth } from "../../../../middleware/auth.ts";
import { updateAchievementProgress } from "../../../../services/achievementService.ts";
import type { UserAchievement } from "../../../../types/achievement.ts";
import { useTranslations } from "../../../../utils/i18n.ts";

/**
 * Achievement ID type with branded type pattern for better type safety
 * @since 3.0.0
 */
type AchievementId = string & { readonly __brand: unique symbol };

/**
 * Type definitions for translation keys used in this API endpoint
 * Uses improved typing for better type safety and autocompletion
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
 * Uses function overloads for precise parameter typing
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
 * Request payload with proper type constraints
 * Uses stricter typing for better validation
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

/**
 * Achievement API error class for specialized error handling
 * @since 3.0.0
 */
class AchievementApiError extends Error {
  /**
   * Creates a new achievement API error
   *
   * @param {string} message - Error message
   * @param {number} status - HTTP status code
   */
  constructor(
    message: string,
    public readonly status: number = 500
  ) {
    super(message);
    this.name = "AchievementApiError";
  }
}

/**
 * Type guard to check if an error is an AchievementApiError
 *
 * @param {unknown} error - The error to check
 * @returns {boolean} True if the error is an AchievementApiError
 */
function isAchievementApiError(error: unknown): error is AchievementApiError {
  return error instanceof AchievementApiError;
}

/**
 * Creates a JSON response with appropriate headers
 *
 * @param {ProgressUpdateResponse} data - Response data
 * @param {number} status - HTTP status code
 * @returns {Response} HTTP response
 */
function createJsonResponse(data: ProgressUpdateResponse, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

/**
 * LRU (Least Recently Used) Cache implementation for efficient memory-bounded caching
 *
 * This generic cache implementation maintains a fixed-size cache that automatically
 * evicts the least recently used items when the size limit is reached. It provides
 * O(1) complexity for common operations (get, set, has) by leveraging JavaScript's Map
 * data structure, which preserves insertion order.
 *
 * @since 3.1.0
 * @template K The type of keys stored in the cache
 * @template V The type of values stored in the cache
 * @category Performance
 * @class
 *
 * @example
 * // Create a cache for storing API responses with a limit of 50 entries
 * const responseCache = new LRUCache<string, Response>(50);
 *
 * // Store a response in the cache
 * responseCache.set('api/user/123', new Response('{"id": 123}'));
 *
 * // Retrieve a cached response
 * const cachedResponse = responseCache.get('api/user/123');
 *
 * @example
 * // Using with complex keys (objects)
 * type QueryParams = { endpoint: string; filters: Record<string, string> };
 * const dataCache = new LRUCache<QueryParams, object>(100);
 *
 * // When using object keys, you need a stable serialization strategy
 * const getStableKey = (params: QueryParams): string =>
 *   `${params.endpoint}-${JSON.stringify(Object.entries(params.filters).sort())}`;
 *
 * // Store with serialized key
 * const queryParams = { endpoint: 'users', filters: { role: 'admin' } };
 * const key = getStableKey(queryParams);
 * dataCache.set(queryParams, { users: [] });
 */
class LRUCache<K, V> {
  /**
   * Internal Map used to store cached entries while preserving insertion order
   * @private
   */
  private cache = new Map<K, V>();

  /**
   * Maximum number of entries this cache can hold
   * @private
   * @readonly
   */
  private readonly maxSize: number;

  /**
   * Creates a new LRU cache with the specified size limit
   *
   * @param {number} maxSize - Maximum number of entries to store in the cache
   * @throws {TypeError} If maxSize is not a positive number
   *
   * @example
   * // Create a small cache for temporary data
   * const tempCache = new LRUCache<string, any>(10);
   *
   * @example
   * // Create a larger cache for frequently accessed data
   * const userProfileCache = new LRUCache<number, UserProfile>(250);
   */
  constructor(maxSize: number) {
    if (typeof maxSize !== "number" || maxSize <= 0 || !Number.isFinite(maxSize)) {
      throw new TypeError("Cache size limit must be a positive finite number");
    }
    this.maxSize = maxSize;
  }

  /**
   * Retrieves a value from the cache and marks it as recently used
   *
   * This method will move the accessed entry to the end of the insertion
   * order, making it the "most recently used" item when found.
   *
   * @param {K} key - Cache key to look up
   * @returns {V | undefined} The cached value if found, undefined otherwise
   *
   * @example
   * // Check if an item exists before using it
   * const userData = userCache.get(userId);
   * if (userData) {
   *   // Use the cached data
   *   processUserData(userData);
   * } else {
   *   // Fetch and cache the data
   *   const newData = await fetchUserData(userId);
   *   userCache.set(userId, newData);
   *   processUserData(newData);
   * }
   */
  get(key: K): V | undefined {
    const value = this.cache.get(key);

    if (value !== undefined) {
      // Refresh key position in the cache by removing and re-adding
      // This makes the entry the most recently used item
      this.cache.delete(key);
      this.cache.set(key, value);
    }

    return value;
  }

  /**
   * Adds or updates a cache entry
   *
   * If the key already exists, it updates the value and marks the entry
   * as recently used. If the cache is at capacity and the key doesn't exist,
   * it evicts the least recently used item before adding the new entry.
   *
   * @param {K} key - Cache key
   * @param {V} value - Value to cache
   * @returns {this} The cache instance for method chaining
   *
   * @example
   * // Simple value caching
   * scoreCache.set(gameId, finalScore);
   *
   * @example
   * // Method chaining
   * resultsCache
   *   .set('game1', { score: 150, time: 45 })
   *   .set('game2', { score: 220, time: 60 });
   */
  set(key: K, value: V): this {
    if (this.cache.has(key)) {
      // Key exists, remove it first to update its position
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // Cache at capacity, remove the oldest entry (first key in map)
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }

    // Add/update the entry (becomes most recently used)
    this.cache.set(key, value);
    return this;
  }

  /**
   * Checks if a key exists in the cache without affecting its usage status
   *
   * Unlike `get()`, this method doesn't change the item's position in the
   * cache, so it doesn't mark the item as recently used.
   *
   * @param {K} key - Cache key to check
   * @returns {boolean} True if the key exists in the cache, false otherwise
   *
   * @example
   * // Check if an item is cached without affecting LRU order
   * if (dataCache.has(dataKey)) {
   *   console.log('Data is already cached');
   * }
   */
  has(key: K): boolean {
    return this.cache.has(key);
  }

  /**
   * Removes all entries from the cache
   *
   * @returns {this} The cache instance for method chaining
   *
   * @example
   * // Clear cache when user logs out
   * function handleLogout() {
   *   userDataCache.clear();
   *   sessionCache.clear();
   * }
   */
  clear(): this {
    this.cache.clear();
    return this;
  }

  /**
   * Returns the current number of entries in the cache
   *
   * @returns {number} Number of entries currently stored
   *
   * @example
   * // Monitor cache utilization
   * console.log(`Cache usage: ${cache.size}/${cache.maxSize}`);
   */
  get size(): number {
    return this.cache.size;
  }

  /**
   * Returns the maximum capacity of the cache
   *
   * @returns {number} Maximum number of entries this cache can hold
   *
   * @example
   * // Calculate cache utilization percentage
   * const utilizationPct = (cache.size / cache.maxSize) * 100;
   */
  get maxCapacity(): number {
    return this.maxSize;
  }

  /**
   * Removes a specific key from the cache
   *
   * @param {K} key - The key to remove
   * @returns {boolean} True if the key was found and removed, false otherwise
   *
   * @example
   * // Remove sensitive data from cache
   * function removeUserData(userId: string): void {
   *   const removed = userCache.delete(userId);
   *   if (removed) {
   *     console.log(`User ${userId} data removed from cache`);
   *   }
   * }
   */
  delete(key: K): boolean {
    return this.cache.delete(key);
  }
}

/**
 * Memoized function for creating JSON responses with efficient caching
 *
 * This factory function creates a response generator that automatically caches
 * successful responses to improve API performance. It uses an LRU caching strategy
 * to maintain a fixed-size cache that automatically evicts least recently used items
 * when the size limit is reached.
 *
 * @since 3.0.0
 * @category Performance
 * @function
 *
 * @example
 * // Basic usage
 * const response = memoizedJsonResponse(
 *   { success: true, data: result },
 *   200
 * );
 *
 * @example
 * // Error response (will not be cached)
 * const errorResponse = memoizedJsonResponse(
 *   { success: false, error: "Invalid parameters" },
 *   400
 * );
 */
const memoizedJsonResponse = (() => {
  // Cache size limit prevents memory issues with unbounded growth
  const MAX_CACHE_SIZE = 100;
  const cache = new LRUCache<string, Response>(MAX_CACHE_SIZE);

  /**
   * Creates a JSON response, potentially using a cached value
   *
   * @param {ProgressUpdateResponse} data - Response data to convert to JSON
   * @param {number} status - HTTP status code for the response
   * @returns {Response} HTTP response object, either from cache or newly created
   *
   * @remarks
   * Only successful (200) responses without sensitive user data are cached.
   * Error responses and responses containing sensitive data are always generated fresh.
   *
   * @example
   * // Success response (may be cached)
   * return memoizedJsonResponse({ success: true }, 200);
   *
   * @example
   * // Error response (never cached)
   * return memoizedJsonResponse({
   *   success: false,
   *   error: "Unauthorized access"
   * }, 401);
   */
  return (data: ProgressUpdateResponse, status: number): Response => {
    // Only cache successful responses that don't contain sensitive data
    if (status === 200 && data.success && !data.userAchievement?.userId) {
      // Create a stable key using the stringified data
      const key = `${status}-${JSON.stringify(data)}`;

      // Check cache before creating new response
      if (cache.has(key)) {
        const cachedResponse = cache.get(key);
        // Since we know the key exists, we can safely use non-null assertion
        return cachedResponse!;
      }

      // Create and cache the response
      const response = createJsonResponse(data, status);
      cache.set(key, response);
      return response;
    }

    // Don't cache error responses or responses with sensitive data
    return createJsonResponse(data, status);
  };
})();

/**
 * Handles errors and creates appropriate error responses
 * Uses enhanced error detection for better error reporting
 *
 * @since 3.1.0
 * @category Error Handling
 *
 * @param {unknown} error - The caught error
 * @param {TranslationFunction} t - Translation function
 * @returns {Response} Error response with appropriate status code
 */
function handleError(error: unknown, t: TranslationFunction): Response {
  // Log error for debugging
  console.error("Error updating achievement progress:", error);

  // Check for custom error types
  if (isAchievementApiError(error)) {
    // Handle our specific API error
    return memoizedJsonResponse(
      {
        success: false,
        error: error.message || t("errors.achievements.update"),
      },
      error.status
    );
  }

  // Handle standard JavaScript Error with improved error data
  if (error instanceof Error) {
    const status =
      error.name === "SyntaxError"
        ? 400 // Bad request for parsing errors
        : error.name === "ValidationError"
          ? 400 // Bad request for validation errors
          : error.name === "AuthenticationError"
            ? 401 // Unauthorized for auth errors
            : error.name === "PermissionError"
              ? 403 // Forbidden for permission errors
              : 500; // Internal server error as default

    return memoizedJsonResponse(
      {
        success: false,
        error: t("errors.achievements.update"),
      },
      status
    );
  }

  // Fallback error handling for unknown error types
  return memoizedJsonResponse(
    {
      success: false,
      error: t("errors.achievements.update"),
    },
    500
  );
}

/**
 * Validates if a request payload has the correct structure for achievement progress
 * Includes enhanced type checking and validation rules
 *
 * @since 3.1.0
 * @category Validation
 *
 * @param {unknown} data - The data to validate
 * @returns {boolean} True if the data is a valid progress request
 */
function isValidProgressRequest(data: unknown): data is AchievementProgressPayload {
  // Type guard for basic object check
  if (!data || typeof data !== "object" || data === null) {
    return false;
  }

  // Parse as Record for type safety
  const candidate = data as Record<string, unknown>;

  // Check required fields with proper types
  const hasValidId =
    typeof candidate.achievementId === "string" && candidate.achievementId.trim().length > 0;

  const hasValidProgress =
    typeof candidate.progress === "number" &&
    !isNaN(candidate.progress) &&
    Number.isFinite(candidate.progress) &&
    candidate.progress >= 0;

  return hasValidId && hasValidProgress;
}

/**
 * Achievement API POST handler for achievement progress updates
 * Processes request to update achievement progress for authenticated users
 *
 * @since 3.1.0
 * @category API Route
 */
export const POST: APIRoute = async ({ request, params }) => {
  // Extract language from URL parameters for localized messages
  const lang = params.lang as string;
  const t = useTranslations(lang) as TranslationFunction;

  try {
    // Retrieve user from the request with enhanced authentication
    const { authenticated, user, redirectToLogin } = await requireAuth(request);

    // Handle authentication failure with appropriate response
    if (!authenticated || !user) {
      // Log authentication failure for security monitoring
      console.warn(`Authentication failed for achievement progress update: ${request.url}`);

      // Return redirect if available
      if (redirectToLogin) {
        return redirectToLogin;
      }

      // Otherwise return error response
      const errorResponse: ProgressUpdateResponse = {
        success: false,
        error: t("errors.auth.unauthorized"),
      };

      return memoizedJsonResponse(errorResponse, 401);
    }

    // Parse request body with improved error handling
    let body: unknown;
    try {
      body = await request.json();
    } catch (parseError) {
      // Log parsing error details for debugging
      console.warn(
        `JSON parse error in achievement progress update: ${parseError instanceof Error ? parseError.message : "Unknown error"}`
      );

      const errorResponse: ProgressUpdateResponse = {
        success: false,
        error: t("errors.invalidRequest", { error: "Could not parse request body" }),
      };

      return memoizedJsonResponse(errorResponse, 400);
    }

    // Validate request body with enhanced validation
    if (!isValidProgressRequest(body) || body.progress < 0) {
      // Log validation failure with payload info for debugging
      console.warn(`Invalid achievement progress payload: ${JSON.stringify(body)}`);

      const errorResponse: ProgressUpdateResponse = {
        success: false,
        error: t("errors.invalidParameters"),
      };

      return memoizedJsonResponse(errorResponse, 400);
    }

    // Convert to branded type with runtime validation
    // This ensures the achievementId format is valid before proceeding
    const achievementIdPattern = /^[a-zA-Z0-9_-]+$/; // Basic format validation
    if (!achievementIdPattern.test(body.achievementId)) {
      return memoizedJsonResponse(
        {
          success: false,
          error: t("errors.invalidParameters"),
        },
        400
      );
    }

    // Cast to branded type (with validated format at runtime)
    const typedAchievementId = body.achievementId as AchievementId;

    // Update progress with provided information
    const userAchievement = await updateAchievementProgress(
      user.id,
      typedAchievementId,
      body.progress
    );

    // Log successful operation for auditing
    console.warn(
      `Achievement progress updated: userId=${user.id}, achievementId=${body.achievementId}, progress=${body.progress}`
    );

    // Return successful response
    const successResponse: ProgressUpdateResponse = {
      success: true,
      userAchievement,
    };

    return memoizedJsonResponse(successResponse, 200);
  } catch (error) {
    // Use enhanced error handler for all exceptions
    return handleError(error, t);
  }
};
