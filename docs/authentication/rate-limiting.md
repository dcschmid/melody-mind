# Rate Limiting System

## Overview

The Rate Limiting System is a security module for the MelodyMind application that prevents brute
force attacks by limiting login attempts from specific IP addresses. It provides mechanisms to
track, limit, and manage authentication attempts to protect user accounts.

![Rate Limiting Diagram](../public/docs/rate-limiting-diagram.png)

## Key Features

- IP-based rate limiting for authentication endpoints
- Configurable attempt limits and blocking durations
- Automatic cleanup of expired rate limit entries
- Helper utilities for middleware integration
- Type-safe implementation with branded types

## Architecture

The rate limiting system uses an in-memory storage approach with the following components:

```
┌───────────────────┐     ┌───────────────────┐     ┌───────────────────┐
│                   │     │                   │     │                   │
│  Request Handler  │────▶│  Rate Limiting    │────▶│  Authentication   │
│  (API Endpoints)  │     │  Middleware       │     │  Logic            │
│                   │     │                   │     │                   │
└───────────────────┘     └───────────────────┘     └───────────────────┘
                                   │
                                   ▼
                          ┌───────────────────┐
                          │                   │
                          │  In-Memory Store  │
                          │  (Login Attempts) │
                          │                   │
                          └───────────────────┘
```

## Type Definitions

### IPAddress

```typescript
/**
 * Branded type for IP addresses to ensure type safety
 * Prevents accidental usage of arbitrary strings where IP addresses are expected
 *
 * @since 1.0.0
 */
type IPAddress = string & { readonly __brand: unique symbol };
```

### LoginAttemptRecord

```typescript
/**
 * Interface for login attempt tracking
 *
 * @since 1.0.0
 */
interface LoginAttemptRecord {
  /** Number of failed login attempts */
  count: number;
  /** Timestamp when the rate limit will reset */
  resetTime: number;
}
```

### RateLimitResponse

```typescript
/**
 * Rate limit response type returned by the middleware
 *
 * @since 1.0.0
 */
interface RateLimitResponse {
  /** Whether the request is rate limited */
  limited: boolean;
  /** Time in milliseconds until the rate limit resets, if limited */
  resetTime?: number;
}
```

### RateLimitError

```typescript
/**
 * Error class for rate limiting issues
 *
 * @since 1.0.0
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
```

## Configuration

The rate limiting module uses the following configurable constants:

| Constant               | Default Value           | Description                                        |
| ---------------------- | ----------------------- | -------------------------------------------------- |
| `MAX_LOGIN_ATTEMPTS`   | 5                       | Maximum number of login attempts before blocking   |
| `LOGIN_WINDOW_MS`      | 15 _ 60 _ 1000 (15 min) | Time window for tracking login attempts            |
| `IP_BLOCK_DURATION_MS` | 60 _ 60 _ 1000 (1 hour) | Duration to block IPs after exceeding max attempts |

## API Reference

Below is a summary of the main functions provided by the rate limiting module:

### isRateLimited(ip: string): boolean

Checks if an IP address has exceeded the rate limit.

### recordFailedLoginAttempt(ip: string): void

Records a failed login attempt for an IP address.

### resetRateLimit(ip: string): void

Resets the rate limit for an IP address (e.g., after successful login).

### getRateLimitResetTime(ip: string): number

Returns the remaining time until the rate limit reset in milliseconds.

### getRemainingLoginAttempts(ip: string): number

Returns the number of remaining login attempts.

### isRateLimitError(error: unknown): boolean

Type guard to check if an error is a RateLimitError.

### rateLimitMiddleware(request: Request): RateLimitResponse

Middleware function for rate limiting that should be used in API routes for login.

## Usage Examples

Here's a complete example of integrating rate limiting in an authentication API route:

```typescript
import {
  rateLimitMiddleware,
  recordFailedLoginAttempt,
  resetRateLimit,
} from "../lib/auth/rate-limit";
import { authenticateUser } from "../lib/auth/authentication";

export async function POST(request: Request) {
  // Check if the IP is rate limited
  const rateLimitResult = rateLimitMiddleware(request);

  if (rateLimitResult.limited) {
    const retryAfterSeconds = Math.ceil((rateLimitResult.resetTime || 0) / 1000);

    return new Response(
      JSON.stringify({
        error: "Too many login attempts",
        message: `Please try again after ${retryAfterSeconds} seconds`,
        retryAfter: retryAfterSeconds,
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(retryAfterSeconds),
        },
      }
    );
  }

  // Process the login request
  try {
    const { username, password } = await request.json();
    const ip = getClientIpFromRequest(request);

    // Authenticate the user
    const authResult = await authenticateUser(username, password);

    if (authResult.success) {
      // Reset rate limit on successful login
      resetRateLimit(ip);

      return new Response(
        JSON.stringify({
          success: true,
          token: authResult.token,
          user: authResult.user,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      // Record failed login attempt
      recordFailedLoginAttempt(ip);

      return new Response(
        JSON.stringify({
          error: "Authentication failed",
          message: "Invalid username or password",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    // Handle any errors
    console.error("Login error:", error);

    return new Response(
      JSON.stringify({
        error: "Server error",
        message: "An error occurred during authentication",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

function getClientIpFromRequest(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0].trim();
    if (firstIp) return firstIp;
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;

  return "unknown-ip";
}
```

## Production Considerations

The current implementation uses an in-memory Map for storing rate limiting data. In a production
environment, consider the following improvements:

### Using a Persistent Store

Replace the in-memory storage with a persistent store like Redis:

```typescript
import { createClient } from "redis";

// Create Redis client
const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

// Connect to Redis
await redisClient.connect();

// Implement rate limiting with Redis
async function isRateLimited(ip: string): Promise<boolean> {
  const key = `ratelimit:${ip}`;
  const attempts = await redisClient.get(key);

  if (!attempts) {
    return false;
  }

  const data = JSON.parse(attempts);
  const now = Date.now();

  return data.resetTime > now && data.count >= MAX_LOGIN_ATTEMPTS;
}

async function recordFailedLoginAttempt(ip: string): Promise<void> {
  const key = `ratelimit:${ip}`;
  const now = Date.now();

  const attemptsJson = await redisClient.get(key);

  if (!attemptsJson || JSON.parse(attemptsJson).resetTime <= now) {
    await redisClient.set(
      key,
      JSON.stringify({
        count: 1,
        resetTime: now + LOGIN_WINDOW_MS,
      })
    );

    // Set an expiration to automatically clean up
    await redisClient.expire(key, Math.ceil(LOGIN_WINDOW_MS / 1000));
    return;
  }

  const attempts = JSON.parse(attemptsJson);
  const newCount = attempts.count + 1;

  const newResetTime =
    newCount >= MAX_LOGIN_ATTEMPTS ? now + IP_BLOCK_DURATION_MS : attempts.resetTime;

  await redisClient.set(
    key,
    JSON.stringify({
      count: newCount,
      resetTime: newResetTime,
    })
  );

  // Set an expiration based on the new reset time
  const expirationSeconds = Math.ceil((newResetTime - now) / 1000);
  await redisClient.expire(key, expirationSeconds);
}
```

### Distributed Systems Considerations

In a distributed environment with multiple server instances:

1. **Use a shared Redis instance** across all application servers
2. **Implement atomic operations** to prevent race conditions
3. **Set appropriate TTL values** for Redis keys to manage memory usage
4. **Consider using Redis Lua scripts** for complex rate limiting logic to ensure atomicity

### Security Considerations

1. **IP spoofing protection**: Implement additional verification if IP spoofing is a concern
2. **Progressive delays**: Consider implementing progressive delays for repeated failures
3. **Geographic restrictions**: Optionally block login attempts from unexpected countries
4. **Monitoring & alerting**: Set up alerts for unusual patterns of rate limit triggers
5. **Account lockout notification**: Notify users when their account triggers rate limits

## Accessibility Considerations

The rate limiting implementation doesn't directly impact the user interface, but there are
accessibility considerations for the error messages presented to users:

1. **Clear error messages**: Ensure error messages clearly explain the situation
2. **Provide helpful guidance**: Include information on when users can try again
3. **Screen reader friendly**: Make sure error notifications are accessible to screen readers
4. **Support for keyboard navigation**: All recovery options should be keyboard accessible
5. **Adequate contrast**: Error messages should meet WCAG AAA contrast requirements

### Example of an Accessible Rate Limit Error Component

```tsx
import React from "react";
import { formatDistanceToNow } from "date-fns";

interface RateLimitErrorProps {
  resetTime: number;
}

export function RateLimitError({ resetTime }: RateLimitErrorProps) {
  const resetDate = new Date(Date.now() + resetTime);
  const timeToReset = formatDistanceToNow(resetDate);

  return (
    <div role="alert" aria-live="assertive" className="rate-limit-error">
      <h2>Account Protection Activated</h2>
      <p>
        To protect your account, login has been temporarily disabled due to too many failed
        attempts.
      </p>
      <p>
        You can try again <strong>{timeToReset}</strong>.
      </p>
      <button className="alternative-action" aria-label="Go to password reset page">
        Reset your password instead
      </button>
    </div>
  );
}
```

## Related Components and Services

- [Authentication Service](../authentication/AuthService.md) - Core authentication functionality
- [JWT Token Management](../authentication/jwt.md) - Token management for authenticated users
- [Authentication Middleware](../authentication/middleware.md) - Middleware for protected routes
- [Password Validation](../authentication/password-validation.md) - Password strength requirements

## Changelog

### Version 1.0.0 (Initial release)

- Implemented basic rate limiting functionality
- Added IP-based tracking of login attempts
- Added middleware for API routes
- Included helper utilities for management

## Future Improvements

- [ ] Add support for Redis as a persistent store
- [ ] Implement progressive delays for repeated failures
- [ ] Add country-based filtering options
- [ ] Create admin dashboard for monitoring rate limit triggers
- [ ] Expand rate limiting to other security-sensitive endpoints
