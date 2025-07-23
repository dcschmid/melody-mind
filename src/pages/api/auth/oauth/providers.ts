/**
 * OAuth Providers Endpoint (Language-independent)
 *
 * Returns available OAuth providers and user's linked providers
 *
 * Route: GET /api/auth/oauth/providers
 *
 * Query Parameters:
 * - lang: Language code for localization (optional, defaults to 'en')
 *
 * Response:
 * - 200: JSON with available providers and linked providers
 * - 500: Server error
 */

import type { APIRoute } from "astro";
import { oauthProviders } from "../../../../config/oauth";
import { checkAuth } from "../../../../middleware/auth";
import { useTranslations } from "../../../../utils/i18n";
import { turso } from "../../../../turso";

export const GET: APIRoute = async ({ request, url }) => {
  const lang = url.searchParams.get("lang") || "en";
  const t = useTranslations(lang);

  console.log("OAuth providers API called with lang:", lang);

  try {
    console.log("oauthProviders loaded:", Object.keys(oauthProviders));

    // Get enabled providers
    const enabledProviders = Object.values(oauthProviders).map((provider) => ({
      name: provider.name,
      displayName: provider.displayName,
      icon: provider.icon,
      color: provider.color,
      enabled: true,
    }));

    console.log("enabledProviders:", enabledProviders);

    // Check authentication status to get linked providers
    let linkedProviders: string[] = [];
    const authResult = await checkAuth(request);

    if (authResult.authenticated && authResult.user) {
      try {
        // Get linked OAuth providers for this user
        const linkedResult = await turso.execute({
          sql: `
            SELECT provider 
            FROM oauth_providers 
            WHERE user_id = ?
          `,
          args: [authResult.user.id],
        });

        linkedProviders = linkedResult.rows.map((row) => row.provider as string);
      } catch (error) {
        console.error("Error fetching linked providers:", error);
        // Continue without linked providers info
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        providers: enabledProviders,
        linkedProviders: linkedProviders,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("OAuth providers error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: t("auth.oauth.providers_failed"),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
