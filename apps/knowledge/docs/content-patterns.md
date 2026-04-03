# Knowledge Content Patterns

This note keeps the current MDX authoring patterns consistent across Knowledge articles.

## Section Flow

- Prefer `SubsectionFigure` for major article sections instead of a plain heading plus loose image.
- Use `textWrap={true}` by default on desktop unless the section contains unusually complex nested content.
- Alternate `variant="inline-left"` and `variant="inline-right"` to keep a steady reading rhythm.
- Keep images at `3 / 2` and avoid mixing visual ratios within the same article.

## Editorial Cards

- Treat `QuoteCard` as an argument-shaping pull quote, not as decoration.
- Treat `DidYouKnowCard` as a factual context card, not as a second summary of the same paragraph.
- Default to no more than one editorial card inside a subsection unless the section is long enough to support two clearly different beats.
- Do not place `QuoteCard` and `DidYouKnowCard` directly back to back without at least one substantial paragraph between them.
- Do not place two `DidYouKnowCard`s back to back in the same subsection unless the section is unusually long and the facts serve different purposes.
- If a subsection already has a strong `QuoteCard`, prefer moving the factual card to a later paragraph or cutting the weaker card.

## Placement Rules

- Place `DidYouKnowCard` immediately after the paragraph whose fact it validates.
- Place `QuoteCard` after a paragraph that sets up the quoted idea, not before the reader has the context.
- Keep cards inside the related `SubsectionFigure` when they support that section directly.
- If a card starts feeling like a transition between two sections, move it to the next section or remove it.

## Density

- Long articles can carry more cards, but spacing matters more than total count.
- Prefer one strong card every few subsections over frequent short interruptions.
- When an article begins to feel fragmented, cut the weaker `DidYouKnowCard` first.

## Writing

- `QuoteCard` should use real, verifiable quotations only.
- `DidYouKnowCard` should contain one concrete, sourced fact and one short sentence explaining why it matters.
- Keep card titles short and declarative.
