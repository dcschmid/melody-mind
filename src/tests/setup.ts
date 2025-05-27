import { beforeAll, beforeEach, afterEach, vi } from "vitest";
import "@testing-library/jest-dom";

// Enhanced fix for TextEncoder/esbuild issue in test environment
// This must be done before any imports that might use esbuild
if (typeof global !== "undefined") {
  // Ensure TextEncoder is available and properly configured
  if (!global.TextEncoder) {
    global.TextEncoder = TextEncoder;
  }
  if (!global.TextDecoder) {
    global.TextDecoder = TextDecoder;
  }

  // Additional esbuild compatibility fixes
  const originalTextEncoder = global.TextEncoder;
  global.TextEncoder = class extends originalTextEncoder {
    encode(input = "") {
      const result = super.encode(input);
      // Ensure the result is always a proper Uint8Array
      if (!(result instanceof Uint8Array)) {
        return new Uint8Array(result);
      }
      return result;
    }
  };
}

// Mock window.matchMedia
beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => {},
    }),
  });

  // Mock IntersectionObserver
  global.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    disconnect() {}
    observe() {}
    unobserve() {}
  };

  // Mock ResizeObserver
  global.ResizeObserver = class ResizeObserver {
    constructor() {}
    disconnect() {}
    observe() {}
    unobserve() {}
  };
});

// Mock localStorage for browser APIs
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  key: vi.fn(),
  length: 0,
};

// Setup DOM environment for each test
beforeEach(() => {
  // Reset DOM
  document.body.innerHTML = "";
  document.head.innerHTML = "";

  // Mock localStorage
  Object.defineProperty(window, "localStorage", {
    value: localStorageMock,
    writable: true,
  });

  // Mock location
  Object.defineProperty(window, "location", {
    value: {
      pathname: "/en/game",
      href: "http://localhost:3000/en/game",
    },
    writable: true,
  });

  // Reset all mocks
  vi.clearAllMocks();
});

afterEach(() => {
  // Clean up after each test
  vi.resetAllMocks();
  vi.restoreAllMocks();
});
