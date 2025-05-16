# Authentication Database Module

## Overview

The Authentication Database Module handles all database operations related to user authentication
for the MelodyMind application. It provides a robust implementation for user management, email
verification, and password handling while adhering to security best practices.

This module serves as the foundation for the authentication system in MelodyMind, ensuring secure
user registration, authentication, and account management processes.

![Authentication System Architecture](../assets/auth-architecture-diagram.png)

## Core Features

- **User Management**: Create, retrieve, and update user accounts
- **Email Verification**: Generate and validate email verification tokens
- **Password Security**: Hash passwords and verify credentials
- **Password Reset**: Securely handle forgotten password workflows
- **Type Safety**: Use branded types for enhanced type checking
- **Error Handling**: Specialized error types for different failure scenarios
- **Rate Limiting**: Prevent abuse of token generation endpoints
- **Caching**: Optimize performance for repeated operations

## Type Definitions

### Branded Types

The module uses branded types to provide stronger type safety and prevent type confusion:

```typescript
/**
 * Branded type for user IDs to prevent mixing with other string types
 */
export type UserId = string & { readonly __brand: unique symbol };

/**
 * Branded type for email addresses
 */
export type EmailAddress = string & { readonly __brand: unique symbol };

/**
 * Branded type for verification tokens
 */
export type VerificationToken = string & { readonly __brand: unique symbol };

/**
 * Branded type for password reset tokens
 */
export type ResetToken = string & { readonly __brand: unique symbol };
```

Helper functions create instances of these branded types:

```typescript
export function createUserId(id: string): UserId {
  return id as UserId;
}

export function createEmailAddress(email: string): EmailAddress {
  return email.toLowerCase() as EmailAddress;
}

export function createVerificationToken(token: string): VerificationToken {
  return token as VerificationToken;
}

export function createResetToken(token: string): ResetToken {
  return token as ResetToken;
}
```

### Core Data Structures

#### User

The core `User` interface represents a registered user in the system:

```typescript
export interface User {
  /** Unique identifier for the user */
  id: UserId;
  /** User's email address */
  email: EmailAddress;
  /** User's optional username */
  username: string | null;
  /** Whether the user's email has been verified */
  emailVerified: boolean;
  /** When the user account was created */
  createdAt: Date;
  /** When the user account was last updated */
  updatedAt: Date;
}
```

#### UserWithPassword

Extends the `User` interface to include the password hash:

```typescript
export interface UserWithPassword extends User {
  /** Hashed password */
  passwordHash: string;
}
```

#### NewUser

Used when creating a new user account:

```typescript
export interface NewUser {
  /** User's email address */
  email: string;
  /** User's plain text password (will be hashed before storage) */
  password: string;
  /** Optional username */
  username?: string;
}
```

### Result Types

The module uses result objects to provide detailed information about operation outcomes:

#### VerificationResult

```typescript
export interface VerificationResult {
  /** Whether the verification was successful */
  success: boolean;
  /** Reason for failure if unsuccessful */
  reason?: "token-invalid" | "token-expired" | "database-error";
}
```

#### ResetTokenResult

```typescript
export interface ResetTokenResult {
  /** The generated reset token, if successful */
  token: ResetToken | null;
  /** Whether the operation was successful */
  success: boolean;
  /** Reason for failure if unsuccessful */
  reason?: "user-not-found" | "rate-limited" | "database-error";
}
```

#### PasswordResetResult

```typescript
export interface PasswordResetResult {
  /** Whether the reset was successful */
  success: boolean;
  /** Reason for failure if unsuccessful */
  reason?: "token-invalid" | "token-expired" | "password-policy" | "database-error";
}
```

#### PasswordPolicyResult

```typescript
export interface PasswordPolicyResult {
  /** Whether the password meets all requirements */
  valid: boolean;
  /** List of reasons why the password is invalid */
  reasons: string[];
}
```

### Error Types

Custom error classes provide more context for error handling:

```typescript
export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

export class UserCreationError extends AuthError {
  constructor(
    message: string,
    public readonly metadata?: Record<string, unknown>
  ) {
    super(`User creation failed: ${message}`);
    this.name = "UserCreationError";
  }
}

export class AuthenticationError extends AuthError {
  constructor(message: string) {
    super(`Authentication failed: ${message}`);
    this.name = "AuthenticationError";
  }
}
```

Type guards help with error handling:

```typescript
export function isAuthError(error: unknown): error is AuthError {
  return error instanceof AuthError;
}

export function isUserCreationError(error: unknown): error is UserCreationError {
  return error instanceof UserCreationError;
}
```

## User Management Functions

### createUser

Creates a new user in the database with secure password hashing and email verification.

**Signature:**

```typescript
export async function createUser(user: NewUser): Promise<User>;
```

**Parameters:**

- `user`: The user data to create (email, password, optional username)

**Returns:**

- A Promise resolving to the created user object (without password)

**Throws:**

- `UserCreationError`: If user creation fails (e.g., duplicate email)
- `Error`: If database operation fails

**Example:**

```typescript
try {
  const newUser = await createUser({
    email: "user@example.com",
    password: "SecurePassword123",
    username: "MusicLover",
  });
  console.log(`Created user with ID: ${newUser.id}`);
} catch (error) {
  if (isUserCreationError(error)) {
    console.error(`Failed to create user: ${error.message}`);
  } else {
    console.error(`Unexpected error: ${error.message}`);
  }
}
```

### getUserByEmail

Finds a user by their email address.

**Signature:**

```typescript
export async function getUserByEmail(email: string): Promise<UserWithPassword | null>;
```

**Parameters:**

- `email`: The email address to search for (case-insensitive)

**Returns:**

- A Promise resolving to the user with password hash if found, null otherwise

**Throws:**

- `Error`: If database operation fails

**Example:**

```typescript
try {
  const user = await getUserByEmail("user@example.com");
  if (user) {
    console.log(`Found user: ${user.username || user.email}`);
  } else {
    console.log("User not found");
  }
} catch (error) {
  console.error(`Error finding user: ${error.message}`);
}
```

### getUserByUsername

Finds a user by their username.

**Signature:**

```typescript
export async function getUserByUsername(username: string): Promise<UserWithPassword | null>;
```

**Parameters:**

- `username`: The username to search for

**Returns:**

- A Promise resolving to the user with password hash if found, null otherwise

**Throws:**

- `Error`: If database operation fails

**Example:**

```typescript
try {
  const user = await getUserByUsername("MusicLover");
  if (user) {
    console.log(`Found user with email: ${user.email}`);
  } else {
    console.log("Username not found");
  }
} catch (error) {
  console.error(`Error finding user: ${error.message}`);
}
```

### userExists

A memoized function to check if a user exists by email, with caching to reduce database load.

**Signature:**

```typescript
export const userExists: (email: string) => Promise<boolean>;
```

**Parameters:**

- `email`: Email to check

**Returns:**

- A Promise resolving to whether the user exists

**Example:**

```typescript
if (await userExists("user@example.com")) {
  console.log("Email is already registered");
} else {
  console.log("Email is available");
}
```

## Authentication Functions

### verifyPassword

Verifies if the provided password matches the stored hash for a user.

**Signature:**

```typescript
export async function verifyPassword(user: UserWithPassword, password: string): Promise<boolean>;
```

**Parameters:**

- `user`: The user object containing the password hash
- `password`: The plain text password to verify

**Returns:**

- A Promise resolving to true if the password matches, false otherwise

**Example:**

```typescript
const user = await getUserByEmail("user@example.com");
if (user && (await verifyPassword(user, "InputPassword123"))) {
  console.log("Password is correct");
} else {
  console.log("Invalid credentials");
}
```

## Email Verification Functions

### generateEmailVerificationToken

Generates an email verification token for a user with rate limiting to prevent abuse.

**Signature:**

```typescript
export async function generateEmailVerificationToken(userId: UserId): Promise<VerificationToken>;
```

**Parameters:**

- `userId`: The ID of the user to generate a token for

**Returns:**

- A Promise resolving to the generated verification token

**Throws:**

- `AuthError`: If token generation is rate limited
- `Error`: If database operation fails

**Example:**

```typescript
try {
  const userId = user.id;
  const token = await generateEmailVerificationToken(userId);
  await sendVerificationEmail(user.email, token);
} catch (error) {
  if (isAuthError(error)) {
    console.error(`Auth error: ${error.message}`);
  } else {
    console.error(`Unexpected error: ${error.message}`);
  }
}
```

### verifyEmail

Verifies a user's email using a verification token.

**Signature:**

```typescript
export async function verifyEmail(token: VerificationToken): Promise<VerificationResult>;
```

**Parameters:**

- `token`: The verification token to validate

**Returns:**

- A Promise resolving to a result object with verification status

**Throws:**

- `Error`: If an unexpected database error occurs

**Example:**

```typescript
try {
  const result = await verifyEmail(token);
  if (result.success) {
    console.log("Email successfully verified!");
  } else {
    console.log(`Verification failed: ${result.reason}`);
  }
} catch (error) {
  console.error(`Error during verification: ${error.message}`);
}
```

## Password Management Functions

### generatePasswordResetToken

Generates a password reset token for a user with rate limiting.

**Signature:**

```typescript
export async function generatePasswordResetToken(email: string): Promise<ResetTokenResult>;
```

**Parameters:**

- `email`: The email address of the user requesting a password reset

**Returns:**

- A Promise resolving to a result object containing the token or error information

**Example:**

```typescript
try {
  const result = await generatePasswordResetToken("user@example.com");
  if (result.success && result.token) {
    await sendPasswordResetEmail(email, result.token);
  } else {
    console.log(`Could not generate reset token: ${result.reason}`);
  }
} catch (error) {
  console.error(`Error generating reset token: ${error.message}`);
}
```

### validatePasswordPolicy

Checks if a password meets the security requirements.

**Signature:**

```typescript
export function validatePasswordPolicy(password: string): PasswordPolicyResult;
```

**Parameters:**

- `password`: The password to validate

**Returns:**

- A result object with validation status and reasons for failure

**Example:**

```typescript
const policy = validatePasswordPolicy("password123");
if (!policy.valid) {
  console.log("Password does not meet security requirements:");
  policy.reasons.forEach((reason) => console.log(`- ${reason}`));
}
```

### resetPassword

Resets a user's password using a valid reset token.

**Signature:**

```typescript
export async function resetPassword(
  token: ResetToken,
  newPassword: string
): Promise<PasswordResetResult>;
```

**Parameters:**

- `token`: The password reset token
- `newPassword`: The new password to set

**Returns:**

- A Promise resolving to a result object with reset status

**Example:**

```typescript
try {
  const result = await resetPassword(token, "NewSecurePassword123");
  if (result.success) {
    console.log("Password successfully reset!");
  } else {
    console.log(`Password reset failed: ${result.reason}`);
  }
} catch (error) {
  console.error(`Error during password reset: ${error.message}`);
}
```

### updatePassword

Updates a user's password directly when already authenticated.

**Signature:**

```typescript
export async function updatePassword(
  userId: UserId,
  newPassword: string
): Promise<PasswordResetResult>;
```

**Parameters:**

- `userId`: The ID of the user whose password to update
- `newPassword`: The new password to set

**Returns:**

- A Promise resolving to a result object with update status

**Example:**

```typescript
try {
  const result = await updatePassword(userId, "NewSecurePassword123");
  if (result.success) {
    console.log("Password successfully updated!");
  } else {
    console.log(`Password update failed: ${result.reason}`);
  }
} catch (error) {
  console.error(`Error during password update: ${error.message}`);
}
```

## Utility Functions

### memoize

Generic memoization helper function for optimizing repetitive function calls.

**Signature:**

```typescript
function memoize<Args extends unknown[], Result>(
  fn: (...args: Args) => Promise<Result>,
  options?: MemoizeOptions
): (...args: Args) => Promise<Result>;
```

**Parameters:**

- `fn`: Function to memoize
- `options`: Optional configuration for cache size and TTL

**Returns:**

- Memoized version of the input function

## Security Considerations

### Password Hashing

Passwords are hashed using bcrypt with a secure number of salt rounds:

```typescript
const BCRYPT_SALT_ROUNDS = 12;
```

### Token Expiration

Tokens have configurable expiration times:

```typescript
const VERIFICATION_TOKEN_EXPIRES_HOURS = 24;
const RESET_TOKEN_EXPIRES_HOURS = 1;
```

### Rate Limiting

Token generation is rate-limited to prevent abuse:

```typescript
// If token was generated in the last 5 minutes, throw an error
if (lastGeneration && now - lastGeneration < 5 * 60 * 1000) {
  throw new AuthError(
    "Verification token recently generated. Please wait before requesting another token."
  );
}
```

### Password Policy

The system enforces password security requirements:

- Minimum length of 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

## Database Schema

The module interacts with the following database tables:

### Users Table

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  username TEXT UNIQUE,
  email_verified BOOLEAN DEFAULT FALSE,
  verification_token TEXT,
  verification_token_expires_at TEXT,
  reset_token TEXT,
  reset_token_expires_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

## Implementation Notes

### Caching Strategy

The module uses an in-memory cache for token operations to reduce database load and implement rate
limiting:

```typescript
const tokenOperationsCache = new Map<string, number>();
```

The cache is automatically cleaned up to prevent memory leaks:

```typescript
// Clean up old entries from cache to prevent memory leaks
const CACHE_MAX_SIZE = 1000;
if (tokenOperationsCache.size > CACHE_MAX_SIZE) {
  const oldestEntries = [...tokenOperationsCache.entries()]
    .sort((a, b) => a[1] - b[1])
    .slice(0, Math.floor(CACHE_MAX_SIZE / 2))
    .map(([key]) => key);

  oldestEntries.forEach((key) => tokenOperationsCache.delete(key));
}
```

### Error Handling

The module uses a hierarchy of error types to provide detailed context for different failure
scenarios:

- `AuthError`: Base class for all authentication errors
- `UserCreationError`: Specific to user creation failures
- `AuthenticationError`: For credential verification failures

Type guards make it easy to handle specific error types:

```typescript
if (isUserCreationError(error)) {
  // Handle user creation error
} else if (isAuthError(error)) {
  // Handle general auth error
} else {
  // Handle other errors
}
```

## Common Use Cases

### User Registration Flow

1. Check if email already exists:

   ```typescript
   const emailExists = await userExists(email);
   if (emailExists) {
     return { success: false, message: "Email already registered" };
   }
   ```

2. Create the user account:

   ```typescript
   const user = await createUser({
     email,
     password,
     username,
   });
   ```

3. Generate verification token:

   ```typescript
   const token = await generateEmailVerificationToken(user.id);
   ```

4. Send verification email (using external email service)

### Authentication Flow

1. Find user by email:

   ```typescript
   const user = await getUserByEmail(email);
   if (!user) {
     throw new AuthenticationError("Invalid email or password");
   }
   ```

2. Verify password:

   ```typescript
   const isValid = await verifyPassword(user, password);
   if (!isValid) {
     throw new AuthenticationError("Invalid email or password");
   }
   ```

3. Check email verification status if required:
   ```typescript
   if (requireVerified && !user.emailVerified) {
     throw new AuthenticationError("Email not verified");
   }
   ```

### Password Reset Flow

1. Generate reset token:

   ```typescript
   const resetResult = await generatePasswordResetToken(email);
   if (!resetResult.success || !resetResult.token) {
     console.log(`Cannot reset password: ${resetResult.reason}`);
     return;
   }
   ```

2. Send password reset email with token (using external email service)

3. Verify token and set new password:
   ```typescript
   const resetResult = await resetPassword(token, newPassword);
   if (resetResult.success) {
     console.log("Password reset successfully");
   } else {
     console.log(`Reset failed: ${resetResult.reason}`);
   }
   ```

## Accessibility Considerations

The authentication database module doesn't directly interface with the UI, but it's designed to
support accessible authentication flows:

- Detailed error messages that can be properly conveyed to screen readers
- Result objects with structured information for creating accessible notifications
- Support for validation that can be presented clearly to all users

## Related Components

- [AuthService](../components/AuthService.md) - Service that uses this database module
- [EmailVerification](../components/EmailVerification.md) - Component for email verification UI
- [CSRF Protection](../security/csrf.md) - Related security mechanism

## Change History

### Version 1.0.0 (Initial Release)

- Basic user authentication with email/password
- Email verification system
- Password reset functionality

## Future Improvements

- Add support for multi-factor authentication
- Implement account locking after failed login attempts
- Add OAuth provider integration
- Create admin functions for user management
