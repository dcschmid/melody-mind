import { expect, test, type Locator } from "@playwright/test";

const ALBUM_PATH = "/everything-is-breaking-news/";

const intersectsInitialViewport = async (
  locator: Locator,
  viewportHeight: number
): Promise<boolean> => {
  const box = await locator.boundingBox();
  return box !== null && box.y < viewportHeight;
};

test("places New Releases in the first mobile homepage viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const newReleases = page.getByRole("heading", { name: "New Releases" });
  await expect(newReleases).toBeAttached();
  expect(await intersectsInitialViewport(newReleases, 844)).toBe(true);
});

test("places the album Tracklist in the first mobile album viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(ALBUM_PATH);

  const tracklist = page.getByRole("heading", { name: "Tracklist" });
  await expect(tracklist).toBeAttached();
  expect(await intersectsInitialViewport(tracklist, 844)).toBe(true);
});

test("shows liner notes without an extra disclosure step", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(ALBUM_PATH);

  const prose = page.locator(".album-detail-sections__prose");
  await expect(prose).toBeVisible();
  await expect(page.getByText("Read liner notes", { exact: true })).toHaveCount(0);
});

test("keeps primary sharing visible and secondary sharing progressive", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(ALBUM_PATH);

  await expect(
    page.getByRole("button", { name: "Share with your device" })
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Copy link to this album" })
  ).toBeVisible();

  const moreOptions = page.getByText("More sharing options", { exact: true });
  await expect(moreOptions).toBeVisible();
  await moreOptions.click();
  await expect(page.getByRole("link", { name: /Share on Bluesky/ })).toBeVisible();
  await expect(page.locator(".album-embed-generator")).toBeVisible();
});

test("switches navigation at 1152px and groups secondary products", async ({ page }) => {
  await page.setViewportSize({ width: 1152, height: 900 });
  await page.goto("/");

  const header = page.locator("[data-music-site-header]");
  await expect(header.getByRole("link", { name: "Albums", exact: true })).toBeVisible();
  await expect(header.getByText("More", { exact: true })).toBeVisible();
  await expect(header.getByRole("button", { name: "Open main menu" })).toBeHidden();

  await page.setViewportSize({ width: 768, height: 900 });
  await expect(header.getByRole("button", { name: "Open main menu" })).toBeVisible();
});

test("does not introduce horizontal scroll at supported widths", async ({ page }) => {
  const widths = [320, 390, 768, 1152, 1440];

  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ["/", ALBUM_PATH, "/albums/"]) {
      await page.goto(path);
      const hasHorizontalScroll = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth
      );
      expect(hasHorizontalScroll, `${path} overflows horizontally at ${width}px`).toBe(
        false
      );
    }
  }
});

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
