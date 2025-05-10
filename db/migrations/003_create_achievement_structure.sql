-- Migration: Create Achievement System Structure
-- Description: Creates all tables and indexes for the achievement system

-- =============================================
-- Drop existing indexes if they exist
-- =============================================
DROP INDEX IF EXISTS idx_achievements_category;
DROP INDEX IF EXISTS idx_achievement_translations_language;
DROP INDEX IF EXISTS idx_user_achievements_user;
DROP INDEX IF EXISTS idx_user_achievements_achievement;
DROP INDEX IF EXISTS idx_user_achievements_unlocked;

DROP INDEX IF EXISTS idx_user_played_genres_user;
DROP INDEX IF EXISTS idx_user_played_genres_genre;
DROP INDEX IF EXISTS idx_user_game_series_user;
DROP INDEX IF EXISTS idx_user_answer_stats_user;
DROP INDEX IF EXISTS idx_user_seasonal_events_user;
DROP INDEX IF EXISTS idx_user_seasonal_events_event;

DROP INDEX IF EXISTS idx_user_daily_activity_user;
DROP INDEX IF EXISTS idx_user_daily_activity_date;
DROP INDEX IF EXISTS idx_user_daily_activity_user_date;

DROP INDEX IF EXISTS idx_user_streaks_user;

-- =============================================
-- Drop existing tables (in reverse order to avoid foreign key constraints)
-- =============================================
DROP TABLE IF EXISTS user_achievements;
DROP TABLE IF EXISTS achievement_translations;
DROP TABLE IF EXISTS achievements;
DROP TABLE IF EXISTS achievement_categories;

DROP TABLE IF EXISTS user_seasonal_events;
DROP TABLE IF EXISTS user_answer_stats;
DROP TABLE IF EXISTS user_game_series;
DROP TABLE IF EXISTS user_played_genres;

DROP TABLE IF EXISTS user_daily_activity;
DROP TABLE IF EXISTS user_streaks;

-- =============================================
-- Create base achievement tables
-- =============================================

-- Create achievement_categories table
CREATE TABLE achievement_categories (
  id TEXT PRIMARY KEY NOT NULL,
  code TEXT UNIQUE NOT NULL,
  points INTEGER NOT NULL,
  icon_path TEXT NOT NULL,
  sort_order INTEGER NOT NULL,
  
  CONSTRAINT valid_category_code CHECK (code IN ('bronze', 'silver', 'gold', 'platinum', 'diamond'))
);

-- Create achievements table
CREATE TABLE achievements (
  id TEXT PRIMARY KEY NOT NULL,
  code TEXT UNIQUE NOT NULL,
  category_id TEXT NOT NULL,
  condition_type TEXT NOT NULL,
  condition_value INTEGER NOT NULL,
  rarity_percentage DECIMAL(5,2) DEFAULT 0.00,
  icon_path TEXT,
  
  FOREIGN KEY (category_id) REFERENCES achievement_categories(id) ON DELETE CASCADE
);

-- Create achievement_translations table
CREATE TABLE achievement_translations (
  achievement_id TEXT NOT NULL,
  language TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  
  PRIMARY KEY (achievement_id, language),
  FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE
);

-- Create user_achievements table
CREATE TABLE user_achievements (
  user_id TEXT NOT NULL,
  achievement_id TEXT NOT NULL,
  current_progress INTEGER NOT NULL DEFAULT 0,
  unlocked_at DATETIME,
  
  PRIMARY KEY (user_id, achievement_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE
);

-- =============================================
-- Create extended achievement tables
-- =============================================

-- Create user_played_genres table for genre_explorer achievements
CREATE TABLE user_played_genres (
  user_id TEXT NOT NULL,
  genre_id TEXT NOT NULL,
  played_at DATETIME NOT NULL DEFAULT (datetime('now')),
  
  PRIMARY KEY (user_id, genre_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create user_game_series table for game_series achievements
CREATE TABLE user_game_series (
  user_id TEXT NOT NULL PRIMARY KEY,
  current_series INTEGER NOT NULL DEFAULT 0,
  max_series INTEGER NOT NULL DEFAULT 0,
  last_updated DATETIME NOT NULL DEFAULT (datetime('now')),
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create user_answer_stats table for quick_answer achievements
CREATE TABLE user_answer_stats (
  user_id TEXT NOT NULL PRIMARY KEY,
  quick_answers INTEGER NOT NULL DEFAULT 0,
  last_updated DATETIME NOT NULL DEFAULT (datetime('now')),
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create user_seasonal_events table for seasonal_event achievements
CREATE TABLE user_seasonal_events (
  user_id TEXT NOT NULL,
  event_id TEXT NOT NULL,
  participated_at DATETIME NOT NULL DEFAULT (datetime('now')),
  
  PRIMARY KEY (user_id, event_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =============================================
-- Create daily activity and streak tables
-- =============================================

-- Create user_daily_activity table
CREATE TABLE user_daily_activity (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL,
  date DATE NOT NULL,
  activity_count INTEGER NOT NULL DEFAULT 0,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create user_streaks table
CREATE TABLE user_streaks (
  user_id TEXT PRIMARY KEY NOT NULL,
  current_streak INTEGER NOT NULL DEFAULT 0,
  max_streak INTEGER NOT NULL DEFAULT 0,
  last_activity_date DATE,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =============================================
-- Create indexes for performance optimization
-- =============================================
CREATE INDEX idx_achievements_category ON achievements(category_id);
CREATE INDEX idx_achievement_translations_language ON achievement_translations(language);
CREATE INDEX idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_achievement ON user_achievements(achievement_id);
CREATE INDEX idx_user_achievements_unlocked ON user_achievements(unlocked_at);

CREATE INDEX idx_user_played_genres_user ON user_played_genres(user_id);
CREATE INDEX idx_user_played_genres_genre ON user_played_genres(genre_id);
CREATE INDEX idx_user_game_series_user ON user_game_series(user_id);
CREATE INDEX idx_user_answer_stats_user ON user_answer_stats(user_id);
CREATE INDEX idx_user_seasonal_events_user ON user_seasonal_events(user_id);
CREATE INDEX idx_user_seasonal_events_event ON user_seasonal_events(event_id);

CREATE INDEX idx_user_daily_activity_user ON user_daily_activity(user_id);
CREATE INDEX idx_user_daily_activity_date ON user_daily_activity(date);
CREATE INDEX idx_user_daily_activity_user_date ON user_daily_activity(user_id, date);

CREATE INDEX idx_user_streaks_user ON user_streaks(user_id);

-- =============================================
-- Insert initial achievement categories
-- =============================================
INSERT INTO achievement_categories (id, code, points, icon_path, sort_order) VALUES
('cat_bronze', 'bronze', 10, '/icons/achievements/categories/bronze.svg', 1),
('cat_silver', 'silver', 25, '/icons/achievements/categories/silver.svg', 2),
('cat_gold', 'gold', 50, '/icons/achievements/categories/gold.svg', 3),
('cat_platinum', 'platinum', 100, '/icons/achievements/categories/platinum.svg', 4),
('cat_diamond', 'diamond', 200, '/icons/achievements/categories/diamond.svg', 5);

-- =============================================
-- Insert achievement definitions (without translations)
-- =============================================

-- Spielzähler-Achievements
INSERT INTO achievements (id, code, category_id, condition_type, condition_value, icon_path) VALUES
('ach_games_1', 'games_played_1', 'cat_bronze', 'games_played', 1, '/icons/achievements/games_played/icon.svg'),
('ach_games_5', 'games_played_5', 'cat_bronze', 'games_played', 5, '/icons/achievements/games_played/icon.svg'),
('ach_games_10', 'games_played_10', 'cat_bronze', 'games_played', 10, '/icons/achievements/games_played/icon.svg'),
('ach_games_25', 'games_played_25', 'cat_silver', 'games_played', 25, '/icons/achievements/games_played/icon.svg'),
('ach_games_50', 'games_played_50', 'cat_silver', 'games_played', 50, '/icons/achievements/games_played/icon.svg'),
('ach_games_75', 'games_played_75', 'cat_silver', 'games_played', 75, '/icons/achievements/games_played/icon.svg'),
('ach_games_100', 'games_played_100', 'cat_gold', 'games_played', 100, '/icons/achievements/games_played/icon.svg'),
('ach_games_150', 'games_played_150', 'cat_gold', 'games_played', 150, '/icons/achievements/games_played/icon.svg'),
('ach_games_200', 'games_played_200', 'cat_gold', 'games_played', 200, '/icons/achievements/games_played/icon.svg'),
('ach_games_300', 'games_played_300', 'cat_platinum', 'games_played', 300, '/icons/achievements/games_played/icon.svg'),
('ach_games_400', 'games_played_400', 'cat_platinum', 'games_played', 400, '/icons/achievements/games_played/icon.svg'),
('ach_games_500', 'games_played_500', 'cat_platinum', 'games_played', 500, '/icons/achievements/games_played/icon.svg'),
('ach_games_750', 'games_played_750', 'cat_diamond', 'games_played', 750, '/icons/achievements/games_played/icon.svg'),
('ach_games_1000', 'games_played_1000', 'cat_diamond', 'games_played', 1000, '/icons/achievements/games_played/icon.svg'),
('ach_games_1500', 'games_played_1500', 'cat_diamond', 'games_played', 1500, '/icons/achievements/games_played/icon.svg'),
('ach_games_2000', 'games_played_2000', 'cat_diamond', 'games_played', 2000, '/icons/achievements/games_played/icon.svg'),
('ach_games_2500', 'games_played_2500', 'cat_diamond', 'games_played', 2500, '/icons/achievements/games_played/icon.svg'),
('ach_games_3000', 'games_played_3000', 'cat_diamond', 'games_played', 3000, '/icons/achievements/games_played/icon.svg'),
('ach_games_4000', 'games_played_4000', 'cat_diamond', 'games_played', 4000, '/icons/achievements/games_played/icon.svg'),
('ach_games_5000', 'games_played_5000', 'cat_diamond', 'games_played', 5000, '/icons/achievements/games_played/icon.svg');

-- Perfekte-Spiele-Achievements
INSERT INTO achievements (id, code, category_id, condition_type, condition_value, icon_path) VALUES
('ach_perfect_1', 'perfect_games_1', 'cat_bronze', 'perfect_games', 1, '/icons/achievements/perfect_games/icon.svg'),
('ach_perfect_2', 'perfect_games_2', 'cat_bronze', 'perfect_games', 2, '/icons/achievements/perfect_games/icon.svg'),
('ach_perfect_3', 'perfect_games_3', 'cat_bronze', 'perfect_games', 3, '/icons/achievements/perfect_games/icon.svg'),
('ach_perfect_5', 'perfect_games_5', 'cat_silver', 'perfect_games', 5, '/icons/achievements/perfect_games/icon.svg'),
('ach_perfect_7', 'perfect_games_7', 'cat_silver', 'perfect_games', 7, '/icons/achievements/perfect_games/icon.svg'),
('ach_perfect_10', 'perfect_games_10', 'cat_silver', 'perfect_games', 10, '/icons/achievements/perfect_games/icon.svg'),
('ach_perfect_15', 'perfect_games_15', 'cat_gold', 'perfect_games', 15, '/icons/achievements/perfect_games/icon.svg'),
('ach_perfect_20', 'perfect_games_20', 'cat_gold', 'perfect_games', 20, '/icons/achievements/perfect_games/icon.svg'),
('ach_perfect_25', 'perfect_games_25', 'cat_gold', 'perfect_games', 25, '/icons/achievements/perfect_games/icon.svg'),
('ach_perfect_30', 'perfect_games_30', 'cat_platinum', 'perfect_games', 30, '/icons/achievements/perfect_games/icon.svg'),
('ach_perfect_40', 'perfect_games_40', 'cat_platinum', 'perfect_games', 40, '/icons/achievements/perfect_games/icon.svg'),
('ach_perfect_50', 'perfect_games_50', 'cat_platinum', 'perfect_games', 50, '/icons/achievements/perfect_games/icon.svg'),
('ach_perfect_75', 'perfect_games_75', 'cat_diamond', 'perfect_games', 75, '/icons/achievements/perfect_games/icon.svg'),
('ach_perfect_100', 'perfect_games_100', 'cat_diamond', 'perfect_games', 100, '/icons/achievements/perfect_games/icon.svg'),
('ach_perfect_150', 'perfect_games_150', 'cat_diamond', 'perfect_games', 150, '/icons/achievements/perfect_games/icon.svg'),
('ach_perfect_200', 'perfect_games_200', 'cat_diamond', 'perfect_games', 200, '/icons/achievements/perfect_games/icon.svg'),
('ach_perfect_300', 'perfect_games_300', 'cat_diamond', 'perfect_games', 300, '/icons/achievements/perfect_games/icon.svg'),
('ach_perfect_400', 'perfect_games_400', 'cat_diamond', 'perfect_games', 400, '/icons/achievements/perfect_games/icon.svg'),
('ach_perfect_500', 'perfect_games_500', 'cat_diamond', 'perfect_games', 500, '/icons/achievements/perfect_games/icon.svg');

-- Punktestand-Achievements
INSERT INTO achievements (id, code, category_id, condition_type, condition_value, icon_path) VALUES
('ach_score_1000', 'total_score_1000', 'cat_bronze', 'total_score', 1000, '/icons/achievements/total_score/icon.svg'),
('ach_score_2500', 'total_score_2500', 'cat_bronze', 'total_score', 2500, '/icons/achievements/total_score/icon.svg'),
('ach_score_5000', 'total_score_5000', 'cat_bronze', 'total_score', 5000, '/icons/achievements/total_score/icon.svg'),
('ach_score_10000', 'total_score_10000', 'cat_silver', 'total_score', 10000, '/icons/achievements/total_score/icon.svg'),
('ach_score_25000', 'total_score_25000', 'cat_silver', 'total_score', 25000, '/icons/achievements/total_score/icon.svg'),
('ach_score_50000', 'total_score_50000', 'cat_silver', 'total_score', 50000, '/icons/achievements/total_score/icon.svg'),
('ach_score_75000', 'total_score_75000', 'cat_gold', 'total_score', 75000, '/icons/achievements/total_score/icon.svg'),
('ach_score_100000', 'total_score_100000', 'cat_gold', 'total_score', 100000, '/icons/achievements/total_score/icon.svg'),
('ach_score_150000', 'total_score_150000', 'cat_gold', 'total_score', 150000, '/icons/achievements/total_score/icon.svg'),
('ach_score_200000', 'total_score_200000', 'cat_platinum', 'total_score', 200000, '/icons/achievements/total_score/icon.svg'),
('ach_score_300000', 'total_score_300000', 'cat_platinum', 'total_score', 300000, '/icons/achievements/total_score/icon.svg'),
('ach_score_500000', 'total_score_500000', 'cat_platinum', 'total_score', 500000, '/icons/achievements/total_score/icon.svg'),
('ach_score_750000', 'total_score_750000', 'cat_diamond', 'total_score', 750000, '/icons/achievements/total_score/icon.svg'),
('ach_score_1000000', 'total_score_1000000', 'cat_diamond', 'total_score', 1000000, '/icons/achievements/total_score/icon.svg'),
('ach_score_1500000', 'total_score_1500000', 'cat_diamond', 'total_score', 1500000, '/icons/achievements/total_score/icon.svg'),
('ach_score_2000000', 'total_score_2000000', 'cat_diamond', 'total_score', 2000000, '/icons/achievements/total_score/icon.svg'),
('ach_score_3000000', 'total_score_3000000', 'cat_diamond', 'total_score', 3000000, '/icons/achievements/total_score/icon.svg'),
('ach_score_5000000', 'total_score_5000000', 'cat_diamond', 'total_score', 5000000, '/icons/achievements/total_score/icon.svg');

-- Daily Streak Achievements
INSERT INTO achievements (id, code, category_id, condition_type, condition_value, icon_path) VALUES
('ach_streak_1', 'daily_streak_1', 'cat_bronze', 'daily_streak', 1, '/icons/achievements/daily_streak/icon.svg'),
('ach_streak_3', 'daily_streak_3', 'cat_bronze', 'daily_streak', 3, '/icons/achievements/daily_streak/icon.svg'),
('ach_streak_5', 'daily_streak_5', 'cat_silver', 'daily_streak', 5, '/icons/achievements/daily_streak/icon.svg'),
('ach_streak_7', 'daily_streak_7', 'cat_silver', 'daily_streak', 7, '/icons/achievements/daily_streak/icon.svg'),
('ach_streak_10', 'daily_streak_10', 'cat_silver', 'daily_streak', 10, '/icons/achievements/daily_streak/icon.svg'),
('ach_streak_14', 'daily_streak_14', 'cat_gold', 'daily_streak', 14, '/icons/achievements/daily_streak/icon.svg'),
('ach_streak_21', 'daily_streak_21', 'cat_gold', 'daily_streak', 21, '/icons/achievements/daily_streak/icon.svg'),
('ach_streak_30', 'daily_streak_30', 'cat_platinum', 'daily_streak', 30, '/icons/achievements/daily_streak/icon.svg'),
('ach_streak_45', 'daily_streak_45', 'cat_gold', 'daily_streak', 45, '/icons/achievements/daily_streak/icon.svg'),
('ach_streak_60', 'daily_streak_60', 'cat_platinum', 'daily_streak', 60, '/icons/achievements/daily_streak/icon.svg'),
('ach_streak_90', 'daily_streak_90', 'cat_platinum', 'daily_streak', 90, '/icons/achievements/daily_streak/icon.svg'),
('ach_streak_120', 'daily_streak_120', 'cat_platinum', 'daily_streak', 120, '/icons/achievements/daily_streak/icon.svg'),
('ach_streak_180', 'daily_streak_180', 'cat_diamond', 'daily_streak', 180, '/icons/achievements/daily_streak/icon.svg'),
('ach_streak_270', 'daily_streak_270', 'cat_diamond', 'daily_streak', 270, '/icons/achievements/daily_streak/icon.svg'),
('ach_streak_365', 'daily_streak_365', 'cat_diamond', 'daily_streak', 365, '/icons/achievements/daily_streak/icon.svg');

-- Daily Games Achievements
INSERT INTO achievements (id, code, category_id, condition_type, condition_value, icon_path) VALUES
('ach_daily_3', 'daily_games_3', 'cat_bronze', 'daily_games', 3, '/icons/achievements/daily_games/icon.svg'),
('ach_daily_5', 'daily_games_5', 'cat_bronze', 'daily_games', 5, '/icons/achievements/daily_games/icon.svg'),
('ach_daily_7', 'daily_games_7', 'cat_bronze', 'daily_games', 7, '/icons/achievements/daily_games/icon.svg'),
('ach_daily_10', 'daily_games_10', 'cat_silver', 'daily_games', 10, '/icons/achievements/daily_games/icon.svg'),
('ach_daily_15', 'daily_games_15', 'cat_silver', 'daily_games', 15, '/icons/achievements/daily_games/icon.svg'),
('ach_daily_20', 'daily_games_20', 'cat_gold', 'daily_games', 20, '/icons/achievements/daily_games/icon.svg'),
('ach_daily_25', 'daily_games_25', 'cat_gold', 'daily_games', 25, '/icons/achievements/daily_games/icon.svg'),
('ach_daily_30', 'daily_games_30', 'cat_platinum', 'daily_games', 30, '/icons/achievements/daily_games/icon.svg'),
('ach_daily_40', 'daily_games_40', 'cat_gold', 'daily_games', 40, '/icons/achievements/daily_games/icon.svg'),
('ach_daily_50', 'daily_games_50', 'cat_diamond', 'daily_games', 50, '/icons/achievements/daily_games/icon.svg'),
('ach_daily_75', 'daily_games_75', 'cat_platinum', 'daily_games', 75, '/icons/achievements/daily_games/icon.svg'),
('ach_daily_100', 'daily_games_100', 'cat_diamond', 'daily_games', 100, '/icons/achievements/daily_games/icon.svg'),
('ach_daily_150', 'daily_games_150', 'cat_diamond', 'daily_games', 150, '/icons/achievements/daily_games/icon.svg'),
('ach_daily_200', 'daily_games_200', 'cat_diamond', 'daily_games', 200, '/icons/achievements/daily_games/icon.svg'),
('ach_daily_250', 'daily_games_250', 'cat_diamond', 'daily_games', 250, '/icons/achievements/daily_games/icon.svg');

-- Genre Explorer Achievements
INSERT INTO achievements (id, code, category_id, condition_type, condition_value, icon_path) VALUES
('ach_genre_3', 'genre_explorer_3', 'cat_bronze', 'genre_explorer', 3, '/icons/achievements/genre_explorer/icon.svg'),
('ach_genre_5', 'genre_explorer_5', 'cat_bronze', 'genre_explorer', 5, '/icons/achievements/genre_explorer/icon.svg'),
('ach_genre_10', 'genre_explorer_10', 'cat_silver', 'genre_explorer', 10, '/icons/achievements/genre_explorer/icon.svg'),
('ach_genre_15', 'genre_explorer_15', 'cat_silver', 'genre_explorer', 15, '/icons/achievements/genre_explorer/icon.svg'),
('ach_genre_25', 'genre_explorer_25', 'cat_gold', 'genre_explorer', 25, '/icons/achievements/genre_explorer/icon.svg');

-- Game Series Achievements
INSERT INTO achievements (id, code, category_id, condition_type, condition_value, icon_path) VALUES
('ach_series_3', 'game_series_3', 'cat_bronze', 'game_series', 3, '/icons/achievements/game_series/icon.svg'),
('ach_series_5', 'game_series_5', 'cat_silver', 'game_series', 5, '/icons/achievements/game_series/icon.svg'),
('ach_series_10', 'game_series_10', 'cat_gold', 'game_series', 10, '/icons/achievements/game_series/icon.svg');

-- Quick Answer Achievements
INSERT INTO achievements (id, code, category_id, condition_type, condition_value, icon_path) VALUES
('ach_speed_5', 'quick_answer_5', 'cat_bronze', 'quick_answer', 5, '/icons/achievements/quick_answer/icon.svg'),
('ach_speed_15', 'quick_answer_15', 'cat_silver', 'quick_answer', 15, '/icons/achievements/quick_answer/icon.svg');

-- Seasonal Event Achievements
INSERT INTO achievements (id, code, category_id, condition_type, condition_value, icon_path) VALUES
('ach_seasonal_1', 'seasonal_event_1', 'cat_gold', 'seasonal_event', 1, '/icons/achievements/seasonal_event/icon.svg'),
('ach_seasonal_3', 'seasonal_event_3', 'cat_platinum', 'seasonal_event', 3, '/icons/achievements/seasonal_event/icon.svg');