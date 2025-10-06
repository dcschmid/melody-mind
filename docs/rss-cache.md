# RSS File Cache (SWR Layer)

This document explains the stale‑while‑revalidate (SWR) file cache used by `rssService`.

## Goals

- Persist feed aggregation across process restarts
- Avoid hammering third‑party RSS sources
- Provide low latency responses using stale data while refreshing in background
- Keep logic framework‑agnostic (pure TypeScript + Node fs)

## Location & Structure

Cache files live under: `tmp/rss-cache/` (not committed). One file per language:

```text
news_<language>.json
```

Schema:

```jsonc
{
  "meta": {
    "language": "en",
    "createdAt": "2025-10-06T10:00:00.000Z",
    "revalidatedAt": "2025-10-06T10:04:12.000Z",
    "ttlMs": 300000,
    "staleAfterMs": 1730810000000,
    "expireAtMs": 1730810600000,
  },
  "data": {
    /* NewsResponse */
  },
}
```

## Timing Windows

| Window       | Duration | Behavior                                    |
| ------------ | -------- | ------------------------------------------- |
| Fresh TTL    | 5 min    | Serve instantly                             |
| Stale Window | +10 min  | Serve stale + trigger background revalidate |
| Expired      | >15 min  | Block, refetch synchronously                |

Combined SWR span: 15 minutes (configurable internally or via optional function overrides for
tests).

## Resolution Order

1. In‑memory cache (original `NewsCache` inside `rssService` – fastest).
2. File cache (`getOrUpdateSWR`).
3. Network aggregation (fetch feeds → parse → slice top 50).

Successful network fetch populates both file + in‑memory caches.

## Concurrency Control

A per‑language promise map prevents duplicate simultaneous revalidations. If a revalidation is
already running, readers reuse the same promise reference.

## Failure Modes

| Scenario                  | Result                                                                     |
| ------------------------- | -------------------------------------------------------------------------- |
| Read error / missing file | Treated as cache miss → fetch                                              |
| Revalidation fetch fails  | Stale data served; file left unchanged                                     |
| Expired fetch fails       | Old file (expired) still returned rather than empty (graceful degradation) |
| Initial fetch fails       | Empty `NewsResponse` fallback (consistent with prior service behavior)     |

## Edge Considerations

- Normalized + ensured language keys ensure cache key stability (`ensureSupportedLanguage`).
- Fallback language retry logic remains in the fetcher (unchanged).
- JSON file pretty‑printed (2 spaces) for debuggability; size is small (<= few KB).

## Public API

`getOrUpdateSWR(language, fetcher, options?)` → returns:

```ts
interface SWRResult {
  data: NewsResponse | null;
  state: "miss" | "fresh" | "stale" | "revalidating" | "expired"; // 'revalidating' currently unused alias of 'stale'
  revalidatePromise?: Promise<NewsResponse>;
}
```

## Testing Suggestions (future)

- Inject shorter TTL via options (e.g. 50ms) to simulate transitions.
- Mock fetcher to count invocations ensuring single revalidation during stale window.

## Rationale

A lightweight file SWR layer was chosen instead of adding a dependency (Redis, LRU libs) to keep
deployment friction and bundle size minimal while meeting performance goals.

---

Last updated: 2025-10-06
