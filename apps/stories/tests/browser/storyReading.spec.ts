import { expect, test } from "@playwright/test";

test("shows the editorial related story when relatedSlug is set", async ({ page }) => {
  await page.goto("/heavy-kept-changing-shape/");

  const footer = page.locator(".story__related");
  await expect(footer.getByText("Related story")).toBeVisible();
  await expect(footer).toHaveAttribute("href", "/all-four-knobs-to-the-right/");
});

test("keeps the chronological read-next fallback without relatedSlug", async ({
  page,
}) => {
  await page.goto("/the-song-opened-into-the-dance/");

  const footer = page.locator(".story__related");
  await expect(footer.getByText("Read next")).toBeVisible();
  await expect(footer).toHaveAttribute("href", "/the-drone-was-never-still/");
});
