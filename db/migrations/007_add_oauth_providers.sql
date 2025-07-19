-- Migration: Add OAuth provider support
-- Description: Adds tables for OAuth provider authentication and account linking
-- This allows users to login with OAuth providers and link multiple providers to one account

-- Create OAuth providers table for external authentication
CREATE TABLE IF NOT EXISTS oauth_providers (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('spotify', 'google', 'apple', 'discord', 'yahoo')),
  provider_user_id TEXT NOT NULL,
  provider_email TEXT,
  provider_username TEXT,
  provider_avatar_url TEXT,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at DATETIME,
  provider_data TEXT, -- JSON data for additional provider-specific information
  created_at DATETIME NOT NULL DEFAULT (datetime('now')),
  updated_at DATETIME NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(provider, provider_user_id) -- Prevent duplicate provider accounts
);

-- Create index for efficient OAuth lookups
CREATE INDEX IF NOT EXISTS idx_oauth_providers_user_id ON oauth_providers (user_id);
CREATE INDEX IF NOT EXISTS idx_oauth_providers_provider ON oauth_providers (provider);
CREATE INDEX IF NOT EXISTS idx_oauth_providers_provider_user_id ON oauth_providers (provider, provider_user_id);
CREATE INDEX IF NOT EXISTS idx_oauth_providers_provider_email ON oauth_providers (provider, provider_email);

-- Create OAuth sessions table for managing OAuth flow state
CREATE TABLE IF NOT EXISTS oauth_sessions (
  id TEXT PRIMARY KEY NOT NULL,
  state TEXT NOT NULL UNIQUE,
  provider TEXT NOT NULL,
  redirect_uri TEXT,
  code_verifier TEXT, -- For PKCE flow
  linking_user_id TEXT, -- If user is linking to existing account
  created_at DATETIME NOT NULL DEFAULT (datetime('now')),
  expires_at DATETIME NOT NULL DEFAULT (datetime('now', '+10 minutes')),
  FOREIGN KEY (linking_user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create index for OAuth session lookups
CREATE INDEX IF NOT EXISTS idx_oauth_sessions_state ON oauth_sessions (state);
CREATE INDEX IF NOT EXISTS idx_oauth_sessions_provider ON oauth_sessions (provider);
CREATE INDEX IF NOT EXISTS idx_oauth_sessions_expires_at ON oauth_sessions (expires_at);

-- Add OAuth-related columns to users table if they don't exist
-- Note: Some columns may already exist from previous migrations
-- We'll use a different approach to avoid duplicate column errors

-- Check if columns exist and add them if needed
-- SQLite doesn't support IF NOT EXISTS for ALTER TABLE ADD COLUMN
-- So we'll handle this in the setup script instead

-- Update existing users to have email_verified = TRUE (since they registered via email)
-- Only update if the column exists
UPDATE users SET email_verified = TRUE WHERE email IS NOT NULL AND email_verified IS NULL;

-- Create trigger to update OAuth providers updated_at timestamp
CREATE TRIGGER IF NOT EXISTS update_oauth_providers_updated_at
  AFTER UPDATE ON oauth_providers
  FOR EACH ROW
BEGIN
  UPDATE oauth_providers SET updated_at = datetime('now') WHERE id = NEW.id;
END;

-- Create trigger to clean up expired OAuth sessions
CREATE TRIGGER IF NOT EXISTS cleanup_expired_oauth_sessions
  AFTER INSERT ON oauth_sessions
  FOR EACH ROW
BEGIN
  DELETE FROM oauth_sessions WHERE expires_at < datetime('now');
END;

-- Create view for user authentication info (combines local and OAuth)
CREATE VIEW IF NOT EXISTS user_auth_info AS
SELECT 
  u.id as user_id,
  u.username,
  u.email,
  u.email_verified,
  u.avatar_url,
  u.preferred_language,
  u.last_login_at,
  u.login_count,
  u.created_at,
  CASE 
    WHEN u.password_hash IS NOT NULL THEN 1 
    ELSE 0 
  END as has_password,
  COUNT(op.id) as oauth_provider_count,
  GROUP_CONCAT(op.provider) as oauth_providers
FROM users u
LEFT JOIN oauth_providers op ON u.id = op.user_id
GROUP BY u.id;