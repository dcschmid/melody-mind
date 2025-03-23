import { Difficulty } from "./jokerUtils";

interface JokerElements {
  jokerButton?: HTMLButtonElement | null;
  jokerCounter?: HTMLElement | null;
}

interface JokerManagerOptions {
  difficulty: Difficulty;
  elements: JokerElements;
}

interface JokerState {
  jokerCount: number;
  jokerUsed: boolean;
}

interface Question {
  options: any[];
  correctAnswer: string;
}

export class JokerManager {
  private readonly difficulty: Difficulty;
  private readonly jokerButton: HTMLButtonElement | null;
  private readonly jokerCounter: HTMLElement | null;
  private currentQuestion: Question | null = null;
  private jokerState: JokerState;
  private clickListener: ((e: MouseEvent) => void) | null = null;

  constructor(options: JokerManagerOptions) {
    this.difficulty = options.difficulty;
    this.jokerButton = options.elements.jokerButton || null;
    this.jokerCounter = options.elements.jokerCounter || null;

    this.jokerState = {
      jokerCount: this.getInitialJokerCount(),
      jokerUsed: false,
    };

    this.init();
  }

  private init(): void {
    console.log("JokerManager wird initialisiert...");
    console.log("Joker Button Element:", this.jokerButton);

    // Diese Funktion als Class-Property speichern, damit wir sie später entfernen können
    this.clickListener = (e: MouseEvent) => this.handleJokerClick(e);

    // Event-Listener zum Joker-Button hinzufügen
    if (this.jokerButton) {
      console.log("Füge Click-Event zum Joker-Button hinzu");
      this.jokerButton.addEventListener("click", this.clickListener);
    } else {
      console.error("Joker Button nicht gefunden während der Initialisierung");
    }

    // Auch auf das benutzerdefinierte Event hören, das wir in Joker.astro hinzugefügt haben
    document.addEventListener("jokerUsed", () => {
      console.log("JokerUsed Event empfangen");
      this.useJoker();
    });

    this.updateJokerUI();
  }

  public cleanup(): void {
    if (this.jokerButton && this.clickListener) {
      this.jokerButton.removeEventListener("click", this.clickListener);
    }
    document.removeEventListener("jokerUsed", () => this.useJoker());
  }

  private getInitialJokerCount(): number {
    switch (this.difficulty) {
      case Difficulty.EASY:
        return 3;
      case Difficulty.MEDIUM:
        return 5;
      case Difficulty.HARD:
        return 7;
      default:
        return 0;
    }
  }

  private handleJokerClick(e: MouseEvent): void {
    console.log("Joker-Button Klick erkannt");
    e.preventDefault();
    this.useJoker();
  }

  public setCurrentQuestion(question: Question): void {
    this.currentQuestion = question;
    this.jokerState.jokerUsed = false;
    this.updateJokerUI();
    console.log("Neue Frage gesetzt:", question);
  }

  public getCurrentJokerState(): JokerState {
    return { ...this.jokerState };
  }

  private useJoker(): void {
    console.log("useJoker aufgerufen mit folgenden Werten:", {
      jokerCount: this.jokerState.jokerCount,
      jokerUsed: this.jokerState.jokerUsed,
      currentQuestion: this.currentQuestion !== null,
    });

    // Wenn Joker nicht verwendet werden kann, frühzeitig zurückkehren
    if (
      this.jokerState.jokerCount <= 0 ||
      this.jokerState.jokerUsed ||
      !this.currentQuestion
    ) {
      console.log("Joker kann nicht verwendet werden - Bedingungen nicht erfüllt");
      return;
    }

    // Reduziere Joker-Anzahl und setze Status auf verwendet
    this.jokerState.jokerCount--;
    this.jokerState.jokerUsed = true;

    const { options, correctAnswer } = this.currentQuestion;
    
    // Eindeutige Debug-Ausgaben für bessere Fehlererkennung
    console.log("Korrekte Antwort:", correctAnswer);
    console.log("Alle verfügbaren Optionen:", options);
    
    // Das Ausblenden der falschen Antworten erfolgt hier
    try {
      // Identifiziere falsche Antworten (alles außer der korrekten Antwort)
      const wrongOptions = options.filter(option => option !== correctAnswer);
      console.log("Falsche Antworten:", wrongOptions);
      
      // ZUSÄTZLICHE SICHERHEITSÜBERPRÜFUNG: 
      // Stellen wir sicher, dass die korrekte Antwort wirklich nicht in wrongOptions ist
      if (wrongOptions.includes(correctAnswer)) {
        console.error("KRITISCHER FEHLER: Korrekte Antwort fälschlicherweise in wrongOptions!");
        return; // Breche ab, wenn etwas schief gelaufen ist
      }
      
      if (wrongOptions.length < 2) {
        console.warn("Nicht genügend falsche Antworten für den 50:50 Joker");
        return;
      }
      
      // Wähle zufällig 2 falsche Antworten zum Ausblenden aus
      let toHide = [...wrongOptions];
      if (toHide.length > 2) {
        toHide = toHide
          .sort(() => Math.random() - 0.5) // Zufällige Reihenfolge
          .slice(0, 2);                     // Nimm die ersten 2
      }
      
      console.log("Diese falschen Optionen werden ausgeblendet:", toHide);
      
      // Direkter Zugriff auf den Options-Container
      const optionsContainer = document.getElementById("options");
      if (!optionsContainer) {
        console.error("Options-Container nicht gefunden!");
        return;
      }
      
      // Alle Antwort-Buttons finden
      const allButtons = Array.from(optionsContainer.querySelectorAll("button"));
      console.log(`Gefundene Antwort-Buttons: ${allButtons.length}`);
      
      // Verbesserte Methode zum Vergleichen von Button-Text mit Optionen
      // Normalisiere Texte für besseren Vergleich
      function normalizeText(text: string): string {
        return text.trim().toLowerCase().replace(/\s+/g, ' ');
      }
      
      const normalizedCorrectAnswer = normalizeText(correctAnswer);
      const normalizedToHide = toHide.map(opt => normalizeText(opt));
      
      // Debug-Ausgabe für normalisierten Text
      console.log("Normalisierte korrekte Antwort:", normalizedCorrectAnswer);
      console.log("Normalisierte auszublendende Optionen:", normalizedToHide);
      
      // Identifiziere den Button mit der korrekten Antwort
      let correctButton: HTMLButtonElement | null = null;
      allButtons.forEach(button => {
        const normalizedButtonText = normalizeText(button.textContent || "");
        console.log(`Button Text: "${button.textContent}" -> Normalisiert: "${normalizedButtonText}"`);
        
        if (normalizedButtonText === normalizedCorrectAnswer) {
          correctButton = button;
          console.log("Korrekter Antwort-Button identifiziert:", normalizedButtonText);
        }
      });
      
      // Blende nur falsche Antworten aus und halte Zählung
      let hiddenCount = 0;
      allButtons.forEach(button => {
        const normalizedButtonText = normalizeText(button.textContent || "");
        
        // SICHERSTELLUNG: Blende niemals den korrekten Button aus
        if (normalizedButtonText === normalizedCorrectAnswer) {
          console.log("Überspringe korrekten Button:", normalizedButtonText);
          return; // Überspringen mit return in einer forEach-Schleife
        }
        
        // Fuzzy-Matching: Prüfe, ob der normalisierte Text in einer der zu versteckenden Optionen enthalten ist
        const shouldHide = normalizedToHide.some(hideText => 
          normalizedButtonText.includes(hideText) || hideText.includes(normalizedButtonText)
        );
        
        // Blende nur Buttons aus, die übereinstimmen
        if (shouldHide) {
          console.log(`Button zum Ausblenden gefunden: "${button.textContent}" (normalisiert: "${normalizedButtonText}")`);
          // Mehrere Methoden zum Ausblenden anwenden
          button.style.display = "none";
          button.style.visibility = "hidden";
          button.classList.add("hidden");
          button.disabled = true;
          button.setAttribute("aria-hidden", "true");
          button.setAttribute("data-hidden-by-joker", "true");
          hiddenCount++;
        }
      });
      
      console.log(`${hiddenCount} falsche Buttons wurden ausgeblendet`);
      
      // Fallback, falls keine Buttons ausgeblendet wurden
      if (hiddenCount === 0) {
        console.warn("Keine Buttons zum Ausblenden gefunden - versuche alternativen Ansatz");
        this.tryAlternativeHiding(allButtons, normalizedCorrectAnswer, normalizedToHide);
      }
    } catch (error) {
      console.error("Fehler beim Ausblenden der Optionen:", error);
    }

    // UI aktualisieren und Event auslösen
    this.updateJokerUI();
    
    // Ankündigung für Screenreader - verwende die selbstdefinierte Methode
    this.announceJokerUsage(2); // Wir versuchen immer, 2 Optionen zu entfernen
  }
  
  /**
   * Verbesserte Ankündigung der Joker-Verwendung für Screenreader
   */
  private announceJokerUsage(removedCount: number): void {
    const announcement = document.createElement("div");
    announcement.setAttribute("aria-live", "assertive");
    announcement.setAttribute("role", "status");
    announcement.className = "sr-only";
    
    const lang = document.documentElement.lang || "en";
    const remaining = this.jokerState.jokerCount;
    
    let message = "";
    if (lang === "de") {
      message = `50:50 Joker verwendet. ${removedCount} falsche Antworten wurden ausgeblendet. Noch ${remaining} Joker verfügbar.`;
    } else {
      message = `50:50 Joker used. ${removedCount} wrong answers have been hidden. ${remaining} jokers remaining.`;
    }
    
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    setTimeout(() => announcement.remove(), 3000);
  }

  /**
   * Alternative Methode zum Ausblenden, die direkter mit den DOM-Elementen arbeitet
   * und weniger auf exakte Textübereinstimmung angewiesen ist
   */
  private tryAlternativeHiding(
    buttons: HTMLButtonElement[], 
    normalizedCorrectAnswer: string, 
    normalizedToHide: string[]
  ): void {
    console.log("Alternative Ausblendmethode wird verwendet");
    
    // Normalisiere den Text für bessere Vergleiche
    function normalizeText(text: string): string {
      return text.trim().toLowerCase().replace(/\s+/g, ' ');
    }
    
    // Buttons nach dem richtigen und falschen sortieren
    const wrongButtons: HTMLButtonElement[] = [];
    let correctButton: HTMLButtonElement | null = null;
    
    buttons.forEach(button => {
      const normalizedButtonText = normalizeText(button.textContent || "");
      console.log(`Alt-Methode prüft Button: "${button.textContent}" -> "${normalizedButtonText}"`);
      
      if (normalizedButtonText === normalizedCorrectAnswer || 
          normalizedButtonText.includes(normalizedCorrectAnswer) || 
          normalizedCorrectAnswer.includes(normalizedButtonText)) {
        correctButton = button;
        console.log("Alt-Methode: Korrekter Button identifiziert:", normalizedButtonText);
      } else {
        wrongButtons.push(button);
      }
    });
    
    console.log(`Alternative Methode: ${wrongButtons.length} falsche Buttons gefunden`);
    
    // SICHERHEITSCHECK: Stelle sicher, dass wir den korrekten Button gefunden haben
    if (!correctButton) {
      console.warn("Alt-Methode: Korrekter Button konnte nicht identifiziert werden - NOPLAN-Strategie");
      // Wenn wir den korrekten Button nicht identifizieren können, blenden wir einfach 2 zufällige Buttons aus
      if (buttons.length >= 3) {
        const shuffledButtons = [...buttons].sort(() => Math.random() - 0.5);
        // Blende einfach die ersten zwei aus, und hoffe, dass nicht die richtige dabei ist
        this.hideButtons(shuffledButtons.slice(0, 2));
      }
      return;
    }
    
    // Wenn wir mindestens 2 falsche Buttons haben, blende zufällig 2 aus
    if (wrongButtons.length >= 2) {
      const randomizedWrongButtons = [...wrongButtons].sort(() => Math.random() - 0.5);
      const buttonsToHide = randomizedWrongButtons.slice(0, 2);
      this.hideButtons(buttonsToHide);
      
      console.log(`${buttonsToHide.length} Buttons wurden mit der alternativen Methode ausgeblendet`);
    } else if (wrongButtons.length === 1) {
      // Wenn nur ein falscher Button gefunden wurde, blende diesen aus
      this.hideButtons(wrongButtons);
      console.log("Nur ein falscher Button wurde mit der alternativen Methode ausgeblendet");
    } else {
      console.error("Nicht genügend falsche Buttons für 50:50 Joker gefunden");
    }
  }
  
  /**
   * Hilfsmethode zum Ausblenden von Buttons
   */
  private hideButtons(buttons: HTMLButtonElement[]): void {
    buttons.forEach(button => {
      console.log(`Blende Button aus: "${button.textContent?.trim()}"`);
      button.style.display = "none";
      button.style.visibility = "hidden";
      button.classList.add("hidden");
      button.disabled = true;
      button.setAttribute("aria-hidden", "true");
      button.setAttribute("data-hidden-by-joker", "true");
    });
  }

  private updateJokerUI(): void {
    if (this.jokerButton) {
      const disabled =
        this.jokerState.jokerCount <= 0 || this.jokerState.jokerUsed;
      this.jokerButton.disabled = disabled;

      if (disabled) {
        this.jokerButton.setAttribute("disabled", "true");
        this.jokerButton.classList.add("opacity-50", "cursor-not-allowed");
        this.jokerButton.setAttribute("aria-disabled", "true");
      } else {
        this.jokerButton.removeAttribute("disabled");
        this.jokerButton.classList.remove("opacity-50", "cursor-not-allowed");
        this.jokerButton.setAttribute("aria-disabled", "false");
      }
    }

    if (this.jokerCounter) {
      const translations = {
        de: `${this.jokerState.jokerCount} übrig`,
        en: `${this.jokerState.jokerCount} remaining`,
        es: `${this.jokerState.jokerCount} restantes`,
        fr: `${this.jokerState.jokerCount} restants`,
        it: `${this.jokerState.jokerCount} rimanenti`,
        pt: `${this.jokerState.jokerCount} restante`,
        da: `${this.jokerState.jokerCount} tilbage`,
        nl: `${this.jokerState.jokerCount} resterend`,
        sv: `${this.jokerState.jokerCount} kvar`,
        fi: `${this.jokerState.jokerCount} jäljellä`,
        // Standard-Fallback:
        default: `${this.jokerState.jokerCount} remaining`,
      };

      const lang =
        (document.documentElement.lang as keyof typeof translations) ||
        "default";
      const text = translations[lang] || translations.default;
      this.jokerCounter.textContent = text;
    }
  }
}
