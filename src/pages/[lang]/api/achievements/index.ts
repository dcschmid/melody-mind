/**
 * API Route: Achievements Endpoint
 *
 * This endpoint retrieves all available achievements.
 *
 * @route GET /[lang]/api/achievements
 *
 * @param {Object} params - URL parameters
 * @param {string} params.lang - The language code for i18n translations
 *
 * @returns {Promise<Response>} JSON response with achievements data
 * @throws {AchievementFetchError} When achievements cannot be retrieved
 *
 * @response 200 - Successfully retrieved achievements
 * @response 400 - Invalid language parameter
 * @response 500 - Server error while fetching data
 */
import type { APIRoute } from "astro";

import { getAllAchievements } from "../../../../services/achievementService.ts";
import type { Achievement } from "../../../../types/achievement.ts";
import type { UiLanguages } from "../../../../utils/i18n.ts";
import { useTranslations, languages } from "../../../../utils/i18n.ts";

/**
 * Custom error class for achievement fetching errors
 */
class AchievementFetchError extends Error {
  constructor(
    message: string,
    public readonly languageCode: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = "AchievementFetchError";
  }
}

/**
 * API success response type
 */
type ApiSuccessResponse<T> = {
  status: "success";
  data: T;
};

/**
 * API error response type
 */
type ApiErrorResponse = {
  status: "error";
  message: string;
  code?: string;
};

/**
 * Combined API response type
 */
type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Response type for the achievements endpoint
 */
type AchievementsResponse = ApiResponse<{
  achievements: Achievement[];
}>;

// Constants for headers to avoid duplication
const JSON_HEADERS = {
  "Content-Type": "application/json",
};

/**
 * Checks if the provided language code is valid among supported languages
 *
 * @param {string | undefined} lang - Language code to validate
 * @returns {boolean} Whether the language is supported
 */
function isValidLang(lang: string | undefined): lang is UiLanguages {
  return Boolean(lang && Object.prototype.hasOwnProperty.call(languages, lang));
}

export const GET: APIRoute = async ({ params }) => {
  // Extract and validate language from URL parameters
  const langParam = params.lang;

  if (!langParam || !isValidLang(langParam)) {
    // Even without a valid language, we need to provide a translated error message
    // Use English as a fallback
    const fallbackLang: UiLanguages = "en";
    const t = useTranslations(fallbackLang);

    return new Response(
      JSON.stringify({
        status: "error",
        message: t("errors.api.invalidLanguage"),
        code: "INVALID_LANGUAGE",
      } as ApiErrorResponse),
      {
        status: 400,
        headers: JSON_HEADERS,
      }
    );
  }

  // At this point TypeScript knows langParam is a valid language
  const lang = langParam;
  const t = useTranslations(lang);

  try {
    // Retrieve all achievements
    const achievements = await getAllAchievements(lang);

    // Return achievements with 200 status
    const response: AchievementsResponse = {
      status: "success",
      data: { achievements },
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: JSON_HEADERS,
    });
  } catch (error: unknown) {
    // Create typed error for better handling
    const typedError =
      error instanceof Error
        ? new AchievementFetchError(`Error retrieving achievements: ${error.message}`, lang, error)
        : new AchievementFetchError("Unknown error retrieving achievements", lang, error);

    // Log error for debugging with proper error information
    console.error(typedError.name, {
      message: typedError.message,
      language: typedError.languageCode,
      cause: typedError.cause,
    });

    // Return error response with 500 status
    const errorResponse: ApiErrorResponse = {
      status: "error",
      message: t("errors.achievements.fetch"),
      code: "ACHIEVEMENT_FETCH_ERROR",
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: JSON_HEADERS,
    });
  }
};
