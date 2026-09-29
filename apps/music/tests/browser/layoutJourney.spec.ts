import { expect, test, type Locator } from "@playwright/test";

const ALBUM_PATH = "/the-morning-meeting-has-been-extended/";

const intersectsInitialViewport = async (
  locator: Locator,
  viewportHeight: number
): Promise<boolean> => {
  const box = await locator.boundingBox();
  return box !== null && box.y < viewportHeight;
};

// The homepage leads with the featured album hero; the first mobile viewport
// must show its artwork without scrolling (the New Releases shelf only
// renders once more than one album exists).
test("places the featured album artwork in the first mobile homepage viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const artwork = page.locator(".music-home-hero__cover-link");
  await expect(artwork).toBeVisible();
  expect(await intersectsInitialViewport(artwork, 844)).toBe(true);
});

// The shipped mobile design fills the first album viewport with the hero
// (cover, context, primary actions); the tracklist begins below it.
test("places the album hero actions in the first mobile album viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(ALBUM_PATH);

  const play = page.locator(".album-hero__play");
  await expect(play).toBeVisible();
  expect(await intersectsInitialViewport(play, 844)).toBe(true);
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
