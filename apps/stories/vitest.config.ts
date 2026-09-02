import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@utils": fileURLToPath(new URL("./src/utils", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    exclude: ["tests/browser/**", "**/node_modules/**"],
  },
});
