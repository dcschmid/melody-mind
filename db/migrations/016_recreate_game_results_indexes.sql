-- Migration 016: Recreate game_results indexes after schema update
-- Created: 2025-01-25
-- 
-- This migration recreates the indexes for the game_results table
-- after the difficulty constraint was updated in migration 015.

CREATE INDEX IF NOT EXISTS idx_game_results_user_id ON game_results (user_id);
CREATE INDEX IF NOT EXISTS idx_game_results_game_mode ON game_results (game_mode);
CREATE INDEX IF NOT EXISTS idx_game_results_category ON game_results (category);
CREATE INDEX IF NOT EXISTS idx_game_results_difficulty ON game_results (difficulty);
CREATE INDEX IF NOT EXISTS idx_game_results_created_at ON game_results (created_at);