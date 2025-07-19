/**
 * @file Form handlers for authentication forms
 * @description Provides form submission handlers for login and registration
 * @since 3.0.0
 * @category Authentication
 */

import { validatePassword, validatePasswordMatch } from "../../lib/auth/password-validation";
// Import centralized validation utilities (MANDATORY: Code Deduplication)
import { validateEmail } from "../password-validation";

/**
 * Form submission result
 */
export interface FormSubmissionResult {
  success: boolean;
  message?: string;
  redirectUrl?: string;
  error?: string;
}

/**
 * Handles login form submission
 *
 * @param formData - The login form data
 * @param translations - Translation object for error messages
 * @returns Promise with submission result
 */
export async function handleLoginSubmission(
  formData: {
    email: string;
    password: string;
  },
  translations: {
    invalidCredentials: string;
    tooManyAttempts: string;
  }
): Promise<FormSubmissionResult> {
  const currentLang = document.documentElement.lang || "de";

  // Determine redirect URL - stay on current page if it's a category page
  const currentPath = window.location.pathname;
  const redirectUrl = new URLSearchParams(window.location.search).get("redirect") || currentPath;

  // If we're on a category page, we want to stay there after login
  // Don't redirect to auth page
  const shouldStayOnCurrentPage =
    currentPath.includes("category") || currentPath.match(/^\/[a-z]{2}\/[^\/]+$/); // matches pattern like /de/1980s

  try {
    const response = await fetch(`/${currentLang}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
        redirectUrl: redirectUrl,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      // Set localStorage for immediate auth status update
      localStorage.setItem("auth_status", "authenticated");

      // Dispatch auth:login event for other components to react
      const authEvent = new CustomEvent("auth:login", {
        detail: {
          user: data.user,
          token: data.token,
        },
        bubbles: true,
      });
      document.dispatchEvent(authEvent);

      // Determine final redirect URL
      let finalRedirectUrl = redirectUrl;

      // If we should stay on current page, use current path
      if (shouldStayOnCurrentPage) {
        finalRedirectUrl = currentPath;
      }

      // Fallback to language homepage if no valid redirect
      if (!finalRedirectUrl || finalRedirectUrl === "/") {
        finalRedirectUrl = `/${currentLang}/gamehome`;
      }

      return {
        success: true,
        message:
          document.documentElement.lang === "de" ? "Anmeldung erfolgreich!" : "Login successful!",
        redirectUrl: finalRedirectUrl,
      };
    } else {
      // Handle specific error cases
      if (response.status === 401) {
        return { success: false, error: translations.invalidCredentials };
      }
      if (response.status === 429) {
        return { success: false, error: translations.tooManyAttempts };
      }

      return {
        success: false,
        error:
          data.error ||
          (document.documentElement.lang === "de"
            ? "Anmeldung fehlgeschlagen. Bitte überprüfe deine Eingaben."
            : "Login failed. Please check your credentials."),
      };
    }
  } catch (error) {
    return {
      success: false,
      error:
        document.documentElement.lang === "de"
          ? "Ein Fehler ist aufgetreten. Bitte versuche es später erneut."
          : "An error occurred. Please try again later.",
    };
  }
}

/**
 * Handles registration form submission
 *
 * @param formData - The registration form data
 * @returns Promise with submission result
 */
export async function handleRegistrationSubmission(formData: {
  email: string;
  username?: string;
  password: string;
  passwordConfirm: string;
}): Promise<FormSubmissionResult> {
  const currentLang = document.documentElement.lang || "de";
  const redirectUrl =
    new URLSearchParams(window.location.search).get("redirect") || window.location.pathname;

  try {
    const response = await fetch(`/${currentLang}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.email,
        username: formData.username || undefined,
        password: formData.password,
        redirectUrl: redirectUrl,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message:
          data.message ||
          (document.documentElement.lang === "de"
            ? "Registrierung erfolgreich! Bitte überprüfe dein E-Mail-Postfach, um deine E-Mail-Adresse zu bestätigen."
            : "Registration successful! Please check your email to verify your email address."),
      };
    } else {
      return {
        success: false,
        error:
          data.error ||
          (document.documentElement.lang === "de"
            ? "Registrierung fehlgeschlagen. Bitte überprüfe deine Eingaben."
            : "Registration failed. Please check your inputs."),
      };
    }
  } catch (error) {
    return {
      success: false,
      error:
        document.documentElement.lang === "de"
          ? "Ein Fehler ist aufgetreten. Bitte versuche es später erneut."
          : "An error occurred. Please try again later.",
    };
  }
}

/**
 * Validates login form data
 *
 * @param formData - The form data to validate
 * @returns Validation result with any errors
 */
export function validateLoginForm(formData: { email: string; password: string }): {
  isValid: boolean;
  errors: {
    email?: string;
    password?: string;
  };
} {
  const errors: { email?: string; password?: string } = {};
  let isValid = true;

  // Email validation
  if (!formData.email) {
    errors.email =
      document.documentElement.lang === "de"
        ? "E-Mail-Adresse ist erforderlich"
        : "Email address is required";
    isValid = false;
  } else if (!validateEmail(formData.email)) {
    errors.email =
      document.documentElement.lang === "de" ? "Ungültige E-Mail-Adresse" : "Invalid email address";
    isValid = false;
  }

  // Password validation
  if (!formData.password) {
    errors.password =
      document.documentElement.lang === "de" ? "Passwort ist erforderlich" : "Password is required";
    isValid = false;
  }

  return { isValid, errors };
}

/**
 * Validates registration form data
 *
 * @param formData - The form data to validate
 * @returns Validation result with any errors
 */
export function validateRegistrationForm(formData: {
  email: string;
  password: string;
  passwordConfirm: string;
}): {
  isValid: boolean;
  errors: {
    email?: string;
    password?: string;
    passwordConfirm?: string;
  };
} {
  const errors: { email?: string; password?: string; passwordConfirm?: string } = {};
  let isValid = true;

  // Email validation
  if (!formData.email) {
    errors.email =
      document.documentElement.lang === "de"
        ? "E-Mail-Adresse ist erforderlich"
        : "Email address is required";
    isValid = false;
  } else if (!validateEmail(formData.email)) {
    errors.email =
      document.documentElement.lang === "de" ? "Ungültige E-Mail-Adresse" : "Invalid email address";
    isValid = false;
  }

  // Password validation
  if (!formData.password) {
    errors.password =
      document.documentElement.lang === "de" ? "Passwort ist erforderlich" : "Password is required";
    isValid = false;
  } else {
    const { valid } = validatePassword(formData.password);
    if (!valid) {
      errors.password =
        document.documentElement.lang === "de"
          ? "Das Passwort erfüllt nicht alle Anforderungen"
          : "Password does not meet all requirements";
      isValid = false;
    }
  }

  // Password confirmation validation
  if (!formData.passwordConfirm) {
    errors.passwordConfirm =
      document.documentElement.lang === "de"
        ? "Passwortbestätigung ist erforderlich"
        : "Password confirmation is required";
    isValid = false;
  } else {
    const matchResult = validatePasswordMatch(formData.password, formData.passwordConfirm);
    if (!matchResult.valid) {
      errors.passwordConfirm =
        document.documentElement.lang === "de"
          ? "Die Passwörter stimmen nicht überein"
          : "Passwords do not match";
      isValid = false;
    }
  }

  return { isValid, errors };
}

// End of file - removed duplicate validateEmail function (using centralized validation)
