# Achievement System Database Design

## Overview

Dieses Dokument beschreibt die Datenbankstruktur für das Achievement-System von Melody Mind.

## Schema

```sql
-- Entfernen bestehender Tabellen
DROP TABLE IF EXISTS user_achievements;
DROP TABLE IF EXISTS achievement_translations;
DROP TABLE IF EXISTS achievements;
DROP TABLE IF EXISTS achievement_categories;

-- Entfernen bestehender Typen
DROP TYPE IF EXISTS achievement_condition_type;

-- Achievement Condition Type ENUM
CREATE TYPE achievement_condition_type AS ENUM (
    'games_played',
    'perfect_games',
    'total_score'
);

-- Achievement Categories
CREATE TABLE achievement_categories (
    id TEXT PRIMARY KEY NOT NULL,
    code TEXT UNIQUE NOT NULL,
    points INTEGER NOT NULL,
    icon_path TEXT NOT NULL,
    sort_order INTEGER NOT NULL,

    CONSTRAINT valid_category_code CHECK (code IN ('bronze', 'silver', 'gold', 'platinum'))
);

-- Achievements
CREATE TABLE achievements (
    id TEXT PRIMARY KEY NOT NULL,
    code TEXT UNIQUE NOT NULL,
    category_id TEXT NOT NULL,
    condition_type achievement_condition_type NOT NULL,
    condition_value INTEGER NOT NULL,
    rarity_percentage DECIMAL(5,2) DEFAULT 0.00,
    icon_path TEXT,

    FOREIGN KEY (category_id) REFERENCES achievement_categories(id) ON DELETE CASCADE
);

-- Achievement Translations
CREATE TABLE achievement_translations (
    achievement_id TEXT NOT NULL,
    language TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,

    PRIMARY KEY (achievement_id, language),
    FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE
);

-- User Achievements
CREATE TABLE user_achievements (
    user_id TEXT NOT NULL,
    achievement_id TEXT NOT NULL,
    current_progress INTEGER NOT NULL DEFAULT 0,
    unlocked_at TIMESTAMP,

    PRIMARY KEY (user_id, achievement_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE
);

-- Indizes für Performance-Optimierung
CREATE INDEX idx_achievements_category ON achievements(category_id);
CREATE INDEX idx_achievement_translations_language ON achievement_translations(language);
CREATE INDEX idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_achievement ON user_achievements(achievement_id);
CREATE INDEX idx_user_achievements_unlocked ON user_achievements(unlocked_at);

-- Beispieldaten für Achievement-Kategorien
INSERT INTO achievement_categories (id, code, points, icon_path, sort_order) VALUES
('cat_bronze', 'bronze', 10, '/icons/achievements/categories/bronze.svg', 1),
('cat_silver', 'silver', 25, '/icons/achievements/categories/silver.svg', 2),
('cat_gold', 'gold', 50, '/icons/achievements/categories/gold.svg', 3),
('cat_platinum', 'platinum', 100, '/icons/achievements/categories/platinum.svg', 4);

-- Beispieldaten für Achievements
INSERT INTO achievements (id, code, category_id, condition_type, condition_value) VALUES
('ach_games_50', 'games_played_50', 'cat_silver', 'games_played', 50),
('ach_perfect_5', 'perfect_games_5', 'cat_gold', 'perfect_games', 5),
('ach_score_1000', 'total_score_1000', 'cat_bronze', 'total_score', 1000);

-- Deutsche Übersetzungen
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_games_50', 'de', '50 Spiele gespielt', 'Spiele 50 Partien in einem beliebigen Modus'),
('ach_perfect_5', 'de', '5 perfekte Spiele', 'Erreiche in 5 Spielen die maximale Punktzahl'),
('ach_score_1000', 'de', '1000 Punkte gesamt', 'Sammle insgesamt 1000 Punkte über alle Spiele');

-- Englische Übersetzungen
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_games_50', 'en', '50 Games Played', 'Play 50 games in any mode'),
('ach_perfect_5', 'en', '5 Perfect Games', 'Achieve maximum score in 5 games'),
('ach_score_1000', 'en', '1000 Total Points', 'Accumulate 1000 points across all games');
```

## Updates und Statistiken

Die `rarity_percentage` wird regelmäßig über einen Cronjob aktualisiert:

```sql
UPDATE achievements a
SET rarity_percentage = (
    SELECT ROUND(
        (COUNT(CASE WHEN ua.unlocked_at IS NOT NULL THEN 1 END)::DECIMAL /
         COUNT(DISTINCT ua.user_id) * 100),
        2
    )
    FROM user_achievements ua
    WHERE ua.achievement_id = a.id
);
```

## Indizierung und Performance

Die gewählten Indizes optimieren:

- Abfragen nach Achievements pro Kategorie
- Sprachspezifische Achievement-Anzeige
- Benutzer-Achievement-Status
- Freischaltungs-Timeline
- Achievement-Statistiken

## Nächste Schritte

1. Erstellen der entsprechenden API-Endpunkte für:

   - Achievement-Liste mit Fortschritt
   - Achievement-Freischaltung
   - Achievement-Statistiken

2. Implementieren des Achievement-Tracking-Systems für:

   - Spielzähler
   - Perfekte Spiele
   - Gesamtpunktzahl

3. Entwickeln der UI-Komponenten für:
   - Achievement-Übersicht
   - Fortschrittsanzeige
   - Freischaltungsbenachrichtigungen
