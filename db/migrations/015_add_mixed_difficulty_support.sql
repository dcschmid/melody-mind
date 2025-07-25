-- Migration 015: Add mixed difficulty support to game_results table
-- Created: 2025-01-25
-- 
-- This migration properly updates the CHECK constraint for difficulty 
-- to include 'mixed' using the standard SQLite table recreation approach.

-- Step 1: Clean up any existing temp table and create new table with updated constraints
DROP TABLE IF EXISTS game_results_temp;

CREATE TABLE game_results_temp (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard', 'mixed')),
  game_mode TEXT NOT NULL CHECK (game_mode IN ('quiz', 'chronology', 'time-pressure')),
  language TEXT NOT NULL DEFAULT 'en',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Step 2: Copy all existing data
INSERT INTO game_results_temp 
SELECT id, user_id, score, category, difficulty, game_mode, language, created_at 
FROM game_results;

-- Step 3: Drop the old table
DROP TABLE game_results;

-- Step 4: Rename temp table to original name
ALTER TABLE game_results_temp RENAME TO game_results;