import { expect, test } from "@playwright/test";

const WIDTHS = [320, 390, 768, 1152, 1440];

test("renders the full artist directory and filters by name", async ({ page }) => {
  await page.goto("/artists/");

  await expect(
    page.getByRole("heading", { level: 1, name: "Meet the voices behind the music" })
  ).toBeVisible();
  await expect(page.getByText("90 artist profiles")).toBeVisible();

  const cards = page.locator('[data-testid="artist-card"]');
  await expect(cards).toHaveCount(90);

  const filter = page.getByLabel("Filter artists");
  await filter.fill("Nika Arden");

  await expect(page.locator('[data-testid="artist-card"] >> visible=true')).toHaveCount(
    1
  );
  await expect(page.getByRole("link", { name: /Nika Arden/ }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /Ronan Vale/ }).first()).not.toBeVisible();
  await expect(page.getByText("1 artist shown")).toBeVisible();

  await filter.fill("zzzz-no-such-artist");
  await expect(page.getByText("No artists match this filter.")).toBeVisible();
});

test("renders the Nika Arden profile without exposing the voice ID", async ({ page }) => {
  await page.goto("/artists/nika-arden/");

  await expect(page.getByRole("heading", { level: 1, name: "Nika Arden" })).toBeVisible();
  await expect(page.getByText("Female lead · Heavy Metal")).toBeVisible();
  await expect(page.locator('img[alt="Portrait of Nika Arden"]')).toBeVisible();
  await expect(
    page.getByText(
      "Nika Arden approaches heavy metal with precision first and power second"
    )
  ).toBeVisible();

  const bodyText = await page.locator("body").innerText();
  expect(bodyText).not.toContain("MM-HM-MASTER-F");
});

for (const width of WIDTHS) {
  test(`keeps directory and profile within the ${width}px viewport`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });

    await page.goto("/artists/");
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth)
    ).toBeLessThanOrEqual(width + 1);

    await page.goto("/artists/nika-arden/");
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth)
    ).toBeLessThanOrEqual(width + 1);
  });
}
