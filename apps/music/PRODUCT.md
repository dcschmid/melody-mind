# Product

## Register

product

## Users

MelodyMind Music serves listeners who want to discover and play complete concept
albums across genres. They may arrive for a specific record, browse by genre or
series, or resume a listening session on desktop or mobile.

## Product Purpose

The app is a curated, English-language archive of AI-assisted concept albums. Its
primary job is to help listeners move quickly between discovery and uninterrupted
album playback while preserving the stories, lyrics, artwork, and editorial context
that make each record distinct.

## Brand Personality

Focused, atmospheric, and approachable. The interface is a **Cover-Lit Listening
Room**: confident enough to foreground the music, calm enough to stay out
of the way, and familiar enough that playback never needs explanation. Cover
artwork — increasingly detailed, color-rich illustration — carries the visual
identity; the room around it stays quiet, deep blue, and permanently legible.

## Anti-references

- A generic streaming-service clone with interchangeable cards and no editorial voice.
- Neon cyberpunk dashboards, decorative glass panels, or saturated gradients everywhere.
- Oversized marketing copy that delays access to music.
- Hidden or unfamiliar playback controls and motion that competes with listening.

## Design Principles

- Put playable music before explanation.
- Let album artwork provide identity while controls remain consistent.
- Preserve listening context across navigation and device sizes.
- Use progressive disclosure for editorial depth, not for essential controls.
- Prefer predictable interaction patterns and clear state over decorative novelty.

## Accessibility & Inclusion

WCAG 2.2 Level AAA is the required target for every applicable success
criterion on the public Music routes. Contrast gates are enforced in CI
(`node apps/music/scripts/check-contrast.mjs`): 7:1 for normal text, 4.5:1 for
large text, 3:1 for non-text UI and focus indicators. No public claim of
conformity is published until the scripted and manual verification passes.
The app supports keyboard navigation, visible focus, reduced motion, forced
colors, high contrast, screen-reader names, 44px touch targets, and no
autoplay. Dark mode is the only visual theme.
