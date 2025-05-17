# Implementing Rate Limiting in MelodyMind

This guide explains how to implement rate limiting in different parts of the MelodyMind application
using the rate limiting module.

## Prerequisites

- Basic understanding of MelodyMind authentication system
- Access to the authentication module source code
- Understanding of API endpoints and middleware

## Integration Scenarios

### Protecting Authentication Endpoints

The most common use case is to protect login endpoints from brute force attacks.

```typescript
// filepath: /home/daniel/projects/melody-mind/src/pages/api/auth/login.ts
import {
  rateLimitMiddleware,
  recordFailedLoginAttempt,
  resetRateLimit,
} from "../../../lib/auth/rate-limit";

export async function POST(request: Request) {
  try {
    // Apply rate limiting middleware
    const rateLimit = rateLimitMiddleware(request);

    if (rateLimit.limited) {
      return new Response(
        JSON.stringify({
          error: "Too many login attempts",
          message: "Please try again later",
          retryAfter: Math.ceil((rateLimit.resetTime || 0) / 1000),
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": Math.ceil((rateLimit.resetTime || 0) / 1000).toString(),
          },
        }
      );
    }

    // Process login
    const { username, password } = await request.json();
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown-ip";

    // Authenticate
    const authResult = await authenticateUser(username, password);

    if (authResult.success) {
      // Reset rate limit counter after successful login
      resetRateLimit(ip);

      // Proceed with login...
      return new Response(JSON.stringify({ success: true, token: authResult.token }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      // Record failed attempt
      recordFailedLoginAttempt(ip);

      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
```

### Creating a Global Middleware

You can create a global middleware that applies rate limiting to multiple routes:

```typescript
// filepath: /home/daniel/projects/melody-mind/src/middleware/rateLimit.ts
import { rateLimitMiddleware } from "../lib/auth/rate-limit";
import type { MiddlewareHandler } from "astro";

export const rateLimitHandler: MiddlewareHandler = async ({ request, locals }, next) => {
  // Only apply to specific routes
  if (request.url.includes("/api/auth/")) {
    const rateLimit = rateLimitMiddleware(request);

    if (rateLimit.limited) {
      return new Response(
        JSON.stringify({
          error: "Rate limit exceeded",
          message: "Too many requests, please try again later",
          retryAfter: Math.ceil((rateLimit.resetTime || 0) / 1000),
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": Math.ceil((rateLimit.resetTime || 0) / 1000).toString(),
          },
        }
      );
    }
  }

  // Continue processing the request
  return next();
};
```

### Using Remaining Attempts for User Feedback

This example shows how to display feedback to users about their remaining login attempts:

```typescript
// filepath: /home/daniel/projects/melody-mind/src/components/LoginForm.astro
---
import { getRemainingLoginAttempts } from '../lib/auth/rate-limit';

// Get current client IP
const clientIp = Astro.request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown-ip';

// Get remaining attempts
const remainingAttempts = getRemainingLoginAttempts(clientIp);
const showWarning = remainingAttempts < 3; // Show warning when less than 3 attempts left
---

<form class="login-form" method="post" action="/api/auth/login">
  <h2>Login to MelodyMind</h2>

  <div class="form-group">
    <label for="username">Username</label>
    <input type="text" id="username" name="username" required />
  </div>

  <div class="form-group">
    <label for="password">Password</label>
    <input type="password" id="password" name="password" required />
  </div>

  {showWarning && (
    <div class="attempt-warning" role="alert">
      <p>You have {remainingAttempts} login {remainingAttempts === 1 ? 'attempt' : 'attempts'} remaining before temporary lockout.</p>
    </div>
  )}

  <button type="submit">Login</button>

  <div class="links">
    <a href="/auth/forgot-password">Forgot password?</a>
    <a href="/auth/register">Create account</a>
  </div>
</form>

<style>
  .attempt-warning {
    background-color: #fff3cd;
    color: #856404;
    padding: 0.5rem;
    border-radius: 4px;
    margin-bottom: 1rem;
    font-size: 0.875rem;
  }
</style>
```

### Creating a Rate Limit Error Page

You can create a dedicated page for users who have been rate limited:

```typescript
// filepath: /home/daniel/projects/melody-mind/src/pages/auth/rate-limited.astro
---
import Layout from '../../layouts/Layout.astro';
import { getRateLimitResetTime } from '../../lib/auth/rate-limit';

// Get the IP address
const ip = Astro.request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown-ip';

// Get the reset time
const resetTimeMs = getRateLimitResetTime(ip);
const resetTimeMinutes = Math.ceil(resetTimeMs / 60000);
---

<Layout title="Account Protection - MelodyMind">
  <main class="container">
    <div class="rate-limit-notice">
      <h1>Account Protection Active</h1>

      <div class="lock-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      </div>

      <p>For your security, we've temporarily limited login attempts for this account due to multiple failed login attempts.</p>

      <div class="time-info">
        <h2>Please try again in:</h2>
        <div class="time-display">{resetTimeMinutes} {resetTimeMinutes === 1 ? 'minute' : 'minutes'}</div>
      </div>

      <div class="options">
        <h3>Other options:</h3>
        <a href="/auth/forgot-password" class="btn btn-primary">Reset your password</a>
        <a href="/contact" class="btn btn-outline">Contact support</a>
      </div>
    </div>
  </main>
</Layout>

<style>
  .rate-limit-notice {
    max-width: 600px;
    margin: 2rem auto;
    padding: 2rem;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
  }

  .lock-icon {
    margin: 2rem 0;
    color: #5a67d8;
  }

  .time-info {
    margin: 2rem 0;
  }

  .time-display {
    font-size: 2rem;
    font-weight: bold;
    color: #5a67d8;
    margin: 1rem 0;
  }

  .options {
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }

  .btn {
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.2s ease;
  }

  .btn-primary {
    background-color: #5a67d8;
    color: white;
  }

  .btn-outline {
    border: 1px solid #5a67d8;
    color: #5a67d8;
  }
</style>
```

## Advanced Scenarios

### Implementing Progressive Rate Limiting

This example implements a progressive rate limiting strategy where the block duration increases with
repeated failures:

```typescript
// Advanced rate limiting with progressive timeouts
async function handleLoginWithProgressiveRateLimit(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown-ip";

  // Get the attempt count from a persistent store
  const attemptsData = await getAttemptData(ip);

  // Calculate block duration based on previous blocks
  let blockDuration = IP_BLOCK_DURATION_MS;

  if (attemptsData.previousBlocks > 0) {
    // Increase block duration exponentially with each previous block
    // 1 hour -> 4 hours -> 12 hours -> 24 hours (maximum)
    blockDuration = Math.min(
      IP_BLOCK_DURATION_MS * Math.pow(3, attemptsData.previousBlocks),
      24 * 60 * 60 * 1000 // Max 24 hours
    );
  }

  // Check rate limit with custom block duration
  if (isRateLimitedWithDuration(ip, blockDuration)) {
    return createRateLimitResponse(getRateLimitResetTime(ip));
  }

  // Process login...
  const { username, password } = await request.json();

  try {
    const authResult = await authenticateUser(username, password);

    if (authResult.success) {
      // Reset rate limit and block history after successful login
      await resetRateLimitHistory(ip);

      return new Response(JSON.stringify({ success: true, token: authResult.token }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      // Record failed attempt
      await recordFailedLoginAttemptWithHistory(ip);

      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Helper function to create a rate limit response
function createRateLimitResponse(resetTimeMs: number) {
  const resetSeconds = Math.ceil(resetTimeMs / 1000);

  return new Response(
    JSON.stringify({
      error: "Rate limit exceeded",
      message: "Too many login attempts",
      retryAfter: resetSeconds,
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": resetSeconds.toString(),
      },
    }
  );
}
```

## Testing Rate Limiting

Here's a test script to verify your rate limiting implementation:

```typescript
// filepath: /home/daniel/projects/melody-mind/src/tests/rate-limit.test.ts
import { expect, test, beforeEach } from "vitest";
import {
  isRateLimited,
  recordFailedLoginAttempt,
  resetRateLimit,
  getRemainingLoginAttempts,
} from "../lib/auth/rate-limit";

// Mock an IP address for testing
const TEST_IP = "192.168.1.100";

// Reset rate limiting for the test IP before each test
beforeEach(() => {
  resetRateLimit(TEST_IP);
});

test("should allow requests under the rate limit", () => {
  // Initial state should not be rate limited
  expect(isRateLimited(TEST_IP)).toBe(false);

  // Record 4 failed attempts (below the 5 attempt limit)
  for (let i = 0; i < 4; i++) {
    recordFailedLoginAttempt(TEST_IP);
  }

  // Should still be allowed
  expect(isRateLimited(TEST_IP)).toBe(false);

  // Should have 1 attempt remaining
  expect(getRemainingLoginAttempts(TEST_IP)).toBe(1);
});

test("should block requests that exceed the rate limit", () => {
  // Record 5 failed attempts (at the limit)
  for (let i = 0; i < 5; i++) {
    recordFailedLoginAttempt(TEST_IP);
  }

  // Should be rate limited
  expect(isRateLimited(TEST_IP)).toBe(true);

  // Should have 0 attempts remaining
  expect(getRemainingLoginAttempts(TEST_IP)).toBe(0);
});

test("should reset rate limit correctly", () => {
  // Record 3 failed attempts
  for (let i = 0; i < 3; i++) {
    recordFailedLoginAttempt(TEST_IP);
  }

  // Should have 2 attempts remaining
  expect(getRemainingLoginAttempts(TEST_IP)).toBe(2);

  // Reset the rate limit
  resetRateLimit(TEST_IP);

  // Should be allowed again with full attempts
  expect(isRateLimited(TEST_IP)).toBe(false);
  expect(getRemainingLoginAttempts(TEST_IP)).toBe(5);
});
```

## Security Considerations

- **Do not expose rate limit implementation details** to users beyond what is necessary
- **Monitor rate limit triggers** to detect potential attack patterns
- **Consider IP reliability** - IP addresses can be shared (NAT, proxies) or spoofed
- **Implement additional security measures** like CAPTCHA for suspicious activity
- **Apply rate limiting to all security-sensitive endpoints**, not just login

## Troubleshooting

### Common Issues

1. **False positives with shared IPs**: Multiple users behind the same NAT or proxy may trigger
   limits
   - Solution: Consider additional user identifiers beyond IP
2. **Memory leaks with in-memory storage**: Without proper cleanup, memory usage can grow
   - Solution: Ensure `cleanupExpiredEntries` is called regularly
3. **Lost rate limiting state on server restart**: In-memory storage resets when server restarts

   - Solution: Implement persistent storage like Redis

4. **Rate limiting not working behind proxies**: Incorrect IP extraction
   - Solution: Ensure proper forwarded headers are configured and parsed

## Related Documentation

- [Authentication Overview](./authentication.md)
- [Security Best Practices](../security/best-practices.md)
- [API Authentication](./api-authentication.md)
- [Handling Failed Login Attempts](./failed-login-handling.md)
