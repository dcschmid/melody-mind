# Graphite-Minimal WCAG AAA Design (Token-Centric Layout)

Date: 2026-01-19

## Goal
Create a site-wide Graphite-Minimal dark theme that meets WCAG AAA contrast and usability expectations. The design should feel cool, minimal, and highly readable in low-light contexts, with consistent tokens and component-level scoped styles (no global CSS).

## Constraints
- Astro 5.x only.
- No external or global CSS files.
- All styling lives inside `<style>` blocks in the same `.astro` file as markup (scoped by default).
- BEM class naming only.
- Accessibility and performance take priority over aesthetics.

## Approach (Token-Centric)
All base tokens (color, spacing, typography, focus, shadows) live in `src/layouts/Layout.astro` and are consumed by component styles. Components do not define their own color systems; they only reference tokens. This yields a consistent Graphite-Minimal theme across the site with minimal redundancy.

## Visual Direction
- **Backgrounds:** Deep graphite with subtle cool undertones. Primary surface nearly black; secondary surface one step lighter for cards and panels; tertiary surface only for very subtle separation.
- **Text:** Very light, neutral text for AAA contrast on dark backgrounds. Headings slightly brighter for hierarchy.
- **Accent:** Cool cyan for focus, links, and active states; restrained to avoid glare.
- **Texture:** Subtle noise overlay and faint gradients to prevent large, flat dead zones.
- **Shadows:** Low-profile, diffuse shadows; rely on tonal contrast more than heavy elevation.

## Accessibility (AAA)
- High-contrast text and controls on all surfaces.
- Clear focus-visible rings (thickness + offset).
- Links indicated by both color and underline/border.
- Buttons, inputs, and nav targets sized to 44x44px minimum.
- Respect `prefers-reduced-motion` for transitions.
- Semantic HTML; ARIA only when necessary.

## Component Guidance
- **Prose blocks:** Treated as a BEM block; headers, lists, quotes, and media styles derive from tokens.
- **Images:** Defined ratios and clear borders to prevent low-contrast edges.
- **Tables:** Visible separators with AAA contrast (no hairline borders).
- **Navigation/Breadcrumbs:** Strong separation and consistent spacing; no low-contrast separators.

## Performance
- No additional JavaScript for styling.
- Avoid layout shifts by defining image ratios and predictable spacing.
- Minimal transitions and no heavy runtime effects.

## Files Impacted (Planned)
- `src/layouts/Layout.astro` (global tokens and base surface styling)
- Component `.astro` files with local `<style>` blocks (BEM-only)
- Removal/migration away from `src/styles/*` global CSS

## Success Criteria
- Site-wide dark theme consistent with Graphite-Minimal direction.
- AAA contrast across text, links, and controls.
- All styling local to `.astro` files with scoped `<style>` blocks.
- No external or global stylesheets remain in use.
