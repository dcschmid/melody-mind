-- Migration: Add Enhanced Achievements
-- Description: Adds new achievement types for performance, specialization, and special combinations

-- =============================================
-- Add new tracking tables for enhanced achievements
-- =============================================

-- Table for tracking user accuracy statistics
CREATE TABLE IF NOT EXISTS user_accuracy_stats (
  user_id TEXT NOT NULL PRIMARY KEY,
  current_accuracy_streak INTEGER NOT NULL DEFAULT 0,
  max_accuracy_streak INTEGER NOT NULL DEFAULT 0,
  total_correct_answers INTEGER NOT NULL DEFAULT 0,
  total_answers INTEGER NOT NULL DEFAULT 0,
  last_updated DATETIME NOT NULL DEFAULT (datetime('now')),
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table for tracking user speed statistics
CREATE TABLE IF NOT EXISTS user_speed_stats (
  user_id TEXT NOT NULL PRIMARY KEY,
  fastest_answer_time DECIMAL(5,2) DEFAULT NULL,
  total_quick_answers INTEGER NOT NULL DEFAULT 0,
  average_answer_time DECIMAL(5,2) DEFAULT NULL,
  speed_games_count INTEGER NOT NULL DEFAULT 0,
  last_updated DATETIME NOT NULL DEFAULT (datetime('now')),
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table for tracking perfect game streaks
CREATE TABLE IF NOT EXISTS user_perfect_streaks (
  user_id TEXT NOT NULL PRIMARY KEY,
  current_perfect_streak INTEGER NOT NULL DEFAULT 0,
  max_perfect_streak INTEGER NOT NULL DEFAULT 0,
  last_perfect_game DATETIME DEFAULT NULL,
  last_updated DATETIME NOT NULL DEFAULT (datetime('now')),
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table for tracking genre specialization
CREATE TABLE IF NOT EXISTS user_genre_stats (
  user_id TEXT NOT NULL,
  genre_id TEXT NOT NULL,
  perfect_games INTEGER NOT NULL DEFAULT 0,
  total_games INTEGER NOT NULL DEFAULT 0,
  best_score INTEGER NOT NULL DEFAULT 0,
  last_played DATETIME NOT NULL DEFAULT (datetime('now')),
  
  PRIMARY KEY (user_id, genre_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table for tracking time-based activities
CREATE TABLE IF NOT EXISTS user_time_activities (
  user_id TEXT NOT NULL,
  activity_type TEXT NOT NULL, -- 'night_owl', 'early_bird', 'weekend_warrior'
  activity_date DATE NOT NULL,
  
  PRIMARY KEY (user_id, activity_type, activity_date),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table for tracking difficulty-based achievements
CREATE TABLE IF NOT EXISTS user_difficulty_stats (
  user_id TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  perfect_games INTEGER NOT NULL DEFAULT 0,
  total_games INTEGER NOT NULL DEFAULT 0,
  no_joker_perfect_games INTEGER NOT NULL DEFAULT 0,
  last_updated DATETIME NOT NULL DEFAULT (datetime('now')),
  
  PRIMARY KEY (user_id, difficulty),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table for tracking joker usage statistics
CREATE TABLE IF NOT EXISTS user_joker_stats (
  user_id TEXT NOT NULL PRIMARY KEY,
  games_won_with_all_jokers INTEGER NOT NULL DEFAULT 0,
  games_won_without_jokers INTEGER NOT NULL DEFAULT 0,
  total_jokers_used INTEGER NOT NULL DEFAULT 0,
  last_updated DATETIME NOT NULL DEFAULT (datetime('now')),
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =============================================
-- Create indexes for performance optimization
-- =============================================
CREATE INDEX IF NOT EXISTS idx_user_accuracy_stats_user ON user_accuracy_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_user_speed_stats_user ON user_speed_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_user_perfect_streaks_user ON user_perfect_streaks(user_id);
CREATE INDEX IF NOT EXISTS idx_user_genre_stats_user ON user_genre_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_user_genre_stats_genre ON user_genre_stats(genre_id);
CREATE INDEX IF NOT EXISTS idx_user_time_activities_user ON user_time_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_time_activities_type ON user_time_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_user_difficulty_stats_user ON user_difficulty_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_user_joker_stats_user ON user_joker_stats(user_id);

-- =============================================
-- Insert new achievement definitions
-- =============================================

-- Performance & Skill Achievements
INSERT OR IGNORE INTO achievements (id, code, category_id, condition_type, condition_value, icon_path) VALUES
('ach_accuracy_95', 'sharpshooter', 'cat_gold', 'accuracy_streak', 95, '/icons/achievements/accuracy/sharpshooter.svg'),
('ach_speed_lightning', 'lightning_fast', 'cat_gold', 'speed_master', 5, '/icons/achievements/speed/lightning.svg'),
('ach_perfect_streak_3', 'perfectionist', 'cat_platinum', 'perfect_streak', 3, '/icons/achievements/perfect/perfectionist.svg'),
('ach_speed_demon', 'speed_demon', 'cat_diamond', 'speed_master', 3, '/icons/achievements/speed/demon.svg');

-- Genre Specialist Achievements
INSERT OR IGNORE INTO achievements (id, code, category_id, condition_type, condition_value, icon_path) VALUES
('ach_rock_master', 'rock_master', 'cat_silver', 'genre_specialist', 20, '/icons/achievements/genre/rock.svg'),
('ach_pop_expert', 'pop_expert', 'cat_silver', 'genre_specialist', 20, '/icons/achievements/genre/pop.svg'),
('ach_jazz_connoisseur', 'jazz_connoisseur', 'cat_silver', 'genre_specialist', 20, '/icons/achievements/genre/jazz.svg'),
('ach_classical_virtuoso', 'classical_virtuoso', 'cat_silver', 'genre_specialist', 20, '/icons/achievements/genre/classical.svg'),
('ach_hiphop_master', 'hiphop_master', 'cat_silver', 'genre_specialist', 20, '/icons/achievements/genre/hiphop.svg'),
('ach_electronic_expert', 'electronic_expert', 'cat_silver', 'genre_specialist', 20, '/icons/achievements/genre/electronic.svg');

-- Time-based Achievements
INSERT OR IGNORE INTO achievements (id, code, category_id, condition_type, condition_value, icon_path) VALUES
('ach_marathon_player', 'marathon_player', 'cat_diamond', 'daily_games', 50, '/icons/achievements/time/marathon.svg'),
('ach_night_owl', 'night_owl', 'cat_bronze', 'time_based', 1, '/icons/achievements/time/night_owl.svg'),
('ach_early_bird', 'early_bird', 'cat_bronze', 'time_based', 1, '/icons/achievements/time/early_bird.svg'),
('ach_weekend_warrior', 'weekend_warrior', 'cat_silver', 'time_based', 1, '/icons/achievements/time/weekend.svg');

-- Difficulty Master Achievements
INSERT OR IGNORE INTO achievements (id, code, category_id, condition_type, condition_value, icon_path) VALUES
('ach_hard_master', 'hard_difficulty_master', 'cat_gold', 'difficulty_master', 10, '/icons/achievements/difficulty/hard_master.svg'),
('ach_precision_player', 'precision_player', 'cat_platinum', 'difficulty_master', 5, '/icons/achievements/difficulty/precision.svg');

-- Joker Master Achievements
INSERT OR IGNORE INTO achievements (id, code, category_id, condition_type, condition_value, icon_path) VALUES
('ach_comeback_king', 'comeback_king', 'cat_gold', 'joker_master', 5, '/icons/achievements/joker/comeback.svg'),
('ach_no_joker_master', 'no_joker_master', 'cat_platinum', 'joker_master', 10, '/icons/achievements/joker/no_joker.svg');

-- Combo Achievements (Special combinations)
INSERT OR IGNORE INTO achievements (id, code, category_id, condition_type, condition_value, icon_path) VALUES
('ach_perfect_storm', 'perfect_storm', 'cat_diamond', 'combo_achievement', 1, '/icons/achievements/combo/perfect_storm.svg'),
('ach_triple_threat', 'triple_threat', 'cat_platinum', 'combo_achievement', 3, '/icons/achievements/combo/triple_threat.svg');