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
import {
  getTimePressureQuestion,
  resetTimePressureQuestions,
  getTimePressureStats,
} from "../utils/game/getTimePressureQuestion.js";

/**
 *
 */
export class TimePressureGameEngine {
  /**
   *
   */
  constructor(options) {
    this.category = options.category;
    this.lang = options.lang;
    this.gameContainer = options.gameContainer;
    this.loadingContainer = options.loadingContainer;
    this.gameUI = options.gameUI;

    // Game state
    this.albums = [];
    this.currentRound = 1;
    this.totalRounds = 20;
    this.score = 0;
    this.streak = 0;
    this.correctAnswers = 0;
    this.questionsAnswered = 0;
    this.gameStartTime = null;
    this.questionStartTime = null;
    this.isGameActive = false;
    this.isPaused = false;

    // Timer state
    this.countdownTimer = null;
    this.timeRemaining = 0;
    this.currentTimeLimit = 0;
    this.urgencyThreshold = 3; // Start urgency effects at 3 seconds
    this.warningThreshold = 5; // Start warning effects at 5 seconds
    this.isFeedbackShowing = false; // Track if feedback overlay is shown

    // Current question data
    this.currentQuestion = null;
    this.currentAlbum = null;
    this.currentDifficulty = null;
    this.currentBasePoints = 0;

    // DOM elements
    this.scoreDisplay = null;
    this.streakDisplay = null;
    this.accuracyDisplay = null;
    this.currentRoundDisplay = null;
    this.totalRoundsDisplay = null;
    this.progressFill = null;
    this.countdownCircle = null;
    this.countdownProgress = null;
    this.countdownTime = null;
    this.difficultyIndicator = null;
    this.difficultyText = null;
    this.questionText = null;
    this.answerOptions = null;

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
  async initialize() {
    try {
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
  async loadAlbums() {
    try {
      // Try to load the specific language first
      let albumData;
      let loadUrl = `/json/genres/${this.lang}/${this.category}.json`;

      try {
        const response = await fetch(loadUrl);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch category data: ${response.status} ${response.statusText}`
          );
        }
        albumData = await response.json();
      } catch (langError) {
        console.warn(
          `Category not available in ${this.lang}, falling back to German. Error:`,
          langError.message
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
      console.error("Error loading albums:", error);
      throw error; // Re-throw the original error with more context
    }
  }

  /**
   * Initialize DOM element references
   */
  initializeDOMElements() {
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
      this.totalRoundsDisplay.textContent = this.totalRounds;
    }
  }

  /**
   * Set up event listeners
   */
  setupEventListeners() {
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
  async startGame() {
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
  async nextQuestion() {
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

      console.log(
        `Round ${this.currentRound}: ${this.currentDifficulty} question, ${this.currentTimeLimit}s limit`
      );
    } catch (error) {
      console.error("Error loading next question:", error);
      await this.endGame();
    }
  }

  /**
   * Display the current question
   */
  displayQuestion() {
    if (!this.currentQuestion) {
      return;
    }

    // Update question text
    this.questionText.textContent = this.currentQuestion.question;
    this.questionText.setAttribute("aria-live", "assertive");

    // Clear previous answer options
    this.answerOptions.innerHTML = "";

    // Create answer buttons
    this.currentQuestion.options.forEach((option, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "answer-btn";
      button.setAttribute("data-answer", option);
      button.setAttribute("aria-describedby", "question-text");

      // Keyboard shortcuts
      const shortcut = String(index + 1);
      button.setAttribute("data-shortcut", shortcut);

      // Set innerHTML with proper structure - don't use textContent after this
      button.innerHTML = `<span class="answer-shortcut">${shortcut}</span><span class="answer-text">${option}</span>`;

      button.addEventListener("click", this.handleAnswerClick);
      this.answerOptions.appendChild(button);
    });

    // Focus first answer for accessibility
    const firstAnswer = this.answerOptions.querySelector(".answer-btn");
    if (firstAnswer) {
      // Small delay to ensure screen reader announces the question first
      setTimeout(() => firstAnswer.focus(), 100);
    }
  }

  /**
   * Update difficulty indicator
   */
  updateDifficultyIndicator() {
    if (!this.difficultyIndicator || !this.difficultyText) {
      return;
    }

    // Find the timer stat element
    const timerStat = document.querySelector(".timer-stat");

    if (timerStat) {
      // Remove previous difficulty classes from timer stat
      timerStat.classList.remove("easy", "medium", "hard");
      // Add current difficulty class to timer stat
      timerStat.classList.add(this.currentDifficulty);
    }

    // Update text
    const difficultyLabels = {
      easy: "Easy",
      medium: "Med",
      hard: "Hard",
    };

    this.difficultyText.textContent = difficultyLabels[this.currentDifficulty];
  }

  /**
   * Start countdown timer with visual effects
   */
  startCountdown() {
    // Clear any existing timer
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
    }

    // Reset countdown display
    this.updateCountdownDisplay();

    // Start countdown
    this.countdownTimer = setInterval(this.updateCountdown, 100);
  }

  /**
   * Update countdown timer (called every 100ms for smooth animation)
   */
  updateCountdown() {
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
  updateCountdownDisplay() {
    if (!this.countdownTime || !this.countdownProgress) {
      return;
    }

    // Update time text
    const displayTime = Math.ceil(this.timeRemaining);
    this.countdownTime.textContent = displayTime;

    // Update progress circle (stat timer has radius = 18)
    const progress = this.timeRemaining / this.currentTimeLimit;
    const circumference = 2 * Math.PI * 18; // radius = 18 for stat timer
    const offset = circumference * (1 - progress);

    this.countdownProgress.style.strokeDashoffset = offset;

    // Apply urgency classes (for compact timer)
    this.countdownProgress.classList.remove("warning", "urgent");

    if (this.timeRemaining <= this.urgencyThreshold) {
      this.countdownProgress.classList.add("urgent");
      this.countdownCircle.classList.add("urgent");
    } else if (this.timeRemaining <= this.warningThreshold) {
      this.countdownProgress.classList.add("warning");
      this.countdownCircle.classList.add("warning");
    } else {
      this.countdownCircle.classList.remove("urgent", "warning");
    }
  }

  /**
   * Handle answer button click
   */
  async handleAnswerClick(event) {
    if (!this.isGameActive || this.isPaused) {
      return;
    }

    const selectedAnswer = event.currentTarget.getAttribute("data-answer");
    await this.processAnswer(selectedAnswer);
  }

  /**
   * Handle keyboard input
   */
  async handleKeyPress(event) {
    if (!this.isGameActive || this.isPaused) {
      return;
    }

    // Number keys 1-4 for answer selection
    if (event.key >= "1" && event.key <= "4") {
      event.preventDefault();
      const answerButtons = this.answerOptions.querySelectorAll(".answer-btn");
      const buttonIndex = parseInt(event.key) - 1;

      if (answerButtons[buttonIndex]) {
        const selectedAnswer = answerButtons[buttonIndex].getAttribute("data-answer");
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
  async processAnswer(selectedAnswer) {
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
  async handleTimeout() {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    }

    this.questionsAnswered++;
    this.streak = 0; // Reset streak on timeout

    // Update displays
    this.updateGameStats();

    // Show timeout feedback
    await this.showAnswerFeedback(false, 0, {
      timeout: true,
      correctAnswer: this.currentQuestion.correctAnswer,
    });
  }

  /**
   * Calculate time bonus based on remaining time
   */
  calculateTimeBonus() {
    const timeUsed = this.currentTimeLimit - this.timeRemaining;
    const timeRatio = Math.max(0, this.timeRemaining / this.currentTimeLimit);

    // More bonus for faster answers, scaled by difficulty
    const maxBonus = this.currentBasePoints * 0.5; // 50% bonus maximum
    return Math.round(maxBonus * timeRatio);
  }

  /**
   * Calculate streak bonus
   */
  calculateStreakBonus() {
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
  async showAnswerFeedback(isCorrect, points, details) {
    try {
      // Pause the timer during feedback
      this.isFeedbackShowing = true;

      // Get the overlay elements
      const overlay = document.getElementById("overlay");
      let feedback = document.getElementById("feedback");

      // If feedback element is not found, try to find the paragraph element
      if (!feedback) {
        feedback = overlay?.querySelector(".feedback");
      }

      if (!overlay) {
        console.warn("FeedbackOverlay not found");
        this.isFeedbackShowing = false; // Reset flag if overlay not found
        return;
      }

      // Create feedback message
      let feedbackMsg;
      if (isCorrect) {
        feedbackMsg = `Richtig! +${points} Punkte`;
        if (details.time > 0) {
          feedbackMsg += ` (Zeit-Bonus: +${details.time})`;
        }
        if (details.streak > 0) {
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
      const albumInfo = overlay.querySelector(".album-info");
      if (albumInfo && this.currentAlbum) {
        albumInfo.style.display = "block";

        // Update album information
        const artistElement = overlay.querySelector("#overlay-artist");
        const albumElement = overlay.querySelector("#overlay-album");
        const yearElement = overlay.querySelector("#overlay-year");
        const funFactElement = overlay.querySelector("#overlay-funfact");

        if (artistElement) artistElement.textContent = this.currentAlbum.artist || "";
        if (albumElement) albumElement.textContent = this.currentAlbum.album || "";
        if (yearElement) yearElement.textContent = this.currentAlbum.year || "";

        // Display funFact from the current question's trivia
        if (funFactElement) {
          const funFactText = this.currentQuestion?.trivia || this.currentAlbum.funFact || "";
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
  updateGameStats() {
    if (this.scoreDisplay) {
      this.scoreDisplay.textContent = this.score.toLocaleString();
    }

    if (this.streakDisplay) {
      this.streakDisplay.textContent = this.streak;
    }

    if (this.accuracyDisplay) {
      const accuracy =
        this.questionsAnswered > 0
          ? Math.round((this.correctAnswers / this.questionsAnswered) * 100)
          : 0;
      this.accuracyDisplay.textContent = `${accuracy}%`;
    }

    if (this.currentRoundDisplay) {
      this.currentRoundDisplay.textContent = this.currentRound;
    }

    if (this.progressFill) {
      const progress = ((this.currentRound - 1) / this.totalRounds) * 100;
      this.progressFill.style.width = `${progress}%`;
    }
  }

  /**
   * Handle pause/resume
   */
  handlePause() {
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
  pauseGame() {
    this.isPaused = true;

    // The countdown timer automatically handles pause state
    // Update pause button text
    const pauseBtn = document.getElementById("pause-btn");
    if (pauseBtn) {
      const iconSpan = pauseBtn.querySelector(".icon");
      const textSpan = pauseBtn.querySelector(".text");
      if (textSpan) textSpan.textContent = "Fortsetzen";
      pauseBtn.setAttribute("aria-label", "Spiel fortsetzen");
    }

    // Show pause overlay (would integrate with existing overlay system)
  }

  /**
   * Resume the game
   */
  resumeGame() {
    this.isPaused = false;

    // Update pause button text
    const pauseBtn = document.getElementById("pause-btn");
    if (pauseBtn) {
      const iconSpan = pauseBtn.querySelector(".icon");
      const textSpan = pauseBtn.querySelector(".text");
      if (textSpan) textSpan.textContent = "Pause";
      pauseBtn.setAttribute("aria-label", "Spiel pausieren");
    }
  }

  /**
   * Handle skip question (with point penalty)
   */
  async handleSkip() {
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
  async endGame() {
    this.isGameActive = false;

    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    }

    // Show loading screen while processing results
    const { showEndGameLoading, hideEndGameLoading } = await import(
      "../utils/game/endGameUtils.js"
    );
    showEndGameLoading();

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

    // Save results and check achievements
    try {
      await this.saveGameResults(gameStats);
      await this.checkGameAchievements(gameStats);
    } catch (error) {
      console.error("Error in post-game processing:", error);
      console.error("Stack trace:", error.stack);
      // Don't continue if save failed - this is critical
      return;
    }

    // Show end game overlay
    await this.showEndGameOverlay(gameStats);
  }

  /**
   * Save game results to database
   */
  async saveGameResults(gameStats) {
    try {
      // Get user ID from container data attribute (set by server-side session)
      let userId = this.gameContainer.getAttribute("data-userID");

      // Fallback to guest if no user ID is found
      if (!userId || userId === "null" || userId === "undefined") {
        userId = "guest";
      } else {
      }

      // Time pressure mode uses mixed difficulties
      const difficulty = "mixed";

      const requestData = {
        userId: userId,
        categoryName: this.category,
        difficulty: difficulty,
        score: gameStats.score,
        correctAnswers: gameStats.correctAnswers,
        totalRounds: gameStats.totalQuestions,
        // Additional time pressure specific data
        genreId: this.category,
        gameTime: gameStats.gameTime,
        endOfSession: true,
      };

      const response = await fetch(`/${this.lang}/api/game/save-result`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Save failed with status:", response.status);
        console.error("Error response:", errorText);
        throw new Error(`Failed to save game results: ${response.status} - ${errorText}`);
      }

      const result = await response.json();

      return result;
    } catch (error) {
      console.error("Error saving game results:", error);
      console.error("Error details:", error.message);
      // Show user-friendly error message
      alert("Fehler beim Speichern der Spielergebnisse. Bitte versuche es erneut.");
      throw error;
    }
  }

  /**
   * Check for achievements
   */
  async checkGameAchievements(gameStats) {
    try {
      // TODO: Implement time pressure specific achievements
      // For now, just log that we would check achievements
      // await checkAchievementsAfterGame(...);
    } catch (error) {
      console.error("Error checking achievements:", error);
    }
  }

  /**
   * Show end game overlay
   */
  async showEndGameOverlay(gameStats) {
    try {
      // Get the end overlay element
      const endOverlay = document.getElementById("end-overlay");
      if (!endOverlay) {
        console.error("End overlay element not found");
        return;
      }

      // Set data attributes for the overlay
      endOverlay.setAttribute("data-score", gameStats.score.toString());
      endOverlay.setAttribute("data-category", gameStats.category);
      endOverlay.setAttribute("data-mode", "time-pressure");
      endOverlay.setAttribute("data-difficulty", "mixed"); // Special value for time pressure
      endOverlay.setAttribute("data-accuracy", Math.round(gameStats.accuracy).toString());
      endOverlay.setAttribute("data-game-time", Math.round(gameStats.gameTime).toString());

      // Import and use the showEndOverlay utility
      const { showEndOverlay } = await import("../utils/endOverlay.js");

      // Hide loading screen before showing end overlay
      hideEndGameLoading();

      // Small delay to ensure loading screen is hidden
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Show the overlay with the score
      await showEndOverlay({
        score: gameStats.score,
        maxScore: 1000, // Standard max score for comparison
      });

      // Hide the game UI
      this.gameUI.style.display = "none";

      // Show the overlay by removing the hidden class
      endOverlay.classList.remove("hidden");
      endOverlay.setAttribute("aria-hidden", "false");

      // Focus the overlay for accessibility
      endOverlay.focus();
    } catch (error) {
      console.error("Error showing end game overlay:", error);

      // Hide loading screen in case of error
      hideEndGameLoading();

      // Fallback: just show basic stats
      alert(
        `Game Complete!\nScore: ${gameStats.score}\nAccuracy: ${Math.round(gameStats.accuracy)}%\nTime: ${Math.round(gameStats.gameTime)}s`
      );
    }
  }

  /**
   * Show error message
   */
  showError(message) {
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
  destroy() {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
    }

    document.removeEventListener("keydown", this.handleKeyPress);

    // Reset game state
    this.isGameActive = false;
    this.isPaused = false;
  }
}
