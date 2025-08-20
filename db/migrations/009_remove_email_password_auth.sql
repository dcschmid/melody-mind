-- Migration: Remove email/password authentication
-- Description: Removes all email/password authentication related columns and tables
-- Keeps only OAuth authentication and guest access
-- Adapted for LibSQL/Turso

-- Remove email/password related columns from users table
-- We'll recreate the table with only the necessary columns

-- First, create a backup of existing OAuth users
CREATE TEMPORARY TABLE oauth_users_backup AS
SELECT DISTINCT u.id, u.username, u.avatar_url, u.preferred_language, u.created_at, u.updated_at, u.last_login_at, u.login_count
FROM users u
INNER JOIN oauth_providers op ON u.id = op.user_id;

-- Create a backup of guest users (users without OAuth providers and without email/password)
CREATE TEMPORARY TABLE guest_users_backup AS
SELECT u.id, u.username, u.avatar_url, u.preferred_language, u.created_at, u.updated_at, u.last_login_at, u.login_count
FROM users u
LEFT JOIN oauth_providers op ON u.id = op.user_id
WHERE op.id IS NULL AND (u.email IS NULL OR u.email = '') AND (u.password_hash IS NULL OR u.password_hash = '');

-- Drop the old users table
DROP TABLE IF EXISTS users;

-- Recreate users table with only necessary columns for OAuth and guest users
CREATE TABLE users (
  id TEXT PRIMARY KEY NOT NULL,
  username TEXT,
  avatar_url TEXT,
  preferred_language TEXT DEFAULT 'en',
  created_at DATETIME NOT NULL DEFAULT (datetime('now')),
  updated_at DATETIME NOT NULL DEFAULT (datetime('now')),
  last_login_at DATETIME,
  login_count INTEGER DEFAULT 0
);

-- Create indexes for the new structure
CREATE INDEX IF NOT EXISTS idx_users_username ON users (username);
CREATE INDEX IF NOT EXISTS idx_users_preferred_language ON users (preferred_language);

-- Restore OAuth users
INSERT INTO users (id, username, avatar_url, preferred_language, created_at, updated_at, last_login_at, login_count)
SELECT id, username, avatar_url, preferred_language, created_at, updated_at, last_login_at, login_count
FROM oauth_users_backup;

-- Restore guest users
INSERT INTO users (id, username, avatar_url, preferred_language, created_at, updated_at, last_login_at, login_count)
SELECT id, username, avatar_url, preferred_language, created_at, updated_at, last_login_at, login_count
FROM guest_users_backup;

-- Drop temporary backup tables
DROP TABLE IF EXISTS oauth_users_backup;
DROP TABLE IF EXISTS guest_users_backup;

-- Remove email verification and password reset related tables if they exist
DROP TABLE IF EXISTS email_verifications;
DROP TABLE IF EXISTS password_resets;

-- Drop the user_auth_info view first if it exists
DROP VIEW IF EXISTS user_auth_info;

-- Update the user_auth_info view to reflect the new structure

CREATE VIEW user_auth_info AS
SELECT 
  u.id as user_id,
  u.username,
  u.avatar_url,
  u.preferred_language,
  u.last_login_at,
  u.login_count,
  u.created_at,
  COUNT(op.id) as oauth_provider_count,
  GROUP_CONCAT(op.provider) as oauth_providers,
  CASE 
    WHEN COUNT(op.id) > 0 THEN 'oauth'
    ELSE 'guest'
  END as auth_type
FROM users u
LEFT JOIN oauth_providers op ON u.id = op.user_id
GROUP BY u.id;

-- Clean up any orphaned game data for users that no longer exist
DELETE FROM game_results WHERE user_id NOT IN (SELECT id FROM users);
DELETE FROM user_mode_stats WHERE user_id NOT IN (SELECT id FROM users);
DELETE FROM highscores WHERE user_id NOT IN (SELECT id FROM users);

-- Note: LibSQL doesn't support PRAGMA user_version, so we'll skip that
