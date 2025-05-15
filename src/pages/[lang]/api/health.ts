import type { APIRoute } from "astro";

/**
 * Response type for the health endpoint
 * @since 1.0.0
 */
interface HealthResponse {
  /** Status of the application (ok/error) */
  status: "ok" | "error";
  /** ISO formatted timestamp of when the request was processed */
  timestamp: string;
  /** Optional error message if status is 'error' */
  error?: string;
  /** Version information */
  version?: string;
}

/**
 * Health check endpoint for monitoring application status
 * Returns a simple JSON response with status and timestamp
 *
 * @since 1.0.0
 * @category API
 *
 * @returns {Response} HTTP Response with health status information
 *
 * @example
 * // Make a GET request to /api/health
 * const response = await fetch('/api/health');
 * const data = await response.json();
 * console.log(`Application status: ${data.status}`);
 */
export const GET: APIRoute = async (): Promise<Response> => {
  try {
    const healthData: HealthResponse = {
      status: "ok",
      timestamp: new Date().toISOString(),
    };

    return new Response(JSON.stringify(healthData), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorResponse: HealthResponse = {
      status: "error",
      timestamp: new Date().toISOString(),
      error: errorMessage,
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
