/**
 * @file i18n-utils.test.ts
 * @description Unit tests for the i18n-utils module
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { ui, defaultLang } from "../i18n/ui.js";
import {
  getTypedTranslation,
  getTranslation,
  getPreferredLanguage,
  t,
  tTyped,
} from "../lib/i18n-utils";

// Mock the ui module
vi.mock("../i18n/ui.js", () => {
  return {
    ui: {
      en: {
        "test.simple": "Simple test",
        "test.withParams": "Test with {count} parameters",
        "test.nested.key": "Nested key test",
      },
      de: {
        "test.simple": "Einfacher Test",
        "test.withParams": "Test mit {count} Parametern",
        // Intentionally missing key to test fallback
      },
    },
    languages: {
      en: "English",
      de: "Deutsch",
    },
    defaultLang: "en",
  };
});

describe("i18n-utils", () => {
  describe("getTypedTranslation", () => {
    it("should return the correct translation for a simple key", () => {
      // Act
      const result = getTypedTranslation("test.simple", "en");

      // Assert
      expect(result).toBe("Simple test");
    });

    it("should handle parameters correctly", () => {
      // Act
      const result = getTypedTranslation("test.withParams", "en", { count: 3 });

      // Assert
      expect(result).toBe("Test with 3 parameters");
    });

    it("should fall back to default language when a key is not found in the requested language", () => {
      // Act
      const result = getTypedTranslation("test.nested.key", "de");

      // Assert
      expect(result).toBe("Nested key test");
    });

    it("should use the key itself when no translation is found in any language", () => {
      // Act
      const result = getTypedTranslation("test.nonexistent" as any, "en");

      // Assert
      expect(result).toBe("test.nonexistent");
    });

    it("should cache translations for better performance", () => {
      // Arrange
      const spy = vi.spyOn(Object.prototype, "hasOwnProperty");

      // Act
      getTypedTranslation("test.simple", "en");
      getTypedTranslation("test.simple", "en"); // Should use cache

      // Assert
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe("getTranslation", () => {
    it("should delegate to getTypedTranslation with the correct parameters", () => {
      // Arrange
      const spy = vi.spyOn(global, "getTypedTranslation");

      // Act
      getTranslation("test.simple", "en");

      // Assert
      expect(spy).toHaveBeenCalledWith("test.simple", "en", undefined);
    });
  });

  describe("getPreferredLanguage", () => {
    it("should extract the correct language from Accept-Language header", () => {
      // Arrange
      const request = new Request("https://example.com", {
        headers: {
          "Accept-Language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
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
          "Accept-Language": "fr-FR,fr;q=0.9,es-ES;q=0.8,es;q=0.7",
        },
      });

      // Act
      const result = getPreferredLanguage(request);

      // Assert
      expect(result).toBe(defaultLang);
    });

    it("should handle empty Accept-Language header", () => {
      // Arrange
      const request = new Request("https://example.com");

      // Act
      const result = getPreferredLanguage(request);

      // Assert
      expect(result).toBe(defaultLang);
    });
  });

  describe("t", () => {
    it("should use the language from the request and translate correctly", () => {
      // Arrange
      const request = new Request("https://example.com", {
        headers: {
          "Accept-Language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
        },
      });

      // Act
      const result = t(request, "test.simple");

      // Assert
      expect(result).toBe("Einfacher Test");
    });

    it("should handle parameters correctly", () => {
      // Arrange
      const request = new Request("https://example.com", {
        headers: {
          "Accept-Language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
        },
      });

      // Act
      const result = t(request, "test.withParams", { count: 5 });

      // Assert
      expect(result).toBe("Test mit 5 Parametern");
    });
  });

  describe("tTyped", () => {
    it("should use the language from the request and translate with type safety", () => {
      // Arrange
      const request = new Request("https://example.com", {
        headers: {
          "Accept-Language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
        },
      });

      // Act
      const result = tTyped(request, "test.withParams", { count: 10 });

      // Assert
      expect(result).toBe("Test mit 10 Parametern");
    });
  });
});
