import { getOrAssignVariant, type ExperimentVariant } from "./abTesting";

import {
  BOOKMARK_ACTIONS,
  BOOKMARK_ANALYTICS_EVENTS,
  BOOKMARK_CHANGE_EVENT,
} from "@utils/bookmarks/clientBookmarks";
import { STORAGE_KEYS, SESSION_KEYS, RUNTIME_FLAGS } from "@constants/storage";
import { safeLocalStorage, safeSessionStorage } from "@utils/storage/safeStorage";
import {
  ENGAGEMENT_TIMING,
  ANALYTICS_LIMITS,
  READING_DEPTH_MILESTONES,
  SEARCH_QUERY_BUCKETS,
} from "@constants/analytics";

const CONSENT_KEY = STORAGE_KEYS.COOKIE_CONSENT;
const JOURNEY_KEY = SESSION_KEYS.JOURNEY;
const BOUNCE_MS = ENGAGEMENT_TIMING.BOUNCE_THRESHOLD_MS;
const ENGAGED_MS = ENGAGEMENT_TIMING.ENGAGED_MILESTONES_MS;
const RUNTIME_ANALYTICS_FLAG = RUNTIME_FLAGS.ANALYTICS_ALLOWED;

type FathomApi = {
  trackEvent?: (eventName: string) => void;
  trackGoal?: (goalId: string, valueInCents: number) => void;
};

type SearchTelemetryDetail = {
  hasQuery: boolean;
  resultsCount: number;
  queryLength: number;
  tokenCount: number;
};

type SearchResultClickDetail = {
  surface: string;
  positionBucket: "1-3" | "4-6" | "7+" | "unknown";
};

type TocClickDetail = {
  sectionId: string;
  position: number;
};

type JourneyStep = {
  kind: string;
  path: string;
};

declare global {
  interface Window {
    fathom?: FathomApi;
    /** Runtime flag for analytics allowed state (key: __mmAnalyticsAllowed) */
    __mmAnalyticsAllowed?: boolean;
    mmAnalytics?: {
      trackEvent: (eventName: string) => void;
      trackGoal: (goalId: string, valueInCents: number) => void;
      assignVariant: (experimentId: string, variants: ExperimentVariant[]) => string;
      isEnabled: () => boolean;
    };
  }
}

let initialized = false;

const clampEventName = (value: string): string =>
  value.replace(/\s+/g, " ").trim().slice(0, ANALYTICS_LIMITS.EVENT_NAME_MAX_LENGTH);

const sanitizeToken = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, ANALYTICS_LIMITS.TOKEN_MAX_LENGTH) || "unknown";

const getCurrentReadDepthBucket = (): "<50" | "50-99" | "100" | "na" => {
  const article = document.getElementById("article-content");
  if (!article) {
    return "na";
  }

  const documentElement = document.documentElement;
  const scrollableHeight = documentElement.scrollHeight - documentElement.clientHeight;
  const depth =
    scrollableHeight > 0 ? (documentElement.scrollTop / scrollableHeight) * 100 : 0;

  if (depth >= 98) {
    return "100";
  }

  if (depth >= 50) {
    return "50-99";
  }

  return "<50";
};

const doNotTrackEnabled = (): boolean => {
  const navigatorValue = window.navigator?.doNotTrack;
  const windowValue = (window as Window & { doNotTrack?: string }).doNotTrack;
  const msValue = (window.navigator as Navigator & { msDoNotTrack?: string })
    .msDoNotTrack;
  return navigatorValue === "1" || windowValue === "1" || msValue === "1";
};

const hasConsent = (): boolean => {
  const consent = safeLocalStorage.get<{ essential?: boolean; analytics?: boolean }>(
    CONSENT_KEY,
    {}
  );
  return consent?.essential === true && consent?.analytics === true;
};

const isAnalyticsEnabled = (): boolean =>
  window[RUNTIME_ANALYTICS_FLAG] === true && hasConsent() && !doNotTrackEnabled();

const callFathomEvent = (eventName: string): void => {
  if (!isAnalyticsEnabled()) {
    return;
  }

  const safeName = clampEventName(eventName);
  if (!safeName) {
    return;
  }

  try {
    window.fathom?.trackEvent?.(safeName);
  } catch {
    // Tracking is non-critical.
  }
};

const callFathomGoal = (goalId: string, valueInCents: number): void => {
  if (!isAnalyticsEnabled()) {
    return;
  }

  try {
    window.fathom?.trackGoal?.(goalId, valueInCents);
  } catch {
    // Tracking is non-critical.
  }
};

const classifyPath = (path: string): string => {
  if (path === "/") {
    return "home";
  }

  if (path.startsWith("/knowledge/")) {
    return "knowledge";
  }

  if (path.startsWith("/categories/")) {
    return "category";
  }

  if (path === "/bookmarks") {
    return "bookmarks";
  }

  if (["/privacy", "/cookies", "/imprint"].includes(path)) {
    return "legal";
  }

  return "other";
};

const readJourneyStep = (): JourneyStep | null => {
  const step = safeSessionStorage.get<JourneyStep | null>(JOURNEY_KEY, null);
  if (
    step &&
    typeof step === "object" &&
    typeof step.kind === "string" &&
    typeof step.path === "string"
  ) {
    return step;
  }
  return null;
};

const writeJourneyStep = (step: JourneyStep): void => {
  safeSessionStorage.set(JOURNEY_KEY, step);
};

const trackJourney = (): void => {
  const path = window.location.pathname || "/";
  const currentKind = classifyPath(path);
  const previous = readJourneyStep();

  if (previous && previous.kind !== currentKind) {
    callFathomEvent(`Journey: ${previous.kind} to ${currentKind}`);
  }

  writeJourneyStep({ kind: currentKind, path });
};

const trackArticleView = (): void => {
  const articleRoot = document.querySelector<HTMLElement>(
    "[data-analytics-article='true']"
  );
  if (!articleRoot) {
    return;
  }

  const category = sanitizeToken(
    articleRoot.dataset.analyticsArticleCategory || "unknown"
  );
  callFathomEvent(`Article: view ${category}`);
};

const trackEngagement = (): void => {
  const pendingTimers: number[] = [];
  let hasInteraction = false;
  let bounceTracked = false;

  const trackBounce = () => {
    if (bounceTracked) {
      return;
    }

    bounceTracked = true;
    callFathomEvent("Bounce: quick leave");
  };

  const onInteraction = () => {
    hasInteraction = true;
  };

  const onVisibilityChange = () => {
    if (document.visibilityState === "hidden" && !hasInteraction) {
      trackBounce();
    }
  };

  pendingTimers.push(
    window.setTimeout(() => {
      if (!hasInteraction) {
        trackBounce();
      }
    }, BOUNCE_MS)
  );

  ENGAGED_MS.forEach((delay) => {
    pendingTimers.push(
      window.setTimeout(() => {
        callFathomEvent(`Engaged time: ${Math.round(delay / 1000)}s`);
      }, delay)
    );
  });

  window.addEventListener("click", onInteraction, { passive: true });
  window.addEventListener("keydown", onInteraction, { passive: true });
  window.addEventListener("scroll", onInteraction, { passive: true });
  document.addEventListener("visibilitychange", onVisibilityChange);

  window.addEventListener(
    "beforeunload",
    () => {
      pendingTimers.forEach((timer) => {
        window.clearTimeout(timer);
      });
      document.removeEventListener("visibilitychange", onVisibilityChange);
    },
    { once: true }
  );
};

const inferClickZone = (target: HTMLElement): string => {
  const explicit = target.closest<HTMLElement>("[data-analytics-zone]")?.dataset
    .analyticsZone;
  if (explicit) {
    return explicit;
  }

  if (target.closest("header")) return "header";
  if (target.closest("footer")) return "footer";
  if (target.closest("[data-search-root]")) return "search";
  if (target.closest("#share-section")) return "share";
  if (target.closest(".reading-controls")) return "reading-controls";
  if (target.closest("#article-content")) return "article";
  if (target.closest("main")) return "main";
  return "other";
};

const trackHeatmapEvents = (): void => {
  const sentZones = new Set<string>();

  document.addEventListener(
    "click",
    (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) {
        return;
      }

      const zone = inferClickZone(target);
      if (sentZones.has(zone)) {
        return;
      }

      sentZones.add(zone);
      callFathomEvent(`Heatmap click: ${zone}`);
    },
    { passive: true }
  );
};

const trackReadingDepth = (): void => {
  const article = document.getElementById("article-content");
  if (!article) {
    return;
  }

  const milestones = [...READING_DEPTH_MILESTONES];
  const sentMilestones = new Set<number>();
  let ticking = false;

  const emitProgress = () => {
    const documentElement = document.documentElement;
    const scrollableHeight = documentElement.scrollHeight - documentElement.clientHeight;
    const depth =
      scrollableHeight > 0 ? (documentElement.scrollTop / scrollableHeight) * 100 : 0;

    milestones.forEach((milestone) => {
      if (depth >= milestone && !sentMilestones.has(milestone)) {
        sentMilestones.add(milestone);
        callFathomEvent(`Read depth: ${milestone}%`);
      }
    });

    ticking = false;
  };

  const onScroll = () => {
    if (ticking) {
      return;
    }

    ticking = true;
    window.requestAnimationFrame(emitProgress);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  emitProgress();
};

const bucketSearchLength = (detail: SearchTelemetryDetail): string => {
  if (!detail.hasQuery) {
    return "empty";
  }

  if (detail.tokenCount >= SEARCH_QUERY_BUCKETS.LONG_QUERY_MIN_TOKENS) {
    return "long";
  }

  if (detail.queryLength >= SEARCH_QUERY_BUCKETS.MEDIUM_QUERY_MIN_CHARS) {
    return "medium";
  }

  return "short";
};

const trackSearchMetrics = (): void => {
  let searchUsedTracked = false;
  const trackedLengthBuckets = new Set<string>();
  const emptyQueryResultSent = new Set<string>();
  const trackedResultClickBuckets = new Set<string>();

  window.addEventListener("search:performed", (event) => {
    const detail = (event as CustomEvent<SearchTelemetryDetail>).detail;
    if (!detail || typeof detail !== "object") {
      return;
    }

    if (!detail.hasQuery) {
      return;
    }

    if (!searchUsedTracked) {
      searchUsedTracked = true;
      callFathomEvent("Search: used");
    }

    const lengthBucket = bucketSearchLength(detail);
    if (!trackedLengthBuckets.has(lengthBucket)) {
      trackedLengthBuckets.add(lengthBucket);
      callFathomEvent(`Search: ${lengthBucket} query`);
    }

    if (detail.resultsCount === 0) {
      const key = `${lengthBucket}:${detail.tokenCount}`;
      if (!emptyQueryResultSent.has(key)) {
        emptyQueryResultSent.add(key);
        callFathomEvent("Search: zero results");
      }
    }
  });

  window.addEventListener("search:result-click", (event) => {
    const detail = (event as CustomEvent<SearchResultClickDetail>).detail;
    if (!detail || typeof detail !== "object") {
      return;
    }

    const surface = sanitizeToken(detail.surface || "unknown");
    const bucket = detail.positionBucket || "unknown";
    const key = `${surface}:${bucket}`;

    if (trackedResultClickBuckets.has(key)) {
      return;
    }

    trackedResultClickBuckets.add(key);
    callFathomEvent(`Search: result click ${surface} ${bucket}`);
  });
};

const trackStructuredCustomEvents = (): void => {
  const seenTocBuckets = new Set<string>();

  window.addEventListener("toc:click", (event) => {
    const detail = (event as CustomEvent<TocClickDetail>).detail;
    if (!detail || typeof detail !== "object") {
      return;
    }

    const position = Number(detail.position || 0);
    const bucket =
      position <= 0
        ? "unknown"
        : position <= 3
          ? "top"
          : position <= 7
            ? "mid"
            : "bottom";
    if (!seenTocBuckets.has(bucket)) {
      seenTocBuckets.add(bucket);
      callFathomEvent(`TOC: click ${bucket}`);
    }
  });
};

const parseVariants = (raw: string): ExperimentVariant[] => {
  const pairs = raw
    .split(",")
    .map((segment) => segment.trim())
    .filter(Boolean)
    .map((segment) => {
      const [idRaw, weightRaw] = segment.split(":").map((part) => part.trim());
      return {
        id: idRaw,
        weight: Number(weightRaw || "1"),
      };
    })
    .filter((variant) => variant.id.length > 0 && Number.isFinite(variant.weight));

  return pairs.length ? pairs : [{ id: "control", weight: 1 }];
};

const setupAbTests = (): void => {
  const experimentNodes = Array.from(
    document.querySelectorAll<HTMLElement>("[data-ab-experiment]")
  );
  const seenExposures = new Set<string>();

  experimentNodes.forEach((node) => {
    const experimentId = node.dataset.abExperiment?.trim();
    if (!experimentId) {
      return;
    }

    const rawVariants = node.dataset.abVariants || "control:1,variant:1";
    const variants = parseVariants(rawVariants);
    const assignedVariant = getOrAssignVariant(experimentId, variants);
    const classPrefix = node.dataset.abClassPrefix || "ab";
    node.dataset.abVariant = assignedVariant;
    node.classList.add(`${classPrefix}-${assignedVariant}`);

    const exposureKey = `${experimentId}:${assignedVariant}`;
    if (!seenExposures.has(exposureKey)) {
      seenExposures.add(exposureKey);
      callFathomEvent(`AB exposed: ${experimentId}:${assignedVariant}`);
    }
  });
};

const setupCustomEventApi = (): void => {
  window.mmAnalytics = {
    trackEvent: (eventName: string) => {
      callFathomEvent(eventName);
    },
    trackGoal: (goalId: string, valueInCents: number) => {
      callFathomGoal(goalId, valueInCents);
    },
    assignVariant: (experimentId: string, variants: ExperimentVariant[]) =>
      getOrAssignVariant(experimentId, variants),
    isEnabled: () => isAnalyticsEnabled(),
  };
};

const trackUiEvents = (): void => {
  const oncePerPage = new Set<string>();
  const shareSeenKeys = new Set<string>();

  document.addEventListener(
    "click",
    (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) {
        return;
      }

      const cookieSettingsButton = target.closest("[data-cookie-settings-trigger]");
      if (cookieSettingsButton && !oncePerPage.has("Cookie settings: open")) {
        oncePerPage.add("Cookie settings: open");
        callFathomEvent("Cookie settings: open");
      }

      const readingSettingsButton = target.closest("[data-reading-settings-trigger]");
      if (readingSettingsButton && !oncePerPage.has("Reading settings: open")) {
        oncePerPage.add("Reading settings: open");
        callFathomEvent("Reading settings: open");
      }

      if (target.closest("[data-cookie-action='accept']")) {
        callFathomEvent("Consent: accept analytics");
      }

      const podcastCta = target.closest<HTMLElement>("[data-analytics-podcast-target]");
      if (podcastCta) {
        const podcastTarget = sanitizeToken(
          podcastCta.dataset.analyticsPodcastTarget || "unknown"
        );
        callFathomEvent(`Podcast: click ${podcastTarget}`);
      }

      const shareTrigger = target.closest<HTMLElement>("[data-share]");
      if (shareTrigger) {
        const channel = sanitizeToken(shareTrigger.dataset.share || "unknown");
        const depthBucket = getCurrentReadDepthBucket();
        const key = `${channel}:${depthBucket}`;
        if (!shareSeenKeys.has(key)) {
          shareSeenKeys.add(key);
          callFathomEvent(`Share: action ${channel} ${depthBucket}`);
        }
      }
    },
    { passive: true }
  );

  window.addEventListener(BOOKMARK_CHANGE_EVENT, (event: Event) => {
    const customEvent = event as CustomEvent<{ action?: string }>;
    const action = customEvent.detail?.action;

    if (action === BOOKMARK_ACTIONS.add) {
      callFathomEvent(BOOKMARK_ANALYTICS_EVENTS.add);
      return;
    }
    if (action === BOOKMARK_ACTIONS.remove) {
      callFathomEvent(BOOKMARK_ANALYTICS_EVENTS.remove);
      return;
    }
    if (action === BOOKMARK_ACTIONS.category) {
      callFathomEvent(BOOKMARK_ANALYTICS_EVENTS.categoryChanged);
    }
  });
};

export function initClientAnalytics(): void {
  if (typeof window === "undefined" || initialized) {
    return;
  }

  initialized = true;
  setupCustomEventApi();
  trackArticleView();
  trackJourney();
  trackEngagement();
  trackHeatmapEvents();
  trackReadingDepth();
  trackSearchMetrics();
  trackStructuredCustomEvents();
  trackUiEvents();
  setupAbTests();
}
