import { describe, expect, it } from "vitest";
import { formatDuration } from "./albumPresentation";

describe("formatDuration", () => {
  it("formats whole minutes and padded seconds", () => {
    expect(formatDuration(195)).toBe("3:15");
    expect(formatDuration(65)).toBe("1:05");
    expect(formatDuration(0)).toBe("0:00");
  });

  it("keeps counting minutes past one hour", () => {
    expect(formatDuration(3661)).toBe("61:01");
  });
});
