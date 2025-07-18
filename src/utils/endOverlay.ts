/**
 * @fileoverview EndOverlay utility functions
 * @description Client-side utilities for managing the end game modal functionality
 * including dynamic motivation text, focus management, and accessibility features.
 *
 * This module follows WCAG AAA accessibility standards and implements optimized
 * performance practices for smooth animations and minimal resource usage.
 *
 * @author MelodyMind Team
 * @version 2.0.0
 * @since 2025-06-03
 */

import { getAchievementLevel } from "./achievements/achievementUtils";
import { updateScoreDisplay } from "./game/scoreUtils";

// Type definitions for better type safety
interface TranslationData {
  [key: string]: string;
}

interface EndOverlayConfig {
  score: number;
  maxScore?: number;
  translations?: TranslationData;
}

// Utility functions with modern ES6+ features
const getElement = <T extends HTMLElement>(selector: string): T | null =>
  document.querySelector<T>(selector);

const getElementById = <T extends HTMLElement>(id: string): T | null =>
  document.getElementById(id) as T | null;

const parseTranslations = (data: string | null): TranslationData | null => {
  if (!data) {
    return null;
  }

  try {
    return JSON.parse(data) as TranslationData;
  } catch (error) {
    console.error("Error parsing translation data:", error);
    return null;
  }
};

const getMotivationKey = (achievementLevel: string): string =>
  `game.end.motivation.${achievementLevel}`;

const announceToScreenReader = (text: string): void => {
  const announcement = getElementById<HTMLElement>("achievement-announcement");
  if (announcement) {
    announcement.textContent = text;
  }
};

/**
 * Update the motivation text using the global translation system
 * @param score - The player's score
 * @returns Promise<void>
 */
export const updateMotivationText = async (score: number): Promise<void> => {
  console.log("updateMotivationText called with score:", score);
  const motivationElement = getElementById<HTMLElement>("motivation-text");
  if (!motivationElement) {
    console.warn("Motivation text element not found");
    return;
  }

  // Get translations passed from server-side using modern destructuring
  // Look specifically for the EndOverlay element, not just any element with data-translations
  const overlay =
    getElementById<HTMLElement>("endgame-popup") || getElement<HTMLElement>("[data-translations]");
  const translationsData = overlay?.getAttribute("data-translations");

  console.log("Translation data found:", translationsData ? "Yes" : "No");

  if (!translationsData) {
    console.warn("Translation data not found, using empty fallback");
    motivationElement.textContent = "";
    return;
  }

  const translations = parseTranslations(translationsData);
  if (!translations) {
    motivationElement.textContent = "";
    return;
  }

  console.log("Available translations:", Object.keys(translations));

  const achievementLevel = getAchievementLevel(score);
  console.log("Achievement level for score", score, ":", achievementLevel);

  const motivationKey = getMotivationKey(achievementLevel);
  console.log("Looking for motivation key:", motivationKey);

  const motivationText = translations[motivationKey];

  if (motivationText) {
    console.log("Found motivation text:", motivationText);
    motivationElement.textContent = motivationText;
    announceToScreenReader(motivationText);
  } else {
    console.warn(`Missing translation for key: ${motivationKey}`);
    const fallbackText = translations["game.end.defaultMotivation"] || "";
    console.log("Using fallback text:", fallbackText);
    motivationElement.textContent = fallbackText;
  }
};

/**
 * Animate the progress bar to show the score percentage
 * @param score - The player's score
 * @param maxScore - The maximum possible score (default: 1000)
 * @returns Promise<void>
 */
export const animateProgressBar = async (score: number, maxScore: number = 1000): Promise<void> => {
  const progressBar = getElementById<HTMLElement>("score-bar");
  const progressContainer = getElement<HTMLElement>(".achievement-progress");

  if (!progressBar || !progressContainer) {
    console.warn("Progress bar elements not found");
    return;
  }

  // Calculate the percentage (0-100) using modern Math methods
  const percentage = Math.min(Math.max((score / maxScore) * 100, 0), 100);

  // Update ARIA attributes using modern optional chaining
  progressContainer.setAttribute?.("aria-valuenow", percentage.toString());

  // Use modern async/await with requestAnimationFrame
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      setTimeout(() => {
        progressBar.style.transform = `scaleX(${percentage / 100})`;
        resolve();
      }, 300);
    });
  });
};

/**
 * Update the score display with animation
 * @param score - The score value to display
 * @returns Promise<void>
 */
export const updateEndOverlayScore = async (score: number): Promise<void> => {
  console.log("updateEndOverlayScore called with score:", score);
  const scoreElement = getElementById<HTMLElement>("popup-score");
  if (scoreElement) {
    console.log("Score element found, updating display");
    await updateScoreDisplay(score, scoreElement);
  } else {
    console.warn("Score element not found in EndOverlay");
  }
};

/**
 * Update the difficulty display based on data attribute
 * @returns Promise<void>
 */
export const updateDifficultyDisplay = async (): Promise<void> => {
  const difficultyElement = getElementById<HTMLElement>("difficulty-display");
  const overlay =
    getElementById<HTMLElement>("endgame-popup") || getElement<HTMLElement>("[data-difficulty]");

  if (difficultyElement && overlay) {
    const difficulty = overlay.getAttribute("data-difficulty") || "";
    console.log("Updating difficulty display with:", difficulty);

    // Capitalize first letter and display
    const formattedDifficulty = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    difficultyElement.textContent = formattedDifficulty;
  } else {
    console.warn("Difficulty display element or overlay not found");
  }
};

/**
 * Update the category display based on data attribute
 * @returns Promise<void>
 */
export const updateCategoryDisplay = async (): Promise<void> => {
  // For now, log the category data - we might need to add a category display element
  const overlay =
    getElementById<HTMLElement>("endgame-popup") || getElement<HTMLElement>("[data-category]");

  if (overlay) {
    const category = overlay.getAttribute("data-category") || "";
    console.log("Category data found:", category);

    // We could add a category display element in the future
    // For now, just log it so we know it's working
  } else {
    console.warn("Category overlay not found");
  }
};

/**
 * Setup restart button functionality to restart the same game
 * @returns void
 */
export const setupRestartButton = (): void => {
  const restartButton = getElementById<HTMLButtonElement>("restart-button");

  if (restartButton) {
    restartButton.addEventListener("click", () => {
      console.log("Restart button clicked");

      // Get current game parameters from URL and data attributes
      const currentUrl = window.location.pathname;
      const overlay = getElementById<HTMLElement>("endgame-popup");

      if (overlay) {
        const category = overlay.getAttribute("data-category") || "";
        const difficulty = overlay.getAttribute("data-difficulty") || "";

        console.log("Restarting game with:", { category, difficulty, currentUrl });

        // Reload the current page to restart the game
        window.location.reload();
      } else {
        console.warn("Could not find overlay element for restart");
        // Fallback: just reload the page
        window.location.reload();
      }
    });

    console.log("Restart button functionality set up");
  } else {
    console.warn("Restart button not found");
  }
};

/**
 * Generate sharing text based on game results
 * @param score - Player's score
 * @param category - Game category
 * @param difficulty - Game difficulty
 * @param translations - Available translations
 * @returns Formatted sharing text
 */
const generateShareText = (
  score: number,
  category: string,
  difficulty: string,
  translations?: TranslationData
): string => {
  const achievementLevel = getAchievementLevel(score);
  const categoryDisplay = category ? category.charAt(0).toUpperCase() + category.slice(1) : "Music";
  const difficultyDisplay = difficulty
    ? difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
    : "Normal";

  // Generate direct link to the specific game
  const currentLang = window.location.pathname.split("/")[1] || "en";
  const gameUrl = `${window.location.origin}/${currentLang}/game-${category}/${difficulty}`;

  // Try to get localized sharing text template if available
  const shareTemplate =
    translations?.["game.end.shareTemplate"] ||
    `🎵 I just scored ${score} points playing ${categoryDisplay} (${difficultyDisplay}) on MelodyMind! 🎮\n\nCan you beat my score? Play the same game: ${gameUrl}`;

  // Replace placeholders if using template
  return shareTemplate
    .replace("{score}", score.toString())
    .replace("{category}", categoryDisplay)
    .replace("{difficulty}", difficultyDisplay)
    .replace("{url}", gameUrl);
};

/**
 * Display achievements in the EndOverlay
 * @param achievements - Array of unlocked achievements
 * @param translations - Available translations
 * @returns void
 */
export const displayAchievements = (achievements: any[], translations?: TranslationData): void => {
  const achievementsContainer = getElementById<HTMLElement>("unlocked-achievements");
  const achievementsSection = getElementById<HTMLElement>("achievements-section");

  if (!achievementsContainer || !achievementsSection) {
    console.warn("Achievement display elements not found");
    return;
  }

  // Clear existing content
  achievementsContainer.innerHTML = "";

  if (!achievements || achievements.length === 0) {
    // Hide achievements section if no achievements
    achievementsSection.style.display = "none";
    return;
  }

  // Show achievements section
  achievementsSection.style.display = "block";
  console.log(`Displaying ${achievements.length} achievements:`, achievements);

  // Create achievement items
  achievements.forEach((achievement) => {
    const achievementElement = document.createElement("div");
    achievementElement.className = "achievement-item";
    achievementElement.setAttribute("role", "listitem");
    achievementElement.setAttribute(
      "aria-label",
      `${achievement.name}: ${achievement.description}`
    );

    achievementElement.innerHTML = `
      <div class="achievement-item__icon" aria-hidden="true">
        ${achievement.icon_path ? `<img src="${achievement.icon_path}" alt="" />` : "🏆"}
      </div>
      <div class="achievement-item__content">
        <h4 class="achievement-item__name">${achievement.name || "Achievement"}</h4>
        <p class="achievement-item__description">${achievement.description || ""}</p>
      </div>
    `;

    achievementsContainer.appendChild(achievementElement);
  });

  // Update aria-live region for screen readers
  const announcement =
    translations?.["achievements.unlocked.announcement"] ||
    `${achievements.length} achievement${achievements.length > 1 ? "s" : ""} unlocked!`;

  announceToScreenReader(announcement);
};

/**
 * Setup achievement event listeners for EndOverlay
 * @returns void
 */
export const setupAchievementDisplay = (): void => {
  // Listen for achievement unlock events
  const handleAchievementUnlock = (event: CustomEvent) => {
    const achievement = event.detail;
    console.log("Achievement unlocked for EndOverlay:", achievement);

    // Get current achievements and add the new one
    const achievementsContainer = getElementById<HTMLElement>("unlocked-achievements");
    if (achievementsContainer) {
      // Get translations
      const overlay =
        getElementById<HTMLElement>("endgame-popup") ||
        getElement<HTMLElement>("[data-translations]");
      const translationsData = overlay?.getAttribute("data-translations");
      const translations = parseTranslations(translationsData);

      // Add single achievement
      displayAchievements([achievement], translations);
    }
  };

  // Listen for multiple achievements
  const handleMultipleAchievements = (event: CustomEvent) => {
    const achievements = event.detail.achievements || [];
    console.log("Multiple achievements for EndOverlay:", achievements);

    // Get translations
    const overlay =
      getElementById<HTMLElement>("endgame-popup") ||
      getElement<HTMLElement>("[data-translations]");
    const translationsData = overlay?.getAttribute("data-translations");
    const translations = parseTranslations(translationsData);

    displayAchievements(achievements, translations);
  };

  // Add event listeners
  document.addEventListener("achievementUnlocked", handleAchievementUnlock);
  document.addEventListener("achievementsUpdated", handleMultipleAchievements);

  console.log("Achievement display system set up");
};

/**
 * Setup sharing functionality with Web Share API fallback
 * @returns void
 */
export const setupSharingButton = (): void => {
  const shareButton =
    getElementById<HTMLButtonElement>("share-btn") || getElement<HTMLButtonElement>(".share-btn");

  if (!shareButton) {
    console.warn("Share button not found");
    return;
  }

  shareButton.addEventListener("click", async (event) => {
    event.preventDefault();

    try {
      // Get current game data and translations
      const overlay =
        getElementById<HTMLElement>("endgame-popup") || getElement<HTMLElement>("[data-score]");
      const score = parseInt(overlay?.getAttribute("data-score") || "0", 10);
      const category = overlay?.getAttribute("data-category") || "";
      const difficulty = overlay?.getAttribute("data-difficulty") || "";

      // Get translations
      const translationsData = overlay?.getAttribute("data-translations");
      const translations = parseTranslations(translationsData);

      const shareText = generateShareText(score, category, difficulty, translations);
      const shareUrl = window.location.origin;
      const shareTitle = translations?.["game.end.shareResults"] || "MelodyMind - Music Quiz Game";

      // Check if Web Share API is supported
      if (navigator.share) {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        console.log("Shared successfully using Web Share API");
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(shareText);

        // Show user feedback with localized text
        const originalText = shareButton.textContent;
        const copiedText = translations?.["general.copied"] || "✅ Kopiert!";
        shareButton.textContent = copiedText;
        shareButton.style.background = "var(--color-success-600)";

        setTimeout(() => {
          shareButton.textContent = originalText;
          shareButton.style.background = "";
        }, 2000);

        console.log("Share text copied to clipboard");
      }
    } catch (error) {
      console.error("Error sharing:", error);

      // Show error feedback with localized text
      const overlay =
        getElementById<HTMLElement>("endgame-popup") || getElement<HTMLElement>("[data-score]");
      const translationsData = overlay?.getAttribute("data-translations");
      const translations = parseTranslations(translationsData);

      const originalText = shareButton.textContent;
      const errorText = translations?.["general.error"] || "❌ Fehler";
      shareButton.textContent = errorText;
      shareButton.style.background = "var(--color-error-600)";

      setTimeout(() => {
        shareButton.textContent = originalText;
        shareButton.style.background = "";
      }, 2000);
    }
  });

  console.log("Share button functionality set up");
};

/**
 * Check authentication status using localStorage (proxy for HttpOnly cookies)
 * @returns boolean - true if authenticated, false otherwise
 */
const isAuthenticated = (): boolean => {
  try {
    const authStatus = localStorage.getItem('auth_status');
    const isAuth = authStatus === 'authenticated';
    
    console.log('EndOverlay auth check:', {
      authStatus,
      isAuth,
      localStorageAvailable: typeof Storage !== 'undefined'
    });
    
    return isAuth;
  } catch (error) {
    console.error('Error checking authentication status in EndOverlay:', error);
    return false;
  }
};

/**
 * Show or hide the guest login section based on authentication status
 * @returns void
 */
const handleGuestLoginSection = (): void => {
  const guestLoginSection = getElementById<HTMLElement>("guest-login-section");
  
  if (!guestLoginSection) {
    console.log("Guest login section not found in EndOverlay");
    return;
  }

  const isUserAuthenticated = isAuthenticated();
  
  if (isUserAuthenticated) {
    // User is authenticated - hide guest login section
    guestLoginSection.style.display = "none";
    console.log("User is authenticated - hiding guest login section");
  } else {
    // User is not authenticated - show guest login section
    guestLoginSection.style.display = "block";
    console.log("User is not authenticated - showing guest login section");
    
    // Announce to screen readers
    announceToScreenReader("Login options available to save your score and unlock achievements");
  }
};

/**
 * Set up event listeners for authentication changes
 * @returns void
 */
const setupGuestLoginEventListeners = (): void => {
  // Listen for authentication success events (existing system)
  const handleAuthLogin = async () => {
    console.log("Authentication login detected in EndOverlay");
    handleGuestLoginSection();
    
    // Save pending game results after login
    await savePendingGameResults();
  };

  // Listen for authentication logout events (existing system)
  const handleAuthLogout = () => {
    console.log("Authentication logout detected in EndOverlay");
    handleGuestLoginSection();
    
    // Clear any pending results on logout
    localStorage.removeItem("pending_game_result");
  };

  // Listen for storage events (authentication changes)
  const handleStorageChange = async (event: StorageEvent) => {
    if (event.key === "auth_status") {
      console.log("Authentication storage change detected in EndOverlay:", event.newValue);
      handleGuestLoginSection();
      
      // If user just logged in, save pending results
      if (event.newValue === "authenticated") {
        await savePendingGameResults();
      }
    }
  };

  // Listen for visibility changes (user might have logged in elsewhere)
  const handleVisibilityChange = async () => {
    if (document.visibilityState === "visible") {
      console.log("Page became visible, checking auth status in EndOverlay");
      handleGuestLoginSection();
      
      // Check if user logged in elsewhere and save pending results
      if (isAuthenticated()) {
        await savePendingGameResults();
      }
    }
  };

  // Add event listeners using the existing event system
  window.addEventListener("auth:login", handleAuthLogin);
  window.addEventListener("auth:logout", handleAuthLogout);
  window.addEventListener("storage", handleStorageChange);
  document.addEventListener("visibilitychange", handleVisibilityChange);

  console.log("Guest login event listeners set up");
};

/**
 * Store game results temporarily for guest users
 * @param gameData - Game data to store
 */
const storeGameResultsForGuest = (gameData: any): void => {
  try {
    localStorage.setItem("pending_game_result", JSON.stringify(gameData));
    console.log("Game results stored for guest user:", gameData);
  } catch (error) {
    console.error("Error storing game results for guest:", error);
  }
};

/**
 * Save pending game results after login
 * @returns Promise<void>
 */
const savePendingGameResults = async (): Promise<void> => {
  try {
    const pendingResult = localStorage.getItem("pending_game_result");
    if (!pendingResult) {
      console.log("No pending game results to save");
      return;
    }

    const gameData = JSON.parse(pendingResult);
    console.log("Saving pending game results:", gameData);

    // Get current language
    const currentLang = document.documentElement.lang || "en";
    
    // Save to database
    const response = await fetch(`/${currentLang}/api/game/save-result`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(gameData),
    });

    if (response.ok) {
      // Remove from localStorage after successful save
      localStorage.removeItem("pending_game_result");
      console.log("Pending game results saved successfully");
      
      // Announce success to screen reader
      announceToScreenReader("Game results saved successfully after login");
    } else {
      console.error("Failed to save pending game results:", await response.text());
    }
  } catch (error) {
    console.error("Error saving pending game results:", error);
  }
};

/**
 * Complete EndOverlay setup with score, animations, and motivation text
 * This function should be called when the overlay is shown to trigger all animations
 * @param config - Configuration object with score and optional parameters
 * @returns Promise<void>
 */
export const showEndOverlay = async (config: EndOverlayConfig): Promise<void> => {
  const { score, maxScore = 1000 } = config;

  console.log("showEndOverlay called with:", { score, maxScore });

  // Update the overlay data attribute FIRST for ShareOverlay
  const overlay =
    getElementById<HTMLElement>("endgame-popup") || getElement<HTMLElement>("[data-score]");
  if (overlay) {
    overlay.setAttribute("data-score", score.toString());
    console.log("Updated overlay data-score attribute to:", score);
  }

  // Store game results for guest users
  if (!isAuthenticated()) {
    const gameData = {
      score,
      category: overlay?.getAttribute("data-category") || "",
      difficulty: overlay?.getAttribute("data-difficulty") || "",
      gameMode: overlay?.getAttribute("data-mode") || "normal",
      timestamp: new Date().toISOString(),
    };
    storeGameResultsForGuest(gameData);
  }

  // Use Promise.all for concurrent operations
  await Promise.all([
    updateEndOverlayScore(score),
    updateMotivationText(score),
    animateProgressBar(score, maxScore),
    updateDifficultyDisplay(),
    updateCategoryDisplay(),
  ]);

  // Handle guest login section visibility
  handleGuestLoginSection();

  console.log("showEndOverlay completed successfully");
};

/**
 * Initialize the EndOverlay component functionality
 * Sets up event listeners and initializes motivation text based on score
 * @returns Promise<void>
 */
export const initializeEndOverlay = async (): Promise<void> => {
  // Get the initial score from the overlay data attribute using modern destructuring
  const overlay = getElement<HTMLElement>("[data-score]");
  const score = parseInt(overlay?.getAttribute("data-score") || "0", 10);

  await updateMotivationText(score);

  // Set up restart button functionality
  setupRestartButton();

  // Set up sharing functionality
  setupSharingButton();

  // Set up achievement display
  setupAchievementDisplay();

  // Set up authentication event listeners for guest login section
  setupGuestLoginEventListeners();

  // Set up global showEndOverlay function for game engines to use
  // Support both the new config API and the legacy (score, maxScore) API
  (globalThis as { showEndOverlay?: any }).showEndOverlay = (
    configOrScore: EndOverlayConfig | number,
    maxScore?: number
  ) => {
    console.log("Global showEndOverlay called with:", { configOrScore, maxScore });
    if (typeof configOrScore === "number") {
      // Legacy API: (score, maxScore)
      console.log("Using legacy API");
      return showEndOverlay({
        score: configOrScore,
        maxScore: maxScore || 1000,
      });
    } else {
      // New API: (config)
      console.log("Using new config API");
      return showEndOverlay(configOrScore);
    }
  };
};

/**
 * Set up EndOverlay functionality when DOM is ready
 * This function handles the initialization timing to ensure proper setup
 * @returns Promise<void>
 */
export const setupEndOverlay = async (): Promise<void> => {
  const initializeWhenReady = async (): Promise<void> => {
    if (document.readyState === "loading") {
      return new Promise<void>((resolve) => {
        document.addEventListener("DOMContentLoaded", async () => {
          await initializeEndOverlay();
          resolve();
        });
      });
    } else {
      // DOM is already loaded
      await initializeEndOverlay();
    }
  };

  await initializeWhenReady();
};

// Export a default function for easier imports
export default setupEndOverlay;
