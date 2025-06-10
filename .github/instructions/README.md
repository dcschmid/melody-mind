# MelodyMind Development Instructions

This directory contains comprehensive coding instructions for the MelodyMind project. These instructions are enforced automatically and must be followed by all developers and AI assistants.

## 🚨 CRITICAL STANDARDS - NON-NEGOTIABLE

### 1. CSS Variables (HIGHEST PRIORITY)
- **File**: `css-variables-deduplication.instructions.md`
- **Rule**: NEVER use hardcoded colors, spacing, or design tokens
- **Requirement**: ALWAYS use CSS custom properties from `/src/styles/global.css`
- **Examples**: `var(--text-primary)`, `var(--space-md)`, `var(--radius-sm)`

### 2. Code Deduplication (HIGHEST PRIORITY)
- **File**: `css-variables-deduplication.instructions.md`
- **Rule**: ALWAYS check for existing patterns before creating new code
- **Requirement**: Reuse utilities, components, and types from existing codebase
- **Directories to check**: `/src/utils/`, `/src/components/`, `/src/types/`

## 📁 Instruction Files

### Core Standards
- **`css-variables-deduplication.instructions.md`** - Mandatory CSS variables and deduplication rules
- **`astro-component.instructions.md`** - Astro component architecture and best practices
- **`css-style.instructions.md`** - CSS styling standards with WCAG AAA compliance
- **`code-organization.instructions.md`** - File structure and code organization patterns
- **`typescript.instructions.md`** - TypeScript coding standards and type safety

### Specialized Instructions
- **`testing.instructions.md`** - Testing strategies and best practices

## 🔄 Workflow Integration

### Before Writing Any Code
1. **Check CSS Variables**: Verify `/src/styles/global.css` for available design tokens
2. **Search for Existing**: Look in `/src/utils/`, `/src/components/`, `/src/types/`
3. **Review Patterns**: Check similar implementations in the codebase
4. **Plan Reuse**: Identify opportunities to reuse existing code

### Code Review Checklist
- [ ] No hardcoded design values (colors, spacing, fonts)
- [ ] CSS custom properties used throughout
- [ ] Existing utilities and components reused
- [ ] TypeScript interfaces reused from `/src/types/`
- [ ] BEM methodology followed for CSS classes
- [ ] WCAG AAA accessibility standards met
- [ ] Responsive design with predefined breakpoints
- [ ] JSDoc comments for all functions

### Automatic Rejection Criteria
```typescript
// ❌ REJECTED - Hardcoded values
color: '#ffffff'
padding: '16px'
fontSize: '18px'

// ❌ REJECTED - Duplicate functionality
export const calculateScore = (answers: number) => answers * 50;

// ✅ ACCEPTED - CSS variables
color: 'var(--text-primary)'
padding: 'var(--space-md)'
fontSize: 'var(--text-lg)'

// ✅ ACCEPTED - Reused utility
import { calculateScore } from '@utils/game/score';
```

## 🎯 Project-Specific Standards

### MelodyMind Architecture
- **Framework**: Astro.js with TypeScript
- **Styling**: CSS custom properties, BEM methodology
- **Accessibility**: WCAG AAA compliance
- **Internationalization**: Multi-language support
- **Performance**: Optimized for Core Web Vitals

### Design System
- **Colors**: Purple/pink gradient theme with dark mode support
- **Typography**: Source Sans Pro font family
- **Spacing**: 8px base unit system
- **Components**: Modular, reusable component architecture
- **Responsive**: Mobile-first design approach

### Key Directories
```
/src/
├── components/        # Reusable UI components
│   ├── Shared/       # Base components
│   ├── Game/         # Game-specific components
│   ├── Overlays/     # Modals and overlays
│   └── Header/       # Navigation components
├── utils/            # Utility functions
│   ├── game/         # Game logic utilities
│   ├── i18n.ts       # Internationalization
│   └── seo.ts        # SEO utilities
├── types/            # TypeScript type definitions
├── styles/           # Global CSS and variables
│   └── global.css    # CSS custom properties
└── layouts/          # Page layout templates
```

## 🚀 Getting Started

1. **Read Core Instructions**: Start with `css-variables-deduplication.instructions.md`
2. **Understand Architecture**: Review `astro-component.instructions.md`
3. **Learn Styling Rules**: Study `css-style.instructions.md`
4. **Follow Organization**: Apply `code-organization.instructions.md`
5. **Implement TypeScript**: Use `typescript.instructions.md`

## ⚡ Quick Reference

### CSS Variables
```css
/* Colors */
--text-primary, --text-secondary, --text-tertiary
--bg-primary, --bg-secondary, --bg-tertiary
--interactive-primary, --interactive-primary-hover

/* Spacing */
--space-xs (4px), --space-sm (8px), --space-md (16px)
--space-lg (24px), --space-xl (32px), --space-2xl (48px)

/* Typography */
--text-sm (14px), --text-base (16px), --text-lg (18px)
--text-xl (20px), --text-2xl (24px), --text-3xl (30px)

/* Layout */
--radius-sm (6px), --radius-md (8px), --radius-lg (12px)
--shadow-sm, --shadow-md, --shadow-lg, --shadow-xl
--transition-fast, --transition-normal, --transition-slow
```

### Common Utilities
```typescript
// i18n
import { getLangFromUrl, useTranslations } from '@utils/i18n';

// Game logic
import { calculateScore, validateAnswer } from '@utils/game/score';

// SEO
import { generateMetaTags } from '@utils/seo';

// Validation
import { validateEmail, sanitizeInput } from '@utils/validation';
```

### Component Imports
```astro
// Shared components
import PrimaryButton from '@components/Shared/PrimaryButton.astro';
import Modal from '@components/Overlays/Modal.astro';

// Game components
import ScoreDisplay from '@components/Game/ScoreDisplay.astro';
import QuestionCard from '@components/Game/QuestionCard.astro';

// Layout components
import Navigation from '@components/Header/Navigation.astro';
```

## 📚 Additional Resources

- **Global CSS Variables**: `/src/styles/global.css`
- **Component Examples**: `/src/components/` directory
- **Type Definitions**: `/src/types/` directory
- **Utility Functions**: `/src/utils/` directory
- **Documentation**: `/docs/` directory

## 🔧 Enforcement

These instructions are automatically enforced through:
- ESLint configuration
- Prettier formatting rules
- TypeScript strict mode
- Automated accessibility testing
- Code review requirements

**Remember**: These standards are designed to ensure consistency, maintainability, accessibility, and performance across the entire MelodyMind codebase.
