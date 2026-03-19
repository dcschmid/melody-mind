# Accessibility Audit Checklist

Use this checklist for manual verification after UI changes across `knowledge`, `quiz`, and `podcasts`.

## Core checks

- Verify full keyboard access with `Tab`, `Shift+Tab`, `Enter`, `Space`, and arrow keys where applicable.
- Confirm every interactive control has a visible `:focus-visible` state in light and dark mode.
- Check zoom at `200%` and `400%` without clipped text, blocked actions, or hidden context.
- Check reduced motion mode and forced-colors mode for core flows.
- Confirm screen-reader status updates are short, atomic, and only announced when content changes.

## Knowledge

- Homepage: search, recent reads, taxonomy cards, and empty states.
- Category pages: filter input, reset action, result count/empty state, card navigation.
- Article pages: share actions, related articles, table of contents, audio/player blocks.
- Taxonomy pages: jump navigation toggle, anchored sections, group cards, empty states.

## Quiz

- Quiz overview cards and category sections.
- Quiz flow: option selection, answer submit, explanation announcement, next/previous navigation.
- Results state: score ring, retry action, back-to-overview action.
- Confirm no state change depends on color alone.

## Podcasts

- Homepage hero CTAs, search, episode cards, and load-more status updates.
- Episode pages: breadcrumb, related article link, audio player, transcript toggle, previous/next navigation.
- Transcript flow: loading, error, active cue, keyboard navigation.

## WCAG AAA spot checks

- Measure contrast for body text, muted text, badges, buttons, and focus indicators in both themes.
- Recheck hover, focus, active, disabled, and empty states separately.
- Verify icon-only meaning is always backed by text or accessible labelling.
