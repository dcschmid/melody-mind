-- Migration: Recreate users table with nullable password_hash
-- Description: Creates users table with password_hash nullable for OAuth users

DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id TEXT PRIMARY KEY NOT NULL,
  email TEXT UNIQUE,
  password_hash TEXT, -- Nullable for OAuth users
  username TEXT,
  email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  verification_token TEXT,
  verification_token_expires_at DATETIME,
  reset_token TEXT,
  reset_token_expires_at DATETIME,
  avatar_url TEXT,
  preferred_language TEXT DEFAULT 'en',
  created_at DATETIME NOT NULL DEFAULT (datetime('now')),
  updated_at DATETIME NOT NULL DEFAULT (datetime('now')),
  last_login_at DATETIME,
  login_count INTEGER DEFAULT 0
);

-- Create indexes
CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_username ON users (username);
CREATE INDEX idx_users_verification_token ON users (verification_token);
CREATE INDEX idx_users_reset_token ON users (reset_token);

-- Create trigger
CREATE TRIGGER IF NOT EXISTS update_users_timestamp 
  AFTER UPDATE ON users 
  FOR EACH ROW 
  WHEN NEW.updated_at = OLD.updated_at
BEGIN
  UPDATE users SET updated_at = datetime('now') 
  WHERE id = NEW.id;
END;