import { handleGameError } from "../error/errorHandlingUtils";

/**
 * Authentication Status Management
 *
 * This module handles authentication state and user session management.
 * Note: Most authentication functionality has been removed as it's no longer needed.
 */

/**
 * Prüft, ob ein bestimmter Schlüssel im localStorage existiert
 *
 */
export function checkLocalStorage(key: string): boolean {
  try {
    const value = localStorage.getItem(key);
    return value !== null;
  } catch (error) {
    handleGameError(error, "localStorage access");
    return false;
  }
}

/**
 * Setzt einen Wert im localStorage mit Fehlerbehandlung
 *
 */
export function setLocalStorage(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    handleGameError(error, "localStorage set");
    return false;
  }
}

/**
 * Entfernt einen Schlüssel aus dem localStorage mit Fehlerbehandlung
 *
 */
export function removeLocalStorage(key: string): boolean {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    handleGameError(error, "localStorage remove");
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
    return;
  }
  isLoggingOut = true; // Set flag to prevent recursive calls

  // Reset validation counters and prevent further validations
  validationAttempts = MAX_VALIDATION_ATTEMPTS + 1; // Stop further validations
  validationInProgress = false;
  lastValidationAttempt = 0;

  // Server-side logout removed - no longer needed

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
  } catch (err) {
    void err; // Silent error handling (explicit to satisfy linter)
  }

  // Clear sessionStorage as well
  try {
    sessionStorage.clear();
  } catch (err) {
    void err; // Silent error handling (explicit to satisfy linter)
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
  } catch (err) {
    void err; // Silent error handling (explicit to satisfy linter)
  }
}

/**
 * Aktualisiert die ARIA-Attribute basierend auf Sichtbarkeit
 * Wenn ein Element sichtbar ist, wird aria-hidden="false" gesetzt und Fokus-Navigation aktiviert.
 * Wenn ein Element versteckt ist, wird aria-hidden="true" gesetzt und Fokus-Navigation deaktiviert.
 *
 *
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
      return false;
    }

    // Rate limiting: Vermeide zu häufige Validierungen
    const now = Date.now();
    if (now - lastValidationAttempt < VALIDATION_COOLDOWN) {
      return false;
    }

    // Vermeide concurrent validations
    if (validationInProgress) {
      return false;
    }

    // Max attempts erreicht - beende Validierung
    if (validationAttempts >= MAX_VALIDATION_ATTEMPTS) {
      performCompleteLogout();
      return false;
    }

    validationInProgress = true;
    lastValidationAttempt = now;
    validationAttempts++;

    // Local auth check removed - always return false
    validationInProgress = false;
    return false;

    // Starting session validation

    // Versuche eine simple API-Anfrage um Session zu testen
    const testResponse = await fetch("/de/api/user/profile", {
      method: "GET",
      credentials: "include",
    });

    if (testResponse.ok) {
      // Session ist gültig - reset counters
      validationAttempts = 0;
      validationInProgress = false;
      return true;
    } else if (testResponse.status === 401) {
      // Session abgelaufen, versuche Refresh

      const refreshResponse = await fetch("/de/api/auth/refresh-token", {
        method: "POST",
        credentials: "include",
      });

      if (refreshResponse.ok) {
        validationAttempts = 0; // Reset bei erfolgreichem Refresh
        validationInProgress = false;
        return true;
      } else {
        // Refresh fehlgeschlagen, logout
        performCompleteLogout();
        validationInProgress = false;
        return false;
      }
    }

    validationInProgress = false;
    return false;
  } catch {
    validationInProgress = false;
    return false;
  }
}

/**
 * Check if user is authenticated
 * @returns {boolean} - true if authenticated, false otherwise
 */
export const isAuthenticated = (): boolean => {
  // Authentication system removed - always return false
  return false;
};

/**
 * Get current user ID
 * @returns {string} - User ID or empty string if not authenticated
 */
export const getCurrentUserId = (): string => {
  // User system removed - always return empty string
  return "";
};

/**
 * Clear authentication data
 * @returns {void} - Clears stored authentication data and session state
 */
export const clearAuthData = (): void => {
  try {
    // Clear any remaining auth-related data
    localStorage.removeItem("auth_status");
    localStorage.removeItem("user");
    sessionStorage.clear();
  } catch (err) {
    void err;
  }
};

/**
 * Prüft, ob der Benutzer im Gastmodus angemeldet ist
 * @returns {boolean} - true wenn der Benutzer als Gast angemeldet ist, sonst false
 */
export function isGuestUser(): boolean {
  // Guest user functionality removed
  return false;
}

/**
 * Prüft, ob der Benutzer vollständig authentifiziert ist (nicht als Gast)
 * @returns {boolean} - true wenn der Benutzer vollständig authentifiziert ist, sonst false
 */
export function isFullyAuthenticated(): boolean {
  // Full authentication functionality removed
  return false;
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
 *
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
 *
 */
export function stopCookieWatcher(watcherId: number): void {
  if (watcherId) {
    clearInterval(watcherId);
  }
}

/**
 * Registriert event listeners für Authentifizierungsereignisse
 *
 */
export function registerAuthEventListeners(checkAuthCallback: () => void): { remove: () => void } {
  const handleLogin = (): void => {
    setLocalStorage("auth_status", "authenticated");
    resetSessionValidation(); // Reset validation counters on login
    checkAuthCallback();
  };

  const handleGuestLogin = (): void => {
    // Guest login doesn't need server-side session validation
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
    } catch (err) {
      void err;
    }

    // Clear sessionStorage as well
    try {
      sessionStorage.clear();
    } catch (err) {
      void err;
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
  window.addEventListener("auth:guest-login", handleGuestLogin);
  window.addEventListener("auth:logout", handleLogout);
  document.addEventListener("visibilitychange", handleVisibilityChange);

  // Rückgabe-Objekt mit remove-Methode zum Aufräumen
  return {
    remove: (): void => {
      window.removeEventListener("auth:login", handleLogin);
      window.removeEventListener("auth:guest-login", handleGuestLogin);
      window.removeEventListener("auth:logout", handleLogout);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    },
  };
}
