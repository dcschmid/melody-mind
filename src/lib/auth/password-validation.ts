/**
 * @file Password validation utilities for the MelodyMind authentication system
 * @description Provides functions for password validation, strength calculation, and secure password generation
 * @since 3.0.0
 * @category Authentication
 */

/**
 * Strong Password type using branded types for better type safety
 * This prevents accidental assignment of string to a Password type
 */
export type Password = string & { readonly __brand: "Password" };

/**
 * Password strength as a branded number type
 * Ensures that only valid strength calculations (0-100) can be assigned
 */
export type PasswordStrength = number & { readonly __brand: "PasswordStrength" };

/**
 * Error message keys for password validation
 * Using template literal types for better type checking
 */
export type PasswordErrorKey =
  | `auth.password.min_length_error`
  | `auth.password.uppercase_error`
  | `auth.password.lowercase_error`
  | `auth.password.number_error`
  | `auth.password.special_char_error`
  | `auth.password.common_password`
  | `auth.password.repeats_error`
  | `auth.password.sequence_error`
  | `auth.password.match_error`;

/**
 * Parameters needed for password error translation
 */
export type PasswordErrorParams<K extends PasswordErrorKey> =
  K extends "auth.password.min_length_error" ? { minLength: number } : Record<string, never>;

/**
 * Custom error class for password validation failures
 */
export class PasswordValidationError extends Error {
  /**
   * The errors that occurred during validation
   */
  public readonly errors: readonly PasswordErrorKey[];

  /**
   * Creates a new password validation error
   *
   * @param {PasswordErrorKey[]} errors - The validation errors that occurred
   */
  constructor(errors: PasswordErrorKey[]) {
    super(`Password validation failed: ${errors.join(", ")}`);
    this.name = "PasswordValidationError";
    this.errors = Object.freeze([...errors]);
  }
}

/**
 * Type guard to check if an error is a PasswordValidationError
 *
 * @since 3.0.0
 * @category Type Guards
 *
 * @param {unknown} error - The error to check
 * @returns {boolean} Whether the error is a PasswordValidationError
 */
export function isPasswordValidationError(error: unknown): error is PasswordValidationError {
  return error instanceof PasswordValidationError;
}

/**
 * Password configuration parameters
 */
export interface PasswordConfig {
  /** Minimum required password length */
  minLength: number;
  /** Whether uppercase letters are required */
  requireUppercase: boolean;
  /** Whether lowercase letters are required */
  requireLowercase: boolean;
  /** Whether numbers are required */
  requireNumber: boolean;
  /** Whether special characters are required */
  requireSpecialChar: boolean;
}

// List of commonly used passwords (abbreviated for this example)
// Using Set for O(1) lookup performance instead of array
// In a real application, a more comprehensive list should be used
const COMMON_PASSWORDS: ReadonlySet<string> = new Set([
  "password",
  "password123",
  "123456",
  "12345678",
  "qwerty",
  "admin",
  "welcome",
  "letmein",
  "monkey",
  "abc123",
  "football",
  "iloveyou",
  "trustno1",
  "sunshine",
  "master",
  "welcome1",
  "shadow",
  "ashley",
  "baseball",
  "access",
  "michael",
  "superman",
  "batman",
  "starwars",
]);

// Common sequences to check against
const SEQUENCE_PATTERNS: ReadonlyArray<string> = Object.freeze([
  "123456",
  "abcdef",
  "qwerty",
  "asdfgh",
]);

// Default password configuration
const DEFAULT_PASSWORD_CONFIG: Readonly<PasswordConfig> = Object.freeze({
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecialChar: true,
});

/**
 * Type definition for password validation results
 */
export interface ValidationResult {
  /** Whether the password meets all requirements */
  valid: boolean;
  /** Array of error message keys for any failed validation criteria */
  errors: PasswordErrorKey[];
}

/**
 * Generic memoization helper function with strict type safety
 *
 * @since 3.0.0
 * @category Utilities
 *
 * @template Args - The types of the function arguments
 * @template Result - The return type of the function
 * @param {(...args: Args) => Result} fn - The function to memoize
 * @param {Object} [options] - Memoization options
 * @param {number} [options.maxCacheSize=100] - Maximum number of cached results
 * @param {(key: string) => boolean} [options.shouldCache] - Function to determine if a result should be cached
 * @returns {(...args: Args) => Result} The memoized function
 */
function memoize<Args extends unknown[], Result>(
  fn: (...args: Args) => Result,
  options?: {
    maxCacheSize?: number;
    shouldCache?: (key: string) => boolean;
  }
): (...args: Args) => Result {
  const { maxCacheSize = 100, shouldCache = (_key: string): boolean => true } = options ?? {};
  const cache = new Map<string, Result>();

  return (...args: Args): Result => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = fn(...args);

    if (shouldCache(key)) {
      if (cache.size >= maxCacheSize) {
        // FIFO cache eviction policy - remove oldest entry
        const firstKey = cache.keys().next().value;
        if (firstKey !== undefined) {
          cache.delete(firstKey);
        }
      }
      cache.set(key, result);
    }

    return result;
  };
}

/**
 * Validates a specific aspect of a password
 *
 * @param {string} password - The password to validate
 * @param {RegExp} regex - The regex pattern to test against
 * @param {boolean} requirement - Whether this requirement is enabled
 * @param {PasswordErrorKey} errorKey - The error key to return if validation fails
 * @returns {PasswordErrorKey | null} The error key or null if validation passes
 */
function validatePasswordCriteria(
  password: string,
  regex: RegExp,
  requirement: boolean,
  errorKey: PasswordErrorKey
): PasswordErrorKey | null {
  if (requirement && !regex.test(password)) {
    return errorKey;
  }
  return null;
}

/**
 * Validates a password against multiple security criteria
 *
 * @since 3.0.0
 * @category Authentication
 *
 * @param {string} password - The password to validate
 * @param {Partial<PasswordConfig>} [config] - Optional custom password configuration
 * @returns {ValidationResult} Validation result with validity status and any error messages
 *
 * @example
 * // Validate with default configuration
 * const result = validatePassword("Weak123!");
 * if (!result.valid) {
 *   console.log(result.errors); // Display validation errors
 * }
 *
 * @example
 * // Validate with custom configuration
 * const customResult = validatePassword("simple", {
 *   minLength: 6,
 *   requireUppercase: false
 * });
 */
export function validatePassword(
  password: string,
  config?: Partial<PasswordConfig>
): ValidationResult {
  // Merge default config with any provided custom settings
  const finalConfig: PasswordConfig = {
    ...DEFAULT_PASSWORD_CONFIG,
    ...config,
  };

  const errors: PasswordErrorKey[] = [];

  // Check minimum length requirement
  if (password.length < finalConfig.minLength) {
    errors.push(`auth.password.min_length_error`);
  }

  // Check various criteria using dedicated helper function
  const criteriaChecks: Array<PasswordErrorKey | null> = [
    validatePasswordCriteria(
      password,
      /[A-Z]/,
      finalConfig.requireUppercase,
      "auth.password.uppercase_error"
    ),
    validatePasswordCriteria(
      password,
      /[a-z]/,
      finalConfig.requireLowercase,
      "auth.password.lowercase_error"
    ),
    validatePasswordCriteria(
      password,
      /[0-9]/,
      finalConfig.requireNumber,
      "auth.password.number_error"
    ),
    validatePasswordCriteria(
      password,
      /[^A-Za-z0-9]/,
      finalConfig.requireSpecialChar,
      "auth.password.special_char_error"
    ),
  ];

  // Add any failed criteria to errors
  errors.push(...criteriaChecks.filter((error): error is PasswordErrorKey => error !== null));

  // Check against common password dictionary
  if (COMMON_PASSWORDS.has(password.toLowerCase())) {
    errors.push("auth.password.common_password");
  }

  // Check for character repetition (3+ identical characters in sequence)
  if (/(.)\1{2,}/.test(password)) {
    errors.push("auth.password.repeats_error");
  }

  // Check for sequential patterns
  const lowerPassword = password.toLowerCase();
  for (const seq of SEQUENCE_PATTERNS) {
    for (let i = 0; i < seq.length - 2; i++) {
      const subSeq = seq.substring(i, i + 3);
      if (lowerPassword.includes(subSeq)) {
        errors.push("auth.password.sequence_error");
        break;
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validates that two passwords match (for confirmation scenarios)
 *
 * @since 3.0.0
 * @category Authentication
 *
 * @param {string} password - The original password
 * @param {string} confirmPassword - The confirmation password
 * @returns {ValidationResult} Validation result with validity status
 *
 * @example
 * // Check if passwords match
 * const matchResult = validatePasswordMatch("securePass123!", "securePass123!");
 * if (!matchResult.valid) {
 *   console.log("Passwords don't match");
 * }
 */
export function validatePasswordMatch(password: string, confirmPassword: string): ValidationResult {
  if (password === confirmPassword) {
    return { valid: true, errors: [] };
  }

  return {
    valid: false,
    errors: ["auth.password.match_error"],
  };
}

/**
 * Character sets for password generation
 */
const CHAR_SETS = Object.freeze({
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  special: "!@#$%^&*()-_=+[]{}|;:,.<>?",
});

/**
 * Options for password generation
 */
export interface PasswordGenerationOptions {
  /** The desired password length */
  length?: number;
  /** Include uppercase characters */
  includeUppercase?: boolean;
  /** Include lowercase characters */
  includeLowercase?: boolean;
  /** Include numeric characters */
  includeNumbers?: boolean;
  /** Include special characters */
  includeSpecial?: boolean;
}

/**
 * Generates a cryptographically secure random password
 *
 * @since 3.0.0
 * @category Authentication
 *
 * @param {PasswordGenerationOptions} [options] - Password generation options
 * @returns {Password} A secure password meeting all security requirements
 *
 * @example
 * // Generate default secure password (16 characters)
 * const safePassword = generateSecurePassword();
 *
 * @example
 * // Generate custom password (20 characters, no special chars)
 * const customPassword = generateSecurePassword({
 *   length: 20,
 *   includeSpecial: false
 * });
 */
export function generateSecurePassword(options?: PasswordGenerationOptions): Password {
  const {
    length = 16,
    includeUppercase = true,
    includeLowercase = true,
    includeNumbers = true,
    includeSpecial = true,
  } = options ?? {};

  // Build character set based on options
  let charPool = "";
  const requiredChars: string[] = [];

  if (includeUppercase) {
    charPool += CHAR_SETS.uppercase;
    requiredChars.push(getRandomChar(CHAR_SETS.uppercase));
  }

  if (includeLowercase) {
    charPool += CHAR_SETS.lowercase;
    requiredChars.push(getRandomChar(CHAR_SETS.lowercase));
  }

  if (includeNumbers) {
    charPool += CHAR_SETS.numbers;
    requiredChars.push(getRandomChar(CHAR_SETS.numbers));
  }

  if (includeSpecial) {
    charPool += CHAR_SETS.special;
    requiredChars.push(getRandomChar(CHAR_SETS.special));
  }

  // If no character types were selected, use lowercase as fallback
  if (charPool.length === 0) {
    charPool = CHAR_SETS.lowercase;
    requiredChars.push(getRandomChar(CHAR_SETS.lowercase));
  }

  // Start with required characters
  let password = requiredChars.join("");

  // Fill the rest of the password with random characters
  for (let i = password.length; i < length; i++) {
    password += getRandomChar(charPool);
  }

  // Shuffle the characters to increase randomness
  const shuffled = password
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");

  // Cast to branded type
  return shuffled as Password;
}

/**
 * Gets a random character from a string
 *
 * @param {string} charSet - The set of characters to choose from
 * @returns {string} A random character from the set
 */
function getRandomChar(charSet: string): string {
  return charSet.charAt(Math.floor(Math.random() * charSet.length));
}

/**
 * Password strength levels
 */
export enum PasswordStrengthLevel {
  VeryWeak = "very-weak",
  Weak = "weak",
  Moderate = "moderate",
  Strong = "strong",
  VeryStrong = "very-strong",
}

/**
 * Result of password strength calculation
 */
export interface PasswordStrengthResult {
  /** Numerical strength score from 0-100 */
  score: PasswordStrength;
  /** Descriptive strength level */
  level: PasswordStrengthLevel;
  /** Detailed breakdown of strength calculation */
  details: {
    /** Points from password length */
    lengthScore: number;
    /** Points from character diversity */
    complexityScore: number;
    /** Deductions for common patterns */
    penalties: number;
  };
}

/**
 * Calculates the complexity score based on character types in the password
 *
 * @param {string} password - The password to analyze
 * @returns {number} The complexity score (0-40)
 */
function calculateComplexityScore(password: string): number {
  let score = 0;

  if (/[A-Z]/.test(password)) {
    score += 10;
  }
  if (/[a-z]/.test(password)) {
    score += 10;
  }
  if (/[0-9]/.test(password)) {
    score += 10;
  }
  if (/[^A-Za-z0-9]/.test(password)) {
    score += 10;
  }

  return score;
}

/**
 * Calculates penalties for common patterns in the password
 *
 * @param {string} password - The password to analyze
 * @returns {number} The penalty score
 */
function calculatePenalties(password: string): number {
  let penalties = 0;

  // Deductions for common passwords
  if (COMMON_PASSWORDS.has(password.toLowerCase())) {
    penalties += 30;
  }

  // Deductions for character repetitions
  if (/(.)\1{2,}/.test(password)) {
    penalties += 10;
  }

  // Deductions for sequential patterns
  const lowerPassword = password.toLowerCase();
  for (const seq of SEQUENCE_PATTERNS) {
    for (let i = 0; i < seq.length - 2; i++) {
      const subSeq = seq.substring(i, i + 3);
      if (lowerPassword.includes(subSeq)) {
        penalties += 10;
        break;
      }
    }
  }

  return penalties;
}

/**
 * Determines the strength level based on the numerical score
 *
 * @param {number} score - The numerical password strength score
 * @returns {PasswordStrengthLevel} The corresponding strength level
 */
function getStrengthLevel(score: number): PasswordStrengthLevel {
  if (score < 20) {
    return PasswordStrengthLevel.VeryWeak;
  }
  if (score < 40) {
    return PasswordStrengthLevel.Weak;
  }
  if (score < 60) {
    return PasswordStrengthLevel.Moderate;
  }
  if (score < 80) {
    return PasswordStrengthLevel.Strong;
  }
  return PasswordStrengthLevel.VeryStrong;
}

// Use the generic memoize helper for password strength calculation
const calculatePasswordStrengthInternal = (password: string): PasswordStrengthResult => {
  const lengthScore = Math.min(password.length * 4, 40);
  const complexityScore = calculateComplexityScore(password);
  const penalties = calculatePenalties(password);

  // Calculate final score
  const totalScore = Math.max(0, Math.min(100, lengthScore + complexityScore - penalties));
  const level = getStrengthLevel(totalScore);

  return {
    score: totalScore as PasswordStrength,
    level,
    details: {
      lengthScore,
      complexityScore,
      penalties,
    },
  };
};

/**
 * Calculates the strength of a password and provides a detailed breakdown
 * This function is memoized for performance when repeatedly checking the same password
 *
 * The strength calculation considers:
 * - Password length (up to 40 points)
 * - Character complexity (uppercase, lowercase, numbers, special chars - up to 40 points)
 * - Deductions for common passwords, repetitions, and sequences
 *
 * @since 3.0.0
 * @category Authentication
 *
 * @param {string} password - The password to evaluate
 * @returns {PasswordStrengthResult} Detailed password strength assessment
 *
 * @example
 * const result = calculatePasswordStrength("Example123!");
 * console.log(`Password strength: ${result.score}/100 (${result.level})`);
 * console.log(`Length contribution: ${result.details.lengthScore}`);
 */
export const calculatePasswordStrength = memoize(calculatePasswordStrengthInternal, {
  maxCacheSize: 100,
  // Don't cache very short passwords to avoid cache pollution
  shouldCache: (key: string): boolean => {
    const password = JSON.parse(key)[0];
    return typeof password === "string" && password.length > 3;
  },
});

/**
 * Type guard to check if a string is a strong password
 *
 * @since 3.0.0
 * @category Type Guards
 *
 * @param {string} value - The value to check
 * @returns {boolean} Whether the value is a strong password
 *
 * @example
 * if (isStrongPassword(userInput)) {
 *   // TypeScript knows userInput is a Password type here
 *   savePassword(userInput);
 * }
 */
export function isStrongPassword(value: string): value is Password {
  const result = validatePassword(value);
  return result.valid;
}

/**
 * Creates a type-safe Password from a string
 * Throws an error if the password does not meet requirements
 *
 * @since 3.0.0
 * @category Authentication
 *
 * @param {string} value - The password string to validate
 * @returns {Password} The validated Password
 * @throws {PasswordValidationError} If the password fails validation
 *
 * @example
 * try {
 *   const safePassword = createPassword(userInput);
 *   saveToDatabase(safePassword);
 * } catch (error) {
 *   if (isPasswordValidationError(error)) {
 *     console.error("Password validation errors:", error.errors);
 *   } else {
 *     console.error("Unexpected error:", error.message);
 *   }
 * }
 */
export function createPassword(value: string): Password {
  const validation = validatePassword(value);
  if (!validation.valid) {
    throw new PasswordValidationError(validation.errors);
  }
  return value as Password;
}

/**
 * Checks if a password is strong enough for the given security level
 *
 * @since 3.0.0
 * @category Authentication
 *
 * @param {string} password - The password to check
 * @param {PasswordStrengthLevel} [minimumLevel=PasswordStrengthLevel.Strong] - The minimum required strength level
 * @returns {boolean} Whether the password meets the minimum strength requirement
 *
 * @example
 * if (isPasswordStrongEnough(userPassword, PasswordStrengthLevel.VeryStrong)) {
 *   console.log("Password is very strong!");
 * } else {
 *   console.log("Please choose a stronger password");
 * }
 */
export function isPasswordStrongEnough(
  password: string,
  minimumLevel: PasswordStrengthLevel = PasswordStrengthLevel.Strong
): boolean {
  const { level } = calculatePasswordStrength(password);

  // Convert enum strings to a numeric value for comparison
  const levelValues: Record<PasswordStrengthLevel, number> = {
    [PasswordStrengthLevel.VeryWeak]: 1,
    [PasswordStrengthLevel.Weak]: 2,
    [PasswordStrengthLevel.Moderate]: 3,
    [PasswordStrengthLevel.Strong]: 4,
    [PasswordStrengthLevel.VeryStrong]: 5,
  };

  return levelValues[level] >= levelValues[minimumLevel];
}
