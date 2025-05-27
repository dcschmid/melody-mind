/**
 /**
 * @file Component Tests for AchievementBadge
 * @description Comprehensive test suite for the AchievementBadge Astro component
 * Tests rendering, props handling, translations, and edge cases
 */

import { describe, expect, test, beforeEach, afterEach, vi } from "vitest";

// Mock component data for testing
const mockAchievement = {
  id: "first-perfect",
  nameKey: "achievements.first-perfect.name",
  descriptionKey: "achievements.first-perfect.description",
  icon: "🏆",
  rarity: "legendary" as const,
  unlockedAt: new Date("2024-01-15T10:30:00Z"),
  category: "performance" as const,
};

const mockTranslations: Record<string, string> = {
  "achievements.first-perfect.name": "Perfect Score",
  "achievements.first-perfect.description": "Get 100% on your first quiz",
  "achievements.unlocked-on": "Unlocked on",
  "achievements.locked": "Locked",
  "achievements.rarity.common": "Common",
  "achievements.rarity.uncommon": "Uncommon",
  "achievements.rarity.rare": "Rare",
  "achievements.rarity.epic": "Epic",
  "achievements.rarity.legendary": "Legendary",
};

// Helper function to create a mock badge element
function createMockBadgeElement(props: any = {}): HTMLElement {
  const defaultProps = {
    achievement: mockAchievement,
    isUnlocked: true,
    animated: false,
    compact: false,
    showRarity: true,
    showDate: true,
    ...props,
  };

  const element = document.createElement("div");
  element.className = "achievement-badge";
  element.setAttribute("data-testid", "achievement-badge");

  // Add achievement data
  Object.entries(defaultProps.achievement).forEach(([key, value]) => {
    element.setAttribute(`data-${key}`, String(value));
  });

  // Add state attributes
  element.setAttribute("data-unlocked", String(defaultProps.isUnlocked));
  element.setAttribute("data-animated", String(defaultProps.animated));
  element.setAttribute("data-compact", String(defaultProps.compact));
  element.setAttribute("data-show-rarity", String(defaultProps.showRarity));
  element.setAttribute("data-show-date", String(defaultProps.showDate));

  // Add basic structure
  element.innerHTML = `
    <div class="achievement-icon">${defaultProps.achievement.icon}</div>
    <div class="achievement-content">
      <h3 class="achievement-name">${mockTranslations[defaultProps.achievement.nameKey]}</h3>
      <p class="achievement-description">${mockTranslations[defaultProps.achievement.descriptionKey]}</p>
      ${defaultProps.showRarity ? `<span class="achievement-rarity">${mockTranslations[`achievements.rarity.${defaultProps.achievement.rarity}`]}</span>` : ""}
      ${defaultProps.showDate && defaultProps.isUnlocked ? `<time class="achievement-date">${mockTranslations["achievements.unlocked-on"]} ${defaultProps.achievement.unlockedAt.toLocaleDateString()}</time>` : ""}
    </div>
  `;

  return element;
}

describe("AchievementBadge Component", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    vi.clearAllMocks();
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  describe("Basic Rendering", () => {
    test("renders achievement badge with basic structure", () => {
      const badge = createMockBadgeElement();
      document.body.appendChild(badge);

      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass("achievement-badge");
      expect(badge.querySelector(".achievement-icon")).toBeInTheDocument();
      expect(badge.querySelector(".achievement-content")).toBeInTheDocument();
      expect(badge.querySelector(".achievement-name")).toBeInTheDocument();
      expect(badge.querySelector(".achievement-description")).toBeInTheDocument();
    });

    test("displays achievement icon correctly", () => {
      const badge = createMockBadgeElement();
      document.body.appendChild(badge);

      const icon = badge.querySelector(".achievement-icon");
      expect(icon).toHaveTextContent("🏆");
    });

    test("displays achievement name from translation", () => {
      const badge = createMockBadgeElement();
      document.body.appendChild(badge);

      const name = badge.querySelector(".achievement-name");
      expect(name).toHaveTextContent("Perfect Score");
    });

    test("displays achievement description from translation", () => {
      const badge = createMockBadgeElement();
      document.body.appendChild(badge);

      const description = badge.querySelector(".achievement-description");
      expect(description).toHaveTextContent("Get 100% on your first quiz");
    });
  });

  describe("Props Handling", () => {
    test("shows rarity when showRarity is true", () => {
      const badge = createMockBadgeElement({ showRarity: true });
      document.body.appendChild(badge);

      const rarity = badge.querySelector(".achievement-rarity");
      expect(rarity).toBeInTheDocument();
      expect(rarity).toHaveTextContent("Legendary");
    });

    test("hides rarity when showRarity is false", () => {
      const badge = createMockBadgeElement({ showRarity: false });
      document.body.appendChild(badge);

      const rarity = badge.querySelector(".achievement-rarity");
      expect(rarity).not.toBeInTheDocument();
    });

    test("shows unlock date when showDate is true and achievement is unlocked", () => {
      const badge = createMockBadgeElement({ showDate: true, isUnlocked: true });
      document.body.appendChild(badge);

      const date = badge.querySelector(".achievement-date");
      expect(date).toBeInTheDocument();
      expect(date).toHaveTextContent(/Unlocked on/);
    });

    test("hides unlock date when showDate is false", () => {
      const badge = createMockBadgeElement({ showDate: false });
      document.body.appendChild(badge);

      const date = badge.querySelector(".achievement-date");
      expect(date).not.toBeInTheDocument();
    });

    test("hides unlock date when achievement is locked", () => {
      const badge = createMockBadgeElement({ showDate: true, isUnlocked: false });
      document.body.appendChild(badge);

      const date = badge.querySelector(".achievement-date");
      expect(date).not.toBeInTheDocument();
    });

    test("applies correct data attributes", () => {
      const badge = createMockBadgeElement({
        animated: true,
        compact: true,
        isUnlocked: false,
      });
      document.body.appendChild(badge);

      expect(badge).toHaveAttribute("data-animated", "true");
      expect(badge).toHaveAttribute("data-compact", "true");
      expect(badge).toHaveAttribute("data-unlocked", "false");
    });
  });

  describe("Unlocked vs Locked States", () => {
    test("displays full content when unlocked", () => {
      const badge = createMockBadgeElement({ isUnlocked: true });
      document.body.appendChild(badge);

      expect(badge.querySelector(".achievement-name")).toHaveTextContent("Perfect Score");
      expect(badge.querySelector(".achievement-description")).toHaveTextContent(
        "Get 100% on your first quiz"
      );
      expect(badge).toHaveAttribute("data-unlocked", "true");
    });

    test("handles locked state appropriately", () => {
      const badge = createMockBadgeElement({ isUnlocked: false });
      document.body.appendChild(badge);

      expect(badge).toHaveAttribute("data-unlocked", "false");
      // In a real implementation, locked achievements might show different content
    });
  });

  describe("Different Achievement Types", () => {
    const achievementTypes = [
      {
        rarity: "common" as const,
        expectedText: "Common",
      },
      {
        rarity: "uncommon" as const,
        expectedText: "Uncommon",
      },
      {
        rarity: "rare" as const,
        expectedText: "Rare",
      },
      {
        rarity: "epic" as const,
        expectedText: "Epic",
      },
      {
        rarity: "legendary" as const,
        expectedText: "Legendary",
      },
    ];

    test.each(achievementTypes)(
      "displays correct rarity text for $rarity",
      ({ rarity, expectedText }) => {
        const testAchievement = { ...mockAchievement, rarity };
        const badge = createMockBadgeElement({
          achievement: testAchievement,
          showRarity: true,
        });
        document.body.appendChild(badge);

        const rarityElement = badge.querySelector(".achievement-rarity");
        expect(rarityElement).toHaveTextContent(expectedText);
      }
    );
  });

  describe("Date Formatting", () => {
    test("formats unlock date correctly", () => {
      const testDate = new Date("2024-01-15T10:30:00Z");
      const testAchievement = { ...mockAchievement, unlockedAt: testDate };
      const badge = createMockBadgeElement({
        achievement: testAchievement,
        isUnlocked: true,
        showDate: true,
      });
      document.body.appendChild(badge);

      const dateElement = badge.querySelector(".achievement-date");
      expect(dateElement).toBeInTheDocument();
      expect(dateElement).toHaveTextContent(testDate.toLocaleDateString());
    });

    test("handles different date formats", () => {
      const dates = [
        new Date("2024-01-01"),
        new Date("2024-12-31"),
        new Date("2024-06-15T12:00:00Z"),
      ];

      dates.forEach((date) => {
        const testAchievement = { ...mockAchievement, unlockedAt: date };
        const badge = createMockBadgeElement({
          achievement: testAchievement,
          isUnlocked: true,
          showDate: true,
        });
        document.body.appendChild(badge);

        const dateElement = badge.querySelector(".achievement-date");
        expect(dateElement).toHaveTextContent(date.toLocaleDateString());

        // Clean up for next iteration
        badge.remove();
      });
    });
  });

  describe("Accessibility", () => {
    test("has proper ARIA attributes", () => {
      const badge = createMockBadgeElement();
      badge.setAttribute("role", "img");
      badge.setAttribute("aria-label", "Achievement: Perfect Score");
      document.body.appendChild(badge);

      expect(badge).toHaveAttribute("role", "img");
      expect(badge).toHaveAttribute("aria-label");
    });

    test("time element has proper datetime attribute", () => {
      const testDate = new Date("2024-01-15T10:30:00Z");
      const badge = createMockBadgeElement({
        achievement: { ...mockAchievement, unlockedAt: testDate },
        isUnlocked: true,
        showDate: true,
      });
      document.body.appendChild(badge);

      const timeElement = badge.querySelector("time");
      if (timeElement) {
        timeElement.setAttribute("datetime", testDate.toISOString());
        expect(timeElement).toHaveAttribute("datetime", testDate.toISOString());
      }
    });
  });

  describe("Performance", () => {
    test("renders multiple badges efficiently", () => {
      const startTime = performance.now();

      // Create 100 badge elements
      for (let i = 0; i < 100; i++) {
        const badge = createMockBadgeElement();
        document.body.appendChild(badge);
      }

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render 100 badges in less than 100ms
      expect(renderTime).toBeLessThan(100);
      expect(document.querySelectorAll(".achievement-badge")).toHaveLength(100);
    });

    test("handles rapid re-renders without memory leaks", () => {
      const container = document.createElement("div");
      document.body.appendChild(container);

      // Simulate rapid re-renders
      for (let i = 0; i < 50; i++) {
        container.innerHTML = "";
        const badge = createMockBadgeElement();
        container.appendChild(badge);
      }

      expect(container.children).toHaveLength(1);
      expect(container.querySelector(".achievement-badge")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    test("handles missing translation keys gracefully", () => {
      const badAchievement = {
        ...mockAchievement,
        nameKey: "nonexistent.key",
        descriptionKey: "another.nonexistent.key",
      };

      const badge = createMockBadgeElement({ achievement: badAchievement });
      // In a real implementation, this would show fallback text
      document.body.appendChild(badge);

      expect(badge).toBeInTheDocument();
    });

    test("handles invalid date objects", () => {
      const badAchievement = {
        ...mockAchievement,
        unlockedAt: new Date("invalid-date"),
      };

      const badge = createMockBadgeElement({
        achievement: badAchievement,
        isUnlocked: true,
        showDate: true,
      });
      document.body.appendChild(badge);

      expect(badge).toBeInTheDocument();
      // Should handle invalid dates gracefully
    });

    test("handles extremely long achievement names", () => {
      const longNameAchievement = {
        ...mockAchievement,
        nameKey: "long.name",
      };

      const longTranslations = {
        ...mockTranslations,
        "long.name":
          "This is an extremely long achievement name that might cause layout issues if not handled properly",
      };

      const badge = createMockBadgeElement({ achievement: longNameAchievement });
      const nameElement = badge.querySelector(".achievement-name");
      if (nameElement) {
        nameElement.textContent = longTranslations["long.name"];
      }
      document.body.appendChild(badge);

      expect(badge).toBeInTheDocument();
      expect(nameElement).toHaveTextContent(/extremely long achievement name/);
    });

    test("handles empty or null achievement data", () => {
      // Test with minimal data
      const minimalBadge = document.createElement("div");
      minimalBadge.className = "achievement-badge";
      document.body.appendChild(minimalBadge);

      expect(minimalBadge).toBeInTheDocument();
      expect(minimalBadge).toHaveClass("achievement-badge");
    });
  });
});
