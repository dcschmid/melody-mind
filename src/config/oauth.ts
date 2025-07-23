/**
 * OAuth Provider Configuration
 *
 * This file contains the configuration for all supported OAuth providers.
 * Environment variables are used for sensitive data like client secrets.
 */

import type { OAuthProvider, OAuthProviderConfig } from "../types/oauth";

/**
 * OAuth provider configurations
 */
export const oauthProviders: Record<OAuthProvider, OAuthProviderConfig> = {
  spotify: {
    name: "spotify",
    displayName: "Spotify",
    clientId: import.meta.env.SPOTIFY_CLIENT_ID || "",
    clientSecret: import.meta.env.SPOTIFY_CLIENT_SECRET || "",
    authUrl: "https://accounts.spotify.com/authorize",
    tokenUrl: "https://accounts.spotify.com/api/token",
    userInfoUrl: "https://api.spotify.com/v1/me",
    scopes: [
      "user-read-email",
      "user-read-private",
      "user-top-read",
      "playlist-read-private",
      "user-library-read",
    ],
    icon: "music",
    color: "#1DB954",
    usePKCE: true,
  },

  google: {
    name: "google",
    displayName: "Google",
    clientId: import.meta.env.GOOGLE_CLIENT_ID || "",
    clientSecret: import.meta.env.GOOGLE_CLIENT_SECRET || "",
    authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: "https://oauth2.googleapis.com/token",
    userInfoUrl: "https://www.googleapis.com/oauth2/v2/userinfo",
    scopes: ["openid", "email", "profile"],
    icon: "search",
    color: "#4285F4",
    usePKCE: true,
  },

  discord: {
    name: "discord",
    displayName: "Discord",
    clientId: import.meta.env.DISCORD_CLIENT_ID || "",
    clientSecret: import.meta.env.DISCORD_CLIENT_SECRET || "",
    authUrl: "https://discord.com/api/oauth2/authorize",
    tokenUrl: "https://discord.com/api/oauth2/token",
    userInfoUrl: "https://discord.com/api/users/@me",
    scopes: ["identify", "email"],
    icon: "gamepad",
    color: "#5865F2",
    usePKCE: false,
  },

  yahoo: {
    name: "yahoo",
    displayName: "Yahoo",
    clientId: import.meta.env.YAHOO_CLIENT_ID || "",
    clientSecret: import.meta.env.YAHOO_CLIENT_SECRET || "",
    authUrl: "https://api.login.yahoo.com/oauth2/request_auth",
    tokenUrl: "https://api.login.yahoo.com/oauth2/get_token",
    userInfoUrl: "https://api.login.yahoo.com/openid/v1/userinfo",
    scopes: ["openid", "email", "profile"],
    icon: "mail",
    color: "#6001D2",
    usePKCE: true,
  },
};

/**
 * Get OAuth provider configuration
 */
export function getOAuthProvider(provider: OAuthProvider): OAuthProviderConfig | undefined {
  return oauthProviders[provider];
}

/**
 * Get all enabled OAuth providers
 */
export function getEnabledOAuthProviders(): OAuthProviderConfig[] {
  return Object.values(oauthProviders).filter(
    (provider) => provider.clientId && provider.clientSecret
  );
}

/**
 * Check if OAuth provider is enabled
 */
export function isOAuthProviderEnabled(provider: OAuthProvider): boolean {
  const config = getOAuthProvider(provider);
  return !!(config?.clientId && config?.clientSecret);
}

/**
 * OAuth redirect URIs for each provider
 */
export function getOAuthRedirectUri(provider: OAuthProvider, baseUrl: string): string {
  return `${baseUrl}/api/auth/oauth/callback/${provider}`;
}

/**
 * OAuth state parameter generation
 */
export function generateOAuthState(): string {
  return crypto.randomUUID();
}

/**
 * PKCE code verifier generation
 */
export function generateCodeVerifier(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode.apply(null, Array.from(array)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

/**
 * PKCE code challenge generation
 */
export async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(digest))))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

/**
 * Environment variables that need to be set for OAuth
 */
export const requiredEnvVars = {
  spotify: ["SPOTIFY_CLIENT_ID", "SPOTIFY_CLIENT_SECRET"],
  google: ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"],
  discord: ["DISCORD_CLIENT_ID", "DISCORD_CLIENT_SECRET"],
  yahoo: ["YAHOO_CLIENT_ID", "YAHOO_CLIENT_SECRET"],
} as const;
