import {
  createUser,
  getUserByEmail,
  verifyPassword,
  generateEmailVerificationToken,
  verifyEmail,
  generatePasswordResetToken,
  resetPassword,
  updatePassword,
  type User,
  type NewUser,
  type UserWithPassword,
} from "./db.js";
import {
  generateTokenPair,
  verifyAccessToken,
  verifyRefreshToken,
  type TokenPair,
} from "./jwt.js";
import {
  validatePassword,
  type ValidationResult,
} from "./password-validation.js";
import {
  recordFailedLoginAttempt,
  resetRateLimit,
  isRateLimited,
} from "./rate-limit.js";
import { generateCsrfToken, type CsrfToken } from "./csrf.js";

// Typ für Login-Ergebnisse
export type LoginResult = {
  success: boolean;
  user?: User;
  tokens?: TokenPair;
  csrfToken?: CsrfToken;
  error?: string;
  rateLimited?: boolean;
  resetTime?: number;
};

// Typ für Registrierungsergebnisse
export type RegisterResult = {
  success: boolean;
  user?: User;
  error?: string;
  validationErrors?: string[];
};

// Typ für Passwort-Reset-Ergebnisse
export type PasswordResetResult = {
  success: boolean;
  error?: string;
  validationErrors?: string[];
};

/**
 * AuthService-Klasse, die alle Authentifizierungsfunktionen zusammenfasst
 */
export class AuthService {
  /**
   * Meldet einen Benutzer an
   */
  async login(
    email: string,
    password: string,
    ip: string,
  ): Promise<LoginResult> {
    // Prüfe Rate-Limiting
    if (isRateLimited(ip)) {
      return {
        success: false,
        error: "auth.service.too_many_attempts",
        rateLimited: true,
        resetTime: 15 * 60 * 1000, // 15 Minuten in Millisekunden
      };
    }

    try {
      // Benutzer anhand der E-Mail-Adresse suchen
      const user = await getUserByEmail(email);
      if (!user) {
        // Fehlgeschlagenen Anmeldeversuch registrieren
        recordFailedLoginAttempt(ip);
        return {
          success: false,
          error: "auth.service.invalid_credentials",
        };
      }

      // Passwort überprüfen
      const isPasswordValid = await verifyPassword(user, password);
      if (!isPasswordValid) {
        // Fehlgeschlagenen Anmeldeversuch registrieren
        recordFailedLoginAttempt(ip);
        return {
          success: false,
          error: "auth.service.invalid_credentials",
        };
      }

      // E-Mail-Verifizierung ist jetzt optional

      // Rate-Limit zurücksetzen
      resetRateLimit(ip);

      // Tokens generieren
      const tokens = generateTokenPair(user);

      // CSRF-Token generieren
      const csrfToken = generateCsrfToken();

      // Benutzer ohne Passwort-Hash zurückgeben
      const { passwordHash, ...userWithoutPassword } = user;

      return {
        success: true,
        user: userWithoutPassword,
        tokens,
        csrfToken,
      };
    } catch (error) {
      console.error("Fehler bei der Benutzeranmeldung:", error);
      return {
        success: false,
        error: "auth.api.general_error",
      };
    }
  }

  /**
   * Registriert einen neuen Benutzer
   */
  async register(userData: NewUser): Promise<RegisterResult> {
    try {
      // Passwort validieren
      const passwordValidation = validatePassword(userData.password);
      if (!passwordValidation.valid) {
        return {
          success: false,
          error: "auth.service.password_requirements",
          validationErrors: passwordValidation.errors,
        };
      }

      // Prüfen, ob der Benutzer bereits existiert
      const existingUser = await getUserByEmail(userData.email);
      if (existingUser) {
        return {
          success: false,
          error: "auth.service.email_exists",
        };
      }

      // Neuen Benutzer erstellen
      const newUser = await createUser(userData);

      // E-Mail-Verifizierungstoken generieren
      const verificationToken = await generateEmailVerificationToken(
        newUser.id,
      );

      // In einer echten Anwendung würde hier eine E-Mail mit dem Verifizierungslink gesendet werden
      console.log(
        `Verifizierungslink: https://example.com/verify-email?token=${verificationToken}`,
      );

      return {
        success: true,
        user: newUser,
      };
    } catch (error) {
      console.error("Fehler bei der Benutzerregistrierung:", error);
      return {
        success: false,
        error: "auth.api.general_error",
      };
    }
  }

  /**
   * Verifiziert die E-Mail-Adresse eines Benutzers
   */
  async verifyUserEmail(token: string): Promise<boolean> {
    try {
      return await verifyEmail(token);
    } catch (error) {
      console.error("Fehler bei der E-Mail-Verifizierung:", error);
      return false;
    }
  }

  /**
   * Fordert einen Passwort-Reset an
   */
  async requestPasswordReset(email: string): Promise<boolean> {
    try {
      const resetToken = await generatePasswordResetToken(email);
      if (!resetToken) {
        return false;
      }

      // In einer echten Anwendung würde hier eine E-Mail mit dem Reset-Link gesendet werden
      console.log(
        `Passwort-Reset-Link: https://example.com/reset-password?token=${resetToken}`,
      );

      return true;
    } catch (error) {
      console.error("Fehler bei der Passwort-Reset-Anforderung:", error);
      return false;
    }
  }

  /**
   * Setzt das Passwort mit einem Reset-Token zurück
   */
  async resetUserPassword(
    token: string,
    newPassword: string,
  ): Promise<PasswordResetResult> {
    try {
      // Passwort validieren
      const passwordValidation = validatePassword(newPassword);
      if (!passwordValidation.valid) {
        return {
          success: false,
          error: "auth.service.new_password_requirements",
          validationErrors: passwordValidation.errors,
        };
      }

      const success = await resetPassword(token, newPassword);
      if (!success) {
        return {
          success: false,
          error: "auth.api.invalid_token",
        };
      }

      return {
        success: true,
      };
    } catch (error) {
      console.error("Fehler beim Zurücksetzen des Passworts:", error);
      return {
        success: false,
        error: "auth.api.general_error",
      };
    }
  }

  /**
   * Ändert das Passwort eines angemeldeten Benutzers
   */
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<PasswordResetResult> {
    try {
      // Passwort validieren
      const passwordValidation = validatePassword(newPassword);
      if (!passwordValidation.valid) {
        return {
          success: false,
          error:
            "Das neue Passwort erfüllt nicht die Sicherheitsanforderungen.",
          validationErrors: passwordValidation.errors,
        };
      }

      // Benutzer und aktuelles Passwort überprüfen
      const user = await getUserByEmail(userId);
      if (!user) {
        return {
          success: false,
          error: "auth.service.user_not_found",
        };
      }

      const isPasswordValid = await verifyPassword(user, currentPassword);
      if (!isPasswordValid) {
        return {
          success: false,
          error: "auth.service.current_password_incorrect",
        };
      }

      // Passwort ändern
      const success = await updatePassword(userId, newPassword);
      if (!success) {
        return {
          success: false,
          error: "auth.service.password_change_error",
        };
      }

      return {
        success: true,
      };
    } catch (error) {
      console.error("Fehler beim Ändern des Passworts:", error);
      return {
        success: false,
        error: "auth.api.general_error",
      };
    }
  }

  /**
   * Verifiziert ein Access-Token
   */
  verifyToken(token: string): boolean {
    return verifyAccessToken(token) !== null;
  }

  /**
   * Erneuert ein Access-Token mit einem Refresh-Token
   */
  async refreshToken(
    refreshToken: string,
  ): Promise<{ success: boolean; accessToken?: string; error?: string }> {
    try {
      const payload = verifyRefreshToken(refreshToken);
      if (!payload) {
        return {
          success: false,
          error: "auth.service.invalid_refresh_token",
        };
      }

      // Benutzer überprüfen
      const user = await getUserByEmail(payload.email);
      if (!user) {
        return {
          success: false,
          error: "auth.service.user_not_found",
        };
      }

      // Neues Access-Token generieren
      const accessToken = generateTokenPair(user).accessToken;

      return {
        success: true,
        accessToken,
      };
    } catch (error) {
      console.error("Fehler beim Erneuern des Tokens:", error);
      return {
        success: false,
        error: "auth.api.general_error",
      };
    }
  }
}

// Exportiere eine Instanz des AuthService
export const authService = new AuthService();
