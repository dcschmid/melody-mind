/// <reference types="vitest" />
import { getViteConfig } from "astro/config";

export default getViteConfig({
  test: {
    // Vitest configuration options
    environment: "jsdom",
    globals: true,
    setupFiles: ["src/tests/setup.ts"],
    include: ["src/**/*.{test,spec}.{js,ts,jsx,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/**", "dist/**", "**/*.d.ts", "**/*.config.*", "**/coverage/**"],
    },
  },
});
