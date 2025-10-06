# Styling Architecture

This document describes the current CSS architecture of MelodyMind after the token modularization
refactor.

## Overview

The styling layer is intentionally minimal, predictable, and accessibility‑first. The goals:

- Single source of truth for design tokens (no semantic leakage)
- Clear separation between raw tokens and semantic/component mappings
- Extremely small amount of global overrides
- Easy future extension (e.g. themes, high contrast) without token drift
- WCAG AAA alignment for focus, typography, spacing affordances

## File Structure

| File                       | Purpose                                                                                                                                                                                                                                               |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/styles/tokens.css`    | Pure design tokens: colors, spacing, typography primitives, radii, shadows, durations, easing, baseline focus, icon sizes, opacity & scrollbar dimension tokens, achievement colors. No component semantics.                                          |
| `src/styles/base.css`      | Semantic + structural variables that map tokens to UI concerns: borders, interactive state colors, form, button, card, scrollbar color semantics, focus enhanced variants, media-query based environment adaptations (reduced motion / reduced data). |
| `src/styles/utilities.css` | Tiny utility classes (currently only `.sr-only`).                                                                                                                                                                                                     |
| `src/styles/global.css`    | Loader/import wrapper; no remaining variable definitions.                                                                                                                                                                                             |
| (removed) `wcag-aaa.css`   | Was empty; deleted to avoid dead file noise.                                                                                                                                                                                                          |

## Design Principles

1. Tokens are raw values and may reference other tokens only through composition (e.g. `--space-md`
   alias referencing `--spacing-md`).
2. No component name (e.g. `btn`, `card`, `form`) belongs in `tokens.css`.
3. Semantic group variables belong in `base.css` if they bind a token to a domain concept (e.g.
   `--form-bg`, `--btn-primary-bg`).
4. Utility classes stay minimal; prefer semantic variables + component styles inside Astro
   components or partials.
5. Avoid duplicating raw numbers—if a number repeats 3+ times, consider a token.
6. Prefer removing unused variables over speculative preservation.

## Reduced Motion & Data

The `@media (prefers-reduced-motion: reduce)` and `@media (prefers-reduced-data: reduce)` blocks
intentionally live in `base.css`, centralizing environment adaptation near semantic mappings instead
of scattering overrides.

## Scrollbar Styling

Scrollbar size & radius tokens live in `tokens.css` (`--scrollbar-thin`, `--scrollbar-track-radius`,
`--scrollbar-thumb-radius`), while color semantics are defined in `base.css` to allow future theming
without touching the dimensional tokens.

## Achievement & Opacity Tokens

Moved from `base.css` to `tokens.css` because they represent neutral design primitives (can be
reused in badges, progress indicators, etc.).

## How to Add New Tokens

1. Add raw token to `tokens.css` inside the main `:root` block.
2. If semantic naming required (e.g. `--badge-success-bg`), add it to `base.css` pointing to the raw
   token.
3. If a component needs a unique value not yet generalized, keep it local to the component
   first—promote to semantic variable only after the pattern proves reusable.
4. Document any non-obvious rationale in a short comment.

## Theming / Future Extension

To introduce theming:

- Keep `tokens.css` as baseline (light/dark agnostic where possible).
- Append `[data-theme="dark"] { ... }` or media-query overrides redefining a subset of tokens
  (colors, elevation intensity).
- Avoid redefining semantic vars directly; update the underlying token instead.

## Accessibility Notes

- Focus ring baseline lives in tokens; enhanced contrast & shadow variants live in `base.css`.
- `.sr-only` utility references dedicated SR-only dimension tokens (kept in tokens for consistency).
- Line-height & tracking enhance readability; do not reduce below `1.5` in body contexts.

## Removal Policy

A variable can be removed if:

- It has zero textual references in the repository (search via grep).
- It is fully superseded by another semantic mapping.
- Its original use case (e.g. experimental animation) was abandoned.

## Checklist Before Committing Style Changes

- [ ] New raw values added only to `tokens.css`.
- [ ] Semantic additions live in `base.css`.
- [ ] No orphan tokens (every token either used directly or intentionally reserved with a comment).
- [ ] Run `yarn build:check` to ensure no accidental side effects.
- [ ] Update this document if architectural rule changes.

## Rationale for Recent Cleanup

- Removed legacy root variable block from `global.css` (all either unused or migrated).
- Moved achievement, opacity, and scrollbar dimension values to tokens for clearer separation.
- Deleted unused, empty `wcag-aaa.css` to reduce noise.

## Pending Opportunities (Optional)

- Introduce dark-mode token overrides if/when design finalized.
- Extract animation scale tokens if reintroduced (currently pruned).
- Consider a lightweight critical CSS extraction if above-the-fold size becomes a bottleneck.

---

Last updated: 2025-10-06
