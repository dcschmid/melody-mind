import { describe, it, expect, vi, beforeEach } from "vitest";

import { updateScoreDisplay } from "./scoreUtils";

describe("scoreUtils", () => {
  let mockElement: HTMLElement;

  beforeEach(() => {
    // Create a mock HTML element
    mockElement = {
      textContent: "",
      classList: {
        add: vi.fn(),
        remove: vi.fn(),
        contains: vi.fn(),
      },
      offsetHeight: 0,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as HTMLElement;
  });

  describe("updateScoreDisplay", () => {
    it("should update score text when different from current display", () => {
      mockElement.textContent = "50";

      updateScoreDisplay(100, mockElement);

      expect(mockElement.textContent).toBe("100");
    });

    it("should not update score text when same as current display", () => {
      mockElement.textContent = "100";
      const originalTextContent = mockElement.textContent;

      updateScoreDisplay(100, mockElement);

      expect(mockElement.textContent).toBe(originalTextContent);
    });

    it("should handle null element gracefully", () => {
      expect(() => updateScoreDisplay(100, null)).not.toThrow();
    });

    it("should add and remove bonus animation class", () => {
      updateScoreDisplay(100, mockElement);

      expect(mockElement.classList.remove).toHaveBeenCalledWith("bonus");
      expect(mockElement.classList.add).toHaveBeenCalledWith("bonus");
    });

    it("should handle score of 0", () => {
      mockElement.textContent = "50";

      updateScoreDisplay(0, mockElement);

      expect(mockElement.textContent).toBe("0");
    });

    it("should handle negative scores", () => {
      mockElement.textContent = "50";

      updateScoreDisplay(-10, mockElement);

      expect(mockElement.textContent).toBe("-10");
    });

    it("should handle large scores", () => {
      mockElement.textContent = "100";

      updateScoreDisplay(99999, mockElement);

      expect(mockElement.textContent).toBe("99999");
    });
  });
});
