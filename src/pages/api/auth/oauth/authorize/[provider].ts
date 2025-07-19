/**
 * OAuth Authorization Endpoint (Language-independent)
 * 
 * Initiates OAuth flow with provider
 * 
 * Route: GET /api/auth/oauth/authorize/[provider]
 * 
 * Query Parameters:
 * - link: Set to 'true' for account linking (optional)
 * - lang: Language code for localization (optional, defaults to 'en')
 * 
 * Response:
 * - 302: Redirects to OAuth provider authorization URL
 * - 400: Invalid provider or configuration error
 * - 401: Unauthorized (for account linking)
 * - 500: Server error
 */

import type { APIRoute } from 'astro';
import { oauthService } from '../../../../../services/oauthService';
import { checkAuth } from '../../../../../middleware/auth';
import { useTranslations } from '../../../../../utils/i18n';
import type { OAuthProvider } from '../../../../../types/oauth';

export const GET: APIRoute = async ({ params, request, url }) => {
  const provider = params.provider as OAuthProvider;
  const lang = url.searchParams.get('lang') || 'en';
  const t = useTranslations(lang);

  try {
    // Check if this is for account linking
    const isLinking = url.searchParams.get('link') === 'true';
    let linkingUserId: string | undefined;

    if (isLinking) {
      // For account linking, user must be authenticated
      const authResult = await checkAuth(request);
      if (!authResult.authenticated || !authResult.user) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: t('auth.service.unauthorized') 
        }), { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      linkingUserId = authResult.user.id;
    }

    // Get redirect URL from query params or referer
    const redirectAfterLogin = url.searchParams.get('redirect') || request.headers.get('referer');
    
    // Create authorization URL
    const baseUrl = url.origin;
    const { url: authUrl } = await oauthService.createAuthorizationUrl(
      provider,
      baseUrl,
      linkingUserId,
      lang, // Pass language for state parameter
      redirectAfterLogin // Pass redirect URL
    );

    // Redirect to OAuth provider
    return Response.redirect(authUrl, 302);

  } catch (error) {
    console.error(`OAuth authorization error for ${provider}:`, error);
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: t('auth.oauth.authorization_failed') 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};