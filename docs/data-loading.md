# Data Loading & Memory Strategy

This document summarizes the simplified data loading approach after refactoring.

## Goals

- Minimize build-time memory footprint
- Avoid bundling large JSON eagerly
- Keep language handling deterministic (route param as single source of truth)
- Provide predictable fallbacks

## Categories

- Source JSON: `src/json/<lang>_categories.json`
- Loader: `src/utils/category/categoriesIndex.ts`
- Public API:
  - `getCategories(lang: string): Promise<Category[]>`
  - `getCategory(lang: string, slug: string): Promise<Category | null>`
- Lazy loading implemented via `import.meta.glob` (non‑eager) → each language file becomes a
  separate chunk only fetched when needed.
- Fallback language: `en` (canonical reference content)
- No ENV language filtering in current iteration (can reintroduce if a hard whitelist is required
  later).

### Why Removed

| Removed Element                                   | Reason                                    |
| ------------------------------------------------- | ----------------------------------------- |
| Proxy default export                              | Added indirection without real benefit    |
| ENV filtering logic                               | Not actively used and added complexity    |
| Runtime detectLanguage utility                    | Pages already have `Astro.params.lang`    |
| ensureCategoriesLoaded + getCategoriesForLang duo | Unified into single async `getCategories` |

## Questions / Albums

- Question & album JSON are fetched on-demand from `public/json/genres/<lang>/<category>.json`
  client-side.
- No central wrapper function: existing fetch code is already thin and explicit; a wrapper would add
  indirection without clear reuse.
- Fallback logic (where implemented) should converge on the same fallback language as categories
  (`en`). Legacy usages falling back to `de` can be updated progressively.

## Time Pressure Page Optimization

- Switched from full prerender + static path explosion to `prerender = false` → on-demand rendering
  drastically lowers build-time memory spikes.
- Category list for time pressure mode is now only resolved at request time.

## Language Handling

- Single source: dynamic route segment `[lang]`.
- No client-side guessing: simplifies code and eliminates race conditions.
- If a future standalone island needs runtime inference, reintroduce a minimal helper limited to
  `(window.location.pathname || document.documentElement.lang || 'en')`.

## Fallback Policy

- Always attempt requested language first.
- If empty or not present → fallback to `en`.
- Never cascade further (single fallback hop) to keep logic predictable.

> NOTE: Historically some loaders used `de` as fallback. All remaining loaders (categories, albums,
> time pressure) now consistently use `en` as the canonical fallback to match content source and
> reduce ambiguity.

## Performance Notes

- Lazy imports ensure only accessed language chunks are parsed.
- SSR for time pressure avoids generating N×M static pages (languages × categories).
- Future potential: cache results at the server edge/CDN if needed (static JSON is immutable).

## When Adding a New Language

1. Add `<lang>_categories.json` to `src/json/`.
2. Add necessary i18n translation files.
3. Deploy – loader auto-detects file; no code change required.

## When Adding a New Category

1. Update each language's categories JSON.
2. Provide question/album JSON under `public/json/genres/<lang>/<category>.json`.
3. Page route will function automatically via dynamic route.

## Do / Don't

| Do                                                 | Don't                                       |
| -------------------------------------------------- | ------------------------------------------- |
| Keep loaders pure & side-effect free               | Add global mutable state outside the cache  |
| Use async `getCategories` before depending on data | Rely on deprecated `ensureCategoriesLoaded` |
| Maintain a single fallback language                | Chain multiple fallback languages           |
| Add only necessary fields to Category              | Overload with game-only ephemeral state     |

## Open Follow-Ups

- Normalize all remaining fallback usages to `en`.
- Audit album/question loaders for consistent error messaging.

## Rationale Summary

Reducing abstraction layers cut cognitive overhead and build memory, while keeping future
extensibility (adding languages/categories) nearly zero-cost. The system now aligns with
static-first principles while avoiding over-generation of rarely visited pages.
