/**
 * Recent Reads Client Script
 *
 * Tracks recently read articles in localStorage for the "continue reading" feature.
 * Extracted from [...slug].astro for caching and maintainability.
 */

import { VERSIONED_KEYS } from "@constants/storageVersions";
import { isServer } from "@utils/environment";

const MAX_ENTRIES = 3;

interface RecentReadEntry {
  slug: string;
  title: string;
  updatedAt: string;
}

export function initRecentReads(): void {
  const dataEl = document.getElementById("recent-read-data");
  if (!dataEl) return;

  const recentEntry: RecentReadEntry = {
    slug: dataEl.dataset.slug || "",
    title: dataEl.dataset.title || "",
    updatedAt: dataEl.dataset.updatedAt || "",
  };

  if (!recentEntry.slug || !recentEntry.title) return;
  if (isServer || !window.localStorage) return;

  try {
    const normalizedSlug = recentEntry.slug.replace(/^\/+/, "");
    const raw = window.localStorage.getItem(VERSIONED_KEYS.RECENT_READS);
    const parsed = raw ? JSON.parse(raw) : [];

    const items: RecentReadEntry[] = Array.isArray(parsed)
      ? parsed.filter(
          (item): item is RecentReadEntry =>
            item && typeof item.slug === "string" && typeof item.title === "string"
        )
      : [];

    const next: RecentReadEntry[] = [
      { ...recentEntry, slug: normalizedSlug },
      ...items.filter((item) => item.slug !== normalizedSlug),
    ];

    window.localStorage.setItem(
      VERSIONED_KEYS.RECENT_READS,
      JSON.stringify(next.slice(0, MAX_ENTRIES))
    );
  } catch {
    // Ignore storage errors
  }
}

// Auto-initialize when script loads
initRecentReads();
