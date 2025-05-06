-- Migration: Create users table for authentication
-- Description: Creates the users table with all necessary fields for authentication

-- Drop existing table first
DROP TABLE IF EXISTS users;

-- Drop existing indexes if they exist
DROP INDEX IF EXISTS idx_users_email;
DROP INDEX IF EXISTS idx_users_username;
DROP INDEX IF EXISTS idx_users_verification_token;
DROP INDEX IF EXISTS idx_users_reset_token;

-- Create users table with new schema
CREATE TABLE users (
  id TEXT PRIMARY KEY NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  username TEXT,
  email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  verification_token TEXT,
  verification_token_expires_at DATETIME,
  reset_token TEXT,
  reset_token_expires_at DATETIME,
  created_at DATETIME NOT NULL DEFAULT (datetime('now')),
  updated_at DATETIME NOT NULL DEFAULT (datetime('now'))
);

-- Create indexes for performance optimization
CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_username ON users (username);
CREATE INDEX idx_users_verification_token ON users (verification_token);
CREATE INDEX idx_users_reset_token ON users (reset_token);

-- Create trigger to update the updated_at timestamp automatically
CREATE TRIGGER IF NOT EXISTS update_users_timestamp 
  AFTER UPDATE ON users 
  FOR EACH ROW 
  WHEN NEW.updated_at = OLD.updated_at
BEGIN
  UPDATE users SET updated_at = datetime('now') 
  WHERE id = NEW.id;
END;
