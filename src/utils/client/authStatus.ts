/**
 * Client-Side Authentication Status Utilities
 *
 * Diese Datei enthält Funktionen zur Verwaltung des Authentifizierungsstatus auf Client-Seite.
 * Da wir mit HttpOnly Cookies arbeiten, verwenden wir localStorage als Proxy für den Auth-Status.
 *
 * @module authStatus
 */

/**
 * Prüft, ob ein bestimmter Schlüssel im localStorage existiert
 * @param {string} key - Der zu prüfende Schlüssel
 * @returns {boolean} - true wenn der Schlüssel existiert und einen Wert hat, sonst false
 */
export function checkLocalStorage(key: string): boolean {
  try {
    const value = localStorage.getItem(key);
    return value !== null;
  } catch (error) {
    console.error("Fehler beim Zugriff auf localStorage:", error);
    return false;
  }
}

/**
 * Setzt einen Wert im localStorage mit Fehlerbehandlung
 * @param {string} key - Der Schlüssel
 * @param {string} value - Der zu speichernde Wert
 * @returns {boolean} - true wenn erfolgreich, false wenn fehlgeschlagen
 */
export function setLocalStorage(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error("Fehler beim Setzen von localStorage:", error);
    return false;
  }
}

/**
 * Entfernt einen Schlüssel aus dem localStorage mit Fehlerbehandlung
 * @param {string} key - Der zu entfernende Schlüssel
 * @returns {boolean} - true wenn erfolgreich, false wenn fehlgeschlagen
 */
export function removeLocalStorage(key: string): boolean {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error("Fehler beim Entfernen aus localStorage:", error);
    return false;
  }
}

/**
 * Aktualisiert die ARIA-Attribute basierend auf Sichtbarkeit
 * Wenn ein Element sichtbar ist, wird aria-hidden="false" gesetzt und Fokus-Navigation aktiviert.
 * Wenn ein Element versteckt ist, wird aria-hidden="true" gesetzt und Fokus-Navigation deaktiviert.
 *
 * @param {HTMLElement} element - Das zu aktualisierende Element
 * @param {boolean} isVisible - Ob das Element sichtbar sein soll
 */
export function updateAriaVisibility(element: HTMLElement | null, isVisible: boolean): void {
  if (!element) {
    return;
  }

  element.setAttribute("aria-hidden", isVisible ? "false" : "true");

  // Wenn das Element sichtbar ist, Tab-Navigation ermöglichen, sonst deaktivieren
  const focusableElements = element.querySelectorAll(
    'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
  );

  focusableElements.forEach((el) => {
    if (isVisible) {
      (el as HTMLElement).removeAttribute("tabindex");
    } else {
      (el as HTMLElement).setAttribute("tabindex", "-1");
    }
  });
}

/**
 * Prüft, ob der Benutzer authentifiziert ist
 * Da das access_token Cookie HttpOnly ist, können wir es nicht direkt lesen
 * Stattdessen verwenden wir den auth_status im localStorage
 * @returns {boolean} - true wenn der Benutzer authentifiziert ist, sonst false
 */
export function isUserAuthenticated(): boolean {
  // Primäre Methode: auth_status im localStorage prüfen
  const isAuthenticated =
    checkLocalStorage("auth_status") && localStorage.getItem("auth_status") === "authenticated";

  // Debug-Ausgabe mit sinnvollen Debug-Infos
  if (process.env.NODE_ENV === "development") {
    console.debug("Auth Debug:", {
      localAuthStatus: localStorage.getItem("auth_status"),
      isAuthenticated,
      authStatusExists: checkLocalStorage("auth_status"),
    });
  }

  return isAuthenticated;
}

/**
 * Aktualisiert die Sichtbarkeit einer Sektion mit Übergangseffekt und optimierter Barrierefreiheit
 * Ändert gleichzeitig die visuellen Eigenschaften, Zugänglichkeitsattribute und Fokussteuerung
 *
 * @param {HTMLElement} element - Das zu aktualisierende Element
 * @param {boolean} show - Ob das Element angezeigt werden soll
 * @returns {void}
 */
export function updateSectionVisibility(element: HTMLElement | null, show: boolean): void {
  if (!element) {
    return;
  }

  // Fokussierbare Elemente innerhalb des Elements finden
  const focusableSelector = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "textarea:not([disabled])",
    "select:not([disabled])",
    "details",
    '[tabindex]:not([tabindex="-1"])',
  ].join(", ");

  const focusableElements = element.querySelectorAll(focusableSelector);

  if (show) {
    // 1. Zugänglichkeitsattribute aktualisieren, bevor visuelle Änderungen vorgenommen werden
    element.setAttribute("aria-hidden", "false");

    // 2. Korrekte Display-Eigenschaften setzen
    element.style.display = "flex";
    element.style.flexDirection = "column";
    element.style.alignItems = "center";
    element.style.visibility = "visible";

    // 3. Fokussierbare Elemente aktivieren
    focusableElements.forEach((el) => {
      // Original-Tabindex wiederherstellen (falls vorhanden)
      const originalTabindex = (el as HTMLElement).getAttribute("data-original-tabindex");
      if (originalTabindex) {
        (el as HTMLElement).setAttribute("tabindex", originalTabindex);
        (el as HTMLElement).removeAttribute("data-original-tabindex");
      } else {
        (el as HTMLElement).removeAttribute("tabindex");
      }
    });

    // 4. Opacity nach kurzer Verzögerung ändern (micro-task)
    requestAnimationFrame(() => {
      element.style.opacity = "1";
    });

    // 5. Optionale Ankündigung für Screenreader
    const liveRegion = document.getElementById("dynamic-announcements");
    if (liveRegion) {
      const sectionName = element.getAttribute("aria-labelledby")
        ? document.getElementById(element.getAttribute("aria-labelledby") || "")?.textContent
        : null;

      if (sectionName) {
        liveRegion.textContent = `${sectionName} ist jetzt verfügbar.`;
      }
    }
  } else {
    // 1. Zuerst Opacity ändern für sanften Übergang
    element.style.opacity = "0";

    // 2. ARIA-Attribute für die Zugänglichkeit sofort aktualisieren
    element.setAttribute("aria-hidden", "true");

    // 3. Fokussierbare Elemente deaktivieren, mit Sicherung des original Tabindex
    focusableElements.forEach((el) => {
      const htmlEl = el as HTMLElement;
      const currentTabindex = htmlEl.getAttribute("tabindex");

      // Original Tabindex speichern, falls er nicht -1 ist
      if (currentTabindex && currentTabindex !== "-1") {
        htmlEl.setAttribute("data-original-tabindex", currentTabindex);
      }

      htmlEl.setAttribute("tabindex", "-1");
    });

    // 4. Warten auf Abschluss der Transition, bevor visibility und display geändert werden
    setTimeout(() => {
      // Prüfen, dass die Opacity immer noch 0 ist (falls updateSectionVisibility erneut aufgerufen wurde)
      if (element.style.opacity === "0") {
        element.style.visibility = "hidden";
        element.style.display = "none";
      }
    }, 300); // Entspricht der Transition-Dauer in CSS
  }
}

/**
 * Initialisiert Cookie-Überwachung mit Debounce-Funktion
 * @param {Function} checkAuthCallback - Funktion, die bei Cookie-Änderungen aufgerufen wird
 * @param {number} interval - Intervall für die Prüfung in Millisekunden
 * @returns {number} - Intervall-ID zum Beenden der Überwachung
 */
export function initCookieWatcher(checkAuthCallback: () => void, interval = 1000): number {
  let previousCookieValue = document.cookie;
  let cookieCheckTimeout: ReturnType<typeof setTimeout> | null = null;

  function debouncedCookieCheck(): void {
    if (cookieCheckTimeout) {
      clearTimeout(cookieCheckTimeout);
    }

    cookieCheckTimeout = setTimeout(() => {
      if (document.cookie !== previousCookieValue) {
        if (process.env.NODE_ENV === "development") {
          console.warn("Cookie-Änderung erkannt");
        }
        previousCookieValue = document.cookie;
        checkAuthCallback();
      }
    }, 300);
  }

  // Cookie-Änderungen in regelmäßigen Abständen prüfen
  return window.setInterval(debouncedCookieCheck, interval);
}

/**
 * Stoppt die Cookie-Überwachung
 * @param {number} watcherId - Die Intervall-ID der zu stoppenden Überwachung
 */
export function stopCookieWatcher(watcherId: number): void {
  if (watcherId) {
    clearInterval(watcherId);
  }
}

/**
 * Registriert event listeners für Authentifizierungsereignisse
 * @param {Function} checkAuthCallback - Funktion, die bei Auth-Änderungen aufgerufen wird
 * @returns {{ remove: Function }} - Objekt mit remove-Methode zum Entfernen der Listener
 */
export function registerAuthEventListeners(checkAuthCallback: () => void): { remove: () => void } {
  const handleLogin = (): void => {
    setLocalStorage("auth_status", "authenticated");
    checkAuthCallback();
  };

  const handleLogout = (): void => {
    removeLocalStorage("auth_status");
    checkAuthCallback();
  };

  const handleVisibilityChange = (): void => {
    if (document.visibilityState === "visible") {
      checkAuthCallback();
    }
  };

  // Event-Listener registrieren
  window.addEventListener("auth:login", handleLogin);
  window.addEventListener("auth:logout", handleLogout);
  document.addEventListener("visibilitychange", handleVisibilityChange);

  // Rückgabe-Objekt mit remove-Methode zum Aufräumen
  return {
    remove: (): void => {
      window.removeEventListener("auth:login", handleLogin);
      window.removeEventListener("auth:logout", handleLogout);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    },
  };
}
