import crypto from "crypto";

/**
 * Constants for CSRF settings
 */
/** Secret key used for HMAC generation - in production, this should be set via environment variable */
const CSRF_SECRET = process.env.CSRF_SECRET || "melody-mind-csrf-secret";
/** Token expiry time: 24 hours in milliseconds */
const CSRF_TOKEN_EXPIRY = 24 * 60 * 60 * 1000;
/** Format for token structure: randomBytes:expiration:signature */
export type TokenFormat = `${string}:${string}:${string}`;

/**
 * Branded type for secure CSRF tokens to prevent accidental mixing with regular strings
 * @category Security
 */
export type SecureCsrfToken = TokenFormat & { readonly __brand: unique symbol };

/**
 * Interface for CSRF token structure with improved type safety
 * @category Security
 */
export interface CsrfToken {
  /** The full CSRF token string with branded type for additional type safety */
  token: SecureCsrfToken;
  /** Expiration timestamp in milliseconds since epoch */
  expires: number;
}

/**
 * Generates a secure CSRF token
 *
 * Creates a token consisting of:
 * - Random bytes for uniqueness
 * - Expiration timestamp
 * - HMAC signature for validation
 *
 * @since 1.0.0
 * @category Security
 *
 * @returns {CsrfToken} Object containing the token and its expiration timestamp
 *
 * @example
 * // Generate a new CSRF token
 * const { token, expires } = generateCsrfToken();
 * // Store the token in a form
 * document.getElementById('csrfToken').value = token;
 */
export function generateCsrfToken(): CsrfToken {
  const randomBytes = crypto.randomBytes(32).toString("hex");
  const expires = Date.now() + CSRF_TOKEN_EXPIRY;

  // Create an HMAC with the secret and expiration date
  const hmac = crypto.createHmac("sha256", CSRF_SECRET);
  hmac.update(`${randomBytes}:${expires}`);
  const signature = hmac.digest("hex");

  // The token consists of random bytes, expiration date, and signature
  const rawToken = `${randomBytes}:${expires}:${signature}`;

  return {
    token: rawToken as SecureCsrfToken,
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
 * Uses a secure constant-time comparison to prevent timing attacks
 *
 * @since 1.0.0
 * @category Security
 *
 * @param {string | SecureCsrfToken} token - The CSRF token to verify
 * @returns {boolean} True if the token is valid, false otherwise
 *
 * @example
 * // Verify a token from a request header
 * const isValid = verifyCsrfToken(request.headers.get('x-csrf-token'));
 * if (!isValid) {
 *   return new Response('CSRF token validation failed', { status: 403 });
 * }
 */
export function verifyCsrfToken(token: string | SecureCsrfToken): boolean {
  try {
    // Split the token into its components
    const parts = token.split(":");
    if (parts.length !== 3) {
      return false;
    }

    const [randomBytes, expiresStr, receivedSignature] = parts;
    const expires = parseInt(expiresStr, 10);

    // Check token format
    if (!randomBytes || !receivedSignature || isNaN(expires)) {
      return false;
    }

    // Check if the token has expired
    if (Date.now() > expires) {
      return false;
    }

    // Calculate the expected signature
    const hmac = crypto.createHmac("sha256", CSRF_SECRET);
    hmac.update(`${randomBytes}:${expires}`);
    const expectedSignature = hmac.digest("hex");

    // Use constant-time comparison to prevent timing attacks
    // First check lengths (this is safe as timing attack would only reveal length)
    if (receivedSignature.length !== expectedSignature.length) {
      return false;
    }

    // Compare each character with constant time (XOR operation)
    let result = 0;
    for (let i = 0; i < receivedSignature.length; i++) {
      // Convert hex characters to numbers and XOR them
      const receivedByte = parseInt(receivedSignature.charAt(i), 16);
      const expectedByte = parseInt(expectedSignature.charAt(i), 16);

      if (isNaN(receivedByte) || isNaN(expectedByte)) {
        return false;
      }

      // XOR yields 0 when bytes are equal; accumulate with bitwise OR
      result |= receivedByte ^ expectedByte;
    }

    // If result is 0, all bytes matched
    return result === 0;
  } catch (_error) {
    // Any parsing errors result in validation failure
    return false;
  }
}

/**
 * Creates a CSRF cookie and returns the token
 *
 * In a real application, this would set a cookie.
 * Since Astro runs server-side, this would be done in an API endpoint or middleware.
 *
 * @since 1.0.0
 * @category Security
 *
 * @returns {CsrfToken} The generated CSRF token and expiration
 *
 * @example
 * // In an API route handler:
 * export async function POST({ request, cookies }) {
 *   const { token, expires } = createCsrfCookie();
 *   cookies.set('csrf', token, {
 *     path: '/',
 *     httpOnly: true,
 *     sameSite: 'strict',
 *     secure: true,
 *     expires: new Date(expires)
 *   });
 *   return new Response(JSON.stringify({ csrfToken: token }));
 * }
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
 * @since 1.0.0
 * @category Security
 *
 * @param {Request} request - The incoming request object
 * @returns {boolean} True if the CSRF protection passes, false otherwise
 *
 * @throws {Error} Will not throw errors, but returns false for any validation failures
 *
 * @example
 * // In an API endpoint:
 * export async function POST({ request }) {
 *   if (!csrfProtection(request)) {
 *     return new Response('CSRF validation failed', { status: 403 });
 *   }
 *
 *   // Process the request
 *   return new Response('Success', { status: 200 });
 * }
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
