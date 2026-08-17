import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/browser",
  fullyParallel: true,
  reporter: "line",
  use: {
    baseURL: "http://127.0.0.1:4329",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: {
    /* ASTRO_PREVIEW_BACKGROUND keeps astro preview out of its agent-detection
       mode, which would print JSON and exit instead of serving. */
    command:
      "ASTRO_PREVIEW_BACKGROUND=0 pnpm exec astro preview --host 127.0.0.1 --port 4329",
    url: "http://127.0.0.1:4329",
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
