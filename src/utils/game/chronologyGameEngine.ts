/**
 * Chronology Game Engine
 *
 * Handles chronology game logic with loading state management and proper end game handling
 */

import {
  showEndOverlay,
  setupEndOverlay,
  updateEndOverlayScore,
  updateMotivationText,
  animateProgressBar,
} from "../endOverlay.ts";

import { handleEndGame } from "./endGameUtils.ts";

// Setup EndOverlay functionality
setupEndOverlay();

// Make EndOverlay functions globally available for the game class
(
  window as Window & {
    showEndOverlay?: typeof showEndOverlay;
    updateEndOverlayScore?: typeof updateEndOverlayScore;
    updateMotivationText?: typeof updateMotivationText;
    animateProgressBar?: typeof animateProgressBar;
  }
).showEndOverlay = showEndOverlay;
(
  window as Window & {
    showEndOverlay?: typeof showEndOverlay;
    updateEndOverlayScore?: typeof updateEndOverlayScore;
    updateMotivationText?: typeof updateMotivationText;
    animateProgressBar?: typeof animateProgressBar;
  }
).updateEndOverlayScore = updateEndOverlayScore;
(
  window as Window & {
    showEndOverlay?: typeof showEndOverlay;
    updateEndOverlayScore?: typeof updateEndOverlayScore;
    updateMotivationText?: typeof updateMotivationText;
    animateProgressBar?: typeof animateProgressBar;
  }
).updateMotivationText = updateMotivationText;
(
  window as Window & {
    showEndOverlay?: typeof showEndOverlay;
    updateEndOverlayScore?: typeof updateEndOverlayScore;
    updateMotivationText?: typeof updateMotivationText;
    animateProgressBar?: typeof animateProgressBar;
  }
).animateProgressBar = animateProgressBar;

// Game implementation with modern ES6+ features

// Constants
const DIFFICULTY_LEVELS = {
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard",
};

const ITEMS_PER_DIFFICULTY = {
  [DIFFICULTY_LEVELS.EASY]: 4,
  [DIFFICULTY_LEVELS.MEDIUM]: 5,
  [DIFFICULTY_LEVELS.HARD]: 6,
};

// Data loading functions
const loadAlbumsData = async (category: string, language: string) => {
  try {
    // Try to load from the specified language first
    const response = await fetch(`/json/genres/${language}/${category}.json`);

    if (!response.ok) {
      // Fallback to German if the language-specific file doesn't exist
      console.warn(`No albums found for ${language}/${category}, falling back to German`);
      const fallbackResponse = await fetch(`/json/genres/de/${category}.json`);

      if (!fallbackResponse.ok) {
        throw new Error(`Failed to load albums for category: ${category}`);
      }

      return await fallbackResponse.json();
    }

    return await response.json();
  } catch (error) {
    console.error("Error loading albums data:", error);
    throw error;
  }
};

const generateChronologyQuestion = (
  albumsData: Array<{ artist: string; album: string; year: string }>,
  difficulty: string
) => {
  const itemCount = ITEMS_PER_DIFFICULTY[difficulty as keyof typeof ITEMS_PER_DIFFICULTY] || 4;

  if (!albumsData || albumsData.length === 0) {
    throw new Error("No albums data available");
  }

  // Convert albums data to chronology items format
  const allItems = albumsData.map((album, index) => ({
    id: index + 1,
    artist: album.artist,
    title: album.album,
    year: parseInt(album.year),
  }));

  // Group albums by year to avoid duplicates
  const albumsByYear = new Map();
  allItems.forEach((item) => {
    if (!albumsByYear.has(item.year)) {
      albumsByYear.set(item.year, []);
    }
    albumsByYear.get(item.year).push(item);
  });

  // Get unique years sorted chronologically
  const uniqueYears = Array.from(albumsByYear.keys()).sort((a, b) => a - b);

  // Check if we have enough unique years
  if (uniqueYears.length < itemCount) {
    console.warn(
      `Not enough unique years (${uniqueYears.length}) for difficulty ${difficulty} (needs ${itemCount}). Using available years.`
    );
  }

  // Select one album per year, ensuring unique years
  const selectedItems = [];
  const availableYears = [...uniqueYears];

  for (let i = 0; i < Math.min(itemCount, availableYears.length); i++) {
    // Randomly select a year
    const randomYearIndex = Math.floor(Math.random() * availableYears.length);
    const selectedYear = availableYears.splice(randomYearIndex, 1)[0];

    // Randomly select one album from that year
    const albumsInYear = albumsByYear.get(selectedYear);
    const randomAlbumIndex = Math.floor(Math.random() * albumsInYear.length);
    const selectedAlbum = albumsInYear[randomAlbumIndex];

    selectedItems.push(selectedAlbum);
  }

  // Sort selected items by year to get correct order
  const correctOrderItems = selectedItems.sort((a, b) => a.year - b.year);
  const correctOrder = correctOrderItems.map((item) => item.id);

  // Shuffle the items for display
  const shuffledItems = [...selectedItems].sort(() => Math.random() - 0.5);

  return {
    items: shuffledItems,
    correctOrder: correctOrder,
  };
};

// Score evaluation function
const evaluateChronologyAnswer = (userOrder: number[], correctOrder: number[]) => {
  let correctItems = 0;
  const totalItems = correctOrder.length;

  for (let i = 0; i < totalItems; i++) {
    if (userOrder[i] === correctOrder[i]) {
      correctItems++;
    }
  }

  const score = Math.round((correctItems / totalItems) * 100);

  return {
    score: score,
    correctItems: correctItems,
    totalItems: totalItems,
  };
};

// Main game class with modern ES6+ features
class ChronologyGame {
  private container: HTMLElement | null;
  private itemsContainer: HTMLElement | null;
  private moveUpBtn: HTMLElement | null;
  private moveDownBtn: HTMLElement | null;
  private submitBtn: HTMLElement | null;
  private scoreDisplay: HTMLElement | null;
  private roundDisplay: HTMLElement | null;
  private difficulty: string;
  private category: string;
  private categoryName: string;
  private userId: string;
  private language: string;
  private currentItems: Array<{ id: number; artist: string; title: string; year: number }> = [];
  private correctOrder: number[] = [];
  private selectedIndex: number = -1;
  private score: number = 0;
  private round: number = 1;
  private totalRounds: number = 10;
  private albumsData: Array<{ artist: string; album: string; year: string }> | null = null;

  constructor() {
    this.container = document.getElementById("chronology-container");
    this.itemsContainer = document.getElementById("chronology-items-container");
    this.moveUpBtn = document.getElementById("move-up-btn");
    this.moveDownBtn = document.getElementById("move-down-btn");
    this.submitBtn = document.getElementById("submit-btn");
    this.scoreDisplay = document.getElementById("score-display");
    this.roundDisplay = document.getElementById("round-display");

    this.difficulty = this.container?.dataset.difficulty || "easy";
    this.category = this.container?.dataset.category || "";
    this.categoryName = this.container?.dataset.categoryName || "";
    this.userId = this.container?.dataset.userId || "guest";

    // Debug logging
    console.log("ChronologyGame constructor data:");
    console.log("  category (slug):", this.category);
    console.log("  categoryName (display):", this.categoryName);
    console.log("  difficulty:", this.difficulty);
    console.log("  container dataset:", this.container?.dataset);

    // Get language from URL
    const urlPath = window.location.pathname;
    const langMatch = urlPath.match(/^\/([a-z]{2})\//);
    this.language = langMatch ? langMatch[1] : "de";

    this.initializeGame();
  }

  async initializeGame() {
    if (!this.container || !this.itemsContainer) {
      console.error("Required DOM elements not found");
      return;
    }

    try {
      // Load albums data first
      await this.loadAlbumsData();
      this.setupEventListeners();
      await this.loadQuestion();
    } catch (error) {
      console.error("Failed to initialize game:", error);
      this.showError("chronology.error.initialization");
    }
  }

  async loadAlbumsData() {
    try {
      this.albumsData = await loadAlbumsData(this.category, this.language);
    } catch (error) {
      console.error("Error loading albums:", error);
      throw error;
    }
  }

  setupEventListeners() {
    this.moveUpBtn?.addEventListener("click", () => this.moveItem(-1));
    this.moveDownBtn?.addEventListener("click", () => this.moveItem(1));
    this.submitBtn?.addEventListener("click", () => this.submitAnswer());
  }

  async loadQuestion() {
    try {
      if (!this.albumsData) {
        throw new Error("Albums data not loaded");
      }

      // Generate question from real data
      const questionData = generateChronologyQuestion(this.albumsData, this.difficulty);
      this.currentItems = questionData.items;
      this.correctOrder = questionData.correctOrder;

      this.renderItems();
      this.updateControls();
    } catch (error) {
      console.error("Error loading question:", error);
      this.showError("chronology.error.question.load");
    }
  }

  renderItems() {
    if (!this.itemsContainer) {
      return;
    }

    // Remove loading placeholder if it exists
    const loadingPlaceholder = this.itemsContainer.querySelector(".loading-placeholder");
    if (loadingPlaceholder) {
      loadingPlaceholder.remove();
    }

    this.itemsContainer.innerHTML = "";

    this.currentItems.forEach((item, index) => {
      const itemElement = document.createElement("div");
      itemElement.className =
        "group flex items-center gap-4 bg-gradient-to-r from-slate-800/90 to-slate-700/80 border-2 border-slate-600/50 rounded-xl p-4 mb-4 cursor-pointer transition-all duration-300 relative shadow-lg hover:shadow-xl min-h-16 hover:border-blue-500/70 hover:bg-gradient-to-r hover:from-slate-700/90 hover:to-slate-600/80 hover:-translate-y-1 hover:scale-[1.02] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-slate-900 last:mb-0 backdrop-blur-sm";
      itemElement.dataset.index = index.toString();
      itemElement.setAttribute("tabindex", "0");
      itemElement.setAttribute("role", "button");
      itemElement.setAttribute(
        "aria-label",
        `${item.artist} - ${item.title}, Position ${index + 1}`
      );

      itemElement.innerHTML = `
        <div class="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white text-base font-bold flex items-center justify-center shadow-lg border border-blue-400/50 group-hover:scale-110 transition-transform duration-200">${index + 1}</div>
        <div class="flex-1 min-w-0">
          <div class="font-bold text-lg mb-2 text-white leading-tight group-hover:text-blue-100 transition-colors duration-200">${item.title}</div>
          <div class="text-gray-300 text-sm leading-relaxed font-medium group-hover:text-blue-200 transition-colors duration-200">${item.artist}</div>
        </div>
        <div class="flex-shrink-0 w-6 h-6 text-gray-400 group-hover:text-blue-400 transition-colors duration-200">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-full h-full">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      `;

      itemElement.addEventListener("click", () => this.selectItem(index));
      itemElement.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          this.selectItem(index);
        }
        if (event.key === "ArrowUp") {
          event.preventDefault();
          this.moveItem(-1);
        }
        if (event.key === "ArrowDown") {
          event.preventDefault();
          this.moveItem(1);
        }
      });

      this.itemsContainer.appendChild(itemElement);
    });
  }

  selectItem(index: number) {
    // Remove previous selection
    const items = this.itemsContainer?.querySelectorAll("[data-index]");
    items?.forEach((item) => {
      item.classList.remove(
        "border-blue-500/70",
        "bg-gradient-to-r",
        "from-blue-600/20",
        "to-blue-700/20",
        "shadow-blue-500/25",
        "-translate-y-1",
        "scale-[1.02]"
      );
      item.classList.add(
        "border-slate-600/50",
        "bg-gradient-to-r",
        "from-slate-800/90",
        "to-slate-700/80"
      );
    });

    // Add new selection
    this.selectedIndex = index;
    const selectedItem = items?.[index];
    if (selectedItem) {
      selectedItem.classList.remove(
        "border-slate-600/50",
        "bg-gradient-to-r",
        "from-slate-800/90",
        "to-slate-700/80"
      );
      selectedItem.classList.add(
        "border-blue-500/70",
        "bg-gradient-to-r",
        "from-blue-600/20",
        "to-blue-700/20",
        "shadow-blue-500/25",
        "-translate-y-1",
        "scale-[1.02]"
      );
      (selectedItem as HTMLElement).focus();
    }

    this.updateControls();
  }

  moveItem(direction: number) {
    if (this.selectedIndex === -1) {
      // Auto-select first item if none selected
      this.selectItem(0);
      return;
    }

    const newIndex = this.selectedIndex + direction;
    if (newIndex < 0 || newIndex >= this.currentItems.length) {
      return;
    }

    // Swap items using destructuring
    [this.currentItems[this.selectedIndex], this.currentItems[newIndex]] = [
      this.currentItems[newIndex],
      this.currentItems[this.selectedIndex],
    ];

    // Re-render and maintain selection
    this.renderItems();
    this.selectItem(newIndex);
  }

  updateControls() {
    const hasSelection = this.selectedIndex !== -1;
    const canMoveUp = hasSelection && this.selectedIndex > 0;
    const canMoveDown = hasSelection && this.selectedIndex < this.currentItems.length - 1;

    if (this.moveUpBtn) {
      (this.moveUpBtn as HTMLButtonElement).disabled = !canMoveUp;
    }
    if (this.moveDownBtn) {
      (this.moveDownBtn as HTMLButtonElement).disabled = !canMoveDown;
    }
    if (this.submitBtn) {
      (this.submitBtn as HTMLButtonElement).disabled = this.currentItems.length === 0;
    }
  }

  submitAnswer() {
    const userOrder = this.currentItems.map((item) => item.id);
    const result = evaluateChronologyAnswer(userOrder, this.correctOrder);

    this.score += result.score;
    if (this.scoreDisplay) {
      this.scoreDisplay.textContent = this.score.toString();
    }

    // Next round or end game
    if (this.round >= this.totalRounds) {
      // Last round - skip feedback overlay and go directly to end game
      this.endGame();
    } else {
      // Show feedback for intermediate rounds
      this.showFeedback(result);

      setTimeout(() => {
        this.round++;
        if (this.roundDisplay) {
          this.roundDisplay.textContent = this.round.toString();
        }
        this.loadQuestion();
      }, 2000);
    }
  }

  showFeedback(result: { correctItems: number; totalItems: number; score: number }) {
    // Create detailed feedback with more information
    const correctOrderWithDetails = this.correctOrder.map((id) => {
      const item = this.currentItems.find((i) => i.id === id);
      if (!item) {
        return "";
      }

      // Include artist, title, and year for comprehensive feedback
      return `${item.artist} - ${item.title} (${item.year})`;
    });

    // Create user order for comparison (with current positions)
    const userOrderWithDetails = this.currentItems.map((item, index) => ({
      position: index + 1,
      artist: item.artist,
      title: item.title,
      year: item.year,
      isCorrectPosition: this.correctOrder[index] === item.id,
    }));

    // Calculate additional statistics
    const accuracy = Math.round((result.correctItems / result.totalItems) * 100);
    const scoreGained = result.score;

    // Dispatch enhanced event for feedback overlay
    const event = new CustomEvent("showChronologyFeedback", {
      detail: {
        isCorrect: result.correctItems === result.totalItems,
        isLastRound: this.round >= this.totalRounds,
        correctOrder: correctOrderWithDetails,
        userOrder: userOrderWithDetails,
        accuracy: accuracy,
        scoreGained: scoreGained,
        totalScore: this.score,
        round: this.round,
        totalRounds: this.totalRounds,
        category: this.categoryName || this.category,
        difficulty: this.difficulty,
      },
    });
    window.dispatchEvent(event);
  }

  async endGame() {
    // Debug logging
    console.log("ChronologyGame endGame() called:");
    console.log("  this.categoryName:", this.categoryName);
    console.log("  this.category:", this.category);
    console.log("  Final category for EndOverlay:", this.categoryName || this.category);

    // Use the same end game handling as regular quiz mode with loading spinner and validation
    const endGameConfig = {
      userId: this.userId,
      categoryName: this.categoryName || this.category,
      difficulty: this.difficulty,
      score: this.score,
      correctAnswers: Math.round(this.score / 100), // Estimate based on score (assuming 100 points per correct answer)
      totalRounds: this.totalRounds,
      language: this.language,
    };

    const ui = {
      showEndgamePopup: (score: number) => {
        const popup = document.getElementById("endgame-popup");
        if (popup) {
          // Debug logging
          console.log("Setting EndOverlay data attributes:");
          console.log("  score:", score);
          console.log("  category:", this.categoryName || this.category);
          console.log("  difficulty:", this.difficulty);
          console.log("  mode: chronology");

          // Set all necessary data attributes for EndOverlay
          popup.dataset.score = score.toString();
          popup.dataset.category = this.categoryName || this.category;
          popup.dataset.difficulty = this.difficulty;
          popup.dataset.mode = "chronology";

          // Additional debug: check what's actually set
          console.log("Actual dataset after setting:");
          console.log("  popup.dataset.score:", popup.dataset.score);
          console.log("  popup.dataset.category:", popup.dataset.category);
          console.log("  popup.dataset.difficulty:", popup.dataset.difficulty);
          console.log("  popup.dataset.mode:", popup.dataset.mode);

          // Use the enhanced showEndOverlay function for animations and setup
          if (typeof window !== "undefined" && (window as Window & { showEndOverlay?: (score: number, maxScore: number) => void }).showEndOverlay) {
            (window as Window & { showEndOverlay?: (score: number, maxScore: number) => void }).showEndOverlay(score, this.totalRounds * 100); // Max score based on perfect rounds
          } else {
            // Fallback: manually update score and show overlay
            const scoreElement = document.getElementById("popup-score");
            if (scoreElement) {
              scoreElement.textContent = score.toString();
            }
            popup.setAttribute("data-score", score.toString());
          }
          popup.classList.remove("hidden");
        }
      },
    };

    await handleEndGame(endGameConfig, ui, {
      onError: (error) => {
        console.error("Failed to save chronology game result:", error);
      },
    });
  }

  showError(messageKey: string) {
    // Get translation based on current language
    const translations: { [key: string]: { [key: string]: string } } = {
      de: {
        "chronology.error.initialization":
          "Spiel konnte nicht geladen werden. Bitte versuchen Sie es erneut.",
        "chronology.error.question.load":
          "Frage konnte nicht geladen werden. Bitte versuchen Sie es erneut.",
      },
      en: {
        "chronology.error.initialization": "Failed to load game data. Please try again.",
        "chronology.error.question.load": "Failed to load question. Please try again.",
      },
    };

    const message =
      translations[this.language]?.[messageKey] || translations.en[messageKey] || messageKey;
    console.error(message);
    alert(message);
  }
}

// Initialize game when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new ChronologyGame();
});
