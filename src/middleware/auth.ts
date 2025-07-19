import { verifyAccessToken } from "../lib/auth/jwt.js";

/**
 * Checks if a valid JWT token is present in the cookies
 * @deprecated Use checkAuth instead - no longer redirects
 * @param {Request} request - The Astro request
 * @returns {Promise<{authenticated: boolean, user?: {id: string, email: string}}>} An object with the authentication status and possibly the user information
 */
export async function requireAuth(request: Request): Promise<{
  authenticated: boolean;
  user?: { id: string; email: string };
}> {
  // Just call checkAuth now - no more redirects
  return checkAuth(request);
}

/**
 * Checks if a valid JWT token is present in the cookies
 * WITHOUT redirecting to login page - for optional authentication
 *
 * @param {Request} request - The Astro request
 * @returns {Promise<{authenticated: boolean, user?: {id: string, email: string}}>} An object with the authentication status and possibly the user information
 */
export async function checkAuth(request: Request): Promise<{
  authenticated: boolean;
  user?: { id: string; email: string };
}> {
  // Extract cookie header from the request
  const cookieHeader = request.headers.get("cookie");

  console.log('Auth Debug - checkAuth:', {
    cookieHeader,
    url: request.url,
    method: request.method
  });

  if (!cookieHeader) {
    console.log('Auth Debug - No cookie header');
    // No cookie present, return unauthenticated without redirect
    return {
      authenticated: false,
    };
  }

  // Extract access token from cookies (check both names for compatibility)
  const accessToken = extractCookieValue(cookieHeader, "access_token") || extractCookieValue(cookieHeader, "auth_token");

  console.log('Auth Debug - Token extraction:', {
    accessToken: accessToken ? 'Found' : 'Not found',
    accessTokenExists: !!extractCookieValue(cookieHeader, "access_token"),
    authTokenExists: !!extractCookieValue(cookieHeader, "auth_token"),
    allCookies: cookieHeader.split(';').map(c => c.trim().split('=')[0])
  });

  if (!accessToken) {
    console.log('Auth Debug - No access token found');
    // No access token present, return unauthenticated without redirect
    return {
      authenticated: false,
    };
  }

  // Verify token
  const payload = verifyAccessToken(accessToken);

  if (!payload || !payload.userId) {
    // Invalid or expired token, return unauthenticated without redirect
    return {
      authenticated: false,
    };
  }

  // Authentication successful
  return {
    authenticated: true,
    user: {
      id: payload.userId,
      email: payload.email,
    },
  };
}

/**
 * Extracts the value of a specific cookie from the cookie header
 */
function extractCookieValue(cookieHeader: string, cookieName: string): string | null {
  const cookies = cookieHeader.split(";");

  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === cookieName) {
      return value;
    }
  }

  return null;
}

// createLoginRedirect function removed - no longer needed with new auth flow
