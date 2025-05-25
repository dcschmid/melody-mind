/**
 * @file i18n-utils-fixed.test.ts
 * @description Fixed unit tests for the i18n-utils module
 */
import { describe, it, expect, vi } from "vitest";

import {
  getTypedTranslation,
  getTranslation,
  getPreferredLanguage,
  t,
  tTyped,
} from "../lib/i18n-utils";

// Mock the ui module with real-like translation keys
vi.mock("../i18n/ui.js", () => {
  return {
    ui: {
      en: {
        "common.welcome": "Welcome",
        "common.loading": "Loading...",
        "game.difficulty.easy": "Easy",
        "game.score.result": "You scored {points} out of {total} points!",
        "auth.login.welcome": "Welcome back",
      },
      de: {
        "common.welcome": "Willkommen",
        "common.loading": "Lädt...",
        "game.difficulty.easy": "Einfach",
        "game.score.result": "Du hast {points} von {total} Punkten erreicht!",
        // Intentionally missing auth.login.welcome to test fallback
      },
    },
    languages: {
      en: "English",
      de: "Deutsch",
    },
    defaultLang: "en",
  };
});

describe("i18n-utils (fixed)", () => {
  describe("getTypedTranslation", () => {
    it("should return the correct translation for a simple key", () => {
      // Act
      const result = getTypedTranslation("common.welcome" as any, "en");

      // Assert
      expect(result).toBe("Welcome");
    });

    it("should handle parameters correctly", () => {
      // Act
      const result = getTypedTranslation("game.score.result" as any, "en", {
        points: 450,
        total: 500,
      });

      // Assert
      expect(result).toBe("You scored 450 out of 500 points!");
    });

    it("should fall back to default language when a key is not found in the requested language", () => {
      // Act
      const result = getTypedTranslation("auth.login.welcome" as any, "de");

      // Assert
      expect(result).toBe("Welcome back");
    });

    it("should use the key itself when no translation is found in any language", () => {
      // Act
      const result = getTypedTranslation("nonexistent.key" as any, "en");

      // Assert
      expect(result).toBe("nonexistent.key");
    });

    it("should cache translations for better performance", () => {
      // Arrange - Create a spy on the Map.prototype.get method to verify cache usage
      const mapGetSpy = vi.spyOn(Map.prototype, "get");

      // Act
      getTypedTranslation("common.welcome" as any, "en");
      getTypedTranslation("common.welcome" as any, "en"); // Should use cache

      // Assert - The second call should hit the cache
      expect(mapGetSpy).toHaveBeenCalledTimes(2);

      // Cleanup
      mapGetSpy.mockRestore();
    });
  });

  describe("getTranslation", () => {
    it("should work with basic string keys (legacy function)", () => {
      // Act
      const result = getTranslation("common.welcome", "en");

      // Assert
      expect(result).toBe("Welcome");
    });
  });

  describe("getPreferredLanguage", () => {
    it("should extract the correct language from Accept-Language header", () => {
      // Arrange
      const request = new Request("https://example.com", {
        headers: {
          "Accept-Language": "de-DE,de;q=0.9,en;q=0.8",
        },
      });

      // Act
      const result = getPreferredLanguage(request);

      // Assert
      expect(result).toBe("de");
    });

    it("should fall back to default language when no match is found", () => {
      // Arrange
      const request = new Request("https://example.com", {
        headers: {
          "Accept-Language": "fr-FR,fr;q=0.9",
        },
      });

      // Act
      const result = getPreferredLanguage(request);

      // Assert
      expect(result).toBe("en");
    });

    it("should handle empty Accept-Language header", () => {
      // Arrange
      const request = new Request("https://example.com");

      // Act
      const result = getPreferredLanguage(request);

      // Assert
      expect(result).toBe("en");
    });
  });

  describe("t", () => {
    it("should use the language from the request and translate correctly", () => {
      // Arrange
      const request = new Request("https://example.com", {
        headers: {
          "Accept-Language": "de-DE,de;q=0.9,en;q=0.8",
        },
      });

      // Act
      const result = t(request, "common.welcome");

      // Assert
      expect(result).toBe("Willkommen");
    });

    it("should handle parameters correctly", () => {
      // Arrange
      const request = new Request("https://example.com", {
        headers: {
          "Accept-Language": "en-US,en;q=0.9",
        },
      });

      // Act
      const result = t(request, "game.score.result", { points: 450, total: 500 });

      // Assert
      expect(result).toBe("You scored 450 out of 500 points!");
    });
  });

  describe("tTyped", () => {
    it("should use the language from the request and translate with type safety", () => {
      // Arrange
      const request = new Request("https://example.com", {
        headers: {
          "Accept-Language": "en-US,en;q=0.9",
        },
      });

      // Act
      const result = tTyped(request, "game.score.result" as any, { points: 450, total: 500 });

      // Assert
      expect(result).toBe("You scored 450 out of 500 points!");
    });
  });
});
