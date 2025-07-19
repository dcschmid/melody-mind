/**
 * OAuth Unlink Endpoint (Language-independent)
 * 
 * Unlinks an OAuth provider from the user's account
 * 
 * Route: POST /api/auth/oauth/unlink/[provider]
 * 
 * Query Parameters:
 * - lang: Language code for localization (optional, defaults to 'en')
 * 
 * Response:
 * - 200: Provider unlinked successfully
 * - 400: Cannot unlink (last auth method or provider not linked)
 * - 401: Unauthorized
 * - 500: Server error
 */

import type { APIRoute } from 'astro';
import { oauthService } from '../../../../../services/oauthService';
import { checkAuth } from '../../../../../middleware/auth';
import { useTranslations } from '../../../../../utils/i18n';
import type { OAuthProvider } from '../../../../../types/oauth';

export const POST: APIRoute = async ({ params, request, url }) => {
  const provider = params.provider as OAuthProvider;
  const lang = url.searchParams.get('lang') || 'en';
  const t = useTranslations(lang);

  try {
    // Check authentication
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

    // Unlink the provider
    const result = await oauthService.unlinkProvider(authResult.user.id, provider);
    
    if (!result.success) {
      return new Response(JSON.stringify({
        success: false,
        error: result.error || t('auth.oauth.unlink_failed', { provider })
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: t('auth.oauth.unlink_success', { provider })
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error(`OAuth unlink error for ${provider}:`, error);
    
    return new Response(JSON.stringify({
      success: false,
      error: t('auth.oauth.unlink_failed', { provider })
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};