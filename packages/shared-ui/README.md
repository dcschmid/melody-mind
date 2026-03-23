# Shared UI

`@melody-mind/shared-ui` contains the shared Astro UI system used across MelodyMind apps.
It provides reusable components, layout primitives, navigation, cards, media helpers, and
theme tokens.

## What Belongs Here

- cross-app layout primitives
- shared navigation and footer components
- reusable cards, badges, buttons, typography, and search UI
- app-agnostic media primitives
- document shell and initialization helpers
- semantic design tokens in `src/styles/master-theme.css`

## What Does Not Belong Here

- app-specific routing assumptions
- Knowledge taxonomy logic
- Podcast feed or episode domain logic
- Quiz-specific question/content rules
- app-local asset discovery logic

If a component requires too much app-specific branching, keep the orchestration in the app
and only share the truly reusable piece.

## Directory Structure

```text
src/
├── components/
│   ├── actions/
│   ├── badges/
│   ├── buttons/
│   ├── cards/
│   ├── init/
│   ├── layout/
│   ├── media/
│   ├── meta/
│   ├── navigation/
│   ├── policies/
│   ├── search/
│   ├── typography/
│   └── visual/
├── constants/
├── scripts/
└── styles/
```

## Key Responsibilities

### Layout and Shell

- `MasterLayout.astro`: document-level shell concerns
- footer, header, skip-link, and shell primitives
- app-head resource components and shared meta rendering

### Media

- shared optimized image and picture rendering
- reusable card and hero image behavior
- asset-format-agnostic rendering for local Astro assets and safe fallbacks

### Design System

- semantic spacing, color, border, and shadow tokens
- consistent BEM-friendly component structure
- dark/light theme support through shared variables

## Styling Rules

- use semantic tokens from `src/styles/master-theme.css`
- keep CSS scoped in the `.astro` component
- follow BEM naming
- prefer existing tokens before adding new palette values or spacing constants
- support both light and dark mode through semantic variables

## Accessibility Baseline

- semantic HTML first
- labels remain available even when visually hidden
- decorative icons should be `aria-hidden="true"`
- use live regions only for real state changes
- maintain visible `:focus-visible` states
- keep keyboard access intact for menus, dialogs, and interactive controls

## Commands

```bash
pnpm --filter @melody-mind/shared-ui lint
pnpm --filter @melody-mind/shared-ui lint:check
pnpm --filter @melody-mind/shared-ui format
pnpm --filter @melody-mind/shared-ui format:check
pnpm --filter @melody-mind/shared-ui stylelint
pnpm --filter @melody-mind/shared-ui stylelint:check
```

## Recommended Validation

After Shared UI changes, the safest path is:

```bash
pnpm --filter @melody-mind/shared-ui format:check
pnpm --filter @melody-mind/shared-ui lint:check
```

Then build every affected consumer app. In practice that often means:

```bash
pnpm --filter knowledge build
pnpm --filter quiz build
pnpm build:podcasts
```

## Notes

- Keep components composable instead of deeply configurable when possible.
- Prefer pushing app content into config objects rather than duplicating UI components.
- Shared empty states, status patterns, and shell-level head/meta pieces belong here when
  used by more than one app.
