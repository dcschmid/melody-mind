import jwt from "jsonwebtoken";
import type { User } from "./db";

// Konstanten für JWT-Einstellungen
const JWT_SECRET = process.env.JWT_SECRET || "melody-mind-jwt-secret"; // In Produktion sollte dies eine sichere Umgebungsvariable sein
const JWT_EXPIRES_IN = "24h"; // Token läuft nach 24 Stunden ab
const JWT_REFRESH_EXPIRES_IN = "7d"; // Refresh-Token läuft nach 7 Tagen ab

// Typen für JWT-Tokens
export type JwtPayload = {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
};

export type TokenPair = {
  accessToken: string;
  refreshToken: string;
};

/**
 * Generiert ein JWT-Token für einen Benutzer
 */
export function generateAccessToken(user: User): string {
  const payload: JwtPayload = {
    userId: user.id,
    email: user.email,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

/**
 * Generiert ein Refresh-Token für einen Benutzer
 */
export function generateRefreshToken(user: User): string {
  const payload: JwtPayload = {
    userId: user.id,
    email: user.email,
  };

  return jwt.sign(payload, JWT_SECRET + "-refresh", {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  });
}

/**
 * Generiert ein Token-Paar (Access-Token und Refresh-Token)
 */
export function generateTokenPair(user: User): TokenPair {
  return {
    accessToken: generateAccessToken(user),
    refreshToken: generateRefreshToken(user),
  };
}

/**
 * Verifiziert ein JWT-Token und gibt die Payload zurück
 */
export function verifyAccessToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Verifiziert ein Refresh-Token und gibt die Payload zurück
 */
export function verifyRefreshToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET + "-refresh") as JwtPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Erneuert ein Access-Token mit einem gültigen Refresh-Token
 */
export async function refreshAccessToken(
  refreshToken: string,
): Promise<string | null> {
  const payload = verifyRefreshToken(refreshToken);
  if (!payload || !payload.userId) {
    return null;
  }

  // Hier könnte eine Datenbankabfrage erfolgen, um zu prüfen, ob der Refresh-Token noch gültig ist
  // und nicht widerrufen wurde. Für dieses Beispiel wird dies übersprungen.

  const newPayload: JwtPayload = {
    userId: payload.userId,
    email: payload.email,
  };

  return jwt.sign(newPayload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

/**
 * Überprüft, ob ein Token gültig ist und gibt einen Boolean zurück
 */
export async function isAuthenticated(token: string): Promise<boolean> {
  try {
    const payload = verifyAccessToken(token);
    return payload !== null;
  } catch {
    return false;
  }
}
