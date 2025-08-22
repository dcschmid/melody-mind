/**
 * FeedbackOverlay Utility Module
 *
 * Optimized performance module for the feedback overlay functionality.
 * Separated from the main component for better code splitting and caching.
 *
 * Performance Optimizations:
 * - Cached DOM element references
 * - Debounced event handlers
 * - Efficient MutationObserver usage
 * - Memory leak prevention
 * - GPU-accelerated animations
 */

// Cache DOM elements to avoid repeated queries
let elementCache: { [key: string]: HTMLElement | null } = {};
let lastFocusedElement: HTMLElement | null = null;
let observers: MutationObserver[] = [];
let performanceObserver: PerformanceObserver | null = null;
let timeoutWarning: number | null = null;

// Performance monitoring configuration
const MODAL_TIMEOUT = 300000; // 5 minutes
const TIMEOUT_WARNING = 30000; // 30 seconds before timeout

/**
 * Cached DOM element getter with performance optimization
 * @param {string} id - Element ID to retrieve
 * @returns {T | null} HTMLElement or null
 */
function getCachedElement<T extends HTMLElement = HTMLElement>(id: string): T | null {
  if (!elementCache[id]) {
    elementCache[id] = document.getElementById(id);
  }
  return elementCache[id] as T | null;
}

/**
 * Performance-optimized debounce function
 * @param {T} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {T} Debounced function
 */
function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(func: T, wait: number): T {
  let timeoutId: number;
  return ((...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => func(...args), wait);
  }) as T;
}

/**
 * GPU-accelerated show overlay animation
 * @param {HTMLElement} overlay - Overlay element
 * @param {HTMLElement} overlayContent - Content element
 */
function showOverlayOptimized(overlay: HTMLElement, overlayContent: HTMLElement): void {
  // Force GPU layer creation for smooth animations
  overlayContent.style.willChange = "transform, opacity";
  overlayContent.style.transform = "translateZ(0)";

  // Reset scroll position efficiently
  overlayContent.scrollTop = 0;

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    // Reset will-change after animation completes
    setTimeout(() => {
      overlayContent.style.willChange = "auto";
    }, 50);
    return;
  }

  // Use requestAnimationFrame for smooth 60fps animation
  requestAnimationFrame(() => {
    overlayContent.style.opacity = "0";
    overlayContent.style.transform = "translateY(10px) scale(0.98) translateZ(0)";

    requestAnimationFrame(() => {
      overlayContent.style.transition =
        "opacity 300ms cubic-bezier(0.25, 0.1, 0.25, 1), transform 300ms cubic-bezier(0.25, 0.1, 0.25, 1)";
      overlayContent.style.opacity = "1";
      overlayContent.style.transform = "translateY(0) scale(1) translateZ(0)";

      // Clean up after animation
      setTimeout(() => {
        overlayContent.style.willChange = "auto";
        overlayContent.style.transition = "";
      }, 350);
    });
  });
}

/**
 * Optimized overlay hide function with focus restoration
 */
function hideOverlayOptimized(): void {
  const overlay = getCachedElement("overlay");
  if (!overlay) {
    return;
  }

  measurePerformance("hide-overlay", () => {
    // Hide overlay
    overlay.classList.add("hidden");

    // Clear timeout monitoring
    clearModalTimeout();

    // Restore body scroll
    document.body.style.overflow = "";

    // Restore focus to last focused element
    if (lastFocusedElement && document.contains(lastFocusedElement)) {
      setTimeout(() => {
        (lastFocusedElement as HTMLElement)?.focus();
        lastFocusedElement = null;
      }, 100);
    }
  });
}

/**
 * Optimized close and advance function
 */
function closeAndAdvanceOptimized(): void {
  const overlay = getCachedElement("overlay");
  const nextRoundBtn = getCachedElement<HTMLButtonElement>("next-round-button");

  if (!overlay) {
    return;
  }

  if (nextRoundBtn) {
    // Hide overlay first for immediate feedback
    overlay.classList.add("hidden");
    document.body.style.overflow = "";

    // Trigger next button with minimal delay
    setTimeout(() => {
      nextRoundBtn.click();
    }, 50);
  } else {
    hideOverlayOptimized();
  }
}

/**
 * Optimized keyboard navigation with efficient focus trapping
 * @param {KeyboardEvent} event - Keyboard event
 * @param {HTMLElement} overlay - Overlay element
 */
function handleKeyboardNavigation(event: KeyboardEvent, overlay: HTMLElement): void {
  // Only handle when overlay is visible
  if (overlay.classList.contains("hidden")) {
    return;
  }

  switch (event.key) {
    case "Escape":
      closeAndAdvanceOptimized();
      break;
    case "Tab":
      trapFocusOptimized(event, overlay);
      break;
  }
}

/**
 * Optimized focus trap with cached focusable elements
 * @param {KeyboardEvent} event - Keyboard event
 * @param {HTMLElement} overlay - Overlay container
 */
function trapFocusOptimized(event: KeyboardEvent, overlay: HTMLElement): void {
  const focusableElements = getFocusableElementsOptimized(overlay);

  if (focusableElements.length === 0) {
    return;
  }

  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  if (event.shiftKey && document.activeElement === firstFocusable) {
    event.preventDefault();
    lastFocusable.focus();
  } else if (!event.shiftKey && document.activeElement === lastFocusable) {
    event.preventDefault();
    firstFocusable.focus();
  }
}

/**
 * Optimized focusable elements getter with caching
 * @param {HTMLElement} container - Container to search within
 * @returns {HTMLElement[]} Array of focusable elements
 */
function getFocusableElementsOptimized(container: HTMLElement): HTMLElement[] {
  const focusableSelector =
    'a[href]:not([disabled]),button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),video[controls],audio[controls],[tabindex]:not([tabindex="-1"])';

  const elements = Array.from(container.querySelectorAll<HTMLElement>(focusableSelector));

  // Use efficient filtering with single style computation
  return elements.filter((el) => {
    const style = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return (
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      style.opacity !== "0" &&
      rect.width > 0 &&
      rect.height > 0
    );
  });
}

/**
 * Optimized album cover error handling with progressive enhancement
 * @param {HTMLImageElement} albumCover - Album cover image element
 */
function setupAlbumCoverOptimized(albumCover: HTMLImageElement): void {
  // Use passive listener for better performance
  albumCover.addEventListener(
    "error",
    () => {
      albumCover.src = "/default-cover.jpg";
      albumCover.alt = "Album cover not available";
      albumCover.style.display = "";
      albumCover.classList.remove("hidden");
    },
    { passive: true }
  );

  // Add loading state optimization
  if ("loading" in HTMLImageElement.prototype) {
    albumCover.loading = "lazy";
  }
}

/**
 * Optimized accessibility announcements with debouncing
 */
function setupAccessibilityOptimized(): void {
  const feedbackElement = getCachedElement("feedback");
  const statusAnnouncer = getCachedElement("feedback-status-announcer");

  if (!feedbackElement || !statusAnnouncer) {
    return;
  }

  // Debounced announcement function
  const debouncedAnnounce = debounce((announcement: string) => {
    statusAnnouncer.textContent = announcement;
    setTimeout(() => {
      statusAnnouncer.textContent = "";
    }, 3000);
  }, 150);

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === "childList" ||
        mutation.type === "characterData" ||
        mutation.type === "attributes"
      ) {
        const feedbackText = feedbackElement.textContent?.trim() || "";
        const isCorrect = feedbackElement.classList.contains("correct");
        const isIncorrect = feedbackElement.classList.contains("incorrect");

        let announcement = feedbackText;
        if (isCorrect) {
          announcement = `Correct: ${feedbackText}`;
        } else if (isIncorrect) {
          announcement = `Incorrect: ${feedbackText}`;
        }

        if (announcement) {
          debouncedAnnounce(announcement);
        }
      }
    });
  });

  observer.observe(feedbackElement, {
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: ["class"],
    subtree: true,
  });

  observers.push(observer);
}

/**
 * Optimized cleanup function to prevent memory leaks
 */
function cleanupOptimized(): void {
  // Disconnect all observers
  observers.forEach((observer) => observer.disconnect());
  observers = [];

  // Clear element cache
  elementCache = {};

  // Stop audio if playing
  const audioPlayer = getCachedElement<HTMLAudioElement>("audio-preview");
  if (audioPlayer) {
    audioPlayer.pause();
    audioPlayer.removeAttribute("src");
    audioPlayer.load();
  }

  // Clear focus reference
  lastFocusedElement = null;
}

/**
 * Initialize performance monitoring for the feedback overlay
 */
function initializePerformanceMonitoring(): void {
  if ("PerformanceObserver" in window && !performanceObserver) {
    try {
      performanceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          // Monitor long tasks that could impact overlay performance
          if (entry.entryType === "longtask" && entry.duration > 50) {
            console.warn("Long task detected in FeedbackOverlay:", {
              duration: entry.duration,
              startTime: entry.startTime,
              name: entry.name,
            });
          }

          // Monitor measure entries for custom performance metrics
          if (entry.entryType === "measure" && entry.name.startsWith("feedbackOverlay")) {
            if (entry.duration > 100) {
              console.warn("Slow FeedbackOverlay operation:", {
                operation: entry.name,
                duration: entry.duration,
              });
            }
          }
        }
      });

      // Observe performance entries
      performanceObserver.observe({
        entryTypes: ["longtask", "measure"],
        buffered: true,
      });
    } catch (error) {
      console.warn("Performance monitoring not available:", error);
    }
  }
}

/**
 * Start modal timeout monitoring
 */
function startModalTimeout(): void {
  if (timeoutWarning) {
    clearTimeout(timeoutWarning);
  }

  timeoutWarning = window.setTimeout(() => {
    announceTimeout();
  }, MODAL_TIMEOUT - TIMEOUT_WARNING);
}

/**
 * Clear modal timeout
 */
function clearModalTimeout(): void {
  if (timeoutWarning) {
    clearTimeout(timeoutWarning);
    timeoutWarning = null;
  }
}

/**
 * Announce timeout warning to users
 */
function announceTimeout(): void {
  const announcer = getCachedElement("feedback-status-announcer");
  if (announcer) {
    announcer.textContent =
      "Session will timeout in 30 seconds. Please interact with the modal to continue.";

    // Auto-close after warning period
    setTimeout(() => {
      hideOverlayOptimized();
    }, TIMEOUT_WARNING);
  }
}

/**
 * Performance measurement wrapper for critical operations
 */
function measurePerformance<T>(name: string, operation: () => T): T {
  const measureName = `feedbackOverlay-${name}`;
  performance.mark(`${measureName}-start`);

  try {
    const result = operation();
    performance.mark(`${measureName}-end`);
    performance.measure(measureName, `${measureName}-start`, `${measureName}-end`);
    return result;
  } catch (error) {
    performance.mark(`${measureName}-error`);
    performance.measure(`${measureName}-error`, `${measureName}-start`, `${measureName}-error`);
    throw error;
  }
}

/**
 * Main initialization function with performance optimizations
 */
export function initializeFeedbackOverlayOptimized(): void {
  // Early return if already initialized
  if (elementCache["overlay"]) {
    return;
  }

  const overlay = getCachedElement("overlay");
  const overlayContent =
    getCachedElement("overlay__content") ||
    (overlay?.querySelector(".overlay__content") as HTMLElement);

  if (!overlay || !overlayContent) {
    console.error("FeedbackOverlay: Required elements not found");
    return;
  }

  // Cache all required elements upfront
  getCachedElement("overlay-backdrop");
  getCachedElement("close-overlay-button");
  getCachedElement("next-round-button");
  getCachedElement("overlay-cover");

  // Set up optimized visibility handling
  setupVisibilityOptimized(overlay, overlayContent);

  // Set up optimized event listeners
  setupEventListenersOptimized();

  // Set up keyboard navigation
  document.addEventListener("keydown", (event) => handleKeyboardNavigation(event, overlay), {
    passive: false,
  });

  // Set up enhanced keyboard navigation with additional shortcuts
  setupEnhancedKeyboardNavigation();

  // Set up accessibility
  setupAccessibilityOptimized();

  // Set up album cover handling
  const albumCover = getCachedElement<HTMLImageElement>("overlay-cover");
  if (albumCover) {
    setupAlbumCoverOptimized(albumCover);
  }

  // Set up cleanup handlers
  document.addEventListener("astro:before-swap", cleanupOptimized, { once: true });
  document.addEventListener("astro:after-swap", cleanupOptimized, { once: true });

  // Initialize performance monitoring
  initializePerformanceMonitoring();
}

/**
 * Optimized visibility handling with efficient MutationObserver
 * @param {HTMLElement} overlay - Overlay element
 * @param {HTMLElement} overlayContent - Content element
 */
function setupVisibilityOptimized(overlay: HTMLElement, overlayContent: HTMLElement): void {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "attributes" && mutation.attributeName === "class") {
        const isVisible = !overlay.classList.contains("hidden");

        if (isVisible) {
          measurePerformance("show-overlay", () => {
            lastFocusedElement = document.activeElement as HTMLElement;
            showOverlayOptimized(overlay, overlayContent);
            document.body.style.overflow = "hidden";
            startModalTimeout(); // Start timeout monitoring
          });

          // Set focus after animation starts
          setTimeout(() => {
            const closeButton = getCachedElement("close-overlay-button");
            closeButton?.focus();
          }, 100);
        } else {
          clearModalTimeout(); // Clear timeout when overlay is hidden
        }
      }
    });
  });

  observer.observe(overlay, {
    attributes: true,
    attributeFilter: ["class"],
  });

  observers.push(observer);
}

/**
 * Optimized event listeners setup with passive listeners where possible
 */
function setupEventListenersOptimized(): void {
  const closeButton = getCachedElement("close-overlay-button");
  const overlayBackdrop = getCachedElement("overlay-backdrop");
  const nextButton = getCachedElement("next-round-button");

  if (closeButton) {
    closeButton.addEventListener(
      "click",
      (e) => {
        e.preventDefault();
        closeAndAdvanceOptimized();
      },
      { passive: false }
    );
  }

  if (overlayBackdrop) {
    overlayBackdrop.addEventListener(
      "click",
      (e) => {
        e.preventDefault();
        hideOverlayOptimized();
      },
      { passive: false }
    );
  }

  if (nextButton) {
    nextButton.addEventListener("click", hideOverlayOptimized, { passive: true });
  }
}

/**
 * Enhanced error handling and announcements
 * Provides comprehensive error reporting and screen reader announcements
 */
function announceError(message: string): void {
  const announcer = getCachedElement("feedback-status-announcer");
  if (announcer) {
    announcer.textContent = `Error: ${message}`;

    // Clear announcement after 5 seconds
    setTimeout(() => {
      if (announcer.textContent?.startsWith("Error:")) {
        announcer.textContent = "";
      }
    }, 5000);
  }

  // Also log to console for debugging
  console.error("FeedbackOverlay Error:", message);
}

/**
 * Enhanced success announcements
 * Provides positive feedback to screen readers
 */
function announceSuccess(message: string): void {
  const announcer = getCachedElement("feedback-status-announcer");
  if (announcer) {
    announcer.textContent = message;

    // Clear announcement after 3 seconds
    setTimeout(() => {
      announcer.textContent = "";
    }, 3000);
  }
}

/**
 * Enhanced keyboard navigation with additional shortcuts
 * Supports Space for audio playback, Enter for next round, and enhanced focus management
 */
function setupEnhancedKeyboardNavigation(): void {
  const overlay = getCachedElement("overlay");
  if (!overlay) {
    return;
  }

  document.addEventListener(
    "keydown",
    (event: KeyboardEvent) => {
      // Only handle when overlay is visible
      if (overlay.classList.contains("hidden")) {
        return;
      }

      // Prevent handling when user is typing in form elements
      const activeElement = document.activeElement;
      if (
        activeElement &&
        (activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA" ||
          activeElement.tagName === "SELECT")
      ) {
        return;
      }

      switch (event.key) {
        case "Escape":
          event.preventDefault();
          announceSuccess("Overlay closed with Escape key");
          hideOverlayOptimized();
          break;

        case " ": { // Space
          event.preventDefault();
          const audioPlayer = getCachedElement<HTMLAudioElement>("audio-preview");
          if (audioPlayer) {
            if (audioPlayer.paused) {
              audioPlayer
                .play()
                .then(() => announceSuccess("Audio playback started"))
                .catch(() => announceError("Audio playback failed"));
            } else {
              audioPlayer.pause();
              announceSuccess("Audio playback paused");
            }
          }
          break;
        }
        case "Enter":
          // Only trigger next round if no specific element is focused
          if (!activeElement || activeElement === document.body) {
            event.preventDefault();
            const nextButton = getCachedElement<HTMLButtonElement>("next-round-button");
            if (nextButton && !nextButton.disabled) {
              announceSuccess("Moving to next round");
              hideOverlayOptimized();
              nextButton.click();
            }
          }
          break;

        case "Tab":
          // Enhanced focus trap
          trapFocusOptimized(event, overlay);
          break;

        case "ArrowDown":
        case "ArrowUp":
          // Navigate between focusable elements with arrow keys
          event.preventDefault();
          navigateFocusableElements(event.key === "ArrowDown" ? 1 : -1);
          break;

        case "Home":
          event.preventDefault();
          focusFirstElement();
          break;

        case "End":
          event.preventDefault();
          focusLastElement();
          break;
      }
    },
    { passive: false }
  );
}

/**
 * Navigate between focusable elements using arrow keys
 */
function navigateFocusableElements(direction: 1 | -1): void {
  const overlay = getCachedElement("overlay");
  if (!overlay) {
    return;
  }

  const focusableElements = getFocusableElementsOptimized(overlay);
  const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement);

  if (currentIndex === -1) {
    // No element focused, focus first
    focusableElements[0]?.focus();
    return;
  }

  const nextIndex = currentIndex + direction;
  if (nextIndex >= 0 && nextIndex < focusableElements.length) {
    focusableElements[nextIndex].focus();
    announceNavigationPosition(nextIndex + 1, focusableElements.length);
  }
}

/**
 * Focus the first focusable element
 */
function focusFirstElement(): void {
  const overlay = getCachedElement("overlay");
  if (!overlay) {
    return;
  }

  const focusableElements = getFocusableElementsOptimized(overlay);
  focusableElements[0]?.focus();
  announceNavigationPosition(1, focusableElements.length);
}

/**
 * Focus the last focusable element
 */
function focusLastElement(): void {
  const overlay = getCachedElement("overlay");
  if (!overlay) {
    return;
  }

  const focusableElements = getFocusableElementsOptimized(overlay);
  const lastElement = focusableElements[focusableElements.length - 1];
  lastElement?.focus();
  announceNavigationPosition(focusableElements.length, focusableElements.length);
}

/**
 * Announce current navigation position to screen readers
 */
function announceNavigationPosition(current: number, total: number): void {
  const announcer = getCachedElement("feedback-status-announcer");
  if (announcer) {
    announcer.textContent = `Element ${current} of ${total}`;
    setTimeout(() => {
      announcer.textContent = "";
    }, 2000);
  }
}
