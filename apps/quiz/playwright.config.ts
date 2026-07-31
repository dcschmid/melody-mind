import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/browser",
  fullyParallel: true,
  reporter: "line",
  use: {
    baseURL: "http://127.0.0.1:4329",
    launchOptions: {
      executablePath: "/usr/bin/chromium",
    },
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "pnpm exec astro preview --host 127.0.0.1 --port 4329",
    url: "http://127.0.0.1:4329",
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
