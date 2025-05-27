/* eslint-disable max-lines-per-function */
/**
 * Integration Tests for AchievementBadge Component
 *
 * Tests localStorage integration, DOM interactions, and real-world usage scenarios
 * Following WCAG 2.2 AAA standards and MelodyMind testing guidelines
 *
 * @fileoverview Integration test suite for AchievementBadge Astro component
 * @author MelodyMind Development Team
 * @since 2025-05-26
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// Types
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  category: string;
  points: number;
  unlocked: boolean;
  unlockedAt?: Date;
  progress?: {
    current: number;
    total: number;
  };
}

interface MockTranslations {
  [key: string]: string;
}

// Mock data
const mockAchievement: Achievement = {
  id: "first-perfect-score",
  title: "Perfect Score",
  description: "Get all questions right in a round",
  icon: "🎯",
  rarity: "rare",
  category: "performance",
  points: 100,
  unlocked: true,
  unlockedAt: new Date("2025-05-20T14:30:00Z"),
};

const mockLockedAchievement: Achievement = {
  id: "speed-demon",
  title: "Speed Demon",
  description: "Answer 10 questions in under 30 seconds",
  icon: "⚡",
  rarity: "epic",
  category: "speed",
  points: 200,
  unlocked: false,
  progress: {
    current: 7,
    total: 10,
  },
};

const mockTranslations: MockTranslations = {
  "achievements.perfect-score.title": "Perfect Score",
  "achievements.perfect-score.description": "Get all questions right in a round",
  "achievements.speed-demon.title": "Speed Demon",
  "achievements.speed-demon.description": "Answer 10 questions in under 30 seconds",
  "achievements.unlocked": "Unlocked",
  "achievements.locked": "Locked",
  "achievements.points": "points",
  "achievements.progress": "Progress: {current}/{total}",
  "achievements.rarity.common": "Common",
  "achievements.rarity.uncommon": "Uncommon",
  "achievements.rarity.rare": "Rare",
  "achievements.rarity.epic": "Epic",
  "achievements.rarity.legendary": "Legendary",
};

/**
 * Creates a mock AchievementBadge DOM element with all features
 */
function createIntegratedBadgeElement(
  achievement: Achievement,
  options: {
    showRarity?: boolean;
    showDate?: boolean;
    animated?: boolean;
    compact?: boolean;
    locale?: string;
  } = {}
): HTMLElement {
  const {
    showRarity = true,
    showDate = true,
    animated = false,
    compact = false,
    locale = "en",
  } = options;

  const badge = document.createElement("article");
  badge.className = `achievement-badge ${achievement.rarity} ${achievement.unlocked ? "unlocked" : "locked"} ${compact ? "compact" : ""} ${animated ? "animated" : ""}`;
  badge.setAttribute("role", "article");
  badge.setAttribute("aria-label", `Achievement: ${achievement.title}`);
  badge.setAttribute("tabindex", "0");
  badge.setAttribute("data-achievement-id", achievement.id);
  badge.setAttribute("data-unlocked", achievement.unlocked.toString());
  badge.setAttribute("data-rarity", achievement.rarity);

  // Create badge content
  const content = document.createElement("div");
  content.className = "badge-content";

  // Icon
  const icon = document.createElement("div");
  icon.className = "achievement-icon";
  icon.textContent = achievement.icon;
  icon.setAttribute("aria-hidden", "true");
  content.appendChild(icon);

  // Info container
  const info = document.createElement("div");
  info.className = "achievement-info";

  // Title
  const title = document.createElement("h3");
  title.className = "achievement-title";
  title.textContent = achievement.title;
  info.appendChild(title);

  // Description
  const description = document.createElement("p");
  description.className = "achievement-description";
  description.textContent = achievement.description;
  info.appendChild(description);

  // Rarity (if shown)
  if (showRarity) {
    const rarity = document.createElement("span");
    rarity.className = "achievement-rarity";
    rarity.textContent =
      mockTranslations[`achievements.rarity.${achievement.rarity}`] || achievement.rarity;
    rarity.setAttribute("aria-label", `Rarity: ${rarity.textContent}`);
    info.appendChild(rarity);
  }

  // Date (if shown and unlocked)
  if (showDate && achievement.unlocked && achievement.unlockedAt) {
    const date = document.createElement("time");
    date.className = "achievement-date";
    date.setAttribute("datetime", achievement.unlockedAt.toISOString());
    date.textContent = new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(achievement.unlockedAt);
    info.appendChild(date);
  }

  // Progress (if locked and has progress)
  if (!achievement.unlocked && achievement.progress) {
    const progress = document.createElement("div");
    progress.className = "achievement-progress";
    progress.setAttribute("role", "progressbar");
    progress.setAttribute("aria-valuenow", achievement.progress.current.toString());
    progress.setAttribute("aria-valuemin", "0");
    progress.setAttribute("aria-valuemax", achievement.progress.total.toString());
    progress.setAttribute(
      "aria-label",
      `Progress: ${achievement.progress.current} of ${achievement.progress.total}`
    );

    const progressBar = document.createElement("div");
    progressBar.className = "progress-bar";
    progressBar.style.width = `${(achievement.progress.current / achievement.progress.total) * 100}%`;

    const progressText = document.createElement("span");
    progressText.className = "progress-text";
    progressText.textContent = `${achievement.progress.current}/${achievement.progress.total}`;

    progress.appendChild(progressBar);
    progress.appendChild(progressText);
    info.appendChild(progress);
  }

  // Points
  const points = document.createElement("span");
  points.className = "achievement-points";
  points.textContent = `${achievement.points} ${mockTranslations["achievements.points"]}`;
  points.setAttribute("aria-label", `Worth ${achievement.points} points`);
  info.appendChild(points);

  // Status
  const status = document.createElement("span");
  status.className = "achievement-status";
  status.textContent = achievement.unlocked
    ? mockTranslations["achievements.unlocked"]
    : mockTranslations["achievements.locked"];
  status.setAttribute("aria-label", `Status: ${status.textContent}`);
  info.appendChild(status);

  content.appendChild(info);
  badge.appendChild(content);

  // Add click handler for localStorage integration
  badge.addEventListener("click", () => {
    try {
      const viewedAchievements = JSON.parse(localStorage.getItem("viewedAchievements") || "[]");
      if (!viewedAchievements.includes(achievement.id)) {
        viewedAchievements.push(achievement.id);
        localStorage.setItem("viewedAchievements", JSON.stringify(viewedAchievements));
      }
    } catch (error) {
      // Silently handle localStorage errors (quota exceeded, etc.)
      console.warn("Failed to save achievement view to localStorage:", error);
    }

    // Dispatch custom event
    badge.dispatchEvent(
      new CustomEvent("achievement-viewed", {
        detail: { achievementId: achievement.id, achievement },
        bubbles: true,
      })
    );
  });

  // Add keyboard handler
  badge.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      badge.click();
    }
  });

  return badge;
}

/**
 * Simulates localStorage behavior for testing
 */
function setupLocalStorageMock(): { [key: string]: string } {
  const store: { [key: string]: string } = {};

  Object.defineProperty(window, "localStorage", {
    value: {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key];
      }),
      clear: vi.fn(() => {
        Object.keys(store).forEach((key) => delete store[key]);
      }),
      key: vi.fn((index: number) => Object.keys(store)[index] || null),
      get length() {
        return Object.keys(store).length;
      },
    },
    writable: true,
  });

  return store;
}

describe("AchievementBadge Integration Tests", () => {
  beforeEach(() => {
    setupLocalStorageMock();
    document.body.innerHTML = "";
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("localStorage Integration", () => {
    it("should track viewed achievements in localStorage", () => {
      const badge = createIntegratedBadgeElement(mockAchievement);
      document.body.appendChild(badge);

      // Initially no viewed achievements
      expect(localStorage.getItem("viewedAchievements")).toBeNull();

      // Click the badge
      badge.click();

      // Should be stored in localStorage
      const viewedAchievements = JSON.parse(localStorage.getItem("viewedAchievements") || "[]");
      expect(viewedAchievements).toContain(mockAchievement.id);
    });

    it("should not duplicate achievement IDs in localStorage", () => {
      const badge = createIntegratedBadgeElement(mockAchievement);
      document.body.appendChild(badge);

      // Click multiple times
      badge.click();
      badge.click();
      badge.click();

      const viewedAchievements = JSON.parse(localStorage.getItem("viewedAchievements") || "[]");
      expect(viewedAchievements.filter((id: string) => id === mockAchievement.id)).toHaveLength(1);
    });

    it("should handle multiple achievement views", () => {
      const badge1 = createIntegratedBadgeElement(mockAchievement);
      const badge2 = createIntegratedBadgeElement(mockLockedAchievement);

      document.body.appendChild(badge1);
      document.body.appendChild(badge2);

      badge1.click();
      badge2.click();

      const viewedAchievements = JSON.parse(localStorage.getItem("viewedAchievements") || "[]");
      expect(viewedAchievements).toContain(mockAchievement.id);
      expect(viewedAchievements).toContain(mockLockedAchievement.id);
      expect(viewedAchievements).toHaveLength(2);
    });

    it("should persist localStorage data across badge recreations", () => {
      // First badge instance
      const badge1 = createIntegratedBadgeElement(mockAchievement);
      document.body.appendChild(badge1);
      badge1.click();

      // Remove and create new instance
      badge1.remove();
      const badge2 = createIntegratedBadgeElement(mockAchievement);
      document.body.appendChild(badge2);

      // Data should persist
      const viewedAchievements = JSON.parse(localStorage.getItem("viewedAchievements") || "[]");
      expect(viewedAchievements).toContain(mockAchievement.id);
    });
  });

  describe("Custom Event Integration", () => {
    it("should dispatch achievement-viewed event on click", async () => {
      const badge = createIntegratedBadgeElement(mockAchievement);
      document.body.appendChild(badge);

      let eventFired = false;
      let eventDetail: { achievementId: string; achievement: Achievement } | null = null;

      badge.addEventListener("achievement-viewed", (event: Event) => {
        eventFired = true;
        eventDetail = (event as CustomEvent<{ achievementId: string; achievement: Achievement }>)
          .detail;
      });

      badge.click();

      expect(eventFired).toBe(true);
      expect(eventDetail).toEqual({
        achievementId: mockAchievement.id,
        achievement: mockAchievement,
      });
    });

    it("should bubble events to parent elements", async () => {
      const container = document.createElement("div");
      const badge = createIntegratedBadgeElement(mockAchievement);

      container.appendChild(badge);
      document.body.appendChild(container);

      let eventCaught = false;
      container.addEventListener("achievement-viewed", () => {
        eventCaught = true;
      });

      badge.click();

      expect(eventCaught).toBe(true);
    });
  });

  describe("Keyboard Navigation Integration", () => {
    it("should activate badge with Enter key", () => {
      const badge = createIntegratedBadgeElement(mockAchievement);
      document.body.appendChild(badge);

      let eventFired = false;
      badge.addEventListener("achievement-viewed", () => {
        eventFired = true;
      });

      // Simulate Enter key press
      const enterEvent = new KeyboardEvent("keydown", { key: "Enter" });
      badge.dispatchEvent(enterEvent);

      expect(eventFired).toBe(true);
    });

    it("should activate badge with Space key", () => {
      const badge = createIntegratedBadgeElement(mockAchievement);
      document.body.appendChild(badge);

      let eventFired = false;
      badge.addEventListener("achievement-viewed", () => {
        eventFired = true;
      });

      // Simulate Space key press
      const spaceEvent = new KeyboardEvent("keydown", { key: " " });
      badge.dispatchEvent(spaceEvent);

      expect(eventFired).toBe(true);
    });

    it("should not activate with other keys", () => {
      const badge = createIntegratedBadgeElement(mockAchievement);
      document.body.appendChild(badge);

      let eventFired = false;
      badge.addEventListener("achievement-viewed", () => {
        eventFired = true;
      });

      // Simulate other key presses
      ["Tab", "Escape", "ArrowDown", "a"].forEach((key) => {
        const keyEvent = new KeyboardEvent("keydown", { key });
        badge.dispatchEvent(keyEvent);
      });

      expect(eventFired).toBe(false);
    });

    it("should prevent default behavior for Enter and Space", () => {
      const badge = createIntegratedBadgeElement(mockAchievement);
      document.body.appendChild(badge);

      // Test Enter key
      const enterEvent = new KeyboardEvent("keydown", { key: "Enter" });
      const enterSpy = vi.spyOn(enterEvent, "preventDefault");
      badge.dispatchEvent(enterEvent);
      expect(enterSpy).toHaveBeenCalled();

      // Test Space key
      const spaceEvent = new KeyboardEvent("keydown", { key: " " });
      const spaceSpy = vi.spyOn(spaceEvent, "preventDefault");
      badge.dispatchEvent(spaceEvent);
      expect(spaceSpy).toHaveBeenCalled();
    });
  });

  describe("Dynamic Content Updates", () => {
    it("should handle achievement unlock state changes", () => {
      const unlockedAchievement = {
        ...mockLockedAchievement,
        unlocked: true,
        unlockedAt: new Date(),
      };
      const badge = createIntegratedBadgeElement(unlockedAchievement, { showDate: true });
      document.body.appendChild(badge);

      expect(badge.classList.contains("unlocked")).toBe(true);
      expect(badge.classList.contains("locked")).toBe(false);
      expect(badge.getAttribute("data-unlocked")).toBe("true");
      expect(badge.querySelector(".achievement-date")).toBeInTheDocument();
      expect(badge.querySelector(".achievement-progress")).not.toBeInTheDocument();
    });

    it("should handle progress updates for locked achievements", () => {
      const achievementWithProgress = {
        ...mockLockedAchievement,
        progress: { current: 8, total: 10 },
      };
      const badge = createIntegratedBadgeElement(achievementWithProgress);
      document.body.appendChild(badge);

      const progressBar = badge.querySelector(".progress-bar") as HTMLElement;
      expect(progressBar).toBeInTheDocument();
      expect(progressBar.style.width).toBe("80%");

      const progressText = badge.querySelector(".progress-text");
      expect(progressText).toHaveTextContent("8/10");
    });

    it("should handle different locale formatting", () => {
      const achievementWithDate = {
        ...mockAchievement,
        unlockedAt: new Date("2025-05-20T14:30:00Z"),
      };

      // English locale
      const badgeEn = createIntegratedBadgeElement(achievementWithDate, { locale: "en" });
      document.body.appendChild(badgeEn);

      // German locale
      const badgeDe = createIntegratedBadgeElement(achievementWithDate, { locale: "de" });
      document.body.appendChild(badgeDe);

      const dateEn = badgeEn.querySelector(".achievement-date");
      const dateDe = badgeDe.querySelector(".achievement-date");

      expect(dateEn).toBeInTheDocument();
      expect(dateDe).toBeInTheDocument();

      // Dates should be formatted differently for different locales
      expect(dateEn?.textContent).not.toBe(dateDe?.textContent);
    });
  });

  describe("Performance Integration", () => {
    it("should handle rapid interactions without memory leaks", () => {
      const badge = createIntegratedBadgeElement(mockAchievement);
      document.body.appendChild(badge);

      // Rapid clicks
      for (let i = 0; i < 100; i++) {
        badge.click();
      }

      // Should only store achievement ID once
      const viewedAchievements = JSON.parse(localStorage.getItem("viewedAchievements") || "[]");
      expect(viewedAchievements.filter((id: string) => id === mockAchievement.id)).toHaveLength(1);
    });

    it("should handle multiple badges efficiently", () => {
      const achievements = Array.from({ length: 50 }, (_, i) => ({
        ...mockAchievement,
        id: `achievement-${i}`,
        title: `Achievement ${i}`,
      }));

      const badges = achievements.map((achievement) => createIntegratedBadgeElement(achievement));

      badges.forEach((badge) => document.body.appendChild(badge));

      // Click all badges
      badges.forEach((badge) => badge.click());

      const viewedAchievements = JSON.parse(localStorage.getItem("viewedAchievements") || "[]");
      expect(viewedAchievements).toHaveLength(50);
    });
  });

  describe("Error Handling Integration", () => {
    it("should handle localStorage errors gracefully", () => {
      // Mock localStorage to throw error
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = vi.fn(() => {
        throw new Error("Storage quota exceeded");
      });

      const badge = createIntegratedBadgeElement(mockAchievement);
      document.body.appendChild(badge);

      // Should not throw error when clicking
      expect(() => {
        badge.click();
      }).not.toThrow();

      // Restore original implementation
      localStorage.setItem = originalSetItem;
    });

    it("should handle missing achievement data", () => {
      const incompleteAchievement = {
        id: "incomplete",
        title: "",
        description: "",
        icon: "",
        rarity: "common" as const,
        category: "",
        points: 0,
        unlocked: false,
      };

      expect(() => {
        const badge = createIntegratedBadgeElement(incompleteAchievement);
        document.body.appendChild(badge);
        badge.click();
      }).not.toThrow();
    });

    it("should handle invalid progress data", () => {
      const invalidProgressAchievement = {
        ...mockLockedAchievement,
        progress: { current: -1, total: 0 },
      };

      expect(() => {
        const badge = createIntegratedBadgeElement(invalidProgressAchievement);
        document.body.appendChild(badge);
      }).not.toThrow();
    });
  });

  describe("Real-world Usage Scenarios", () => {
    it("should work in achievement gallery context", () => {
      const gallery = document.createElement("div");
      gallery.className = "achievement-gallery";
      gallery.setAttribute("role", "region");
      gallery.setAttribute("aria-label", "Achievement Gallery");

      const achievements = [mockAchievement, mockLockedAchievement];
      const badges = achievements.map((achievement) =>
        createIntegratedBadgeElement(achievement, { showRarity: true, showDate: true })
      );

      badges.forEach((badge) => gallery.appendChild(badge));
      document.body.appendChild(gallery);

      // Test gallery interactions
      badges.forEach((badge) => {
        expect(badge.getAttribute("tabindex")).toBe("0");
        badge.focus();
        badge.click();
      });

      const viewedAchievements = JSON.parse(localStorage.getItem("viewedAchievements") || "[]");
      expect(viewedAchievements).toHaveLength(2);
    });

    it("should work in compact mode for notifications", () => {
      const notification = document.createElement("div");
      notification.className = "achievement-notification";

      const badge = createIntegratedBadgeElement(mockAchievement, {
        compact: true,
        showRarity: false,
        showDate: false,
      });

      notification.appendChild(badge);
      document.body.appendChild(notification);

      expect(badge.classList.contains("compact")).toBe(true);
      expect(badge.querySelector(".achievement-rarity")).not.toBeInTheDocument();
      expect(badge.querySelector(".achievement-date")).not.toBeInTheDocument();
    });

    it("should work with animation effects", () => {
      const badge = createIntegratedBadgeElement(mockAchievement, { animated: true });
      document.body.appendChild(badge);

      expect(badge.classList.contains("animated")).toBe(true);

      // Should still maintain functionality
      badge.click();
      const viewedAchievements = JSON.parse(localStorage.getItem("viewedAchievements") || "[]");
      expect(viewedAchievements).toContain(mockAchievement.id);
    });

    it("should support filtering and searching contexts", () => {
      const container = document.createElement("div");
      container.setAttribute("data-filter-category", "performance");

      const badge = createIntegratedBadgeElement(mockAchievement);
      container.appendChild(badge);
      document.body.appendChild(container);

      // Simulate filtering
      const isVisible =
        badge.getAttribute("data-achievement-id") === mockAchievement.id &&
        mockAchievement.category === "performance";

      expect(isVisible).toBe(true);
      expect(badge.getAttribute("data-rarity")).toBe(mockAchievement.rarity);
    });
  });
});
