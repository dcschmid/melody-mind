# Email Verification API Endpoint

## Overview

The email verification API endpoint handles the verification of user email addresses during the
MelodyMind registration process. This endpoint validates verification tokens sent via email
confirmation links and updates user account status accordingly.

## Endpoint Details

### Verify Email Address

**URL**: `/{lang}/api/auth/verify-email`  
**Method**: `POST`  
**Version**: `2.0+`  
**Authentication**: Not required (uses verification token)

### Request Format

#### Headers

```http
Content-Type: application/json
Accept: application/json
User-Agent: MelodyMind-Client/3.1.0
```

#### Request Body

```typescript
interface VerifyEmailRequest {
  /**
   * JWT verification token from email confirmation link
   * @format URL-safe string (a-zA-Z0-9\-_)
   * @length 100-200 characters
   * @example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
   */
  token: string;
}
```

#### Example Request

```bash
curl -X POST https://melodymind.com/de/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
  }'
```

### Response Format

#### Success Response: `200 OK`

```typescript
interface VerifyEmailSuccessResponse {
  /** Indicates successful verification */
  success: true;
  /** Human-readable success message */
  message: string;
  /** User account information */
  user: {
    /** User's unique identifier */
    id: string;
    /** Verified email address */
    email: string;
    /** User's display name */
    username: string;
    /** Account verification status */
    emailVerified: true;
    /** Account creation timestamp */
    createdAt: string;
  };
  /** Verification metadata */
  verification: {
    /** Verification completion timestamp */
    verifiedAt: string;
    /** Token expiration timestamp */
    expiresAt: string;
  };
}
```

#### Example Success Response

```json
{
  "success": true,
  "message": "Email address successfully verified",
  "user": {
    "id": "usr_1234567890",
    "email": "user@example.com",
    "username": "musiclover",
    "emailVerified": true,
    "createdAt": "2025-05-31T10:30:00Z"
  },
  "verification": {
    "verifiedAt": "2025-05-31T10:35:00Z",
    "expiresAt": "2025-05-31T11:30:00Z"
  }
}
```

#### Error Response: `400 Bad Request`

```typescript
interface VerifyEmailErrorResponse {
  /** Indicates verification failure */
  success: false;
  /** Error code for programmatic handling */
  error: "INVALID_TOKEN" | "EXPIRED_TOKEN" | "ALREADY_VERIFIED" | "USER_NOT_FOUND";
  /** Human-readable error message */
  message: string;
  /** Additional error details */
  details?: {
    /** Token expiration timestamp (for expired tokens) */
    expiredAt?: string;
    /** Verification completion timestamp (for already verified) */
    verifiedAt?: string;
  };
}
```

#### Example Error Responses

**Invalid Token:**

```json
{
  "success": false,
  "error": "INVALID_TOKEN",
  "message": "The verification token is invalid or malformed"
}
```

**Expired Token:**

```json
{
  "success": false,
  "error": "EXPIRED_TOKEN",
  "message": "The verification token has expired",
  "details": {
    "expiredAt": "2025-05-31T09:30:00Z"
  }
}
```

**Already Verified:**

```json
{
  "success": false,
  "error": "ALREADY_VERIFIED",
  "message": "This email address has already been verified",
  "details": {
    "verifiedAt": "2025-05-30T15:20:00Z"
  }
}
```

## HTTP Status Codes

| Status Code                 | Description                 | Response Type    |
| --------------------------- | --------------------------- | ---------------- |
| `200 OK`                    | Email successfully verified | Success Response |
| `400 Bad Request`           | Invalid or expired token    | Error Response   |
| `404 Not Found`             | User or token not found     | Error Response   |
| `409 Conflict`              | Email already verified      | Error Response   |
| `429 Too Many Requests`     | Rate limit exceeded         | Error Response   |
| `500 Internal Server Error` | Server processing error     | Error Response   |

## Rate Limiting

- **Limit**: 10 requests per IP address per minute
- **Window**: 60 seconds rolling window
- **Headers**:
  - `X-RateLimit-Limit`: Maximum requests per window
  - `X-RateLimit-Remaining`: Remaining requests in current window
  - `X-RateLimit-Reset`: Window reset timestamp

### Rate Limit Response: `429 Too Many Requests`

```json
{
  "success": false,
  "error": "RATE_LIMIT_EXCEEDED",
  "message": "Too many verification attempts. Please try again later.",
  "details": {
    "retryAfter": 300,
    "limit": 10,
    "window": 60
  }
}
```

## Security Considerations

### Token Security

- **JWT-based tokens** with cryptographic signatures
- **Expiration time**: 1 hour from email generation
- **One-time use**: Tokens are invalidated after successful verification
- **Secure generation**: Uses cryptographically secure random values

### Protection Measures

- **Rate limiting** prevents brute force attacks
- **Input validation** prevents injection attacks
- **CORS protection** restricts cross-origin requests
- **HTTPS only** ensures secure token transmission
- **IP tracking** for abuse detection and prevention

### Token Format Validation

```typescript
// Token validation regex
const TOKEN_PATTERN = /^[a-zA-Z0-9\-_.]+$/;
const MIN_TOKEN_LENGTH = 50;
const MAX_TOKEN_LENGTH = 500;

// Validation function
function validateToken(token: string): boolean {
  return (
    TOKEN_PATTERN.test(token) &&
    token.length >= MIN_TOKEN_LENGTH &&
    token.length <= MAX_TOKEN_LENGTH
  );
}
```

## Database Operations

### User Account Updates

When verification succeeds, the following database operations occur:

```sql
-- Update user verification status
UPDATE users
SET email_verified = true,
    email_verified_at = NOW(),
    updated_at = NOW()
WHERE id = ?;

-- Invalidate verification token
UPDATE email_verification_tokens
SET used_at = NOW(),
    status = 'used'
WHERE token = ? AND user_id = ?;

-- Log verification event
INSERT INTO audit_logs (user_id, action, details, created_at)
VALUES (?, 'email_verified', ?, NOW());
```

## Client Integration

### Frontend Usage

```typescript
// EmailVerification component usage
async function verifyEmailToken(token: string): Promise<void> {
  try {
    const response = await fetch(`/${lang}/api/auth/verify-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ token }),
      signal: AbortSignal.timeout(30000), // 30 second timeout
    });

    const result = await response.json();

    if (response.ok && result.success) {
      showState("success");
    } else {
      showState("error");
      console.error("Verification failed:", result.message);
    }
  } catch (error) {
    showState("error");
    console.error("Network error:", error);
  }
}
```

### Error Handling Best Practices

```typescript
// Comprehensive error handling
function handleVerificationError(error: VerifyEmailErrorResponse): void {
  switch (error.error) {
    case "INVALID_TOKEN":
      // Redirect to registration page
      window.location.href = `/${lang}/auth/register`;
      break;

    case "EXPIRED_TOKEN":
      // Show resend verification option
      showResendVerificationDialog();
      break;

    case "ALREADY_VERIFIED":
      // Redirect to login page
      window.location.href = `/${lang}/auth/login?verified=true`;
      break;

    case "USER_NOT_FOUND":
      // Redirect to registration page
      window.location.href = `/${lang}/auth/register`;
      break;

    default:
      // Show generic error message
      showGenericErrorMessage();
  }
}
```

## Monitoring and Analytics

### Success Metrics

- **Verification rate**: Percentage of sent tokens that are successfully verified
- **Time to verification**: Average time between email send and verification
- **User conversion**: Percentage of verified users who complete registration

### Error Tracking

- **Token expiration rate**: Percentage of tokens that expire before use
- **Invalid token attempts**: Number of invalid token submission attempts
- **Rate limit hits**: Frequency of rate limit violations

### Performance Metrics

- **Response time**: Average API response time (target: <200ms)
- **Error rate**: Percentage of requests resulting in 5xx errors (target: <0.1%)
- **Availability**: API uptime percentage (target: 99.9%)

## Testing Guidelines

### Unit Tests

```typescript
describe("Email Verification API", () => {
  it("should verify valid token successfully", async () => {
    const response = await verifyEmail(validToken);
    expect(response.success).toBe(true);
    expect(response.user.emailVerified).toBe(true);
  });

  it("should reject expired token", async () => {
    const response = await verifyEmail(expiredToken);
    expect(response.success).toBe(false);
    expect(response.error).toBe("EXPIRED_TOKEN");
  });

  it("should handle already verified user", async () => {
    const response = await verifyEmail(usedToken);
    expect(response.success).toBe(false);
    expect(response.error).toBe("ALREADY_VERIFIED");
  });
});
```

### Integration Tests

```typescript
describe("Email Verification Flow", () => {
  it("should complete full verification flow", async () => {
    // 1. Register user
    const registerResponse = await registerUser(userData);

    // 2. Extract token from email
    const token = extractTokenFromEmail();

    // 3. Verify email
    const verifyResponse = await verifyEmail(token);

    // 4. Confirm user status
    expect(verifyResponse.success).toBe(true);
    expect(verifyResponse.user.emailVerified).toBe(true);
  });
});
```

## API Versioning

### Version 2.0 (Current)

- JWT-based tokens with enhanced security
- Comprehensive error responses with details
- Rate limiting and abuse protection
- WCAG AAA compliant error messages

### Migration from Version 1.x

```typescript
// Old format (v1.x)
const legacyResponse = {
  verified: true,
  message: "Success",
};

// New format (v2.0+)
const modernResponse = {
  success: true,
  message: "Email address successfully verified",
  user: {
    /* user details */
  },
  verification: {
    /* verification metadata */
  },
};
```

## Related Documentation

- [EmailVerification Component](../components/EmailVerification.md) - Frontend component
  documentation
- [Authentication API Overview](./auth-overview.md) - Complete authentication system
- [User Registration API](./auth-registration.md) - User registration endpoint
- [Rate Limiting Configuration](../security/rate-limiting.md) - Rate limiting setup

## Changelog

### Version 2.1.0 (Current)

- Enhanced error response format with detailed information
- Improved rate limiting with configurable windows
- Added audit logging for security compliance
- Better token validation and security measures

### Version 2.0.0

- Complete API redesign with TypeScript interfaces
- JWT-based token system for enhanced security
- Comprehensive error handling and user feedback
- WCAG AAA compliant error messages

### Version 1.5.0

- Added basic rate limiting protection
- Improved database transaction handling
- Enhanced logging and monitoring capabilities
