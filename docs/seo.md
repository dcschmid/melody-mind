# SEO Architecture & Usage Guide

> Central reference for MelodyMind's extended SEO component, utilities, and integration patterns.

## Overview

The SEO system centralizes meta tags, structured data (JSON-LD), OpenGraph/Twitter tags, hreflang
alternates, canonical URLs, breadcrumbs, pagination links, and robots directives via a single
`<SEO />` component that is consumed inside `Layout.astro`.

Goals:

- Single source of truth for meta & structured data
- Strong i18n support (alternate language links)
- Extensible JSON-LD graph assembly
- Declarative breadcrumbs & pagination
- Safe defaults (no duplicate canonicals, no empty tags, robust fallbacks)

## Component Location

`src/components/SEO.astro`

## Layout Integration

`Layout.astro` forwards all SEO-related props to `<SEO />`. Page authors normally set SEO by passing
props to `<Layout />`.

```astro
<Layout
  title="MelodyMind – Music Quiz"
  description="Challenge your music knowledge across eras and genres."
  image="/melody-mind.png"
  Global
  fallback
  logo
  (preferred
  when
  no
  specific
  content
  image)
  imageWidth={1200}
  imageHeight={630}
  canonical={buildCanonicalUrl(Astro.site, Astro.url.pathname)}
  breadcrumbs={buildBreadcrumbs([{ name: "Home", url: buildCanonicalUrl(Astro.site, `/${lang}`) }])}
/>

```

## Props Reference

| Prop                        | Type                                                              | Purpose                                        | Notes                                            |
| --------------------------- | ----------------------------------------------------------------- | ---------------------------------------------- | ------------------------------------------------ |
| `title`                     | `string`                                                          | Page `<title>` and OG `og:title`               | Required                                         |
| `description`               | `string`                                                          | Meta description + OG/Twitter description      | Fallbacks should be concise (≤160 chars)         |
| `keywords`                  | `string`                                                          | (Legacy) Meta keywords                         | Optional, low SEO weight                         |
| `image`                     | `string`                                                          | OG/Twitter preview image URL                   | Absolute or relative (will not be auto-absolute) |
| `imageWidth`                | `number`                                                          | OG image width meta                            | Default omitted if not provided                  |
| `imageHeight`               | `number`                                                          | OG image height meta                           | Default omitted if not provided                  |
| `type`                      | `'website' \| 'article' \| 'music' \| 'game' \| 'podcastEpisode'` | Influences structured data schema              | Default `website`                                |
| `publishDate`               | `Date`                                                            | Schema.org `datePublished` (where relevant)    | Valid JS `Date` only                             |
| `modifiedDate`              | `Date`                                                            | Schema.org `dateModified`                      | Provide when content updated                     |
| `ogMusic`                   | `{ creator?: string; album?: string; musician?: string }`         | Adds music-specific OG tags                    | Only if relevant                                 |
| `audioSrc`                  | `string`                                                          | Podcast episode audio URL                      | When `type="podcastEpisode"`                     |
| `episodeNumber`             | `number`                                                          | Podcast structured data numbering              | 1-based                                          |
| `seriesName`                | `string`                                                          | Podcast series name                            | With `type="podcastEpisode"`                     |
| `seriesUrl`                 | `string`                                                          | Podcast series canonical page                  | Optional but recommended                         |
| `canonical`                 | `string`                                                          | Explicit canonical URL override                | If omitted, derived from `Astro.url`             |
| `breadcrumbs`               | `Array<{ name: string; url: string }>`                            | Adds `BreadcrumbList` JSON-LD & structured nav | Order matters (1 = root)                         |
| `noIndex`                   | `boolean`                                                         | Adds `noindex` to robots meta                  | Use for 404 / thin pages                         |
| `noFollow`                  | `boolean`                                                         | Adds `nofollow` to robots meta                 | Combine with `noIndex` when needed               |
| `prevUrl`                   | `string`                                                          | Adds `<link rel="prev">`                       | Only set if previous page exists                 |
| `nextUrl`                   | `string`                                                          | Adds `<link rel="next">`                       | Only set if next page exists                     |
| `disableAlternateLanguages` | `boolean`                                                         | Suppress hreflang generation                   | Use on noindex pages                             |
| `structuredDataExtra`       | `any` / `any[]`                                                   | Custom JSON-LD objects appended to graph       | Valid Schema.org only                            |
| `authorName`                | `string`                                                          | Override default organization/author name      | For article attribution                          |

## Structured Data Graph

The SEO component composes an internal graph array:

1. Base WebSite / WebPage object
2. Optional page-type object (`Article`, `PodcastEpisode`, `MusicRecording`, etc.)
3. Optional `BreadcrumbList`
4. Items from `structuredDataExtra`

All merged into one `<script type="application/ld+json">` with an `@graph` for cleanliness and
extensibility.

## Utilities (`src/utils/seo.ts`)

| Function                                                                    | Purpose                              |
| --------------------------------------------------------------------------- | ------------------------------------ |
| `createSlug(text)`                                                          | Generate URL slug                    |
| `extractKeywords(content, max, lang)`                                       | Generate keyword string              |
| `generateMetaDescription(content, maxLength)`                               | Smart trimmed description            |
| `buildCanonicalUrl(siteBase, path)`                                         | Normalize + sanitize canonical       |
| `buildOpenGraphImageUrl(siteBase, imagePath)`                               | Ensure absolute OG image URL         |
| `buildBreadcrumbs(items)`                                                   | Sanitize & dedupe breadcrumb entries |
| `buildPaginationRelUrls(siteBase, lang, basePath, currentPage, totalPages)` | Derive `prevUrl` / `nextUrl`         |

## Breadcrumbs Guidelines

- Always start with localized Home if user-facing path: `{ name: t('nav.home'), url: '/en' }`.
- Do not include the current page in the middle (only once, at the end).
- Limit to <= 6 levels for clarity.
- Use human-readable names (translated where applicable).

## Pagination Guidelines

For listing pages with server-side or build-time pagination:

1. Determine total pages.
2. Provide `prevUrl` and/or `nextUrl` only when those pages exist.
3. Keep canonical pointing to the current page (avoid canonicalizing all to page 1 unless duplicate
   content scenario).

## Robots Meta

- `noIndex` only where intentional (search landing, 404, ephemeral game session if not valuable).
- Combine `noIndex` + `noFollow` for pages you neither want indexed nor to leak link equity.

## Hreflang Control

Generated automatically for all supported languages unless `disableAlternateLanguages` is true or
`noIndex` is set. Disable on pages not meant to be indexed or that should not appear in language
alternates.

## Example: Article Detail Page

```astro
---
import Layout from "@layouts/Layout.astro";
import { buildCanonicalUrl, buildBreadcrumbs } from "@utils/seo";
const lang = "en";
const site = Astro.site;
const canonical = buildCanonicalUrl(String(site), Astro.url.pathname);
const breadcrumbs = buildBreadcrumbs([
  { name: "Home", url: buildCanonicalUrl(String(site), `/${lang}`) },
  { name: "Knowledge", url: buildCanonicalUrl(String(site), `/${lang}/knowledge`) },
  { name: "History of Jazz", url: canonical },
]);
---

<Layout
  title="History of Jazz"
  description="Explore the evolution of jazz from its roots to modern fusion."
  type="article"
  publishDate={new Date("2025-09-01")}
  modifiedDate={new Date("2025-09-10")}
  canonical={canonical}
  breadcrumbs={breadcrumbs}
  image="/melody-mind.png"
  Or
  use
  a
  specific
  article
  cover
  image
  if
  one
  exists
  imageWidth={1200}
  imageHeight={630}
/>
```

## Example: Paginated Listing

```ts
import { buildPaginationRelUrls } from "@utils/seo";
const { prevUrl, nextUrl } = buildPaginationRelUrls(
  String(Astro.site),
  lang,
  "knowledge",
  currentPage,
  totalPages
);
```

Then spread into `<Layout {...{ prevUrl, nextUrl }} />`.

## Example: Podcast Episode (already implemented)

Podcast episode pages use `type="podcastEpisode"` and may provide `audioSrc`, `episodeNumber`,
`seriesName`, and `seriesUrl`. If the underlying `PodcastData` includes `imageWidth` /
`imageHeight`, those values are passed through for precise OG/Twitter meta; otherwise the system
falls back to 1200×630.

## Overview Pages OG Image Policy

The main overview / hub pages use dedicated static category images located under
`/public/homecategories/` for consistent branding and predictable social previews:

| Page                              | File                            | Reason                                          |
| --------------------------------- | ------------------------------- | ----------------------------------------------- |
| Game Overview (`/gamehome`)       | `/homecategories/game.png`      | Communicates interactive quiz focus             |
| Knowledge Index (`/knowledge`)    | `/homecategories/knowledge.png` | Signals educational / article content           |
| Playlists Overview (`/playlists`) | `/homecategories/playlist.png`  | Represents curated music collections            |
| Podcast Episodes (`/podcasts`)    | `/homecategories/podcast.png`   | Universal audio / microphone visual             |
| News Aggregation (`/news`)        | `/homecategories/news.png`      | Stable instead of volatile first‑item thumbnail |

Rationale:

1. Eliminates variability (e.g. News previously depended on the first fetched item image).
2. Ensures consistent aspect ratio (designed for 1200×630 usage across platforms).
3. Prevents missing / broken OG previews when dynamic sources fail.
4. Aligns with simplified OG strategy (no auto-generated images, no `/og-images/` folder usage).

Implementation Notes:

- Each overview page now sets `image` prop directly to its static asset.
- Optional: add `imageWidth={1200}` and `imageHeight={630}` if not already specified for explicit
  meta dimensions (some pages already include them).
- If a future redesign changes the visual system, update both the file assets and this table to
  remain accurate.
- Do NOT reintroduce external or remote image dependencies for these hubs without assessing caching
  and reliability.

Extending:

- For a new overview section (e.g. Achievements, Leaderboard), add a corresponding PNG under
  `public/homecategories/` and follow the same naming and prop pattern.
- Keep filenames lowercase, kebab or simple word — avoid spaces for stable URLs.

SEO Impact:

- Consistent OG visuals improve recognition and click trust.
- Static assets reduce crawl variance and simplify structured data validation.

Accessibility:

- Ensure any visible usage (e.g. in-page hero) has appropriate `alt` text; OG usage itself does not
  require additional ARIA.

Change Date: 2025-10-01 – replaces prior dynamic / content-derived preview logic for News and
generic logo fallbacks for hub pages.

## When to Use `structuredDataExtra`

- Adding `FAQPage`, `ItemList`, `HowTo`, or domain-specific extensions
- Inject additional nodes without modifying SEO core component

```astro
<Layout
  title="Rock Legends"
  structuredDataExtra={{
    "@type": "ItemList",
    itemListElement: [
      { "@type": "ListItem", position: 1, url: "https://example.com/rock/acdc", name: "AC/DC" },
      { "@type": "ListItem", position: 2, url: "https://example.com/rock/queen", name: "Queen" },
    ],
  }}
/>
```

## Migration Checklist

- Remove manual `<script type="application/ld+json">` blocks duplicated by SEO.
- Replace inline canonical tags with `canonical` prop.
- Move breadcrumb JSON-LD to `breadcrumbs` prop.

## Future Enhancements (Backlog)

- Automatic OG image generation hook
- Dynamic detection of pagination from route params
- Structured data validation script (build-time)
- Automatic `Article` schema extraction from content frontmatter

## Troubleshooting

| Symptom             | Cause                                             | Fix                                             |
| ------------------- | ------------------------------------------------- | ----------------------------------------------- |
| Duplicate canonical | Page added manual `<link rel='canonical'>`        | Remove manual tag, rely on prop                 |
| Missing hreflang    | `disableAlternateLanguages` set or `noIndex` true | Adjust props                                    |
| Incorrect prev/next | Provided URLs not normalized                      | Use `buildCanonicalUrl` and confirm page bounds |

## Accessibility Notes

Meta changes trigger no visual changes; ensure breadcrumb UI (if present) mirrors logical order used
in structured data.

---

Last updated: 2025-09-30
