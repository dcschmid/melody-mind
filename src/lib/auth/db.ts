/**
 * Authentication Database Module
 *
 * This module handles all database operations related to user authentication for the MelodyMind application.
 * It includes functions for user creation, verification, password management, and token generation.
 *
 * The module uses bcrypt for secure password hashing and UUID for generating unique tokens.
 * All database operations are performed using the Turso database client.
 */
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

import { turso } from "../../turso.js";

/**
 * Represents a user in the system
 * @typedef {Object} User
 * @property {string} id - Unique identifier for the user
 * @property {string} email - User's email address
 * @property {string|null} username - User's optional username
 * @property {boolean} emailVerified - Whether the user's email has been verified
 * @property {Date} createdAt - When the user account was created
 * @property {Date} updatedAt - When the user account was last updated
 */
export type User = {
  id: string;
  email: string;
  username: string | null;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Extends the User type to include password hash
 * @typedef {User & {passwordHash: string}} UserWithPassword
 */
export type UserWithPassword = User & {
  passwordHash: string;
};

/**
 * Data structure for creating a new user
 * @typedef {Object} NewUser
 * @property {string} email - User's email address
 * @property {string} password - User's plain text password (will be hashed before storage)
 * @property {string} [username] - Optional username
 */
export type NewUser = {
  email: string;
  password: string;
  username?: string;
};

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
 * @param {NewUser} user - The user data to create
 * @returns {Promise<User>} The created user object (without password)
 * @throws {Error} If the user creation fails
 */
export async function createUser(user: NewUser): Promise<User> {
  const id = uuidv4();
  const passwordHash = await bcrypt.hash(user.password, BCRYPT_SALT_ROUNDS);
  const verificationToken = uuidv4();
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
    throw new Error("Fehler beim Erstellen des Benutzers");
  }

  const row = result.rows[0];

  return {
    id: row.id as string,
    email: row.email as string,
    username: row.username as string | null,
    emailVerified: Boolean(row.email_verified),
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  };
}

/**
 * Finds a user by their email address
 *
 * @param {string} email - The email address to search for (case-insensitive)
 * @returns {Promise<UserWithPassword|null>} The user with password hash if found, null otherwise
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

  const result = await turso.execute({
    sql: query,
    args: [email.toLowerCase()],
  });

  if (!result.rows || result.rows.length === 0) {
    return null;
  }

  const row = result.rows[0];

  return {
    id: row.id as string,
    email: row.email as string,
    passwordHash: row.password_hash as string,
    username: row.username as string | null,
    emailVerified: Boolean(row.email_verified),
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  };
}

/**
 * Finds a user by their username
 *
 * @param {string} username - The username to search for
 * @returns {Promise<UserWithPassword|null>} The user with password hash if found, null otherwise
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

  const result = await turso.execute({
    sql: query,
    args: [username],
  });

  if (!result.rows || result.rows.length === 0) {
    return null;
  }

  const row = result.rows[0];

  return {
    id: row.id as string,
    email: row.email as string,
    passwordHash: row.password_hash as string,
    username: row.username as string | null,
    emailVerified: Boolean(row.email_verified),
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  };
}

/**
 * Verifies if the provided password matches the stored hash for a user
 *
 * @param {UserWithPassword} user - The user object containing the password hash
 * @param {string} password - The plain text password to verify
 * @returns {Promise<boolean>} True if the password matches, false otherwise
 */
export async function verifyPassword(user: UserWithPassword, password: string): Promise<boolean> {
  return bcrypt.compare(password, user.passwordHash);
}

/**
 * Generates an email verification token for a user
 *
 * This token is used in the email verification process and expires after
 * the configured time period (VERIFICATION_TOKEN_EXPIRES_HOURS).
 *
 * @param {string} userId - The ID of the user to generate a token for
 * @returns {Promise<string>} The generated verification token
 */
export async function generateEmailVerificationToken(userId: string): Promise<string> {
  const verificationToken = uuidv4();
  const now = new Date();
  const verificationExpires = new Date(
    now.getTime() + VERIFICATION_TOKEN_EXPIRES_HOURS * 60 * 60 * 1000
  );

  const query = `
    UPDATE users 
    SET 
      verification_token = ?, 
      verification_token_expires_at = ?
    WHERE id = ?
  `;

  await turso.execute({
    sql: query,
    args: [verificationToken, verificationExpires.toISOString(), userId],
  });

  return verificationToken;
}

/**
 * Verifies a user's email using a verification token
 *
 * This function marks the user's email as verified if the token is valid and not expired.
 * It also removes the verification token after successful verification.
 *
 * @param {string} token - The verification token to validate
 * @returns {Promise<boolean>} True if verification was successful, false otherwise
 */
export async function verifyEmail(token: string): Promise<boolean> {
  const query = `
    UPDATE users 
    SET 
      email_verified = TRUE, 
      verification_token = NULL, 
      verification_token_expires_at = NULL
    WHERE 
      verification_token = ? AND 
      verification_token_expires_at > datetime('now')
    RETURNING id
  `;

  const result = await turso.execute({
    sql: query,
    args: [token],
  });

  return result.rows && result.rows.length > 0;
}

/**
 * Generates a password reset token for a user
 *
 * This token allows a user to reset their password and expires after
 * the configured time period (RESET_TOKEN_EXPIRES_HOURS).
 *
 * @param {string} email - The email address of the user requesting a password reset
 * @returns {Promise<string|null>} The generated reset token, or null if user not found
 */
export async function generatePasswordResetToken(email: string): Promise<string | null> {
  const user = await getUserByEmail(email);

  if (!user) {
    return null;
  }

  const resetToken = uuidv4();
  const now = new Date();
  const resetExpires = new Date(now.getTime() + RESET_TOKEN_EXPIRES_HOURS * 60 * 60 * 1000);

  const query = `
    UPDATE users 
    SET 
      reset_token = ?, 
      reset_token_expires_at = ?
    WHERE id = ?
  `;

  await turso.execute({
    sql: query,
    args: [resetToken, resetExpires.toISOString(), user.id],
  });

  return resetToken;
}

/**
 * Resets a user's password using a valid reset token
 *
 * This function:
 * 1. Verifies the reset token is valid and not expired
 * 2. Hashes the new password
 * 3. Updates the user's password and removes the reset token
 *
 * @param {string} token - The password reset token
 * @param {string} newPassword - The new password to set
 * @returns {Promise<boolean>} True if password reset was successful, false otherwise
 */
export async function resetPassword(token: string, newPassword: string): Promise<boolean> {
  const passwordHash = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);

  const query = `
    UPDATE users 
    SET 
      password_hash = ?, 
      reset_token = NULL, 
      reset_token_expires_at = NULL
    WHERE 
      reset_token = ? AND 
      reset_token_expires_at > datetime('now')
    RETURNING id
  `;

  const result = await turso.execute({
    sql: query,
    args: [passwordHash, token],
  });

  return result.rows && result.rows.length > 0;
}

/**
 * Updates a user's password directly (when already authenticated)
 *
 * This function is typically used when a user is already logged in and wants
 * to change their password, unlike resetPassword which is for forgotten passwords.
 *
 * @param {string} userId - The ID of the user whose password to update
 * @param {string} newPassword - The new password to set
 * @returns {Promise<boolean>} True if password update was successful, false otherwise
 */
export async function updatePassword(userId: string, newPassword: string): Promise<boolean> {
  const passwordHash = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);

  const query = `
    UPDATE users 
    SET password_hash = ?
    WHERE id = ?
    RETURNING id
  `;

  const result = await turso.execute({
    sql: query,
    args: [passwordHash, userId],
  });

  return result.rows && result.rows.length > 0;
}
