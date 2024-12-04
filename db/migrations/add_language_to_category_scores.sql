-- Setze Standardwert für existierende Einträge
UPDATE HighscorePerCategory
SET language = 'de'
WHERE language IS NULL;
