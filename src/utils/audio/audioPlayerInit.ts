/**
 * Audio Player Initialization Script
 *
 * Handles the initialization of audio players with enhanced accessibility features
 * and modern performance optimizations including Intersection Observer for lazy loading.
 */

declare global {
  interface Window {
    IntersectionObserver: typeof IntersectionObserver;
    requestIdleCallback: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
  }
}

interface IdleRequestOptions {
  timeout?: number;
}

type IdleRequestCallback = (deadline: IdleDeadline) => void;

interface IdleDeadline {
  readonly didTimeout: boolean;
  timeRemaining(): number;
}

/**
 * Initialize audio player when ready
 * @param {string} playerId - The unique ID of the audio player to initialize
 */
export function initializeWhenReady(playerId: string): void {
  // Import the TypeScript audio player implementation dynamically
  import("./audioPlayer.js")
    .then(({ initializePlayer, initializeAllPlayers }) => {
      // Find the current player instance
      const currentPlayer = document.getElementById(playerId);
      if (currentPlayer) {
        initializePlayer(playerId);
        return true;
      } else {
        // Fallback: Initialize all players on the page
        initializeAllPlayers();
        return true;
      }
    })
    .catch((error: Error) => {
      console.error("Failed to load audio player:", error);
    });
}

/**
 * Initialize audio players with modern performance enhancements
 * @param {string} playerId - The unique ID of the primary audio player
 */
export function initializeAudioPlayers(playerId: string): void {
  // Modern Performance Enhancement: Intersection Observer for lazy initialization
  const playerContainers = document.querySelectorAll('[id^="audio-player-"]');

  if ("IntersectionObserver" in window && playerContainers.length > 0) {
    const audioPlayerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const container = entry.target as HTMLElement;
            const containerId = container.id;
            if (containerId && typeof containerId === "string") {
              // Initialize player when it becomes visible
              import("./audioPlayer.js")
                .then(({ initializePlayer }) => {
                  initializePlayer(containerId);
                  // Stop observing once initialized
                  audioPlayerObserver.unobserve(container);
                  return true;
                })
                .catch((error: Error) => {
                  console.error("Failed to load audio player:", error);
                });
            }
          }
        });
      },
      {
        rootMargin: "100px", // Start loading 100px before the element is visible
        threshold: 0.1, // Trigger when 10% of the element is visible
      }
    );

    // Observe all player containers for lazy initialization
    playerContainers.forEach((container) => {
      audioPlayerObserver.observe(container);
    });

    // Add preconnect hints for better audio loading performance
    const audioSources = Array.from(playerContainers)
      .map((container) => container.getAttribute("data-audio-src"))
      .filter(Boolean) as string[];

    audioSources.forEach((audioSrc) => {
      if (audioSrc) {
        try {
          const url = new URL(audioSrc);
          // Only add preconnect for external domains
          if (url.origin !== window.location.origin) {
            const link = document.createElement("link");
            link.rel = "preconnect";
            link.href = url.origin;
            link.crossOrigin = "anonymous";
            document.head.appendChild(link);
          }
        } catch {
          // Ignore invalid URLs
        }
      }
    });
  } else {
    // Fallback: Progressive enhancement with requestIdleCallback
    if ("requestIdleCallback" in window) {
      requestIdleCallback(() => initializeWhenReady(playerId), { timeout: 1000 });
    } else {
      // Final fallback for older browsers
      setTimeout(() => initializeWhenReady(playerId), 0);
    }
  }
}
