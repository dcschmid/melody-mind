# Category Architecture

This document provides a focused overview of how category data is loaded, transformed and consumed
in MelodyMind after the October 2025 refactor.

## 1. Goals

- Deterministic single fallback (English) for missing localized category sets
- Minimize build memory usage via lazy loading
- Keep pure data shaping logic isolated for tree‑shaking & future testing
- Avoid wrapper layers that mix I/O and transformations

## 2. Core Files

| Responsibility          | File                                       | Notes                                                                                            |
| ----------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| Lazy loading + fallback | `src/utils/category/categoryLoader.ts`     | Provides high-level load helpers; delegates raw glob imports to `categoriesIndex.ts`             |
| Raw glob index          | `src/utils/category/categoriesIndex.ts`    | Central source of `getCategories(lang)` / `getCategory(lang, slug)`; returns arrays/objects only |
| Pure transforms         | `src/utils/category/categoryTransforms.ts` | Filtering, searching, stats, type guard; zero side effects                                       |
| Type definition         | `src/types/category.ts`                    | Canonical `Category` interface (no duplication elsewhere)                                        |

## 3. Loading Flow

```text
Page / Service
   ↓ (language param)
categoryLoader.loadCategoriesForLanguage(lang)
   ↓
 categoriesIndex.getCategories(lang)
   ↓ (empty?)
 fallback to 'en' (only if different)
   ↓
 Category[] returned (no transforms applied)
```

Single category by slug follows the same path using `loadCategoryBySlug(slug, { language })`.

## 4. Fallback Strategy

- Only one fallback: `en`
- Fallback engaged only if primary language yields zero categories
- No nested or chained fallbacks
- If both primary and fallback empty → caller receives `{ success: false }` or `null`

## 5. Transforms (Pure)

All functions in `categoryTransforms.ts` are synchronous, side‑effect free and never perform I/O.

| Function                      | Purpose                                                                |
| ----------------------------- | ---------------------------------------------------------------------- |
| `filterPlayableCategories`    | Returns only categories that satisfy `isPlayableCategory`              |
| `filterNonPlayableCategories` | Inverse of playable filter                                             |
| `getCategoryStats`            | Aggregates counts + byType map                                         |
| `getCategoriesByType`         | Filters by `categoryType`                                              |
| `isPlayableCategory`          | Type guard ensuring presence of required playable properties           |
| `searchCategories`            | Case‑insensitive substring search across headline, subline, text, slug |

## 6. Design Principles

1. **Separation of concerns**: Loading vs. transformation vs. typing.
2. **Predictable fallbacks**: Exactly one fallback layer; no “guessing” locales.
3. **Tree‑shakability**: Pure transforms enable dead code elimination when unused.
4. **Low coupling**: Pages compose loader + transforms explicitly; no hidden side effects.
5. **Test readiness**: Pure functions trivially unit testable (tests deferred by project phase).

## 7. Adding New Functionality

| Scenario                                           | Place Code In                              | Rationale                                          |
| -------------------------------------------------- | ------------------------------------------ | -------------------------------------------------- |
| Need another derived metric (e.g., playable ratio) | `categoryTransforms.ts`                    | Pure aggregation, no I/O                           |
| Need to introduce caching for repeated loads       | (Avoid for now) or a dedicated cache layer | Prevent impurity in transforms / loader simplicity |
| Need new fallback rule                             | `categoryLoader.ts`                        | Centralizes fallback policy                        |
| Need to support new source format                  | `categoriesIndex.ts`                       | Raw ingestion boundary                             |

## 8. Anti‑Patterns to Avoid

- Reintroducing a combined utility that loads + filters in one call
- Multiple locale fallback chains (en -> de -> fr, etc.)
- Transform functions performing logging, network requests, or mutation
- Duplicating the `Category` interface locally

## 9. Accessibility & SEO Notes

- Category metadata (headline, introSubline, text) should be treated as user‑visible content; ensure
  contrast and semantic markup where rendered.
- When transforming or slicing categories for UI lists, prefer stable ordering defined at the call
  site (no implicit sorting here after removal of unused old sort helper).

## 10. Future Enhancements (Optional)

| Idea                                    | Benefit                             | Considerations                                      |
| --------------------------------------- | ----------------------------------- | --------------------------------------------------- |
| Optional in‑memory weak cache in loader | Avoid duplicate async imports       | Must not change return shape; ensure memory bounded |
| Locale availability manifest            | Faster detection of missing locales | Requires build step to generate manifest            |
| Pluggable scoring / weighting transform | Enhanced personalized ordering      | Keep separate pure module                           |

## 11. Migration Summary

Removed legacy `categoryLoadingUtils.ts` and unused sorting logic. Introduced `categoryLoader.ts`
(lean) + `categoryTransforms.ts` (pure). All pages updated to reference new modules; fallback policy
unified.

## 12. Checklist for Contributors

Before committing category-related changes:

- [ ] Using canonical `Category` type
- [ ] No new fallbacks beyond `en`
- [ ] New helpers are pure (if in transforms)
- [ ] Loader changes documented here (if policy altered)
- [ ] No duplication of removed utilities

---

Last updated: 2025-10-04
