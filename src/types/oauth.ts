/**
 * OAuth Provider Types and Interfaces
 *
 * This file defines all types related to OAuth authentication,
 * provider management, and account linking functionality.
 */

/**
 * Supported OAuth providers
 */
export type OAuthProvider = "spotify" | "google" | "discord" | "yahoo";

/**
 * OAuth provider configuration
 */
export interface OAuthProviderConfig {
  name: string;
  displayName: string;
  clientId: string;
  clientSecret: string;
  authUrl: string;
  tokenUrl: string;
  userInfoUrl: string;
  scopes: string[];
  icon: string;
  color: string;
  usePKCE?: boolean; // Whether to use PKCE for security
}

/**
 * OAuth provider account information
 */
export interface OAuthProviderAccount {
  id: string;
  userId: string;
  provider: OAuthProvider;
  providerUserId: string;
  providerEmail?: string;
  providerUsername?: string;
  providerAvatarUrl?: string;
  accessToken?: string;
  refreshToken?: string;
  tokenExpiresAt?: string;
  providerData?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

/**
 * OAuth session for managing OAuth flow state
 */
export interface OAuthSession {
  id: string;
  state: string;
  provider: OAuthProvider;
  redirectUri?: string;
  codeVerifier?: string;
  linkingUserId?: string; // If user is linking to existing account
  createdAt: string;
  expiresAt: string;
}

/**
 * OAuth user information from provider
 */
export interface OAuthUserInfo {
  id: string;
  email?: string;
  username?: string;
  name?: string;
  avatarUrl?: string;
  verified?: boolean;
  locale?: string;
  additional?: Record<string, any>;
}

/**
 * OAuth token response
 */
export interface OAuthTokenResponse {
  access_token: string;
  token_type: string;
  expires_in?: number;
  refresh_token?: string;
  scope?: string;
}

/**
 * OAuth authorization request parameters
 */
export interface OAuthAuthRequest {
  provider: OAuthProvider;
  redirectUri: string;
  state: string;
  codeVerifier?: string;
  linkingUserId?: string;
}

/**
 * OAuth callback parameters
 */
export interface OAuthCallbackParams {
  code: string;
  state: string;
  error?: string;
  error_description?: string;
}

/**
 * OAuth linking result
 */
export interface OAuthLinkingResult {
  success: boolean;
  action: "login" | "register" | "link";
  user: {
    id: string;
    username: string;
    email?: string;
    avatarUrl?: string;
  };
  provider: OAuthProvider;
  isNewUser: boolean;
  linkedProviders: OAuthProvider[];
}

/**
 * OAuth error types
 */
export type OAuthError =
  | "invalid_request"
  | "unauthorized_client"
  | "access_denied"
  | "unsupported_response_type"
  | "invalid_scope"
  | "server_error"
  | "temporarily_unavailable"
  | "provider_error"
  | "linking_failed"
  | "account_exists"
  | "session_expired";

/**
 * OAuth error response
 */
export interface OAuthErrorResponse {
  error: OAuthError;
  error_description?: string;
  error_uri?: string;
}

/**
 * User authentication info (includes OAuth providers)
 */
export interface UserAuthInfo {
  userId: string;
  username: string;
  email?: string;
  emailVerified: boolean;
  avatarUrl?: string;
  preferredLanguage: string;
  lastLoginAt?: string;
  loginCount: number;
  createdAt: string;
  hasPassword: boolean;
  oauthProviderCount: number;
  oauthProviders: OAuthProvider[];
}

/**
 * Provider-specific user data interfaces
 */
export interface SpotifyUserData {
  id: string;
  display_name?: string;
  email?: string;
  images?: Array<{
    url: string;
    height?: number;
    width?: number;
  }>;
  country?: string;
  product?: string; // free, premium
  playlists?: any[];
  top_artists?: any[];
  top_tracks?: any[];
}

export interface GoogleUserData {
  sub: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  email?: string;
  email_verified?: boolean;
  locale?: string;
}

export interface AppleUserData {
  sub: string;
  email?: string;
  email_verified?: boolean;
  name?: {
    firstName?: string;
    lastName?: string;
  };
}

export interface DiscordUserData {
  id: string;
  username: string;
  discriminator: string;
  avatar?: string;
  email?: string;
  verified?: boolean;
  locale?: string;
}

export interface YahooUserData {
  sub: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  locale?: string;
}
