/**
 * Rate limiting module for MelodyMind authentication
 *
 * Provides functions to prevent brute force attacks by limiting login attempts.
 * Uses an in-memory storage that should be replaced with a persistent store like Redis in production.
 *
 * @since 1.0.0
 * @category Authentication
 */

/**
 * Branded type for IP addresses
 * Used for type safety in rate limiting functions
 */
type IPAddress = string & { readonly __brand: unique symbol };

/**
 * Creates a branded IP address from a string
 *
 * @since 1.0.0
 * @category Utility
 *
 * @param {string} ip - The IP address string to convert
 * @returns {IPAddress} Branded IP address for type safety
 *
 * @example
 * // Create a type-safe IP address
 * const clientIp = createIPAddress('192.168.1.1');
 */
export function createIPAddress(ip: string): IPAddress {
  return ip as IPAddress;
}

/**
 * Interface for login attempt tracking
 */
interface LoginAttemptRecord {
  /** Number of failed login attempts */
  count: number;
  /** Timestamp when the rate limit will reset */
  resetTime: number;
}

/**
 * Rate limit response type
 */
interface RateLimitResponse {
  /** Whether the request is rate limited */
  limited: boolean;
  /** Time in milliseconds until the rate limit resets, if limited */
  resetTime?: number;
}

/**
 * Error class for rate limiting issues
 */
export class RateLimitError extends Error {
  /**
   * Creates a new RateLimitError
   *
   * @param {string} message - Error message
   * @param {IPAddress} ip - The IP address that is rate limited
   * @param {number} resetTime - When the rate limit will reset (timestamp)
   */
  constructor(
    message: string,
    public readonly ip: IPAddress,
    public readonly resetTime: number
  ) {
    super(message);
    this.name = "RateLimitError";
  }
}

// In-memory storage for rate limiting
// In a production environment, a persistent store like Redis should be used
const loginAttempts = new Map<string, LoginAttemptRecord>();

// Constants for rate limiting settings
const MAX_LOGIN_ATTEMPTS = 5; // Maximum number of login attempts
const LOGIN_WINDOW_MS = 15 * 60 * 1000; // 15 minutes in milliseconds
const IP_BLOCK_DURATION_MS = 60 * 60 * 1000; // 1 hour in milliseconds

/**
 * Checks if an IP address has exceeded the rate limit
 *
 * @since 1.0.0
 * @category Authentication
 *
 * @param {string} ip - The IP address to check
 * @returns {boolean} Boolean indicating if the IP is rate limited
 *
 * @example
 * // Check if a user's IP is rate limited before processing login
 * if (isRateLimited('192.168.1.1')) {
 *   return { error: 'Too many login attempts, please try again later' };
 * }
 */
export function isRateLimited(ip: string): boolean {
  const now = Date.now();

  // Clean up expired entries
  cleanupExpiredEntries();

  // If the IP is not in memory, it's not limited
  const attempts = loginAttempts.get(ip);
  if (!attempts) {
    return false;
  }

  // If the reset time is in the future and the maximum number of attempts has been reached,
  // the IP is limited
  return attempts.resetTime > now && attempts.count >= MAX_LOGIN_ATTEMPTS;
}

/**
 * Records a failed login attempt for an IP address
 *
 * @since 1.0.0
 * @category Authentication
 *
 * @param {string} ip - The IP address to record the failed attempt for
 *
 * @example
 * // Record a failed login attempt
 * function handleLoginFailure(username: string, ip: string) {
 *   recordFailedLoginAttempt(ip);
 *   logSecurityEvent(`Failed login for user ${username} from IP ${ip}`);
 * }
 */
export function recordFailedLoginAttempt(ip: string): void {
  const now = Date.now();
  const attempts = loginAttempts.get(ip);

  // If the IP is not in memory or the reset time has expired,
  // create a new entry
  if (!attempts || attempts.resetTime <= now) {
    loginAttempts.set(ip, {
      count: 1,
      resetTime: now + LOGIN_WINDOW_MS,
    });
    return;
  }

  // Increase the attempt count
  const newCount = attempts.count + 1;

  // Calculate the new reset time
  const newResetTime =
    newCount >= MAX_LOGIN_ATTEMPTS
      ? now + IP_BLOCK_DURATION_MS // Extended block if max attempts reached
      : attempts.resetTime; // Keep the original reset time otherwise

  // Update the record
  loginAttempts.set(ip, {
    count: newCount,
    resetTime: newResetTime,
  });
}

/**
 * Resets the rate limit for an IP address (e.g., after successful login)
 *
 * @since 1.0.0
 * @category Authentication
 *
 * @param {string} ip - The IP address to reset
 *
 * @example
 * // Reset rate limit after successful login
 * function handleSuccessfulLogin(username: string, ip: string) {
 *   resetRateLimit(ip);
 *   logSecurityEvent(`Successful login for user ${username} from IP ${ip}`);
 * }
 */
export function resetRateLimit(ip: string): void {
  loginAttempts.delete(ip);
}

/**
 * Returns the remaining time until the rate limit reset
 *
 * @since 1.0.0
 * @category Authentication
 *
 * @param {string} ip - The IP address to check
 * @returns {number} Time in milliseconds until the reset
 *
 * @example
 * // Get and display the remaining time until rate limit reset
 * const resetTimeMs = getRateLimitResetTime('192.168.1.1');
 * console.log(`Try again in ${Math.ceil(resetTimeMs / 1000)} seconds`);
 */
export function getRateLimitResetTime(ip: string): number {
  const attempts = loginAttempts.get(ip);
  if (!attempts) {
    return 0;
  }

  const now = Date.now();
  const resetTime = attempts.resetTime;

  return Math.max(0, resetTime - now);
}

/**
 * Returns the number of remaining login attempts
 *
 * @since 1.0.0
 * @category Authentication
 *
 * @param {string} ip - The IP address to check
 * @returns {number} Number of remaining login attempts
 *
 * @example
 * // Show the user how many attempts they have left
 * const attemptsLeft = getRemainingLoginAttempts('192.168.1.1');
 * console.log(`You have ${attemptsLeft} login attempts remaining`);
 */
export function getRemainingLoginAttempts(ip: string): number {
  const attempts = loginAttempts.get(ip);
  if (!attempts) {
    return MAX_LOGIN_ATTEMPTS;
  }

  return Math.max(0, MAX_LOGIN_ATTEMPTS - attempts.count);
}

/**
 * Cleans up expired entries from memory to prevent memory leaks
 *
 * @since 1.0.0
 * @category Utility
 *
 * @private
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();

  // More efficient iteration using Map.prototype.forEach
  const keysToDelete: string[] = [];

  loginAttempts.forEach((data, ip) => {
    if (data.resetTime <= now) {
      keysToDelete.push(ip);
    }
  });

  // Batch delete to avoid concurrent modification issues
  keysToDelete.forEach((ip) => loginAttempts.delete(ip));
}

/**
 * Type guard to check if an error is a RateLimitError
 *
 * @since 1.0.0
 * @category Utility
 *
 * @param {unknown} error - The error to check
 * @returns {boolean} Whether the error is a RateLimitError
 *
 * @example
 * try {
 *   // some operation that might throw
 * } catch (error: unknown) {
 *   if (isRateLimitError(error)) {
 *     console.log(`Rate limited until ${new Date(error.resetTime)}`);
 *   }
 * }
 */
export function isRateLimitError(error: unknown): error is RateLimitError {
  return error instanceof RateLimitError;
}

/**
 * Middleware function for rate limiting
 * This function should be used in API routes for login
 *
 * @since 1.0.0
 * @category Authentication
 *
 * @param {Request} request - The incoming HTTP request
 * @returns {RateLimitResponse} Object with limited status and optional reset time
 * @throws {Error} If unable to determine client IP address
 *
 * @example
 * // Using in an API endpoint
 * export async function POST(request: Request) {
 *   const rateLimitResult = rateLimitMiddleware(request);
 *
 *   if (rateLimitResult.limited) {
 *     return new Response(
 *       JSON.stringify({ error: 'Too many login attempts' }),
 *       {
 *         status: 429,
 *         headers: { 'Retry-After': Math.ceil(rateLimitResult.resetTime! / 1000).toString() }
 *       }
 *     );
 *   }
 *
 *   // Continue with normal login flow
 * }
 */
export function rateLimitMiddleware(request: Request): RateLimitResponse {
  // Extract the IP address from the request
  const ip = getClientIpFromRequest(request);

  if (isRateLimited(ip)) {
    return {
      limited: true,
      resetTime: getRateLimitResetTime(ip),
    };
  }

  return { limited: false };
}

/**
 * Helper function to extract the client IP from a request
 *
 * @since 1.0.0
 * @category Utility
 *
 * @param {Request} request - The incoming HTTP request
 * @returns {string} The client IP address
 * @private
 */
function getClientIpFromRequest(request: Request): string {
  // Try to extract from X-Forwarded-For header (common when behind proxies)
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0].trim();
    if (firstIp) {
      return firstIp;
    }
  }

  // Try other common headers
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  // Fallback to a placeholder - in real implementations,
  // you'd get this from the server/framework directly
  return "unknown-ip";
}
