import { turso } from "../../turso";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

// Benutzertypen
export type User = {
  id: string;
  email: string;
  username: string | null;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type UserWithPassword = User & {
  passwordHash: string;
};

export type NewUser = {
  email: string;
  password: string;
  username?: string;
};

// Konstanten für Sicherheitseinstellungen
const BCRYPT_SALT_ROUNDS = 12;
const VERIFICATION_TOKEN_EXPIRES_HOURS = 24;
const RESET_TOKEN_EXPIRES_HOURS = 1;

/**
 * Erstellt einen neuen Benutzer in der Datenbank
 */
export async function createUser(user: NewUser): Promise<User> {
  const id = uuidv4();
  const passwordHash = await bcrypt.hash(user.password, BCRYPT_SALT_ROUNDS);
  const verificationToken = uuidv4();
  const now = new Date();
  const verificationExpires = new Date(
    now.getTime() + VERIFICATION_TOKEN_EXPIRES_HOURS * 60 * 60 * 1000,
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
 * Findet einen Benutzer anhand seiner E-Mail-Adresse
 */
export async function getUserByEmail(
  email: string,
): Promise<UserWithPassword | null> {
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
 * Findet einen Benutzer anhand seines Benutzernamens
 */
export async function getUserByUsername(
  username: string,
): Promise<UserWithPassword | null> {
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
 * Überprüft, ob das eingegebene Passwort mit dem gespeicherten Hash übereinstimmt
 */
export async function verifyPassword(
  user: UserWithPassword,
  password: string,
): Promise<boolean> {
  return bcrypt.compare(password, user.passwordHash);
}

/**
 * Generiert einen Verifizierungstoken für die E-Mail-Bestätigung
 */
export async function generateEmailVerificationToken(
  userId: string,
): Promise<string> {
  const verificationToken = uuidv4();
  const now = new Date();
  const verificationExpires = new Date(
    now.getTime() + VERIFICATION_TOKEN_EXPIRES_HOURS * 60 * 60 * 1000,
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
 * Verifiziert die E-Mail-Adresse eines Benutzers mit dem gegebenen Token
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
 * Generiert einen Token für das Zurücksetzen des Passworts
 */
export async function generatePasswordResetToken(
  email: string,
): Promise<string | null> {
  const user = await getUserByEmail(email);

  if (!user) {
    return null;
  }

  const resetToken = uuidv4();
  const now = new Date();
  const resetExpires = new Date(
    now.getTime() + RESET_TOKEN_EXPIRES_HOURS * 60 * 60 * 1000,
  );

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
 * Setzt das Passwort mit dem gegebenen Reset-Token zurück
 */
export async function resetPassword(
  token: string,
  newPassword: string,
): Promise<boolean> {
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
 * Aktualisiert das Passwort eines Benutzers
 */
export async function updatePassword(
  userId: string,
  newPassword: string,
): Promise<boolean> {
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
