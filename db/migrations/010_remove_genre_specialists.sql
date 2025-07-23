-- Migration: Remove Genre Specialist Achievements
-- Description: Removes problematic genre-specific achievements that are hard to maintain

-- Remove genre specialist achievements
DELETE FROM achievements WHERE condition_type = 'genre_specialist';

-- Remove the genre_specialist condition type support
-- (TypeScript types will be updated separately)

-- Keep user_genre_stats table for potential future use
-- but remove the problematic achievement logic