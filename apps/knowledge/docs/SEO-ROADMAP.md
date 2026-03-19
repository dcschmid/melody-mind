# SEO Roadmap

## Goal

Build a durable SEO baseline for Melody Mind that improves crawl quality, structured
data coverage, internal linking, and content freshness without adding brittle page-by-page
meta handling.

## Current Baseline

- `sitemap-index.xml` and `robots.txt` are generated during build.
- Canonical URLs are built centrally through `buildPageSeo()`.
- Open Graph and Twitter card tags are present in the shared layout.
- JSON-LD already exists on several content page types.
- Global `Organization` and `WebSite` schema with `SearchAction` are now injected from
  the layout.
- Search, bookmarks, and legal utility pages can be kept out of the index where they do
  not create ranking value.

## Priority 1

### 1. Indexation hygiene

- Keep low-value utility pages on `noindex,follow`.
- Review `search`, `bookmarks`, `privacy`, `cookies`, and `imprint` as non-landing pages.
- Confirm no redirecting or duplicate routes appear in the sitemap.

Success signal:

- Search Console shows fewer "Crawled - currently not indexed" and duplicate clusters.

### 2. Content freshness signals

- Stop using build-time `new Date()` as article or page freshness metadata.
- Only output `publishDate` and `modifiedDate` when a real editorial date exists.
- Ensure all knowledge articles have consistent `createdAt` and `updatedAt`.

Success signal:

- Structured data and meta dates match visible editorial dates on page.

### 3. Structured data consistency

- Keep one clear schema model per page type.
- Knowledge articles: `Article` plus `BreadcrumbList`.
- Category and taxonomy hubs: `CollectionPage` plus `ItemList`.
- Quiz detail pages: keep `Quiz`, add breadcrumb context consistently.
- Homepage / knowledge hub: `CollectionPage` plus `ItemList`.

Success signal:

- Rich Results Test returns valid schema on representative URLs with no avoidable warnings.

## Priority 2

### 4. Internal linking system

- Add "Related articles" blocks on knowledge article pages based on category,
  taxonomy subsection, or shared keywords.
- Cross-link quizzes from related knowledge articles and vice versa.
- Link category pages to taxonomy pages where the topical relationship is explicit.

Success signal:

- Higher average pages per session and better crawl depth for long-tail articles.

### 5. Title and description quality control

- Audit duplicate or overly similar titles across knowledge, categories, taxonomy, and
  quiz pages.
- Make titles intent-specific:
  `Genre Evolution of X | MelodyMind`
  `Music Quiz: 1990s | MelodyMind`
  `Category: Latin Music | MelodyMind`
- Keep descriptions unique and search-intent aligned.

Success signal:

- Fewer duplicate title/description warnings in audits and better CTR from search.

### 6. Image SEO

- Ensure every indexable content page has one stable social/share image.
- Add descriptive `imageAlt` values consistently in the SEO builder inputs.
- Prefer source-specific images for articles and category hubs over generic defaults.

Success signal:

- Stronger social previews and fewer pages falling back to the generic site image.

## Priority 3

### 7. Editorial schema enrichment

- Expand article JSON-LD with optional fields only when real data exists:
  `about`, `mentions`, `sameAs`, `citation`, `isPartOf`.
- Add author model consistency if Melody Mind remains the publisher and articles may
  also expose individual authors.
- Consider `FAQPage` only where the page visibly contains real FAQ content.

Success signal:

- Better entity clarity without introducing schema spam.

### 8. Search-facing landing pages

- Identify strongest search intents:
  genre history,
  decade overviews,
  artist movement explainers,
  quiz landing pages.
- Build stronger intro copy and section summaries for those hub pages.
- Avoid thin archive pages that only list cards without context.

Success signal:

- More impressions for non-branded long-tail queries.

### 9. Measurement

- Add a repeatable SEO audit checklist to release flow:
  build,
  manual structured-data spot checks,
  crawl-depth review,
  title/description duplicate scan.
- Track Search Console metrics per page type, not only site-wide.

Success signal:

- SEO regressions become visible before deploys.

## Page-Type Recommendations

### Homepage

- Treat as `CollectionPage`.
- Keep `ItemList` of featured or latest knowledge content.
- Strengthen intro copy around core topic clusters, not only brand language.

### Knowledge articles

- Best SEO opportunity in the project.
- Require real dates, breadcrumbs, strong intro copy, related links, and stable images.
- Add visible "last updated" only if editorially maintained.

### Taxonomy section pages

- Also treat as indexable hubs if they explain the section and not only list entries.
- Add breadcrumbs and `CollectionPage` schema.

### Quiz overview and quiz detail

- Index if quizzes are intended as search entry points.
- Improve landing copy so they are not perceived as thin tool pages.
- Add stronger cross-links to source articles.

### Search, bookmarks, legal pages

- Keep out of search index unless a clear business reason exists.

## Recommended Implementation Order

1. Finish `noindex` cleanup for utility/legal pages.
2. Add `CollectionPage` schema builders and wire them into homepage, taxonomy, and
   category pages.
3. Add related-article internal linking on knowledge pages.
4. Run a duplicate title/description audit and normalize patterns.
5. Normalize content dates across all `knowledge-en` entries.

## Definition of Done

- All indexable pages have a deliberate title, description, canonical, and stable image.
- All non-indexable utility pages are explicitly `noindex,follow`.
- Every major page type has a consistent JSON-LD model.
- Knowledge articles link to related content.
- No build-time fake freshness dates remain in SEO metadata.
