# 🎵 MelodyMind - The Ultimate Music Trivia Challenge 🎶

MelodyMind is an engaging and competitive music trivia game where players can test their knowledge
across various music genres. Whether you're a rock enthusiast, pop aficionado, or jazz expert, this
game offers a thrilling experience with multiple categories and rounds.

## 🚀 Key Features:

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

## 💡 How to Play:

1. Select your favorite music genre.
2. Choose a difficulty level and start answering trivia questions.
3. For every correct answer, you’ll earn points. The harder the difficulty, the more questions you
   face!
4. At the end of each round, you’ll see your score and have the chance to unlock special Golden LPs
   if you answer all questions correctly.
5. Track your position on the leaderboards and aim to become a Music Legend.

## 🔧 Technologies Used:

- Astro.js: For building the static and dynamic pages of the application.
- TypeScript: To ensure type safety and provide better developer experience.
- Astro DB: For managing game data, user profiles, and leaderboards.
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

## 🎯 Tips for Success:

- Start with Easy mode to get comfortable, then work your way up to Hard.
- Use your 50:50 Jokers wisely, especially in the harder difficulty levels.
- Pay attention to your favorite genres for a better chance at winning.
- Practice regularly to improve your ranking and collect more rewards!
