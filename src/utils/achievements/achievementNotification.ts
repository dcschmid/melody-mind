/**
 * Achievement Notification System
 *
 * Contains logic for displaying achievement notifications.
 * Optimized for performance and accessibility.
 */

import type { AchievementEvent } from "../../types/achievement";
import { useTranslations } from "../i18n";

import { subscribeToAchievementEvents } from "./achievementEvents";

/**
 * Type definitions for notification elements, states, and settings
 */
type NotificationElements = {
  notification: HTMLElement;
  title: HTMLElement;
  description: HTMLElement;
  category: HTMLElement;
  sound: HTMLAudioElement;
  closeButton: HTMLElement | null;
  pauseButton: HTMLElement | null;
  soundToggleButton: HTMLElement | null;
  timerProgress: HTMLElement | null;
  a11ySettings: HTMLElement | null;
};

type AccessibilitySettings = {
  displayTime: number;
  enableSound: boolean;
  minDisplayTime: number;
  maxDisplayTime: number;
  displayTimeStep: number;
  prefersReducedMotion: boolean;
};

type NotificationState = {
  lastFocusedElement: HTMLElement | null;
  hideTimeout: number | null;
  isPaused: boolean;
  isMuted: boolean;
  currentTimerAnimation: Animation | null;
  eventUnsubscriber: (() => void) | null;
};

type NotificationHandlers = {
  showNotification: (event: AchievementEvent) => void;
  hideNotification: () => void;
  setupFocusTrap: () => void;
  removeFocusTrap: () => void;
  trapFocus: (event: FocusEvent) => void;
  handleKeyDown: (event: KeyboardEvent) => void;
  updateTimerProgress: () => void;
  togglePause: () => void;
  toggleSound: () => void;
  cleanup: () => void;
};

/**
 * Icon names for astro-icon components
 * Using centralized icon system for better maintainability
 */
const ICON_NAMES = {
  pause: "pause",
  play: "play",
  volume: "volume-2",
  mute: "volume-x",
};

/**
 * Updates icon using data attribute for astro-icon integration
 * @param {HTMLElement} element - Target element to update
 * @param {string} iconName - Icon name from the icon set
 * @returns {void}
 */
function updateIcon(element: HTMLElement, iconName: string): void {
  // Update the data-icon attribute for astro-icon components
  element.setAttribute("data-icon", iconName);

  // If the element has astro-icon class, trigger re-render
  if (element.classList.contains("astro-icon")) {
    element.setAttribute("name", iconName);
  }
}

/**
 * Gets all required DOM elements for notifications
 */
function getNotificationElements(): NotificationElements | null {
  const notification = document.getElementById("achievement-notification");
  const title = document.getElementById("achievement-title");
  const description = document.getElementById("achievement-description");
  const category = document.getElementById("achievement-category");
  const sound = document.getElementById("achievement-sound") as HTMLAudioElement;
  const closeButton = document.getElementById("achievement-close");
  const pauseButton = document.getElementById("achievement-pause");
  const soundToggleButton = document.getElementById("achievement-sound-toggle");
  const timerProgress = document.getElementById("notification-timer");
  const a11ySettings = document.getElementById("achievement-a11y-settings");

  // Ensure all essential elements are present
  if (!notification || !title || !description || !category) {
    return null;
  }

  return {
    notification,
    title,
    description,
    category,
    sound,
    closeButton,
    pauseButton,
    soundToggleButton,
    timerProgress,
    a11ySettings,
  };
}

/**
 * Extracts accessibility settings from the DOM
 */
function getAccessibilitySettings(a11ySettings: HTMLElement | null): AccessibilitySettings {
  // Default values
  let displayTime = 5000;
  let enableSound = true;
  let minDisplayTime = 3000;
  let maxDisplayTime = 10000;
  let displayTimeStep = 1000;

  // Override with DOM settings if available
  if (a11ySettings) {
    displayTime = parseInt(a11ySettings.getAttribute("data-display-time") || "5000", 10);
    enableSound = a11ySettings.getAttribute("data-enable-sound") === "true";
    minDisplayTime = parseInt(a11ySettings.getAttribute("data-display-time-min") || "3000", 10);
    maxDisplayTime = parseInt(a11ySettings.getAttribute("data-display-time-max") || "10000", 10);
    displayTimeStep = parseInt(a11ySettings.getAttribute("data-display-time-step") || "1000", 10);
  }

  // Check preference for reduced motion
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return {
    displayTime,
    enableSound,
    minDisplayTime,
    maxDisplayTime,
    displayTimeStep,
    prefersReducedMotion,
  };
}

/**
 * Creates the initial state for notifications
 */
function createInitialState(settings: AccessibilitySettings): NotificationState {
  return {
    lastFocusedElement: null,
    hideTimeout: null,
    isPaused: false,
    isMuted: !settings.enableSound,
    currentTimerAnimation: null,
    eventUnsubscriber: null,
  };
}

/**
 * Creates handlers for timer animation
 * @param {NotificationElements} elements - DOM elements
 * @param {NotificationState} state - Current state
 * @param {AccessibilitySettings} settings - Accessibility settings
 * @returns {() => void} Timer animation function
 */
function createTimerHandlers(
  elements: NotificationElements,
  state: NotificationState,
  settings: AccessibilitySettings
): () => void {
  /**
   * Creates and starts a timer animation
   * Uses optimized performance techniques including GPU acceleration
   * @returns {void}
   */
  const createTimerAnimation = (): void => {
    if (!elements.timerProgress) {
      return;
    }

    // Cancel any existing animation
    if (state.currentTimerAnimation) {
      state.currentTimerAnimation.cancel();
    }

    // Get the timer element with null check
    const timerElement = elements.timerProgress;
    if (!timerElement) {
      return;
    }

    // Apply optimizations for high-performance animations
    const performanceOptimizations = (): void => {
      // Enable GPU acceleration only during animation
      timerElement.style.willChange = "transform";

      // Add composited layer hint for better rendering performance
      timerElement.style.transform = "translateZ(0)";
    };

    // Apply optimizations before animation starts
    performanceOptimizations();

    // Animation configuration using translateX for GPU acceleration
    const keyframes = [{ transform: "translateX(0%)" }, { transform: "translateX(-100%)" }];

    const animationOptions = {
      duration: settings.displayTime,
      easing: "linear",
      fill: "forwards" as FillMode,
    };

    // Create and store the animation
    state.currentTimerAnimation = timerElement.animate(keyframes, animationOptions);

    // Apply reduced motion preferences if needed
    if (settings.prefersReducedMotion) {
      state.currentTimerAnimation.updatePlaybackRate(3.0);
    }

    // Pause if state is already paused
    if (state.isPaused && state.currentTimerAnimation) {
      state.currentTimerAnimation.pause();
    }

    // Release GPU resources when animation completes or is interrupted
    const cleanupResources = (): void => {
      // Reset optimizations when no longer needed
      timerElement.style.willChange = "auto";
      timerElement.style.transform = "";
    };

    // Cleanup on animation finish
    state.currentTimerAnimation.onfinish = cleanupResources;

    // Also cleanup on animation cancel
    state.currentTimerAnimation.oncancel = cleanupResources;
  };

  return createTimerAnimation;
}

/**
 * Creates handlers for audio functionality
 * @param {NotificationElements} elements - DOM elements
 * @param {NotificationState} state - Current state
 * @param {AccessibilitySettings} settings - Accessibility settings
 * @returns {() => void} Audio playback function
 */
function createAudioHandlers(
  elements: NotificationElements,
  state: NotificationState,
  settings: AccessibilitySettings
): () => void {
  /**
   * Prepares audio for optimal playback
   * @returns {void}
   */
  const prepareAudio = (): void => {
    if (!elements.sound) {
      return;
    }

    // Configure sound
    elements.sound.volume = 0.7;
    elements.sound.currentTime = 0;

    // Use preload attribute for better performance
    elements.sound.preload = "metadata";
  };

  /**
   * Plays the achievement notification sound with error handling
   * @returns {void}
   */
  const playSound = (): void => {
    if (
      !elements.sound ||
      !settings.enableSound ||
      settings.prefersReducedMotion ||
      state.isMuted
    ) {
      return;
    }

    // Prepare audio before playing
    prepareAudio();

    try {
      const playPromise = elements.sound.play();

      if (playPromise !== undefined) {
        playPromise.catch((error: Error) => {
          console.warn("Sound playback prevented:", error);
        });
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.warn("Error during sound playback:", errorMessage);
    }
  };

  return playSound;
}

/**
 * Creates handlers for focus management
 * @param {NotificationElements} elements - DOM elements
 * @param {NotificationHandlers} handlers - Notification handlers
 * @returns {Object} Focus management functions
 */
function createFocusHandlers(
  elements: NotificationElements,
  handlers: { hideNotification: () => void }
): {
  setupFocusTrap: () => void;
  removeFocusTrap: () => void;
  trapFocus: (event: FocusEvent) => void;
  handleKeyDown: (event: KeyboardEvent) => void;
} {
  /**
   * Traps focus within the notification
   */
  const trapFocus = (event: FocusEvent): void => {
    if (
      elements.notification.classList.contains("achievement-notification--visible") &&
      event.target instanceof Node &&
      !elements.notification.contains(event.target)
    ) {
      // Keep focus within the notification
      event.stopPropagation();
      elements.closeButton?.focus();
    }
  };

  /**
   * Handles keyboard navigation within the notification
   */
  const handleKeyDown = (event: KeyboardEvent): void => {
    // Process only when notification is visible
    if (!elements.notification.classList.contains("achievement-notification--visible")) {
      return;
    }

    // ESC key to close
    if (event.key === "Escape") {
      handlers.hideNotification();
      event.preventDefault();
      return;
    }

    // TAB key for focus trap
    if (event.key === "Tab") {
      // Find focusable elements within the notification
      const focusableElements = elements.notification.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      // SHIFT+TAB navigates backwards
      if (event.shiftKey) {
        // If at first element, go to last element
        if (document.activeElement === firstElement) {
          lastElement.focus();
          event.preventDefault();
        }
      } else {
        // TAB navigates forward
        // If at last element, go to first element
        if (document.activeElement === lastElement) {
          firstElement.focus();
          event.preventDefault();
        }
      }
    }
  };

  /**
   * Sets up a focus trap for the notification
   */
  const setupFocusTrap = (): void => {
    document.addEventListener("focusin", trapFocus);
    document.addEventListener("keydown", handleKeyDown);
  };

  /**
   * Removes the focus trap
   */
  const removeFocusTrap = (): void => {
    document.removeEventListener("focusin", trapFocus);
    document.removeEventListener("keydown", handleKeyDown);
  };

  return {
    setupFocusTrap,
    removeFocusTrap,
    trapFocus,
    handleKeyDown,
  };
}

/**
 * Creates the showNotification handler
 * @param {NotificationElements} elements - DOM elements
 * @param {NotificationState} state - Current state
 * @param {AccessibilitySettings} settings - Accessibility settings
 * @param {() => void} createTimerAnimation - Timer animation function
 * @param {() => void} playSound - Audio playback function
 * @param {Object} focusHandlers - Focus management handlers
 * @returns {(event: AchievementEvent) => void} Show notification function
 */
function createShowNotificationHandler(
  elements: NotificationElements,
  state: NotificationState,
  settings: AccessibilitySettings,
  createTimerAnimation: () => void,
  playSound: () => void,
  focusHandlers: { setupFocusTrap: () => void },
  hideNotification: () => void
): (event: AchievementEvent) => void {
  return (event: AchievementEvent): void => {
    // Update notification content in batch to minimize reflows
    requestAnimationFrame(() => {
      elements.title.textContent = event.achievement.name;
      elements.description.textContent = event.achievement.description;
      elements.category.textContent = event.achievement.category?.code.toUpperCase() || "";
    });

    // Store current focus for later restoration
    state.lastFocusedElement = document.activeElement as HTMLElement;

    // Display notification with slight delay for better animation
    requestAnimationFrame(() => {
      elements.notification.classList.add("achievement-notification--visible");

      // Update ARIA attributes for better accessibility
      elements.notification.setAttribute("aria-hidden", "false");

      // Set focus on notification for screen reader announcement
      elements.notification.setAttribute("tabindex", "-1");
      elements.notification.focus();

      // Set up focus trap
      focusHandlers.setupFocusTrap();
    });

    // Play sound if enabled and available
    playSound();

    // Auto-hide after configured time
    if (state.hideTimeout) {
      clearTimeout(state.hideTimeout);
    }

    state.hideTimeout = window.setTimeout(() => {
      hideNotification();
    }, settings.displayTime);

    // Create and start timer animation
    createTimerAnimation();
  };
}

/**
 * Creates the hideNotification handler
 * @param {NotificationElements} elements - DOM elements
 * @param {NotificationState} state - Current state
 * @param {Object} focusHandlers - Focus management handlers
 * @returns {() => void} Hide notification function
 */
function createHideNotificationHandler(
  elements: NotificationElements,
  state: NotificationState,
  focusHandlers: { removeFocusTrap: () => void }
): () => void {
  return (): void => {
    elements.notification.classList.remove("achievement-notification--visible");
    elements.notification.setAttribute("aria-hidden", "true");

    // Remove focus trap
    focusHandlers.removeFocusTrap();

    // Reset focus to previous element
    if (state.lastFocusedElement && typeof state.lastFocusedElement.focus === "function") {
      state.lastFocusedElement.focus();
    }

    // Clean up timeout and animation
    if (state.hideTimeout) {
      clearTimeout(state.hideTimeout);
      state.hideTimeout = null;
    }

    if (state.currentTimerAnimation) {
      state.currentTimerAnimation.cancel();
      state.currentTimerAnimation = null;

      // Release GPU resources
      if (elements.timerProgress) {
        elements.timerProgress.style.willChange = "auto";
        elements.timerProgress.style.transform = "";
      }
    }
  };
}

/**
 * Creates the togglePause handler
 * @param {NotificationElements} elements - DOM elements
 * @param {NotificationState} state - Current state
 * @param {AccessibilitySettings} settings - Accessibility settings
 * @param {Function} t - Translation function
 * @param {() => void} hideNotification - Hide notification function
 * @returns {() => void} Toggle pause function
 */
function createTogglePauseHandler(
  elements: NotificationElements,
  state: NotificationState,
  settings: AccessibilitySettings,
  t: (key: string) => string,
  hideNotification: () => void
): () => void {
  return (): void => {
    state.isPaused = !state.isPaused;

    if (state.isPaused) {
      // Pause timer and stop timeout
      if (state.currentTimerAnimation) {
        state.currentTimerAnimation.pause();
      }

      if (state.hideTimeout) {
        clearTimeout(state.hideTimeout);
        state.hideTimeout = null;
      }

      // Update pause button icon using the optimized icon update function
      if (elements.pauseButton) {
        updateIcon(elements.pauseButton, ICON_NAMES.play);
        elements.pauseButton.setAttribute("aria-label", t("achievements.notification.resume"));
        elements.pauseButton.setAttribute("title", t("achievements.notification.resume_title"));
      }
    } else {
      // Resume timer and start new timeout
      if (state.currentTimerAnimation) {
        const timeElapsed = (state.currentTimerAnimation.currentTime as number) || 0;
        const remainingTime = settings.displayTime - timeElapsed;
        state.currentTimerAnimation.play();

        if (state.hideTimeout) {
          clearTimeout(state.hideTimeout);
        }

        state.hideTimeout = window.setTimeout(() => {
          hideNotification();
        }, remainingTime);
      }

      // Update pause button icon using the optimized icon update function
      if (elements.pauseButton) {
        updateIcon(elements.pauseButton, ICON_NAMES.pause);
        elements.pauseButton.setAttribute("aria-label", t("achievements.notification.pause"));
        elements.pauseButton.setAttribute("title", t("achievements.notification.pause_title"));
      }
    }
  };
}

/**
 * Creates the toggleSound handler
 * @param {NotificationElements} elements - DOM elements
 * @param {NotificationState} state - Current state
 * @param {AccessibilitySettings} settings - Accessibility settings
 * @param {Function} t - Translation function
 * @returns {() => void} Toggle sound function
 */
function createToggleSoundHandler(
  elements: NotificationElements,
  state: NotificationState,
  settings: AccessibilitySettings,
  t: (key: string) => string
): () => void {
  return (): void => {
    state.isMuted = !state.isMuted;

    // Update icon and status using optimized icon update function
    if (elements.soundToggleButton) {
      updateIcon(elements.soundToggleButton, state.isMuted ? ICON_NAMES.mute : ICON_NAMES.volume);

      elements.soundToggleButton.setAttribute(
        "aria-label",
        t(state.isMuted ? "achievements.notification.unmute" : "achievements.notification.mute")
      );
      elements.soundToggleButton.setAttribute(
        "title",
        t(
          state.isMuted
            ? "achievements.notification.unmute_title"
            : "achievements.notification.mute_title"
        )
      );

      // Stop sound if currently playing
      if (state.isMuted && elements.sound) {
        elements.sound.pause();
        elements.sound.currentTime = 0;
      }
    }

    // Save user preference
    if (elements.a11ySettings) {
      elements.a11ySettings.setAttribute("data-enable-sound", state.isMuted ? "false" : "true");
      settings.enableSound = !state.isMuted;
    }
  };
}

/**
 * Creates notification display and control handlers
 * @param {NotificationElements} elements - DOM elements
 * @param {NotificationState} state - Current state
 * @param {AccessibilitySettings} settings - Accessibility settings
 * @param {Function} t - Translation function
 * @param {() => void} createTimerAnimation - Timer animation function
 * @param {() => void} playSound - Audio playbook function
 * @param {Object} focusHandlers - Focus management handlers
 * @returns {Object} Notification control functions
 */
function createNotificationHandlers(
  elements: NotificationElements,
  state: NotificationState,
  settings: AccessibilitySettings,
  t: (key: string) => string,
  createTimerAnimation: () => void,
  playSound: () => void,
  focusHandlers: {
    setupFocusTrap: () => void;
    removeFocusTrap: () => void;
  }
): {
  showNotification: (event: AchievementEvent) => void;
  hideNotification: () => void;
  togglePause: () => void;
  toggleSound: () => void;
} {
  // Create the hide notification handler first since other handlers depend on it
  const hideNotification = createHideNotificationHandler(elements, state, focusHandlers);

  // Create all other handlers
  const showNotification = createShowNotificationHandler(
    elements,
    state,
    settings,
    createTimerAnimation,
    playSound,
    focusHandlers,
    hideNotification
  );

  const togglePause = createTogglePauseHandler(elements, state, settings, t, hideNotification);
  const toggleSound = createToggleSoundHandler(elements, state, settings, t);

  return {
    showNotification,
    hideNotification,
    togglePause,
    toggleSound,
  };
}

/**
 * Sets up system-level event listeners
 * @param {NotificationElements} elements - DOM elements
 * @param {NotificationState} state - Current state
 * @param {AccessibilitySettings} settings - Accessibility settings
 * @returns {() => void} Cleanup function
 */
function setupSystemListeners(
  elements: NotificationElements,
  state: NotificationState,
  settings: AccessibilitySettings
): () => void {
  /**
   * Sets up listener for reduced motion preference
   */
  const setupReducedMotionListener = (): (() => void) => {
    const reducedMotionMediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handleReducedMotionChange = (event: MediaQueryListEvent): void => {
      settings.prefersReducedMotion = event.matches;

      if (settings.prefersReducedMotion && elements.sound) {
        // Disable sound for users who prefer reduced motion
        elements.sound.pause();
        elements.sound.currentTime = 0;
      }

      // Adjust timer animation if active
      if (state.currentTimerAnimation && settings.prefersReducedMotion) {
        state.currentTimerAnimation.updatePlaybackRate(3.0);
      }
    };

    reducedMotionMediaQuery.addEventListener("change", handleReducedMotionChange);

    return () => {
      reducedMotionMediaQuery.removeEventListener("change", handleReducedMotionChange);
    };
  };

  return setupReducedMotionListener();
}

/**
 * Creates resource cleanup handlers
 * @param {NotificationElements} elements - DOM elements
 * @param {NotificationState} state - Current state
 * @param {Object} focusHandlers - Focus management handlers
 * @param {Function} systemCleanup - System listeners cleanup function
 * @returns {() => void} Cleanup function
 */
function createCleanupHandlers(
  elements: NotificationElements,
  state: NotificationState,
  focusHandlers: { removeFocusTrap: () => void },
  systemCleanup: () => void
): () => void {
  return (): void => {
    // Remove focus trap
    focusHandlers.removeFocusTrap();

    // Clean up timer and animation
    if (state.hideTimeout) {
      clearTimeout(state.hideTimeout);
      state.hideTimeout = null;
    }

    if (state.currentTimerAnimation) {
      state.currentTimerAnimation.cancel();
      state.currentTimerAnimation = null;

      // Release GPU resources
      if (elements.timerProgress) {
        elements.timerProgress.style.willChange = "auto";
        elements.timerProgress.style.transform = "";
      }
    }

    // Release sound resources properly according to web audio best practices
    if (elements.sound) {
      try {
        elements.sound.pause();
        elements.sound.currentTime = 0;
        elements.sound.src = "";
        elements.sound.removeAttribute("src");
        elements.sound.load();
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.warn("Error during audio cleanup:", errorMessage);
      }
    }

    // Unsubscribe from events
    if (state.eventUnsubscriber) {
      state.eventUnsubscriber();
      state.eventUnsubscriber = null;
    }

    // Reset ARIA attributes for better accessibility cleanup
    if (elements.notification) {
      elements.notification.setAttribute("aria-hidden", "true");
      elements.notification.removeAttribute("tabindex");
    }

    // Clean up system listeners
    systemCleanup();
  };
}

/**
 * Initializes the achievement notification system with all required handlers and listeners
 * This function coordinates all the separate handler creation functions
 * @returns {NotificationHandlers} Notification handler functions
 */
function initAchievementNotification(): NotificationHandlers {
  // Get translation function (use default language for browser context)
  const t = useTranslations("en");

  // Get DOM elements
  const elements = getNotificationElements();
  if (!elements) {
    throw new Error("Required notification elements not found");
  }

  // Get accessibility settings
  const settings = getAccessibilitySettings(elements.a11ySettings);

  // Create initial state
  const state = createInitialState(settings);

  // Create timer handlers
  const createTimerAnimation = createTimerHandlers(elements, state, settings);

  // Create audio handlers
  const playSound = createAudioHandlers(elements, state, settings);

  // Create focus handlers
  const focusHandlers = createFocusHandlers(elements, {
    hideNotification: () => notificationHandlers.hideNotification(),
  });

  // Create notification handlers (show/hide/pause/sound)
  const notificationHandlers = createNotificationHandlers(
    elements,
    state,
    settings,
    t,
    createTimerAnimation,
    playSound,
    focusHandlers
  );

  // Set up system listeners
  const systemCleanup = setupSystemListeners(elements, state, settings);

  // Create cleanup handlers
  const cleanup = createCleanupHandlers(elements, state, focusHandlers, systemCleanup);

  // Set up event listeners for buttons
  elements.closeButton?.addEventListener("click", notificationHandlers.hideNotification);
  elements.pauseButton?.addEventListener("click", notificationHandlers.togglePause);
  elements.soundToggleButton?.addEventListener("click", notificationHandlers.toggleSound);

  // Subscribe to achievement events
  state.eventUnsubscriber = subscribeToAchievementEvents(notificationHandlers.showNotification);

  // Return all handlers
  return {
    showNotification: notificationHandlers.showNotification,
    hideNotification: notificationHandlers.hideNotification,
    setupFocusTrap: focusHandlers.setupFocusTrap,
    removeFocusTrap: focusHandlers.removeFocusTrap,
    trapFocus: focusHandlers.trapFocus,
    handleKeyDown: focusHandlers.handleKeyDown,
    updateTimerProgress: createTimerAnimation,
    togglePause: notificationHandlers.togglePause,
    toggleSound: notificationHandlers.toggleSound,
    cleanup: (): void => {
      // Remove button event listeners
      if (elements.closeButton) {
        elements.closeButton.removeEventListener("click", notificationHandlers.hideNotification);
      }
      if (elements.pauseButton) {
        elements.pauseButton.removeEventListener("click", notificationHandlers.togglePause);
      }
      if (elements.soundToggleButton) {
        elements.soundToggleButton.removeEventListener("click", notificationHandlers.toggleSound);
      }

      cleanup();
    },
  };
}

/**
 * Main function that initializes the achievement notification system when the DOM is ready
 * @returns {() => void} A cleanup function to release resources
 */
export function setupAchievementNotificationSystem(): () => void {
  let handlers: NotificationHandlers | null = null;

  // Initialize when DOM is ready
  const initialize = (): void => {
    handlers = initAchievementNotification();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }

  // Return cleanup function
  return (): void => {
    if (handlers) {
      handlers.cleanup();
      handlers = null;
    }

    // Remove DOMContentLoaded listener if it hasn't fired yet
    document.removeEventListener("DOMContentLoaded", initialize);
  };
}
