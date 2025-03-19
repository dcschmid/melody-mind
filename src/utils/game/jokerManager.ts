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
        return 2;
      case Difficulty.MEDIUM:
        return 1;
      case Difficulty.HARD:
        return 0;
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
  }

  public getCurrentJokerState(): JokerState {
    return { ...this.jokerState };
  }

  private useJoker(): void {
    console.log("useJoker aufgerufen: ", {
      jokerCount: this.jokerState.jokerCount,
      jokerUsed: this.jokerState.jokerUsed,
      currentQuestion: this.currentQuestion !== null,
    });

    if (
      this.jokerState.jokerCount <= 0 ||
      this.jokerState.jokerUsed ||
      !this.currentQuestion
    ) {
      console.log("Joker kann nicht verwendet werden");
      return;
    }

    this.jokerState.jokerCount--;
    this.jokerState.jokerUsed = true;

    const { options, correctAnswer } = this.currentQuestion;
    let availableOptions = [...options];

    // Korrekte Antwort aus den verfügbaren Optionen entfernen
    const correctIndex = availableOptions.findIndex(
      (option) => option === correctAnswer,
    );
    if (correctIndex !== -1) {
      availableOptions.splice(correctIndex, 1);
    }

    // Zufällig zwei Optionen löschen
    for (let i = 0; i < 2 && availableOptions.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * availableOptions.length);
      const optionToRemove = availableOptions[randomIndex];

      const buttons = document.querySelectorAll("#options button");
      buttons.forEach((button) => {
        if (button.textContent?.trim() === optionToRemove) {
          button.setAttribute("disabled", "true");
          button.classList.add("opacity-50", "cursor-not-allowed");
        }
      });

      availableOptions.splice(randomIndex, 1);
    }

    this.updateJokerUI();

    // Event auslösen, dass der Joker verwendet wurde
    document.dispatchEvent(
      new CustomEvent("jokerUsed", { detail: { jokerState: this.jokerState } }),
    );
  }

  private updateJokerUI(): void {
    if (this.jokerButton) {
      const disabled =
        this.jokerState.jokerCount <= 0 || this.jokerState.jokerUsed;
      this.jokerButton.disabled = disabled;

      if (disabled) {
        this.jokerButton.setAttribute("disabled", "true");
        this.jokerButton.classList.add("opacity-50", "cursor-not-allowed");
      } else {
        this.jokerButton.removeAttribute("disabled");
        this.jokerButton.classList.remove("opacity-50", "cursor-not-allowed");
      }
    }

    if (this.jokerCounter) {
      const translations = {
        de: `${this.jokerState.jokerCount} übrig`,
        en: `${this.jokerState.jokerCount} remaining`,
        es: `${this.jokerState.jokerCount} restantes`,
        fr: `${this.jokerState.jokerCount} restants`,
        it: `${this.jokerState.jokerCount} rimanenti`,
        // Weitere Übersetzungen hier hinzufügen
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
