-- Migration: Add time-pressure game mode support
-- Created: 2025-01-25
-- 
-- This migration adds support for the new "time-pressure" game mode by:
-- 1. Creating temporary tables with updated constraints
-- 2. Copying existing data to the new tables
-- 3. Dropping old tables and renaming new ones

-- Cleanup any leftover temporary tables from previous failed migrations
DROP TABLE IF EXISTS game_results_new;
DROP TABLE IF EXISTS user_mode_stats_new;
DROP TABLE IF EXISTS highscores_new;

-- Step 1: Create new game_results table with time-pressure support
CREATE TABLE game_results_new (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  game_mode TEXT NOT NULL CHECK (game_mode IN ('quiz', 'chronology', 'time-pressure')),
  language TEXT NOT NULL DEFAULT 'en',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Step 2: Copy data from old table to new table
INSERT INTO game_results_new SELECT * FROM game_results;

-- Step 3: Drop old table and rename new table
DROP TABLE game_results;
ALTER TABLE game_results_new RENAME TO game_results;

-- Step 4: Create new user_mode_stats table with time-pressure support
CREATE TABLE user_mode_stats_new (
  user_id TEXT NOT NULL,
  game_mode TEXT NOT NULL CHECK (game_mode IN ('quiz', 'chronology', 'time-pressure')),
  language TEXT NOT NULL DEFAULT 'en',
  total_score INTEGER NOT NULL DEFAULT 0,
  games_played INTEGER NOT NULL DEFAULT 0,
  highest_score INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (user_id, game_mode, language),
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Copy data from old table to new table
INSERT INTO user_mode_stats_new SELECT * FROM user_mode_stats;

-- Drop old table and rename new table
DROP TABLE user_mode_stats;
ALTER TABLE user_mode_stats_new RENAME TO user_mode_stats;

-- Step 5: Create new highscores table with time-pressure support
CREATE TABLE highscores_new (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  category TEXT NOT NULL,
  game_mode TEXT NOT NULL CHECK (game_mode IN ('quiz', 'chronology', 'time-pressure')),
  language TEXT NOT NULL DEFAULT 'en',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Copy data from old table to new table
INSERT INTO highscores_new SELECT * FROM highscores;

-- Drop old table and rename new table
DROP TABLE highscores;
ALTER TABLE highscores_new RENAME TO highscores;