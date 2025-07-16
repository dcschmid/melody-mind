# MelodyMind Development Guidelines

## Project Overview

MelodyMind is a comprehensive multilingual music trivia game built with **Astro**, **TypeScript**, and **Turso** database. The application features sophisticated game mechanics, achievement systems, user authentication, and extensive internationalization support across 10 languages.

## Technology Stack

- **Frontend**: Astro (SSG/SSR hybrid), TypeScript, SCSS
- **Database**: Turso (SQLite-based) with migrations
- **Styling**: Pure CSS/SCSS with BEM methodology, WCAG 2.2 AAA compliance
- **Testing**: Vitest + jsdom
- **Deployment**: Static site generation with dynamic API routes

## Development Commands

### Essential Commands
```bash
# Development server
yarn dev

# Build for production
yarn build

# Preview production build
yarn preview

# Run tests
yarn test              # Watch mode
yarn test:run          # Single run
yarn test:coverage     # With coverage report
yarn test:ui           # Visual test interface

# Linting & Formatting
yarn lint              # Fix linting issues
yarn lint:check        # Check without fixing
yarn format            # Format code with Prettier
yarn format:check      # Check formatting

# Database
yarn db:setup          # Initialize database and run migrations

# Fonts & Assets
yarn setup-fonts       # Setup local fonts
yarn generate-og       # Generate Open Graph images
```

### Development Workflow
1. **Start development**: `yarn dev`
2. **Run tests**: `yarn test` (in watch mode)
3. **Before commits**: `yarn lint` (includes formatting)
4. **Build verification**: `yarn build`

## Project Structure

```
/src/
├── components/          # Reusable UI components (Astro)
│   ├── Game/           # Game-specific components
│   ├── Auth/           # Authentication forms
│   ├── Achievements/   # Achievement system UI
│   └── Shared/         # Common components
├── pages/              # File-based routing
│   └── [lang]/         # Internationalized routes
├── scripts/            # Client-side game logic
├── utils/              # Shared utility functions
├── services/           # Database and business logic
├── types/              # TypeScript type definitions
├── middleware.ts       # Route handling and redirects
└── layouts/            # Page layouts
```

## Key Architecture Files

### Essential Files to Understand
- **Game Engine**: `/src/scripts/gameEngine.ts` - Core game logic and flow
- **Database Setup**: `/db/setup.ts` + `/db/migrations/` - Database schema
- **Main Layout**: `/src/layouts/Layout.astro` - Base page structure
- **I18n Utils**: `/src/utils/i18n.ts` - Internationalization system
- **Achievement Service**: `/src/services/achievementService.ts` - Achievement logic
- **Database Client**: `/src/turso.ts` - Database connection
- **Middleware**: `/src/middleware.ts` - Route handling and redirects

### Configuration Files
- **Astro Config**: `/astro.config.mjs` - Build and deployment config
- **TypeScript Config**: `/tsconfig.json` - Type checking configuration
- **Test Setup**: `/vitest.config.ts` + `/src/tests/setup.ts` - Test configuration
- **Database Config**: `/src/config/database.ts` - Database connection settings

## Game Architecture

### Game Flow
1. **Initialize**: Load category questions with language fallback
2. **Setup**: Initialize joker system based on difficulty
3. **Track**: Set up achievement tracking
4. **Play**: Present questions with multiple choice options
5. **Score**: Handle answers with immediate feedback and speed bonuses
6. **Progress**: Track progress through rounds
7. **Complete**: Save results and check achievements
8. **Display**: Show final score and unlock notifications

### Key Game Components
- **Question Loading**: Language fallback system for missing translations
- **Scoring System**: Real-time scoring with speed bonuses
- **Achievement Tracking**: Multiple achievement types with progress tracking
- **Accessibility**: WCAG 2.2 AAA compliance with keyboard navigation
- **Joker System**: 50:50 jokers with difficulty-based limits

## Database Architecture

### Key Tables
- `users` - User authentication and profiles
- `game_results` - Individual game session records
- `user_mode_stats` - Aggregated user statistics
- `achievements` - Achievement definitions
- `user_achievements` - User achievement progress
- `highscores` - Leaderboard data

### Database Operations
- **Migrations**: Automated database schema updates
- **Services**: Business logic in `/src/services/`
- **Connection**: Turso client with edge distribution
- **Setup**: `yarn db:setup` initializes database

## Internationalization System

### Supported Languages
German (DE), English (EN), Spanish (ES), French (FR), Italian (IT), Portuguese (PT), Danish (DA), Dutch (NL), Swedish (SV), Finnish (FI)

### Content Structure
- **UI Translations**: `/src/i18n/ui.json`
- **Category Data**: `/src/json/{lang}_categories.json`
- **Question Data**: `/public/json/genres/{lang}/{category}.json`
- **Podcast Content**: `/public/data/podcasts.json`

### I18n Implementation
- **Language Detection**: URL-based with browser fallback
- **Translation Function**: `useTranslations(lang)` with fallback chain
- **URL Generation**: `getLocalizedURL(lang, path)` for navigation

## Achievement System

### Achievement Types
- `games_played` - Total games completed
- `perfect_games` - Perfect score achievements
- `total_score` - Cumulative score milestones
- `daily_streak` - Consecutive daily play
- `genre_explorer` - Playing different categories
- `quick_answer` - Fast response rewards
- `seasonal_event` - Time-limited achievements

### Achievement Flow
1. **Track**: Progress tracked during gameplay
2. **Check**: Conditions evaluated after each game
3. **Unlock**: Achievements unlocked with notifications
4. **Display**: Achievement badges and progress shown to users

## Testing Guidelines

### Test Structure
- **Unit Tests**: Located next to source files (e.g., `utils/memoize.test.ts`)
- **Integration Tests**: In `src/tests/integration/`
- **Test Setup**: Global setup in `src/tests/setup.ts`
- **Coverage**: Run with `yarn test:coverage`

### Testing Framework
- **Vitest**: Fast unit test framework with ESM support
- **jsdom**: Browser environment simulation
- **Testing Library**: Component testing utilities
- **Coverage**: V8 coverage reporting

## Accessibility Guidelines

### WCAG 2.2 AAA Compliance
- **Contrast Ratios**: 7:1 minimum for all text
- **Touch Targets**: 44px minimum size
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Support**: Comprehensive ARIA labels
- **Reduced Motion**: Respects user preferences
- **High Contrast**: Windows High Contrast mode support

### Implementation
- **Focus Management**: Enhanced focus indicators
- **Announcements**: Screen reader announcements for game events
- **Text Spacing**: Enhanced spacing for readability
- **Color Contrast**: All colors meet AAA standards

## Performance Optimizations

### Build Optimizations
- **Static Generation**: Pre-built pages for optimal performance
- **Font Loading**: Preloaded fonts with `display=swap`
- **Bundle Splitting**: Optimized JavaScript bundles
- **DNS Prefetching**: External resource optimization

### Runtime Optimizations
- **Lazy Loading**: Intersection Observer for images
- **CSS Containment**: Performance isolation
- **Memoization**: Cached computations
- **Database**: Edge-distributed Turso for global performance

## CSS Media Queries - WICHTIG! 🚨

**CSS Custom Properties (CSS-Variablen) funktionieren NICHT in Media Queries!**

### ❌ Funktioniert NICHT:
```scss
// Diese Variablen wurden aus global.css entfernt
@media (max-width: var(--breakpoint-md)) { ... }
@media (min-width: var(--breakpoint-lg)) { ... }
```

### ✅ Funktioniert:
```scss
// Verwende diese hardcoded em-Werte in Media Queries
@media (max-width: 19.9375em) { ... }   // xs: bis 319px
@media (max-width: 39.9375em) { ... }   // sm: bis 639px  
@media (max-width: 47.9375em) { ... }   // md: bis 767px
@media (max-width: 63.9375em) { ... }   // lg: bis 1023px
@media (max-width: 79.9375em) { ... }   // xl: bis 1279px

@media (min-width: 20em) { ... }        // xs: ab 320px
@media (min-width: 40em) { ... }        // sm: ab 640px
@media (min-width: 48em) { ... }        // md: ab 768px
@media (min-width: 64em) { ... }        // lg: ab 1024px
@media (min-width: 80em) { ... }        // xl: ab 1280px
```

### 🔧 Grund:
- **Media Queries**: Werden zur Compile-Zeit ausgewertet
- **CSS Custom Properties**: Werden zur Laufzeit ausgewertet
- **Timing-Konflikt**: Media Queries brauchen feste Werte

### 💡 Beste Praxis:
- **Media Queries**: Hardcoded em-Werte verwenden
- **Alles andere**: CSS Custom Properties verwenden (`var(--space-md)`, `var(--color-primary)`)

## Code Style Guidelines

### TypeScript
- **Strict Mode**: Full TypeScript strict mode enabled
- **Type Definitions**: Comprehensive types in `/src/types/`
- **ESLint**: Configured with Astro and accessibility rules
- **Prettier**: Consistent code formatting

### CSS/SCSS
- **BEM Methodology**: Block-Element-Modifier naming convention
- **CSS Variables**: Extensive use of custom properties
- **Global Styles**: Centralized in `/src/styles/global.css`
- **Performance**: CSS containment and optimization

### Performance-Optimierungen
- CSS Containment verwenden: `contain: layout style paint`
- Content Visibility: `content-visibility: auto`
- Will-Change sparsam einsetzen

### Global.css Integration
- Immer global.css Variablen verwenden statt hardcoded Werte
- Konsistente Naming-Conventions beachten
- Performance-Variablen nutzen

### Responsive Design
- Mobile-First-Approach
- Em-basierte Breakpoints für bessere Accessibility
- Touch-Target-Größen: `var(--touch-target-enhanced)`

### Astro Components
- **Component Props**: Strongly typed with TypeScript
- **Accessibility**: ARIA labels and semantic HTML
- **Performance**: Optimized hydration and loading
- **Styling**: Scoped styles with global variable usage

## Security Considerations

### Authentication
- **Password Validation**: Strong password requirements
- **Rate Limiting**: Protection against brute force attacks
- **Session Management**: Secure server-side sessions
- **Token Handling**: Secure cookie configuration

### Data Protection
- **Input Sanitization**: All user inputs validated
- **SQL Injection**: Parameterized queries with Turso
- **XSS Prevention**: Proper output encoding
- **CSRF Protection**: Token-based protection

## Deployment Guidelines

### Build Process
1. **Type Check**: `astro check` validates TypeScript
2. **Font Installation**: Sharp for image optimization
3. **Static Generation**: `astro build --remote` for production
4. **Asset Optimization**: Automated compression and minification

### Production Considerations
- **Environment Variables**: Secure configuration management
- **Database Migrations**: Automated schema updates
- **CDN Integration**: Optimized asset delivery
- **Monitoring**: Performance and error tracking

## Quick Start for New Developers

1. **Clone and Setup**: `git clone` → `yarn install` → `yarn db:setup`
2. **Start Development**: `yarn dev`
3. **Study Game Engine**: Read `/src/scripts/gameEngine.ts`
4. **Understand I18n**: Review `/src/utils/i18n.ts`
5. **Explore Database**: Check `/db/migrations/`
6. **Run Tests**: `yarn test` to understand test patterns

## High-Level Architecture Understanding

### Core Game Flow
```
User → Game Selection → Question Loading → Answer Processing → Score Calculation → Achievement Check → End Game
```

### Key Game Files Deep Dive
- **`gameEngine.ts`**: Master game coordinator with question flow, answer handling, and achievement integration
- **`[lang]/game-[category]/[difficulty].astro`**: Main game page template with UI and game initialization
- **`[lang]/chronology-[category]/[difficulty].astro`**: Chronology variant game page
- **`save-result.ts`**: API endpoint for saving game results to database
- **`endGameUtils.ts`**: Handles game completion, score saving, and navigation

### Component Architecture
- **Layout Components**: Base page structure with header/footer
- **Game Components**: Question display, answer options, joker system
- **Overlay Components**: FeedbackOverlay, EndOverlay, ChronologyFeedbackOverlay
- **Achievement Components**: Notification system with visual feedback
- **Audio Components**: AudioPlayer for preview tracks

### Data Flow
1. **Question Loading**: Language-specific JSON files with fallback to German
2. **Answer Processing**: Real-time validation with speed bonuses
3. **Score Calculation**: Immediate feedback with achievement tracking
4. **Result Saving**: Database storage via API with user statistics update
5. **Achievement Processing**: Asynchronous achievement evaluation

### Database Schema Overview
- **Primary Tables**: `users`, `game_results`, `user_mode_stats`, `achievements`, `user_achievements`
- **Relationships**: User-centric design with cascading statistics
- **Performance**: Optimized queries with caching and indexing
- **Migrations**: Version-controlled schema updates

## Essential Development Patterns

### Game State Management
- **Centralized State**: Game engine manages all game state
- **Real-time Updates**: DOM updates via requestAnimationFrame
- **Performance Tracking**: Achievement-related timing and accuracy metrics
- **Cleanup**: Proper resource management and event listener cleanup

### Error Handling
- **Graceful Degradation**: Fallback mechanisms for missing data
- **User Feedback**: Clear error messages and recovery options
- **Logging**: Comprehensive error tracking for debugging
- **Validation**: Input validation at API and client levels

### Performance Optimization
- **CSS Containment**: Isolation for better rendering performance
- **Lazy Loading**: Intersection Observer for deferred content
- **Memoization**: Cached computations and database queries
- **Bundle Splitting**: Optimized JavaScript delivery

### Accessibility Implementation
- **WCAG 2.2 AAA**: Full compliance with enhanced contrast and interaction
- **Keyboard Navigation**: Complete keyboard control with shortcuts
- **Screen Reader Support**: ARIA labels and live regions
- **Reduced Motion**: Respectful animation handling

## Quick Start for Claude Instances

### Essential Files to Read First
1. **`gameEngine.ts`**: Complete game logic and flow
2. **`[lang]/game-[category]/[difficulty].astro`**: Main game template
3. **`save-result.ts`**: API endpoint for game results
4. **`i18n.ts`**: Internationalization utilities
5. **`achievementService.ts`**: Achievement processing logic

### Common Development Tasks
- **New Game Features**: Modify `gameEngine.ts` and related components
- **Database Changes**: Update migrations and service files
- **UI Modifications**: Work with Astro components and SCSS
- **Achievement System**: Extend `achievementService.ts` and related files
- **Internationalization**: Update JSON files and translation utilities

### Testing Strategy
- **Unit Tests**: Located next to source files
- **Integration Tests**: Game flow and database operations
- **Accessibility Tests**: WCAG compliance validation
- **Performance Tests**: Load time and interaction responsiveness

### Development Workflow
1. **Start**: `yarn dev` for development server
2. **Database**: `yarn db:setup` for local database
3. **Testing**: `yarn test` for continuous testing
4. **Linting**: `yarn lint` for code quality
5. **Build**: `yarn build` for production verification