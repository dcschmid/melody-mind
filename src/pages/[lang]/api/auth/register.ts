/**
 * API Route for user registration in the MelodyMind application.
 * This endpoint handles new user registration by validating input data
 * and using the authentication service to create user accounts.
 *
 * @file User registration API endpoint
 * @module auth/register
 * @since 3.0.0
 * @category Authentication
 */
import type { APIRoute } from "astro";

import {
  authService,
  type NewUser,
  type RegisterResult,
} from "../../../../lib/auth/auth-service.js";
import { useTranslations } from "../../../../utils/i18n.js";

/**
 * Type-safe language codes using template literal types
 * @since 3.0.0
 */
type SupportedLanguage = "de" | "en" | "fr" | "es" | "it" | "pt" | "da" | "nl" | "sv" | "fi";

/**
 * Type-safe HTTP status codes for better error handling
 * @since 3.0.0
 */
const enum HttpStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

/**
 * Type for registration request body
 * @since 3.0.0
 */
interface RegistrationRequest {
  /** User's email address */
  email: string;
  /** User's password in plain text (will be hashed before storage) */
  password: string;
  /** Optional username */
  username?: string;
}

/**
 * Generic API response type for consistent response structure
 * @template T - The type of data included in a successful response
 * @since 3.0.0
 */
interface ApiResponse<T = undefined> {
  /** Whether the operation was successful */
  success: boolean;
  /** Optional error message for failed operations */
  error?: string;
  /** Optional validation errors for form submissions */
  validationErrors?: string[];
  /** Optional data returned on successful operations */
  data?: T;
  /** Optional success message */
  message?: string;
}

/**
 * Specialized error class for registration failures
 * Provides better error handling and type safety
 *
 * @since 3.0.0
 * @category Authentication
 */
class RegistrationError extends Error {
  constructor(
    message: string,
    public readonly status: HttpStatus = HttpStatus.BAD_REQUEST,
    public readonly validationErrors?: string[]
  ) {
    super(message);
    this.name = "RegistrationError";
  }
}

/**
 * Type guard to check if the registration result was successful
 *
 * @since 3.0.0
 * @param {RegisterResult} result - Registration result to check
 * @returns {boolean} Type predicate for successful registration
 */
function isSuccessfulRegistration(
  result: RegisterResult
): result is RegisterResult & { success: true; user: NonNullable<RegisterResult["user"]> } {
  return result.success === true && result.user !== undefined;
}

/**
 * Creates a standardized API response
 *
 * @since 3.0.0
 * @param {Object} options - Response configuration
 * @returns {Response} HTTP Response object
 */
function createApiResponse<T>({
  success,
  data,
  error,
  message,
  validationErrors,
  status,
}: {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  validationErrors?: string[];
  status: HttpStatus;
}): Response {
  const body: ApiResponse<T> = {
    success,
    ...(data && { data }),
    ...(error && { error }),
    ...(message && { message }),
    ...(validationErrors && { validationErrors }),
  };

  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

/**
 * POST handler for user registration.
 * Processes registration requests by validating the provided email,
 * password, and username, then creates a new user account if the data is valid.
 *
 * @since 3.0.0
 * @param {Object} context - Astro API route context
 * @param {Request} context.request - The HTTP request object
 * @param {Object} context.params - URL parameters including language code
 * @returns {Response} JSON response indicating success or error details
 *
 * @example
 * // Example client request:
 * fetch('/api/auth/register', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     email: 'user@example.com',
 *     password: 'secure_password',
 *     username: 'username'
 *   })
 * });
 */
export const POST: APIRoute = async ({ request, params }) => {
  // Extract language from URL parameters with type safety
  const lang = params.lang as SupportedLanguage;
  const t = useTranslations(lang);

  try {
    // Extract registration data from request body with type safety
    const body = (await request.json()) as RegistrationRequest;
    const { email, password, username } = body;

    // Validate required inputs
    if (!email || !password) {
      return createApiResponse({
        success: false,
        error: t("auth.form.required"),
        status: HttpStatus.BAD_REQUEST,
      });
    }

    // Perform user registration through auth service
    const registrationData: NewUser = {
      email,
      password,
      ...(username && { username }),
    };

    const result = await authService.register(registrationData);

    // Handle failed registration with type-safe response
    if (!isSuccessfulRegistration(result)) {
      return createApiResponse({
        success: false,
        error: result.error,
        validationErrors: result.validationErrors,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    // Successful registration with type-safe response
    return createApiResponse({
      success: true,
      data: { user: result.user },
      message: t("auth.register.success"),
      status: HttpStatus.CREATED,
    });
  } catch (error) {
    console.error("Registration error:", error);

    // Enhanced error handling with type checking
    if (error instanceof RegistrationError) {
      return createApiResponse({
        success: false,
        error: error.message,
        validationErrors: error.validationErrors,
        status: error.status,
      });
    }

    // Generic error handling for unexpected errors
    return createApiResponse({
      success: false,
      error: t("auth.form.error"),
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
};
