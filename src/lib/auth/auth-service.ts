import { generateCsrfToken, type CsrfToken } from "./csrf.js";
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
} from "./db.js";
import { generateTokenPair, verifyAccessToken, verifyRefreshToken, type TokenPair } from "./jwt.js";
import { validatePassword, type ValidationResult } from "./password-validation.js";
import { recordFailedLoginAttempt, resetRateLimit, isRateLimited } from "./rate-limit.js";

// Type for login results
export type LoginResult = {
  success: boolean;
  user?: User;
  tokens?: TokenPair;
  csrfToken?: CsrfToken;
  error?: string;
  rateLimited?: boolean;
  resetTime?: number;
};

// Type for registration results
export type RegisterResult = {
  success: boolean;
  user?: User;
  error?: string;
  validationErrors?: string[];
};

// Type for password reset results
export type PasswordResetResult = {
  success: boolean;
  error?: string;
  validationErrors?: string[];
};

/**
 * AuthService class that encapsulates all authentication functions
 */
export class AuthService {
  /**
   * Logs in a user
   */
  async login(email: string, password: string, ip: string): Promise<LoginResult> {
    // Check rate limiting
    if (isRateLimited(ip)) {
      return {
        success: false,
        error: "auth.service.too_many_attempts",
        rateLimited: true,
        resetTime: 15 * 60 * 1000, // 15 minutes in milliseconds
      };
    }

    try {
      // Find user by email address
      const user = await getUserByEmail(email);
      if (!user) {
        // Register failed login attempt
        recordFailedLoginAttempt(ip);
        return {
          success: false,
          error: "auth.service.invalid_credentials",
        };
      }

      // Verify password
      const isPasswordValid = await verifyPassword(user, password);
      if (!isPasswordValid) {
        // Register failed login attempt
        recordFailedLoginAttempt(ip);
        return {
          success: false,
          error: "auth.service.invalid_credentials",
        };
      }

      // Email verification is now optional

      // Reset rate limit
      resetRateLimit(ip);

      // Generate tokens
      const tokens = generateTokenPair(user);

      // Generate CSRF token
      const csrfToken = generateCsrfToken();

      // Return user without password hash
      const { passwordHash, ...userWithoutPassword } = user;

      return {
        success: true,
        user: userWithoutPassword,
        tokens,
        csrfToken,
      };
    } catch (error) {
      console.error("Error during user login:", error);
      return {
        success: false,
        error: "auth.api.general_error",
      };
    }
  }

  /**
   * Registers a new user
   */
  async register(userData: NewUser): Promise<RegisterResult> {
    try {
      // Validate password
      const passwordValidation = validatePassword(userData.password);
      if (!passwordValidation.valid) {
        return {
          success: false,
          error: "auth.service.password_requirements",
          validationErrors: passwordValidation.errors,
        };
      }

      // Check if user already exists
      const existingUser = await getUserByEmail(userData.email);
      if (existingUser) {
        return {
          success: false,
          error: "auth.service.email_exists",
        };
      }

      // Create new user
      const newUser = await createUser(userData);

      // Generate email verification token
      const verificationToken = await generateEmailVerificationToken(newUser.id);

      // In a real application, an email with the verification link would be sent here
      console.log(`Verification link: https://example.com/verify-email?token=${verificationToken}`);

      return {
        success: true,
        user: newUser,
      };
    } catch (error) {
      console.error("Error during user registration:", error);
      return {
        success: false,
        error: "auth.api.general_error",
      };
    }
  }

  /**
   * Verifies a user's email address
   */
  async verifyUserEmail(token: string): Promise<boolean> {
    try {
      return await verifyEmail(token);
    } catch (error) {
      console.error("Error during email verification:", error);
      return false;
    }
  }

  /**
   * Requests a password reset
   */
  async requestPasswordReset(email: string): Promise<boolean> {
    try {
      const resetToken = await generatePasswordResetToken(email);
      if (!resetToken) {
        return false;
      }

      // In a real application, an email with the reset link would be sent here
      console.log(`Password reset link: https://example.com/reset-password?token=${resetToken}`);

      return true;
    } catch (error) {
      console.error("Error during password reset request:", error);
      return false;
    }
  }

  /**
   * Resets the password using a reset token
   */
  async resetUserPassword(token: string, newPassword: string): Promise<PasswordResetResult> {
    try {
      // Validate password
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
      console.error("Error during password reset:", error);
      return {
        success: false,
        error: "auth.api.general_error",
      };
    }
  }

  /**
   * Changes the password of a logged-in user
   */
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<PasswordResetResult> {
    try {
      // Validate password
      const passwordValidation = validatePassword(newPassword);
      if (!passwordValidation.valid) {
        return {
          success: false,
          error: "The new password does not meet the security requirements.",
          validationErrors: passwordValidation.errors,
        };
      }

      // Verify user and current password
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

      // Change password
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
      console.error("Error during password change:", error);
      return {
        success: false,
        error: "auth.api.general_error",
      };
    }
  }

  /**
   * Verifies an access token
   */
  verifyToken(token: string): boolean {
    return verifyAccessToken(token) !== null;
  }

  /**
   * Refreshes an access token using a refresh token
   */
  async refreshToken(
    refreshToken: string
  ): Promise<{ success: boolean; accessToken?: string; error?: string }> {
    try {
      const payload = verifyRefreshToken(refreshToken);
      if (!payload) {
        return {
          success: false,
          error: "auth.service.invalid_refresh_token",
        };
      }

      // Verify user
      const user = await getUserByEmail(payload.email);
      if (!user) {
        return {
          success: false,
          error: "auth.service.user_not_found",
        };
      }

      // Generate new access token
      const accessToken = generateTokenPair(user).accessToken;

      return {
        success: true,
        accessToken,
      };
    } catch (error) {
      console.error("Error during token refresh:", error);
      return {
        success: false,
        error: "auth.api.general_error",
      };
    }
  }
}

// Export an instance of AuthService
export const authService = new AuthService();
