/**
 * File-based SWR cache for RSS news feeds.
 *
 * Strategy:
 *  - Fresh window (TTL): 5 minutes (300_000 ms)
 *  - Stale window: additional 10 minutes (600_000 ms)
 *  - States:
 *      * fresh: createdAt + ttl > now → serve & return
 *      * stale: createdAt + ttl <= now < createdAt + ttl + staleWindow → serve stale & trigger revalidate
 *      * expired: createdAt + ttl + staleWindow <= now → block & refetch
 *  - Concurrency: In-process promise map prevents duplicate revalidations.
 *
 *  The existing in-memory cache in rssService remains as the *first* lookup layer; this module
 *  provides a persistent second layer across requests/runtime cycles.
 */

import { promises as fs } from "node:fs";
import { mkdirSync } from "node:fs";
import path from "node:path";

import type { NewsResponse } from "../rssService"; // circular-safe (type only)

// Cache configuration constants (kept local to avoid premature abstraction)
const CACHE_DIR = path.join(process.cwd(), "tmp", "rss-cache");
const TTL_MS = 5 * 60 * 1000; // 5 minutes
const STALE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

interface CacheFileMeta {
  language: string;
  createdAt: string; // ISO
  revalidatedAt?: string; // ISO of last successful revalidation
  ttlMs: number;
  staleAfterMs: number; // absolute timestamp (epoch ms) when it becomes stale
  expireAtMs: number; // absolute timestamp (epoch ms) when it is fully expired
}

interface CacheFileShape {
  meta: CacheFileMeta;
  data: NewsResponse;
}

// Track ongoing revalidations to avoid duplicate concurrent network fetches
const revalidatePromises = new Map<string, Promise<NewsResponse>>();

function ensureDir(): void {
  try {
    mkdirSync(CACHE_DIR, { recursive: true });
  } catch {
    // ignore
  }
}

function cacheFilePath(language: string): string {
  return path.join(CACHE_DIR, `news_${language}.json`);
}

async function readCache(language: string): Promise<CacheFileShape | null> {
  try {
    const file = await fs.readFile(cacheFilePath(language), "utf8");
    const parsed: CacheFileShape = JSON.parse(file);
    return parsed;
  } catch {
    return null;
  }
}

async function writeCache(language: string, data: NewsResponse): Promise<void> {
  const now = Date.now();
  const meta: CacheFileMeta = {
    language,
    createdAt: new Date().toISOString(),
    revalidatedAt: undefined,
    ttlMs: TTL_MS,
    staleAfterMs: now + TTL_MS,
    expireAtMs: now + TTL_MS + STALE_WINDOW_MS,
  };
  const fileShape: CacheFileShape = { meta, data };
  await fs.writeFile(cacheFilePath(language), JSON.stringify(fileShape, null, 2), "utf8");
}

async function updateCacheOnRevalidate(
  language: string,
  existing: CacheFileShape,
  data: NewsResponse
): Promise<void> {
  const now = Date.now();
  const updated: CacheFileShape = {
    meta: {
      ...existing.meta,
      createdAt: existing.meta.createdAt, // preserve original creation
      revalidatedAt: new Date().toISOString(),
      staleAfterMs: now + TTL_MS,
      expireAtMs: now + TTL_MS + STALE_WINDOW_MS,
    },
    data,
  };
  await fs.writeFile(cacheFilePath(language), JSON.stringify(updated, null, 2), "utf8");
}

export interface SWRResult {
  data: NewsResponse | null; // data served to caller
  state: "miss" | "fresh" | "stale" | "revalidating" | "expired";
  // if stale and revalidation triggered, promise provided for optional awaiting
  revalidatePromise?: Promise<NewsResponse>;
}

/**
 * Get (and possibly refresh) a cached feed using SWR semantics.
 * @param {string} language Normalized + ensured language key (already processed via ensureSupportedLanguage)
 * @param {() => Promise<NewsResponse>} fetcher Async function returning a fresh NewsResponse when network fetch required
 * @param {{ ttlMs?: number; staleWindowMs?: number }} [options] Optional overrides for TTL / stale window (testing, tuning)
 * @returns {Promise<SWRResult>} SWRResult describing cache state and data
 */
export async function getOrUpdateSWR(
  language: string,
  fetcher: () => Promise<NewsResponse>,
  options?: { ttlMs?: number; staleWindowMs?: number }
): Promise<SWRResult> {
  ensureDir();

  const ttl = options?.ttlMs ?? TTL_MS;
  const staleWindow = options?.staleWindowMs ?? STALE_WINDOW_MS;

  const cache = await readCache(language);
  const now = Date.now();

  if (!cache) {
    // MISS → fetch + persist
    try {
      const fresh = await fetcher();
      await writeCache(language, fresh);
      return { data: fresh, state: "miss" };
    } catch {
      return { data: null, state: "miss" };
    }
  }

  // Evaluate freshness based on dynamic overrides when provided
  const staleAfter = new Date(cache.meta.createdAt).getTime() + ttl;
  const expireAt = staleAfter + staleWindow;

  if (now < staleAfter) {
    return { data: cache.data, state: "fresh" };
  }

  if (now >= expireAt) {
    // Fully expired → blocking refresh
    try {
      const fresh = await fetcher();
      await writeCache(language, fresh);
      return { data: fresh, state: "expired" };
    } catch {
      // On failure serve old data if any (defensive): though expired, better than null
      return { data: cache.data, state: "expired" };
    }
  }

  // STALE window: serve stale + trigger background revalidation (single flight)
  const key = language;
  let revalidate = revalidatePromises.get(key);
  if (!revalidate) {
    revalidate = (async (): Promise<NewsResponse> => {
      try {
        const fresh = await fetcher();
        await updateCacheOnRevalidate(language, cache, fresh);
        return fresh;
      } catch {
        return cache.data; // fallback to stale if fetch fails
      } finally {
        revalidatePromises.delete(key);
      }
    })();
    revalidatePromises.set(key, revalidate);
  }

  return { data: cache.data, state: "stale", revalidatePromise: revalidate };
}
