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


  if (!cookieHeader) {
    // No cookie present, return unauthenticated without redirect
    return {
      authenticated: false,
    };
  }

  // Extract access token from cookies (check all possible names from OAuth callback)
  const accessToken =
    extractCookieValue(cookieHeader, "access_token") ||
    extractCookieValue(cookieHeader, "auth_token") ||
    extractCookieValue(cookieHeader, "authToken");


  if (!accessToken) {

    // Fallback: Try to get user data from non-HttpOnly cookie (set by OAuth callback)
    const userDataCookie = extractCookieValue(cookieHeader, "user_data");
    if (userDataCookie) {
      try {
        const userData = JSON.parse(decodeURIComponent(userDataCookie));

        if (userData.id && userData.email) {
          // User data available from cookie, consider authenticated
          return {
            authenticated: true,
            user: {
              id: userData.id,
              email: userData.email,
            },
          };
        }
      } catch (error) {
        // Error parsing user_data cookie - ignore silently
      }
    }

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
