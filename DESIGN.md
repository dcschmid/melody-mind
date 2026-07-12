---
name: MelodyMind
description: Music-first editorial surfaces on a single dark theme with a teal accent, wide tonal elevation, and WCAG AAA typography.
colors:
  bg-primary: "oklch(11.5% 0.03 250deg)"
  bg-secondary: "oklch(17% 0.032 250deg)"
  surface-1: "oklch(17% 0.032 250deg)"
  surface-2: "oklch(22.5% 0.035 250deg)"
  surface-3: "oklch(28.5% 0.038 250deg)"
  text-primary: "oklch(96.5% 0.01 85deg)"
  text-secondary: "oklch(85% 0.022 245deg)"
  text-tertiary: "oklch(79% 0.026 248deg)"
  accent-primary: "oklch(80% 0.115 180deg)"
  accent-strong: "oklch(84% 0.1 180deg)"
  accent-muted: "oklch(72% 0.09 180deg)"
  accent-primary-hover: "oklch(85% 0.1 180deg)"
  link-default: "oklch(84% 0.1 180deg)"
  link-hover: "oklch(89% 0.08 180deg)"
  link-visited: "oklch(84% 0.07 210deg)"
  border-default: "oklch(40% 0.035 250deg)"
  border-muted: "oklch(32% 0.03 250deg / 0.7)"
  border-strong: "oklch(60% 0.04 250deg)"
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
    fontWeight: 700
    lineHeight: 1.375
    letterSpacing: "0.05em"
rounded:
  sm: "0.25rem"
  base: "0.5rem"
  md: "0.75rem"
  lg: "1rem"
  xl: "1.5rem"
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
    backgroundColor: "{colors.accent-primary}"
    textColor: "{colors.bg-primary}"
    rounded: "{rounded.full}"
    padding: "0.5rem 1.5rem"
  panel-surface:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: "1.5rem"
  chip-neutral:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.full}"
    padding: "0.25rem 0.75rem"
---

# Design System: MelodyMind

## 1. Overview

**Creative North Star: "The Listening Room"**

MelodyMind is a trusted independent music publication with a well-kept
listening room attached. The interface is editorial first: readable, specific,
and confident without becoming academic or showy. The Music app
(`apps/music`) is the product and visual source of truth; the tokens live in
`apps/music/src/styles/master-theme.css`.

The system is **dark-only**: one deep blue canvas family (hue 250deg) with
wide tonal elevation steps and a single teal accent (hue 180deg). There is no
light mode and no theme toggle. It rejects generic AI gradients,
glassmorphism, gradient text, bounce motion, side-stripe card accents, neon
glows, and endless identical card grids.

**Key Characteristics:**

- One hue family for every background and border; one teal accent hue for
  every action, link, and state. No stray warm or violet tints.
- Elevation is tonal first: 11.5% → 17% → 22.5% → 28.5% OKLCH lightness.
  Shadows are neutral black and stay quiet.
- Typography carries hierarchy before boxes and decoration. Only two real
  font faces exist (400 and 700); `font-synthesis: none` forbids fakes.
- Every text/background token pair meets WCAG AAA (7:1) — enforced by
  `apps/music/scripts/check-contrast.mjs`, which must pass before merging
  any token change.
- Motion is short, stateful, and editorial, and fully respects
  `prefers-reduced-motion`.

## 2. Colors

All colors are OKLCH tokens in `master-theme.css`. Components must reference
tokens (or page-local aliases that resolve to tokens), never literals — the
`prefers-contrast: more` and `forced-colors: active` overrides only reach
token consumers.

### Canvas & Surfaces (hue 250deg)

- **bg-primary** (`oklch(11.5% 0.03 250deg)`): The page canvas. Also the
  hardcoded `theme-color`/manifest hex `#00050f`.
- **surface-1** (`oklch(17% 0.032 250deg)`): Panels, sections, chips.
- **surface-2** (`oklch(22.5% 0.035 250deg)`): Raised cards, pills, kbd keys.
- **surface-3** (`oklch(28.5% 0.038 250deg)`): The strongest step; active
  rows and prominent controls.

### Text (AAA on all surfaces above)

- **text-primary** (`oklch(96.5% 0.01 85deg)`): Deliberately warm white for
  headings and body text. The only warm value in the system.
- **text-secondary** (`oklch(85% 0.022 245deg)`): Supporting copy, metadata.
- **text-tertiary** (`oklch(79% 0.026 248deg)`): Hints and low-priority text.
  ≥7.4:1 even on surface-3.

### Accent (hue 180deg, teal)

- **accent-primary** (`oklch(80% 0.115 180deg)`): Primary actions, active
  states, eyebrows, media controls.
- **accent-strong / accent-primary-hover**: Brighter steps for hover and
  emphasis. **accent-muted** is for decorative/large use only.
- Links use the same hue (`--link-default/hover`); visited shifts slightly
  toward 210deg.

### Named Rules

**The One-Accent Rule.** Teal is the only accent hue. Shadows are neutral
black (`oklch(0% 0 0deg / α)` or the `--shadow-*` tokens). Ambient glows are
accent-tinted at ≤9% alpha and must never read as neon.

**The Token Alias Rule.** Page scopes (`--music-home-*`, `--music-album-*`,
`--genre-landing-*`, `--series-landing-*`) exist for local vocabulary but must
be defined as `var(--…)` references onto the global tokens, never as frozen
literals.

**The AAA Gate Rule.** Any change to color tokens requires
`node apps/music/scripts/check-contrast.mjs` to pass (132 pairs, 7:1 text /
3:1 non-text). OKLCH lightness is not WCAG luminance — always run the gate.

## 3. Typography

**Face:** Atkinson Hyperlegible only, self-hosted woff2, two real weights:
Regular 400 and Bold 700 (both preloaded and precached by the service
worker). Weight tokens: `--font-weight-regular/medium/semibold/bold` — the
600/650-style intermediate requests resolve to the 700 face; `font-synthesis:
none` on `body` guarantees no faux bold or italic.

**Character:** Accessibility-first and editorial. Atkinson's letterforms are
deliberately distinct, so tracking stays near normal —
`--letter-spacing-tight` is -0.015em and must not go tighter. Uppercase
eyebrows/labels use `--letter-spacing-wider` (0.05em).

### Hierarchy

- **Display** (700, `--font-size-4xl`, 1.25): Major page and hero titles.
  Component-level hero clamps cap near 5–5.25rem.
- **Headline** (700, `--font-size-3xl`, 1.25): Section-level headings.
- **Title** (700, `--font-size-xl`, 1.375): Component and card titles.
- **Body** (400, `--font-size-base` = 18–20px, 1.625): Main reading text.
  Keep prose measures near 65–75 characters.
- **Label** (700, `--font-size-xs`, 0.05em): Metadata, pills, eyebrows.

### Named Rules

**The Typography-First Rule.** Use size, weight, spacing, and measure before
adding boxes. Containers should clarify relationships, not replace hierarchy.

**The Real-Weight Rule.** Never introduce a `font-weight` literal; use the
weight tokens. If a third weight is ever needed, ship the actual face.

## 4. Elevation

Elevation is tonal layering first (the surface ramp), then borders, then
neutral shadows. Surfaces read as lit layers of the same room, not floating
chrome.

### Shadow Vocabulary

- **Subtle** (`--shadow-sm`): Small interactive lifts and quiet affordances.
- **Base** (`--shadow-base`): Default card depth where a border is not enough.
- **Large** (`--shadow-lg`): Media players, overlays, dense-content
  separation.
- **Extra Large** (`--shadow-xl` / `--shadow-2xl`): Rare overlays only.

### Named Rules

**The Tonal Layer Rule.** Prefer the surface ramp and borders before shadows.
All shadows are neutral black — no colored shadow tints. Accent glow is
reserved for hero covers at low alpha (≤22% mix on borders, ≤9% ambient).

## 5. Components

### Buttons

- **Shape:** Pills (`--radius-full`) for actions; icon controls stay circular.
- **Primary:** `--accent-primary` background with `--bg-primary` text
  (≥11:1), weight bold.
- **Ghost:** Translucent `--surface-2` fill with `--border-default` border.
- **Targets:** Minimum `--control-min-block-size` (2.75rem).

### Chips & Pills

- **Style:** `--surface-1`/`--surface-2` fill, `--surface-border-soft`
  border, label-weight text, `--radius-full`.
- **State:** Selected chips may use a low-percentage accent tint. Avoid
  saturated inactive chips.

### Cards / Containers

- **Background:** `--surface-panel-bg` (= surface-1) for flat panels,
  `--surface-panel-raised` (= surface-2) for raised cards.
- **Border:** `--surface-border-soft` or `--border-muted`; hover may step up
  to `--border-default` or accent. Never side-stripe accents.
- **Text:** Descriptions and meta are plain `--text-secondary` — no accent
  tinting of body copy.

### Navigation & App Chrome

- `navigation/SiteHeader.astro`: responsive header with mobile dialog drawer
  (focus trap, `inert` background, Escape, scroll lock).
- `navigation/HeaderNav.astro`, `navigation/HeaderMobileExtras.astro`,
  `layout/Footer.astro`, `navigation/BackToTop.astro`,
  `navigation/SkipLink.astro`.
- Do not recreate chrome in parallel folders; configure via props.

### Media Player

- `music/album/PlaylistPlayer.astro`: panel shell on the surface ramp,
  accent-tinted current/playing rows (8–20% mix), visible focus, text
  alternatives for lyrics/transcripts.

## 6. Do's and Don'ts

### Do

- Reference the CSS custom properties for every color, radius, weight, and
  spacing value.
- Run `node apps/music/scripts/check-contrast.mjs` after any token change.
- Keep the dark canvas atmospheric but readable; AAA is the floor, not the
  target.
- Use the teal accent to communicate action, selection, and meaningful state.
- Respect `prefers-reduced-motion` for every animation.
- Keep copy plain, specific, and useful.

### Don't

- Do not use gradient text, glassmorphism, or decorative blur panels.
- Do not use bounce or elastic motion.
- Do not introduce a second accent hue or colored shadows.
- Do not write `font-weight` or color literals in components.
- Do not add colored side-stripe borders to cards, lists, or alerts.
- Do not build identical icon-card grids as the default answer.
- Do not duplicate app chrome.
- Do not leave media tracks without a real source or an accessible
  lyrics/transcript fallback.
