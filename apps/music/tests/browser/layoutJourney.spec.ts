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

test("filters the complete album archive and preserves the URL state", async ({
  page,
}) => {
  await page.setViewportSize({ width: 768, height: 900 });
  await page.goto("/albums/");

  await page.getByLabel("Filter all albums").fill("Everything Is Breaking News");
  await expect(page).toHaveURL(
    /filter=Everything(?:\+|%20)Is(?:\+|%20)Breaking(?:\+|%20)News/
  );
  await expect(page.locator("[data-album-filter-item]:not([hidden])")).toHaveCount(1);
  await expect(page.getByText("1 album shown", { exact: true })).toBeVisible();
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
