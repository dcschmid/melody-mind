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
 * Performs a complete logout by clearing all authentication data
 * and triggering auth logout events
 */
export function performCompleteLogout(): void {
  // PREVENT RECURSIVE CALLS
  if (isLoggingOut) {
    console.log("🚪 Logout already in progress, skipping");
    return;
  }

  console.log("🚪 Performing complete logout...");
  isLoggingOut = true; // Set flag to prevent recursive calls

  // Reset validation counters and prevent further validations
  validationAttempts = MAX_VALIDATION_ATTEMPTS + 1; // Stop further validations
  validationInProgress = false;
  lastValidationAttempt = 0;

  // Call server-side logout to clear HttpOnly cookies
  fetch("/de/api/auth/logout", {
    method: "POST",
    credentials: "include",
  })
    .then((response) => {
      if (response.ok) {
        console.log("✅ Server-side logout successful");
      } else {
        console.warn("⚠️ Server-side logout failed, but continuing client-side cleanup");
      }
    })
    .catch((error) => {
      console.warn("⚠️ Server-side logout error:", error);
    });

  // Clear all authentication-related localStorage entries
  removeLocalStorage("auth_status");
  removeLocalStorage("user");
  removeLocalStorage("user_data");
  removeLocalStorage("access_token");
  removeLocalStorage("auth_token");

  // Clear any other potential auth-related localStorage entries
  try {
    Object.keys(localStorage).forEach((key) => {
      if (key.includes("auth") || key.includes("user") || key.includes("token")) {
        removeLocalStorage(key);
      }
    });
  } catch (error) {
    console.warn("Error clearing additional localStorage entries:", error);
  }

  // Clear sessionStorage as well
  try {
    sessionStorage.clear();
  } catch (error) {
    console.warn("Error clearing sessionStorage:", error);
  }

  // Trigger logout event for other components
  try {
    window.dispatchEvent(new CustomEvent("auth:logout"));

    // Also trigger storage event to notify other tabs/windows
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "auth_status",
        newValue: null,
        oldValue: "authenticated",
      })
    );
  } catch (error) {
    console.warn("Error dispatching logout events:", error);
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
 * Liest einen Cookie-Wert
 * @param {string} name - Der Name des Cookies
 * @returns {string | null} - Der Cookie-Wert oder null wenn nicht gefunden
 */
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }
  return null;
}

// Rate limiting für Session-Validierung
let lastValidationAttempt = 0;
let validationInProgress = false;
const VALIDATION_COOLDOWN = 10000; // 10 Sekunden Cooldown
const MAX_VALIDATION_ATTEMPTS = 3;
let validationAttempts = 0;
let isLoggingOut = false; // Flag to prevent validation during logout

/**
 * Reset session validation counters (called on successful login)
 */
export function resetSessionValidation(): void {
  console.log("🔄 Resetting session validation counters");
  validationAttempts = 0;
  lastValidationAttempt = 0;
  validationInProgress = false;
  isLoggingOut = false; // Reset logout flag
}

/**
 * Validiert die Session mit dem Server und erneuert sie bei Bedarf
 * @returns {Promise<boolean>} - Promise mit dem Authentifizierungsstatus
 */
export async function validateAndRefreshSession(): Promise<boolean> {
  try {
    // STOP validation if logout is in progress
    if (isLoggingOut) {
      console.log("🚪 Logout in progress, skipping validation");
      return false;
    }

    // Rate limiting: Vermeide zu häufige Validierungen
    const now = Date.now();
    if (now - lastValidationAttempt < VALIDATION_COOLDOWN) {
      console.log("⏳ Session validation on cooldown, using local status");
      return isUserAuthenticated();
    }

    // Vermeide concurrent validations
    if (validationInProgress) {
      console.log("⏳ Session validation already in progress");
      return isUserAuthenticated();
    }

    // Max attempts erreicht - beende Validierung
    if (validationAttempts >= MAX_VALIDATION_ATTEMPTS) {
      console.log("❌ Max validation attempts reached, forcing logout");
      performCompleteLogout();
      return false;
    }

    validationInProgress = true;
    lastValidationAttempt = now;
    validationAttempts++;

    // Prüfe zuerst lokalen Auth-Status
    const localIsAuthenticated = isUserAuthenticated();
    if (!localIsAuthenticated) {
      validationInProgress = false;
      return false;
    }

    console.log(
      `🔍 Starting session validation (attempt ${validationAttempts}/${MAX_VALIDATION_ATTEMPTS})`
    );

    // Versuche eine simple API-Anfrage um Session zu testen
    const testResponse = await fetch("/de/api/user/profile", {
      method: "GET",
      credentials: "include",
    });

    if (testResponse.ok) {
      // Session ist gültig - reset counters
      console.log("✅ Session is valid");
      validationAttempts = 0;
      validationInProgress = false;
      return true;
    } else if (testResponse.status === 401) {
      // Session abgelaufen, versuche Refresh
      console.log("🔄 Session expired, attempting refresh...");

      const refreshResponse = await fetch("/de/api/auth/refresh-token", {
        method: "POST",
        credentials: "include",
      });

      if (refreshResponse.ok) {
        console.log("✅ Session successfully refreshed");
        validationAttempts = 0; // Reset bei erfolgreichem Refresh
        validationInProgress = false;
        return true;
      } else {
        // Refresh fehlgeschlagen, logout
        console.log("❌ Session refresh failed, logging out");
        performCompleteLogout();
        validationInProgress = false;
        return false;
      }
    }

    validationInProgress = false;
    return false;
  } catch (error) {
    console.error("Error validating session:", error);
    validationInProgress = false;
    return false;
  }
}

/**
 * Prüft, ob der Benutzer authentifiziert ist
 * Prüft sowohl localStorage als auch Cookies für auth_status
 * @returns {boolean} - true wenn der Benutzer authentifiziert ist, sonst false
 */
export function isUserAuthenticated(): boolean {
  // Primäre Methode: auth_status im localStorage prüfen
  const localAuthStatus = localStorage.getItem("auth_status");
  const localIsAuthenticated = localAuthStatus === "authenticated";

  // Sekundäre Methode: auth_status Cookie prüfen
  const cookieAuthStatus = getCookie("auth_status");
  const cookieIsAuthenticated = cookieAuthStatus === "authenticated";

  // Wenn Cookie gesetzt ist aber localStorage nicht, localStorage aktualisieren
  if (cookieIsAuthenticated && !localIsAuthenticated) {
    setLocalStorage("auth_status", "authenticated");

    // Auch User-Daten aus Cookie in localStorage kopieren
    const userDataCookie = getCookie("user_data");
    if (userDataCookie) {
      try {
        const userData = JSON.parse(decodeURIComponent(userDataCookie));
        setLocalStorage("user", JSON.stringify(userData));
      } catch (error) {
        console.error("Fehler beim Parsen der User-Daten:", error);
      }
    }
  }

  const isAuthenticated = localIsAuthenticated || cookieIsAuthenticated;

  // Debug-Ausgabe mit sinnvollen Debug-Infos
  if (process.env.NODE_ENV === "development") {
    console.debug("Auth Debug:", {
      localAuthStatus,
      cookieAuthStatus,
      localIsAuthenticated,
      cookieIsAuthenticated,
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
    resetSessionValidation(); // Reset validation counters on login
    checkAuthCallback();
  };

  const handleLogout = (): void => {
    // Clear all authentication-related localStorage entries
    removeLocalStorage("auth_status");
    removeLocalStorage("user");
    removeLocalStorage("user_data");
    removeLocalStorage("access_token");
    removeLocalStorage("auth_token");

    // Clear any other potential auth-related localStorage entries
    try {
      Object.keys(localStorage).forEach((key) => {
        if (key.includes("auth") || key.includes("user") || key.includes("token")) {
          removeLocalStorage(key);
        }
      });
    } catch (error) {
      console.warn("Error clearing additional localStorage entries:", error);
    }

    // Clear sessionStorage as well
    try {
      sessionStorage.clear();
    } catch (error) {
      console.warn("Error clearing sessionStorage:", error);
    }

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
