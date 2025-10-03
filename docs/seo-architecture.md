# SEO Architecture (2025-10)

This document describes the unified SEO metadata system for MelodyMind.

## Goals

- Eliminate repetitive per‑page title/description/keywords/canonical assembly
- Provide consistent Open Graph + Twitter + robots handling
- Centralize structured data (JSON-LD) augmentation (BreadcrumbList, collections)
- Offer safe text sanitization + enrichment for keyword coverage
- Allow optional social image generation hook (sync)

## Core Building Blocks

| Layer                       | File                                | Responsibility                                                                                  |
| --------------------------- | ----------------------------------- | ----------------------------------------------------------------------------------------------- |
| Text synthesis              | `src/utils/seo/textUnified.ts`      | Build normalized description + keyword list from base + enriched parts (legacy helpers removed) |
| Page aggregation            | `src/utils/seo/buildPageSeo.ts`     | Compose full SEO object (title, canonical, robots, OG, Twitter, structured data)                |
| Layout rendering            | `src/layouts/Layout.astro`          | Render `<head>` meta tags & JSON-LD from `pageSeo`                                              |
| Collection schemas          | `src/utils/seo/collectionSchema.ts` | Generate generic ItemList / collection JSON-LD                                                  |
| Image extraction (news/rss) | `src/utils/rss/imageExtraction.ts`  | Source best display image for feed items                                                        |
| Sanitization                | `src/utils/seo/sanitize.ts`         | Strip HTML, collapse whitespace, clamp max length                                               |

## Data Flow

1. Page frontmatter prepares base strings: `title`, `description`, optional `enrichedParts`.
2. Page invokes `buildPageSeo({...})` with:

- `title`, `description`, `url`
- `language`, `contentKind` ("generic" | "news" | "playlist" | "podcast")
- Optional enrichment: `enrichedParts`, `fallbackKeywords`, `keywordLimit`, `maxDescription`
- Optional controls: `index`, `follow`, extended robots flags
- Optional structured data list + `breadcrumbs`

3. `buildPageSeo`:

- Normalizes title (ensures suffix " - MelodyMind")
- Builds description + keywords via `buildSeoText`
- Infers `type` (OpenGraph) & fallback social image by `contentKind`
- Optionally generates social image (if `autoSocialImage` true and no explicit `image`)
- Builds robots meta string + parsed `robotsDirectives`
- Merges / augments structured data (adds `BreadcrumbList` if provided and not already present)
- Memoizes result for identical inputs (in‑memory Map)

4. The page passes the resulting object to the layout:

```astro
<Layout pageSeo={pageSeo}>...</Layout>
```

5. `Layout.astro` reads `pageSeo` and emits:

- `<title>`
- `<meta name="description">`, `<meta name="keywords">`
- `<link rel="canonical">`
- Open Graph & Twitter tags
- `<meta name="robots">`
- JSON-LD scripts for each `structuredData` entry

## `buildPageSeo` Parameters (excerpt)

```ts
interface BuildPageSeoParams {
  title: string;
  description: string; // base description
  url: string; // canonical
  language?: string;
  contentKind?: "generic" | "news" | "playlist" | "podcast";
  enrichedParts?: string[]; // additional semantic fragments
  fallbackKeywords?: string[];
  keywordLimit?: number; // clamp keyword count
  maxDescription?: number; // clamp description length
  index?: boolean; // default true
  follow?: boolean; // default true
  // Extended robots
  noArchive?: boolean;
  noImageIndex?: boolean;
  maxSnippet?: number;
  maxImagePreview?: "none" | "standard" | "large";
  maxVideoPreview?: number;
  // Social image
  image?: string;
  autoSocialImage?: boolean;
  generateSocialImage?: (args: {
    title: string;
    contentKind: PageContentKind;
  }) => string | undefined;
  onSocialImageError?: (err: unknown, ctx: { title: string; contentKind: PageContentKind }) => void;
  // Structured data
  structuredData?: Record<string, unknown>[];
  breadcrumbs?: { name: string; url: string }[];
  publishDate?: string | Date;
  modifiedDate?: string | Date;
}
```

## Result (`PageSeoResult` key fields)

```ts
interface PageSeoResult {
  title: string;            // normalized title with brand suffix
  description: string;      // sanitized + possibly truncated
  keywords: string;         // comma-separated string
  keywordArray: string[];   // original array (from buildSeoText)
  canonical: string;
  image?: string;
  type: 'website' | 'article' | 'music' | 'game' | 'podcastEpisode';
  robots: string;           // e.g. "index,follow,max-image-preview:large"
  robotsDirectives: { index: boolean; follow: boolean; ... };
  openGraph: { title; description; type; url; image?; locale? };
  twitter: { card; title; description; image?; creator? };
  structuredData: Record<string, unknown>[];
  publishDate?: Date; modifiedDate?: Date;
  ogLocale?: string; alternateLocales?: string[];
}
```

## Robots Handling

- Base directives: `index`/`noindex`, `follow`/`nofollow`
- Extended: `noarchive`, `noimageindex`, `max-snippet:N`, `max-image-preview:{none|standard|large}`,
  `max-video-preview:N`
- Both raw string (`robots`) and parsed object (`robotsDirectives`) are exposed.

## Social Image Strategy

Priority: explicit `image` prop → generated (`generateSocialImage`) → inferred fallback per
`contentKind` → global logo handled by Layout fallback.

## Structured Data Augmentation

If `breadcrumbs` provided and no existing `BreadcrumbList` is in `structuredData`, one is appended
automatically.

## Sanitization

Sanitization ensures search-engine friendly, safe, and concise textual metadata.

Applied steps (in `sanitize.ts` and consumed by `textUnified`):

- stripTags: remove any HTML tags
- collapseWhitespace: convert repeated whitespace/newlines to a single space
- trim: remove leading/trailing space
- clamp length: optionally limit description length (`maxDescription`) without cutting mid‑grapheme

Keyword handling:

- Deduplicate (case-insensitive)
- Filter empties / ultra-short tokens
- Enforce `keywordLimit` (default sensible value inside helper)

Example:

```ts
import { buildPageSeo } from "@/utils/seo/buildPageSeo";

const pageSeo = buildPageSeo({
  title: "Top 10 Jazz Fusion Classics",
  description: "<b>Explore</b> legendary tracks that shaped modern jazz-fusion.",
  enrichedParts: ["jazz fusion history", "progressive jazz", "1970s electric jazz pioneers"],
  url: `${baseUrl}/en/playlists/jazz-fusion-classics`,
  contentKind: "playlist",
  keywordLimit: 12,
  maxDescription: 155,
  autoSocialImage: true,
});
```

Result:

```json
{
  "description": "Explore legendary tracks that shaped modern jazz-fusion.",
  "keywords": "jazz fusion history, progressive jazz, 1970s electric jazz pioneers, ..."
}
```

## Migration Guidelines

1. Remove legacy props (`title`, `description`, `keywords`, `image`, `type`, `canonical`, `noIndex`,
   `noFollow`).
2. Import and call `buildPageSeo` in frontmatter.
3. Provide enrichment via `enrichedParts` + optional curated `fallbackKeywords` (raw arrays only).
4. Pass `pageSeo` to `<Layout />`.
5. Move any custom `<meta>` extras into a `<Fragment slot="head">`.
6. Do NOT import removed files (`seoText.ts`, `metaUtils.ts`, `seoBasics.ts`). Their functionality
   is internalized in `textUnified.ts` & `buildPageSeo.ts`.

### Removed Legacy Utilities (2025-10-03)

The following deprecated modules have been fully removed after migration completion:

| Removed File   | Replacement                          | Notes                                                                                         |
| -------------- | ------------------------------------ | --------------------------------------------------------------------------------------------- |
| `seoText.ts`   | Internal logic in `textUnified.ts`   | `generateMetaDescription`, `extractKeywordsFallback`, `buildKeywordsString` merged & improved |
| `metaUtils.ts` | Internal logic in `textUnified.ts`   | `truncateMeta`, `normalizeWhitespace` inlined with smarter sentence heuristics                |
| `seoBasics.ts` | Call‑site logic / existing utilities | `resolveBaseUrl` simplified inline, breadcrumb JSON-LD auto-injected by `buildPageSeo`        |

Attempting to import these files will now fail; update any stale branches accordingly.

## Error Handling & Logging

- Social image generation exceptions are caught; optional `onSocialImageError` callback receives
  context.
- Missing `pageSeo` (temporary) previously fell back; fallback will be removed after complete
  migration.

## Performance Notes

- Memoization avoids rebuilding identical SEO objects within a single render cycle.
- Avoid passing large `enrichedParts` arrays (> ~50 items) to keep memory shallow.

## Future Enhancements (Backlog)

- Async social image generation with build-time cache
- Automatic locale alternate `<link rel="alternate" hreflang="...">` emission (partial support via
  `alternateLocales`)
- Test coverage (parseRobots, sanitize, social image fallback)

## Accessibility Considerations

- Accurate `<title>` improves screen reader context switching.
- Structured data aids assistive technologies that parse semantic meaning.

---

Last updated: 2025-10-03 (legacy utilities removal)
