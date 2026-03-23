/**
 * Client-side analytics orchestration for Melody Mind web properties.
 *
 * This module coordinates the browser-only tracking behavior built on top of
 * Fathom. Rather than logging every raw interaction, it emits a curated,
 * low-cardinality set of events for journeys, engagement, read depth, search,
 * sharing, consent actions, podcast CTAs, TOC usage, and A/B exposures.
 *
 * Design goals:
 * - stay disabled until runtime consent allows analytics,
 * - tolerate missing browser APIs and missing Fathom globals,
 * - keep event names human-readable and bounded,
 * - and initialize safely even if multiple clients try to bootstrap analytics.
 */
import { getOrAssignVariant, type ExperimentVariant } from "./abTesting";
import { STORAGE_KEYS, SESSION_KEYS, RUNTIME_FLAGS } from "../../constants/storage";
import { safeLocalStorage, safeSessionStorage } from "../storage/safeStorage";
import { isServer } from "../environment";
import { SEARCH_EVENTS, TOC_EVENTS } from "../../constants/events";
import {
  ANALYTICS_APPS,
  type AnalyticsApp,
  type AnalyticsConversionKey,
  ENGAGEMENT_TIMING,
  ANALYTICS_LIMITS,
  READING_DEPTH_MILESTONES,
  SEARCH_QUERY_BUCKETS,
} from "../../constants/analytics";

/** Canonical storage entry containing persisted consent state. */
const CONSENT_KEY = STORAGE_KEYS.COOKIE_CONSENT;
/** Session-scoped storage entry used for coarse journey tracking. */
const JOURNEY_KEY = SESSION_KEYS.JOURNEY;
/** Threshold after which a low-interaction visit is considered a quick leave. */
const BOUNCE_MS = ENGAGEMENT_TIMING.BOUNCE_THRESHOLD_MS;
/** Maximum idle gap still counted as active engagement. */
const ACTIVE_IDLE_MS = ENGAGEMENT_TIMING.ACTIVE_IDLE_WINDOW_MS;
/** Polling interval for visible active-time accumulation. */
const ENGAGEMENT_TICK_MS = ENGAGEMENT_TIMING.ENGAGEMENT_TICK_MS;
/** Ordered time milestones used for engaged-time events. */
const ENGAGED_MS = ENGAGEMENT_TIMING.ENGAGED_MILESTONES_MS;
/** Window flag indicating the current runtime analytics gate. */
const RUNTIME_ANALYTICS_FLAG = RUNTIME_FLAGS.ANALYTICS_ALLOWED;
/** Maps named conversions to their stable Fathom event names. */
const CONVERSION_EVENT_MAP: Record<AnalyticsConversionKey, string> = {
  podcastEpisodeClick: "podcast_episode_click",
  podcastSeriesClick: "podcast_series_click",
  quizComplete: "quiz_complete",
  quizPass: "quiz_pass",
  quizStart: "quiz_start",
  searchResultClick: "search_result_click",
};

/** Minimal subset of the Fathom browser API used by this module. */
type FathomApi = {
  trackEvent?: (eventName: string) => void;
  trackGoal?: (goalId: string, valueInCents: number) => void;
  enableTrackingForMe?: () => void;
  blockTrackingForMe?: () => void;
};

/** Shared payload shape expected from search telemetry events. */
type SearchTelemetryDetail = {
  hasQuery: boolean;
  resultsCount: number;
  queryLength: number;
  tokenCount: number;
};

/** Shared payload shape expected from search result click events. */
type SearchResultClickDetail = {
  surface: string;
  positionBucket: "1-3" | "4-6" | "7+" | "unknown";
};

/** Shared payload shape expected from table-of-contents click events. */
type TocClickDetail = {
  sectionId: string;
  position: number;
};

/** Session-scoped journey descriptor persisted between page views. */
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
      trackConversion: (goalKey: AnalyticsConversionKey) => void;
      assignVariant: (experimentId: string, variants: ExperimentVariant[]) => string;
      isEnabled: () => boolean;
    };
  }
}

/** Guards against double initialization within the same page lifecycle. */
let initialized = false;

/** Normalizes outbound Fathom event names to a bounded, whitespace-clean string. */
const clampEventName = (value: string): string =>
  value.replace(/\s+/g, " ").trim().slice(0, ANALYTICS_LIMITS.EVENT_NAME_MAX_LENGTH);

/** Converts arbitrary labels into short analytics-safe slug fragments. */
const sanitizeToken = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, ANALYTICS_LIMITS.TOKEN_MAX_LENGTH) || "unknown";

/** Returns the current Melody Mind app identifier from the shell dataset. */
const getAnalyticsApp = (): AnalyticsApp | "unknown" => {
  const app = document.documentElement.dataset.analyticsApp;
  return ANALYTICS_APPS.includes(app as AnalyticsApp)
    ? (app as AnalyticsApp)
    : "unknown";
};

/**
 * Buckets current article scroll depth into a coarse range for context-sensitive
 * events such as share actions.
 */
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

/** Detects whether the browser currently advertises Do Not Track. */
const doNotTrackEnabled = (): boolean => {
  const navigatorValue = window.navigator?.doNotTrack;
  const windowValue = (window as Window & { doNotTrack?: string }).doNotTrack;
  const msValue = (window.navigator as Navigator & { msDoNotTrack?: string })
    .msDoNotTrack;
  return navigatorValue === "1" || windowValue === "1" || msValue === "1";
};

/** Returns whether persisted consent currently allows analytics. */
const hasConsent = (): boolean => {
  const consent = safeLocalStorage.get<{ essential?: boolean; analytics?: boolean }>(
    CONSENT_KEY,
    {}
  );
  return consent?.essential === true && consent?.analytics === true;
};

/**
 * Computes the effective analytics-enabled state for the current browser runtime.
 *
 * Tracking is only active when the runtime gate is enabled, consent allows
 * analytics, and Do Not Track is not enabled.
 */
const isAnalyticsEnabled = (): boolean =>
  window[RUNTIME_ANALYTICS_FLAG] === true && hasConsent() && !doNotTrackEnabled();

/**
 * Sends a normalized event to Fathom when analytics is enabled.
 *
 * Errors are swallowed intentionally because telemetry must remain non-critical.
 */
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

/** Sends a legacy goal conversion to Fathom when analytics is enabled. */
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

/** Tracks a named conversion as a stable Fathom event. */
const trackNamedConversion = (goalKey: AnalyticsConversionKey): void => {
  callFathomEvent(CONVERSION_EVENT_MAP[goalKey]);
};

/** Maps raw paths into a small vocabulary for journey transition analytics. */
const classifyPath = (path: string): string => {
  const app = getAnalyticsApp();
  const trimmedPath = path.replace(/\/+$/, "") || "/";
  const singleSegment = trimmedPath.split("/").filter(Boolean);
  const isEraPath =
    singleSegment.length === 1 && /^(19|20)\d0s$/i.test(singleSegment[0] || "");

  if (path === "/") {
    return "home";
  }

  if (trimmedPath === "/search") {
    return "search";
  }

  if (["/privacy", "/cookies", "/imprint"].includes(trimmedPath)) {
    return "legal";
  }

  if (app === "knowledge") {
    if (trimmedPath.startsWith("/knowledge/")) {
      return "article";
    }
    if (trimmedPath.startsWith("/taxonomy/")) {
      return "taxonomy";
    }
    if (trimmedPath.startsWith("/categories/")) {
      return "legacy-category";
    }
    if (trimmedPath === "/ai-content") {
      return "ai-content";
    }
    return "other";
  }

  if (app === "quiz") {
    if (isEraPath) {
      return "quiz-era";
    }
    if (trimmedPath.startsWith("/from-")) {
      return "quiz-journey";
    }
    if (singleSegment.length === 1) {
      return "quiz";
    }
    return "other";
  }

  if (app === "podcasts") {
    if (trimmedPath === "/podcast.xml") {
      return "feed";
    }
    if (isEraPath) {
      return "podcast-era";
    }
    if (singleSegment.length === 1) {
      return "podcast-episode";
    }
    return "other";
  }

  return "other";
};

/** Reads the previously stored journey step from session storage. */
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

/** Persists the current journey step for later cross-page comparison. */
const writeJourneyStep = (step: JourneyStep): void => {
  safeSessionStorage.set(JOURNEY_KEY, step);
};

/** Emits a journey transition event when page category changes between views. */
const trackJourney = (): void => {
  const path = window.location.pathname || "/";
  const currentKind = classifyPath(path);
  const previous = readJourneyStep();

  if (previous && previous.kind !== currentKind) {
    callFathomEvent(`Journey: ${previous.kind} to ${currentKind}`);
  }

  writeJourneyStep({ kind: currentKind, path });
};

/** Emits an article-view event when article analytics metadata is present. */
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

/**
 * Tracks quick exits and engaged-time milestones based on interaction and timers.
 *
 * The logic is intentionally approximate and optimized for low-noise analytics
 * rather than precise session replay semantics.
 */
const trackEngagement = (): void => {
  let hasInteraction = false;
  let bounceTracked = false;
  let engagedVisibleMs = 0;
  let lastInteractionAt = 0;
  let lastTickAt = Date.now();
  const interactionEvents = ["click", "keydown", "pointerdown", "touchstart", "scroll"];

  const trackBounce = () => {
    if (bounceTracked) {
      return;
    }

    bounceTracked = true;
    callFathomEvent("Bounce: quick leave");
  };

  const onInteraction = () => {
    hasInteraction = true;
    lastInteractionAt = Date.now();
  };

  const onVisibilityChange = () => {
    if (document.visibilityState === "hidden" && !hasInteraction) {
      trackBounce();
    }

    if (document.visibilityState === "visible") {
      lastTickAt = Date.now();
    }
  };

  const bounceTimer = window.setTimeout(() => {
    if (!hasInteraction) {
      trackBounce();
    }
  }, BOUNCE_MS);

  const engagementTimer = window.setInterval(() => {
    const now = Date.now();
    const delta = now - lastTickAt;
    lastTickAt = now;

    if (
      document.visibilityState !== "visible" ||
      !hasInteraction ||
      now - lastInteractionAt > ACTIVE_IDLE_MS
    ) {
      return;
    }

    engagedVisibleMs += delta;
    ENGAGED_MS.forEach((delay) => {
      if (engagedVisibleMs >= delay && engagedVisibleMs - delta < delay) {
        callFathomEvent(`Engaged time: ${Math.round(delay / 1000)}s`);
      }
    });
  }, ENGAGEMENT_TICK_MS);

  interactionEvents.forEach((eventName) => {
    window.addEventListener(eventName, onInteraction, { passive: true });
  });
  document.addEventListener("visibilitychange", onVisibilityChange);

  window.addEventListener(
    "beforeunload",
    () => {
      window.clearTimeout(bounceTimer);
      window.clearInterval(engagementTimer);
      interactionEvents.forEach((eventName) => {
        window.removeEventListener(eventName, onInteraction);
      });
      document.removeEventListener("visibilitychange", onVisibilityChange);
    },
    { once: true }
  );
};

/**
 * Infers a coarse click zone from DOM context for lightweight heatmap-style events.
 *
 * This intentionally avoids exact selector logging and instead groups clicks into
 * broad layout regions such as header, footer, search, article, or main.
 */
const inferClickZone = (target: HTMLElement): string => {
  const explicit = target.closest<HTMLElement>("[data-analytics-zone]")?.dataset
    .analyticsZone;
  if (explicit) {
    return explicit;
  }

  if (target.closest("header")) {
    return "header";
  }
  if (target.closest("footer")) {
    return "footer";
  }
  if (target.closest("[data-search-root]")) {
    return "search";
  }
  if (target.closest("#share-section")) {
    return "share";
  }
  if (target.closest(".reading-controls")) {
    return "reading-controls";
  }
  if (target.closest("#article-content")) {
    return "article";
  }
  if (target.closest("main")) {
    return "main";
  }
  return "other";
};

/** Emits at most one click event per inferred page zone. */
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

/** Tracks configured article read-depth milestones and emits each at most once. */
const trackReadingDepth = (): void => {
  const article = document.getElementById("article-content");
  if (!article) {
    return;
  }

  const milestones = [...READING_DEPTH_MILESTONES];
  const sentMilestones = new Set<number>();
  let ticking = false;

  const emitProgress = () => {
    const articleRect = article.getBoundingClientRect();
    const articleTop = window.scrollY + articleRect.top;
    const articleHeight = Math.max(article.scrollHeight, articleRect.height, 1);
    const viewportBottom = window.scrollY + window.innerHeight;
    const articleReadPx = Math.min(
      Math.max(viewportBottom - articleTop, 0),
      articleHeight
    );
    const depth = (articleReadPx / articleHeight) * 100;

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

/** Buckets search usage into a small set of query-length categories. */
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

/**
 * Subscribes to shared search events and emits deduplicated search usage metrics.
 *
 * The tracker records broad patterns like first use, query size buckets, zero-result
 * situations, and result-click buckets rather than every keystroke.
 */
const trackSearchMetrics = (): void => {
  let searchUsedTracked = false;
  const trackedLengthBuckets = new Set<string>();
  const emptyQueryResultSent = new Set<string>();
  const trackedResultClickBuckets = new Set<string>();

  window.addEventListener(SEARCH_EVENTS.PERFORMED, (event) => {
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

  window.addEventListener(SEARCH_EVENTS.RESULT_CLICK, (event) => {
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
    trackNamedConversion("searchResultClick");
  });
};

/**
 * Tracks higher-level custom browser events emitted by shared UI components.
 *
 * At the moment this covers TOC interaction buckets, but the separation keeps
 * structured event subscriptions distinct from raw DOM click listeners.
 */
const trackStructuredCustomEvents = (): void => {
  const seenTocBuckets = new Set<string>();

  window.addEventListener(TOC_EVENTS.CLICK, (event) => {
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

/** Parses `data-ab-variants` strings such as `control:1,variant:2`. */
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

/**
 * Applies DOM-driven A/B assignments and tracks first exposure per variant.
 *
 * Each matching node receives both a `data-ab-variant` attribute and a CSS class
 * based on the configured class prefix.
 */
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

/**
 * Exposes a tiny imperative analytics API on `window.mmAnalytics`.
 *
 * This is mainly for integration points that cannot import the module directly
 * but still need to trigger an event, conversion, goal, or experiment assignment.
 */
const setupCustomEventApi = (): void => {
  window.mmAnalytics = {
    trackEvent: (eventName: string) => {
      callFathomEvent(eventName);
    },
    trackGoal: (goalId: string, valueInCents: number) => {
      callFathomGoal(goalId, valueInCents);
    },
    trackConversion: (goalKey: AnalyticsConversionKey) => {
      trackNamedConversion(goalKey);
    },
    assignVariant: (experimentId: string, variants: ExperimentVariant[]) =>
      getOrAssignVariant(experimentId, variants),
    isEnabled: () => isAnalyticsEnabled(),
  };
};

/**
 * Tracks assorted UI interactions that do not justify their own dedicated module.
 *
 * These include consent actions, podcast CTAs, and share triggers.
 */
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

      if (target.closest("[data-cookie-action='accept']")) {
        callFathomEvent("Consent: accept analytics");
      }

      const podcastCta = target.closest<HTMLElement>("[data-analytics-podcast-target]");
      if (podcastCta) {
        const podcastTarget = sanitizeToken(
          podcastCta.dataset.analyticsPodcastTarget || "unknown"
        );
        callFathomEvent(`Podcast: click ${podcastTarget}`);
        if (podcastTarget === "episode") {
          trackNamedConversion("podcastEpisodeClick");
        } else if (podcastTarget === "series") {
          trackNamedConversion("podcastSeriesClick");
        }
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
};

/**
 * Boots the full client analytics runtime once per page lifecycle.
 *
 * Safe to call repeatedly; subsequent calls after the first are ignored.
 */
export function initClientAnalytics(): void {
  if (isServer || initialized) {
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
