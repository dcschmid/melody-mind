# Shared UI

`@melody-mind/shared-ui` provides the shared Astro components, layout primitives, and
theme tokens used across the MelodyMind apps.

## Scope

- layout primitives
- navigation components
- typography components
- cards, buttons, badges, and search UI
- theme initialization helpers
- semantic design tokens in `src/styles/master-theme.css`

## Styling Rules

- Use semantic tokens from `src/styles/master-theme.css` instead of raw palette values.
- Keep CSS scoped in the `.astro` file.
- Follow BEM naming.
- Support both light and dark mode through shared semantic variables.
- Prefer existing spacing, radius, border, and shadow tokens before introducing new ones.

## Accessibility Baseline

- Prefer semantic HTML first.
- Keep labels available for forms, even when visually hidden.
- Decorative icons should be `aria-hidden="true"`.
- Use live regions only for real state changes.
- Maintain usable focus states with `:focus-visible`.

## Commands

```bash
pnpm --filter @melody-mind/shared-ui lint
pnpm --filter @melody-mind/shared-ui lint:check
pnpm --filter @melody-mind/shared-ui format
pnpm --filter @melody-mind/shared-ui format:check
```

## Verification

After Shared UI changes, usually run:

- `pnpm --filter @melody-mind/shared-ui format:check`
- `pnpm --filter @melody-mind/shared-ui lint:check`
- `pnpm build`

## Notes

- `MasterLayout.astro` owns document-level shell concerns.
- `PageShell.astro` owns width and page rhythm, not app-specific decoration.
- Shared empty and status patterns should live here when they are reused across apps.
