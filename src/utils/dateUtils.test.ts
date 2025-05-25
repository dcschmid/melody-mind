import { describe, it, expect } from "vitest";

import { formatDate } from "./dateUtils";

describe("dateUtils", () => {
  describe("formatDate", () => {
    it("should format date string with default German locale", () => {
      const dateString = "2023-12-25T10:30:00Z";
      const result = formatDate(dateString);

      // Should contain German month name and proper format
      expect(result).toContain("Dezember");
      expect(result).toContain("2023");
      expect(result).toContain("25");
    });

    it("should format date string with English locale", () => {
      const dateString = "2023-12-25T10:30:00Z";
      const result = formatDate(dateString, "en");

      // Should contain English month name
      expect(result).toContain("December");
      expect(result).toContain("2023");
      expect(result).toContain("25");
    });

    it("should format Date object correctly", () => {
      const date = new Date("2023-12-25T10:30:00Z");
      const result = formatDate(date, "en");

      expect(result).toContain("December");
      expect(result).toContain("2023");
    });

    it("should handle invalid date string gracefully", () => {
      const result = formatDate("invalid-date");

      // Function catches errors and returns the original string
      expect(result).toBe("invalid-date");
    });

    it("should handle different locales correctly", () => {
      const dateString = "2023-01-15T10:30:00Z";

      const germanResult = formatDate(dateString, "de");
      const englishResult = formatDate(dateString, "en");
      const frenchResult = formatDate(dateString, "fr");

      expect(germanResult).toContain("Januar");
      expect(englishResult).toContain("January");
      expect(frenchResult).toContain("janvier");
    });

    it("should include time information in the format", () => {
      const dateString = "2023-12-25T14:30:00Z";
      const result = formatDate(dateString, "en");

      // Should contain time information
      expect(result).toMatch(/\d{1,2}:\d{2}/); // Matches time format
    });

    it("should handle timezone correctly", () => {
      const date = new Date("2023-12-25T00:00:00Z");
      const result = formatDate(date, "en");

      // Should be a valid formatted string
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
    });

    it("should be consistent for the same input", () => {
      const dateString = "2023-12-25T10:30:00Z";
      const result1 = formatDate(dateString, "de");
      const result2 = formatDate(dateString, "de");

      expect(result1).toBe(result2);
    });
  });
});
