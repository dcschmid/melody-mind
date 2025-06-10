/**
 * Password Reset Form Utilities for MelodyMind
 *
 * This module contains all utility functions for password validation,
 * strength calculation, and form handling used by the PasswordResetForm component.
 *
 * Features:
 * - Password strength calculation with comprehensive validation
 * - Common password detection
 * - Email validation with domain suggestions
 * - Form validation utilities
 * - WCAG AAA accessibility support
 *
 * @module PasswordResetUtils
 */

/**
 * Interface for password validation result
 */
export interface PasswordValidationResult {
  valid: boolean;
  score: number;
  suggestions: string[];
  errors: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
    common: boolean;
    repeats: boolean;
    sequences: boolean;
  };
}

/**
 * Interface for password strength calculation result
 */
export interface PasswordStrengthResult {
  score: number;
  level: "weak" | "medium" | "strong" | "very-strong";
  percentage: number;
}

/**
 * Common passwords for detection (subset for performance)
 */
const COMMON_PASSWORDS = [
  "password",
  "123456",
  "123456789",
  "guest",
  "qwerty",
  "12345678",
  "111111",
  "12345",
  "col123456",
  "123123",
  "1234567",
  "1234",
  "1234567890",
  "000000",
  "555555",
  "666666",
  "123321",
  "654321",
  "7777777",
  "123",
  "D1lakiss",
  "777777",
  "110110",
  "1111111",
  "11111111",
  "121212",
  "Gizli",
  "abc123",
  "112233",
  "azerty",
  "159753",
  "1q2w3e4r",
  "54321",
  "pass@123",
  "1111",
  "password1",
  "qwerty123",
  "Iloveyou",
  "Porcodio",
  "Maradona",
  "hello",
  "12341234",
  "16041984",
  "qwerty1",
  "qwertyuiop",
  "123654",
  "987654321",
  "mypass",
  "love123",
  "1qaz2wsx",
  "password123",
  "admin",
  "welcome",
  "monkey",
  "login",
  "abc123456",
  "princess",
  "dragon",
  "qwer1234",
  "sunshine",
  "master",
  "hottie",
  "loveme",
  "zaq12wsx",
  "password1234",
  "foobar",
  "superman",
  "charlie",
  "696969",
  "mustang",
  "michael",
  "shadow",
  "1q2w3e",
  "Football",
  "1234qwer",
  "freedom",
  "jordan23",
  "aaaaaa",
  "123abc",
  "secret",
];

/**
 * Validate password against comprehensive security requirements
 * @param password - Password to validate
 * @returns Password validation result
 */
export function validatePassword(password: string): PasswordValidationResult {
  const errors = {
    length: password.length < 8,
    uppercase: !/[A-Z]/.test(password),
    lowercase: !/[a-z]/.test(password),
    number: !/[0-9]/.test(password),
    special: !/[!@#$%^&*(),.?":{}|<>]/.test(password),
    common: isCommonPassword(password),
    repeats: hasRepeatingCharacters(password),
    sequences: hasSequentialCharacters(password),
  };

  const valid = !Object.values(errors).some((error) => error);
  const score = calculatePasswordScore(password, errors);
  const suggestions = generatePasswordSuggestions(password, errors);

  return {
    valid,
    score,
    suggestions,
    errors,
  };
}

/**
 * Calculate password strength score
 * @param password - Password to evaluate
 * @param errors - Validation errors object
 * @returns Password strength score (0-100)
 */
function calculatePasswordScore(password: string, errors: any): number {
  let score = 0;

  // Base score for length
  if (password.length >= 8) {
    score += 25;
  }
  if (password.length >= 12) {
    score += 10;
  }
  if (password.length >= 16) {
    score += 10;
  }

  // Character variety
  if (!errors.uppercase) {
    score += 15;
  }
  if (!errors.lowercase) {
    score += 15;
  }
  if (!errors.number) {
    score += 15;
  }
  if (!errors.special) {
    score += 15;
  }

  // Security checks
  if (!errors.common) {
    score += 5;
  }
  if (!errors.repeats) {
    score += 5;
  }
  if (!errors.sequences) {
    score += 5;
  }

  return Math.min(100, score);
}

/**
 * Generate password strength result with level classification
 * @param password - Password to evaluate
 * @returns Password strength result
 */
export function calculatePasswordStrength(password: string): PasswordStrengthResult {
  const validation = validatePassword(password);
  const score = validation.score;

  let level: "weak" | "medium" | "strong" | "very-strong";
  if (score < 30) {
    level = "weak";
  } else if (score < 60) {
    level = "medium";
  } else if (score < 80) {
    level = "strong";
  } else {
    level = "very-strong";
  }

  return {
    score,
    level,
    percentage: score,
  };
}

/**
 * Check if password is in common passwords list
 * @param password - Password to check
 * @returns True if password is common
 */
function isCommonPassword(password: string): boolean {
  const lowerPassword = password.toLowerCase();
  return COMMON_PASSWORDS.some(
    (common) =>
      lowerPassword === common.toLowerCase() ||
      lowerPassword.includes(common.toLowerCase()) ||
      common.toLowerCase().includes(lowerPassword)
  );
}

/**
 * Check for repeating characters (3 or more consecutive)
 * @param password - Password to check
 * @returns True if has repeating characters
 */
function hasRepeatingCharacters(password: string): boolean {
  for (let i = 0; i < password.length - 2; i++) {
    if (password[i] === password[i + 1] && password[i] === password[i + 2]) {
      return true;
    }
  }
  return false;
}

/**
 * Check for sequential characters (abc, 123, etc.)
 * @param password - Password to check
 * @returns True if has sequential characters
 */
function hasSequentialCharacters(password: string): boolean {
  const sequences = [
    "abcdefghijklmnopqrstuvwxyz",
    "qwertyuiopasdfghjklzxcvbnm",
    "1234567890",
    "0987654321",
  ];

  for (const sequence of sequences) {
    for (let i = 0; i < sequence.length - 2; i++) {
      const subseq = sequence.substring(i, i + 3);
      if (password.toLowerCase().includes(subseq)) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Generate helpful password suggestions
 * @param password - Current password
 * @param errors - Validation errors
 * @returns Array of suggestion strings
 */
function generatePasswordSuggestions(password: string, errors: any): string[] {
  const suggestions: string[] = [];

  if (errors.length) {
    suggestions.push("Make it at least 8 characters long");
  }
  if (errors.uppercase) {
    suggestions.push("Add an uppercase letter (A-Z)");
  }
  if (errors.lowercase) {
    suggestions.push("Add a lowercase letter (a-z)");
  }
  if (errors.number) {
    suggestions.push("Add a number (0-9)");
  }
  if (errors.special) {
    suggestions.push("Add a special character (!@#$%^&*)");
  }
  if (errors.common) {
    suggestions.push("Avoid common passwords");
  }
  if (errors.repeats) {
    suggestions.push("Avoid repeating characters");
  }
  if (errors.sequences) {
    suggestions.push("Avoid sequential characters");
  }

  return suggestions;
}

/**
 * Validate email address format
 * @param email - Email to validate
 * @returns True if valid email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Provide email suggestions for common typos
 * @param email - Email to check
 * @returns Suggestion string or empty string
 */
export function provideEmailSuggestion(email: string): string {
  if (!email.includes("@")) {
    return "";
  }

  const [, domain] = email.split("@");
  if (!domain) {
    return "";
  }

  const commonDomains = [
    "gmail.com",
    "yahoo.com",
    "hotmail.com",
    "outlook.com",
    "icloud.com",
    "aol.com",
    "live.com",
    "msn.com",
    "web.de",
    "gmx.de",
    "t-online.de",
    "freenet.de",
  ];

  const closestDomain = findClosestDomain(domain, commonDomains);

  if (closestDomain && closestDomain !== domain) {
    return `Did you mean ${email.split("@")[0]}@${closestDomain}?`;
  }

  return "";
}

/**
 * Find closest domain using Levenshtein distance
 * @param input - Input domain
 * @param domains - Array of common domains
 * @returns Closest domain or null
 */
function findClosestDomain(input: string, domains: string[]): string | null {
  let closestDomain = null;
  let minDistance = Infinity;

  domains.forEach((domain) => {
    const distance = levenshteinDistance(input, domain);
    if (distance < minDistance && distance <= 2) {
      // Allow up to 2 character differences
      minDistance = distance;
      closestDomain = domain;
    }
  });

  return closestDomain;
}

/**
 * Calculate Levenshtein distance between two strings
 * @param a - First string
 * @param b - Second string
 * @returns Edit distance
 */
function levenshteinDistance(a: string, b: string): number {
  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j] + 1 // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}
