/**
 * API Route for user registration in the MelodyMind application.
 * This endpoint handles new user registration by validating input data
 * and using the authentication service to create user accounts.
 *
 * @file User registration API endpoint
 * @module auth/register
 */
import type { APIRoute } from "astro";

import { authService } from "../../../../lib/auth/auth-service.js";
import { useTranslations } from "../../../../utils/i18n.js";

/**
 * POST handler for user registration.
 * Processes registration requests by validating the provided email,
 * password, and username, then creates a new user account if the data is valid.
 *
 * @param {Object} context - Astro API route context
 * @param {Request} context.request - The HTTP request object
 * @param {Object} context.params - URL parameters including language code
 * @returns {Response} JSON response indicating success or error details
 */
export const POST: APIRoute = async ({ request, params }) => {
  // Extract language from URL parameters
  const lang = params.lang as string;
  const t = useTranslations(lang);

  try {
    // Extract registration data from request body
    const body = await request.json();
    const { email, password, username } = body;

    // Validate required inputs
    if (!email || !password) {
      return new Response(
        JSON.stringify({
          success: false,
          error: t("auth.form.required"),
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Perform user registration through auth service
    const result = await authService.register({
      email,
      password,
      username,
    });

    if (!result.success) {
      // Return validation errors with 400 status code
      return new Response(
        JSON.stringify({
          success: false,
          error: result.error,
          validationErrors: result.validationErrors,
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Successful registration - return 201 Created status
    return new Response(
      JSON.stringify({
        success: true,
        user: result.user,
        message: t("auth.register.success"),
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Registration error:", error);

    // Handle unexpected errors with 500 status code
    return new Response(
      JSON.stringify({
        success: false,
        error: t("auth.form.error"),
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
