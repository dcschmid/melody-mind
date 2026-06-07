---
name: MelodyMind
description: Music-first editorial surfaces with warm paper light mode, violet-blue night mode, app chrome, and accessible typography.
colors:
  warm-canvas: "oklch(98% 0.016 75deg)"
  warm-section: "oklch(95% 0.026 74deg)"
  warm-elevated: "oklch(91% 0.047 25deg)"
  paper-surface: "oklch(98% 0.014 75deg)"
  paper-muted: "oklch(94% 0.032 70deg)"
  paper-strong: "oklch(90% 0.042 62deg)"
  ink-primary: "oklch(19% 0.025 52deg)"
  ink-secondary: "oklch(34% 0.032 48deg)"
  ink-tertiary: "oklch(39% 0.033 55deg)"
  ember-accent: "oklch(40% 0.13 16deg)"
  ember-accent-strong: "oklch(38% 0.125 16deg)"
  ember-accent-hover: "oklch(36% 0.13 16deg)"
  night-canvas: "oklch(13% 0.038 255deg)"
  night-surface: "oklch(18% 0.037 255deg)"
  night-surface-raised: "oklch(22% 0.041 252deg)"
  night-ink-primary: "oklch(96% 0.012 72deg)"
  night-ink-secondary: "oklch(82% 0.028 248deg)"
  night-ink-tertiary: "oklch(76% 0.036 252deg)"
  night-accent: "oklch(78% 0.16 286deg)"
  night-accent-strong: "oklch(80% 0.13 252deg)"
typography:
  display:
    fontFamily: "Atkinson Hyperlegible, ui-sans-serif, system-ui, -apple-system, sans-serif"
    fontSize: "clamp(2.75rem, 2.15rem + 2.35vw, 4.5rem)"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "0em"
  headline:
    fontFamily: "Atkinson Hyperlegible, ui-sans-serif, system-ui, -apple-system, sans-serif"
    fontSize: "clamp(2.25rem, 1.88rem + 1.7vw, 3.25rem)"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "0em"
  title:
    fontFamily: "Atkinson Hyperlegible, ui-sans-serif, system-ui, -apple-system, sans-serif"
    fontSize: "clamp(1.5rem, 1.34rem + 0.9vw, 2rem)"
    fontWeight: 700
    lineHeight: 1.375
    letterSpacing: "0em"
  body:
    fontFamily: "Atkinson Hyperlegible, ui-sans-serif, system-ui, -apple-system, sans-serif"
    fontSize: "clamp(1.125rem, 1.1rem + 0.5vw, 1.25rem)"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "0em"
  label:
    fontFamily: "Atkinson Hyperlegible, ui-sans-serif, system-ui, -apple-system, sans-serif"
    fontSize: "clamp(1rem, 0.98rem + 0.2vw, 1.125rem)"
    fontWeight: 600
    lineHeight: 1.375
    letterSpacing: "0.05em"
rounded:
  sm: "0.25rem"
  base: "0.5rem"
  md: "0.75rem"
  lg: "1rem"
  xl: "1.5rem"
  2xl: "2rem"
  full: "9999px"
spacing:
  2xs: "0.125rem"
  xs: "0.25rem"
  sm: "0.5rem"
  md: "0.75rem"
  base: "1rem"
  lg: "1.5rem"
  xl: "2rem"
  2xl: "3rem"
  3xl: "4rem"
  4xl: "6rem"
components:
  button-primary:
    backgroundColor: "{colors.ember-accent}"
    textColor: "{colors.paper-surface}"
    rounded: "{rounded.base}"
    padding: "0.5rem 1.5rem"
  panel-surface:
    backgroundColor: "{colors.paper-surface}"
    textColor: "{colors.ink-primary}"
    rounded: "{rounded.lg}"
    padding: "1.5rem"
  chip-neutral:
    backgroundColor: "{colors.paper-muted}"
    textColor: "{colors.ink-secondary}"
    rounded: "{rounded.full}"
    padding: "0.25rem 0.75rem"
---

# Design System: MelodyMind

## 1. Overview

**Creative North Star: "The Record Shelf With Night Mode"**

MelodyMind should feel like a trusted independent music publication with a well-kept listening room attached. The interface is editorial first: readable, warm, specific, and confident without becoming academic or showy. The Music app is now the product and visual source of truth.

The system favors warm paper backgrounds in light mode, a saturated violet-blue music-room atmosphere in dark mode, generous rhythm, and clear hierarchy. Components should support content rather than compete with it. It rejects generic AI gradients, glassmorphism, gradient text, bounce motion, side-stripe card accents, and endless identical card grids.

**Key Characteristics:**

- Music app chrome is the product baseline.
- Warm paper-like light mode is the editorial daytime experience.
- Violet-blue dark mode is the immersive listening and night-reading experience.
- Accent color is meaningful and tied to state, navigation, media, and primary actions.
- Typography carries hierarchy before boxes and decoration.
- Motion is short, stateful, and editorial.

## 2. Colors

The palette is warm and publication-like in light mode, with a cooler violet-blue listening palette for dark mode. Use the Music app CSS custom properties as the source of truth.

### Primary

- **Warm Canvas** (`oklch(98% 0.016 75deg)`): The main light-mode page background.
- **Ember Accent** (`oklch(40% 0.13 16deg)`): Light-mode primary actions, active states, focus-adjacent emphasis, and selected media states.
- **Night Canvas** (`oklch(13% 0.038 255deg)`): The main dark-mode canvas.
- **Night Accent** (`oklch(78% 0.16 286deg)`): Dark-mode active states, navigation emphasis, media controls, and primary actions.

### Neutral

- **Paper Surface** (`oklch(98% 0.014 75deg)`): Cards, panels, player surfaces, and raised editorial blocks.
- **Paper Muted** (`oklch(94% 0.032 70deg)`): Secondary panels, quiet chip backgrounds, and layered surfaces.
- **Ink Primary** (`oklch(19% 0.025 52deg)`): Main body and heading text in light mode.
- **Ink Secondary** (`oklch(34% 0.032 48deg)`): Metadata, secondary labels, and supporting copy.
- **Ink Tertiary** (`oklch(39% 0.033 55deg)`): Hints and low-priority text only.
- **Night Surface** (`oklch(18% 0.037 255deg)`): Dark-mode panels and card surfaces.
- **Night Surface Raised** (`oklch(22% 0.041 252deg)`): Stronger dark-mode panels, drawers, and menus.
- **Night Ink Primary** (`oklch(96% 0.012 72deg)`): Dark-mode primary text.
- **Night Ink Secondary** (`oklch(82% 0.028 248deg)`): Dark-mode supporting text.

### Named Rules

**The Accent Role Rule.** Ember in light mode and violet-blue in dark mode are functional accents. Use them for primary actions, current selections, links, focus-adjacent emphasis, and meaningful media state, not as general decoration.

**The Warm Neutral Rule.** Light-mode neutrals should feel like paper and ink. Avoid flat gray unless a system token already defines it for a specific reason.

**The Night Music Rule.** Dark mode can feel atmospheric, but it must stay readable. Saturated violet-blue accents belong in active controls, header navigation, drawer CTAs, and subtle background blooms. Do not turn content cards into neon panels.

## 3. Typography

**Display Font:** Atkinson Hyperlegible with system sans fallbacks  
**Body Font:** Atkinson Hyperlegible with system sans fallbacks  
**Label/Mono Font:** System monospace only for code-like text

**Character:** The type system prioritizes accessibility and editorial clarity. It should feel readable and composed, with enough weight contrast to guide scanning.

### Hierarchy

- **Display** (700, `clamp(2.75rem, 2.15rem + 2.35vw, 4.5rem)`, 1.25, `0em`): Major page and hero titles only.
- **Headline** (700, `clamp(2.25rem, 1.88rem + 1.7vw, 3.25rem)`, 1.25, `0em`): Section-level editorial headings.
- **Title** (700, `clamp(1.5rem, 1.34rem + 0.9vw, 2rem)`, 1.375): Component and card titles.
- **Body** (400, `clamp(1.125rem, 1.1rem + 0.5vw, 1.25rem)`, 1.625): Main reading text. Keep prose measures near 65-75 characters.
- **Label** (600, `clamp(1rem, 0.98rem + 0.2vw, 1.125rem)`, 0.05em): Metadata, pills, compact labels, and UI headings.

### Named Rules

**The Typography-First Rule.** Use size, weight, spacing, and measure before adding boxes. Containers should clarify relationships, not replace hierarchy.

## 4. Elevation

MelodyMind uses a hybrid of tonal layering, borders, and soft shadows. Surfaces should usually read as paper layers rather than floating app chrome. Shadows are acceptable for raised cards, headers, and media controls, but they should stay quiet and never become glow effects.

### Shadow Vocabulary

- **Subtle** (`--shadow-sm`): Small interactive lifts and quiet affordances.
- **Base** (`--shadow-base`): Default card depth where a flat border is not enough.
- **Large** (`--shadow-lg`): Media players, overlays, and surfaces that need separation from dense content.
- **Extra Large** (`--shadow-xl` / `--shadow-2xl`): Rare overlays only.

### Named Rules

**The Paper Layer Rule.** Prefer border, tint, and spacing before heavy shadows. Glow should only appear as brief state feedback and should animate through opacity or transform, not paint-heavy shadow changes.

## 5. Components

### Buttons

- **Shape:** Compact rounded rectangles or pills depending on the control role (`0.5rem` to `9999px`).
- **Primary:** Amber background with paper text, using `--button-padding-y` and `--button-padding-x`.
- **Hover / Focus:** Slight color shift, visible focus outline, and short transform feedback only when motion is allowed.
- **Icon Controls:** Minimum target size is `2.75rem`, larger on coarse pointers.

### Chips

- **Style:** Warm paper tint, soft border, compact padding, and label-weight text.
- **State:** Selected or current chips may use a low-percentage amber tint. Avoid saturated inactive chips.

### Cards / Containers

- **Corner Style:** Usually `1rem` or below for standard content. Larger radii are reserved for media/player shells.
- **Background:** `--surface-panel-bg`, `--surface-panel-raised`, or `--surface-1`.
- **Shadow Strategy:** Use borders and tonal layers first; add `--shadow-lg` only when the surface needs strong separation.
- **Border:** Soft tokenized borders, never side-stripe accents.
- **Internal Padding:** Use the spacing scale, commonly `1rem`, `1.5rem`, or responsive panel padding tokens.

### Inputs / Fields

- **Style:** Paper surface background, tokenized border, readable labels, and `0.5rem` radius.
- **Focus:** Use the shared focus ring width, offset, and color. Never remove focus without a replacement.
- **Error / Disabled:** Use semantic tokens and plain-language recovery text.

### Navigation

- **Style:** Use the established Music app chrome. Header, footer, theme toggle, mobile drawer, nav links, and back-to-top live under these component names: `navigation/SiteHeader.astro`, `navigation/HeaderNav.astro`, `navigation/HeaderMobileExtras.astro`, `layout/Footer.astro`, `actions/ThemeToggle.astro`, and `navigation/BackToTop.astro`.
- **State:** Current and hover states use ember in light mode and violet-blue in dark mode. The search action may use a circular icon button.
- **Mobile:** The mobile drawer is a compact modal menu with inert page content, focus trapping, clear CTAs, and touch-sized links.

### Media Players

- **Style:** Warm panel shell with clear controls, visible focus, and explicit text alternatives for lyrics or transcripts.
- **Motion:** Visualizer motion is acceptable when playback is active, but must respect `prefers-reduced-motion`.

### App Chrome

- `navigation/SiteHeader.astro`: responsive Music header.
- `navigation/HeaderNav.astro`: nav item rendering with active state and search treatment.
- `navigation/HeaderMobileExtras.astro`: mobile drawer chips and CTA area.
- `layout/Footer.astro`: footer with brand area, grouped links, settings, and theme toggle.
- `actions/ThemeToggle.astro`: three-state theme control.
- `navigation/BackToTop.astro`: floating scroll control.

Do not recreate these components in parallel folders. Music layouts should configure them through props or shell config.

## 6. Do's and Don'ts

### Do

- Use the Music app CSS custom properties.
- Keep light mode warm and paper-like.
- Keep dark mode atmospheric, readable, and high contrast.
- Use ember or violet-blue accents to communicate action, selection, and meaningful state.
- Put reusable chrome in the established component paths instead of a parallel folder.
- Build real semantic controls for interactive rows and media actions.
- Respect `prefers-reduced-motion` for every animation.
- Keep copy plain, specific, and useful.

### Don't

- Do not use gradient text.
- Do not use decorative glassmorphism or blur panels.
- Do not use bounce or elastic motion.
- Do not add colored side-stripe borders to cards, lists, or alerts.
- Do not build identical icon-card grids as the default answer.
- Do not duplicate app chrome.
- Do not make gray-on-color text combinations.
- Do not advertise keyboard shortcuts that are not actually reachable.
- Do not leave media tracks without a real source or an accessible lyrics/transcript fallback.
