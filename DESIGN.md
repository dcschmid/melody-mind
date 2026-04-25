---
name: MelodyMind
description: Warm editorial music knowledge and listening surfaces with restrained color and accessible typography.
colors:
  warm-canvas: "#f6f1e8"
  warm-section: "#ede2d2"
  warm-elevated: "#decebb"
  paper-surface: "#fcfaf6"
  paper-muted: "#f4ece0"
  paper-strong: "#e9dcc9"
  ink-primary: "#1c140f"
  ink-secondary: "#3b2d24"
  ink-tertiary: "#5a4739"
  amber-accent: "#72451f"
  amber-accent-strong: "#583114"
  amber-accent-hover: "#5f3414"
  night-canvas: "#08131a"
  night-surface: "#0e1a22"
  night-ink-primary: "#f5f7fb"
  night-ink-secondary: "#d8e3ed"
  night-accent: "#d4a574"
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
    backgroundColor: "{colors.amber-accent}"
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

**Creative North Star: "The Warm Record Shelf"**

MelodyMind should feel like a trusted independent music publication with a well-kept listening room attached. The interface is editorial first: readable, warm, specific, and confident without becoming academic or showy. Users are casual music fans browsing during leisure time, so surfaces should invite exploration while staying calm enough for reading.

The system favors warm paper backgrounds, amber-brown accents, generous rhythm, and clear hierarchy. Components should support content rather than compete with it. It explicitly rejects neon-on-dark AI aesthetics, cyan or purple glow, glassmorphism, gradient text, bounce motion, side-stripe card accents, and endless identical card grids.

**Key Characteristics:**

- Warm paper-like light mode is the primary experience.
- Dark mode is a full reading mode, not an afterthought.
- Accent color is rare and meaningful.
- Typography carries hierarchy before boxes and decoration.
- Motion is short, stateful, and editorial.

## 2. Colors

The palette is warm, amber-led, and publication-like in light mode, with a cooler night-reading palette for dark mode.

### Primary

- **Warm Canvas** (`#f6f1e8`): The main page background, used to create the paper-like reading base.
- **Amber Accent** (`#72451f`): Primary actions, active states, focus-adjacent emphasis, and selected media states.
- **Amber Accent Strong** (`#583114`): Stronger accent contrast and hover depth where the primary amber needs more weight.

### Neutral

- **Paper Surface** (`#fcfaf6`): Cards, panels, player surfaces, and raised editorial blocks.
- **Paper Muted** (`#f4ece0`): Secondary panels, quiet chip backgrounds, and layered surfaces.
- **Ink Primary** (`#1c140f`): Main body and heading text in light mode.
- **Ink Secondary** (`#3b2d24`): Metadata, secondary labels, and supporting copy.
- **Ink Tertiary** (`#5a4739`): Hints and low-priority text only.
- **Night Canvas** (`#08131a`): Main dark-mode canvas.
- **Night Surface** (`#0e1a22`): Dark-mode panels and card surfaces.
- **Night Ink Primary** (`#f5f7fb`): Dark-mode primary text.
- **Night Accent** (`#d4a574`): Dark-mode accent color.

### Named Rules

**The Rare Accent Rule.** Amber earns attention because it is uncommon. Use it for primary actions, current selections, links, and meaningful state, not as general decoration.

**The Warm Neutral Rule.** Light-mode neutrals should feel like paper and ink. Avoid flat gray unless a system token already defines it for a specific reason.

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

- **Style:** Clear, predictable, and editorial. Navigation should aid browsing without becoming dense dashboard chrome.
- **State:** Current and hover states may use amber tint sparingly.

### Media Players

- **Style:** Warm panel shell with clear controls, visible focus, and explicit text alternatives for lyrics or transcripts.
- **Motion:** Visualizer motion is acceptable when playback is active, but must respect `prefers-reduced-motion`.

## 6. Do's and Don'ts

### Do

- Use the shared CSS custom properties from `master-theme.css`.
- Keep light mode warm and paper-like.
- Keep dark mode calm, readable, and high contrast.
- Use amber to communicate action, selection, and meaningful state.
- Build real semantic controls for interactive rows and media actions.
- Respect `prefers-reduced-motion` for every animation.
- Keep copy plain, specific, and useful.

### Don't

- Do not use gradient text.
- Do not use decorative glassmorphism or blur panels.
- Do not use bounce or elastic motion.
- Do not add colored side-stripe borders to cards, lists, or alerts.
- Do not build identical icon-card grids as the default answer.
- Do not make gray-on-color text combinations.
- Do not advertise keyboard shortcuts that are not actually reachable.
- Do not leave media tracks without a real source or an accessible lyrics/transcript fallback.
