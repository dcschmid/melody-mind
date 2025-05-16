# Authentication Middleware Module

## Overview

The Authentication Middleware module provides a robust security layer for the MelodyMind application
API. It handles user authentication, Cross-Site Request Forgery (CSRF) protection, and rate limiting
to ensure secure access to protected resources.

This module implements multiple layers of security following best practices, including:

- JWT-based authentication
- CSRF protection for state-changing operations
- Rate limiting to prevent brute force attacks
- Type-safe error handling with branded types
- Clear error codes for programmatic responses

## Core Types and Interfaces

### AuthErrorCode

```typescript
/**
 * Template literal type for standardized authentication error messages
 * @since 3.0.0
 */
export type AuthErrorCode =
  | "auth:no_token"
  | "auth:invalid_token"
  | "auth:expired_token"
  | "auth:user_not_found"
  | "auth:csrf_invalid"
  | "auth:rate_limited";
```

Provides standardized error codes for authentication failures, enabling consistent error handling
and localization.

### AuthError

```typescript
/**
 * Specialized error class for authentication errors
 * @since 3.0.0
 * @category Authentication
 */
export class AuthError extends Error {
  /** Specific error code for programmatic handling */
  public readonly code: AuthErrorCode;

  /**
   * Creates a new AuthError instance
   *
   * @param {string} message - Human-readable error message
   * @param {AuthErrorCode} code - Machine-readable error code
   */
  constructor(message: string, code: AuthErrorCode) {
    super(message);
    this.name = "AuthError";
    this.code = code;
  }
}
```

A specialized error class that extends the standard JavaScript Error with authentication-specific
error codes.

### AuthContext

```typescript
/**
 * Type for authentication context.
 * Contains information about authentication status and user details.
 *
 * @since 3.0.0
 * @category Authentication
 */
export type AuthContext = {
  /** Whether the user is authenticated */
  authenticated: boolean;
  /** User information when authenticated */
  user?: {
    /** The unique user identifier */
    id: UserId;
    /** The user's email address */
    email: EmailAddress;
  };
  /** Error message when authentication fails */
  error?: string;
  /** Specific error code for programmatic handling */
  errorCode?: AuthErrorCode;
};
```

Represents the result of an authentication operation, containing user information when successful or
error details when authentication fails.

### AuthResult

```typescript
/**
 * Result type for authentication operations
 * @since 3.0.0
 */
export type AuthResult = {
  /** Whether the authentication was successful */
  authorized: boolean;
  /** Authentication context containing user information */
  context?: AuthContext;
  /** Error message when authentication fails */
  error?: string;
  /** Whether the request was rate limited */
  rateLimited?: boolean;
  /** Time until rate limit reset (in milliseconds) */
  resetTime?: number;
};
```

A comprehensive result object returned by authentication middleware functions, containing
authorization status, user context, and additional security metadata.

## Core Functions

### authenticateRequest

```typescript
/**
 * Authentication middleware for requests.
 * Extracts and verifies the JWT token from the Authorization header.
 *
 * @since 3.0.0
 * @category Middleware
 *
 * @param {Request} request - The incoming request object
 * @returns {Promise<AuthContext>} AuthContext containing authentication status and user information if successful
 *
 * @throws {AuthError} When token verification fails
 */
export async function authenticateRequest(request: Request): Promise<AuthContext>;
```

The primary authentication function that extracts and validates JWT tokens from request headers.

#### Parameters

| Parameter | Type    | Description                      |
| --------- | ------- | -------------------------------- |
| request   | Request | The incoming HTTP request object |

#### Returns

A Promise that resolves to an `AuthContext` object containing:

- `authenticated`: Boolean indicating success
- `user`: User object with type-safe ID and email (when authenticated)
- `error`: Error message (when authentication fails)
- `errorCode`: Standardized error code (when authentication fails)

#### Error Handling

- Returns `{ authenticated: false, errorCode: "auth:no_token" }` when no token is provided
- Returns `{ authenticated: false, errorCode: "auth:invalid_token" }` for invalid/expired tokens
- Returns `{ authenticated: false, errorCode: "auth:user_not_found" }` when user doesn't exist

#### Example Usage

```typescript
// In an API route handler
export async function GET(request: Request) {
  const authContext = await authenticateRequest(request);

  if (!authContext.authenticated) {
    return new Response(JSON.stringify({ error: authContext.error }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // User is authenticated, proceed with the request
  const userId = authContext.user.id;
  // ... handle the authenticated request
}
```

### requireAuth

```typescript
/**
 * Middleware to protect routes that require authentication.
 * Wraps authenticateRequest with a standardized response format.
 *
 * @since 3.0.0
 * @category Middleware
 *
 * @param {Request} request - The incoming request object
 * @returns {Promise<AuthResult>} Object containing authorization status and context information
 */
export async function requireAuth(request: Request): Promise<AuthResult>;
```

A higher-level wrapper around `authenticateRequest` that provides a standardized response format for
route protection.

#### Parameters

| Parameter | Type    | Description                      |
| --------- | ------- | -------------------------------- |
| request   | Request | The incoming HTTP request object |

#### Returns

A Promise that resolves to an `AuthResult` object with:

- `authorized`: Boolean indicating if access is authorized
- `context`: The full authentication context (when authorized)
- `error`: Error message (when unauthorized)

#### Example Usage

```typescript
// In an API route handler
export async function POST(request: Request) {
  const authResult = await requireAuth(request);

  if (!authResult.authorized) {
    return new Response(JSON.stringify({ error: authResult.error }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Request is authorized
  const userData = authResult.context.user;
  // ... handle the authorized request
}
```

### protectRoute

```typescript
/**
 * Combined middleware for authentication, CSRF protection and rate limiting.
 * This function should be used for all POST/PUT/DELETE requests.
 *
 * @since 3.0.0
 * @category Middleware
 *
 * @param {Request} request - The incoming request object
 * @returns {Promise<AuthResult>} Object containing authorization status, context, and additional security information
 */
export async function protectRoute(request: Request): Promise<AuthResult>;
```

A comprehensive security middleware that combines authentication, CSRF protection, and rate limiting
for state-changing operations.

#### Parameters

| Parameter | Type    | Description                      |
| --------- | ------- | -------------------------------- |
| request   | Request | The incoming HTTP request object |

#### Returns

A Promise that resolves to an `AuthResult` object with:

- `authorized`: Boolean indicating if access is authorized
- `context`: The full authentication context (when authorized)
- `error`: Error message (when unauthorized)
- `rateLimited`: Boolean indicating if the request was rate-limited
- `resetTime`: Time in milliseconds until rate limit resets (if rate-limited)

#### Security Features

1. **Rate Limiting**: Applied to login routes to prevent brute force attacks
2. **CSRF Protection**: Applied to all POST/PUT/DELETE requests
3. **Authentication**: Ensures the user is properly authenticated

#### Example Usage

```typescript
// In an API route handler for a state-changing operation
export async function POST(request: Request) {
  const securityResult = await protectRoute(request);

  if (!securityResult.authorized) {
    // Handle different error types
    let status = 401;

    if (securityResult.rateLimited) {
      status = 429; // Too Many Requests

      // Include rate limit information in response
      return new Response(
        JSON.stringify({
          error: securityResult.error,
          resetTime: securityResult.resetTime,
        }),
        {
          status,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": Math.ceil(securityResult.resetTime / 1000).toString(),
          },
        }
      );
    }

    return new Response(JSON.stringify({ error: securityResult.error }), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Request passed all security checks
  const userData = securityResult.context.user;
  // ... handle the authorized and protected request
}
```

### getClientIp

```typescript
/**
 * Helper function to extract the client IP address from a request
 *
 * @since 3.0.0
 * @category Utilities
 *
 * @param {Request} request - The incoming request object
 * @returns {string} The client's IP address as a string
 */
export function getClientIp(request: Request): string;
```

A utility function that extracts the client IP address from HTTP request headers.

#### Parameters

| Parameter | Type    | Description                      |
| --------- | ------- | -------------------------------- |
| request   | Request | The incoming HTTP request object |

#### Returns

A string containing the client's IP address, or "unknown-ip" if it cannot be determined.

#### Example Usage

```typescript
// Get the client IP for logging or rate limiting
const ipAddress = getClientIp(request);
console.log(`Request from: ${ipAddress}`);
```

## Type Safety and Error Handling

### Type Guards

```typescript
/**
 * Type guard to check if an error is an AuthError
 *
 * @param {unknown} error - Error to check
 * @returns {boolean} True if the error is an AuthError
 */
export function isAuthError(error: unknown): error is AuthError;
```

A TypeScript type guard that safely determines if an unknown error is an `AuthError`.

#### Example Usage

```typescript
try {
  // Authentication code
} catch (error: unknown) {
  if (isAuthError(error)) {
    console.error(`Auth error (${error.code}): ${error.message}`);

    // Handle specific error codes
    switch (error.code) {
      case "auth:rate_limited":
        // Handle rate limiting
        break;
      case "auth:csrf_invalid":
        // Handle CSRF error
        break;
      default:
      // Handle other auth errors
    }
  } else {
    console.error("Unknown error", error);
  }
}
```

### Branded Types

The module uses branded types imported from the database module to ensure type safety:

```typescript
import { getUserByEmail, type UserId, type EmailAddress, createUserId } from "./db.js";
```

- `UserId`: A branded type for user identifiers
- `EmailAddress`: A branded type for email addresses
- `createUserId`: Utility function to create a branded UserId from a string

Branded types provide stronger type checking than ordinary strings, preventing type confusion and
potential security issues.

## Security Architecture

The middleware implements a layered security approach:

```
┌─────────────────┐
│                 │
│  Rate Limiting  │
│                 │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│                 │
│ CSRF Protection │
│                 │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│                 │
│ Authentication  │
│                 │
└─────────────────┘
```

This layered approach ensures:

1. Rate limiting is applied first to prevent DoS attacks
2. CSRF protection is verified for state-changing requests
3. Authentication is checked last, saving resources for obviously invalid requests

## Common Error Scenarios

| Error Code          | Description                             | HTTP Status | Mitigation                                                         |
| ------------------- | --------------------------------------- | ----------- | ------------------------------------------------------------------ |
| auth:no_token       | Request lacks authentication token      | 401         | Client must include valid JWT in Authorization header              |
| auth:invalid_token  | Token is malformed or signature invalid | 401         | Client should refresh token or re-authenticate                     |
| auth:expired_token  | Token has expired                       | 401         | Client should use refresh token to obtain new access token         |
| auth:user_not_found | Token is valid but user does not exist  | 401         | User may have been deleted, client should re-authenticate          |
| auth:csrf_invalid   | CSRF token missing or invalid           | 403         | Client must include valid CSRF token for state-changing operations |
| auth:rate_limited   | Too many requests from same client      | 429         | Client should wait until rate limit resets before retrying         |

## Implementation Notes

- All authentication operations are asynchronous and return Promises
- The module uses type-safe error handling with specific error codes
- CSRF protection is applied only to state-changing operations (POST/PUT/DELETE)
- Rate limiting is specifically targeted at login endpoints to prevent credential stuffing
- Type assertions are used to safely bridge between string-based APIs and branded types

## Related Components

- [JWT Module](../authentication/jwt.md) - Handles JWT token generation and validation
- [CSRF Protection](../security/csrf.md) - Implements CSRF token verification
- [Database User Module](../authentication/database.md) - Manages user data access
- [Rate Limiting](../security/rate-limiting.md) - Configures and manages rate limiting policies

## Breaking Changes

### Version 3.0.0

- Introduced branded types `UserId` and `EmailAddress`
- Added standardized `AuthErrorCode` type for error handling
- Replaced string error messages with structured error objects
- Added type guard `isAuthError` for improved error handling

### Version 2.5.0

- Added rate limiting to authentication endpoints
- Introduced CSRF protection for state-changing operations
- Added `AuthContext` type for improved type safety

## Security Considerations

1. **JWT Token Handling**:

   - Tokens are validated using cryptographic signatures
   - No sensitive data is stored in token claims
   - Short expiration times reduce the risk of token misuse

2. **CSRF Protection**:

   - All state-changing operations require valid CSRF tokens
   - Tokens are validated against the user's session

3. **Rate Limiting**:

   - Prevents brute force attacks on login endpoints
   - Uses client IP address for rate limit tracking
   - Includes proper Retry-After headers in responses

4. **Error Messages**:

   - Standardized error codes avoid information leakage
   - Human-readable messages follow a consistent format

5. **Type Safety**:
   - Branded types prevent accidental mixing of IDs and strings
   - Type guards enable safe handling of errors

## Accessibility Considerations

This server-side module doesn't directly impact accessibility, but it indirectly supports
accessibility by:

1. Providing clear, consistent error messages that can be properly communicated to users
2. Supporting reliable authentication for users with assistive technologies
3. Including rate limit information that can be properly communicated to screen readers
4. Using standardized error codes that can be mapped to localized error messages

## Testing the Module

Unit tests for this module should focus on:

1. Valid and invalid token handling
2. CSRF protection verification
3. Rate limiting thresholds and reset behavior
4. Error code consistency across different scenarios
5. Type safety with branded types

### Example Test Cases

```typescript
// Authentication success test
test("authenticateRequest should return valid context for authenticated user", async () => {
  const request = new Request("https://api.melodymind.com/protected", {
    headers: {
      Authorization: `Bearer ${validToken}`,
    },
  });

  const result = await authenticateRequest(request);
  expect(result.authenticated).toBe(true);
  expect(result.user).toBeDefined();
  expect(result.user.id).toBeDefined();
  expect(result.user.email).toBeDefined();
});

// Rate limiting test
test("protectRoute should return rate limited error when limit exceeded", async () => {
  // Setup multiple requests to exceed rate limit

  const result = await protectRoute(request);
  expect(result.authorized).toBe(false);
  expect(result.rateLimited).toBe(true);
  expect(result.resetTime).toBeGreaterThan(0);
});
```
