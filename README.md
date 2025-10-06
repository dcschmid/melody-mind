# 🎵 MelodyMind - The Ultimate Music Trivia Challenge 🎶

MelodyMind is an engaging and competitive music trivia game where players can test their knowledge
across various music genres. Whether you're a rock enthusiast, pop aficionado, or jazz expert, this
game offers a thrilling experience with multiple categories and rounds.

## 🌐 Internationalization & Fallback Language

All localized content uses English (`en`) as the single canonical fallback. If a specific piece of
translated data (category, question set, album/playlist metadata) is missing for the requested
language, the system transparently falls back to the English source variant. This keeps behavior
predictable, reduces redundant branching, and simplifies maintenance. See `docs/data-loading.md` for
architectural details.

## 🚀 Key Features

- Multiple Difficulty Levels: Choose between Easy, Medium, and Hard modes:
  - Easy: 10 questions per round
  - Medium: 15 questions per round
  - Hard: 20 questions per round
- Point System: Earn 50 points for every correct answer. The total score varies based on difficulty:
  - Easy: Maximum 500 points
  - Medium: Maximum 750 points
  - Hard: Maximum 1000 points
- Speed Bonus: Answer quickly to earn extra points! The faster you answer, the more bonus points you
  receive:
  - Answer within 10 seconds: +50 bonus points
  - Answer within 15 seconds: +25 bonus points
- 50:50 Joker: Limited use based on difficulty:
  - Easy: 3 Jokers
  - Medium: 5 Jokers
  - Hard: 10 Jokers
  - Use the 50:50 Joker to eliminate two wrong answers and increase your chances of success.
- Golden LPs: Unlock special rewards based on your performance:
  - Musik-Novice: For completing all questions in Easy mode
  - Musik-Master: For completing all questions in Medium mode
  - Musik-Legend: For completing all questions in Hard mode
- Rankings: Compete against others and climb the Top 10 Leaderboards based on your scores. Check out
  your position in genre-specific and overall rankings.
- Music Genres: Select from a variety of music genres and prove your expertise in each category.

## 💡 How to Play

1. Select your favorite music genre.
2. Choose a difficulty level and start answering trivia questions.
3. For every correct answer, you’ll earn points. The harder the difficulty, the more questions you
   face!
4. At the end of each round, you’ll see your score and have the chance to unlock special Golden LPs
   if you answer all questions correctly.
5. Track your position on the leaderboards and aim to become a Music Legend.

## 🔧 Technologies Used

- Astro.js: For building the static and dynamic pages of the application.
- TypeScript: To ensure type safety and provide better developer experience.
- Static JSON & Markdown Data: All questions, genres, and content are stored as static assets (no
  external database).
- HTML5 & CSS3: For designing the user interface and styling the game.
- JSON: For managing question data and game configurations.
- Vitest: For unit and integration testing with TypeScript support.

## 🧪 Testing

This project uses [Vitest](https://vitest.dev/) for testing. Vitest is a fast unit test framework
powered by Vite with native ESM and TypeScript support.

### Running Tests

```bash
# Run all tests once
yarn test:run

# Run tests in watch mode
yarn test

# Run tests with UI interface
yarn test:ui

# Run tests with coverage report
yarn test:coverage
```

### Test Structure

- Unit tests are located next to the source files (e.g., `utils/memoize.test.ts`)
- Integration tests are in `src/tests/integration/`
- Test configuration is in `vitest.config.ts`
- Global test setup is in `src/tests/setup.ts`

For detailed testing guidelines, see [docs/testing-setup.md](docs/testing-setup.md).

## 🎯 Tips for Success

- Start with Easy mode to get comfortable, then work your way up to Hard.
- Use your 50:50 Jokers wisely, especially in the harder difficulty levels.
- Pay attention to your favorite genres for a better chance at winning.
- Practice regularly to improve your ranking and collect more rewards!

## 🤖 AI Coding Agents

For automated or AI-assisted contributions, see `AGENTS.md` for project-specific agent guidelines
(commands, coding standards, performance, accessibility, and safety rules). Human contributors can
largely ignore it unless curious about automation practices.

## 🎨 Styling Architecture

The CSS layer follows a token → semantic mapping split:

- `src/styles/tokens.css`: Pure design tokens (colors, spacing, typography, radii, shadows,
  durations, easing, focus baseline, icon sizes, opacity, scrollbar dimensions, achievement colors)
- `src/styles/base.css`: Semantic/UI variables (forms, buttons, cards, interactive states, scrollbar
  color semantics) + environment adaptation media queries
- `src/styles/utilities.css`: Minimal utility classes (currently only screen-reader helper)
- `src/styles/global.css`: Keeps only imports; no variables live here anymore

Rationale, maintenance checklist, and extension guidance live in `docs/styles.md`.

## 🔍 SEO Architecture (Summary)

All pages use a unified SEO pipeline via `buildPageSeo` (see `docs/seo-architecture.md`). Deprecated
helper files (`seoText.ts`, `metaUtils.ts`, `seoBasics.ts`) were removed in October 2025. Do not
reintroduce per-page ad‑hoc meta generation; instead provide:

- Base `title`, `description`, `url`
- Optional `enrichedParts` (array of semantic strings)
- Optional `fallbackKeywords` (curated terms)
- `structuredData` (JSON-LD objects) & `breadcrumbs`

The builder normalizes title suffixes, derives description & keywords, assembles robots directives,
and injects `BreadcrumbList` if missing.

## 🧩 Content Layer Migration

This project uses Astro's new Content Layer compatibility mode for legacy `type: "content"`
collections. Migration rationale, explicit collection declarations, and reviewed breaking changes
are documented in `MIGRATION_CONTENT_LAYER.md`. If you add new knowledge collections (e.g.
additional languages), ensure they are declared in `src/content/config.ts`.

## 📂 Category Data Architecture

Categories are now handled through a clear separation of responsibilities to keep memory footprint,
complexity and coupling low:

- Loader (I/O + fallback resolution): `src/utils/category/categoryLoader.ts`
  - Provides `loadCategoriesForLanguage(lang)` and `loadCategoryBySlug(slug, { language })`.
  - Performs lazy loading via `import.meta.glob` through an internal index (`categoriesIndex.ts`).
  - Applies a single canonical fallback to English (`en`) if a localized category set is missing.

- Pure transforms (in‑memory operations only): `src/utils/category/categoryTransforms.ts`
  - `filterPlayableCategories`, `filterNonPlayableCategories`
  - `getCategoryStats`, `getCategoriesByType`
  - `isPlayableCategory` (type guard)
  - `searchCategories` (text search across headline/subline/body/slug)
  - All functions are side‑effect free and tree‑shakable.

Removed / deprecated:

- Legacy wrapper utilities (`categoryLoadingUtils.ts`) and unused sorts were removed in Oct 2025 to
  avoid divergent logic and reduce cognitive load.

Design principles:

- A single fallback path keeps logic deterministic.
- I/O kept isolated so transforms remain easily testable later.
- No runtime language “detection” — route param drives locale; fallback only when data absent.

When adding new category logic:

1. Put data fetching / fallback logic in the loader.
2. Keep any data shaping, filtering, aggregation pure in the transforms file (or a new dedicated
   transform module if unrelated to categories).
3. Avoid re‑introducing combined loader+transform helpers; compose them at call sites instead for
   clarity and tree‑shaking.

This structure improves build memory behavior and future test coverage readiness while staying
aligned with the overall minimal client‑JS philosophy.

➡ For a deeper dive (loading flow diagrams, anti‑patterns, future ideas) see
`docs/category-architecture.md`.
