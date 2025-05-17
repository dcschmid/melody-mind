/**
 * Achievement Events
 *
 * This module provides functions for the achievement event system.
 * It enables subscribing to achievement events and triggering events.
 */

import type { AchievementEvent, LocalizedAchievement } from "../../types/achievement";

// Event listener type
type AchievementEventListener = (event: AchievementEvent) => void;

// Event listener collection
const listeners: AchievementEventListener[] = [];

/**
 * Adds an event listener for achievement events
 *
 * @param listener - The event listener function
 * @returns A function to remove the listener
 */
export function subscribeToAchievementEvents(listener: AchievementEventListener): () => void {
  listeners.push(listener);

  // Return function to remove the listener
  return () => {
    const index = listeners.indexOf(listener);
    if (index !== -1) {
      listeners.splice(index, 1);
    }
  };
}

/**
 * Triggers an achievement unlocked event
 *
 * @param achievement - The unlocked achievement
 */
export function triggerAchievementUnlocked(achievement: LocalizedAchievement): void {
  const event: AchievementEvent = {
    type: "achievement_unlocked",
    achievement,
    timestamp: new Date().toISOString(),
  };

  // Notify all listeners
  for (const listener of listeners) {
    try {
      listener(event);
    } catch (error) {
      console.error("Error notifying an achievement event listener:", error);
    }
  }
}

/**
 * Initializes the achievement event system
 *
 * This function should be called when the application starts.
 */
export function initAchievementEventSystem(): void {
  // Additional initialization steps could be added here
  console.log("Achievement event system initialized");
}
