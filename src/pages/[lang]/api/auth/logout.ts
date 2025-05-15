/**
 * @file Logout API Route
 * @description Handles user logout functionality by clearing authentication cookies
 * @module auth/logout
 * @since 3.0.0
 * @category Authentication
 */

import type { APIRoute } from "astro";

import { useTranslations } from "../../../../utils/i18n.js";
import type { UiLanguages } from "../../../../utils/i18n.js";

/**
 * Cookie options type definition with SameSite options
 * @since 3.0.0
 */
type SameSiteOption = "Strict" | "Lax" | "None";

/**
 * Type-safe cookie settings
 * @since 3.0.0
 */
interface CookieOptions {
  /** Whether the cookie is HTTP only (not accessible from JavaScript) */
  httpOnly: boolean;
  /** Whether the cookie requires HTTPS */
  secure: boolean;
  /** SameSite cookie attribute */
  sameSite: SameSiteOption;
  /** Cookie path */
  path: string;
  /** Cookie expiration date */
  expires: Date;
}

/**
 * Type for response structure
 * @since 3.0.0
 */
interface LogoutResponse {
  /** Whether the logout was successful */
  success: boolean;
  /** User-friendly message about the operation result */
  message: string;
}

/**
 * Creates a cookie header string from options
 *
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {CookieOptions} options - Cookie configuration options
 * @returns {string} Formatted cookie header string
 * @since 3.0.0
 */
function createCookieHeader(name: string, value: string, options: CookieOptions): string {
  return `${name}=${value}; ${options.httpOnly ? "HttpOnly;" : ""} ${
    options.secure ? "Secure;" : ""
  } SameSite=${options.sameSite}; Path=${options.path}; Expires=${options.expires.toUTCString()}`;
}

/**
 * POST handler for user logout
 *
 * Clears authentication cookies by setting them to expire in the past
 * and returns a success response with translated message.
 *
 * @param {Object} options - The Astro API route options
 * @param {Request} options.request - The incoming request object
 * @param {Object} options.params - URL parameters including language code
 * @param {Object} options.cookies - Cookie management utilities
 * @returns {Response} JSON response indicating logout success or failure
 *
 * @since 3.0.0
 * @example
 * // Client-side call example
 * const response = await fetch('/api/auth/logout', { method: 'POST' });
 * const result = await response.json();
 * console.log(result.success ? 'Successfully logged out' : result.message);
 */
export const POST: APIRoute = async ({ params }) => {
  // Extract language from URL parameters with type safety
  const lang = params.lang as UiLanguages;
  const t = useTranslations(lang);

  try {
    // Clear authentication cookies by setting expiration date in the past
    const accessTokenExpiry = new Date(0);

    // Cookie options with type safety
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      path: "/",
      expires: accessTokenExpiry,
    };

    // Create the cookie clear header
    const cookieHeader = createCookieHeader("access_token", "", cookieOptions);

    return new Response(
      JSON.stringify({
        success: true,
        message: t("auth.logout.success"),
      } satisfies LogoutResponse),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": cookieHeader,
        },
      }
    );
  } catch (error) {
    console.error("Error during logout:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: t("auth.form.error.general"),
      } satisfies LogoutResponse),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
