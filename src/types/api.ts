/**
 * API Types Module
 *
 * This module contains TypeScript definitions for API-related types used throughout the application.
 * Includes branded types, response interfaces, and error types.
 */

import type { Achievement } from "./achievement.ts";
import type { GameState } from "./game.ts";

/**
 * Branded type for User ID to prevent type confusion with regular strings
 * This improves type safety by making user IDs distinct from other string values
 */
export type UserId = string & { readonly __brand: unique symbol };

/**
 * Supported language codes in the application
 * Using template literal types for better type checking
 */
export type SupportedLanguage = "en" | "de" | "es" | "fr" | "it" | "nl" | "pt" | "sv" | "fi";

/**
 * HTTP Status Codes as constants to avoid magic numbers
 */
export const HttpStatus = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

/**
 * Base API Response interface that all responses extend
 */
export interface ApiResponse {
  /** Indicates whether the operation was successful */
  success: boolean;
}

/**
 * Success response with payload
 */
export interface ApiSuccessResponse<T> extends ApiResponse {
  success: true;
  /** The data returned by the API */
  data: T;
}

/**
 * Error response
 */
export interface ApiErrorResponse extends ApiResponse {
  success: false;
  /** Error message explaining what went wrong */
  error: string;
  /** Optional error code for client-side handling */
  code?: string;
}

/**
 * Achievement check request body interface
 *
 * @since 3.1.0
 * @category API
 */
export interface AchievementCheckRequest {
  /** Game state containing player performance data */
  gameState: GameState;
  /** Whether the player achieved a perfect score */
  isPerfectGame: boolean;
}

/**
 * Achievement check success response
 *
 * @since 3.1.0
 * @category API
 */
export interface AchievementCheckSuccessResponse
  extends ApiSuccessResponse<{
    /** List of newly unlocked achievements */
    unlockedAchievements: Achievement[];
    /** List of achievements with updated progress */
    updatedAchievements: Achievement[];
  }> {
  /** Timestamp when achievements were checked */
  timestamp: Date;
}

/**
 * Specialized error classes
 */

/**
 * Base class for API errors
 */
export class ApiError extends Error {
  /** HTTP status code */
  public readonly statusCode: number;
  /** Error code for client-side handling */
  public readonly code: string;

  /**
   * Creates a new ApiError instance
   * @param {string} message Error message explaining what went wrong
   * @param {number} statusCode HTTP status code associated with this error
   * @param {string} code Error code for client-side handling
   */
  constructor(message: string, statusCode: number, code: string) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.code = code;
  }

  /**
   * Converts the error to an API response
   */
  toResponse(): Response {
    return new Response(
      JSON.stringify({
        success: false,
        error: this.message,
        code: this.code,
      }),
      {
        status: this.statusCode,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

/**
 * Authentication error for unauthorized access
 */
export class AuthenticationError extends ApiError {
  /**
   * Creates a new AuthenticationError instance
   * @param {string} message Error message explaining what went wrong
   */
  constructor(message: string) {
    super(message, HttpStatus.UNAUTHORIZED, "AUTH_ERROR");
    this.name = "AuthenticationError";
  }
}
/**
 * Validation error for invalid request data
 */
export class ValidationError extends ApiError {
  /**
   * Creates a new ValidationError instance
   * @param {string} message Error message explaining what went wrong
   */
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST, "VALIDATION_ERROR");
    this.name = "ValidationError";
  }
}

/**
 * Server error for internal errors
 */
export class ServerError extends ApiError {
  /**
  /**
   * Creates a new ServerError instance
   * @param {string} message Error message explaining what went wrong
   */
  constructor(message: string) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR, "SERVER_ERROR");
    this.name = "ServerError";
  }
}

/**
 * Type guard for checking if a value is an ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
