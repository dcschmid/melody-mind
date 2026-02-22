# Fathom Dashboard Template

Use this template to create a practical dashboard for the Top-10 event set.

## Dashboard layout

Create one dashboard with four sections in this order:

1. Executive snapshot
2. Content performance
3. Search and navigation quality
4. Conversion signals (save/share/podcast)

## v1 Minimal dashboard (8 cards)

Use this compact setup first if you want fast adoption and low maintenance.

1. `Pageviews`
2. `Article: view *`
3. `Read depth: 100%`
4. `Search: zero results`
5. `Search: result click * 1-3`
6. `Bookmark: saved`
7. `Share: action *`
8. `Podcast: click *`

Recommended defaults:

- Time window: last 30 days
- Comparison: previous 30 days

Weekly manual KPI checks from this minimal set:

- Completion proxy = `Read depth: 100%` / `Article: view *`
- Save intent proxy = `Bookmark: saved` / `Article: view *`
- Share propensity proxy = `Share: action *` / `Article: view *`

Optional card #9 for better search diagnostics:

- `Search: used` (enables failure-rate proxy: `zero results / used`)

## Global filters and defaults

- Site: Melody Mind Knowledge
- Time window default: last 30 days
- Comparison default: previous 30 days
- Secondary quick views: last 7 days vs previous 7 days, last 90 days vs previous 90 days

## 1) Executive snapshot (top row)

- Total pageviews
- Unique visitors
- Bounce proxy count: `Bounce: quick leave`
- Engaged count: `Engaged time: 30s`
- Deep engaged count: `Engaged time: 90s`

Interpretation:

- If pageviews rise but engaged events do not, quality/intent likely dropped.
- If bounce rises with stable traffic sources, investigate landing experience.

## 2) Content performance

- Event trend: `Article: view *`
- Event trend: `Read depth: 50%`
- Event trend: `Read depth: 100%`
- Event trend: `TOC: click *`

Derived KPI checks (manual):

- Read-through proxy = `Read depth: 50%` / `Article: view *`
- Completion proxy = `Read depth: 100%` / `Article: view *`

Recommended slice:

- Compare last 30 days by article category using `Article: view <category> ...` patterns.

## 3) Search and navigation quality

- Event trend: `Search: used`
- Event trend: `Search: zero results`
- Event trend: `Search: result click home-categories *`
- Event trend: `Search: result click category-articles *`
- Event trend: `Journey: *`

Derived KPI checks (manual):

- Search failure rate proxy = `Search: zero results` / `Search: used`
- Search ranking quality proxy = `Search: result click * 1-3` / all `Search: result click *`

Interpretation:

- High zero-results with low result-clicks suggests taxonomy/keyword gaps.
- Shift from `1-3` to `7+` clicks suggests ranking relevance issues.

## 4) Conversion signals

- Event trend: `Bookmark: saved`
- Event trend: `Share: action *`
- Event trend: `Podcast: click episode`
- Event trend: `Podcast: click series`

Derived KPI checks (manual):

- Save intent proxy = `Bookmark: saved` / `Article: view *`
- Share propensity proxy = `Share: action *` / `Article: view *`
- Podcast handoff proxy = `Podcast: click *` / `Article: view *`

Interpretation:

- High read depth but low bookmark/share means content is consumed but not retained/shared.
- Rising podcast click-through on specific categories indicates strong cross-channel fit.

## Weekly review cadence (30 minutes)

1. Check snapshot deltas (30d vs previous 30d)
2. Check completion proxy trend (`Read depth: 100%` vs views)
3. Check search failure proxy (`zero results` vs `used`)
4. Check conversion proxies (bookmark/share/podcast)
5. Pick one action item and one hypothesis for next week

## Monthly decision cadence

- Keep: categories with strong view + completion + save signals
- Improve: categories with high views but low completion
- Expand: categories with strong podcast/share handoff
- Fix search: topics with recurring zero-results signals

## Naming and hygiene checklist

- Keep event names stable; avoid renaming unless required
- Prefer bucketed values over free-text values
- Never include user identifiers or raw query strings
- Verify consent and DNT behavior after analytics changes
