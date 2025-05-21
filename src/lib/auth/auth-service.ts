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
  type UserWithPassword,
  type NewUser,
  type UserId,
  type VerificationToken,
  type ResetToken,
} from "./db.js";
import { generateTokenPair, verifyAccessToken, verifyRefreshToken, type TokenPair } from "./jwt.js";
import { validatePassword } from "./password-validation.js";
import { recordFailedLoginAttempt, resetRateLimit, isRateLimited } from "./rate-limit.js";

// Type for standard error codes used in authentication responses
type AuthErrorCode =
  | "auth.service.too_many_attempts"
  | "auth.service.invalid_credentials"
  | "auth.service.password_requirements"
  | "auth.service.email_exists"
  | "auth.service.user_not_found"
  | "auth.service.current_password_incorrect"
  | "auth.service.password_change_error"
  | "auth.service.invalid_refresh_token"
  | "auth.service.new_password_requirements"
  | "auth.api.invalid_token"
  | "auth.api.general_error";

// Type for login results
export type LoginResult = {
  success: boolean;
  user?: Omit<User, "passwordHash">;
  tokens?: TokenPair;
  csrfToken?: CsrfToken;
  error?: AuthErrorCode;
  rateLimited?: boolean;
  resetTime?: number;
};

// Type for registration results
export type RegisterResult = {
  success: boolean;
  user?: User;
  error?: AuthErrorCode;
  validationErrors?: string[];
};

// Type for password reset results
export type PasswordResetResult = {
  success: boolean;
  error?: AuthErrorCode | string; // String for backward compatibility
  validationErrors?: string[];
};

/**
 * Type for token refresh results
 *
 * @since 3.0.0
 * @category Authentication
 */
export type TokenRefreshResult = {
  /** Whether the token refresh was successful */
  success: boolean;
  /** New access token if refresh was successful */
  accessToken?: string;
  /** Error code if token refresh failed */
  error?: AuthErrorCode;
};

/**
 * Custom error class for authentication errors
 *
 * @since 3.0.0
 * @category Errors
 */
export class AuthError extends Error {
  /**
   * Creates a new authentication error
   *
   * @param {string} message - Human-readable error message
   * @param {AuthErrorCode} code - Error code for translation and identification
   */
  constructor(
    message: string,
    public readonly code: AuthErrorCode
  ) {
    super(message);
    this.name = "AuthError";
    // Ensures proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, AuthError.prototype);
  }
}

/**
 * Type guard for checking if an error is an AuthError
 *
 * @param {unknown} error - The error to check
 * @returns {boolean} True if the error is an AuthError
 */
export function isAuthError(error: unknown): error is AuthError {
  return error instanceof AuthError;
}

/**
 * AuthService class that encapsulates all authentication functions
 *
 * @since 3.0.0
 * @category Authentication
 */
export class AuthService {
  // Cache for user lookup to improve performance (memoization)
  private readonly userCache = new Map<string, UserWithPassword>();

  // Constants
  private readonly RATE_LIMIT_RESET_TIME = 15 * 60 * 1000; // 15 minutes in milliseconds

  /**
   * Retrieves a user by email from cache or database
   *
   * @private
   * @param {string} email - The email address to look up
   * @returns {Promise<UserWithPassword | null>} The user object if found, null otherwise
   */
  private async getUserByEmailWithCache(email: string): Promise<UserWithPassword | null> {
    const normalizedEmail = email.toLowerCase();

    // Check cache first
    if (this.userCache.has(normalizedEmail)) {
      return this.userCache.get(normalizedEmail) || null;
    }

    // Get from database
    const user = await getUserByEmail(normalizedEmail);

    // Cache the result (even if null, to prevent repeated DB lookups for non-existent users)
    if (user) {
      this.userCache.set(normalizedEmail, user);
    }

    return user;
  }

  /**
   * Logs in a user with email and password
   *
   * @since 3.0.0
   * @category Authentication
   *
   * @param {string} email - The user's email address
   * @param {string} password - The user's password
   * @param {string} ip - The IP address of the request for rate limiting
   *
   * @returns {Promise<LoginResult>} A promise resolving to a LoginResult object with the login status
   *
   * @example
   * // Attempt to log in a user
   * const result = await authService.login("user@example.com", "SecureP@ssw0rd", "127.0.0.1");
   * if (result.success) {
   *   console.log("Login successful:", result.user);
   * } else {
   *   console.error("Login failed:", result.error);
   * }
   */
  async login(email: string, password: string, ip: string): Promise<LoginResult> {
    // Check rate limiting
    if (isRateLimited(ip)) {
      return {
        success: false,
        error: "auth.service.too_many_attempts",
        rateLimited: true,
        resetTime: this.RATE_LIMIT_RESET_TIME,
      };
    }

    try {
      // Find user by email address
      const user = await this.getUserByEmailWithCache(email);
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash: _, ...userWithoutPassword } = user;

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
   * Registers a new user in the system
   *
   * @since 3.0.0
   * @category Authentication
   *
   * @param {NewUser} userData - The new user's data including email and password
   *
   * @returns {Promise<RegisterResult>} A promise resolving to a RegisterResult object with the registration status
   *
   * @throws {AuthError} If an authentication error occurs
   *
   * @example
   * // Register a new user
   * try {
   *   const result = await authService.register({
   *     email: "newuser@example.com",
   *     password: "SecureP@ssw0rd",
   *     displayName: "New User"
   *   });
   *   if (result.success) {
   *     console.log("Registration successful:", result.user);
   *   } else {
   *     console.error("Registration failed:", result.error);
   *   }
   * } catch (error) {
   *   console.error("Registration error:", error);
   * }
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
      const existingUser = await this.getUserByEmailWithCache(userData.email);
      if (existingUser) {
        return {
          success: false,
          error: "auth.service.email_exists",
        };
      }

      // Create new user
      const newUser = await createUser(userData);

      // Add to cache with type assertion since we know createUser returns a user with password
      this.userCache.set(userData.email, newUser as UserWithPassword);

      // Generate email verification token
      // Import and use the same branded type from db.ts
      const userId = newUser.id as unknown as UserId;
      const verificationToken = await generateEmailVerificationToken(userId);

      // In a real application, an email with the verification link would be sent here
      console.warn(
        `Verification link: https://example.com/verify-email?token=${verificationToken}`
      );

      // Return user without password hash
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash, ...userWithoutPassword } = newUser as UserWithPassword;

      return {
        success: true,
        user: userWithoutPassword,
      };
    } catch (error) {
      console.error("Error during user registration:", error);
      throw new AuthError("An error occurred during registration", "auth.api.general_error");
    }
  }

  /**
   * Verifies a user's email address using a verification token
   *
   * @since 3.0.0
   * @category Authentication
   *
   * @param {string} token - The email verification token sent to the user's email
   * @returns {Promise<boolean>} True if email verification was successful, false otherwise
   *
   * @example
   * // Verify a user's email address
   * const success = await authService.verifyUserEmail("verification-token-from-email");
   * if (success) {
   *   console.log("Email verified successfully");
   * } else {
   *   console.error("Email verification failed");
   * }
   */
  async verifyUserEmail(token: string): Promise<boolean> {
    try {
      // Cast the string token to branded VerificationToken type
      const verificationToken = token as VerificationToken;
      const verified = await verifyEmail(verificationToken);

      // If verification was successful, clear any cached user data
      // to ensure fresh data will be loaded with updated verification status
      if (verified) {
        // Since we don't know which user this is for without querying DB,
        // we'll just invalidate the entire cache in this rare operation
        this.userCache.clear();
      }

      return !!verified;
    } catch (error) {
      console.error("Error during email verification:", error);
      return false;
    }
  }

  /**
   * Requests a password reset for a user
   *
   * @since 3.0.0
   * @category Authentication
   *
   * @param {string} email - The email address of the user requesting password reset
   * @returns {Promise<boolean>} True if reset token was generated successfully, false otherwise
   *
   * @example
   * // Request a password reset
   * const success = await authService.requestPasswordReset("user@example.com");
   * if (success) {
   *   console.log("Password reset requested successfully");
   * } else {
   *   console.error("Failed to request password reset");
   * }
   */
  async requestPasswordReset(email: string): Promise<boolean> {
    try {
      // Clear user from cache if present, as they may reset their password
      this.userCache.delete(email.toLowerCase());

      const resetToken = await generatePasswordResetToken(email);
      if (!resetToken) {
        return false;
      }

      // In a real application, an email with the reset link would be sent here
      console.warn(
        `Password reset link (development only): https://example.com/reset-password?token=${resetToken}`
      );

      return true;
    } catch (error) {
      console.error("Error during password reset request:", error);
      return false;
    }
  }

  /**
   * Resets the password using a reset token
   *
   * @since 3.0.0
   * @category Authentication
   *
   * @param {string} token - The password reset token sent to the user's email
   * @param {string} newPassword - The new password to set
   * @returns {Promise<PasswordResetResult>} Result indicating success or specific error information
   *
   * @example
   * // Reset a user's password with a token
   * const result = await authService.resetUserPassword(
   *   "reset-token-from-email",
   *   "NewSecureP@ssw0rd"
   * );
   * if (result.success) {
   *   console.log("Password reset successfully");
   * } else {
   *   console.error("Password reset failed:", result.error);
   * }
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

      // Cast the string token to branded ResetToken type
      const resetToken = token as ResetToken;
      const success = await resetPassword(resetToken, newPassword);
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
   *
   * @since 3.0.0
   * @category Authentication
   *
   * @param {string} userId - The ID of the user whose password should be changed
   * @param {string} currentPassword - The user's current password (for verification)
   * @param {string} newPassword - The new password to set
   * @returns {Promise<PasswordResetResult>} Result indicating success or specific error information
   *
   * @example
   * // Change a user's password
   * const result = await authService.changePassword(
   *   "user123",
   *   "CurrentP@ssw0rd",
   *   "NewSecureP@ssw0rd"
   * );
   * if (result.success) {
   *   console.log("Password changed successfully");
   * } else {
   *   console.error("Password change failed:", result.error);
   * }
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
          error: "auth.service.new_password_requirements",
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
      // Cast the string userId to branded UserId type
      const userIdBranded = userId as UserId;
      const success = await updatePassword(userIdBranded, newPassword);
      if (!success) {
        return {
          success: false,
          error: "auth.service.password_change_error",
        };
      }

      // Invalidate cache for this user if it exists in the cache
      // This forces a fresh fetch next time the user is requested
      if (user && user.email) {
        this.userCache.delete(user.email.toLowerCase());
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
   * Verifies an access token and checks if it's valid
   *
   * @since 3.0.0
   * @category Authentication
   *
   * @param {string} token - The access token to verify
   * @returns {boolean} True if the token is valid, false otherwise
   *
   * @example
   * // Check if a token is valid
   * const isValid = authService.verifyToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...");
   */
  verifyToken(token: string): boolean {
    return verifyAccessToken(token) !== null;
  }

  /**
   * Refreshes an access token using a refresh token
   *
   * @since 3.0.0
   * @category Authentication
   *
   * @param {string} refreshToken - The refresh token to use for generating a new access token
   * @returns {Promise<TokenRefreshResult>} A result object with the new access token or error information
   *
   * @example
   * // Refresh an access token
   * const result = await authService.refreshToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...");
   * if (result.success) {
   *   console.log("New access token:", result.accessToken);
   * } else {
   *   console.error("Token refresh failed:", result.error);
   * }
   */
  async refreshToken(refreshToken: string): Promise<TokenRefreshResult> {
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
