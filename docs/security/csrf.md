# CSRF Protection Module

## Overview

The Cross-Site Request Forgery (CSRF) protection module provides security mechanisms to prevent CSRF
attacks in the MelodyMind application. This module generates secure tokens, validates them, and
provides middleware for protecting API routes.

![CSRF Protection Flow Diagram](../../public/docs/csrf-flow.png)

## Core Concepts

CSRF protection works by ensuring that requests modifying server-side data contain a secret token
that only legitimate users can obtain. The MelodyMind implementation follows these principles:

- **Token Generation**: Creates cryptographically secure tokens with built-in expiration
- **Constant-Time Comparison**: Prevents timing attacks during token verification
- **Double-Submit Pattern**: Tokens sent both in cookies and request headers
- **Type Safety**: Uses TypeScript branded types for compile-time safety

## Type Definitions

```typescript
/**
 * Format pattern for token structure
 */
type TokenFormat = `${string}:${string}:${string}`;

/**
 * Branded type for secure CSRF tokens to prevent accidental mixing with regular strings
 * @category Security
 */
export type SecureCsrfToken = TokenFormat & { readonly __brand: unique symbol };

/**
 * Interface for CSRF token structure with improved type safety
 * @category Security
 */
export interface CsrfToken {
  /** The full CSRF token string with branded type for additional type safety */
  token: SecureCsrfToken;
  /** Expiration timestamp in milliseconds since epoch */
  expires: number;
}
```

## API Reference

### generateCsrfToken

Generates a new secure CSRF token.

```typescript
function generateCsrfToken(): CsrfToken;
```

**Returns**: A `CsrfToken` object containing:

- `token`: The secure token string (branded type)
- `expires`: Expiration timestamp in milliseconds

**Implementation Details**:

- Generates random bytes using Node.js crypto module
- Creates an HMAC signature using SHA-256
- Sets expiration 24 hours in the future
- Formats token as `randomBytes:expiration:signature`

**Example**:

```typescript
import { generateCsrfToken } from "../lib/auth/csrf";

// Generate a new CSRF token to include in a form
const { token, expires } = generateCsrfToken();

// Output to form field
document.getElementById("csrfToken").value = token;
```

### verifyCsrfToken

Verifies if a CSRF token is valid and not expired.

```typescript
function verifyCsrfToken(token: string | SecureCsrfToken): boolean;
```

**Parameters**:

- `token`: The CSRF token to verify

**Returns**: Boolean indicating token validity

**Implementation Details**:

- Validates token format (three colon-separated parts)
- Checks for token expiration
- Recalculates HMAC signature for comparison
- Uses constant-time comparison to prevent timing attacks

**Example**:

```typescript
import { verifyCsrfToken } from "../lib/auth/csrf";

// Verify a token from a request header
const csrfToken = request.headers.get("x-csrf-token");
const isValid = verifyCsrfToken(csrfToken);

if (!isValid) {
  return new Response("CSRF token validation failed", { status: 403 });
}
```

### createCsrfCookie

Creates a CSRF token and prepares it for cookie storage.

```typescript
function createCsrfCookie(): CsrfToken;
```

**Returns**: The generated CSRF token and expiration

**Implementation Notes**:

- In production, this function should set an actual HTTP cookie
- Since Astro runs server-side, cookie setting should happen in API endpoints

**Example**:

```typescript
import { createCsrfCookie } from "../lib/auth/csrf";

// In an API route handler:
export async function POST({ request, cookies }) {
  const { token, expires } = createCsrfCookie();

  // Set the cookie with secure options
  cookies.set("csrf", token, {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: true,
    expires: new Date(expires),
  });

  // Return the token to be included in forms/requests
  return new Response(JSON.stringify({ csrfToken: token }));
}
```

### csrfProtection

Middleware function that verifies CSRF protection for incoming requests.

```typescript
function csrfProtection(request: Request): boolean;
```

**Parameters**:

- `request`: The incoming request object

**Returns**: Boolean indicating if the request passes CSRF validation

**Implementation Details**:

- Extracts the CSRF token from the `x-csrf-token` header
- Returns false if the token is missing or invalid
- Leverages `verifyCsrfToken` for token validation

**Example**:

```typescript
import { csrfProtection } from "../lib/auth/csrf";

// In an API endpoint:
export async function POST({ request }) {
  if (!csrfProtection(request)) {
    return new Response("CSRF validation failed", { status: 403 });
  }

  // Process the request
  return new Response("Success", { status: 200 });
}
```

## Integration Guide

### Protecting Forms

To protect forms in your Astro application:

1. Generate and include a CSRF token in your form:

```astro
---
import { generateCsrfToken } from "../lib/auth/csrf";
const { token } = generateCsrfToken();
---

<form method="POST" action="/api/submit-form">
  <input type="hidden" name="csrf" value={token} />
  <!-- Form fields -->
  <button type="submit">Submit</button>
</form>
```

2. Create a server-side endpoint to process the form that verifies the token:

```typescript
// Route: /src/pages/api/submit-form.ts
import { verifyCsrfToken } from "../../lib/auth/csrf";

export async function POST({ request }) {
  const formData = await request.formData();
  const csrfToken = formData.get("csrf");

  if (!csrfToken || !verifyCsrfToken(csrfToken.toString())) {
    return new Response("CSRF validation failed", { status: 403 });
  }

  // Process the form data
  return new Response("Form submitted successfully", { status: 200 });
}
```

### Protecting API Routes

For API routes that modify data:

1. Create an API route with CSRF protection middleware:

```typescript
// Route: /src/pages/api/update-profile.ts
import { csrfProtection } from "../../lib/auth/csrf";

export async function PUT({ request }) {
  // Check CSRF protection
  if (!csrfProtection(request)) {
    return new Response("CSRF validation failed", { status: 403 });
  }

  // Process the request
  const data = await request.json();
  // Update profile logic

  return new Response(JSON.stringify({ success: true }));
}
```

2. On the client side, include the CSRF token in your API requests:

```typescript
// Frontend code
async function updateProfile(data) {
  const csrfToken = document.getElementById("csrfToken").value;

  const response = await fetch("/api/update-profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-csrf-token": csrfToken,
    },
    body: JSON.stringify(data),
  });

  return response.json();
}
```

## Testing CSRF Protection

We recommend testing CSRF protection as part of your security testing suite:

```typescript
import { generateCsrfToken, verifyCsrfToken } from "../lib/auth/csrf";

describe("CSRF Protection", () => {
  test("Should reject expired tokens", async () => {
    // Create a token and manually change its expiration
    const { token } = generateCsrfToken();
    const parts = token.split(":");
    const expiredToken = `${parts[0]}:${Date.now() - 1000}:${parts[2]}`;

    expect(verifyCsrfToken(expiredToken)).toBe(false);
  });

  test("Should reject tampered tokens", async () => {
    const { token } = generateCsrfToken();
    const tamperedToken = token.replace("a", "b");

    expect(verifyCsrfToken(tamperedToken)).toBe(false);
  });

  test("Should accept valid tokens", async () => {
    const { token } = generateCsrfToken();

    expect(verifyCsrfToken(token)).toBe(true);
  });
});
```

## Security Considerations

### Token Storage

- **Server-Side Rendering**: For Astro SSR applications, store the token in encrypted, HTTP-only
  cookies
- **Client-Side**: Store only in hidden form fields or memory (session storage if necessary)
- **Never**: Store in localStorage due to XSS vulnerability

### Implementation Guidelines

1. **Always use HTTPS**: CSRF protection is ineffective if tokens can be intercepted
2. **Set proper cookie attributes**:
   - `HttpOnly`: Prevents JavaScript access
   - `Secure`: Only sent over HTTPS
   - `SameSite=Strict`: Prevents cross-site usage
3. **Verify token on all state-changing operations**:
   - POST, PUT, DELETE, PATCH requests
   - Form submissions
   - Account management operations

## Accessibility Impact

CSRF protection has minimal direct impact on accessibility, but developers should ensure:

- Error messages for CSRF failures are clear and descriptive
- Forms remain usable even with CSRF protection
- Timeout handling for long form sessions is user-friendly

## Related Components

- [Authentication Service](../components/AuthService.md) - Works alongside CSRF protection
- [Session Management](../security/sessions.md) - Handles user sessions securely

## Changelog

- v1.0.0 (2025-05-01): Initial implementation of CSRF protection module
- v1.1.0 (Planned): Add automatic token renewal for long form sessions
