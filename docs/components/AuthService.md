# Authentication Service

## Overview

The Authentication Service provides a comprehensive solution for user authentication within the
MelodyMind application. It manages user registration, login, password management, email
verification, and token-based authentication.

![Authentication Flow Diagram](../public/docs/auth-flow.png)

## Core Features

- User registration with password validation
- Secure login with rate limiting protection
- Email verification flow
- Password reset and change capabilities
- JWT-based authentication with refresh tokens
- CSRF protection
- Cache optimization for improved performance

## Type Definitions

### Authentication Error Codes

The service uses standardized error codes for consistent error handling and i18n support:

```typescript
type AuthErrorCode =
  | "auth.service.too_many_attempts"
  | "auth.service.invalid_credentials"
  | "auth.service.password_requirements"
  | "auth.service.email_exists"
  | "auth.service.user_not_found"
  | "auth.service.current_password_incorrect"
  | "auth.service.password_change_error"
  | "auth.service.invalid_refresh_token"
  | "auth.service.new_password_requirements"
  | "auth.api.invalid_token"
  | "auth.api.general_error";
```

### Result Types

The service uses structured result types for all operations:

```typescript
// Login operation result
export type LoginResult = {
  success: boolean;
  user?: Omit<User, "passwordHash">; // User data without sensitive information
  tokens?: TokenPair; // Access and refresh tokens
  csrfToken?: CsrfToken; // CSRF protection token
  error?: AuthErrorCode; // Error code if login failed
  rateLimited?: boolean; // Whether the request is rate limited
  resetTime?: number; // Time until rate limit resets (ms)
};

// Registration operation result
export type RegisterResult = {
  success: boolean;
  user?: User;
  error?: AuthErrorCode;
  validationErrors?: string[]; // Specific validation error messages
};

// Password reset operation result
export type PasswordResetResult = {
  success: boolean;
  error?: AuthErrorCode | string; // Error code or message
  validationErrors?: string[]; // Password validation errors
};

// Token refresh operation result
export type TokenRefreshResult = {
  success: boolean;
  accessToken?: string; // New access token
  error?: AuthErrorCode; // Error code if refresh failed
};
```

### Custom Error Type

A specialized error class for authentication-related errors:

```typescript
export class AuthError extends Error {
  constructor(
    message: string,
    public readonly code: AuthErrorCode
  ) {
    super(message);
    this.name = "AuthError";
    // Ensures proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, AuthError.prototype);
  }
}
```

## Usage

### User Registration

```typescript
import { authService } from "../lib/auth/auth-service.js";

// Register a new user
try {
  const result = await authService.register({
    email: "user@example.com",
    password: "SecureP@ssw0rd",
    username: "newuser",
  });

  if (result.success) {
    // Registration successful
    console.log("User created:", result.user);
    // Redirect to verification prompt or login
  } else {
    // Registration failed
    if (result.error === "auth.service.email_exists") {
      // Handle existing email error
    } else if (result.error === "auth.service.password_requirements") {
      // Display password requirements
      console.error("Password validation errors:", result.validationErrors);
    }
  }
} catch (error) {
  console.error("Registration failed:", error);
}
```

### User Login

```typescript
import { authService } from "../lib/auth/auth-service.js";

// Login a user
async function loginUser(email: string, password: string, ip: string) {
  const result = await authService.login(email, password, ip);

  if (result.success) {
    // Login successful
    const { user, tokens, csrfToken } = result;

    // Store tokens securely
    localStorage.setItem("accessToken", tokens.accessToken);

    // Use HTTP-only cookie for refresh token (server-side)
    // Handled in API route

    // Store CSRF token for secure requests
    localStorage.setItem("csrfToken", csrfToken.token);

    return { success: true, user };
  } else {
    // Login failed
    if (result.rateLimited) {
      return {
        success: false,
        message: "Too many attempts, please try again later",
        resetTime: result.resetTime,
      };
    }

    return {
      success: false,
      message: "Invalid email or password",
    };
  }
}
```

### Password Reset

```typescript
import { authService } from "../lib/auth/auth-service.js";

// Step 1: Request password reset email
async function requestPasswordReset(email: string) {
  const success = await authService.requestPasswordReset(email);
  return success;
}

// Step 2: Reset password with token from email
async function resetPassword(token: string, newPassword: string) {
  const result = await authService.resetUserPassword(token, newPassword);

  if (result.success) {
    return { success: true };
  } else {
    if (result.error === "auth.service.new_password_requirements") {
      return {
        success: false,
        message: "Password does not meet requirements",
        validationErrors: result.validationErrors,
      };
    } else if (result.error === "auth.api.invalid_token") {
      return {
        success: false,
        message: "Invalid or expired reset token",
      };
    }

    return { success: false, message: "An error occurred" };
  }
}
```

### Token Refresh

```typescript
import { authService } from "../lib/auth/auth-service.js";

// Refresh an expired access token
async function refreshAuthToken(refreshToken: string) {
  const result = await authService.refreshToken(refreshToken);

  if (result.success && result.accessToken) {
    // Update stored access token
    localStorage.setItem("accessToken", result.accessToken);
    return true;
  } else {
    // Token refresh failed, user needs to log in again
    // Clear stored tokens
    localStorage.removeItem("accessToken");
    // Clear refresh token cookie (server-side)

    return false;
  }
}
```

## Accessibility Considerations

While authentication services don't directly render UI elements, they support accessible
authentication flows:

- Error messages use clear, concise language suitable for screen readers
- Rate limiting includes specific time information for users
- Password requirements are available as specific validation messages
- Token-based authentication reduces session timeouts during active use
- Error codes support internationalization for multilingual accessibility

## Security Considerations

The authentication service implements multiple security best practices:

- Password hashing using bcrypt
- Rate limiting to prevent brute force attacks
- CSRF protection for authenticated requests
- JWT tokens with short expiration times
- Refresh token rotation
- Secure password reset mechanisms
- Memoization with proper cache invalidation

## Internationalization

All error messages use translation keys instead of hardcoded strings, supporting multiple languages:

```typescript
// Example of translated error messages
const errorMessages = {
  en: {
    "auth.service.invalid_credentials": "Invalid email or password",
    "auth.service.too_many_attempts": "Too many login attempts, please try again later",
    // Other translations
  },
  de: {
    "auth.service.invalid_credentials": "Ungültige E-Mail oder Passwort",
    "auth.service.too_many_attempts":
      "Zu viele Anmeldeversuche, bitte versuchen Sie es später erneut",
    // Other translations
  },
  // Other languages
};
```

## Related Components

- [EmailVerification Component](./EmailVerification.md) - Handles email verification UI
- [PasswordResetForm Component](../accessibility/PasswordResetForm-Accessibility-Review-20250516.md) -
  Password reset UI component

## Changelog

- **v3.0.0** - Added branded types for user IDs, improved JSDoc documentation, added cache
  optimization
- **v2.5.0** - Added CSRF protection, improved error handling with custom AuthError class
- **v2.0.0** - Implemented refresh token mechanism, added rate limiting protection
- **v1.0.0** - Initial implementation with basic authentication functionality
