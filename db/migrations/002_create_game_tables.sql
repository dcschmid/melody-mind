-- Migration: Create game tables
-- Description: Creates tables for game results, user statistics, and highscores

-- Drop existing tables first (in reverse order to avoid foreign key constraints)
DROP TABLE IF EXISTS highscores;
DROP TABLE IF EXISTS user_mode_stats;
DROP TABLE IF EXISTS game_results;

-- Drop existing indexes if they exist
DROP INDEX IF EXISTS idx_game_results_user_id;
DROP INDEX IF EXISTS idx_game_results_game_mode;
DROP INDEX IF EXISTS idx_game_results_category;
DROP INDEX IF EXISTS idx_highscores_user_id;
DROP INDEX IF EXISTS idx_highscores_game_mode;
DROP INDEX IF EXISTS idx_highscores_category;

-- Create game_results table
CREATE TABLE game_results (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL,
  game_mode TEXT NOT NULL CHECK (game_mode IN ('quiz', 'chronology')),
  score INTEGER NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  created_at DATETIME NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create user_mode_stats table
CREATE TABLE user_mode_stats (
  user_id TEXT NOT NULL,
  game_mode TEXT NOT NULL CHECK (game_mode IN ('quiz', 'chronology')),
  total_score INTEGER NOT NULL DEFAULT 0,
  games_played INTEGER NOT NULL DEFAULT 0,
  highest_score INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, game_mode),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create highscores table
CREATE TABLE highscores (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL,
  game_mode TEXT NOT NULL CHECK (game_mode IN ('quiz', 'chronology')),
  score INTEGER NOT NULL,
  category TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for performance optimization
CREATE INDEX idx_game_results_user_id ON game_results (user_id);
CREATE INDEX idx_game_results_game_mode ON game_results (game_mode);
CREATE INDEX idx_game_results_category ON game_results (category);

CREATE INDEX idx_highscores_user_id ON highscores (user_id);
CREATE INDEX idx_highscores_game_mode ON highscores (game_mode);
CREATE INDEX idx_highscores_category ON highscores (category);
CREATE INDEX idx_highscores_score ON highscores (score DESC);