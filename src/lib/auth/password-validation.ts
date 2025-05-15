/**
 * @file Password validation utilities for the MelodyMind authentication system
 * @description Provides functions for password validation, strength calculation, and secure password generation
 */

// List of commonly used passwords (abbreviated for this example)
// In a real application, a more comprehensive list should be used
const COMMON_PASSWORDS = [
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
];

// Constants for password requirements
const MIN_PASSWORD_LENGTH = 8;
const REQUIRE_UPPERCASE = true;
const REQUIRE_LOWERCASE = true;
const REQUIRE_NUMBER = true;
const REQUIRE_SPECIAL_CHAR = true;

/**
 * Type definition for password validation results
 * @typedef {Object} ValidationResult
 * @property {boolean} valid - Whether the password meets all requirements
 * @property {string[]} errors - Array of error message keys for any failed validation criteria
 */
export type ValidationResult = {
  valid: boolean;
  errors: string[];
};

/**
 * Validates a password against multiple security criteria
 *
 * @param {string} password - The password to validate
 * @returns {ValidationResult} Validation result with validity status and any error messages
 *
 * @example
 * const result = validatePassword("Weak123!");
 * if (!result.valid) {
 *   console.log(result.errors); // Display validation errors
 * }
 */
export function validatePassword(password: string): ValidationResult {
  const errors: string[] = [];

  // Check minimum length requirement
  if (password.length < MIN_PASSWORD_LENGTH) {
    errors.push(`auth.password.min_length_error`);
  }

  // Check for uppercase characters
  if (REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
    errors.push("auth.password.uppercase_error");
  }

  // Check for lowercase characters
  if (REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
    errors.push("auth.password.lowercase_error");
  }

  // Check for numeric characters
  if (REQUIRE_NUMBER && !/[0-9]/.test(password)) {
    errors.push("auth.password.number_error");
  }

  // Check for special characters
  if (REQUIRE_SPECIAL_CHAR && !/[^A-Za-z0-9]/.test(password)) {
    errors.push("auth.password.special_char_error");
  }

  // Check against common password dictionary
  if (COMMON_PASSWORDS.includes(password.toLowerCase())) {
    errors.push("auth.password.common_password");
  }

  // Check for character repetition (3+ identical characters in sequence)
  if (/(.)\1{2,}/.test(password)) {
    errors.push("auth.password.repeats_error");
  }

  // Check for sequential patterns
  const sequences = ["123456", "abcdef", "qwerty", "asdfgh"];
  for (const seq of sequences) {
    for (let i = 0; i < seq.length - 2; i++) {
      const subSeq = seq.substring(i, i + 3);
      if (password.toLowerCase().includes(subSeq)) {
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
 * Generates a cryptographically secure random password
 *
 * @param {number} length - The desired password length (default: 16)
 * @returns {string} A secure password meeting all security requirements
 *
 * @example
 * const safePassword = generateSecurePassword();
 * const customLengthPassword = generateSecurePassword(20);
 */
export function generateSecurePassword(length = 16): string {
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const numberChars = "0123456789";
  const specialChars = "!@#$%^&*()-_=+[]{}|;:,.<>?";

  const allChars = uppercaseChars + lowercaseChars + numberChars + specialChars;

  // Ensure the password contains at least one character from each category
  let password = "";
  password += uppercaseChars.charAt(Math.floor(Math.random() * uppercaseChars.length));
  password += lowercaseChars.charAt(Math.floor(Math.random() * lowercaseChars.length));
  password += numberChars.charAt(Math.floor(Math.random() * numberChars.length));
  password += specialChars.charAt(Math.floor(Math.random() * specialChars.length));

  // Fill the rest of the password with random characters
  for (let i = password.length; i < length; i++) {
    password += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }

  // Shuffle the characters to increase randomness
  return password
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");
}

/**
 * Calculates the strength of a password on a scale of 0-100
 *
 * The strength calculation considers:
 * - Password length (up to 40 points)
 * - Character complexity (uppercase, lowercase, numbers, special chars - up to 40 points)
 * - Deductions for common passwords, repetitions, and sequences
 *
 * @param {string} password - The password to evaluate
 * @returns {number} Password strength score from 0 (very weak) to 100 (very strong)
 *
 * @example
 * const strength = calculatePasswordStrength("Example123!");
 * console.log(`Password strength: ${strength}/100`);
 */
export function calculatePasswordStrength(password: string): number {
  let strength = 0;

  // Length contribution (max 40 points)
  strength += Math.min(password.length * 4, 40);

  // Complexity contribution (max 40 points)
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

  // Deductions for common passwords
  if (COMMON_PASSWORDS.includes(password.toLowerCase())) {
    strength -= 30;
  }

  // Deductions for character repetitions
  if (/(.)\1{2,}/.test(password)) {
    strength -= 10;
  }

  // Deductions for sequential patterns
  const sequences = ["123456", "abcdef", "qwerty", "asdfgh"];
  for (const seq of sequences) {
    for (let i = 0; i < seq.length - 2; i++) {
      const subSeq = seq.substring(i, i + 3);
      if (password.toLowerCase().includes(subSeq)) {
        strength -= 10;
        break;
      }
    }
  }

  // Constrain the final strength to 0-100 range
  return Math.max(0, Math.min(100, strength));
}
