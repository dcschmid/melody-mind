# Content Layer Migration Notes

This document summarizes the migration adjustments for Astro's new Content Layer behavior (legacy
`type: "content"` collections now backed by an internal `glob()` loader with backward compatibility
shims).

## Summary

We updated the project to ensure all legacy knowledge collections remain explicitly declared and
compatible with the new loading mechanism. Runtime pages already performed defensive, on-demand
collection loading, so only minimal structural changes were required.

## Changes Applied

1. Added explicit collection entry for `knowledge-uk` in `src/content/config.ts`.
2. Exported `baseKnowledgeSchema` from `src/content/config.ts` for stable type inference in
   `env.d.ts` (was already referenced there).
3. Confirmed no usage of deprecated features:
   - No `layout` frontmatter fields inside collection markdown entries.
   - No `image().refine()` calls.
   - No direct reliance on implicit ordering from `getCollection()`.
4. Verified existing code already:
   - Provides its own sorting (by slug/id) on the knowledge index page.
   - Performs null/empty fallbacks and defensive try/catch around `getCollection`.
   - Gracefully handles missing localized collections by falling back to English.

## Potential Breaking Differences Reviewed

| Potential Change (Upstream)        | Project Impact                                                                | Action Needed |
| ---------------------------------- | ----------------------------------------------------------------------------- | ------------- |
| Collections must be declared       | All knowledge collections now explicitly declared (including `knowledge-uk`). | Done          |
| `layout` field unsupported         | Not used in collection entries.                                               | None          |
| Non-deterministic ordering         | We already sort manually by slug/id.                                          | None          |
| `image().refine()` unsupported     | Not used.                                                                     | None          |
| `getEntry` key typing relaxed      | `getEntry` not in active use (only commented).                                | None          |
| Possible `undefined` return values | Defensive checks and 404 handling are present.                                | None          |

## Follow-Up Implementations (Completed)

The previously listed recommendations have been implemented:

| Item                            | Implementation                                        | Files                                                       |
| ------------------------------- | ----------------------------------------------------- | ----------------------------------------------------------- |
| Additional language collections | Added `knowledge-pl` to collections + types           | `src/content/config.ts`, `src/env.d.ts`                     |
| Shared slug/id sorting          | Introduced pure utility `sortKnowledgeEntries`        | `src/utils/content/sortKnowledgeEntries.ts`                 |
| Collection caching              | Added `getCollectionCached` with TTL + usage in pages | `src/utils/content/getCollectionCached.ts`, knowledge pages |
| Runtime image validation        | Regex-based validation + fallback image               | `src/pages/[lang]/knowledge/[...slug].astro`                |

### Notes

- Caching TTL default: 5 minutes (sufficient for largely static markdown). Adjust via options if
  needed.
- Sorting remains stable and locale-based; if localized collation needed later, inject
  `Intl.Collator`.
- Image validation intentionally minimal; extend to width/height probing via `import("image-size")`
  in a future build script if required.

## Future Enhancements (Optional)

1. Add integration test (once test freeze lifted) to assert fallback logic and cache invalidation.
2. Provide a CLI script to warm the cache during cold start if SSR latency becomes noticeable.
3. Add optional structured logging around cache hits/misses (behind an env flag).

## No Further Action Required

At this stage the migration is complete and compatible with the new Content Layer backend. Pages
remain dynamic (`prerender = false`) to limit build memory pressure.

---

Last updated: 2025-09-19 (follow-ups applied)
