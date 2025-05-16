# MelodyMind Authentication System

## Overview

The MelodyMind authentication system provides a secure, type-safe implementation for user
management, authentication, and authorization within the MelodyMind music trivia application. This
document outlines the key components, features, and usage patterns.

## Core Features

- **Secure Authentication**: Email and password-based authentication with proper hashing
- **JWT-based Authorization**: Token-based API access with refresh capabilities
- **Password Management**: Reset and change functionality with security features
- **Type Safety**: Comprehensive TypeScript types for all operations
- **CSRF Protection**: Built-in protection against cross-site request forgery attacks
- **Rate Limiting**: Protection against brute-force and dictionary attacks
- **Email Verification**: Verification process for new user registrations
- **Role-based Access Control**: Differentiated access levels for different user types

## System Architecture

```
┌─────────────────┐     ┌────────────────────┐     ┌─────────────────┐
│                 │     │                    │     │                 │
│  User Interface │────▶│  Authentication    │────▶│  Database Layer │
│  Components     │     │  Service           │     │                 │
│                 │     │                    │     │                 │
└─────────────────┘     └────────────────────┘     └─────────────────┘
        │                         │                          │
        │                         │                          │
        ▼                         ▼                          ▼
┌─────────────────┐     ┌────────────────────┐     ┌─────────────────┐
│                 │     │                    │     │                 │
│ Form Validation │     │ Token Management   │     │  User Storage   │
│                 │     │                    │     │                 │
└─────────────────┘     └────────────────────┘     └─────────────────┘
```

### Key Components

1. **AuthService**: The main service providing authentication methods
   (`src/lib/auth/auth-service.ts`)
2. **Database Layer**: User operations and storage (`src/lib/auth/db.ts`)
3. **JWT Handling**: Token creation and validation (`src/lib/auth/jwt.ts`)
4. **CSRF Protection**: Protection against cross-site attacks (`src/lib/auth/csrf.ts`)
5. **Rate Limiting**: Prevention of brute force attacks (`src/lib/auth/rate-limit.ts`)
6. **Password Validation**: Security requirements enforcement
   (`src/lib/auth/password-validation.ts`)
7. **Middleware**: Route protection (`src/lib/auth/middleware.ts`)
8. **API Endpoints**: REST interfaces (`src/pages/api/auth/`)

## Data Model

The authentication system uses the `users` table in the Turso database with the following fields:

- `id`: Primary key, UUID as string
- `email`: User's email address (unique)
- `password_hash`: Bcrypt-hashed password
- `username`: Optional username
- `email_verified`: Email verification status
- `verification_token`: Token for email verification
- `verification_token_expires_at`: Expiration time of the verification token
- `reset_token`: Token for password reset
- `reset_token_expires_at`: Expiration time of the reset token
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

## Usage Examples

### User Login

```typescript
import { authService } from "../lib/auth/auth-service";

async function handleLogin(email: string, password: string) {
  const result = await authService.login(email, password);

  if (result.success) {
    // Login successful
    setUser(result.user);
    saveTokens(result.tokens);
    navigate("/dashboard");
  } else if (result.rateLimited) {
    // Rate limited
    const resetSeconds = Math.ceil(result.resetTime / 1000);
    showMessage(`Too many attempts. Try again in ${resetSeconds} seconds.`);
  } else {
    // Other error
    showMessage(translateError(result.error));
  }
}
```

### User Registration

```typescript
import { authService } from "../lib/auth/auth-service";

async function handleRegistration(userData) {
  const result = await authService.register({
    email: userData.email,
    password: userData.password,
    username: userData.username,
  });

  if (result.success) {
    // Registration successful
    setUser(result.user);
    showMessage("Registration successful! Please check your email.");
    navigate("/verify-prompt");
  } else if (result.error === "auth.service.password_requirements") {
    // Password validation failed
    setPasswordErrors(result.validationErrors);
  } else if (result.error === "auth.service.email_exists") {
    // Email already exists
    showMessage("This email is already registered. Please login instead.");
  } else {
    // Other error
    showMessage(translateError(result.error));
  }
}
```

### Password Reset

```typescript
import { authService } from "../lib/auth/auth-service";

async function handlePasswordReset(token: string, newPassword: string) {
  const result = await authService.resetUserPassword(token, newPassword);

  if (result.success) {
    // Password reset successful
    showMessage("Your password has been reset successfully.");
    navigate("/login");
  } else if (result.validationErrors) {
    // Password validation failed
    setPasswordErrors(result.validationErrors);
  } else if (result.error === "auth.api.invalid_token") {
    // Invalid or expired token
    showMessage("This password reset link has expired. Please request a new one.");
  } else {
    // Other error
    showMessage(translateError(result.error));
  }
}
```

### Token Refresh

```typescript
import { authService } from "../lib/auth/auth-service";

async function refreshSessionToken() {
  const refreshToken = getStoredRefreshToken();
  const result = await authService.refreshToken(refreshToken);

  if (result.success) {
    // Token refresh successful
    setAccessToken(result.accessToken);
    return true;
  } else {
    // Token refresh failed, user needs to login again
    clearAuth();
    navigate("/login", { state: { reason: "session_expired" } });
    return false;
  }
}
```

## Key Types

### Error Handling

The authentication system uses standardized error codes for consistent error handling:

```typescript
type AuthErrorCode =
  | "auth.service.too_many_attempts" // Rate limit exceeded
  | "auth.service.invalid_credentials" // Invalid email or password
  | "auth.service.password_requirements" // Password doesn't meet requirements
  | "auth.service.email_exists" // Email already registered
  | "auth.service.user_not_found" // User not found
  | "auth.service.current_password_incorrect" // Wrong password
  | "auth.service.password_change_error" // Error during password change
  | "auth.service.invalid_refresh_token" // Invalid refresh token
  | "auth.service.new_password_requirements" // New password requirements not met
  | "auth.api.invalid_token" // Invalid API token
  | "auth.api.general_error"; // General API error
```

### Result Types

All authentication operations return strongly-typed result objects:

```typescript
// Login result
type LoginResult = {
  success: boolean;
  user?: User; // User data without sensitive information
  tokens?: TokenPair; // Access and refresh tokens
  csrfToken?: CsrfToken; // CSRF protection token
  error?: AuthErrorCode; // Error code if login failed
  rateLimited?: boolean; // Whether the request is rate limited
  resetTime?: number; // Time until rate limit reset (milliseconds)
};

// Registration result
type RegisterResult = {
  success: boolean;
  user?: User; // User information if successful
  error?: AuthErrorCode; // Error code if registration failed
  validationErrors?: string[]; // Password validation errors
};

// Password reset result
type PasswordResetResult = {
  success: boolean;
  error?: AuthErrorCode; // Error code if reset failed
  validationErrors?: string[]; // Password validation errors
};

// Token refresh result
type TokenRefreshResult = {
  success: boolean;
  accessToken?: string; // New access token if successful
  error?: AuthErrorCode; // Error code if refresh failed
};
```

## Security Considerations

The authentication system implements several security best practices:

1. **Password Storage**: Passwords are never stored in plain text; they are hashed using bcrypt with
   proper salt rounds
2. **Rate Limiting**: Login and password reset attempts are rate-limited to prevent brute force
   attacks
3. **CSRF Protection**: All state-changing operations require a valid CSRF token
4. **JWT Security**: Short-lived JWTs with refresh token rotation
5. **Input Validation**: All user inputs are validated and sanitized
6. **Error Messages**: Generic error messages that don't leak sensitive information
7. **Password Requirements**: Strong password policies are enforced

## Best Practices

When working with the authentication system:

1. **Always check success flag** before assuming an operation succeeded
2. **Handle all error cases** with appropriate user feedback
3. **Never expose sensitive data** like password hashes
4. **Implement proper logout** by clearing tokens and state
5. **Use the refresh token flow** to maintain user sessions
6. **Apply CSRF tokens** to all state-changing operations
7. **Validate all inputs** before sending them to the authentication service

## Configuration

Authentication-related configuration is stored in environment variables:

| Variable                   | Description                             | Default    |
| -------------------------- | --------------------------------------- | ---------- |
| `AUTH_JWT_SECRET`          | Secret key for JWT signing              | (required) |
| `AUTH_JWT_EXPIRY`          | Access token expiry time                | "15m"      |
| `AUTH_REFRESH_EXPIRY`      | Refresh token expiry time               | "7d"       |
| `AUTH_RATE_LIMIT_MAX`      | Max login attempts before rate limiting | 5          |
| `AUTH_RATE_LIMIT_WINDOW`   | Rate limit window in milliseconds       | 300000     |
| `AUTH_PASSWORD_MIN_LENGTH` | Minimum password length                 | 10         |
| `AUTH_SALT_ROUNDS`         | Bcrypt salt rounds                      | 12         |

## Accessibility Considerations

The authentication UI components implement WCAG AAA standards:

1. **Error Messages**: Clear error messages with proper ARIA attributes
2. **Focus Management**: Proper focus handling for form submission and errors
3. **Keyboard Navigation**: All authentication flows are fully keyboard accessible
4. **Screen Reader Support**: All forms and components are properly labeled
5. **Color Contrast**: All UI elements meet AAA contrast requirements (7:1)

````

### POST /api/auth/refresh-token

Renews the access token using a refresh token.

**Successful Response (200):**

```json
{
  "success": true,
  "message": "Token successfully renewed"
}
````

The response also sets a new `access_token` cookie.

## Protected Routes

To protect a route, use the `protectRoute` middleware:

```typescript
import { protectRoute } from "../../lib/auth/middleware";

export const GET: APIRoute = async ({ request }) => {
  const authResult = await protectRoute(request);

  if (!authResult.authorized) {
    return new Response(
      JSON.stringify({
        success: false,
        error: authResult.error,
      }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  // Protected logic here...
};
```

For role-based access control:

```typescript
const authResult = await protectRoute(request, "admin");
```

## Security Aspects

### Password Hashing

Passwords are hashed using bcrypt, a secure and proven algorithm for password hashing. The salt
factor is set to 12, which represents a good compromise between security and performance.

### Password Validation

The password validation ensures that passwords meet the following requirements:

- Minimum length of 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character
- No commonly used passwords
- No triple repetitions of the same character
- No simple sequences

### Token Security

- JWT tokens have a limited validity period (24 hours for access tokens, 7 days for refresh tokens).
- Verification and reset tokens are UUIDs with limited validity (24 hours for verification tokens, 1
  hour for reset tokens).

### CSRF Protection

The CSRF protection uses a double token approach:

- A token in the cookie (`csrf_token`)
- The same token in the header (`x-csrf-token`)

All mutation requests (POST, PUT, DELETE) must include a valid CSRF token in the header.

### Rate Limiting

Rate limiting for login attempts limits the number of failed login attempts to 5 within 15 minutes.
After exceeding the limit, the IP address is blocked for 1 hour.

## Environment Variables

The authentication system uses the following environment variables:

- `TURSO_DATABASE_URL`: URL of the Turso database
- `TURSO_AUTH_TOKEN`: Authentication token for the Turso database
- `JWT_SECRET`: Secret key for JWT tokens
- `CSRF_SECRET`: Secret key for CSRF tokens

## Best Practices

1. **Secure Passwords**: Use password validation to ensure users choose secure passwords.
2. **Email Verification**: Enable email verification to ensure users have access to the provided
   email address.
3. **HTTPS**: Always use HTTPS for transmitting authentication data.
4. **Session Management**: Implement secure session management with short session timeouts.
5. **Logging**: Log authentication events for audit purposes.
6. **Error Handling**: Do not disclose detailed error information that could be exploited by
   attackers.
7. **Regular Updates**: Keep all dependencies up to date to avoid known security vulnerabilities.
