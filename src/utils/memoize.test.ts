import { describe, it, expect, vi } from "vitest";

import { memoize } from "./memoize";

describe("memoize", () => {
  it("should memoize function results", () => {
    const mockFn = vi.fn((a: number, b: number) => a + b);
    const memoizedFn = memoize(mockFn);

    // First call
    const result1 = memoizedFn(2, 3);
    expect(result1).toBe(5);
    expect(mockFn).toHaveBeenCalledTimes(1);

    // Second call with same arguments should return cached result
    const result2 = memoizedFn(2, 3);
    expect(result2).toBe(5);
    expect(mockFn).toHaveBeenCalledTimes(1); // Still only called once

    // Third call with different arguments should call the function again
    const result3 = memoizedFn(3, 4);
    expect(result3).toBe(7);
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it("should respect maxSize option", () => {
    const mockFn = vi.fn((n: number) => n * 2);
    const memoizedFn = memoize(mockFn, { maxSize: 2 });

    // Fill cache to maxSize
    memoizedFn(1);
    memoizedFn(2);
    expect(mockFn).toHaveBeenCalledTimes(2);

    // Access cached values
    memoizedFn(1);
    memoizedFn(2);
    expect(mockFn).toHaveBeenCalledTimes(2); // Still only 2 calls

    // Adding third item should evict oldest
    memoizedFn(3);
    expect(mockFn).toHaveBeenCalledTimes(3);

    // First item should be evicted, so it will be recalculated
    memoizedFn(1);
    expect(mockFn).toHaveBeenCalledTimes(4);
  });

  it("should respect TTL option", async () => {
    vi.useFakeTimers();

    const mockFn = vi.fn((n: number) => n * 2);
    const memoizedFn = memoize(mockFn, { ttl: 1000 }); // 1 second TTL

    // First call
    memoizedFn(1);
    expect(mockFn).toHaveBeenCalledTimes(1);

    // Cached call (within TTL)
    memoizedFn(1);
    expect(mockFn).toHaveBeenCalledTimes(1);

    // Advance time beyond TTL
    vi.advanceTimersByTime(1001);

    // Should recalculate after TTL expires
    memoizedFn(1);
    expect(mockFn).toHaveBeenCalledTimes(2);

    vi.useRealTimers();
  });

  it("should handle complex arguments", () => {
    const mockFn = vi.fn((obj: { a: number; b: string }) => `${obj.a}-${obj.b}`);
    const memoizedFn = memoize(mockFn);

    const arg1 = { a: 1, b: "test" };
    const arg2 = { a: 1, b: "test" }; // Different object, same content

    const result1 = memoizedFn(arg1);
    const result2 = memoizedFn(arg2);

    expect(result1).toBe("1-test");
    expect(result2).toBe("1-test");
    expect(mockFn).toHaveBeenCalledTimes(1); // Should be cached
  });

  it("should handle functions with no arguments", () => {
    const mockFn = vi.fn(() => Math.random());
    const memoizedFn = memoize(mockFn);

    const result1 = memoizedFn();
    const result2 = memoizedFn();

    expect(result1).toBe(result2);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});
