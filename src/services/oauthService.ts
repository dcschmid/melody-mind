/**
 * OAuth Service
 *
 * This service handles OAuth authentication, token exchange, and user data retrieval
 * for all supported OAuth providers. It also manages account linking functionality.
 */

import { turso } from "../turso";
import {
  oauthProviders,
  generateOAuthState,
  generateCodeVerifier,
  generateCodeChallenge,
  getOAuthRedirectUri,
} from "../config/oauth";
import type {
  OAuthProvider,
  OAuthProviderConfig,
  OAuthSession,
  OAuthTokenResponse,
  OAuthUserInfo,
  OAuthProviderAccount,
  OAuthLinkingResult,
  SpotifyUserData,
  GoogleUserData,
  AppleUserData,
  DiscordUserData,
  YahooUserData,
} from "../types/oauth";

/**
 * OAuth Service Class
 */
export class OAuthService {
  /**
   * Create OAuth authorization URL
   */
  async createAuthorizationUrl(
    provider: OAuthProvider,
    baseUrl: string,
    linkingUserId?: string,
    lang?: string,
    redirectAfterLogin?: string
  ): Promise<{ url: string; state: string }> {
    const config = oauthProviders[provider];
    if (!config) {
      throw new Error(`OAuth provider ${provider} not configured`);
    }

    const state = generateOAuthState();
    const redirectUri = getOAuthRedirectUri(provider, baseUrl);

    // Create state data with language information
    const stateData = {
      state,
      lang: lang || "en",
      provider,
      linkingUserId,
      redirectAfterLogin,
    };
    const encodedState = Buffer.from(JSON.stringify(stateData)).toString("base64");

    let codeVerifier: string | undefined;
    let codeChallenge: string | undefined;

    if (config.usePKCE) {
      codeVerifier = generateCodeVerifier();
      codeChallenge = await generateCodeChallenge(codeVerifier);
    }

    // Store OAuth session
    await this.createOAuthSession({
      id: crypto.randomUUID(),
      state: encodedState,
      provider,
      redirectUri,
      codeVerifier,
      linkingUserId,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes für Debug
    });

    // Build authorization URL
    const authUrl = new URL(config.authUrl);
    authUrl.searchParams.set("client_id", config.clientId);
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("scope", config.scopes.join(" "));
    authUrl.searchParams.set("state", encodedState);

    if (codeChallenge) {
      authUrl.searchParams.set("code_challenge", codeChallenge);
      authUrl.searchParams.set("code_challenge_method", "S256");
    }

    // Provider-specific parameters
    if (provider === "apple") {
      authUrl.searchParams.set("response_mode", "form_post");
    }

    return { url: authUrl.toString(), state: encodedState };
  }

  /**
   * Handle OAuth callback
   */
  async handleCallback(
    provider: OAuthProvider,
    code: string,
    state: string,
    baseUrl?: string
  ): Promise<OAuthLinkingResult> {
    console.log("OAuth handleCallback called with:", {
      provider,
      code: code ? "present" : "missing",
      state,
      baseUrl,
    });

    // Get OAuth session
    const session = await this.getOAuthSession(state);
    console.log("OAuth session found:", session);

    if (!session) {
      throw new Error("Invalid or expired OAuth state");
    }

    if (session.provider !== provider) {
      throw new Error("OAuth provider mismatch");
    }

    // Exchange code for tokens
    const tokenResponse = await this.exchangeCodeForTokens(provider, code, session);

    // Get user info from provider
    const userInfo = await this.getUserInfo(provider, tokenResponse.access_token);

    // Handle user account (login, register, or link)
    const result = await this.handleUserAccount(provider, userInfo, tokenResponse, session);

    // Clean up OAuth session (disabled for debugging)
    console.log("🔍 DEBUG: Keeping OAuth session for inspection:", session.id);
    // await this.deleteOAuthSession(session.id);

    return result;
  }

  /**
   * Link OAuth provider to existing user account
   */
  async linkProviderToUser(
    userId: string,
    provider: OAuthProvider,
    baseUrl: string
  ): Promise<{ url: string; state: string }> {
    // Check if user already has this provider linked
    const existingProvider = await this.getUserOAuthProvider(userId, provider);
    if (existingProvider) {
      throw new Error(`${provider} account already linked`);
    }

    return this.createAuthorizationUrl(provider, baseUrl, userId);
  }

  /**
   * Unlink OAuth provider from user account
   */
  async unlinkProviderFromUser(userId: string, provider: OAuthProvider): Promise<void> {
    // Check if user has password or other providers (prevent lockout)
    const userAuthInfo = await this.getUserAuthInfo(userId);
    if (!userAuthInfo.hasPassword && userAuthInfo.oauthProviderCount <= 1) {
      throw new Error("Cannot unlink last authentication method");
    }

    await turso.execute({
      sql: "DELETE FROM oauth_providers WHERE user_id = ? AND provider = ?",
      args: [userId, provider],
    });
  }

  /**
   * Unlink OAuth provider from user account (wrapper for API compatibility)
   */
  async unlinkProvider(
    userId: string,
    provider: OAuthProvider
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await this.unlinkProviderFromUser(userId, provider);
      return { success: true };
    } catch (error) {
      console.error("Error unlinking provider:", error);
      return {
        success: false,
        error: error.message || "Failed to unlink provider",
      };
    }
  }

  /**
   * Get user's OAuth providers
   */
  async getUserOAuthProviders(userId: string): Promise<OAuthProviderAccount[]> {
    const result = await turso.execute({
      sql: `
        SELECT id, user_id, provider, provider_user_id, provider_email, 
               provider_username, provider_avatar_url, created_at, updated_at
        FROM oauth_providers 
        WHERE user_id = ?
        ORDER BY created_at DESC
      `,
      args: [userId],
    });

    return (
      result.rows?.map((row) => ({
        id: row.id as string,
        userId: row.user_id as string,
        provider: row.provider as OAuthProvider,
        providerUserId: row.provider_user_id as string,
        providerEmail: row.provider_email as string,
        providerUsername: row.provider_username as string,
        providerAvatarUrl: row.provider_avatar_url as string,
        createdAt: row.created_at as string,
        updatedAt: row.updated_at as string,
      })) || []
    );
  }

  /**
   * Private methods
   */

  private async createOAuthSession(session: OAuthSession): Promise<void> {
    console.log("🔵 Creating OAuth session:", {
      id: session.id,
      state: session.state.substring(0, 20) + "...",
      provider: session.provider,
      redirectUri: session.redirectUri,
      linkingUserId: session.linkingUserId,
      expiresAt: session.expiresAt,
    });

    try {
      await turso.execute({
        sql: `
          INSERT INTO oauth_sessions (id, state, provider, redirect_uri, code_verifier, linking_user_id, created_at, expires_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        args: [
          session.id,
          session.state,
          session.provider,
          session.redirectUri || null,
          session.codeVerifier || null,
          session.linkingUserId || null,
          session.createdAt,
          session.expiresAt,
        ],
      });

      console.log("✅ OAuth session created successfully:", session.id);

      // Verify session was created
      const verification = await turso.execute({
        sql: "SELECT COUNT(*) as count FROM oauth_sessions WHERE id = ?",
        args: [session.id],
      });
      console.log("🔍 Session verification count:", verification.rows[0]);
    } catch (error) {
      console.error("❌ Failed to create OAuth session:", error);
      throw error;
    }
  }

  private async getOAuthSession(state: string): Promise<OAuthSession | null> {
    console.log("🔍 Getting OAuth session for state:", state.substring(0, 20) + "...");

    // First, check all sessions regardless of expiry
    const allSessionsResult = await turso.execute({
      sql: `SELECT COUNT(*) as total, 
                   COUNT(CASE WHEN expires_at > datetime('now') THEN 1 END) as active
            FROM oauth_sessions`,
      args: [],
    });
    console.log("📊 Total OAuth sessions in DB:", allSessionsResult.rows[0]);

    const result = await turso.execute({
      sql: `
        SELECT id, state, provider, redirect_uri, code_verifier, linking_user_id, created_at, expires_at
        FROM oauth_sessions 
        WHERE state = ? AND expires_at > datetime('now')
      `,
      args: [state],
    });

    console.log("🔍 OAuth session query result:", {
      rowCount: result.rows.length,
      found: result.rows.length > 0,
    });

    if (!result.rows || result.rows.length === 0) {
      console.log("❌ No OAuth session found for state. Checking expired sessions...");

      // Check if session existed but is expired
      const expiredResult = await turso.execute({
        sql: `SELECT id, expires_at FROM oauth_sessions WHERE state = ?`,
        args: [state],
      });

      if (expiredResult.rows.length > 0) {
        console.log("⏰ Found expired session:", {
          id: expiredResult.rows[0].id,
          expiresAt: expiredResult.rows[0].expires_at,
          now: new Date().toISOString(),
        });
      } else {
        console.log("🚫 No session found at all for this state");
      }

      return null;
    }

    const row = result.rows[0];
    return {
      id: row.id as string,
      state: row.state as string,
      provider: row.provider as OAuthProvider,
      redirectUri: row.redirect_uri as string,
      codeVerifier: row.code_verifier as string,
      linkingUserId: row.linking_user_id as string,
      createdAt: row.created_at as string,
      expiresAt: row.expires_at as string,
    };
  }

  private async deleteOAuthSession(id: string): Promise<void> {
    console.log("🗑️ Deleting OAuth session:", id);

    try {
      const result = await turso.execute({
        sql: "DELETE FROM oauth_sessions WHERE id = ?",
        args: [id],
      });

      console.log("✅ OAuth session deleted successfully:", {
        id,
        rowsAffected: result.rowsAffected,
      });
    } catch (error) {
      console.error("❌ Failed to delete OAuth session:", error);
      throw error;
    }
  }

  private async exchangeCodeForTokens(
    provider: OAuthProvider,
    code: string,
    session: OAuthSession
  ): Promise<OAuthTokenResponse> {
    const config = oauthProviders[provider];
    const tokenUrl = config.tokenUrl;

    const body = new URLSearchParams();
    body.append("grant_type", "authorization_code");
    body.append("code", code);
    body.append("redirect_uri", session.redirectUri || "");
    body.append("client_id", config.clientId);
    body.append("client_secret", config.clientSecret);

    if (session.codeVerifier) {
      body.append("code_verifier", session.codeVerifier);
    }

    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: body.toString(),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Token exchange failed: ${error}`);
    }

    return await response.json();
  }

  private async getUserInfo(provider: OAuthProvider, accessToken: string): Promise<OAuthUserInfo> {
    const config = oauthProviders[provider];

    if (!config.userInfoUrl) {
      throw new Error(`No user info URL configured for ${provider}`);
    }

    const response = await fetch(config.userInfoUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to get user info: ${error}`);
    }

    const userData = await response.json();
    return this.normalizeUserInfo(provider, userData);
  }

  private normalizeUserInfo(provider: OAuthProvider, userData: any): OAuthUserInfo {
    switch (provider) {
      case "spotify":
        const spotifyData = userData as SpotifyUserData;
        return {
          id: spotifyData.id,
          email: spotifyData.email,
          username: spotifyData.display_name,
          name: spotifyData.display_name,
          avatarUrl: spotifyData.images?.[0]?.url,
          additional: { product: spotifyData.product, country: spotifyData.country },
        };

      case "google":
        const googleData = userData as GoogleUserData;
        console.log("Google user data:", googleData);
        return {
          id: googleData.sub || googleData.id,
          email: googleData.email,
          username: googleData.name,
          name: googleData.name,
          avatarUrl: googleData.picture,
          verified: googleData.email_verified,
          locale: googleData.locale,
        };

      case "discord":
        const discordData = userData as DiscordUserData;
        return {
          id: discordData.id,
          email: discordData.email,
          username: `${discordData.username}#${discordData.discriminator}`,
          name: discordData.username,
          avatarUrl: discordData.avatar
            ? `https://cdn.discordapp.com/avatars/${discordData.id}/${discordData.avatar}.png`
            : undefined,
          verified: discordData.verified,
          locale: discordData.locale,
        };

      case "yahoo":
        const yahooData = userData as YahooUserData;
        return {
          id: yahooData.sub,
          email: yahooData.email,
          username: yahooData.name,
          name: yahooData.name,
          avatarUrl: yahooData.picture,
          verified: yahooData.email_verified,
          locale: yahooData.locale,
        };

      default:
        throw new Error(`Unsupported OAuth provider: ${provider}`);
    }
  }

  private async handleUserAccount(
    provider: OAuthProvider,
    userInfo: OAuthUserInfo,
    tokenResponse: OAuthTokenResponse,
    session: OAuthSession
  ): Promise<OAuthLinkingResult> {
    console.log("handleUserAccount called with userInfo:", userInfo);

    // Validate userInfo has required ID
    if (!userInfo.id) {
      throw new Error(`OAuth userInfo missing required id field for provider ${provider}`);
    }

    // If linking to existing account
    if (session.linkingUserId) {
      return this.linkToExistingAccount(session.linkingUserId, provider, userInfo, tokenResponse);
    }

    // Check if OAuth account already exists
    const existingOAuthAccount = await this.getOAuthProviderByProviderUserId(provider, userInfo.id);
    if (existingOAuthAccount) {
      // Login with existing OAuth account
      return this.loginWithOAuthAccount(existingOAuthAccount, provider);
    }

    // Check if user with same email exists
    if (userInfo.email) {
      const existingUser = await this.getUserByEmail(userInfo.email);
      if (existingUser) {
        // Link to existing user account
        return this.linkToExistingAccount(existingUser.id, provider, userInfo, tokenResponse);
      }
    }

    // Create new user account
    return this.createUserWithOAuth(provider, userInfo, tokenResponse);
  }

  private async linkToExistingAccount(
    userId: string,
    provider: OAuthProvider,
    userInfo: OAuthUserInfo,
    tokenResponse: OAuthTokenResponse
  ): Promise<OAuthLinkingResult> {
    // Check if provider already linked
    const existingProvider = await this.getUserOAuthProvider(userId, provider);
    if (existingProvider) {
      throw new Error(`${provider} account already linked`);
    }

    // Create OAuth provider record
    await this.createOAuthProviderRecord(userId, provider, userInfo, tokenResponse);

    // Get user info
    const user = await this.getUserById(userId);
    const linkedProviders = await this.getUserOAuthProviders(userId);

    return {
      success: true,
      action: "link",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
      provider,
      isNewUser: false,
      linkedProviders: linkedProviders.map((p) => p.provider),
    };
  }

  private async loginWithOAuthAccount(
    oauthAccount: OAuthProviderAccount,
    provider: OAuthProvider
  ): Promise<OAuthLinkingResult> {
    // Get user info
    const user = await this.getUserById(oauthAccount.userId);
    const linkedProviders = await this.getUserOAuthProviders(oauthAccount.userId);

    // Update last login
    await this.updateUserLastLogin(oauthAccount.userId);

    return {
      success: true,
      action: "login",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
      provider,
      isNewUser: false,
      linkedProviders: linkedProviders.map((p) => p.provider),
    };
  }

  private async createUserWithOAuth(
    provider: OAuthProvider,
    userInfo: OAuthUserInfo,
    tokenResponse: OAuthTokenResponse
  ): Promise<OAuthLinkingResult> {
    const userId = crypto.randomUUID();
    const username = userInfo.username || userInfo.name || `${provider}_user_${Date.now()}`;

    // Create user account with empty password hash for OAuth users
    await turso.execute({
      sql: `
        INSERT INTO users (id, username, email, email_verified, avatar_url, preferred_language, password_hash, created_at, last_login_at, login_count)
        VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'), 1)
      `,
      args: [
        userId,
        username,
        userInfo.email || null,
        userInfo.verified || false,
        userInfo.avatarUrl || null,
        userInfo.locale || "en",
        null, // Set password_hash to null for OAuth users
      ],
    });

    // Create OAuth provider record
    await this.createOAuthProviderRecord(userId, provider, userInfo, tokenResponse);

    return {
      success: true,
      action: "register",
      user: {
        id: userId,
        username,
        email: userInfo.email,
        avatarUrl: userInfo.avatarUrl,
      },
      provider,
      isNewUser: true,
      linkedProviders: [provider],
    };
  }

  private async createOAuthProviderRecord(
    userId: string,
    provider: OAuthProvider,
    userInfo: OAuthUserInfo,
    tokenResponse: OAuthTokenResponse
  ): Promise<void> {
    const expiresAt = tokenResponse.expires_in
      ? new Date(Date.now() + tokenResponse.expires_in * 1000).toISOString()
      : null;

    await turso.execute({
      sql: `
        INSERT INTO oauth_providers (id, user_id, provider, provider_user_id, provider_email, provider_username, provider_avatar_url, access_token, refresh_token, token_expires_at, provider_data, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
      `,
      args: [
        crypto.randomUUID(),
        userId,
        provider,
        userInfo.id,
        userInfo.email || null,
        userInfo.username || null,
        userInfo.avatarUrl || null,
        tokenResponse.access_token,
        tokenResponse.refresh_token || null,
        expiresAt,
        JSON.stringify(userInfo.additional || {}),
      ],
    });
  }

  private async getUserOAuthProvider(
    userId: string,
    provider: OAuthProvider
  ): Promise<OAuthProviderAccount | null> {
    const result = await turso.execute({
      sql: "SELECT * FROM oauth_providers WHERE user_id = ? AND provider = ?",
      args: [userId, provider],
    });

    if (!result.rows || result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      id: row.id as string,
      userId: row.user_id as string,
      provider: row.provider as OAuthProvider,
      providerUserId: row.provider_user_id as string,
      providerEmail: row.provider_email as string,
      providerUsername: row.provider_username as string,
      providerAvatarUrl: row.provider_avatar_url as string,
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
    };
  }

  private async getOAuthProviderByProviderUserId(
    provider: OAuthProvider,
    providerUserId: string
  ): Promise<OAuthProviderAccount | null> {
    // Ensure values are valid strings
    if (!provider || !providerUserId) {
      console.log("Invalid provider or providerUserId:", { provider, providerUserId });
      return null;
    }

    const result = await turso.execute({
      sql: "SELECT * FROM oauth_providers WHERE provider = ? AND provider_user_id = ?",
      args: [String(provider), String(providerUserId)],
    });

    if (!result.rows || result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      id: row.id as string,
      userId: row.user_id as string,
      provider: row.provider as OAuthProvider,
      providerUserId: row.provider_user_id as string,
      providerEmail: row.provider_email as string,
      providerUsername: row.provider_username as string,
      providerAvatarUrl: row.provider_avatar_url as string,
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
    };
  }

  private async getUserByEmail(email: string): Promise<any> {
    const result = await turso.execute({
      sql: "SELECT id, username, email, avatar_url FROM users WHERE email = ?",
      args: [email],
    });

    return result.rows?.[0] || null;
  }

  private async getUserById(id: string): Promise<any> {
    const result = await turso.execute({
      sql: "SELECT id, username, email, avatar_url FROM users WHERE id = ?",
      args: [id],
    });

    if (!result.rows || result.rows.length === 0) {
      throw new Error("User not found");
    }

    return result.rows[0];
  }

  private async getUserAuthInfo(userId: string): Promise<any> {
    const result = await turso.execute({
      sql: "SELECT * FROM user_auth_info WHERE user_id = ?",
      args: [userId],
    });

    return result.rows?.[0] || null;
  }

  private async updateUserLastLogin(userId: string): Promise<void> {
    await turso.execute({
      sql: 'UPDATE users SET last_login_at = datetime("now"), login_count = login_count + 1 WHERE id = ?',
      args: [userId],
    });
  }
}

// Export singleton instance
export const oauthService = new OAuthService();
