# Authentication System for Melody Mind

This documentation describes the implemented authentication system for Melody Mind, which is based on Astro and Turso DB.

## Overview

The authentication system provides the following features:

- User registration with email and password
- Secure password validation and storage
- Email verification
- Login with email and password
- Session management with JWT (JSON Web Tokens)
- Password reset functionality
- CSRF protection
- Rate limiting for login attempts
- Middleware for protected routes
- Role-based access control

## Architecture

The authentication system consists of several components:

1. **Database Layer**: Implemented in `src/lib/auth/db.ts`, provides basic functions for user operations.
2. **JWT Handling**: Implemented in `src/lib/auth/jwt.ts`, manages generation and validation of JWT tokens.
3. **CSRF Protection**: Implemented in `src/lib/auth/csrf.ts`, provides protection against Cross-Site Request Forgery.
4. **Rate Limiting**: Implemented in `src/lib/auth/rate-limit.ts`, protects against brute force attacks.
5. **Password Validation**: Implemented in `src/lib/auth/password-validation.ts`, ensures passwords meet security requirements.
6. **Middleware**: Implemented in `src/lib/auth/middleware.ts`, provides functions to protect routes.
7. **Auth Service**: Implemented in `src/lib/auth/auth-service.ts`, combines all authentication functions.
8. **API Endpoints**: Implemented in `src/pages/api/auth/`, provide REST interfaces for authentication operations.

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

## API Endpoints

The authentication system provides the following API endpoints:

### POST /api/auth/register

Registers a new user.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "secure_password",
  "username": "username" // optional
}
```

**Successful Response (201):**

```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "username",
    "emailVerified": false,
    "createdAt": "2025-05-05T18:00:00.000Z",
    "updatedAt": "2025-05-05T18:00:00.000Z"
  },
  "message": "Registration successful. Please check your email to confirm your email address."
}
```

### POST /api/auth/login

Logs in a user.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "secure_password"
}
```

**Successful Response (200):**

```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "username",
    "emailVerified": true,
    "createdAt": "2025-05-05T18:00:00.000Z",
    "updatedAt": "2025-05-05T18:00:00.000Z"
  },
  "csrfToken": "csrf_token"
}
```

The response also sets the following cookies:

- `access_token`: JWT token for authentication (HttpOnly)
- `refresh_token`: Token to renew the access token (HttpOnly)
- `csrf_token`: Token to protect against CSRF attacks

### POST /api/auth/logout

Logs out a user.

**Successful Response (200):**

```json
{
  "success": true,
  "message": "Successfully logged out"
}
```

The response also deletes the authentication cookies.

### POST /api/auth/reset-password

Requests a password reset.

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Successful Response (200):**

```json
{
  "success": true,
  "message": "If an account with this email exists, an email with instructions to reset your password has been sent."
}
```

### PUT /api/auth/reset-password

Resets the password using a reset token.

**Request Body:**

```json
{
  "token": "reset_token",
  "newPassword": "new_secure_password"
}
```

**Successful Response (200):**

```json
{
  "success": true,
  "message": "Password successfully reset. You can now log in with your new password."
}
```

### GET /api/auth/verify-email

Verifies a user's email address.

**Query Parameters:**

- `token`: Verification token

**Successful Response (200):**

```json
{
  "success": true,
  "message": "Email address successfully verified. You can now log in."
}
```

### POST /api/auth/refresh-token

Renews the access token using a refresh token.

**Successful Response (200):**

```json
{
  "success": true,
  "message": "Token successfully renewed"
}
```

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
      },
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

Passwords are hashed using bcrypt, a secure and proven algorithm for password hashing. The salt factor is set to 12, which represents a good compromise between security and performance.

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
- Verification and reset tokens are UUIDs with limited validity (24 hours for verification tokens, 1 hour for reset tokens).

### CSRF Protection

The CSRF protection uses a double token approach:

- A token in the cookie (`csrf_token`)
- The same token in the header (`x-csrf-token`)

All mutation requests (POST, PUT, DELETE) must include a valid CSRF token in the header.

### Rate Limiting

Rate limiting for login attempts limits the number of failed login attempts to 5 within 15 minutes. After exceeding the limit, the IP address is blocked for 1 hour.

## Environment Variables

The authentication system uses the following environment variables:

- `TURSO_DATABASE_URL`: URL of the Turso database
- `TURSO_AUTH_TOKEN`: Authentication token for the Turso database
- `JWT_SECRET`: Secret key for JWT tokens
- `CSRF_SECRET`: Secret key for CSRF tokens

## Best Practices

1. **Secure Passwords**: Use password validation to ensure users choose secure passwords.
2. **Email Verification**: Enable email verification to ensure users have access to the provided email address.
3. **HTTPS**: Always use HTTPS for transmitting authentication data.
4. **Session Management**: Implement secure session management with short session timeouts.
5. **Logging**: Log authentication events for audit purposes.
6. **Error Handling**: Do not disclose detailed error information that could be exploited by attackers.
7. **Regular Updates**: Keep all dependencies up to date to avoid known security vulnerabilities.
