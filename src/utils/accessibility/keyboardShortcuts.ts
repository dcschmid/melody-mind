import { safeGetElementById, safeQuerySelectorAll } from "../dom/domUtils";

/**
 * @fileoverview Keyboard shortcuts manager for the MelodyMind game
 * Provides accessible keyboard navigation for game actions.
 *
 * - J: Use Joker (eliminate two wrong answers)
 * - 1-4: Select answer options
 * - N: Advance to next round
 * - Esc: Close overlay and advance (already implemented)
 * - R: Restart game (at end screen)
 *
 * All shortcuts have ARIA announcements for screen readers
 */

/**
 * The keyboard shortcuts configuration
 */
export const KEYBOARD_SHORTCUTS = {
  JOKER: ["j", "J"],
  OPTION_1: ["1"],
  OPTION_2: ["2"],
  OPTION_3: ["3"],
  OPTION_4: ["4"],
  NEXT_ROUND: ["n", "N"],
  RESTART: ["r", "R"],
};

/**
 * Initialize keyboard shortcuts for the game
 *
 * @param {object} options - Configuration for keyboard shortcuts
 */
export function initKeyboardShortcuts(options: {
  onJoker?: () => void;
  onOption?: (index: number) => void;
  onNextRound?: () => void;
  onRestart?: () => void;
  lang?: string;
}): void {
  // Get translation function
  const translations: Record<string, Record<string, string>> = {
    en: {
      jPressed: "Joker activated with keyboard shortcut J",
      nPressed: "Moving to next round with keyboard shortcut N",
      rPressed: "Restarting game with keyboard shortcut R",
      optionSelected: "Selected option {{number}} with keyboard shortcut",
    },
    de: {
      jPressed: "Joker mit Tastenkürzel J aktiviert",
      nPressed: "Gehe zur nächsten Runde mit Tastenkürzel N",
      rPressed: "Spiel wird mit Tastenkürzel R neu gestartet",
      optionSelected: "Option {{number}} mit Tastenkürzel ausgewählt",
    },
  };

  // Fallback to English if language not supported
  const lang = options.lang || "en";
  const t = translations[lang] || translations.en;

  // Add event listener for keyboard events
  document.addEventListener("keydown", (event) => {
    // Don't process shortcuts when typing in form elements
    if (isTypingInFormElement(event.target as HTMLElement)) {
      return;
    }

      handleKeyboardShortcut(event, t);
  });

  // Extracted to reduce the complexity of the inline listener
    function handleKeyboardShortcut(event: KeyboardEvent, translations: Record<string, string>): void {
    const key = event.key;

    // Joker shortcut
    if (KEYBOARD_SHORTCUTS.JOKER.includes(key) && options.onJoker) {
      event.preventDefault();
      announceToScreenReader(translations.jPressed);
      options.onJoker();
      return;
    }

    // Option selection shortcuts
    if (KEYBOARD_SHORTCUTS.OPTION_1.includes(key) && options.onOption) {
      event.preventDefault();
      announceToScreenReader(translations.optionSelected.replace("{{number}}", "1"));
      options.onOption(0);
      return;
    }

    if (KEYBOARD_SHORTCUTS.OPTION_2.includes(key) && options.onOption) {
      event.preventDefault();
      announceToScreenReader(translations.optionSelected.replace("{{number}}", "2"));
      options.onOption(1);
      return;
    }

    if (KEYBOARD_SHORTCUTS.OPTION_3.includes(key) && options.onOption) {
      event.preventDefault();
      announceToScreenReader(translations.optionSelected.replace("{{number}}", "3"));
      options.onOption(2);
      return;
    }

    if (KEYBOARD_SHORTCUTS.OPTION_4.includes(key) && options.onOption) {
      event.preventDefault();
      announceToScreenReader(translations.optionSelected.replace("{{number}}", "4"));
      options.onOption(3);
      return;
    }

    // Next round shortcut
    if (KEYBOARD_SHORTCUTS.NEXT_ROUND.includes(key) && options.onNextRound) {
      event.preventDefault();
      announceToScreenReader(translations.nPressed);
      options.onNextRound();
      return;
    }

    // Restart shortcut
    if (KEYBOARD_SHORTCUTS.RESTART.includes(key) && options.onRestart) {
      event.preventDefault();
      announceToScreenReader(translations.rPressed);
      options.onRestart();
      return;
    }
  }

  // Add visual helpers for keyboard shortcuts
  addKeyboardShortcutHints(lang);
}

/**
 * Adds visual hints about keyboard shortcuts to relevant UI elements
 *
 * @param {string} lang - The current language code
 */
function addKeyboardShortcutHints(lang: string): void {
  const hintLabels: Record<string, Record<string, string>> = {
    en: {
      joker: "Joker (J)",
      nextRound: "Next Round (N)",
      restart: "Restart (R)",
    },
    de: {
      joker: "Joker (J)",
      nextRound: "Nächste Runde (N)",
      restart: "Neu starten (R)",
    },
  };

  // Fallback to English if language not supported
  const labels = hintLabels[lang] || hintLabels.en;

  // Update aria-labels and tooltips
  const jokerButton = safeGetElementById<HTMLButtonElement>("joker-button");
  if (jokerButton) {
    const currentLabel = jokerButton.getAttribute("aria-label") || "Joker";
    jokerButton.setAttribute("aria-label", `${currentLabel} - ${labels.joker}`);
    jokerButton.setAttribute("title", `${labels.joker}`);
  }

  const nextRoundButton = safeGetElementById<HTMLButtonElement>("next-round-button");
  if (nextRoundButton) {
    const currentLabel = nextRoundButton.getAttribute("aria-label") || "Next Round";
    nextRoundButton.setAttribute("aria-label", `${currentLabel} - ${labels.nextRound}`);
    nextRoundButton.setAttribute("title", `${labels.nextRound}`);
  }

  const restartButton = safeGetElementById<HTMLButtonElement>("restart-button");
  if (restartButton) {
    const currentLabel = restartButton.getAttribute("aria-label") || "Restart";
    restartButton.setAttribute("aria-label", `${currentLabel} - ${labels.restart}`);
    restartButton.setAttribute("title", `${labels.restart}`);
  }

  // Add number hints to option buttons
  // Small helper to annotate option buttons (kept separate to reduce complexity)
  function annotateOptionButtons(): void {
    const optionButtons = safeQuerySelectorAll<HTMLButtonElement>("#options button");
    optionButtons.forEach((button, index) => {
      const shortcutNumber = index + 1;
      const currentLabel = button.getAttribute("aria-label") || button.textContent || "";
      button.setAttribute("aria-label", `${currentLabel} - ${shortcutNumber}`);
    });
  }

  setTimeout(annotateOptionButtons, 500); // Short delay to ensure options are loaded
}

/**
 * Announces a message to screen readers via an ARIA live region
 *
 * @param {string} message - The message to announce
 * @param {"assertive" | "polite"} politeness - The politeness level of the announcement
 * @returns {void}
 */
function announceToScreenReader(
  message: string,
  politeness: "assertive" | "polite" = "assertive"
): void {
  // Create or get an announcer element
  let announcer = safeGetElementById("keyboard-shortcut-announcer");

  if (!announcer) {
    announcer = document.createElement("div");
    announcer.id = "keyboard-shortcut-announcer";
    announcer.classList.add("sr-only");
    announcer.setAttribute("aria-live", politeness);
    announcer.setAttribute("aria-atomic", "true");
    document.body.appendChild(announcer);
  }

  // Set the message and automatically remove it after 3 seconds
  announcer.textContent = message;

  setTimeout(() => {
    if (announcer) {
      announcer.textContent = "";
    }
  }, 3000);
}

/**
 * Checks if the user is typing in a form element
 * Prevents shortcuts from interfering with text input
 *
 * @param {HTMLElement | null} element - The element being interacted with
 * @returns {boolean} Whether the user is typing in a form element
 */
function isTypingInFormElement(element: HTMLElement | null): boolean {
  if (!element) {
    return false;
  }

  // Check if the element is a form input
  const formElements = ["INPUT", "TEXTAREA", "SELECT"];

  // Check if element has contenteditable attribute
  const isContentEditable = element.getAttribute("contenteditable") === "true";

  return formElements.includes(element.tagName) || isContentEditable;
}
