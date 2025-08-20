/**
 * Generate a unique ID for guest users
 * Uses timestamp + random string for uniqueness
 */
export function generateId(): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `${timestamp}_${randomStr}`;
}

/**
 * Generate a more secure ID using crypto if available
 * Falls back to timestamp + random for older browsers
 */
export function generateSecureId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return generateId();
}
