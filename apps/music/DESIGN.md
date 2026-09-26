---
name: MelodyMind Music — Cover-Lit Listening Room
description: A dark listening room where album covers light the space; controls stay calm and AAA-legible.
colors:
  room-night: "oklch(11.5% 0.03 250deg)"
  raised-night: "oklch(17% 0.032 250deg)"
  listening-surface: "oklch(22.5% 0.035 250deg)"
  warm-ink: "oklch(96.5% 0.01 85deg)"
  quiet-ink: "oklch(79% 0.026 248deg)"
  signal-teal: "oklch(80% 0.115 180deg)"
  focus-teal: "oklch(84% 0.11 180deg)"
typography:
  display:
    fontFamily: "Atkinson Hyperlegible, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 5vw, 4.75rem)"
    fontWeight: 700
    lineHeight: 0.98
  title:
    fontFamily: "Atkinson Hyperlegible, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.15
  body:
    fontFamily: "Atkinson Hyperlegible, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Atkinson Hyperlegible, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 700
    lineHeight: 1.2
  caption:
    fontFamily: "Atkinson Hyperlegible, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.3
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  pill: "9999px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.signal-teal}"
    textColor: "{colors.room-night}"
    rounded: "{rounded.pill}"
    padding: "12px 20px"
  card-album:
    backgroundColor: "{colors.raised-night}"
    textColor: "{colors.warm-ink}"
    rounded: "{rounded.md}"
    padding: "8px"
---

# Design System: MelodyMind Music — Cover-Lit Listening Room

## Overview

**Creative North Star: "The Cover-Lit Listening Room"**

MelodyMind is a dark-only product surface built for discovery and uninterrupted
listening. Album artwork — increasingly detailed, color-rich illustration — is the
only variable color source and carries atmosphere and recognition. Navigation,
player, text, and states stay calm, familiar, and permanently readable. The
interface rejects neon-dashboard styling, decorative glass, repeated generic card
grids, and marketing copy that delays the music.

**Key Characteristics:**

- Deep blue canvas (hue 250) with warm primary white; no pure black.
- One teal accent, reserved for action, selection, links, focus, and active playback.
- Cover artwork is the only variable color source; its atmosphere appears only as a
  decorative, dimmed ambient layer behind an opaque deep-blue scrim.
- Information hierarchy: cover/page title → primary play action → context/metadata →
  deeper editorial content.
- Square artwork stays undistorted inside a clear frame; lists and track rows stay
  flat; shadows only for featured artwork or floating controls.

## Visual Rules (exact)

- Deep blue canvas; warm primary white text; no light theme, no second accent color.
- Teal ONLY for action, selection, links, focus, and active playback.
- Never render text directly on uncontrolled cover imagery; ambient art sits behind
  an opaque/dark scrim, `aria-hidden`, low opacity, hidden in forced colors and on mobile.
- Never derive text, control, or status color from cover pixels.
- No gradient typography, no neon-cyberpunk surfaces, no decorative glass panels.
- Typography stays Atkinson Hyperlegible: 18px body/control text, 16px informative
  metadata only, 14px noncritical captions only; body measure capped at 68–72ch;
  display tracking tight but never artificially compressed.
- Shell widths: max 90rem for immersive music pages, 72rem for editorial/profile
  pages; 44px minimum controls; 1px hairline dividers; max `--radius-md` for content
  surfaces.
- Responsive: compact mobile view through `760px`; desktop navigation from
  `72rem`/`1152px` (the only navigation breakpoint).
- Motion: short state/feedback transitions only, all behind
  `prefers-reduced-motion: no-preference`; full static presentation under `reduce`;
  no content gated behind animation.

## Colors

The palette evokes a dim music room with a single clear equipment light.

### Primary

- **Signal Teal** (`oklch(80% 0.115 180deg)`): primary actions, playback,
  selection, links, and focus-related emphasis.

### Neutral

- **Room Night** (`oklch(11.5% 0.03 250deg)`): page background.
- **Raised Night** (`oklch(17% 0.032 250deg)`): navigation and structural panels.
- **Listening Surface** (`oklch(22.5% 0.035 250deg)`): selected rows and raised controls.
- **Warm Ink** (`oklch(96.5% 0.01 85deg)`): primary copy.
- **Quiet Ink** (`oklch(79% 0.026 248deg)`): secondary information.

**The Signal Rule.** Teal communicates action, selection, or active playback. It is not
an ambient decoration applied to every heading or border.

## Typography

**Display Font:** Atkinson Hyperlegible with system fallbacks

**Body Font:** Atkinson Hyperlegible with system fallbacks

**Character:** Highly legible and direct, with hierarchy created by size and weight
rather than changing type families.

### Hierarchy

- **Display** (700, up to 4.75rem, 0.98): featured album and page identity.
- **Headline** (700, 2rem, 1.1): major content sections.
- **Title** (700, 1.5rem, 1.15): albums and subsections.
- **Body** (400, 1.125rem, 1.6): descriptions and liner notes, capped at 72ch.
- **Label** (700, 1rem, 1.2): informative metadata and controls.
- **Caption** (600, 0.875rem, 1.3): noncritical labels; uppercase only for short cues.

**The Listening Density Rule.** Normal reading and control copy stays at 18px,
informative metadata may use 16px, and only noncritical captions may use 14px.

## Elevation

Depth is primarily tonal. Shadows are reserved for floating navigation, the persistent
player, focused artwork, and consent surfaces.

### Shadow Vocabulary

- **Raised control** (`0 12px 20px -4px rgba(0,0,0,.4)`): persistent player and menus.
- **Artwork lift** (`0 24px 32px -8px rgba(0,0,0,.46)`): featured cover only.

**The Flat-by-Default Rule.** Content shelves and track rows use spacing, dividers, and
tonal selection before shadows.

## Components

### Buttons

- **Shape:** pill for primary playback, 8px for utility controls.
- **Primary:** Signal Teal on Room Night, at least 44px tall.
- **Hover / Focus:** stronger teal plus a 3px visible focus outline.
- **Secondary:** transparent or Raised Night with a clear one-pixel border.

### Chips

- **Style:** compact tonal controls with a visible border.
- **State:** selected chips use teal text and Listening Surface; state is never color-only.

### Cards / Containers

- **Corner Style:** 8px artwork and album surfaces.
- **Background:** mostly transparent shelves; Raised Night where grouping is necessary.
- **Shadow Strategy:** flat at rest.
- **Internal Padding:** 8px for album cards, 16px for structural panels.

### Inputs / Fields

- **Style:** dark tonal fill, warm text, 8px radius.
- **Focus:** 3px focus ring with offset.
- **Error / Disabled:** explicit text or icon in addition to color.

### Navigation

Desktop uses a compact top bar. Mobile keeps the same top-level navigation inside the
existing header drawer. Current location uses `aria-current`, shape, and text contrast.

### Persistent Player

The player sits at the bottom of the viewport. It shows artwork, track context, primary
transport, and progress while the page reserves enough space to keep content visible.

## Do's and Don'ts

### Do:

- **Do** keep all normal text at WCAG 2.2 AAA contrast (7:1 normal, 4.5:1 large).
- **Do** keep non-text UI and focus indicators at 3:1 against their real opaque backdrop.
- **Do** use 44px minimum interactive targets and visible keyboard focus.
- **Do** let one featured cover create atmosphere behind a stable opaque scrim.
- **Do** keep track order linear in both DOM and presentation.

### Don't:

- **Don't** create a generic streaming-service clone with interchangeable cards.
- **Don't** use neon cyberpunk gradients, decorative glass panels, or gradient text.
- **Don't** place text or controls on uncontrolled cover imagery.
- **Don't** use colored side-stripe borders or nested cards.
- **Don't** autoplay restored media or hide standard playback affordances.
- **Don't** use decorative motion that competes with listening.
