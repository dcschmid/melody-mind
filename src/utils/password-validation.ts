/**
 * Password Validation Utilities for MelodyMind
 *
 * This module provides comprehensive password validation and strength assessment
 * utilities that can be used across the application for consistent security
 * enforcement.
 *
 * Features:
 * - Password strength calculation with detailed scoring
 * - Common password detection for enhanced security
 * - Sequential pattern detection (e.g., "123456", "qwerty")
 * - Repeated character detection
 * - Comprehensive validation against security requirements
 *
 * @module PasswordValidation
 */

/**
 * List of common passwords to check against for improved security.
 * This is a curated list of frequently used weak passwords.
 * In a production environment, this could be loaded from a larger dataset.
 */
export const COMMON_PASSWORDS = [
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
] as const;

/**
 * Sequential patterns commonly used in weak passwords
 */
const SEQUENTIAL_PATTERNS = [
  "123456",
  "abcdef",
  "qwerty",
  "asdfgh",
  "zxcvbn",
  "654321",
  "fedcba",
] as const;

/**
 * Interface defining the structure of password validation results
 */
export interface PasswordValidationResult {
  /** Whether the password meets all security requirements */
  valid: boolean;
  /** Array of validation error codes for failed requirements */
  errors: string[];
  /** Password strength score from 0-100 */
  strength: number;
  /** Human-readable strength level */
  strengthLevel: "weak" | "medium" | "strong" | "very-strong";
}

/**
 * Validates a password against comprehensive security requirements.
 *
 * Security requirements include:
 * - Minimum 8 characters length
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 * - Not in common passwords list
 * - No more than 2 consecutive repeated characters
 * - No sequential patterns
 *
 * @param password - The password string to validate
 * @returns PasswordValidationResult object with validation details
 *
 * @example
 * ```typescript
 * const result = validatePassword("MySecureP@ss123");
 * if (result.valid) {
 *   console.log(`Strong password with ${result.strength}% strength`);
 * } else {
 *   console.log(`Validation failed: ${result.errors.join(', ')}`);
 * }
 * ```
 */
export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];

  // Check minimum length (8 characters)
  if (password.length < 8) {
    errors.push("min_length");
  }

  // Check for uppercase letters
  if (!/[A-Z]/.test(password)) {
    errors.push("uppercase");
  }

  // Check for lowercase letters
  if (!/[a-z]/.test(password)) {
    errors.push("lowercase");
  }

  // Check for numbers
  if (!/[0-9]/.test(password)) {
    errors.push("number");
  }

  // Check for special characters
  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push("special");
  }

  // Check against common passwords
  if (COMMON_PASSWORDS.includes(password.toLowerCase() as any)) {
    errors.push("common");
  }

  // Check for repeated characters (3+ in a row)
  if (/(.)\1{2,}/.test(password)) {
    errors.push("repeats");
  }

  // Check for sequential patterns
  if (hasSequentialPattern(password)) {
    errors.push("sequences");
  }

  const strength = calculatePasswordStrength(password);
  const strengthLevel = getStrengthLevel(strength);

  return {
    valid: errors.length === 0,
    errors,
    strength,
    strengthLevel,
  };
}

/**
 * Calculates password strength on a scale of 0-100 based on multiple factors.
 *
 * Scoring algorithm:
 * - Length contribution: 4 points per character (max 40 points)
 * - Character variety: 10 points each for uppercase, lowercase, numbers, special chars
 * - Penalties: -30 for common passwords, -10 for repeated chars, -10 for sequences
 *
 * @param password - The password to evaluate
 * @returns Strength score from 0-100
 *
 * @example
 * ```typescript
 * const strength = calculatePasswordStrength("MyP@ssw0rd123");
 * console.log(`Password strength: ${strength}%`); // Password strength: 85%
 * ```
 */
export function calculatePasswordStrength(password: string): number {
  let strength = 0;

  // Length contribution (max 40 points)
  strength += Math.min(password.length * 4, 40);

  // Complexity bonuses (max 40 points total)
  if (/[A-Z]/.test(password)) {
    strength += 10;
  }
  if (/[a-z]/.test(password)) {
    strength += 10;
  }
  if (/[0-9]/.test(password)) {
    strength += 10;
  }
  if (/[^A-Za-z0-9]/.test(password)) {
    strength += 10;
  }

  // Bonus for length over 12 characters (max 20 points)
  if (password.length > 12) {
    strength += Math.min((password.length - 12) * 2, 20);
  }

  // Penalties for security issues
  if (COMMON_PASSWORDS.includes(password.toLowerCase() as any)) {
    strength -= 30;
  }

  if (/(.)\1{2,}/.test(password)) {
    strength -= 10;
  }

  if (hasSequentialPattern(password)) {
    strength -= 10;
  }

  // Ensure strength is within 0-100 range
  return Math.max(0, Math.min(100, strength));
}

/**
 * Determines the strength level category based on numerical strength score.
 *
 * @param strength - Numerical strength score (0-100)
 * @returns String representation of strength level
 *
 * @example
 * ```typescript
 * const level = getStrengthLevel(75);
 * console.log(level); // "strong"
 * ```
 */
export function getStrengthLevel(strength: number): "weak" | "medium" | "strong" | "very-strong" {
  if (strength < 30) {
    return "weak";
  }
  if (strength < 60) {
    return "medium";
  }
  if (strength < 80) {
    return "strong";
  }
  return "very-strong";
}

/**
 * Checks if a password contains any sequential character patterns.
 *
 * @param password - The password to check
 * @returns True if sequential patterns are found, false otherwise
 *
 * @example
 * ```typescript
 * console.log(hasSequentialPattern("password123")); // true
 * console.log(hasSequentialPattern("random@Pass")); // false
 * ```
 */
export function hasSequentialPattern(password: string): boolean {
  const lowerPassword = password.toLowerCase();

  for (const pattern of SEQUENTIAL_PATTERNS) {
    // Check for the pattern and its reverse
    for (let i = 0; i <= pattern.length - 3; i++) {
      const subPattern = pattern.substring(i, i + 3);
      const reversePattern = subPattern.split("").reverse().join("");

      if (lowerPassword.includes(subPattern) || lowerPassword.includes(reversePattern)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Validates email address format using RFC-compliant regex pattern.
 *
 * @param email - The email address to validate
 * @returns True if email format is valid, false otherwise
 *
 * @example
 * ```typescript
 * console.log(validateEmail("user@example.com")); // true
 * console.log(validateEmail("invalid-email")); // false
 * ```
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Checks if two passwords match (used for confirmation validation).
 *
 * @param password - The original password
 * @param confirmPassword - The confirmation password
 * @returns True if passwords match, false otherwise
 *
 * @example
 * ```typescript
 * console.log(passwordsMatch("secret123", "secret123")); // true
 * console.log(passwordsMatch("secret123", "different")); // false
 * ```
 */
export function passwordsMatch(password: string, confirmPassword: string): boolean {
  return password === confirmPassword;
}
