/**
 * Time Pressure Game Engine for MelodyMind
 *
 * Enhanced game engine specifically designed for time pressure mode with:
 * - Mixed difficulty questions
 * - Countdown timers with visual urgency effects
 * - Progressive scoring system
 * - Real-time statistics tracking
 * - Achievement integration
 */

// import { checkAchievementsAfterGame } from "../services/achievementService.js";
import { showEndOverlay, setupEndOverlay } from "../endOverlay";

import {
  getTimePressureQuestion,
  resetTimePressureQuestions,
  getTimePressureStats,
  type Question,
  type Album,
} from "./getTimePressureQuestion";

interface GameStats {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  accuracy: number;
  gameTime: number;
  category: string;
  gameMode: string;
  difficultyStats?: Record<string, unknown>;
}


interface TimePressureGameOptions {
  category: string;
  lang: string;
  gameContainer: HTMLElement;
  loadingContainer: HTMLElement;
  gameUI: HTMLElement;
}

interface FeedbackDetails {
  timeout?: boolean;
  correctAnswer?: string;
  answerTime?: number;
  streak?: number;
  skipped?: boolean;
  penalty?: number;
  base?: number;
  time?: number;
}

/**
 * Time Pressure Game Engine for MelodyMind
 */
export class TimePressureGameEngine {
  private category: string;
  private lang: string;
  private gameContainer: HTMLElement;
  private loadingContainer: HTMLElement;
  private gameUI: HTMLElement;
  private currentQuestion: Question | null = null;
  private currentQuestionIndex: number = 0;
  private totalQuestions: number = 0;
  private correctAnswers: number = 0;
  private incorrectAnswers: number = 0;
  private totalScore: number = 0;
  private streakCount: number = 0;
  private maxStreak: number = 0;
  private timeLeft: number = 0;
  private countdownTimer: number | null = null;
  private isGameActive: boolean = false;
  private isPaused: boolean = false;
  private gameStartTime: number = 0;
  private questionStartTime: number = 0;
  private albums: Album[] = [];

  // Game state properties
  private streak: number = 0;
  private timeRemaining: number = 0;
  private currentTimeLimit: number = 0;
  private score: number = 0;
  private currentRound: number = 1;
  private totalRounds: number = 20;
  private questionsAnswered: number = 0;
  private currentBasePoints: number = 0;
  private currentAlbum: Album | null = null;
  private currentDifficulty: "easy" | "medium" | "hard" | null = null;

  // Game mechanics properties
  private urgencyThreshold: number = 3;
  private warningThreshold: number = 5;
  private isFeedbackShowing: boolean = false;

  // DOM Elements
  private scoreDisplay: HTMLElement | null = null;
  private streakDisplay: HTMLElement | null = null;
  private accuracyDisplay: HTMLElement | null = null;
  private currentRoundDisplay: HTMLElement | null = null;
  private totalRoundsDisplay: HTMLElement | null = null;
  private progressFill: HTMLElement | null = null;
  private countdownCircle: HTMLElement | null = null;
  private countdownProgress: HTMLElement | null = null;
  private countdownTime: HTMLElement | null = null;
  private difficultyIndicator: HTMLElement | null = null;
  private difficultyText: HTMLElement | null = null;
  private questionText: HTMLElement | null = null;
  private answerOptions: HTMLElement | null = null;

  /**
   * Constructor for TimePressureGameEngine
   */
  constructor(options: TimePressureGameOptions) {
    this.category = options.category;
    this.lang = options.lang;
    this.gameContainer = options.gameContainer;
    this.loadingContainer = options.loadingContainer;
    this.gameUI = options.gameUI;

    // Initialize game state (properties already declared above)
    this.gameStartTime = 0;
    this.questionStartTime = 0;

    // Initialize timer state
    this.countdownTimer = null;
    // DOM elements will be initialized in initializeDOMElements()

    // Audio elements removed for better user experience

    // Bind methods
    this.handleAnswerClick = this.handleAnswerClick.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.updateCountdown = this.updateCountdown.bind(this);
    this.handleTimeout = this.handleTimeout.bind(this);
    this.handlePause = this.handlePause.bind(this);
    this.handleSkip = this.handleSkip.bind(this);
  }

  /**
   * Initialize the time pressure game
   */
  async initialize(): Promise<void> {
    try {
      // Setup EndOverlay functionality
      await setupEndOverlay();

      // Load albums for the category
      await this.loadAlbums();

      // Initialize DOM elements
      this.initializeDOMElements();

      // Set up event listeners
      this.setupEventListeners();

      // Start the game
      await this.startGame();
    } catch (error) {
      console.error("Failed to initialize time pressure game:", error);
      this.showError("Failed to load game. Please refresh the page.");
    }
  }

  /**
   * Load album data for the selected category
   */
  async loadAlbums(): Promise<void> {
    try {
      // Try to load the specific language first
      let albumData;
      const loadUrl = `/json/genres/${this.lang}/${this.category}.json`;

      try {
        const response = await fetch(loadUrl);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch category data: ${response.status} ${response.statusText}`
          );
        }
        albumData = await response.json();
      } catch (langError: unknown) {
        console.warn(
          `Category not available in ${this.lang}, falling back to German. Error:`,
          (langError as Error).message
        );

        try {
          const fallbackUrl = `/json/genres/de/${this.category}.json`;
          const fallbackResponse = await fetch(fallbackUrl);

          if (!fallbackResponse.ok) {
            throw new Error(
              `Failed to fetch fallback category data: ${fallbackResponse.status} ${fallbackResponse.statusText}`
            );
          }
          albumData = await fallbackResponse.json();
        } catch (fallbackError) {
          console.error("Failed to load fallback data:", fallbackError);
          throw new Error(
            `Category '${this.category}' not found in any language. Available categories might be: 1950s, 1960s, 1970s, 1980s, 1990s, 2000s, 2010s`
          );
        }
      }

      this.albums = albumData || [];

      if (this.albums.length === 0) {
        throw new Error(`No albums found for category '${this.category}'. Data loaded but empty.`);
      }
    } catch (error) {
      console.error("Error loading albums:", error as Error);
      throw error; // Re-throw the original error with more context
    }
  }

  /**
   * Initialize DOM element references
   */
  initializeDOMElements(): void {
    // Statistics displays
    this.scoreDisplay = document.getElementById("score-display");
    this.streakDisplay = document.getElementById("streak-display");
    this.accuracyDisplay = document.getElementById("accuracy-display");

    // Progress displays
    this.currentRoundDisplay = document.getElementById("current-round");
    this.totalRoundsDisplay = document.getElementById("total-rounds");
    this.progressFill = document.getElementById("progress-fill");

    // Countdown elements (now compact in header)
    this.countdownCircle = document.getElementById("countdown-circle");
    this.countdownProgress = document.getElementById("countdown-progress");
    this.countdownTime = document.getElementById("countdown-time");

    // Difficulty indicator
    this.difficultyIndicator = document.getElementById("difficulty-indicator");
    this.difficultyText = document.getElementById("difficulty-text");

    // Question elements
    this.questionText = document.getElementById("question-text");
    this.answerOptions = document.getElementById("answer-options");

    // Update total rounds display
    if (this.totalRoundsDisplay) {
      this.totalRoundsDisplay.textContent = this.totalRounds.toString();
    }
  }

  /**
   * Set up event listeners
   */
  setupEventListeners(): void {
    // Keyboard navigation
    document.addEventListener("keydown", this.handleKeyPress);

    // Control buttons
    const pauseBtn = document.getElementById("pause-btn");
    const skipBtn = document.getElementById("skip-btn");

    if (pauseBtn) {
      pauseBtn.addEventListener("click", this.handlePause);
    }
    if (skipBtn) {
      skipBtn.addEventListener("click", this.handleSkip);
    }

    // Visibility change (pause when tab not visible)
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && this.isGameActive && !this.isPaused) {
        this.pauseGame();
      }
    });
  }

  /**
   * Start the time pressure game
   */
  async startGame(): Promise<void> {
    // Reset game state
    this.currentRound = 1;
    this.score = 0;
    this.streak = 0;
    this.correctAnswers = 0;
    this.questionsAnswered = 0;
    this.gameStartTime = Date.now();
    this.isGameActive = true;
    this.isPaused = false;

    // Reset question tracking
    resetTimePressureQuestions();

    // Hide loading, show game UI
    this.loadingContainer.style.display = "none";
    this.gameUI.style.display = "flex";

    // Update displays
    this.updateGameStats();

    // Start first question
    await this.nextQuestion();
  }

  /**
   * Load and display the next question
   */
  async nextQuestion(): Promise<void> {
    if (this.currentRound > this.totalRounds) {
      await this.endGame();
      return;
    }

    try {
      // Get next time pressure question
      const questionResult = getTimePressureQuestion(this.albums, this.currentRound, {
        totalRounds: this.totalRounds,
      });

      if (!questionResult) {
        console.error("No question available");
        await this.endGame();
        return;
      }

      // Store current question data
      this.currentQuestion = questionResult.randomQuestion;
      this.currentAlbum = questionResult.randomAlbum;
      this.currentDifficulty = questionResult.difficulty;
      this.currentBasePoints = questionResult.basePoints;
      this.currentTimeLimit = questionResult.timeLimit;
      this.timeRemaining = this.currentTimeLimit;

      // Display question
      this.displayQuestion();

      // Update difficulty indicator
      this.updateDifficultyIndicator();

      // Start countdown timer
      this.startCountdown();

      // Record question start time for achievements
      this.questionStartTime = Date.now();
      window.questionStartTime = this.questionStartTime;

      // Debug info for development
      if (process.env.NODE_ENV === "development") {
        console.warn(
          `Round ${this.currentRound}: ${this.currentDifficulty} question, ${this.currentTimeLimit}s limit`
        );
      }
    } catch (error) {
      console.error("Error loading next question:", error);
      await this.endGame();
    }
  }

  /**
   * Display the current question
   */
  displayQuestion(): void {
    if (!this.questionText || !this.currentQuestion) {
      return;
    }

    this.questionText.textContent = this.currentQuestion.question;
    this.questionText.setAttribute("aria-live", "assertive");

    // Clear previous answer options
    if (this.answerOptions) {
      this.answerOptions.innerHTML = "";
    }

    // Create answer buttons
    if (!this.answerOptions) {
      return;
    }

    this.currentQuestion.options.forEach((option, index) => {
      const button = document.createElement("button");
      button.classList.add(
        "answer-btn",
        "w-full",
        "p-4",
        "text-left",
        "bg-gray-700",
        "hover:bg-gray-600",
        "border-2",
        "border-gray-600",
        "hover:border-purple-500",
        "rounded-xl",
        "transition-all",
        "duration-300",
        "hover:shadow-lg",
        "hover:-translate-y-1",
        "focus:outline-none",
        "focus:ring-4",
        "focus:ring-purple-500/60",
        "focus:border-purple-400",
        "group"
      );
      button.setAttribute("data-answer", option);

      // Keyboard shortcuts
      const shortcut = String(index + 1);
      button.setAttribute("data-shortcut", shortcut);

      // Set innerHTML with proper structure and enhanced styling
      button.innerHTML = `
        <div class="flex items-start gap-4">
          <span class="answer-shortcut flex-shrink-0 w-8 h-8 bg-purple-600 text-white font-bold rounded-full flex items-center justify-center text-sm group-hover:bg-purple-500 transition-colors duration-300">
            ${shortcut}
          </span>
          <span class="answer-text text-gray-200 group-hover:text-white transition-colors duration-300 leading-relaxed">
            ${option}
          </span>
        </div>
      `;

      button.addEventListener("click", this.handleAnswerClick);
      this.answerOptions!.appendChild(button);
    });

    // Focus first answer button for accessibility
    if (this.answerOptions) {
      const firstButton = this.answerOptions.querySelector(".answer-btn") as HTMLButtonElement;
      if (firstButton) {
        // Small delay to ensure screen reader announces the question first
        setTimeout(() => firstButton.focus(), 100);
      }
    }
  }

  /**
   * Update difficulty indicator
   */
  updateDifficultyIndicator(): void {
    if (!this.difficultyIndicator || !this.difficultyText || !this.currentDifficulty) {
      return;
    }

    // Update difficulty display
    this.difficultyIndicator.className = `difficulty ${this.currentDifficulty}`;

    // Update countdown circle with difficulty class
    const timerStat = document.querySelector(".timer-stat") as HTMLElement;
    if (timerStat) {
      // Remove previous difficulty classes from timer stat
      timerStat.classList.remove("easy", "medium", "hard");
      // Add current difficulty class to timer stat
      timerStat.classList.add(this.currentDifficulty);
    }

    const difficultyLabels = {
      easy: "Easy",
      medium: "Medium",
      hard: "Hard",
    };

    this.difficultyText.textContent = difficultyLabels[this.currentDifficulty];
  }

  /**
   * Start countdown timer with visual effects
   */
  startCountdown(): void {
    // Clear any existing timer
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
    }

    // Reset countdown display
    this.updateCountdownDisplay();

    // Start countdown
    this.countdownTimer = setInterval(() => this.updateCountdown(), 100) as unknown as number;
  }

  /**
   * Update countdown timer (called every 100ms for smooth animation)
   */
  updateCountdown(): void {
    if (this.isPaused || !this.isGameActive || this.isFeedbackShowing) {
      return;
    }

    this.timeRemaining -= 0.1;

    if (this.timeRemaining <= 0) {
      this.timeRemaining = 0;
      this.handleTimeout();
      return;
    }

    this.updateCountdownDisplay();
  }

  /**
   * Update countdown visual display
   */
  updateCountdownDisplay(): void {
    if (!this.countdownTime || !this.countdownProgress) {
      return;
    }

    // Update time text
    const displayTime = Math.ceil(this.timeRemaining);
    if (this.countdownTime) {
      this.countdownTime.textContent = displayTime.toString();
    }

    // Update progress circle (stat timer has radius = 18)
    const progress = this.timeRemaining / this.currentTimeLimit;
    const circumference = 2 * Math.PI * 18; // radius = 18 for stat timer
    const offset = circumference * (1 - progress);

    if (this.countdownProgress) {
      this.countdownProgress.style.strokeDashoffset = offset.toString();
    }

    // Apply urgency classes (for compact timer)
    if (this.countdownProgress) {
      this.countdownProgress.classList.remove("warning", "urgent");

      if (progress <= this.urgencyThreshold) {
        this.countdownProgress.classList.add("urgent");
      } else if (progress <= this.warningThreshold) {
        this.countdownProgress.classList.add("warning");
      }
    }

    if (this.countdownCircle) {
      if (progress <= this.urgencyThreshold) {
        this.countdownCircle.classList.add("urgent");
      } else if (progress <= this.warningThreshold) {
        this.countdownCircle.classList.add("warning");
      } else {
        this.countdownCircle.classList.remove("urgent", "warning");
      }
    }
  }

  /**
   * Handle answer button click
   */
  async handleAnswerClick(event: Event): Promise<void> {
    if (!this.isGameActive || this.isPaused) {
      return;
    }

    const selectedAnswer = (event.currentTarget as HTMLElement).getAttribute("data-answer");
    await this.processAnswer(selectedAnswer);
  }

  /**
   * Handle keyboard input
   */
  async handleKeyPress(event: KeyboardEvent): Promise<void> {
    if (!this.isGameActive || this.isPaused) {
      return;
    }

    // Number keys 1-4 for answer selection
    if (event.key >= "1" && event.key <= "4") {
      event.preventDefault();
      if (!this.answerOptions) {
        return;
      }
      const answerButtons = this.answerOptions.querySelectorAll(".answer-btn");
      const buttonIndex = parseInt(event.key) - 1;

      if (answerButtons[buttonIndex]) {
        const selectedAnswer = (answerButtons[buttonIndex] as HTMLElement).getAttribute(
          "data-answer"
        );
        await this.processAnswer(selectedAnswer);
      }
    }

    // Space or P for pause
    if (event.code === "Space" || event.key.toLowerCase() === "p") {
      event.preventDefault();
      this.handlePause();
    }

    // S for skip
    if (event.key.toLowerCase() === "s") {
      event.preventDefault();
      this.handleSkip();
    }
  }

  /**
   * Process the selected answer
   */
  async processAnswer(selectedAnswer: string | null): Promise<void> {
    if (!this.currentQuestion) {
      return;
    }

    // Stop countdown
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    }

    // Calculate answer time
    const answerTime = (Date.now() - this.questionStartTime) / 1000;
    if (!selectedAnswer || !this.currentQuestion) {
      return;
    }
    const isCorrect = selectedAnswer === this.currentQuestion.correctAnswer;

    // Update statistics
    this.questionsAnswered++;

    if (isCorrect) {
      this.correctAnswers++;
      this.streak++;

      // Calculate score with time bonus
      const timeBonus = this.calculateTimeBonus();
      const streakBonus = this.calculateStreakBonus();
      const totalPoints = this.currentBasePoints + timeBonus + streakBonus;

      this.score += totalPoints;

      // Show feedback
      await this.showAnswerFeedback(true, totalPoints, {
        base: this.currentBasePoints,
        time: timeBonus,
        streak: streakBonus,
        answerTime: answerTime,
      });
    } else {
      this.streak = 0; // Reset streak on incorrect answer

      // Show feedback
      await this.showAnswerFeedback(false, 0, {
        correctAnswer: this.currentQuestion.correctAnswer,
        answerTime: answerTime,
      });
    }

    // Update displays
    this.updateGameStats();

    // Record for achievements
    window.lastAnswerTime = answerTime;
  }

  /**
   * Handle timeout when time runs out
   */
  async handleTimeout(): Promise<void> {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    }

    // Apply timeout penalty
    this.questionsAnswered++;
    this.streak = 0; // Reset streak on timeout

    // Update displays
    this.updateGameStats();

    // Show timeout feedback
    if (this.currentQuestion) {
      await this.showAnswerFeedback(false, 0, {
        timeout: true,
        correctAnswer: this.currentQuestion.correctAnswer,
      });
    }
  }

  /**
   * Calculate time bonus based on remaining time
   */
  calculateTimeBonus(): number {
    // const timeUsed = this.currentTimeLimit - this.timeRemaining;
    const timeRatio = Math.max(0, this.timeRemaining / this.currentTimeLimit);

    // More bonus for faster answers, scaled by difficulty
    const maxBonus = this.currentBasePoints * 0.5; // 50% bonus maximum
    return Math.round(maxBonus * timeRatio);
  }

  /**
   * Calculate streak bonus
   */
  calculateStreakBonus(): number {
    if (this.streak < 3) {
      return 0;
    }

    // Progressive streak bonus
    const streakMultiplier = Math.min(this.streak - 2, 10) * 0.1; // Max 100% bonus
    return Math.round(this.currentBasePoints * streakMultiplier);
  }

  /**
   * Show answer feedback using the FeedbackOverlay component
   */
  async showAnswerFeedback(
    isCorrect: boolean,
    points: number,
    details: FeedbackDetails
  ): Promise<void> {
    try {
      // Pause the timer during feedback
      this.isFeedbackShowing = true;

      // Get the overlay elements
      const overlay = document.getElementById("overlay") as HTMLElement | null;
      if (!overlay) {
        return;
      }

      let feedback = document.getElementById("feedback");

      // If feedback element is not found, try to find the paragraph element
      if (!feedback) {
        feedback = overlay.querySelector("p") as HTMLElement;
      }

      if (!feedback) {
        console.warn("FeedbackOverlay not found");
        this.isFeedbackShowing = false; // Reset flag if overlay not found
        return;
      }

      // Create feedback message
      let feedbackMsg;
      if (isCorrect) {
        feedbackMsg = `Richtig! +${points} Punkte`;
        if (details.time && details.time > 0) {
          feedbackMsg += ` (Zeit-Bonus: +${details.time})`;
        }
        if (details.streak && details.streak > 0) {
          feedbackMsg += ` (Serie-Bonus: +${details.streak})`;
        }
      } else if (details.timeout) {
        feedbackMsg = `Zeit abgelaufen! Die richtige Antwort war: ${details.correctAnswer}`;
      } else if (details.skipped) {
        feedbackMsg = `Frage übersprungen! -${details.penalty} Punkte. Die richtige Antwort war: ${details.correctAnswer}`;
      } else {
        feedbackMsg = `Falsch! Die richtige Antwort war: ${details.correctAnswer}`;
      }

      // Update feedback content - handle both direct element and Paragraph component
      if (feedback) {
        // If it's a paragraph component, update its text content
        const textElement = feedback.querySelector("p") || feedback;
        textElement.textContent = feedbackMsg;

        // Add appropriate classes
        feedback.classList.remove("correct", "incorrect");
        feedback.classList.add(isCorrect ? "correct" : "incorrect");
      } else {
        // Fallback: create a feedback element
        const feedbackDiv = document.createElement("div");
        feedbackDiv.id = "feedback";
        feedbackDiv.className = `feedback ${isCorrect ? "correct" : "incorrect"}`;
        feedbackDiv.innerHTML = `<p>${feedbackMsg}</p>`;
        overlay
          .querySelector(".overlay__content")
          ?.insertBefore(feedbackDiv, overlay.querySelector(".album-info"));
      }

      // Show album info section like in normal mode
      const albumInfo = overlay.querySelector(".album-info") as HTMLElement;
      if (albumInfo && this.currentAlbum) {
        (albumInfo as HTMLElement).style.display = "block";

        // Update album information
        const artistElement = overlay.querySelector("#overlay-artist") as HTMLElement;
        const albumElement = overlay.querySelector("#overlay-album") as HTMLElement;
        const yearElement = overlay.querySelector("#overlay-year") as HTMLElement;
        const funFactElement = overlay.querySelector("#overlay-funfact") as HTMLElement;

        if (artistElement) {
          artistElement.textContent = this.currentAlbum.artist || "";
        }
        if (albumElement) {
          albumElement.textContent = this.currentAlbum.album || "";
        }
        if (yearElement) {
          yearElement.textContent = this.currentAlbum.year || "";
        }

        // Display funFact from the current question's trivia
        if (funFactElement) {
          const funFactText = this.currentQuestion?.trivia || "";
          // Handle both direct text and Paragraph component
          const textElement = funFactElement.querySelector("p") || funFactElement;
          textElement.textContent = funFactText;

          // Show the fun fact section if there's content
          if (funFactText) {
            funFactElement.style.display = "block";
          } else {
            funFactElement.style.display = "none";
          }
        }
      }

      // Show the overlay
      overlay.classList.remove("hidden");
      overlay.setAttribute("aria-hidden", "false");

      // Set up the next round handler
      const nextRoundButton = document.getElementById("next-round-button");
      if (nextRoundButton) {
        nextRoundButton.onclick = () => {
          overlay.classList.add("hidden");
          overlay.setAttribute("aria-hidden", "true");

          // Resume timer and continue to next question
          this.isFeedbackShowing = false;

          // Continue with next question
          setTimeout(async () => {
            this.currentRound++;
            await this.nextQuestion();
          }, 100);
        };
      }

      // No auto-hide - user must click to continue

      // Feedback shown successfully
    } catch (error) {
      console.error("Error showing feedback overlay:", error);
      // Reset feedback flag on error
      this.isFeedbackShowing = false;
      // Fallback feedback displayed
    }
  }

  /**
   * Update game statistics display
   */
  updateGameStats(): void {
    if (this.scoreDisplay) {
      this.scoreDisplay.textContent = this.score.toLocaleString();
    }

    if (this.streakDisplay) {
      this.streakDisplay.textContent = this.streak.toString();
    }

    if (this.accuracyDisplay) {
      const accuracy =
        this.questionsAnswered > 0
          ? Math.round((this.correctAnswers / this.questionsAnswered) * 100)
          : 0;
      this.accuracyDisplay.textContent = `${accuracy}%`;
    }

    if (this.currentRoundDisplay) {
      this.currentRoundDisplay.textContent = this.currentRound.toString();
    }

    if (this.progressFill) {
      const progress = ((this.currentRound - 1) / this.totalRounds) * 100;
      this.progressFill.style.width = `${progress}%`;
    }
  }

  /**
   * Handle pause/resume
   */
  handlePause(): void {
    if (!this.isGameActive) {
      return;
    }

    this.isPaused = !this.isPaused;

    if (this.isPaused) {
      this.pauseGame();
    } else {
      this.resumeGame();
    }
  }

  /**
   * Pause the game
   */
  pauseGame(): void {
    this.isPaused = true;

    // The countdown timer automatically handles pause state
    // Update pause button text
    const pauseBtn = document.getElementById("pause-btn");
    if (pauseBtn) {
      // const iconSpan = pauseButton.querySelector("span");
      const textSpan = pauseBtn.querySelector(".text") as HTMLElement;
      if (textSpan) {
        textSpan.textContent = "Fortsetzen";
      }
      pauseBtn.setAttribute("aria-label", "Spiel fortsetzen");
    }

    // Show pause overlay (would integrate with existing overlay system)
  }

  /**
   * Resume the game
   */
  resumeGame(): void {
    this.isPaused = false;

    // Update pause button text
    const pauseBtn = document.getElementById("pause-btn");
    if (pauseBtn) {
      // const iconSpan = pauseBtn.querySelector(".icon");
      const textSpan = pauseBtn.querySelector(".text") as HTMLElement;
      if (textSpan) {
        textSpan.textContent = "Pause";
      }
      pauseBtn.setAttribute("aria-label", "Spiel pausieren");
    }
  }

  /**
   * Handle skip question (with point penalty)
   */
  async handleSkip(): Promise<void> {
    if (!this.isGameActive || this.isPaused) {
      return;
    }

    // Apply penalty
    const penalty = 10;
    this.score = Math.max(0, this.score - penalty);
    this.streak = 0; // Reset streak

    this.questionsAnswered++;
    this.updateGameStats();

    // Show skip feedback
    await this.showAnswerFeedback(false, 0, {
      skipped: true,
      penalty: penalty,
      correctAnswer: this.currentQuestion?.correctAnswer || "Unknown",
    });
  }

  /**
   * End the game and show results
   */
  async endGame(): Promise<void> {
    this.isGameActive = false;

    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    }

    // Show loading screen while processing results
    // Note: showEndGameLoading is not exported, so we'll handle loading display manually
    if (this.loadingContainer) {
      this.loadingContainer.style.display = "block";
    }

    // Calculate final statistics
    const gameTime = (Date.now() - this.gameStartTime) / 1000;
    const accuracy =
      this.questionsAnswered > 0 ? (this.correctAnswers / this.questionsAnswered) * 100 : 0;

    const gameStats = {
      score: this.score,
      correctAnswers: this.correctAnswers,
      totalQuestions: this.questionsAnswered,
      accuracy: accuracy,
      gameTime: gameTime,
      category: this.category,
      gameMode: "time-pressure",
      difficultyStats: getTimePressureStats(),
    };

    // Check achievements (no database saving in guest mode)
    try {
      await this.checkGameAchievements(gameStats);
    } catch (error) {
      console.error("Error in achievement check:", error);
    }

    // Show end game overlay
    await this.showEndGameOverlay(gameStats);
  }

  /**
   * Note: Game saving functionality removed - no longer needed
   */
  async saveGameResults(gameStats: GameStats): Promise<void> {
    console.log("Game results would be saved here (functionality removed):", gameStats);
  }

  /**
   * Check for achievements
   */
  async checkGameAchievements(gameStats: GameStats): Promise<void> {
    try {
      // TODO: Implement time pressure specific achievements
      // Skip achievement checking for now to avoid database import issues in client
      console.warn("Time pressure game completed:", {
        score: gameStats.score,
        correctAnswers: gameStats.correctAnswers,
        totalQuestions: gameStats.totalQuestions,
        accuracy: gameStats.accuracy,
      });
    } catch (error) {
      console.error("Error in achievement check:", error as Error);
    }
  }

  /**
   * Show end game overlay
   */
  async showEndGameOverlay(gameStats: GameStats): Promise<void> {
    // Get the end overlay element
    const endOverlay = document.getElementById("endgame-popup") as HTMLElement | null;
    if (!endOverlay) {
      console.error("End overlay element not found");
      return;
    }

    try {
      // Set data attributes for the overlay
      endOverlay.setAttribute("data-score", gameStats.score.toString());
      endOverlay.setAttribute("data-category", gameStats.category);
      endOverlay.setAttribute("data-mode", "time-pressure");
      endOverlay.setAttribute("data-difficulty", "mixed"); // Special value for time pressure
      endOverlay.setAttribute("data-accuracy", Math.round(gameStats.accuracy).toString());
      endOverlay.setAttribute("data-game-time", Math.round(gameStats.gameTime).toString());

      // Hide loading screen before showing end overlay
      if (this.loadingContainer) {
        this.loadingContainer.style.display = "none";
      }

      // Small delay to ensure loading screen is hidden
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Use the imported showEndOverlay function
      await showEndOverlay({
        score: gameStats.score,
        maxScore: 1000,
      });

      // Manually show the overlay by removing hidden class and setting proper modal styles
      endOverlay.classList.remove("hidden");
      endOverlay.style.display = "flex";
      endOverlay.style.position = "fixed";
      endOverlay.style.top = "0";
      endOverlay.style.left = "0";
      endOverlay.style.width = "100vw";
      endOverlay.style.height = "100vh";
      endOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
      endOverlay.style.zIndex = "9999";
      endOverlay.style.justifyContent = "center";
      endOverlay.style.alignItems = "center";
      endOverlay.setAttribute("aria-hidden", "false");

      // Focus for accessibility
      endOverlay.focus();

      // Hide the game UI
      this.gameUI.style.display = "none";
    } catch (error) {
      console.error("Error showing end game overlay:", error as Error);

      // Hide loading screen in case of error
      if (this.loadingContainer) {
        this.loadingContainer.style.display = "none";
      }

      // Fallback: show overlay manually
      endOverlay.classList.remove("hidden");
      endOverlay.setAttribute("aria-hidden", "false");
      endOverlay.focus();
    }
  }

  /**
   * Show error message
   */
  showError(message: string): void {
    if (this.loadingContainer) {
      this.loadingContainer.innerHTML = `
        <div class="error-state">
          <h2>Error</h2>
          <p>${message}</p>
          <button onclick="location.reload()">Retry</button>
        </div>
      `;
    }
  }

  /**
   * Cleanup when leaving the page
   */
  destroy(): void {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
    }

    document.removeEventListener("keydown", this.handleKeyPress);

    // Reset game state
    this.isGameActive = false;
    this.isPaused = false;
  }
}
