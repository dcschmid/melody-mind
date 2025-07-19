/**
 * OAuth Callback Endpoint (Language-independent)
 * 
 * Handles OAuth callback from provider and completes authentication
 * 
 * Route: GET /api/auth/oauth/callback/[provider]
 * 
 * Query Parameters:
 * - code: Authorization code from OAuth provider
 * - state: State parameter for security
 * - error: Error from OAuth provider (optional)
 * 
 * Response:
 * - 302: Redirects to success page with auth cookie set
 * - 400: Invalid request or OAuth error
 * - 500: Server error
 */

import type { APIRoute } from 'astro';
import { oauthService } from '../../../../../services/oauthService';
import { generateAccessToken } from '../../../../../lib/auth/jwt';
import { useTranslations } from '../../../../../utils/i18n';
import type { OAuthProvider } from '../../../../../types/oauth';

export const GET: APIRoute = async ({ params, request, url }) => {
  const provider = params.provider as OAuthProvider;
  
  console.log('OAuth callback called for provider:', provider);
  console.log('Full URL:', url.toString());
  console.log('Search params:', url.searchParams.toString());
  
  // Extract language from state parameter or use default
  const state = url.searchParams.get('state');
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');
  
  console.log('OAuth callback - state:', state);
  console.log('OAuth callback - code:', code ? 'present' : 'missing');
  console.log('OAuth callback - error:', error);
  
  let lang = 'en'; // Default language
  
  let redirectAfterLogin = null;
  
  try {
    if (state) {
      // The state parameter contains encoded information including language
      const stateData = JSON.parse(Buffer.from(state, 'base64').toString());
      lang = stateData.lang || 'en';
      redirectAfterLogin = stateData.redirectAfterLogin;
      console.log('Parsed state data:', stateData);
    }
  } catch (error) {
    console.error('Error parsing state parameter:', error);
  }
  
  const t = useTranslations(lang);

  try {
    // Check for OAuth error
    const error = url.searchParams.get('error');
    if (error) {
      const errorDescription = url.searchParams.get('error_description');
      console.error(`OAuth error from ${provider}:`, error, errorDescription);
      
      const errorRedirect = `/${lang}/auth?error=${encodeURIComponent(t('auth.oauth.authorization_failed'))}`;
      return Response.redirect(new URL(errorRedirect, url.origin), 302);
    }

    // Get authorization code
    const code = url.searchParams.get('code');
    if (!code) {
      console.error('No authorization code received from OAuth provider');
      const errorRedirect = `/${lang}/auth?error=${encodeURIComponent(t('auth.oauth.invalid_callback'))}`;
      return Response.redirect(new URL(errorRedirect, url.origin), 302);
    }

    // Complete OAuth flow
    console.log('Calling oauthService.handleCallback with:', {
      provider,
      code: code ? 'present' : 'missing',
      state: state || '',
      origin: url.origin
    });
    
    const result = await oauthService.handleCallback(
      provider,
      code,
      state || '',
      url.origin
    );

    console.log('OAuth callback result:', result);

    if (!result.success) {
      console.error('OAuth callback failed:', result.error);
      const errorRedirect = `/${lang}/auth?error=${encodeURIComponent(result.error || t('auth.oauth.callback_failed'))}`;
      return Response.redirect(new URL(errorRedirect, url.origin), 302);
    }

    // Generate access token
    const accessToken = await generateAccessToken(result.user.id);
    
    // Determine redirect URL based on whether this was account linking
    const baseRedirectUrl = result.action === 'link' 
      ? `/${lang}/profile?success=${encodeURIComponent(t('auth.oauth.unlink_success', { provider: provider }))}`
      : (redirectAfterLogin || `/${lang}`);

    // Determine if we're in development (localhost)
    const isDevelopment = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
    
    // Set secure, httpOnly cookie
    const authCookie = [
      `auth_token=${accessToken}`,
      'HttpOnly',
      ...(isDevelopment ? [] : ['Secure']), // Only set Secure in production
      'SameSite=Lax', // Changed from Strict to Lax for OAuth redirects
      'Path=/',
      `Max-Age=${60 * 60 * 24 * 30}` // 30 days
    ].join('; ');
    
    // Set auth status for frontend (non-httpOnly so JS can read it)
    const statusCookie = [
      'auth_status=authenticated',
      ...(isDevelopment ? [] : ['Secure']), // Only set Secure in production
      'SameSite=Lax', // Changed from Strict to Lax for OAuth redirects
      'Path=/',
      `Max-Age=${60 * 60 * 24 * 30}` // 30 days
    ].join('; ');
    
    // Set user data cookie for frontend (non-httpOnly so JS can read it)
    const userDataCookie = [
      `user_data=${encodeURIComponent(JSON.stringify({
        id: result.user.id,
        username: result.user.username,
        email: result.user.email,
        avatarUrl: result.user.avatarUrl || null
      }))}`,
      ...(isDevelopment ? [] : ['Secure']), // Only set Secure in production
      'SameSite=Lax', // Changed from Strict to Lax for OAuth redirects
      'Path=/',
      `Max-Age=${60 * 60 * 24 * 30}` // 30 days
    ].join('; ');

    // Create a temporary HTML page that sets localStorage and then redirects
    const tempPageContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Completing Login...</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    .container {
      text-align: center;
      padding: 2rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 1rem;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    .spinner {
      width: 3rem;
      height: 3rem;
      border: 3px solid rgba(255, 255, 255, 0.3);
      border-top: 3px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="spinner"></div>
    <h2>Login erfolgreich!</h2>
    <p>Sie werden weitergeleitet...</p>
  </div>
  <script>
    try {
      // Set localStorage for frontend access
      localStorage.setItem('authToken', '${accessToken}');
      localStorage.setItem('auth_status', 'authenticated');
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify({
        id: '${result.user.id}',
        username: '${result.user.username}',
        email: '${result.user.email}',
        avatarUrl: '${result.user.avatarUrl || ''}'
      }));
      
      // Dispatch auth event for other components
      window.dispatchEvent(new CustomEvent('auth:login', {
        detail: { 
          user: {
            id: '${result.user.id}',
            username: '${result.user.username}',
            email: '${result.user.email}',
            avatarUrl: '${result.user.avatarUrl || ''}'
          }
        }
      }));
      
      console.log('OAuth login successful, localStorage set');
      console.log('Cookies after OAuth:', document.cookie);
      console.log('localStorage after OAuth:', {
        auth_status: localStorage.getItem('auth_status'),
        user: localStorage.getItem('user'),
        authToken: localStorage.getItem('authToken')
      });
      
      // Redirect to the final destination
      setTimeout(() => {
        window.location.href = '${baseRedirectUrl}';
      }, 1000);
      
    } catch (error) {
      console.error('Error setting localStorage:', error);
      // Fallback redirect even if localStorage fails
      window.location.href = '${baseRedirectUrl}';
    }
  </script>
  <noscript>
    <meta http-equiv="refresh" content="2; url=${baseRedirectUrl}">
  </noscript>
</body>
</html>`;

    // Return the temporary page with cookies (for server-side auth)
    const headers = new Headers({
      'Content-Type': 'text/html; charset=utf-8'
    });
    
    // Set multiple cookies properly
    headers.append('Set-Cookie', authCookie);
    headers.append('Set-Cookie', statusCookie);
    headers.append('Set-Cookie', userDataCookie);
    
    console.log('OAuth Callback - Setting cookies:', {
      authCookie,
      statusCookie,
      userDataCookie,
      isDevelopment,
      hostname: url.hostname
    });
    
    return new Response(tempPageContent, {
      status: 200,
      headers
    });

  } catch (error) {
    console.error('OAuth callback error:', error);
    const errorRedirect = `/${lang}/auth?error=${encodeURIComponent(t('auth.oauth.callback_failed'))}`;
    return Response.redirect(new URL(errorRedirect, url.origin), 302);
  }
};