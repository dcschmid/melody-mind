/**
 * Checks if the given string is a valid email address.
 * The email address must contain at least one '@' character.
 * @param {string} email - The email address to check.
 * @returns {boolean} True if the email address is valid, false otherwise.
 */
export function isValidEmail(email: string): boolean {
	return email.includes('@');
}
