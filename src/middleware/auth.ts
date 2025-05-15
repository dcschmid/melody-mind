import { verifyAccessToken } from "../lib/auth/jwt.js";

/**
 * Checks if a valid JWT token is present in the cookies
 * and redirects to the login page if no token is found
 *
 * @param request - The Astro request
 * @param redirectUrl - The URL to redirect to after successful login
 * @returns An object with the authentication status and possibly the user information
 */
export async function requireAuth(request: Request): Promise<{
  authenticated: boolean;
  user?: { id: string; email: string };
  redirectToLogin?: Response;
}> {
  // Extract cookie header from the request
  const cookieHeader = request.headers.get("cookie");

  if (!cookieHeader) {
    // No cookie present, redirect to login page
    return {
      authenticated: false,
      redirectToLogin: createLoginRedirect(request.url),
    };
  }

  // Extract access token from cookies
  const accessToken = extractCookieValue(cookieHeader, "access_token");

  if (!accessToken) {
    // No access token present, redirect to login page
    return {
      authenticated: false,
      redirectToLogin: createLoginRedirect(request.url),
    };
  }

  // Verify token
  const payload = verifyAccessToken(accessToken);

  if (!payload || !payload.userId) {
    // Invalid or expired token, redirect to login page
    return {
      authenticated: false,
      redirectToLogin: createLoginRedirect(request.url),
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

/**
 * Creates a redirect response to the login page with the current URL as a redirect parameter
 */
function createLoginRedirect(currentUrl: string): Response {
  const url = new URL(currentUrl);
  const lang = url.pathname.split("/")[1] || "de"; // Extract language from URL or use 'de' as fallback
  const redirectParam = encodeURIComponent(url.pathname);

  return new Response(null, {
    status: 302,
    headers: {
      Location: `/${lang}/auth/login?redirect=${redirectParam}`,
    },
  });
}
