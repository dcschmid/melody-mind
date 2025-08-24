import { safeGetElementById, safeSetTextContent } from "../dom/domUtils";

interface FeedbackOverlayData {
  artist?: string;
  album?: string;
  year?: string;
  funFact?: string;
}

interface FeedbackOverlayElements {
  overlay: HTMLElement | null;
  closeButton: HTMLElement | null;
  backdrop: HTMLElement | null;
  nextButton: HTMLElement | null;
  artistElement: HTMLElement | null;
  albumElement: HTMLElement | null;
  yearElement: HTMLElement | null;
  funFactElement: HTMLElement | null;
}

/**
 *
 */
export class FeedbackOverlayUtils {
  private elements: FeedbackOverlayElements;
  private observer: MutationObserver | null = null;

  /**
   *
   */
  constructor() {
    this.elements = {
      overlay: safeGetElementById<HTMLElement>("overlay"),
      closeButton: safeGetElementById<HTMLElement>("close-overlay-button"),
      backdrop: safeGetElementById<HTMLElement>("overlay-backdrop"),
      nextButton: safeGetElementById<HTMLElement>("next-round-button"),
      artistElement: safeGetElementById<HTMLElement>("overlay-artist"),
      albumElement: safeGetElementById<HTMLElement>("overlay-album"),
      yearElement: safeGetElementById<HTMLElement>("overlay-year"),
      funFactElement: safeGetElementById<HTMLElement>("overlay-funfact"),
    };

    this.init();
  }

  private init(): void {
    if (!this.validateElements()) {
      return;
    }

    this.setupEventListeners();
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
    this.makePopulateFunctionGlobal();
  }

  private validateElements(): boolean {
    const { overlay, closeButton, backdrop, nextButton } = this.elements;
    return !!(overlay && closeButton && backdrop && nextButton);
  }

  private setupEventListeners(): void {
    const { closeButton, backdrop, nextButton } = this.elements;

    closeButton?.addEventListener("click", () => this.closeOverlay());
    backdrop?.addEventListener("click", () => this.closeOverlay());
    nextButton?.addEventListener("click", () => this.closeOverlay());
  }

  private setupKeyboardNavigation(): void {
    document.addEventListener("keydown", (e) => {
      if (!this.elements.overlay?.classList.contains("hidden")) {
        if (e.key === "Escape") {
          e.preventDefault();
          this.closeOverlay();
        }
      }
    });
  }

  private setupFocusManagement(): void {
    if (!this.elements.overlay) {
      return;
    }

    this.observer = new MutationObserver((mutations) => {
      mutations.forEach(({ type, target, attributeName }) => {
        if (type === "attributes" && attributeName === "class") {
          const isVisible = !(target as HTMLElement).classList.contains("hidden");
          if (isVisible) {
            window.scrollTo(0, 0);
            setTimeout(() => this.elements.closeButton?.focus(), 100);
          }
        }
      });
    });

    this.observer.observe(this.elements.overlay, {
      attributes: true,
      attributeFilter: ["class"],
    });
  }

  private closeOverlay(): void {
    const nextRoundButton = this.elements.nextButton;
    if (nextRoundButton?.onclick) {
      // Call the game engine's onclick handler directly
      nextRoundButton.onclick(new MouseEvent("click"));
    } else {
      // Fallback: Hide overlay and dispatch click event
      this.elements.overlay?.classList.add("hidden");
      nextRoundButton?.click();
    }
  }

  private makePopulateFunctionGlobal(): void {
    // Extend Window interface for our utilities
    (
      window as Window & { populateFeedbackOverlay: (data: FeedbackOverlayData) => void }
    ).populateFeedbackOverlay = (data: FeedbackOverlayData) => this.populateOverlay(data);
  }

  /**
   *
   */
  public populateOverlay(data: FeedbackOverlayData): void {
    const { artistElement, albumElement, yearElement, funFactElement } = this.elements;

    if (artistElement && data.artist) {
      safeSetTextContent(artistElement, data.artist);
    }
    if (albumElement && data.album) {
      safeSetTextContent(albumElement, data.album);
    }
    if (yearElement && data.year) {
      safeSetTextContent(yearElement, data.year);
    }
    if (funFactElement && data.funFact) {
      safeSetTextContent(funFactElement, data.funFact);
    }
  }

  /**
   *
   */
  public cleanup(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}

/**
 *
 */
export function initFeedbackOverlay(): FeedbackOverlayUtils {
  return new FeedbackOverlayUtils();
}

/**
 *
 */
export function initFeedbackOverlayAuto(): FeedbackOverlayUtils | null {
  try {
    return new FeedbackOverlayUtils();
  } catch (error) {
    return null;
  }
}
