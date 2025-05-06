import crypto from "crypto";

/**
 * Constants for CSRF settings
 */
// Secret key used for HMAC generation - in production, this should be set via environment variable
const CSRF_SECRET = process.env.CSRF_SECRET || "melody-mind-csrf-secret";
// Token expiry time: 24 hours in milliseconds
const CSRF_TOKEN_EXPIRY = 24 * 60 * 60 * 1000;

/**
 * Interface for CSRF token structure
 */
export type CsrfToken = {
  /** The full CSRF token string */
  token: string;
  /** Expiration timestamp in milliseconds since epoch */
  expires: number;
};

/**
 * Generates a secure CSRF token
 *
 * Creates a token consisting of:
 * - Random bytes for uniqueness
 * - Expiration timestamp
 * - HMAC signature for validation
 *
 * @returns {CsrfToken} Object containing the token and its expiration timestamp
 */
export function generateCsrfToken(): CsrfToken {
  const randomBytes = crypto.randomBytes(32).toString("hex");
  const expires = Date.now() + CSRF_TOKEN_EXPIRY;

  // Create an HMAC with the secret and expiration date
  const hmac = crypto.createHmac("sha256", CSRF_SECRET);
  hmac.update(`${randomBytes}:${expires}`);
  const signature = hmac.digest("hex");

  // The token consists of random bytes, expiration date, and signature
  const token = `${randomBytes}:${expires}:${signature}`;

  return {
    token,
    expires,
  };
}

/**
 * Verifies a CSRF token for validity
 *
 * Verifies that:
 * 1. The token has the correct format
 * 2. The token has not expired
 * 3. The signature is valid
 *
 * Uses constant time comparison to prevent timing attacks
 *
 * @param {string} token - The CSRF token to verify
 * @returns {boolean} True if the token is valid, false otherwise
 */
export function verifyCsrfToken(token: string): boolean {
  try {
    // Split the token into its components
    const [randomBytes, expiresStr, receivedSignature] = token.split(":");
    const expires = parseInt(expiresStr, 10);

    // Check if the token has expired
    if (Date.now() > expires) {
      return false;
    }

    // Calculate the expected signature
    const hmac = crypto.createHmac("sha256", CSRF_SECRET);
    hmac.update(`${randomBytes}:${expires}`);
    const expectedSignature = hmac.digest("hex");

    // Compare signatures using a secure method
    // Since timingSafeEqual may have buffer issues, we use a simpler but secure method
    const receivedBuffer = Buffer.from(receivedSignature, "hex");
    const expectedBuffer = Buffer.from(expectedSignature, "hex");

    // Compare length and then each byte individually with constant time
    if (receivedBuffer.length !== expectedBuffer.length) {
      return false;
    }

    let result = 0;
    for (let i = 0; i < receivedBuffer.length; i++) {
      // XOR operation that yields 0 when bytes are equal
      result |= receivedBuffer[i] ^ expectedBuffer[i];
    }

    return result === 0;
  } catch (error) {
    return false;
  }
}

/**
 * Creates a CSRF cookie and returns the token
 *
 * In a real application, this would set a cookie.
 * Since Astro runs server-side, this would be done in an API endpoint or middleware.
 *
 * @returns {CsrfToken} The generated CSRF token and expiration
 */
export function createCsrfCookie(): CsrfToken {
  const csrfToken = generateCsrfToken();

  // In a real application, a cookie would be set here
  // Since Astro runs server-side, this would be done in an API endpoint or middleware

  return csrfToken;
}

/**
 * Middleware function to protect against CSRF attacks
 *
 * This function should be used in API routes that modify data (POST, PUT, DELETE)
 * It verifies that the request contains a valid CSRF token in the x-csrf-token header
 *
 * @param {Request} request - The incoming request object
 * @returns {boolean} True if the CSRF protection passes, false otherwise
 */
export function csrfProtection(request: Request): boolean {
  // Get the CSRF token from the header
  const csrfToken = request.headers.get("x-csrf-token");

  // If no token is present, the request is invalid
  if (!csrfToken) {
    return false;
  }

  // Verify the token
  return verifyCsrfToken(csrfToken);
}
