/**
 * Accessibility (a11y) Client-Side Utilities
 *
 * Diese Datei enthält Funktionen für die clientseitige Verbesserung
 * der Barrierefreiheit in der MelodyMind-Anwendung.
 */

/**
 * Eine versteckte Live-Region für Screenreader-Ankündigungen erstellen oder zurückgeben
 *
 * @returns {HTMLElement} - Das Live-Region-Element
 */
function getOrCreateLiveRegion(): HTMLElement {
  // Suche nach einer existierenden Live-Region
  let liveRegion = document.getElementById("sr-announcer");

  // Wenn keine existiert, erstelle eine neue
  if (!liveRegion) {
    liveRegion = document.createElement("div");
    liveRegion.id = "sr-announcer";
    liveRegion.setAttribute("aria-live", "assertive");
    liveRegion.setAttribute("aria-atomic", "true");
    liveRegion.className = "sr-only";

    // Stil für Screenreader-only
    liveRegion.style.position = "absolute";
    liveRegion.style.width = "1px";
    liveRegion.style.height = "1px";
    liveRegion.style.padding = "0";
    liveRegion.style.margin = "-1px";
    liveRegion.style.overflow = "hidden";
    liveRegion.style.clip = "rect(0, 0, 0, 0)";
    liveRegion.style.whiteSpace = "nowrap";
    liveRegion.style.border = "0";

    document.body.appendChild(liveRegion);
  }

  return liveRegion;
}

/**
 * Kündigt eine Nachricht für Screenreader an
 *
 * @param {string} message - Die anzukündigende Nachricht
 * @param {Object} options - Optionen für die Ankündigung
 * @param {string} options.politeness - "assertive" oder "polite" (Default: "assertive")
 * @param {number} options.clearAfter - Zeit in ms, nach der die Nachricht entfernt wird (Default: 3000)
 */
export function announceForScreenReader(
  message: string,
  options: { politeness?: "assertive" | "polite"; clearAfter?: number } = {}
): void {
  const { politeness = "assertive", clearAfter = 3000 } = options;

  // Live-Region holen oder erstellen
  const liveRegion = getOrCreateLiveRegion();

  // Politeness-Attribut setzen
  liveRegion.setAttribute("aria-live", politeness);

  // Text in die Live-Region einfügen
  liveRegion.textContent = message;

  // Nach einer Verzögerung die Nachricht entfernen, um Platz für neue Ankündigungen zu machen
  setTimeout(() => {
    liveRegion.textContent = "";
  }, clearAfter);
}

/**
 * Fokussiert das erste fokussierbare Element in einem Container
 *
 * @param {HTMLElement|string} container - Der Container oder seine ID
 * @returns {boolean} - true, wenn der Fokus gesetzt wurde, sonst false
 */
export function focusFirstElement(container: HTMLElement | string): boolean {
  // Container-Element erhalten
  const containerEl =
    typeof container === "string" ? document.getElementById(container) : container;

  if (!containerEl) {
    console.warn(
      `Container '${typeof container === "string" ? container : "Element"}' nicht gefunden`
    );
    return false;
  }

  // Fokussierbare Elemente finden
  const focusableElements = containerEl.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), details:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );

  // Wenn fokussierbare Elemente gefunden wurden, das erste fokussieren
  if (focusableElements.length > 0) {
    // Delay hinzufügen, um sicherzustellen, dass DOM-Updates abgeschlossen sind
    setTimeout(() => {
      focusableElements[0].focus();
    }, 50);
    return true;
  }

  console.warn(`Keine fokussierbaren Elemente in Container gefunden`);
  return false;
}

/**
 * Richtet Tastaturnavigation für eine Gruppe interaktiver Elemente ein
 * Ermöglicht Navigation mit Pfeiltasten zwischen den Elementen
 *
 * @param {string} containerId - ID des Containers mit den Elementen
 * @param {string} elementsSelector - CSS-Selektor für die navigierbaren Elemente
 */
export function setupKeyboardNavigation(containerId: string, elementsSelector: string): void {
  const container = document.getElementById(containerId);

  if (!container) {
    console.warn(`Container mit ID '${containerId}' nicht gefunden`);
    return;
  }

  container.addEventListener("keydown", (event) => {
    if (!(event instanceof KeyboardEvent)) {
      return;
    }

    // Nur bei Pfeil-Tasten weiter (links, rechts, oben, unten)
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
      return;
    }

    const elements = Array.from(container.querySelectorAll<HTMLElement>(elementsSelector));
    if (elements.length === 0) {
      return;
    }

    // Aktuelles Element finden (das, das gerade fokussiert ist)
    const currentElement = document.activeElement as HTMLElement;
    const currentIndex = elements.indexOf(currentElement);

    if (currentIndex === -1) {
      return;
    }

    // Richtung bestimmen und nächstes Element berechnen
    let nextIndex;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (currentIndex + 1) % elements.length; // Zum nächsten, oder zurück zum Anfang
    } else {
      nextIndex = (currentIndex - 1 + elements.length) % elements.length; // Zum vorherigen, oder zum Ende
    }

    // Fokus setzen
    elements[nextIndex].focus();

    // Standard-Scroll-Verhalten verhindern
    event.preventDefault();
  });

  // Verbesserung: Beim Wechsel in den Container mit Tab das erste Element fokussieren
  const firstElement = container.querySelector<HTMLElement>(elementsSelector);
  if (firstElement) {
    firstElement.tabIndex = 0; // Erstes Element ist standard-tabbable

    // Andere Elemente werden nur über Pfeiltasten erreicht
    Array.from(container.querySelectorAll<HTMLElement>(elementsSelector))
      .slice(1)
      .forEach((element) => {
        element.tabIndex = -1;
      });
  }
}
