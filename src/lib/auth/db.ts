/**
 * Authentication Database Module
 *
 * This module handles all database operations related to user authentication for the MelodyMind application.
 * It includes functions for user creation, verification, password management, and token generation.
 *
 * The module uses bcrypt for secure password hashing and UUID for generating unique tokens.
 * All database operations are performed using the Turso database client.
 *
 * @since 1.0.0
 * @category Authentication
 */
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

import { turso } from "../../turso.js";

/**
 * Branded type for user IDs to prevent mixing with other string types
 * @category Types
 */
export type UserId = string & { readonly __brand: unique symbol };

/**
 * Branded type for email addresses
 * @category Types
 */
export type EmailAddress = string & { readonly __brand: unique symbol };

/**
 * Branded type for verification tokens
 * @category Types
 */
export type VerificationToken = string & { readonly __brand: unique symbol };

/**
 * Branded type for password reset tokens
 * @category Types
 */
export type ResetToken = string & { readonly __brand: unique symbol };

/**
 * Creates a branded UserId from a string
 *
 * @param {string} id - Raw string ID
 * @returns {UserId} Branded user ID
 */
export function createUserId(id: string): UserId {
  return id as UserId;
}

/**
 * Creates a branded EmailAddress from a string
 *
 * @param {string} email - Raw string email
 * @returns {EmailAddress} Branded email address
 */
export function createEmailAddress(email: string): EmailAddress {
  return email.toLowerCase() as EmailAddress;
}

/**
 * Creates a branded VerificationToken from a string
 *
 * @param {string} token - Raw string token
 * @returns {VerificationToken} Branded verification token
 */
export function createVerificationToken(token: string): VerificationToken {
  return token as VerificationToken;
}

/**
 * Creates a branded ResetToken from a string
 *
 * @param {string} token - Raw string token
 * @returns {ResetToken} Branded reset token
 */
export function createResetToken(token: string): ResetToken {
  return token as ResetToken;
}

/**
 * Represents a user in the system
 *
 * @category Types
 * @since 1.0.0
 */
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

/**
 * Extends the User type to include password hash
 *
 * @category Types
 * @since 1.0.0
 */
export interface UserWithPassword extends User {
  /** Hashed password */
  passwordHash: string;
}

/**
 * Data structure for creating a new user
 *
 * @category Types
 * @since 1.0.0
 */
export interface NewUser {
  /** User's email address */
  email: string;
  /** User's plain text password (will be hashed before storage) */
  password: string;
  /** Optional username */
  username?: string;
}

/**
 * Custom error for authentication operations
 *
 * @category Errors
 * @since 1.0.0
 */
export class AuthError extends Error {
  /**
   * Create a new authentication error
   *
   * @param {string} message - Error message
   */
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

/**
 * Error thrown when user creation fails
 *
 * @category Errors
 * @since 1.0.0
 */
export class UserCreationError extends AuthError {
  /**
   * Create a new user creation error
   *
   * @param {string} message - Error message
   * @param {Object} [metadata] - Additional error metadata
   */
  constructor(
    message: string,
    public readonly metadata?: Record<string, unknown>
  ) {
    super(`User creation failed: ${message}`);
    this.name = "UserCreationError";
  }
}

/**
 * Error thrown when user authentication fails
 *
 * @category Errors
 * @since 1.0.0
 */
export class AuthenticationError extends AuthError {
  /**
   * Create a new authentication error
   *
   * @param {string} message - Error message
   */
  constructor(message: string) {
    super(`Authentication failed: ${message}`);
    this.name = "AuthenticationError";
  }
}

/**
 * Type guard for AuthError
 *
 * @param {unknown} error - Error to check
 * @returns {boolean} Whether the error is an AuthError
 */
export function isAuthError(error: unknown): error is AuthError {
  return error instanceof AuthError;
}

/**
 * Type guard for UserCreationError
 *
 * @param {unknown} error - Error to check
 * @returns {boolean} Whether the error is a UserCreationError
 */
export function isUserCreationError(error: unknown): error is UserCreationError {
  return error instanceof UserCreationError;
}

// Security configuration constants
const BCRYPT_SALT_ROUNDS = 12;
const VERIFICATION_TOKEN_EXPIRES_HOURS = 24;
const RESET_TOKEN_EXPIRES_HOURS = 1;

/**
 * Creates a new user in the database
 *
 * This function:
 * 1. Generates a unique ID for the user
 * 2. Hashes the password using bcrypt
 * 3. Creates a verification token for email confirmation
 * 4. Inserts the user record into the database
 *
 * @category User Management
 * @since 1.0.0
 *
 * @param {NewUser} user - The user data to create
 * @returns {Promise<User>} The created user object (without password)
 *
 * @throws {UserCreationError} If the user creation fails
 * @throws {Error} If database operation fails
 *
 * @example
 * try {
 *   const newUser = await createUser({
 *     email: "user@example.com",
 *     password: "SecurePassword123",
 *     username: "MusicLover"
 *   });
 *   console.log(`Created user with ID: ${newUser.id}`);
 * } catch (error) {
 *   if (isUserCreationError(error)) {
 *     console.error(`Failed to create user: ${error.message}`);
 *   } else {
 *     console.error(`Unexpected error: ${error.message}`);
 *   }
 * }
 */
export async function createUser(user: NewUser): Promise<User> {
  const id = createUserId(uuidv4());
  const passwordHash = await bcrypt.hash(user.password, BCRYPT_SALT_ROUNDS);
  const verificationToken = createVerificationToken(uuidv4());
  const now = new Date();
  const verificationExpires = new Date(
    now.getTime() + VERIFICATION_TOKEN_EXPIRES_HOURS * 60 * 60 * 1000
  );

  const query = `
    INSERT INTO users (
      id, 
      email, 
      password_hash, 
      username, 
      verification_token, 
      verification_token_expires_at,
      created_at,
      updated_at
    ) 
    VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    RETURNING id, email, username, email_verified, created_at, updated_at
  `;

  try {
    const result = await turso.execute({
      sql: query,
      args: [
        id,
        user.email.toLowerCase(),
        passwordHash,
        user.username || null,
        verificationToken,
        verificationExpires.toISOString(),
      ],
    });

    if (!result.rows || result.rows.length === 0) {
      throw new UserCreationError("Database operation did not return expected data");
    }

    const row = result.rows[0];

    return {
      id: createUserId(row.id as string),
      email: createEmailAddress(row.email as string),
      username: row.username as string | null,
      emailVerified: Boolean(row.email_verified),
      createdAt: new Date(row.created_at as string),
      updatedAt: new Date(row.updated_at as string),
    };
  } catch (error) {
    if (error instanceof UserCreationError) {
      throw error;
    }

    // Handle specific database errors
    if (error instanceof Error) {
      // Check for unique constraint violations (e.g., email already exists)
      if (error.message.includes("UNIQUE constraint failed")) {
        throw new UserCreationError("A user with this email already exists", {
          field: "email",
          originalError: error.message,
        });
      }

      throw new UserCreationError(error.message, { originalError: error });
    }

    throw new UserCreationError("Unknown error during user creation");
  }
}

/**
 * Finds a user by their email address
 *
 * @category User Lookup
 * @since 1.0.0
 *
 * @param {string} email - The email address to search for (case-insensitive)
 * @returns {Promise<UserWithPassword|null>} The user with password hash if found, null otherwise
 *
 * @throws {Error} If database operation fails
 *
 * @example
 * try {
 *   const user = await getUserByEmail("user@example.com");
 *   if (user) {
 *     console.log(`Found user: ${user.username || user.email}`);
 *   } else {
 *     console.log("User not found");
 *   }
 * } catch (error) {
 *   console.error(`Error finding user: ${error.message}`);
 * }
 */
export async function getUserByEmail(email: string): Promise<UserWithPassword | null> {
  const query = `
    SELECT 
      id, 
      email, 
      password_hash, 
      username, 
      email_verified, 
      created_at, 
      updated_at 
    FROM users 
    WHERE email = ?
  `;

  try {
    const result = await turso.execute({
      sql: query,
      args: [email.toLowerCase()],
    });

    if (!result.rows || result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];

    // Ensure password_hash is not null or undefined
    if (!row.password_hash) {
      console.error("getUserByEmail: password_hash is null or undefined for user:", row.email);
      throw new Error("User data is corrupted - missing password hash");
    }

    return {
      id: createUserId(row.id as string),
      email: createEmailAddress(row.email as string),
      passwordHash: row.password_hash as string,
      username: row.username as string | null,
      emailVerified: Boolean(row.email_verified),
      createdAt: new Date(row.created_at as string),
      updatedAt: new Date(row.updated_at as string),
    };
  } catch (error) {
    // Log error for debugging purposes but throw a generic error to avoid leaking internals
    console.error("Database error in getUserByEmail:", error);
    throw new Error("Failed to retrieve user information");
  }
}

/**
 * Finds a user by their username
 *
 * @category User Lookup
 * @since 1.0.0
 *
 * @param {string} username - The username to search for
 * @returns {Promise<UserWithPassword|null>} The user with password hash if found, null otherwise
 *
 * @throws {Error} If database operation fails
 *
 * @example
 * try {
 *   const user = await getUserByUsername("MusicLover");
 *   if (user) {
 *     console.log(`Found user with email: ${user.email}`);
 *   } else {
 *     console.log("Username not found");
 *   }
 * } catch (error) {
 *   console.error(`Error finding user: ${error.message}`);
 * }
 */
export async function getUserByUsername(username: string): Promise<UserWithPassword | null> {
  const query = `
    SELECT 
      id, 
      email, 
      password_hash, 
      username, 
      email_verified, 
      created_at, 
      updated_at 
    FROM users 
    WHERE username = ?
  `;

  try {
    const result = await turso.execute({
      sql: query,
      args: [username],
    });

    if (!result.rows || result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];

    return {
      id: createUserId(row.id as string),
      email: createEmailAddress(row.email as string),
      passwordHash: row.password_hash as string,
      username: row.username as string | null,
      emailVerified: Boolean(row.email_verified),
      createdAt: new Date(row.created_at as string),
      updatedAt: new Date(row.updated_at as string),
    };
  } catch (error) {
    console.error("Database error in getUserByUsername:", error);
    throw new Error("Failed to retrieve user information");
  }
}

/**
 * Verifies if the provided password matches the stored hash for a user
 *
 * @category Authentication
 * @since 1.0.0
 *
 * @param {UserWithPassword} user - The user object containing the password hash
 * @param {string} password - The plain text password to verify
 * @returns {Promise<boolean>} True if the password matches, false otherwise
 *
 * @example
 * const user = await getUserByEmail("user@example.com");
 * if (user && await verifyPassword(user, "InputPassword123")) {
 *   console.log("Password is correct");
 * } else {
 *   console.log("Invalid credentials");
 * }
 */
export async function verifyPassword(user: UserWithPassword, password: string): Promise<boolean> {
  // Validate inputs
  if (!user.passwordHash) {
    console.error("verifyPassword: passwordHash is undefined or null for user:", user.email);
    return false;
  }

  if (!password) {
    console.error("verifyPassword: password is undefined or null");
    return false;
  }

  try {
    return await bcrypt.compare(password, user.passwordHash);
  } catch (error) {
    console.error("verifyPassword: bcrypt.compare failed:", error);
    return false;
  }
}

/**
 * Cache for token operations to reduce repetitive database calls
 * Maps user IDs to token generation timestamps for rate limiting
 * @private
 */
const tokenOperationsCache = new Map<string, number>();

/**
 * Generates an email verification token for a user
 *
 * This token is used in the email verification process and expires after
 * the configured time period (VERIFICATION_TOKEN_EXPIRES_HOURS).
 * Includes rate limiting to prevent token generation abuse.
 *
 * @category Email Verification
 * @since 1.0.0
 *
 * @param {UserId} userId - The ID of the user to generate a token for
 * @returns {Promise<VerificationToken>} The generated verification token
 *
 * @throws {AuthError} If token generation is rate limited
 * @throws {Error} If database operation fails
 *
 * @example
 * try {
 *   const userId = user.id;
 *   const token = await generateEmailVerificationToken(userId);
 *   await sendVerificationEmail(user.email, token);
 * } catch (error) {
 *   if (isAuthError(error)) {
 *     console.error(`Auth error: ${error.message}`);
 *   } else {
 *     console.error(`Unexpected error: ${error.message}`);
 *   }
 * }
 */
export async function generateEmailVerificationToken(userId: UserId): Promise<VerificationToken> {
  // Rate limiting: prevent generating too many tokens in a short period
  const now = Date.now();
  const lastGeneration = tokenOperationsCache.get(userId);

  // If token was generated in the last 5 minutes, throw an error
  if (lastGeneration && now - lastGeneration < 5 * 60 * 1000) {
    throw new AuthError(
      "Verification token recently generated. Please wait before requesting another token."
    );
  }

  const verificationToken = createVerificationToken(uuidv4());
  const currentDate = new Date();
  const verificationExpires = new Date(
    currentDate.getTime() + VERIFICATION_TOKEN_EXPIRES_HOURS * 60 * 60 * 1000
  );

  const query = `
    UPDATE users 
    SET 
      verification_token = ?, 
      verification_token_expires_at = ?
    WHERE id = ?
  `;

  try {
    await turso.execute({
      sql: query,
      args: [verificationToken, verificationExpires.toISOString(), userId],
    });

    // Update cache with current timestamp
    tokenOperationsCache.set(userId, now);

    // Clean up old entries from cache to prevent memory leaks
    const CACHE_MAX_SIZE = 1000;
    if (tokenOperationsCache.size > CACHE_MAX_SIZE) {
      const oldestEntries = [...tokenOperationsCache.entries()]
        .sort((a, b) => a[1] - b[1])
        .slice(0, Math.floor(CACHE_MAX_SIZE / 2))
        .map(([key]) => key);

      oldestEntries.forEach((key) => tokenOperationsCache.delete(key));
    }

    return verificationToken;
  } catch (error) {
    console.error("Error generating verification token:", error);
    throw new Error("Failed to generate verification token");
  }
}

/**
 * Result of the verification process
 * @category Types
 * @since 1.0.0
 */
export interface VerificationResult {
  /** Whether the verification was successful */
  success: boolean;
  /** Reason for failure if unsuccessful */
  reason?: "token-invalid" | "token-expired" | "database-error";
}

/**
 * Verifies a user's email using a verification token
 *
 * This function marks the user's email as verified if the token is valid and not expired.
 * It also removes the verification token after successful verification.
 *
 * @category Email Verification
 * @since 1.0.0
 *
 * @param {VerificationToken} token - The verification token to validate
 * @returns {Promise<VerificationResult>} Result object with verification status
 *
 * @throws {Error} If an unexpected database error occurs
 *
 * @example
 * try {
 *   const result = await verifyEmail(token);
 *   if (result.success) {
 *     console.log("Email successfully verified!");
 *   } else {
 *     console.log(`Verification failed: ${result.reason}`);
 *   }
 * } catch (error) {
 *   console.error(`Error during verification: ${error.message}`);
 * }
 */
export async function verifyEmail(token: VerificationToken): Promise<VerificationResult> {
  // First check if token exists and isn't expired
  const checkQuery = `
    SELECT id FROM users
    WHERE verification_token = ? AND verification_token_expires_at > datetime('now')
  `;

  try {
    const checkResult = await turso.execute({
      sql: checkQuery,
      args: [token],
    });

    if (!checkResult.rows || checkResult.rows.length === 0) {
      // Check if token exists at all to determine if it's invalid or expired
      const tokenCheckQuery = `
        SELECT id FROM users WHERE verification_token = ?
      `;

      const tokenExists = await turso.execute({
        sql: tokenCheckQuery,
        args: [token],
      });

      return {
        success: false,
        reason: tokenExists.rows && tokenExists.rows.length > 0 ? "token-expired" : "token-invalid",
      };
    }

    // Token is valid, proceed with verification
    const updateQuery = `
      UPDATE users 
      SET 
        email_verified = TRUE, 
        verification_token = NULL, 
        verification_token_expires_at = NULL,
        updated_at = datetime('now')
      WHERE 
        verification_token = ?
      RETURNING id
    `;

    const result = await turso.execute({
      sql: updateQuery,
      args: [token],
    });

    return {
      success: result.rows && result.rows.length > 0,
    };
  } catch (error) {
    console.error("Database error during email verification:", error);
    return {
      success: false,
      reason: "database-error",
    };
  }
}

/**
 * Result of password reset token generation
 * @category Types
 * @since 1.0.0
 */
export interface ResetTokenResult {
  /** The generated reset token, if successful */
  token: ResetToken | null;
  /** Whether the operation was successful */
  success: boolean;
  /** Reason for failure if unsuccessful */
  reason?: "user-not-found" | "rate-limited" | "database-error";
}

/**
 * Generates a password reset token for a user
 *
 * This token allows a user to reset their password and expires after
 * the configured time period (RESET_TOKEN_EXPIRES_HOURS).
 * Includes rate limiting to prevent token generation abuse.
 *
 * @category Password Management
 * @since 1.0.0
 *
 * @param {string} email - The email address of the user requesting a password reset
 * @returns {Promise<ResetTokenResult>} The result object containing the token or error information
 *
 * @example
 * try {
 *   const result = await generatePasswordResetToken("user@example.com");
 *   if (result.success && result.token) {
 *     await sendPasswordResetEmail(email, result.token);
 *   } else {
 *     console.log(`Could not generate reset token: ${result.reason}`);
 *   }
 * } catch (error) {
 *   console.error(`Error generating reset token: ${error.message}`);
 * }
 */
export async function generatePasswordResetToken(email: string): Promise<ResetTokenResult> {
  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return {
        token: null,
        success: false,
        reason: "user-not-found",
      };
    }

    // Rate limiting: prevent generating too many tokens in a short period
    const now = Date.now();
    const lastGeneration = tokenOperationsCache.get(user.id);

    // If token was generated in the last 5 minutes, return rate limited error
    if (lastGeneration && now - lastGeneration < 5 * 60 * 1000) {
      return {
        token: null,
        success: false,
        reason: "rate-limited",
      };
    }

    const resetToken = createResetToken(uuidv4());
    const currentDate = new Date();
    const resetExpires = new Date(
      currentDate.getTime() + RESET_TOKEN_EXPIRES_HOURS * 60 * 60 * 1000
    );

    const query = `
      UPDATE users 
      SET 
        reset_token = ?, 
        reset_token_expires_at = ?,
        updated_at = datetime('now')
      WHERE id = ?
    `;

    await turso.execute({
      sql: query,
      args: [resetToken, resetExpires.toISOString(), user.id],
    });

    // Update cache with current timestamp
    tokenOperationsCache.set(user.id, now);

    return {
      token: resetToken,
      success: true,
    };
  } catch (error) {
    console.error("Error generating password reset token:", error);
    return {
      token: null,
      success: false,
      reason: "database-error",
    };
  }
}

/**
 * Result of password reset operation
 * @category Types
 * @since 1.0.0
 */
export interface PasswordResetResult {
  /** Whether the reset was successful */
  success: boolean;
  /** Reason for failure if unsuccessful */
  reason?: "token-invalid" | "token-expired" | "password-policy" | "database-error";
}

/**
 * Password policy criteria
 * @category Types
 * @since 1.0.0
 */
export interface PasswordPolicyResult {
  /** Whether the password meets all requirements */
  valid: boolean;
  /** List of reasons why the password is invalid */
  reasons: string[];
}

/**
 * Checks if a password meets the security requirements
 *
 * @category Password Management
 * @since 1.0.0
 *
 * @param {string} password - The password to validate
 * @returns {PasswordPolicyResult} Result of password validation
 */
export function validatePasswordPolicy(password: string): PasswordPolicyResult {
  const reasons: string[] = [];

  if (password.length < 8) {
    reasons.push("Password must be at least  characters long");
  }

  if (!/[A-Z]/.test(password)) {
    reasons.push("Password must contain at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    reasons.push("Password must contain at least one lowercase letter");
  }

  if (!/[0-9]/.test(password)) {
    reasons.push("Password must contain at least one number");
  }

  return {
    valid: reasons.length === 0,
    reasons,
  };
}

/**
 * Resets a user's password using a valid reset token
 *
 * This function:
 * 1. Verifies the reset token is valid and not expired
 * 2. Validates the new password against security policy
 * 3. Hashes the new password
 * 4. Updates the user's password and removes the reset token
 *
 * @category Password Management
 * @since 1.0.0
 *
 * @param {ResetToken} token - The password reset token
 * @param {string} newPassword - The new password to set
 * @returns {Promise<PasswordResetResult>} Result object with reset status
 *
 * @example
 * try {
 *   const result = await resetPassword(token, "NewSecurePassword123");
 *   if (result.success) {
 *     console.log("Password successfully reset!");
 *   } else {
 *     console.log(`Password reset failed: ${result.reason}`);
 *   }
 * } catch (error) {
 *   console.error(`Error during password reset: ${error.message}`);
 * }
 */
export async function resetPassword(
  token: ResetToken,
  newPassword: string
): Promise<PasswordResetResult> {
  // First validate the password against policy
  const policyCheck = validatePasswordPolicy(newPassword);
  if (!policyCheck.valid) {
    return {
      success: false,
      reason: "password-policy",
    };
  }

  // Check if token exists and isn't expired
  const checkQuery = `
    SELECT id FROM users
    WHERE reset_token = ? AND reset_token_expires_at > datetime('now')
  `;

  try {
    const checkResult = await turso.execute({
      sql: checkQuery,
      args: [token],
    });

    if (!checkResult.rows || checkResult.rows.length === 0) {
      // Check if token exists at all to determine if it's invalid or expired
      const tokenCheckQuery = `
        SELECT id FROM users WHERE reset_token = ?
      `;

      const tokenExists = await turso.execute({
        sql: tokenCheckQuery,
        args: [token],
      });

      return {
        success: false,
        reason: tokenExists.rows && tokenExists.rows.length > 0 ? "token-expired" : "token-invalid",
      };
    }

    // Token is valid, proceed with password reset
    const passwordHash = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);

    const query = `
      UPDATE users 
      SET 
        password_hash = ?, 
        reset_token = NULL, 
        reset_token_expires_at = NULL,
        updated_at = datetime('now')
      WHERE 
        reset_token = ?
      RETURNING id
    `;

    const result = await turso.execute({
      sql: query,
      args: [passwordHash, token],
    });

    return {
      success: result.rows && result.rows.length > 0,
    };
  } catch (error) {
    console.error("Database error during password reset:", error);
    return {
      success: false,
      reason: "database-error",
    };
  }
}

/**
 * Updates a user's password directly (when already authenticated)
 *
 * This function is typically used when a user is already logged in and wants
 * to change their password, unlike resetPassword which is for forgotten passwords.
 * Includes validation against password policy.
 *
 * @category Password Management
 * @since 1.0.0
 *
 * @param {UserId} userId - The ID of the user whose password to update
 * @param {string} newPassword - The new password to set
 * @returns {Promise<PasswordResetResult>} Result object with update status
 *
 * @example
 * try {
 *   const result = await updatePassword(userId, "NewSecurePassword123");
 *   if (result.success) {
 *     console.log("Password successfully updated!");
 *   } else {
 *     console.log(`Password update failed: ${result.reason}`);
 *   }
 * } catch (error) {
 *   console.error(`Error during password update: ${error.message}`);
 * }
 */
export async function updatePassword(
  userId: UserId,
  newPassword: string
): Promise<PasswordResetResult> {
  // First validate the password against policy
  const policyCheck = validatePasswordPolicy(newPassword);
  if (!policyCheck.valid) {
    return {
      success: false,
      reason: "password-policy",
    };
  }

  try {
    const passwordHash = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);

    const query = `
      UPDATE users 
      SET 
        password_hash = ?,
        updated_at = datetime('now')
      WHERE id = ?
      RETURNING id
    `;

    const result = await turso.execute({
      sql: query,
      args: [passwordHash, userId],
    });

    return {
      success: result.rows && result.rows.length > 0,
    };
  } catch (error) {
    console.error("Database error during password update:", error);
    return {
      success: false,
      reason: "database-error",
    };
  }
}

/**
 * Memoized function to check if a user exists
 * Caches results to reduce database queries for repeated lookups
 *
 * @category User Lookup
 * @since 1.0.0
 *
 * @param {string} email - Email to check
 * @returns {Promise<boolean>} Whether the user exists
 */
export const userExists = memoize(
  async (email: string): Promise<boolean> => {
    const query = `SELECT 1 FROM users WHERE email = ? LIMIT 1`;

    try {
      const result = await turso.execute({
        sql: query,
        args: [email.toLowerCase()],
      });

      return result.rows && result.rows.length > 0;
    } catch (error) {
      console.error("Error checking user existence:", error);
      return false;
    }
  },
  { maxSize: 100, ttl: 60000 } // Cache for 1 minute with max 100 entries
);

/**
 * Options for memoization
 * @category Types
 */
interface MemoizeOptions {
  /** Maximum number of entries to store in cache */
  maxSize?: number;
  /** Time-to-live in milliseconds */
  ttl?: number;
}

/**
 * Generic memoization helper function
 *
 * @category Utilities
 * @since 1.0.0
 *
 * @template Args - Type of function arguments
 * @template Result - Type of function result
 * @param {Function} fn - Function to memoize
 * @param {MemoizeOptions} [options] - Memoization options
 * @returns {Function} Memoized function
 */
function memoize<Args extends unknown[], Result>(
  fn: (...args: Args) => Promise<Result>,
  options?: MemoizeOptions
): (...args: Args) => Promise<Result> {
  const cache = new Map<string, { result: Result; timestamp: number }>();
  const maxSize = options?.maxSize || 1000;
  const ttl = options?.ttl || 5 * 60 * 1000; // Default 5 minutes

  return async (...args: Args): Promise<Result> => {
    const key = JSON.stringify(args);
    const cached = cache.get(key);
    const now = Date.now();

    // Return from cache if entry exists and is not expired
    if (cached && now - cached.timestamp < ttl) {
      return cached.result;
    }

    // Call original function
    const result = await fn(...args);

    // Store in cache
    cache.set(key, { result, timestamp: now });

    // Clean up if cache is too large
    if (cache.size > maxSize) {
      // Find oldest entries
      const entries = [...cache.entries()]
        .sort((a, b) => a[1].timestamp - b[1].timestamp)
        .slice(0, Math.ceil(maxSize * 0.2)) // Remove oldest 20%
        .map(([key]) => key);

      entries.forEach((key) => cache.delete(key));
    }

    return result;
  };
}
