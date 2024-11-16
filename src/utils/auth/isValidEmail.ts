/**
 * Validates if the provided string is a valid email address.
 * Validates the format according to RFC 5322 standards (simplified).
 * Checks for:
 * - Valid characters in local part (before @)
 * - Valid domain part (after @)
 * - Top-level domain with minimum length of 2 characters
 * - Correct structure with exactly one @ symbol
 *
 * @param {string} email - The email address to validate
 * @returns {boolean} True if the email address is valid, false otherwise
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}
