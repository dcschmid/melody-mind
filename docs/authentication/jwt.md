# JWT Authentication Module

## Overview

The JWT (JSON Web Token) authentication module provides secure token-based authentication for the
MelodyMind application. It handles the generation, verification, and renewal of access and refresh
tokens using industry standard practices.

![Authentication Flow](../../public/icons/auth-flow-diagram.png)

## Module Location

```
src/lib/auth/jwt.ts
```

## Type Definitions

### JwtToken

```typescript
/**
 * Branded type for token strings to prevent mixing with regular strings
 * @category Authentication
 */
export type JwtToken = string & { readonly __brand: unique symbol };
```

This branded type improves type safety by preventing regular strings from being used where JWT
tokens are expected, helping catch potential errors at compile time.

### TokenType

```typescript
/**
 * Token types used in the authentication system
 * @category Authentication
 */
export type TokenType = "access" | "refresh";
```

Identifies the two types of tokens in the system:

- `access` - Short-lived tokens used for API access
- `refresh` - Long-lived tokens used to obtain new access tokens

### JwtPayload

```typescript
/**
 * JWT payload structure with improved type safety
 * @category Authentication
 */
export interface JwtPayload {
  /** Unique identifier for the user */
  userId: string;
  /** User's email address */
  email: string;
  /** Token type (access or refresh) */
  type: TokenType;
  /** Issued at timestamp (added by JWT library) */
  iat?: number;
  /** Expiration timestamp (added by JWT library) */
  exp?: number;
}
```

The core data structure stored within JWT tokens. This includes essential user identification and
token metadata.

### TokenPair

```typescript
/**
 * Token pair containing both access and refresh tokens
 * @category Authentication
 */
export interface TokenPair {
  /** Token used for API access (short-lived) */
  accessToken: JwtToken;
  /** Token used to obtain new access tokens (long-lived) */
  refreshToken: JwtToken;
}
```

Represents a complete authentication set returned when a user logs in.

### JwtError

```typescript
/**
 * Custom error class for JWT-related errors
 * @category Authentication
 */
export class JwtError extends Error {
  /**
   * Creates a new JWT error
   * @param {string} message - Error message
   * @param {("invalid_token"|"expired_token"|"malformed_token"|"revoked_token")} code - Error code for more specific error handling
   */
  constructor(
    message: string,
    public readonly code:
      | "invalid_token"
      | "expired_token"
      | "malformed_token"
      | "revoked_token" = "invalid_token"
  ) {
    super(message);
    this.name = "JwtError";
    // Ensures proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, JwtError.prototype);
  }
}
```

A specialized error class for JWT-related errors that provides:

- Detailed error messages
- Error type classification via error codes
- Proper prototype chain for type checking with `instanceof`

## Core Functions

### Token Generation

#### generateAccessToken

```typescript
/**
 * Generates a JWT access token for a user
 *
 * @since 1.0.0
 * @category Authentication
 *
 * @param {User} user - The user object containing id and email
 * @returns {JwtToken} A signed JWT access token
 */
export function generateAccessToken(user: User): JwtToken;
```

Creates a short-lived JWT access token for authenticating API requests.

#### generateRefreshToken

```typescript
/**
 * Generates a refresh token for a user
 *
 * @since 1.0.0
 * @category Authentication
 *
 * @param {User} user - The user object containing id and email
 * @returns {JwtToken} A signed JWT refresh token
 */
export function generateRefreshToken(user: User): JwtToken;
```

Creates a long-lived refresh token that can be used to obtain new access tokens.

#### generateTokenPair

```typescript
/**
 * Generates a token pair (access token and refresh token)
 *
 * @since 1.0.0
 * @category Authentication
 *
 * @param {User} user - The user object containing id and email
 * @returns {TokenPair} An object containing both access and refresh tokens
 */
export function generateTokenPair(user: User): TokenPair;
```

Convenience function to generate both access and refresh tokens at once, typically used during
login.

### Token Verification

#### verifyAccessToken

```typescript
/**
 * Verifies a JWT token and returns the payload
 *
 * @since 1.0.0
 * @category Authentication
 *
 * @param {string} token - The JWT access token to verify
 * @returns {JwtPayload} The decoded payload
 * @throws {JwtError} When token is invalid, expired, or malformed
 */
export function verifyAccessToken(token: string): JwtPayload;
```

Verifies and decodes an access token, throwing detailed errors if the token is invalid.

#### safeVerifyAccessToken

```typescript
/**
 * Safe version of verifyAccessToken that doesn't throw exceptions
 *
 * @since 1.0.0
 * @category Authentication
 *
 * @param {string} token - The JWT access token to verify
 * @returns {JwtPayload | null} The decoded payload if valid, null otherwise
 */
export function safeVerifyAccessToken(token: string): JwtPayload | null;
```

A non-throwing variant that returns null for invalid tokens, useful for guard clauses.

#### verifyRefreshToken

```typescript
/**
 * Verifies a refresh token and returns the payload
 *
 * @since 1.0.0
 * @category Authentication
 *
 * @param {string} token - The JWT refresh token to verify
 * @returns {JwtPayload} The decoded payload
 * @throws {JwtError} When token is invalid, expired, or malformed
 */
export function verifyRefreshToken(token: string): JwtPayload;
```

Verifies and decodes a refresh token, throwing detailed errors if the token is invalid.

#### safeVerifyRefreshToken

```typescript
/**
 * Safe version of verifyRefreshToken that doesn't throw exceptions
 *
 * @since 1.0.0
 * @category Authentication
 *
 * @param {string} token - The JWT refresh token to verify
 * @returns {JwtPayload | null} The decoded payload if valid, null otherwise
 */
export function safeVerifyRefreshToken(token: string): JwtPayload | null;
```

A non-throwing variant that returns null for invalid tokens.

### Token Renewal

#### refreshAccessToken

```typescript
/**
 * Renews an access token using a valid refresh token
 *
 * @since 1.0.0
 * @category Authentication
 *
 * @param {string} refreshToken - The refresh token to use for renewal
 * @returns {Promise<JwtToken>} A new access token if successful
 * @throws {JwtError} When refresh token is invalid or expired
 */
export async function refreshAccessToken(refreshToken: string): Promise<JwtToken>;
```

Uses a valid refresh token to generate a new access token when the original expires.

#### safeRefreshAccessToken

```typescript
/**
 * Safe version of refreshAccessToken that doesn't throw exceptions
 *
 * @since 1.0.0
 * @category Authentication
 *
 * @param {string} refreshToken - The refresh token to use for renewal
 * @returns {Promise<JwtToken | null>} A new access token if successful, null otherwise
 */
export async function safeRefreshAccessToken(refreshToken: string): Promise<JwtToken | null>;
```

A non-throwing variant that returns null on failure.

### Authentication Helper

#### isAuthenticated

```typescript
/**
 * Checks if a token is valid and returns a boolean
 *
 * @since 1.0.0
 * @category Authentication
 *
 * @param {string} token - The JWT token to check
 * @returns {Promise<boolean>} True if the token is valid, false otherwise
 */
export async function isAuthenticated(token: string): Promise<boolean>;
```

Simple helper function to check if a token is valid without needing to process the payload.

## Usage Examples

### Basic Authentication Flow

```typescript
import {
  generateTokenPair,
  verifyAccessToken,
  refreshAccessToken,
  isJwtError,
} from "../lib/auth/jwt";
import type { User } from "../lib/auth/db";
import type { JwtToken } from "../lib/auth/jwt";

// 1. User Login - Generate tokens
async function loginUser(email: string, password: string) {
  // Authenticate user (implementation not shown)
  const user: User = await authenticateUser(email, password);

  // Generate token pair
  const tokens = generateTokenPair(user);

  // Store tokens (client-side storage not shown)
  return tokens;
}

// 2. Making Authenticated Requests
async function fetchUserData(accessToken: JwtToken) {
  try {
    // Verify the token first
    const payload = verifyAccessToken(accessToken);

    // Make authenticated request
    const response = await fetch("/api/user/profile", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return await response.json();
  } catch (error) {
    if (isJwtError(error)) {
      if (error.code === "expired_token") {
        // Handle expired token - trigger token refresh flow
        return await handleTokenRefresh();
      } else {
        // Handle other token errors
        console.error(`Authentication error: ${error.message}`);
        redirectToLogin();
      }
    }
    throw error;
  }
}

// 3. Token Refresh Flow
async function handleTokenRefresh() {
  try {
    // Get stored refresh token (implementation not shown)
    const refreshToken = getStoredRefreshToken();

    // Get new access token
    const newAccessToken = await refreshAccessToken(refreshToken);

    // Store new access token
    storeAccessToken(newAccessToken);

    // Retry the original request
    return await fetchUserData(newAccessToken);
  } catch (error) {
    // If refresh token is invalid, redirect to login
    redirectToLogin();
    throw new Error("Session expired. Please log in again.");
  }
}
```

### Token Validation in API Middleware

```typescript
import { safeVerifyAccessToken } from "../lib/auth/jwt";
import type { JwtPayload } from "../lib/auth/jwt";

/**
 * Express middleware to validate JWT tokens
 */
export function authenticateJwt(req, res, next) {
  // Extract token from Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const token = authHeader.split(" ")[1];

  // Verify token using the safe variant to avoid try/catch
  const payload = safeVerifyAccessToken(token);

  if (!payload) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  // Add user data to request for downstream handlers
  req.user = {
    id: payload.userId,
    email: payload.email,
  };

  next();
}
```

### Different Error Handling Approaches

```typescript
// Approach 1: Try/catch with error type checking
try {
  const payload = verifyAccessToken(token);
  // Process the payload
} catch (error) {
  if (isJwtError(error)) {
    switch (error.code) {
      case "expired_token":
        console.log("Token has expired");
        break;
      case "invalid_token":
        console.log("Token is invalid");
        break;
      case "malformed_token":
        console.log("Token is malformed");
        break;
      case "revoked_token":
        console.log("Token has been revoked");
        break;
    }
  } else {
    console.log("Unexpected error", error);
  }
}

// Approach 2: Using safe functions with null check
const payload = safeVerifyAccessToken(token);
if (payload) {
  // Process the payload
} else {
  // Handle invalid token case
  console.log("Token validation failed");
}
```

## Security Considerations

### Token Storage

- **Access tokens** should be stored in memory when possible, or in short-lived, secure HTTP-only
  cookies for web applications.
- **Refresh tokens** should be stored in secure HTTP-only cookies with appropriate attributes
  (Secure, SameSite).
- Never store tokens in localStorage or sessionStorage where they can be accessed by JavaScript.

### Token Expiration

- Access tokens should have a short lifetime (15-60 minutes, configured via `JWT_EXPIRES_IN`)
- Refresh tokens can have a longer lifetime (7 days, configured via `JWT_REFRESH_EXPIRES_IN`)
- Token rotation should be implemented for refresh tokens to enhance security

### Token Revocation

The current implementation does not include token revocation. For production environments, consider
implementing:

- A token blacklist/database for revoked tokens
- Updating the `refreshAccessToken` function to check if the refresh token has been revoked

### CSRF Protection

For web applications, additional CSRF protection should be implemented when using cookies for token
storage.

## Error Handling Best Practices

1. **Use Specific Error Types**: The module provides the `JwtError` class with specific error codes.
2. **Type Guards**: Use the `isJwtError` function to safely check error types.
3. **Safe Functions**: Use the `safeVerify*` and `safeRefresh*` functions when you want to avoid
   try/catch blocks.
4. **Detailed Error Messages**: Custom error messages can be created with specific error codes.

## Configuration

The module uses the following environment variables:

- `JWT_SECRET`: Secret key for signing tokens (defaults to a development value, must be set in
  production)
- `JWT_EXPIRES_IN`: Expiration time for access tokens (default: "24h")
- `JWT_REFRESH_EXPIRES_IN`: Expiration time for refresh tokens (default: "7d")

## Architecture Diagram

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│   Client App    │────▶│   JWT Module    │────▶│    Database     │
│    (Browser)    │     │ (Authentication)│     │  (User Store)   │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │                        │
        │                       │                        │
        ▼                       ▼                        ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Local Storage  │     │   API Routes    │     │  Token Refresh  │
│  (Token Store)  │     │  (Protected)    │     │    (Renewal)    │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## Accessibility Considerations

While the JWT authentication module doesn't directly impact UI, there are considerations for
authentication UI:

- Ensure error messages are clear and accessible
- Provide sufficient time for users to complete authentication flows
- Include appropriate ARIA attributes in authentication forms
- Allow session extension for users who may need more time

## Related Documentation

- [Authentication Overview](../authentication.md)
- [Database Authentication](./database.md)
- [Auth Service Component](../components/AuthService.md)
- [Email Verification](../components/EmailVerification.md)
- [CSRF Protection](../security/csrf.md)

## Changelog

### Version 2.0.0 (Planned)

- Add token revocation support
- Implement refresh token rotation
- Add support for token blacklisting

### Version 1.5.0

- Added safe variants of verification functions
- Enhanced error handling with specific error codes
- Added type safety with branded types

### Version 1.0.0

- Initial implementation of JWT authentication
- Basic token generation and verification
- Support for access and refresh tokens
