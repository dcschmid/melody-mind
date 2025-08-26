/**
 * Joker Component Utilities
 *
 * Centralized utilities for managing joker functionality.
 * Eliminates code duplication in component script tags.
 */

import { safeGetElementById, safeQuerySelector } from "../dom/domUtils";

/**
 * Joker configuration interface
 */
interface JokerConfig {
  containerId: string;
  buttonId: string;
  counterId: string;
  announcementId: string;
}

/**
 * Joker elements interface
 */
interface JokerElements {
  container: HTMLElement | null;
  button: HTMLButtonElement | null;
  counter: HTMLElement | null;
  announcement: HTMLElement | null;
}

/**
 * Joker utility class
 */
export class JokerUtils {
  private elements: JokerElements;
  private lang: string;
  private clickTimeout: number | null = null;
  private canTrigger: boolean = true;

  /**
   * Initialize joker utility with configuration
   */
  constructor(config: JokerConfig) {
    this.elements = {
      container: safeQuerySelector('[data-testid="joker-container"]'),
      button: safeGetElementById<HTMLButtonElement>(config.buttonId),
      counter: safeGetElementById(config.counterId),
      announcement: safeGetElementById(config.announcementId),
    };

    this.lang = this.elements.container?.getAttribute("data-lang-code") || "en";

    this.init();
  }

  /**
   * Initialize joker functionality
   */
  private init(): void {
    if (!this.elements.container || !this.elements.button || !this.elements.counter) {
      return;
    }

    const initialCount = parseInt(
      this.elements.container.getAttribute("data-initial-count") || "0",
      10
    );
    const initialDisabled =
      this.elements.container.getAttribute("data-initial-disabled") === "true";

    if (initialDisabled) {
      this.elements.button.disabled = true;
    }

    if (initialCount > 0) {
      this.elements.counter.textContent = initialCount.toString();
    }

    this.setupButtonEvents();
    this.setupCounterObserver();
    this.setupGlobalUpdate();
  }

  /**
   * Setup button event listeners
   */
  private setupButtonEvents(): void {
    if (!this.elements.button) {
      return;
    }

    this.elements.button.addEventListener("click", (e) => this.handleJokerClick(e));
    this.elements.button.addEventListener("keydown", (e) => this.handleKeydown(e));
  }

  /**
   * Handle joker button click
   */
  private handleJokerClick(_e: Event): void {
    if (this.elements.button?.disabled || !this.canTrigger || this.clickTimeout) {
      return;
    }

    this.canTrigger = false;
    this.dispatchJokerEvent();

    if (this.elements.button) {
      this.elements.button.disabled = true;
    }

    this.clickTimeout = window.setTimeout(() => {
      if (this.elements.button && !this.elements.button.hasAttribute("data-permanently-disabled")) {
        this.elements.button.disabled = false;
      }
      this.clickTimeout = null;
      this.canTrigger = true;
    }, 800);
  }

  /**
   * Handle keyboard events
   */
  private handleKeydown(e: KeyboardEvent): void {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this.handleJokerClick(e);
    }
  }

  /**
   * Dispatch joker used event
   */
  private dispatchJokerEvent(): void {
    if (!this.elements.button) {
      return;
    }

    try {
      const jokerEvent = new CustomEvent("jokerUsed", {
        bubbles: true,
        detail: {
          jokerType: this.elements.button.dataset.jokerType || "fifty-fifty",
          timestamp: Date.now(),
        },
      });

      document.dispatchEvent(jokerEvent);
      this.announceJokerUsage();
    } catch (error) {
      // Ensure caught error is not ignored by the linter while keeping runtime behavior unchanged.
      void error;
    }
  }

  /**
   * Setup counter observation
   */
  private setupCounterObserver(): void {
    if (!this.elements.counter) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          this.setupMutation();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(this.elements.counter);
  }

  /**
   * Setup mutation observer for counter updates
   */
  private setupMutation(): void {
    if (!this.elements.counter) {
      return;
    }

    const mutationObs = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList" && this.elements.counter) {
          this.elements.counter.classList.remove("updated");
          void this.elements.counter.offsetWidth; // Force reflow
          this.elements.counter.classList.add("updated");
        }
      });
    });

    mutationObs.observe(this.elements.counter, { childList: true });
  }

  /**
   * Announce joker usage for screen readers
   */
  private announceJokerUsage(): void {
    const announcementEl = this.elements.announcement || this.createAnnouncementElement();

    const currentCount = this.elements.counter?.textContent?.trim() || "0";
    announcementEl.textContent = this.createAnnouncementText(this.lang, currentCount);

    setTimeout(() => {
      announcementEl.textContent = "";
    }, 3000);
  }

  /**
   * Create announcement element if it doesn't exist
   */
  private createAnnouncementElement(): HTMLElement {
    const el = document.createElement("div");
    el.id = "joker-announcement";
    el.setAttribute("aria-live", "assertive");
    el.setAttribute("aria-atomic", "true");
    el.className = "sr-only";
    document.body.appendChild(el);
    return el;
  }

  /**
   * Create announcement text based on language
   */
  private createAnnouncementText(lang: string, currentCount: string): string {
    const announcements: Record<string, string> = {
      de: `50:50 Joker verwendet. Noch ${currentCount} Joker verfügbar.`,
      en: `50:50 Joker used. ${currentCount} jokers remaining.`,
      es: `Comodín 50:50 utilizado. Quedan ${currentCount} comodines.`,
      fr: `Joker 50:50 utilisé. ${currentCount} jokers restants.`,
      it: `Jolly 50:50 utilizzato. ${currentCount} jolly rimanenti.`,
      pt: `Curinga 50:50 usado. ${currentCount} curingas restantes.`,
      da: `50:50 joker brugt. ${currentCount} jokere tilbage.`,
      nl: `50:50 joker gebruikt. ${currentCount} jokers resterend.`,
      sv: `50:50 joker använd. ${currentCount} jokrar kvar.`,
      fi: `50:50-jokeri käytetty. ${currentCount} jokeria jäljellä.`,
    };
    return announcements[lang] || announcements.en;
  }

  /**
   * Update joker count programmatically
   */
  public updateJokerCount(count: number, disable: boolean = false): void {
    if (this.elements.counter) {
      this.elements.counter.textContent = count.toString();
    }

    if (this.elements.button) {
      if (disable || count <= 0) {
        this.elements.button.disabled = true;
        if (count <= 0) {
          this.elements.button.setAttribute("data-permanently-disabled", "true");
        }
      } else {
        this.elements.button.disabled = false;
        this.elements.button.removeAttribute("data-permanently-disabled");
      }
    }
  }

  /**
   * Setup global update function
   */
  private setupGlobalUpdate(): void {
    // Make update function globally available (typed)
    if (typeof window !== "undefined") {
      const globalWin = window as unknown as Window & {
        MelodyMind?: { updateJokerCount?: (count: number, disable?: boolean) => void };
      };
      globalWin.MelodyMind = globalWin.MelodyMind || {};
      globalWin.MelodyMind.updateJokerCount = (count: number, disable?: boolean): void => {
        this.updateJokerCount(count, disable);
      };
    }
  }

  /**
   * Get current joker count
   */
  public getCurrentCount(): number {
    const count = this.elements.counter?.textContent?.trim() || "0";
    return parseInt(count, 10);
  }

  /**
   * Check if joker is disabled
   */
  public isDisabled(): boolean {
    return this.elements.button?.disabled || false;
  }

  /**
   * Destroy event listeners and observers
   */
  public destroy(): void {
    if (this.clickTimeout) {
      clearTimeout(this.clickTimeout);
    }
    // Note: Observers and event listeners are cleaned up automatically when elements are removed
  }
}

/**
 * Extend window interface for global functions
 */
declare global {
  interface Window {
    MelodyMind?: {
      updateJokerCount?: (count: number, disable?: boolean) => void;
    };
  }
}

/**
 * Initialize joker functionality
 *
 * @param {JokerConfig} config - Configuration for the joker utility
 * @returns {JokerUtils} An instance of JokerUtils configured with the provided options
 */
export function initJoker(config: JokerConfig): JokerUtils {
  return new JokerUtils(config);
}

/**
 * Default joker initialization
 *
 * Convenience initializer that creates the default JokerUtils instance using
 * the project's standard DOM element IDs.
 *
 * @returns {JokerUtils} A JokerUtils instance initialized with default IDs
 */
export function initDefaultJoker(): JokerUtils {
  return initJoker({
    containerId: "joker-container",
    buttonId: "joker-button",
    counterId: "joker-count",
    announcementId: "joker-announcement",
  });
}

/**
 * Auto-initialize joker functionality
 *
 * Detects the presence of the default joker container in the DOM and, if found,
 * initializes and returns the default JokerUtils instance.
 *
 * @returns {JokerUtils | null} The initialized JokerUtils instance, or null if
 *                              the expected container was not found.
 */
export function initJokerAuto(): JokerUtils | null {
  const container = safeQuerySelector('[data-testid="joker-container"]');
  if (!container) {
    return null;
  }

  return initDefaultJoker();
}
