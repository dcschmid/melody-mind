import { expect, test } from "@playwright/test";

// This journey is pinned to Chromium via the chromium project in
// playwright.config.ts. Firefox's Playwright offline emulation does not
// dispatch a service-worker `fetch` event for a controlled navigation: with
// the offline context active the reload resolves against the HTTP cache, so
// the worker's network-first catch path never runs and the runtime-cache
// fallback cannot be observed. Chromium emulates the offline navigation the
// worker is written for, so the same user behavior is verified there.
test("serves the runtime homepage when offline after the precache is stale", async ({
  page,
  context,
}) => {
  await page.goto("/");
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });

  // The first load may install the worker without controlling this page.
  if (!(await page.evaluate(() => Boolean(navigator.serviceWorker.controller)))) {
    await page.reload();
  }
  await page.waitForFunction(() => {
    const controller = navigator.serviceWorker.controller;
    return controller !== null;
  });

  // A controlled online navigation creates and populates the runtime cache.
  await page.reload();
  await expect
    .poll(async () => {
      const keys = await page.evaluate(async () => caches.keys());
      const hasStaticCache = keys.some((key) => key.endsWith("-static"));
      const hasRuntimeCache = keys.some((key) => key.endsWith("-runtime"));
      return hasStaticCache && hasRuntimeCache;
    })
    .toBe(true);

  const seed = await page.evaluate(async () => {
    const keys = await caches.keys();
    const staticKey = keys.find((key) => key.endsWith("-static"));
    const runtimeKey = keys.find((key) => key.endsWith("-runtime"));
    if (!staticKey || !runtimeKey) {
      return null;
    }
    const staticCache = await caches.open(staticKey);
    const runtimeCache = await caches.open(runtimeKey);
    await staticCache.put(
      "/",
      new Response(
        `<!doctype html><html><body><p id="offline-marker">stale-precached-homepage</p></body></html>`,
        { status: 200, headers: { "content-type": "text/html" } }
      )
    );
    await runtimeCache.put(
      "/",
      new Response(
        `<!doctype html><html><body><p id="offline-marker">fresh-runtime-homepage</p></body></html>`,
        { status: 200, headers: { "content-type": "text/html" } }
      )
    );
    return true;
  });
  expect(seed).toBe(true);

  await context.setOffline(true);
  try {
    await page.reload();
    const marker = page.locator("#offline-marker");
    await expect(marker).toHaveText("fresh-runtime-homepage");
  } finally {
    await context.setOffline(false);
  }
});
