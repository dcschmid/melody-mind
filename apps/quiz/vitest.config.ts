import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@quiz-types": fileURLToPath(new URL("./src/types", import.meta.url)),
    },
  },
  test: {
    environment: "node",
  },
});
