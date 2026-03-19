# Shared UI

Shared UI provides the Astro components, tokens, and small client bootstraps used across MelodyMind apps.

## Styling rules

- Use semantic tokens from `src/styles/master-theme.css` instead of raw palette values.
- Keep component CSS scoped in the `.astro` file and follow BEM naming.
- Prefer serious, low-noise surfaces: subtle gradients, restrained shadows, and clear spacing.
- Support both light and dark mode through existing semantic variables, not component-specific palette forks.
- Use `:focus-visible` for interactive focus treatment and keep reduced-motion fallbacks in the component.

## Accessibility baseline

- Interactive controls should meet at least `48px` target size where practical.
- Labels must stay present for forms, even when visually hidden.
- Decorative icons should be `aria-hidden="true"`.
- Status and helper messages should use live regions only where state actually changes.

## Component conventions

- `MasterLayout.astro` owns document-level background, theme initialization, and shell slots.
- `PageShell.astro` owns page width and vertical rhythm, not component-specific decoration.
- `FooterShell.astro` and `Footer.astro` separate structural layout from footer content styling.
- `AutoInitScript.astro` should import bundled client entries only; avoid bare module specifiers in inline browser code.

## Verification

- Run `pnpm build` from the repo root after Shared UI changes.
- Use `rg` to catch raw legacy tokens or stray emojis before shipping.
