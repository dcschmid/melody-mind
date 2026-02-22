# Analytics and Insights

This document describes the DSGVO-compliant analytics stack for Melody Mind Knowledge.

## Stack

- Primary analytics: Fathom Analytics (EU-hosted, consent-gated, DNT respected)
- Optional alternatives: Plausible (self-hosted) or Simple Analytics
- Heatmap strategy: aggregated click-zone events (no session replay, no personal profiling)
- A/B tests: client-side deterministic variant assignment with localStorage

## Consent and privacy model

- Analytics only activates after explicit opt-in through `cookie_consent.analytics === true`
- Runtime gate uses `window.__mmAnalyticsAllowed === true`
- Do Not Track disables analytics even with prior opt-in
- No raw search query text is transmitted; only bucketed, aggregated signals
- No fingerprinting, no user ID, no session replay

## Priority Top-10 event set

The following ten events are prioritized for product decisions and are implemented in the
current client analytics layer. Fathom receives bucketed event names (no personal data,
no free text payloads).

| #   | Product question                            | Event name(s)                                           | Bucketed dimensions                   |
| --- | ------------------------------------------- | ------------------------------------------------------- | ------------------------------------- |
| 1   | Which article contexts perform best?        | `Article: view <category>`                              | category                              |
| 2   | Are readers meaningfully consuming content? | `Read depth: 50%`                                       | article page scope                    |
| 3   | Which pages reach completion?               | `Read depth: 100%`                                      | article page scope                    |
| 4   | Which TOC areas get used?                   | `TOC: click top`, `TOC: click mid`, `TOC: click bottom` | section position bucket               |
| 5   | Which article CTAs drive podcast traffic?   | `Podcast: click episode`, `Podcast: click series`       | CTA target                            |
| 6   | What content is worth saving?               | `Bookmark: saved`                                       | event count by page                   |
| 7   | Does search ranking work?                   | `Search: result click <surface> <position>`             | surface, position bucket              |
| 8   | Where does search fail?                     | `Search: zero results`                                  | query-length/token buckets (internal) |
| 9   | What gets shared and when?                  | `Share: action <channel> <<50\|50-99\|100>`             | channel, read-depth bucket            |

## Additional implemented event groups

- Core engagement:
  - `Bounce: quick leave`
  - `Engaged time: 30s`
  - `Engaged time: 90s`
- User journey:
  - `Journey: <from-kind> to <to-kind>`
  - Kinds: `home`, `knowledge`, `category`, `bookmarks`, `legal`, `other`
- Search support signals:
  - `Search: used`
  - `Search: short query`, `Search: medium query`, `Search: long query`
- Consent/settings interactions:
  - `Cookie settings: open`
  - `Reading settings: open`
  - `Consent: accept analytics`
- Heatmap-like click zones:
  - `Heatmap click: header|main|article|share|search|reading-controls|footer|other`

## Analytics dashboard setup

In Fathom, create dashboard cards for:

- Page views and top pages (popular articles)
- Article quality proxy (`Article: view *` vs. `Read depth: 100%`)
- Bounce proxy (`Bounce: quick leave`)
- Engaged visits (`Engaged time: 30s` and `Engaged time: 90s`)
- TOC behavior (`TOC: click *`)
- Podcast CTA performance (`Podcast: click *`)
- Search friction (`Search: zero results`)
- Search ranking quality (`Search: result click *`)
- Save/share signals (`Bookmark: saved`, `Share: action *`)
- Navigation patterns (`Journey: *`)

## Optional custom event API

The global API is available on `window.mmAnalytics`:

- `trackEvent(eventName)`
- `trackGoal(goalId, valueInCents)`
- `assignVariant(experimentId, variants)`
- `isEnabled()`

Example:

```ts
window.mmAnalytics?.trackEvent("CTA: newsletter click");
```

## A/B testing framework

Use declarative data attributes:

```html
<section
  data-ab-experiment="home-hero-copy"
  data-ab-variants="control:1,variant:1"
  data-ab-class-prefix="ab-home-hero"
>
  ...
</section>
```

Runtime behavior:

- Variant is assigned once and persisted in `localStorage` (`mm_ab_variants`)
- Assigned variant is reflected via:
  - `data-ab-variant="control|variant|..."`
  - CSS class `${data-ab-class-prefix}-${variant}`
- Exposure event is sent as `AB exposed: <experimentId>:<variant>`

## Notes for compliance reviews

- Verify cookie banner blocks analytics before opt-in
- Verify DNT keeps tracking disabled
- Verify no raw search terms are sent
- Keep Fathom region and DPA settings aligned with legal requirements
