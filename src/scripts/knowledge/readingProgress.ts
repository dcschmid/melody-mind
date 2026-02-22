/**
 * Reading Progress Client Script
 *
 * Tracks scroll progress and displays a progress bar.
 * Saves progress to localStorage for resuming later.
 * Extracted from [...slug].astro for caching and maintainability.
 */

import { VERSIONED_KEYS } from "@constants/storageVersions";

const SAVE_THROTTLE_MS = 1000;
const RESTORE_DELAY_MS = 200;
const MIN_RESTORE_PROGRESS = 0.02;
const MAX_RESTORE_PROGRESS = 0.95;
const SCROLL_TOP_THRESHOLD = 4;

interface ProgressEntry {
  progress: number;
  updatedAt: string;
}

type ProgressStore = Record<string, ProgressEntry>;

export function initReadingProgress(): void {
  const bar = document.getElementById("reading-progress-bar");
  const label = document.getElementById("reading-progress-label");
  if (!bar || !label) return;

  const progressData = document.getElementById("recent-read-data");
  const progressSlug = progressData?.dataset.slug
    ? progressData.dataset.slug.replace(/^\/+/, "")
    : "";

  const prefersReduced =
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

  if (!prefersReduced) {
    bar.style.transition = "width 120ms ease-out";
  }

  const getProgressStore = (): ProgressStore | null => {
    if (!progressSlug) return null;
    try {
      const raw = window.localStorage?.getItem(VERSIONED_KEYS.READ_PROGRESS);
      const parsed = raw ? JSON.parse(raw) : {};
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  };

  const setProgressStore = (store: ProgressStore): void => {
    if (!progressSlug) return;
    try {
      window.localStorage?.setItem(VERSIONED_KEYS.READ_PROGRESS, JSON.stringify(store));
    } catch {
      // Ignore storage errors
    }
  };

  const restoreProgress = (): void => {
    if (!progressSlug) return;
    const store = getProgressStore();
    if (!store || typeof store !== "object") return;

    const entry = store[progressSlug];
    const progress = entry && typeof entry.progress === "number" ? entry.progress : 0;

    if (progress < MIN_RESTORE_PROGRESS || progress > MAX_RESTORE_PROGRESS) return;

    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - doc.clientHeight;
    if (scrollable <= 0) return;
    if (doc.scrollTop > SCROLL_TOP_THRESHOLD) return;

    const target = Math.round(scrollable * progress);
    window.scrollTo({
      top: target,
      behavior: prefersReduced ? "auto" : "smooth",
    });
  };

  let ticking = false;
  let hasInteracted = false;
  let lastSavedAt = 0;

  const compute = (): void => {
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - doc.clientHeight;
    const raw = scrollable > 0 ? (doc.scrollTop / scrollable) * 100 : 0;
    const clamped = Math.min(Math.max(raw, 0), 100);

    bar.style.width = `${clamped}%`;
    label.textContent = `Reading progress: ${clamped.toFixed(0)}%`;

    if (progressSlug && scrollable > 0 && hasInteracted) {
      const now = Date.now();
      if (now - lastSavedAt > SAVE_THROTTLE_MS) {
        lastSavedAt = now;
        const store = getProgressStore() || {};

        if (clamped >= 98) {
          delete store[progressSlug];
        } else {
          store[progressSlug] = {
            progress: clamped / 100,
            updatedAt: new Date().toISOString(),
          };
        }
        setProgressStore(store);
      }
    }

    ticking = false;
  };

  const onScroll = (): void => {
    hasInteracted = true;
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(compute);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  compute();

  const scheduleRestore = (): void => {
    window.setTimeout(() => {
      if (!hasInteracted) restoreProgress();
    }, RESTORE_DELAY_MS);
  };

  scheduleRestore();
  window.addEventListener("load", scheduleRestore, { once: true });
  window.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden" && hasInteracted) compute();
  });
}

// Auto-initialize when script loads
initReadingProgress();
