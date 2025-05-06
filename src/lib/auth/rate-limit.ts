// In-memory storage for rate limiting
// In a production environment, a persistent store like Redis should be used
const loginAttempts: Record<string, { count: number; resetTime: number }> = {};

// Constants for rate limiting settings
const MAX_LOGIN_ATTEMPTS = 5; // Maximum number of login attempts
const LOGIN_WINDOW_MS = 15 * 60 * 1000; // 15 minutes in milliseconds
const IP_BLOCK_DURATION_MS = 60 * 60 * 1000; // 1 hour in milliseconds

/**
 * Checks if an IP address has exceeded the rate limit
 * @param ip - The IP address to check
 * @returns Boolean indicating if the IP is rate limited
 */
export function isRateLimited(ip: string): boolean {
  const now = Date.now();

  // Clean up expired entries
  cleanupExpiredEntries();

  // If the IP is not in memory, it's not limited
  if (!loginAttempts[ip]) {
    return false;
  }

  // If the reset time is in the future and the maximum number of attempts has been reached,
  // the IP is limited
  return (
    loginAttempts[ip].resetTime > now &&
    loginAttempts[ip].count >= MAX_LOGIN_ATTEMPTS
  );
}

/**
 * Records a failed login attempt for an IP address
 * @param ip - The IP address to record the failed attempt for
 */
export function recordFailedLoginAttempt(ip: string): void {
  const now = Date.now();

  // If the IP is not in memory or the reset time has expired,
  // create a new entry
  if (!loginAttempts[ip] || loginAttempts[ip].resetTime <= now) {
    loginAttempts[ip] = {
      count: 1,
      resetTime: now + LOGIN_WINDOW_MS,
    };
    return;
  }

  // Increase the attempt count
  loginAttempts[ip].count += 1;

  // If the maximum number of attempts has been reached, extend the block duration
  if (loginAttempts[ip].count >= MAX_LOGIN_ATTEMPTS) {
    loginAttempts[ip].resetTime = now + IP_BLOCK_DURATION_MS;
  }
}

/**
 * Resets the rate limit for an IP address (e.g., after successful login)
 * @param ip - The IP address to reset
 */
export function resetRateLimit(ip: string): void {
  delete loginAttempts[ip];
}

/**
 * Returns the remaining time until the rate limit reset
 * @param ip - The IP address to check
 * @returns Time in milliseconds until the reset
 */
export function getRateLimitResetTime(ip: string): number {
  if (!loginAttempts[ip]) {
    return 0;
  }

  const now = Date.now();
  const resetTime = loginAttempts[ip].resetTime;

  return Math.max(0, resetTime - now);
}

/**
 * Returns the number of remaining login attempts
 * @param ip - The IP address to check
 * @returns Number of remaining login attempts
 */
export function getRemainingLoginAttempts(ip: string): number {
  if (!loginAttempts[ip]) {
    return MAX_LOGIN_ATTEMPTS;
  }

  return Math.max(0, MAX_LOGIN_ATTEMPTS - loginAttempts[ip].count);
}

/**
 * Cleans up expired entries from memory
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();

  Object.keys(loginAttempts).forEach((ip) => {
    if (loginAttempts[ip].resetTime <= now) {
      delete loginAttempts[ip];
    }
  });
}

/**
 * Middleware function for rate limiting
 * This function should be used in API routes for login
 * @param request - The incoming HTTP request
 * @returns Object with limited status and optional reset time
 */
export function rateLimitMiddleware(request: Request): {
  limited: boolean;
  resetTime?: number;
} {
  // In a real application, the IP address would be extracted from the request
  // Here we use the IP from the X-Forwarded-For header or the remote address
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    "unknown-ip";

  if (isRateLimited(ip)) {
    return {
      limited: true,
      resetTime: getRateLimitResetTime(ip),
    };
  }

  return { limited: false };
}
