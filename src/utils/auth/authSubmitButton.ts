/**
 * AuthSubmitButton Utilities - Modern TypeScript
 *
 * Provides enhanced accessibility and interaction features for auth submit buttons.
 * Reuses existing authFormUtils to avoid code duplication.
 *
 * @performance Optimized with modern ES6+ features and efficient DOM manipulation
 * @accessibility WCAG AAA compliant with enhanced screen reader support
 */

import { setAuthButtonLoadingState } from "./authFormUtils";

// Type definitions for better type safety
interface AuthButtonUtils {
  setLoadingState: typeof setAuthButtonLoadingState;
  announce: (message: string) => void;
}

interface WindowWithAuthUtils extends Window {
  __authButtonUtils?: AuthButtonUtils;
}

interface TranslationParams {
  [key: string]: string;
}

interface TranslationMap {
  [key: string]: Record<string, string>;
}

// Modern ES6+ arrow function for screen reader announcements
const announceToScreenReader = (message: string): void => {
  let liveRegion = document.getElementById("auth-live-region");

  if (!liveRegion) {
    liveRegion = document.createElement("div");
    liveRegion.id = "auth-live-region";
    liveRegion.setAttribute("aria-live", "polite");
    liveRegion.setAttribute("aria-atomic", "true");
    liveRegion.className = "sr-only";
    document.body.appendChild(liveRegion);
  }

  liveRegion.textContent = "";

  // Use setTimeout with arrow function for consistency
  setTimeout(() => {
    if (liveRegion) {
      liveRegion.textContent = message;
    }
  }, 100);
};

// Translation system with modern ES6+ features
const translations: TranslationMap = {
  en: {
    "auth.accessibility.button_focus_instruction": "Button: {buttonText}. Press Enter to submit",
  },
  de: {
    "auth.accessibility.button_focus_instruction":
      "Schaltfl�che: {buttonText}. Dr�cken Sie die Eingabetaste zum Absenden",
  },
  es: {
    "auth.accessibility.button_focus_instruction":
      "Bot�n: {buttonText}. Presiona Enter para enviar",
  },
  fr: {
    "auth.accessibility.button_focus_instruction":
      "Bouton : {buttonText}. Appuyez sur Entr�e pour soumettre",
  },
  it: {
    "auth.accessibility.button_focus_instruction":
      "Pulsante: {buttonText}. Premi Invio per inviare",
  },
  pt: {
    "auth.accessibility.button_focus_instruction":
      "Bot�o: {buttonText}. Pressione Enter para enviar",
  },
  da: {
    "auth.accessibility.button_focus_instruction":
      "Knap: {buttonText}. Tryk p� Enter for at indsende",
  },
  nl: {
    "auth.accessibility.button_focus_instruction":
      "Knop: {buttonText}. Druk op Enter om te verzenden",
  },
  sv: {
    "auth.accessibility.button_focus_instruction":
      "Knapp: {buttonText}. Tryck p� Enter f�r att skicka",
  },
  fi: {
    "auth.accessibility.button_focus_instruction":
      "Painike: {buttonText}. Paina Enter l�hett��ksesi",
  },
};

// Modern ES6+ function with template literals and destructuring
const getTranslation = (key: string, params?: TranslationParams): string => {
  const lang = document.documentElement.lang || "en";
  let text = translations[lang]?.[key] || translations["en"]?.[key] || key;

  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(new RegExp(`{${k}}`, "g"), v);
    });
  }

  return text;
};

// Modern ES6+ initialization function
const initializeAuthButtonAccessibility = (): void => {
  if (typeof window === "undefined") {
    return;
  }

  // Type assertion for window with custom properties
  const windowWithUtils = window as WindowWithAuthUtils;

  // Expose utilities globally for other components
  windowWithUtils.__authButtonUtils = {
    setLoadingState: setAuthButtonLoadingState,
    announce: announceToScreenReader,
  };

  // Use modern querySelector with type assertion
  const submitButtons = document.querySelectorAll(
    ".auth-form__submit-button"
  ) as NodeListOf<HTMLButtonElement>;

  submitButtons.forEach((button) => {
    // Ensure aria-busy attribute is set
    if (!button.hasAttribute("aria-busy")) {
      button.setAttribute("aria-busy", "false");
    }

    // Modern event listener with arrow function
    button.addEventListener("focus", () => {
      const buttonTextElement = button.querySelector(".auth-form__submit-text");
      const buttonText = buttonTextElement?.textContent;

      if (buttonText) {
        const announcement = getTranslation("auth.accessibility.button_focus_instruction", {
          buttonText,
        });

        // Use arrow function for consistency
        setTimeout(() => announceToScreenReader(announcement), 300);
      }
    });
  });
};

// Modern event handling with arrow functions
const handleDOMContentLoaded = (): void => {
  initializeAuthButtonAccessibility();
};

// Export for reuse
export {
  initializeAuthButtonAccessibility,
  announceToScreenReader,
  getTranslation,
  type AuthButtonUtils,
  type TranslationParams,
  type TranslationMap,
};

// Auto-initialize when module is loaded
if (typeof window !== "undefined") {
  // Conditional initialization based on document ready state
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", handleDOMContentLoaded, { once: true });
  } else {
    initializeAuthButtonAccessibility();
  }
}
