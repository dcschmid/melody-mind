/**
 * Recent Reads Client Script
 *
 * Tracks recently read articles in localStorage for the "continue reading" feature.
 * Extracted from [...slug].astro for caching and maintainability.
 */

import { VERSIONED_KEYS } from "@constants/storageVersions";
import { safeLocalStorage } from "@utils/storage/safeStorage";

const MAX_ENTRIES = 5;

interface RecentReadEntry {
  slug: string;
  title: string;
  updatedAt: string;
  image?: string;
}

export function initRecentReads(): void {
  const dataEl = document.getElementById("recent-read-data");
  if (!dataEl) return;

  const recentEntry: RecentReadEntry = {
    slug: dataEl.dataset.slug || "",
    title: dataEl.dataset.title || "",
    updatedAt: dataEl.dataset.updatedAt || "",
    image: dataEl.dataset.image || "",
  };

  if (!recentEntry.slug || !recentEntry.title) return;

  const normalizedSlug = recentEntry.slug.replace(/^\/+/, "");
  const raw = safeLocalStorage.getRaw(VERSIONED_KEYS.RECENT_READS);
  const parsed = raw ? JSON.parse(raw) : [];

  // Remove existing entry for this slug
  const filtered = parsed.filter(
    (entry: RecentReadEntry) => entry.slug !== normalizedSlug
  );

  // Add new entry at the beginning
  const updated = [recentEntry, ...filtered].slice(0, MAX_ENTRIES);

  safeLocalStorage.set(VERSIONED_KEYS.RECENT_READS, updated);
}

// Auto-initialize when script loads
initRecentReads();
