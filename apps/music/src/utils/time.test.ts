import { describe, expect, it } from "vitest";
import { formatTime } from "./time";

describe("formatTime", () => {
  it("formats minutes and seconds with padded minutes", () => {
    expect(formatTime(195)).toBe("03:15");
    expect(formatTime(0)).toBe("00:00");
  });

  it("shows hours automatically once the duration exceeds one hour", () => {
    expect(formatTime(3729)).toBe("1:02:09");
  });

  it("forces hours and controls minute padding via options", () => {
    expect(formatTime(65, { includeHours: true })).toBe("0:01:05");
    expect(formatTime(65, { padMinutes: false })).toBe("1:05");
  });

  it("falls back to zero for invalid values", () => {
    expect(formatTime(Number.NaN)).toBe("00:00");
    expect(formatTime(Number.POSITIVE_INFINITY)).toBe("00:00");
  });
});
