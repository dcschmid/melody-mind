-- Migration: Clean up temporary tables
-- Description: Removes temporary tables created during migration process

-- Drop temporary tables that might have been created
DROP TABLE IF EXISTS highscores_new;
DROP TABLE IF EXISTS game_results_new;
DROP TABLE IF EXISTS user_mode_stats_new;