-- Migration: Add language column to highscores table
-- Description: Adds language column to support language-specific highscores

-- Clean up any existing temporary tables
DROP TABLE IF EXISTS user_mode_stats_new;

-- Check if tables exist and create them with language column if they don't
-- This handles the case where migrations were marked as applied but tables were deleted

-- Create game_results table if it doesn't exist (with language column)
CREATE TABLE IF NOT EXISTS game_results (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL,
  game_mode TEXT NOT NULL CHECK (game_mode IN ('quiz', 'chronology')),
  score INTEGER NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  language TEXT NOT NULL DEFAULT 'en',
  created_at DATETIME NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create highscores table if it doesn't exist (with language column)
CREATE TABLE IF NOT EXISTS highscores (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL,
  game_mode TEXT NOT NULL CHECK (game_mode IN ('quiz', 'chronology')),
  score INTEGER NOT NULL,
  category TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'en',
  created_at DATETIME NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create user_mode_stats table if it doesn't exist (with language in primary key)
CREATE TABLE IF NOT EXISTS user_mode_stats (
  user_id TEXT NOT NULL,
  game_mode TEXT NOT NULL CHECK (game_mode IN ('quiz', 'chronology')),
  language TEXT NOT NULL DEFAULT 'en',
  total_score INTEGER NOT NULL DEFAULT 0,
  games_played INTEGER NOT NULL DEFAULT 0,
  highest_score INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, game_mode, language),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Add language column to existing tables if they exist but don't have the column
-- Skip if column already exists (since we created tables with language column above)

-- For user_mode_stats, we need to recreate the table to change the primary key
-- Skip if table already exists with language column (created above)

-- Create new indexes for language-specific queries
CREATE INDEX IF NOT EXISTS idx_highscores_language ON highscores (language);
CREATE INDEX IF NOT EXISTS idx_highscores_language_mode ON highscores (language, game_mode);
CREATE INDEX IF NOT EXISTS idx_highscores_language_category ON highscores (language, category);
CREATE INDEX IF NOT EXISTS idx_highscores_language_score ON highscores (language, score DESC);

CREATE INDEX IF NOT EXISTS idx_game_results_language ON game_results (language);
CREATE INDEX IF NOT EXISTS idx_game_results_language_mode ON game_results (language, game_mode);
CREATE INDEX IF NOT EXISTS idx_game_results_language_category ON game_results (language, category);

CREATE INDEX IF NOT EXISTS idx_user_mode_stats_language ON user_mode_stats (language);
CREATE INDEX IF NOT EXISTS idx_user_mode_stats_language_mode ON user_mode_stats (language, game_mode);

-- Create basic indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_game_results_user_id ON game_results (user_id);
CREATE INDEX IF NOT EXISTS idx_game_results_game_mode ON game_results (game_mode);
CREATE INDEX IF NOT EXISTS idx_game_results_category ON game_results (category);

CREATE INDEX IF NOT EXISTS idx_highscores_user_id ON highscores (user_id);
CREATE INDEX IF NOT EXISTS idx_highscores_game_mode ON highscores (game_mode);
CREATE INDEX IF NOT EXISTS idx_highscores_category ON highscores (category);
CREATE INDEX IF NOT EXISTS idx_highscores_score ON highscores (score DESC);