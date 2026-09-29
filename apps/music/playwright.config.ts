import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/browser",
  fullyParallel: true,
  reporter: "line",
  projects: [
    {
      name: "firefox",
      testIgnore: /offlineJourney\.spec\.ts/,
      use: { browserName: "firefox" },
    },
    {
      /* Offline SW journey only: Firefox's offline emulation does not dispatch
         worker fetch events for navigations, so the fallback cannot be
         exercised there (see offlineJourney.spec.ts). */
      name: "chromium",
      testMatch: /offlineJourney\.spec\.ts/,
      use: { browserName: "chromium" },
    },
  ],
  use: {
    browserName: "firefox",
    baseURL: "http://127.0.0.1:4327",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: {
    /* ASTRO_PREVIEW_BACKGROUND keeps astro preview out of its agent-detection
       mode, which would print JSON and exit instead of serving. */
    command:
      "ASTRO_PREVIEW_BACKGROUND=0 pnpm exec astro preview --host 127.0.0.1 --port 4327",
    url: "http://127.0.0.1:4327",
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
