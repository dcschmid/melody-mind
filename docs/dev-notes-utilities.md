# Developer Notes: Ordering & Search Debounce Utilities

This document provides implementation and usage notes for two internal utility areas recently added
or refactored: sequential ordering utilities (`ordering.ts`) and the search debounce heuristic
(`initSearchPanel.ts`).

## 1. Sequential Ordering Utilities (`src/utils/content/ordering.ts`)

### Purpose

Provide a deterministic, data‐driven way to assign sequential numbers (e.g., episode indices,
ordered listing badges) based on chronological item metadata without mutating original data
structures.

### Core API

- `buildSequentialNumberMapByDate<T>(items, { id, date, startAt = 1, direction = 'asc' }) => Map<string, number>`
  - Produces a `Map` from stable id → sequential number.
  - Filters out items with invalid dates or missing ids (silently skipped, preserving stable
    numbering for valid items).
  - Sorting:
    - `direction: 'asc'` → oldest item becomes number 1.
    - `direction: 'desc'` → newest item becomes number 1.
  - `startAt` allows alternative bases (e.g., 0 for zero-based UI labels — though default game UX
    prefers 1-based human-readable indexing).

- `assignSequentialNumbers<T, K extends string = 'order'>(items, opts & { key?: K }) => Array<T & { [K]: number | undefined }>`
  - Shallow-clones each input item and attaches a numeric property (default key: `order`).
  - Items with invalid/missing chronological inputs receive `undefined` for the order key to signal
    “not ranked.”

### Design Considerations

- Pure + allocation friendly: original arrays/objects are not mutated.
- Graceful degradation: invalid date entries do not throw; they are excluded, avoiding brittle
  ingestion pipelines.
- Stable sequencing: first occurrence of an item id wins; duplicate ids are ignored after the first
  assignment (protects against accidental duplication in source arrays).
- Directional flexibility supports UIs where “latest first” is desired while still showing intuitive
  numbering.

### Typical Usage Pattern

```ts
import { assignSequentialNumbers } from "@utils/content/ordering";

const withOrder = assignSequentialNumbers(episodes, {
  id: (e) => e.slug,
  date: (e) => new Date(e.publishedAt),
  direction: "asc", // or 'desc' for newest=1
});
```

Then render `withOrder[i].order` in badges, aria labels, or microdata (`position`) fields.

### Accessibility & SEO Notes

- When exposing order in markup, prefer using it as:
  - `aria-label` context (e.g., “Episode 4 of 12”).
  - `meta itemProp="position"` when embedding in an ItemList/ListItem microdata pattern.
- Do not rely solely on visual numbering; keep DOM order meaningful.

### Error Handling

- Intentional omission of thrown errors: calling sites should validate upstream ingestion if strict
  guarantees are required.

---

## 2. Search Debounce Heuristic (`src/components/Search/initSearchPanel.ts`)

### Overview / Purpose

Automatically infer a reasonable debounce delay for large item collections to reduce main-thread
churn during incremental search filtering, while keeping smaller lists responsive.

### Heuristic Function

`deriveHeuristicDebounce(selector: string): number | undefined`

- Counts DOM nodes matching `selector` at initialization.
- Applies tiered thresholds:
  - `> 400` → 300ms
  - `> 200` → 220ms
  - `> 120` → 160ms
  - `> 60` → 100ms
  - `> 30` → 60ms
  - Otherwise: `undefined` (no debounce; instant filtering)

If the user explicitly supplies `debounceMs` in `initSearchPanel({ debounceMs })`, that value
overrides the heuristic.

### Rationale for Thresholds

- Below ~30 items, filtering cost is negligible – instant feedback preferred.
- 30–120 range balances perception of immediacy with minor layout cost (60–160ms cap keeps
  interactivity snappy under typical 60fps budgets).
- > 200 items introduces measurable layout + style recalculation; higher delays amortize bursts of
  > keystrokes.
- 300ms upper bound chosen to stay below the commonly cited 400ms “perceived lag” boundary while
  still batching operations for very large grids.

### When to Override

Provide an explicit `debounceMs` when:

- Domain-specific UX needs ultra-fast echo even on large lists (set lower than heuristic).
- You know item rendering is already virtualized / trivial (can set to 0 or omit).
- You want stricter batching for expensive custom filtering logic (increase slightly, but keep
  <400ms).

### Example

```ts
import { initSearchPanel } from "@components/Search/initSearchPanel";

initSearchPanel({
  idBase: "playlist-search",
  itemSelector: ".playlist-item",
  debounceMs: 150, // explicit override
});
```

### Accessibility Considerations

- Debounce delays should not prevent assistive tech users from receiving timely live region updates.
  Keep ARIA status regions updated only after filtering completes (current implementation does this
  via `onResultsUpdated`).
- Avoid stacking multiple debounces (only one layer applied in current architecture).

---

## 3. Integration Points & Conventions

- Use ordering utilities before rendering structured data to ensure `position` reflects intended
  chronological/semantic ordering.
- Always ensure date strings are ISO-8601 and converted via `new Date(...)` or a normalization
  helper before passing to ordering utilities.
- Keep debounce heuristic centrally defined; do not fork threshold logic in other modules.

---

## 4. Future Enhancements (Optional)

- Add telemetry hook to collect real user typing latency vs. list size (data-driven tuning of
  thresholds).
- Provide a `strategy: 'auto' | 'none' | 'fixed'` config to make intent explicit.
- Extend ordering utilities with tie-breaker callback (e.g., alphabetical when timestamps equal).

---

## 5. Maintenance Checklist

- When adding new large searchable lists: verify heuristic tiers still appropriate (adjust once
  globally if needed).
- Before changing ordering rules, audit all consumers expecting stable numbering (episode pages,
  feeds, microdata builders).
- Document any threshold adjustments here to keep historical rationale.

---

Last updated: 2025-10-01

---

## 6. Category Loader vs. Transforms (Architecture Note)

Refactor (Oct 2025) introduced a split between category data loading and pure data shaping:

- `categoryLoader.ts`: Handles lazy loading + single English fallback. Responsible for I/O only.
- `categoryTransforms.ts`: Pure functions (filter/search/stats/type guard). No side effects.

Guidelines:

1. Keep new fetch/fallback logic out of transform modules.
2. Add only pure, deterministic helpers to the transforms file (no caching, no logging, no globals).
3. Compose loading + transforms at the page or service level; do not re‑introduce combined wrappers.

Rationale: Improves tree‑shaking, lowers build memory pressure, and prepares a clean seam for future
unit tests without mocking file system boundaries.
