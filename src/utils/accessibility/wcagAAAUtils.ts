/**
 * WCAG AAA Barrierefreiheits-Utilities
 *
 * Diese Datei enthält Funktionen zur Implementierung von WCAG AAA-Konformität
 * in der MelodyMind-Anwendung.
 */

import { useEffect, useState } from "preact/hooks";

// Typen für bessere TypeScript-Unterstützung
export interface FocusOptions {
  preventScroll?: boolean;
  announceToScreenReader?: boolean;
  announcement?: string;
  scrollIntoView?: boolean;
  scrollOptions?: ScrollIntoViewOptions;
  onFocusComplete?: () => void;
}

export interface AnnouncementOptions {
  politeness?: "assertive" | "polite";
  duration?: number;
  clearAfter?: boolean;
}

export interface ContrastRatio {
  ratio: number;
  passes: {
    AA: boolean;
    AAA: boolean;
    largeAA: boolean;
    largeAAA: boolean;
  };
}

/**
 * Fokussiert ein Element mit erweiterten Optionen für Barrierefreiheit
 *
 * @param elementId - Die ID des Elements, das fokussiert werden soll
 * @param options - Erweiterte Optionen für die Fokus-Verwaltung
 * @returns {boolean} - true, wenn der Fokus erfolgreich gesetzt wurde
 */
export function focusElement(
  elementId: string,
  options: FocusOptions = {},
): boolean {
  const {
    preventScroll = false,
    announceToScreenReader = true,
    announcement = "",
    scrollIntoView = false,
    scrollOptions = { behavior: "smooth", block: "nearest" },
    onFocusComplete,
  } = options;

  const element = document.getElementById(elementId);

  if (!element) {
    console.warn(
      `Element mit ID "${elementId}" konnte nicht fokussiert werden, da es nicht existiert.`,
    );
    return false;
  }

  try {
    // Ankündigung für Screenreader, wenn aktiviert
    if (announceToScreenReader) {
      const message =
        announcement ||
        `Fokus auf ${element.getAttribute("aria-label") || element.textContent || "Element"} gesetzt`;
      announceToScreenReader(message);
    }

    // Scrolle zum Element, wenn Option aktiviert
    if (scrollIntoView) {
      element.scrollIntoView(scrollOptions);
    }

    // Fokussiere das Element
    element.focus({ preventScroll });

    // Callback nach Fokussierung
    if (onFocusComplete) {
      onFocusComplete();
    }

    return true;
  } catch (error) {
    console.error("Fehler beim Setzen des Fokus:", error);
    return false;
  }
}

/**
 * Erstellt eine Ankündigung für Screenreader
 *
 * @param message - Die Nachricht, die angekündigt werden soll
 * @param options - Optionen für die Ankündigung
 */
export function announceToScreenReader(
  message: string,
  options: AnnouncementOptions = {},
): void {
  const {
    politeness = "assertive",
    duration = 500,
    clearAfter = true,
  } = options;

  // Suche vorhandenen Announcer oder erstelle neuen
  let announcer = document.getElementById("sr-announcer");
  const isNewAnnouncer = !announcer;

  if (!announcer) {
    announcer = document.createElement("div");
    announcer.id = "sr-announcer";

    // Verstecke visuell, aber nicht für Screenreader
    announcer.className = "sr-only";
    announcer.style.position = "absolute";
    announcer.style.width = "1px";
    announcer.style.height = "1px";
    announcer.style.padding = "0";
    announcer.style.margin = "-1px";
    announcer.style.overflow = "hidden";
    announcer.style.clip = "rect(0, 0, 0, 0)";
    announcer.style.whiteSpace = "nowrap";
    announcer.style.border = "0";

    // Setze ARIA-Attribute
    announcer.setAttribute("aria-live", politeness);
    announcer.setAttribute("aria-relevant", "additions text");
    announcer.setAttribute("aria-atomic", "true");

    document.body.appendChild(announcer);
  } else {
    // Aktualisiere Politeness, falls notwendig
    announcer.setAttribute("aria-live", politeness);
  }

  // Verzögerung, um sicherzustellen, dass der Screenreader die Änderung erkennt
  setTimeout(() => {
    announcer!.textContent = message;

    // Lösche die Nachricht nach einer bestimmten Zeit
    if (clearAfter) {
      setTimeout(() => {
        if (announcer) {
          announcer.textContent = "";

          // Entferne den Announcer, wenn er neu erstellt wurde
          if (isNewAnnouncer) {
            announcer.remove();
          }
        }
      }, duration);
    }
  }, 50);
}

/**
 * Berechnet das Kontrastverhältnis zwischen zwei Farben
 *
 * @param foreground - Vordergrundfarbe (Hexcode oder RGB-String)
 * @param background - Hintergrundfarbe (Hexcode oder RGB-String)
 * @returns Kontrastverhältnis und Compliance-Informationen
 */
export function calculateContrastRatio(
  foreground: string,
  background: string,
): ContrastRatio {
  // Konvertiere Farben zu RGB-Arrays
  const getRGB = (color: string): number[] => {
    // Hexcode (z.B. #FFFFFF oder #FFF)
    if (color.startsWith("#")) {
      let hex = color.substring(1);
      if (hex.length === 3) {
        hex = hex
          .split("")
          .map((c) => c + c)
          .join("");
      }
      return [
        parseInt(hex.substring(0, 2), 16),
        parseInt(hex.substring(2, 4), 16),
        parseInt(hex.substring(4, 6), 16),
      ];
    }

    // RGB-Format (z.B. rgb(255, 255, 255))
    const rgbMatch = color.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
    if (rgbMatch) {
      return [
        parseInt(rgbMatch[1], 10),
        parseInt(rgbMatch[2], 10),
        parseInt(rgbMatch[3], 10),
      ];
    }

    // Standardfarbe, wenn keine Übereinstimmung
    return [0, 0, 0];
  };

  // Berechne relativen Luminanzwert nach WCAG-Formel
  const calculateLuminance = (rgb: number[]): number => {
    const [r, g, b] = rgb.map((value) => {
      const sRGB = value / 255;
      return sRGB <= 0.03928
        ? sRGB / 12.92
        : Math.pow((sRGB + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  // Luminanzwerte berechnen
  const foregroundLuminance = calculateLuminance(getRGB(foreground));
  const backgroundLuminance = calculateLuminance(getRGB(background));

  // Kontrastverhältnis berechnen (WCAG-Formel)
  const ratio =
    (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
    (Math.min(foregroundLuminance, backgroundLuminance) + 0.05);

  // Berechne, ob die verschiedenen WCAG-Levels bestanden werden
  return {
    ratio: Math.round(ratio * 100) / 100,
    passes: {
      AA: ratio >= 4.5,
      AAA: ratio >= 7.0,
      largeAA: ratio >= 3.0,
      largeAAA: ratio >= 4.5,
    },
  };
}

/**
 * Stellt sicher, dass ARIA-Attribute korrekt verwendet werden
 *
 * @param element - Das HTML-Element, das überprüft werden soll
 * @returns Validierungsinfo mit Fehlern und Warnungen
 */
export function validateAriaAttributes(element: HTMLElement): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Liste erforderlicher ARIA-Attribute für verschiedene Rollen
  const requiredAttributes: Record<string, string[]> = {
    button: ["aria-pressed"],
    checkbox: ["aria-checked"],
    combobox: ["aria-expanded", "aria-controls"],
    dialog: ["aria-labelledby", "aria-describedby"],
    listbox: ["aria-activedescendant"],
    menu: ["aria-activedescendant"],
    menuitem: ["aria-disabled"],
    option: ["aria-selected"],
    progressbar: ["aria-valuenow", "aria-valuemin", "aria-valuemax"],
    radio: ["aria-checked"],
    slider: ["aria-valuenow", "aria-valuemin", "aria-valuemax"],
    tablist: ["aria-orientation"],
    tab: ["aria-selected", "aria-controls"],
    tabpanel: ["aria-labelledby"],
    textbox: ["aria-multiline"],
  };

  // Prüfe, ob rolle existiert und welche Attribute erforderlich sind
  const role = element.getAttribute("role");

  // Grundlegende ID-Prüfung
  if (element.id === "") {
    warnings.push("Element hat keine ID, was Referenzierung erschwert.");
  }

  // Wenn keine Rolle angegeben ist, fokussierbare Elemente prüfen
  if (!role) {
    if (
      element.tagName === "BUTTON" ||
      element.tagName === "A" ||
      element.tagName === "INPUT" ||
      element.tagName === "SELECT" ||
      element.tagName === "TEXTAREA"
    ) {
      // Prüfe auf Label bei Formular-Elementen
      if (["INPUT", "SELECT", "TEXTAREA"].includes(element.tagName)) {
        if (
          !element.hasAttribute("aria-label") &&
          !element.hasAttribute("aria-labelledby") &&
          element.tagName === "INPUT" &&
          !["button", "submit", "reset"].includes(
            (element as HTMLInputElement).type,
          )
        ) {
          errors.push(
            "Formular-Element benötigt zugängliches Label (aria-label oder aria-labelledby).",
          );
        }
      }

      // Prüfe auf aria-describedby für zusätzliche Beschreibungen
      if (
        (element.tagName === "INPUT" || element.tagName === "TEXTAREA") &&
        !element.hasAttribute("aria-describedby")
      ) {
        warnings.push(
          "Überprüfe, ob das Element eine zusätzliche Beschreibung benötigt (aria-describedby).",
        );
      }
    }
    return { isValid: errors.length === 0, errors, warnings };
  }

  // Prüfe auf unbekannte Rollen
  if (role && !Object.keys(requiredAttributes).includes(role)) {
    warnings.push(`Die Rolle "${role}" ist nicht in der Prüfliste enthalten.`);
    return { isValid: errors.length === 0, errors, warnings };
  }

  // Prüfe auf erforderliche Attribute
  if (role && requiredAttributes[role]) {
    requiredAttributes[role].forEach((attr) => {
      if (!element.hasAttribute(attr)) {
        // Manche Attribute sind optional, abhängig vom Kontext
        if (attr === "aria-pressed" && role === "button") {
          warnings.push(
            `Die Rolle "button" könnte das Attribut "${attr}" benötigen, falls es ein Toggle-Button ist.`,
          );
        } else {
          errors.push(`Die Rolle "${role}" erfordert das Attribut "${attr}".`);
        }
      }
    });
  }

  // Prüfe, ob referenzierte IDs existieren
  ["aria-labelledby", "aria-describedby", "aria-controls", "aria-owns"].forEach(
    (attr) => {
      if (element.hasAttribute(attr)) {
        const ids = element.getAttribute(attr)!.split(/\s+/);
        ids.forEach((id) => {
          if (!document.getElementById(id)) {
            errors.push(
              `Das Attribut "${attr}" verweist auf eine nicht existierende ID: "${id}".`,
            );
          }
        });
      }
    },
  );

  return { isValid: errors.length === 0, errors, warnings };
}

/**
 * Hook für die Unterstützung von Tastaturnavigation mit WAI-ARIA-konformen Tastaturbefehlen
 *
 * @param options - Optionen für die Tastaturunterstützung
 */
export function useKeyboardSupport(options: {
  focusableSelector?: string;
  onKeyNavigation?: (element: HTMLElement) => void;
  onEnterOrSpace?: (element: HTMLElement) => void;
  wrapNavigation?: boolean;
  orientation?: "horizontal" | "vertical" | "both";
}) {
  const {
    focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    onKeyNavigation,
    onEnterOrSpace,
    wrapNavigation = true,
    orientation = "both",
  } = options;

  useEffect(() => {
    const container = document.getElementById("keyboard-navigation-container");
    if (!container) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (!target || !container.contains(target)) return;

      const focusableElements = Array.from(
        container.querySelectorAll<HTMLElement>(focusableSelector),
      ).filter((el) => el.offsetWidth > 0 && el.offsetHeight > 0); // Nur sichtbare Elemente

      if (focusableElements.length === 0) return;

      const currentIndex = focusableElements.indexOf(
        document.activeElement as HTMLElement,
      );

      let nextIndex = -1;

      // Pfeil-Tasten für Navigation
      if (
        (orientation === "horizontal" || orientation === "both") &&
        (event.key === "ArrowRight" || event.key === "ArrowLeft")
      ) {
        event.preventDefault();

        if (event.key === "ArrowRight") {
          nextIndex =
            currentIndex < focusableElements.length - 1
              ? currentIndex + 1
              : wrapNavigation
                ? 0
                : currentIndex;
        } else if (event.key === "ArrowLeft") {
          nextIndex =
            currentIndex > 0
              ? currentIndex - 1
              : wrapNavigation
                ? focusableElements.length - 1
                : currentIndex;
        }
      } else if (
        (orientation === "vertical" || orientation === "both") &&
        (event.key === "ArrowDown" || event.key === "ArrowUp")
      ) {
        event.preventDefault();

        if (event.key === "ArrowDown") {
          nextIndex =
            currentIndex < focusableElements.length - 1
              ? currentIndex + 1
              : wrapNavigation
                ? 0
                : currentIndex;
        } else if (event.key === "ArrowUp") {
          nextIndex =
            currentIndex > 0
              ? currentIndex - 1
              : wrapNavigation
                ? focusableElements.length - 1
                : currentIndex;
        }
      } else if (event.key === "Home") {
        event.preventDefault();
        nextIndex = 0;
      } else if (event.key === "End") {
        event.preventDefault();
        nextIndex = focusableElements.length - 1;
      } else if (
        (event.key === "Enter" || event.key === " ") &&
        onEnterOrSpace
      ) {
        event.preventDefault();
        onEnterOrSpace(target);
        return;
      }

      if (nextIndex !== -1 && nextIndex !== currentIndex) {
        focusableElements[nextIndex].focus();

        if (onKeyNavigation) {
          onKeyNavigation(focusableElements[nextIndex]);
        }
      }
    };

    container.addEventListener("keydown", handleKeyDown);

    return () => {
      container.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    focusableSelector,
    onKeyNavigation,
    onEnterOrSpace,
    wrapNavigation,
    orientation,
  ]);
}

/**
 * Erstellt einen Hilfsdialog für Benutzer, der Kontext-sensitive Unterstützung bietet
 *
 * @param options - Optionen für den Hilfe-Dialog
 */
export function createAccessibleHelpDialog(options: {
  title: string;
  content: string;
  closeButtonText?: string;
  onClose?: () => void;
}): {
  open: () => void;
  close: () => void;
  isOpen: boolean;
} {
  const { title, content, closeButtonText = "Schließen", onClose } = options;

  // Erstelle Dialog-Element
  const dialog = document.createElement("div");
  dialog.setAttribute("role", "dialog");
  dialog.setAttribute("aria-modal", "true");
  dialog.setAttribute("aria-labelledby", "help-dialog-title");
  dialog.setAttribute("aria-describedby", "help-dialog-content");
  dialog.className = "help-dialog wcag-aaa-dialog";
  dialog.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    max-width: 500px;
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    z-index: 10000;
    display: none;
  `;

  // Erstelle Overlay
  const overlay = document.createElement("div");
  overlay.className = "help-dialog-overlay";
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    z-index: 9999;
    display: none;
  `;

  // Erstelle Struktur
  const dialogTitle = document.createElement("h2");
  dialogTitle.id = "help-dialog-title";
  dialogTitle.textContent = title;

  const dialogContent = document.createElement("div");
  dialogContent.id = "help-dialog-content";
  dialogContent.innerHTML = content;

  const closeButton = document.createElement("button");
  closeButton.textContent = closeButtonText;
  closeButton.className = "help-dialog-close";
  closeButton.style.cssText = `
    margin-top: 20px;
    padding: 8px 16px;
    background: #6b46c1;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  `;

  dialog.appendChild(dialogTitle);
  dialog.appendChild(dialogContent);
  dialog.appendChild(closeButton);

  // Füge zum Dokument hinzu
  document.body.appendChild(overlay);
  document.body.appendChild(dialog);

  let isDialogOpen = false;

  // Event-Listener
  const close = () => {
    dialog.style.display = "none";
    overlay.style.display = "none";

    // Fokus zurücksetzen
    const opener = document.getElementById("help-dialog-opener");
    if (opener) {
      opener.focus();
    }

    isDialogOpen = false;

    if (onClose) {
      onClose();
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
    }
  };

  closeButton.addEventListener("click", close);
  overlay.addEventListener("click", close);
  dialog.addEventListener("keydown", handleKeyDown);

  return {
    open: () => {
      dialog.style.display = "block";
      overlay.style.display = "block";
      closeButton.focus();
      isDialogOpen = true;
    },
    close,
    get isOpen() {
      return isDialogOpen;
    },
  };
}

/**
 * Erhöht den Kontrast aller Textelemente auf der Seite auf WCAG AAA Level
 *
 * @param targetContrast - Der Ziel-Kontrastwert (7.0 für WCAG AAA)
 */
export function enhanceTextContrast(targetContrast: number = 7.0): void {
  // Alle Textelemente finden
  const textElements = document.querySelectorAll(
    "p, h1, h2, h3, h4, h5, h6, span, a, button, label, input, textarea, select",
  );

  textElements.forEach((element) => {
    const el = element as HTMLElement;
    const styles = window.getComputedStyle(el);
    const foregroundColor = styles.color;
    const backgroundColor = findEffectiveBackgroundColor(el);

    const contrast = calculateContrastRatio(foregroundColor, backgroundColor);

    // Wenn der Kontrast nicht ausreichend ist, anpassen
    if (contrast.ratio < targetContrast) {
      // Farbe vertiefen bis ausreichender Kontrast erreicht ist
      let newColor = foregroundColor;
      if (isLightColor(foregroundColor)) {
        newColor = lightenColor(
          foregroundColor,
          findContrastAdjustment(
            foregroundColor,
            backgroundColor,
            targetContrast,
          ),
        );
      } else {
        newColor = darkenColor(
          foregroundColor,
          findContrastAdjustment(
            foregroundColor,
            backgroundColor,
            targetContrast,
          ),
        );
      }

      el.style.color = newColor;

      // Hinzufügen einer Klasse für CSS-Referenz
      el.classList.add("wcag-aaa-enhanced-contrast");
    }
  });
}

// Hilfsfunktionen für enhanceTextContrast()
function findEffectiveBackgroundColor(element: HTMLElement): string {
  let current = element;
  let backgroundColor = "transparent";

  while (current && backgroundColor === "transparent") {
    const style = window.getComputedStyle(current);
    backgroundColor = style.backgroundColor;

    if (
      backgroundColor === "transparent" ||
      backgroundColor === "rgba(0, 0, 0, 0)"
    ) {
      current = current.parentElement as HTMLElement;
    }
  }

  return backgroundColor || "#ffffff";
}

function isLightColor(color: string): boolean {
  const rgb = getRGBFromColor(color);
  return (rgb[0] + rgb[1] + rgb[2]) / 3 > 128;
}

function getRGBFromColor(color: string): number[] {
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext("2d");

  if (!ctx) return [0, 0, 0];

  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);
  const data = ctx.getImageData(0, 0, 1, 1).data;

  return [data[0], data[1], data[2]];
}

function lightenColor(color: string, amount: number): string {
  const rgb = getRGBFromColor(color);
  return `rgb(${Math.min(255, rgb[0] + amount)}, ${Math.min(255, rgb[1] + amount)}, ${Math.min(255, rgb[2] + amount)})`;
}

function darkenColor(color: string, amount: number): string {
  const rgb = getRGBFromColor(color);
  return `rgb(${Math.max(0, rgb[0] - amount)}, ${Math.max(0, rgb[1] - amount)}, ${Math.max(0, rgb[2] - amount)})`;
}

function findContrastAdjustment(
  foreground: string,
  background: string,
  targetContrast: number,
): number {
  let adjustment = 0;
  let currentContrast = calculateContrastRatio(foreground, background).ratio;

  while (currentContrast < targetContrast && adjustment < 200) {
    adjustment += 5;
    const newColor = isLightColor(foreground)
      ? lightenColor(foreground, adjustment)
      : darkenColor(foreground, adjustment);

    currentContrast = calculateContrastRatio(newColor, background).ratio;

    if (adjustment >= 200) {
      console.warn(
        "Maximum color adjustment reached but target contrast not achieved",
      );
      break;
    }
  }

  return adjustment;
}

/**
 * Überprüft die Semantik der Überschriftenstruktur
 *
 * @returns Ein Objekt mit Validierungsinformationen
 */
export function validateHeadingStructure(): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
  const errors: string[] = [];
  const warnings: string[] = [];

  // Überprüfe ob mindestens eine Überschrift vorhanden ist
  if (headings.length === 0) {
    errors.push(
      "Keine Überschriften gefunden. Dokumente sollten eine Überschriftenstruktur haben.",
    );
    return { isValid: false, errors, warnings };
  }

  // Überprüfe ob es eine h1 gibt
  const h1Elements = document.querySelectorAll("h1");
  if (h1Elements.length === 0) {
    errors.push(
      "Keine <h1> gefunden. Jedes Dokument sollte genau eine primäre <h1>-Überschrift haben.",
    );
  } else if (h1Elements.length > 1) {
    warnings.push(
      `${h1Elements.length} <h1>-Elemente gefunden. Es sollte nur eine primäre <h1>-Überschrift geben.`,
    );
  }

  // Überprüfe Überschriftenhierarchie
  let previousLevel = 0;

  headings.forEach((heading, index) => {
    const currentLevel = parseInt(heading.tagName.substring(1), 10);

    if (index === 0 && currentLevel !== 1) {
      warnings.push(
        `Die erste Überschrift ist <h${currentLevel}>, sollte aber <h1> sein.`,
      );
    }

    if (previousLevel > 0 && currentLevel - previousLevel > 1) {
      errors.push(
        `Überschriftenebene übersprungen: <h${previousLevel}> zu <h${currentLevel}>.`,
      );
    }

    // Überprüfe Inhalt
    if (heading.textContent?.trim() === "") {
      errors.push(
        `Leere Überschrift <h${currentLevel}> gefunden. Überschriften sollten Text enthalten.`,
      );
    }

    previousLevel = currentLevel;
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Hook für die Benutzereinstellungen für Barrierefreiheit
 *
 * @returns Ein Objekt mit Barrierefreiheitseinstellungen und Funktionen zu deren Änderung
 */
export function useAccessibilityPreferences() {
  // Standardeinstellungen
  const defaultPreferences = {
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches,
    highContrast: window.matchMedia("(prefers-contrast: more)").matches,
    largeText: false,
    lineSpacing: "normal",
    alternativeText: false,
    skipAnimations: false,
    soundFeedback: false,
  };

  // State für die Einstellungen
  const [preferences, setPreferences] = useState(defaultPreferences);

  // Anwenden der Einstellungen
  useEffect(() => {
    // Klasse für Bewegungsreduktion
    if (preferences.reducedMotion) {
      document.documentElement.classList.add("reduced-motion");
    } else {
      document.documentElement.classList.remove("reduced-motion");
    }

    // Klasse für hohen Kontrast
    if (preferences.highContrast) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }

    // Klasse für größeren Text
    if (preferences.largeText) {
      document.documentElement.classList.add("large-text");
    } else {
      document.documentElement.classList.remove("large-text");
    }

    // Zeilenabstand anpassen
    document.documentElement.style.setProperty(
      "--line-spacing",
      preferences.lineSpacing,
    );

    // Alternative Textanzeige (einfacherer Text)
    if (preferences.alternativeText) {
      document.documentElement.classList.add("alternative-text");
    } else {
      document.documentElement.classList.remove("alternative-text");
    }

    // Animationen überspringen
    if (preferences.skipAnimations) {
      document.documentElement.classList.add("skip-animations");
    } else {
      document.documentElement.classList.remove("skip-animations");
    }

    // Speichern der Einstellungen im localStorage
    localStorage.setItem(
      "accessibilityPreferences",
      JSON.stringify(preferences),
    );
  }, [preferences]);

  // Einstellungen beim ersten Laden aus localStorage wiederherstellen
  useEffect(() => {
    const savedPreferences = localStorage.getItem("accessibilityPreferences");
    if (savedPreferences) {
      try {
        setPreferences(JSON.parse(savedPreferences));
      } catch (error) {
        console.error(
          "Fehler beim Laden der Barrierefreiheitseinstellungen:",
          error,
        );
      }
    }

    // Medienabfrage Listener für Systemeinstellungen
    const motionMediaQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const contrastMediaQuery = window.matchMedia("(prefers-contrast: more)");

    const handleMotionPreferenceChange = (e: MediaQueryListEvent) => {
      setPreferences((prev) => ({ ...prev, reducedMotion: e.matches }));
    };

    const handleContrastPreferenceChange = (e: MediaQueryListEvent) => {
      setPreferences((prev) => ({ ...prev, highContrast: e.matches }));
    };

    motionMediaQuery.addEventListener("change", handleMotionPreferenceChange);
    contrastMediaQuery.addEventListener(
      "change",
      handleContrastPreferenceChange,
    );

    return () => {
      motionMediaQuery.removeEventListener(
        "change",
        handleMotionPreferenceChange,
      );
      contrastMediaQuery.removeEventListener(
        "change",
        handleContrastPreferenceChange,
      );
    };
  }, []);

  // Funktionen zum Ändern der Einstellungen
  const setReducedMotion = (value: boolean) =>
    setPreferences((prev) => ({ ...prev, reducedMotion: value }));

  const setHighContrast = (value: boolean) =>
    setPreferences((prev) => ({ ...prev, highContrast: value }));

  const setLargeText = (value: boolean) =>
    setPreferences((prev) => ({ ...prev, largeText: value }));

  const setLineSpacing = (value: string) =>
    setPreferences((prev) => ({ ...prev, lineSpacing: value }));

  const setAlternativeText = (value: boolean) =>
    setPreferences((prev) => ({ ...prev, alternativeText: value }));

  const setSkipAnimations = (value: boolean) =>
    setPreferences((prev) => ({ ...prev, skipAnimations: value }));

  const setSoundFeedback = (value: boolean) =>
    setPreferences((prev) => ({ ...prev, soundFeedback: value }));

  const resetToDefaults = () => setPreferences(defaultPreferences);

  return {
    preferences,
    setReducedMotion,
    setHighContrast,
    setLargeText,
    setLineSpacing,
    setAlternativeText,
    setSkipAnimations,
    setSoundFeedback,
    resetToDefaults,
  };
}
