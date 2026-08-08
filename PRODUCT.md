# Impeccable Design Context

## Design Context

### Users

Casual music fans exploring genre roots, cultural stories, and the artists behind the music. They browse during leisure time (coffee breaks, commutes) and want engaging, well-crafted content that respects their intelligence without being overly academic. The interface should feel like a trusted music publication, not a textbook or database.

### Brand Personality

Warm and accessible — inviting exploration without dumbing things down. Editorial in quality: thoughtful curation, clear writing, confident presentation. The tone is that of a respected independent music magazine: knowledgeable but not pretentious.

### Aesthetic Direction

Inspired by editorial music publications and the current MelodyMind Music app: an immersive deep-blue night palette with a single teal accent, confident typography, generous whitespace, and restrained decoration. Content-first layouts with clear hierarchy. The site should feel like a beautifully typeset magazine with a listening room attached, not a dashboard or admin panel.

**Theme**: The dark music-room experience is the only theme, permanently: deep blue canvas with a single teal accent (Music layouts set `data-theme="dark"`). There is no light mode, no theme switching, and neither is planned. Do not design or implement light-theme variants.

**Anti-references**: Generic AI gradient aesthetics, neon glow as decoration, cyan-on-black sci-fi UI, generic card grids with identical structure, side-stripe borders on cards, gradient text, glassmorphism, bounce animations.

### Design Principles

1. **Editorial warmth** — Every layout decision should feel like a considered editorial choice: varied spacing, asymmetric compositions, content that breathes. Avoid templated grid sameness.

2. **Typography-led hierarchy** — Use font size and weight contrast as the primary way to establish hierarchy, not boxes or backgrounds. Atkinson Hyperlegible is the only product face (400 and 700); hierarchy comes from scale, weight, and spacing, not from additional display fonts.

3. **Purposeful color** — Use the Music app palette as the shared product language: deep blue canvas surfaces with a single teal accent. Use color meaningfully for action, selection, navigation, and media state. Avoid decorative gradients or glowing effects.

4. **Motion with intent** — Subtle, editorial-grade motion: slow fades, gentle reveals on scroll. No bounce, no elastic easing, no motion for its own sake.

5. **Content-first layout** — Let the content lead. Cards and containers should serve the content, not box everything uniformly. Vary layouts, break grids intentionally, embrace asymmetry.

6. **Consistent product chrome** — The Music app should keep header, mobile drawer, and footer behavior in the established component names (`SiteHeader` plus `HeaderNav`, `HeaderMobileExtras`, and `SkipLink` subcomponents, and `Footer`). Page-specific surfaces can vary, but the product frame should feel unified.
