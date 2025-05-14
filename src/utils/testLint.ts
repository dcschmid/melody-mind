/**
 * Eine Testdatei für TypeScript ESLint-Regeln und WCAG AAA-Tests
 *
 * Diese Datei enthält Code, der verschiedene ESLint-Regeln
 * für TypeScript und WCAG AAA-Barrierefreiheitsanforderungen demonstriert.
 */

// Import-Reihenfolge sollte konsistent sein
import * as fs from "fs";

// Interface sollte in PascalCase sein (Falsch -> zeigt Fehler)
interface UserScore {
  id: number;
  score: number;
}

/**
 * Berechnet eine Punktzahl basierend auf Basis- und Bonuspunkten
 *
 * @param base - Die Basispunktzahl
 * @param bonus - Die Bonuspunktzahl
 * @returns Die Gesamtpunktzahl
 */
function calculateScore(base: number, bonus: number): number {
  return base + bonus;
}

// "any" sollte vermieden werden (Falsch -> zeigt Fehler)
// const userData: any = {
const userData = {
  name: "Spieler1",
  points: 500,
};

/**
 * Verarbeitet Benutzerdaten und gibt Informationen aus
 *
 * @param user - Benutzerobjekt mit ID und Punktzahl
 */
function processUserData(user: UserScore): void {
  // Unbenutzte Variable - umbenannt mit Unterstrich
  const _id = user.id;

  console.warn(`Benutzer ${user.id} hat ${user.score} Punkte`);
}

/**
 * Lädt Benutzerdaten von der API
 *
 * @param userId - Die ID des Benutzers
 * @returns Ein Promise mit den Benutzerdaten
 */
async function fetchUserData(userId: number): Promise<Record<string, unknown>> {
  const response = await fetch(`/api/users/${userId}`);
  return response.json();
}

/**
 * Lädt Daten und verarbeitet sie
 *
 * @returns Ein Promise mit den verarbeiteten Daten
 */
async function loadData(): Promise<Record<string, unknown>> {
  const data = await fetchUserData(123);
  return data; // Korrekter Rückgabewert
}

/**
 * Testet die Fokus-Verwaltung gemäß WCAG AAA
 * @param elementId - Die ID des Elements, das fokussiert werden soll
 * @returns {boolean} - true, wenn der Fokus erfolgreich gesetzt wurde
 */
export function testFocusManagement(elementId: string): boolean {
  const element = document.getElementById(elementId);
  if (element) {
    // Dies sollte eine Warnung der focus-management Regel auslösen
    element.focus();
    return true;
  }
  return false;
}

/**
 * Korrekte Implementierung der Fokus-Verwaltung gemäß WCAG AAA
 * @param elementId - Die ID des Elements, das fokussiert werden soll
 * @param announcement - Die Ankündigung für Screenreader
 * @returns {boolean} - true, wenn der Fokus erfolgreich gesetzt wurde
 */
export function correctFocusManagement(
  elementId: string,
  announcement: string,
): boolean {
  const element = document.getElementById(elementId);
  if (element) {
    // Korrekte Implementierung mit Ankündigung für Screenreader
    announceToScreenReader(announcement);
    element.focus();
    return true;
  }
  return false;
}

/**
 * Hilfsfunktion zur Ankündigung für Screenreader
 * @param message - Die Nachricht, die angekündigt werden soll
 */
export function announceToScreenReader(message: string): void {
  const announcer = document.getElementById("screen-reader-announcer");
  if (announcer) {
    announcer.textContent = message;
    announcer.setAttribute("aria-live", "assertive");
  } else {
    // Erstelle den Announcer, falls er nicht existiert
    const newAnnouncer = document.createElement("div");
    newAnnouncer.id = "screen-reader-announcer";
    newAnnouncer.className = "sr-only";
    newAnnouncer.setAttribute("aria-live", "assertive");
    newAnnouncer.textContent = message;
    document.body.appendChild(newAnnouncer);
  }
}

// ARIA-Test-Funktionen

/**
 * Erstellt ein interaktives Element mit unvollständigen ARIA-Attributen
 * @returns {HTMLDivElement} - Das erstellte Element
 */
export function createIncompleteAriaButton(): HTMLDivElement {
  const button = document.createElement("div");
  button.setAttribute("role", "button");
  button.textContent = "Klick mich";
  button.addEventListener("click", () => {
    console.log("Geklickt");
  });
  // Fehlt: tabIndex und Keyboard-Handler
  return button;
}

/**
 * Erstellt ein interaktives Element mit vollständigen ARIA-Attributen
 * @returns {HTMLDivElement} - Das erstellte Element
 */
export function createCompleteAriaButton(): HTMLDivElement {
  const button = document.createElement("div");
  button.setAttribute("role", "button");
  button.setAttribute("tabindex", "0");
  button.setAttribute("aria-label", "Interaktiver Button");
  button.textContent = "Klick mich";
  button.addEventListener("click", () => {
    console.log("Geklickt");
  });
  button.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      console.log("Taste gedrückt");
      button.click();
    }
  });
  return button;
}

// Export von Typen mit camelCase (sollte Warnung auslösen)
export interface testInterfaceIncorrect {
  id: string;
  name: string;
}

export { calculateScore, userData, processUserData, fetchUserData, loadData };
