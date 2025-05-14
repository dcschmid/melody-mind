/**
 * Validation Types and Schemas for MelodyMind
 *
 * This file contains zod schemas and related types for validating
 * data structures throughout the application.
 */

import { z } from "zod";
import type { Difficulty } from "./types";

/**
 * Schema for validating a single game question
 */
export const questionSchema = z.object({
  id: z.string().uuid(),
  text: z.string().min(5).max(500),
  options: z.array(z.string()).min(2).max(4),
  correctAnswer: z.number().int().min(0),
  difficulty: z.enum(["easy", "medium", "hard"]),
  genre: z.string(),
  explanation: z.string().optional(),
});

/**
 * Type derived from the question schema
 */
export type QuestionValidated = z.infer<typeof questionSchema>;

/**
 * Schema for validating user scores
 */
export const userScoreSchema = z.object({
  userId: z.string().uuid(),
  username: z.string().min(3).max(30),
  score: z.number().int().min(0),
  correctAnswers: z.number().int().min(0),
  totalQuestions: z.number().int().min(0),
  difficulty: z.enum(["easy", "medium", "hard"]),
  genre: z.string(),
  completedAt: z.date(),
  achievements: z.array(z.string()),
});

/**
 * Type derived from the user score schema
 */
export type UserScoreValidated = z.infer<typeof userScoreSchema>;

/**
 * Schema for game configuration
 */
export const gameConfigSchema = z.object({
  difficulty: z.enum(["easy", "medium", "hard"]),
  genre: z.string(),
  useJokers: z.boolean().default(true),
  timeLimit: z.number().int().positive().optional(),
  soundEffects: z.boolean().default(true),
});

/**
 * Type derived from game configuration schema
 */
export type GameConfigValidated = z.infer<typeof gameConfigSchema>;

/**
 * Game difficulty settings
 */
export const difficultySettings = {
  easy: {
    questionCount: 10,
    maxPoints: 500,
    jokerCount: 3,
    timeBonus: { fast: 10, medium: 15 },
  },
  medium: {
    questionCount: 15,
    maxPoints: 750,
    jokerCount: 5,
    timeBonus: { fast: 8, medium: 12 },
  },
  hard: {
    questionCount: 20,
    maxPoints: 1000,
    jokerCount: 10,
    timeBonus: { fast: 6, medium: 10 },
  },
} as const;

/**
 * Type for difficulty settings access
 */
export type DifficultySettings = (typeof difficultySettings)[Difficulty];
