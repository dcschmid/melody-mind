# MelodyMind Data Flow Overview

> Last updated: 2025-10-07

This document captures the end-to-end data flow for the two most intricate parts of MelodyMind:
question selection/loading and score computation/achievement handling. It is meant to complement the
German refactor plan with an English, architecture-centric view so future refactors can reason about
the pipelines quickly.

---

## 1. Question & Album Loading Pipeline

### 1.1 Data Source

- Static JSON per language lives under `src/json/*_categories.json`.
- Each JSON entry contains category metadata, album lists, and question arrays
  (difficulty-bucketed).

### 1.2 Lazy Loading & Fallback

- `src/utils/category/categoriesIndex.ts`
  - Uses `import.meta.glob` to lazy load the language-specific JSON chunk.
  - Normalises incoming language via `normalizeLanguage` and caches results in-memory.
  - `getCategories(lang)` returns the primary language data or falls back to `FALLBACK_LANGUAGE` if
    the primary array is empty.
- `src/utils/game/albumLoader.ts`
  - Wraps category lookups for game engines.
  - Attempts primary language first, then the fallback language and returns an `Album[]`.
  - Any errors are surfaced via `handleLoadingError`, ensuring issues are logged without crashing
    the flow.

### 1.3 Question Selection

- **Standard quiz**:
  - `src/utils/game/getRandomQuestion.ts` maintains a `Set` of used question texts.
  - `getRandomQuestion(albums, difficulty, totalRounds)` selects a random entry from the difficulty
    bucket and ensures uniqueness within the current session.
  - `resetUsedQuestions()` clears the state between games; `getUsedQuestionsCount()` exposes
    telemetry.
- **Time pressure variant**:
  - `src/utils/game/getTimePressureQuestion.ts` tracks usage across multiple difficulty tiers within
    one run (`usedTimePressureQuestions` + `difficultyTracker`).
  - Returns a bundle containing the chosen question, album reference, time limits, and scoring
    metadata.

### 1.4 UI Binding & Interaction

- `src/utils/game/loadQuestionUtils.ts`
  - Receives the `Question` + `Album` and sets up DOM for text, options, ARIA attributes, and
    listeners.
  - Shuffles answer buttons (Fisher–Yates) and handles focus management + screen reader
    announcements.
- `src/utils/game/jokerManager.ts`
  - Tracks joker availability per difficulty (`JOKERS_PER_DIFFICULTY` from constants).
  - When invoked, removes the appropriate number of incorrect options from the currently set
    question.
- `src/utils/game/handleAnswer.ts` & `handleAnswerUtils.ts`
  - Orchestrate the answer submission:
    - Compare selection with `correctAnswer`.
    - Trigger score updates (see §2), achievements, and overlay feedback.
    - Manage fun-fact overlays and ensure subsequent UI state is consistent (disabling buttons,
      focus resets).
- Game engines (`gameEngine.ts`, `timePressureGameEngine.ts`, `chronologyGameEngine.ts`) call into
  the above utilities and manage run-level state (rounds, timers, exit conditions).

---

## 2. Scoring, Achievements & Overlay Pipeline

### 2.1 Core Constants & Helpers

- `src/constants/game.ts`
  - Defines base scoring (`BASE_POINTS_PER_QUESTION`), speed bonus thresholds/values, joker
    allocations, and derived max scores.
  - Provides pure helpers `computeSpeedBonus` and `computeQuestionScore`.
- These constants are imported by all engines/handlers to avoid duplicate literals.

### 2.2 Score Mutation

- `src/utils/game/gameStateUtils.ts`
  - `updateGameScore(currentScore, points, options)` updates the internal value, clamps to zero, and
    (optionally) syncs DOM (`score-display`, `popup-score`).
  - `updateGameRound` mirrors the logic for round counters.
  - Optional screen reader announcements ensure WCAG compliance via `announceScoreChange`.
- `src/utils/game/scoreUtils.ts`
  - `updateScoreDisplay` applies visual feedback/animation for the score element after each change.

### 2.3 Handling Answer Outcomes

- `handleAnswerUtils.ts` calculates the per-question contribution:
  - Uses `computeQuestionScore(elapsedSeconds)` for correct answers.
  - Applies penalties for incorrect answers when relevant (e.g., time pressure mode).
  - Calls `updateScoreDisplay` / `updateGameScore` to keep UI + state consistent.
- Time-based engines (`timePressureGameEngine.ts`) apply their own bonus/penalty logic before
  invoking the shared helpers.

### 2.4 Achievements & Endgame

- `src/utils/game/achievements.ts`
  - Maintains static tier thresholds (`ACHIEVEMENT_TIERS`) and exposes:
    - `resolveAchievement(score)` → returns the tier metadata.
    - `getAchievementLabel(score, t)` → fetches the i18n string with a fallback emoji label.
- `src/utils/game/gameUI.ts`
  - Aggregates the final score, accuracy, and progress metrics.
  - `showEndgamePopup(score, maxScore)` attempts to call the hydrated overlay
    (`window.showEndOverlay`); otherwise, falls back to server-rendered markup.
- Overlay components (`src/components/Overlays/*.astro`) read the shared state via data attributes
  and display the final score, achievements, and share links.

---

## 3. Key Takeaways for Future Refactors

1. **Single Source of Truth**: All language fallbacks go through `normalizeLanguage` +
   `ensureSupportedLanguage`; there are no hard-coded `"en"` fallbacks left in the pipeline.
2. **Pure Helpers First**: Computation-heavy logic (speed bonus, score tiers) stays in
   `src/constants/game.ts` / dedicated helpers, making it easy to test and reason about.
3. **UI Utilities Are Centralised**: DOM mutations are confined to `loadQuestionUtils.ts`,
   `scoreUtils.ts`, and `gameStateUtils.ts`, simplifying audits for accessibility or performance.
4. **Session Scoping via Sets**: Both random-question utilities rely on `Set` tracking. Any future
   multiplayer or cross-session features should keep that isolation in mind (e.g., pass in a store
   instead of using module-level state).
5. **Overlay Flow**: Whenever endgame UX changes, ensure `gameUI.ts`, overlays, and
   `handleAnswerUtils.ts` stay in sync—`gameUI.ts` currently acts as the bridge between pure scoring
   and visual feedback.

If additional pipelines emerge (leaderboards, achievements syncing, etc.), consider duplicating this
pattern: outline source → transform → UI so cross-team coordination stays simple.
