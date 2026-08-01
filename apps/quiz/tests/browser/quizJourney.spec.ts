import { expect, test } from "@playwright/test";

test("keeps the catalog actionable and compact on a phone", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/");

  const randomQuiz = page.getByRole("link", { name: "Start a random quiz" });
  await expect(randomQuiz).toBeInViewport();
  await expect(page.locator("html")).toHaveJSProperty("scrollWidth", 360);

  const firstCard = page.locator(".quiz-grid--decades .quiz-card").first();
  await firstCard.scrollIntoViewIfNeeded();
  const box = await firstCard.boundingBox();
  expect(box?.height).toBeLessThan(190);
});

test("uses the drawer without overlapping the brand at tablet width", async ({
  page,
}) => {
  await page.setViewportSize({ width: 768, height: 900 });
  await page.goto("/");

  await expect(page.getByRole("button", { name: "Open navigation" })).toBeVisible();
  await expect(page.locator(".quiz-header__desktop-nav")).toBeHidden();
});

test("puts the start action in the first mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/from-jazz-to-neo-soul/");

  await expect(page.getByRole("button", { name: "Start quiz" })).toBeInViewport();
});

test("moves from answer feedback to sources and the next action in DOM order", async ({
  page,
}) => {
  await page.goto("/1950s/");
  await page.getByRole("button", { name: "Start quiz" }).click();
  await page.locator(".quiz-option").first().click();
  await page.getByRole("button", { name: "Check answer" }).click();

  const feedbackTitle = page.locator(".quiz-feedback__title");
  await expect(feedbackTitle).toBeFocused();
  await expect(page.getByRole("button", { name: "Next question" })).toBeVisible();
  const orderIsNatural = await page.evaluate(() => {
    const feedback = document.querySelector("#quiz-feedback");
    const next = document.querySelector("#quiz-next");
    if (!feedback || !next) {
      return false;
    }
    return Boolean(
      feedback.compareDocumentPosition(next) & Node.DOCUMENT_POSITION_FOLLOWING
    );
  });
  expect(orderIsNatural).toBe(true);
});

test("scrolls back to the quiz heading when the next question loads", async ({
  page,
}) => {
  await page.goto("/1950s/");
  await page.getByRole("button", { name: "Start quiz" }).click();
  await page.getByRole("button", { name: "Show answer" }).click();
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.getByRole("button", { name: "Next question" }).click();

  await expect(page.locator("#quiz-progress-text")).toHaveText("Question 2 of 10");
  await expect(page.locator("#quiz-game")).toBeInViewport();
  const gameTop = await page
    .locator("#quiz-game")
    .evaluate((element) => Math.round(element.getBoundingClientRect().top));
  expect(gameTop).toBeGreaterThanOrEqual(0);
  expect(gameTop).toBeLessThan(160);
});

test("reviews revealed answers and recommends the next quiz", async ({ page }) => {
  await page.goto("/1950s/");
  await page.getByRole("button", { name: "Start quiz" }).click();

  for (let question = 0; question < 10; question += 1) {
    await page.getByRole("button", { name: "Show answer" }).click();
    await page
      .getByRole("button", {
        name: question === 9 ? "See your result" : "Next question",
      })
      .click();
  }

  await expect(page.getByRole("heading", { name: "Your result" })).toBeFocused();
  await expect(page.locator(".quiz-review-item")).toHaveCount(10);
  await expect(page.getByRole("heading", { name: "The 1960s" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Start next quiz" })).toHaveAttribute(
    "href",
    "/1960s/"
  );
});

test("announces discarded progress and keeps a valid focus target", async ({ page }) => {
  await page.goto("/1950s/");
  await page.getByRole("button", { name: "Start quiz" }).click();
  await page.getByRole("link", { name: "Save & exit" }).click();
  await page.getByRole("button", { name: "Discard saved round" }).click();
  await page.getByRole("button", { name: "Discard progress" }).click();

  const status = page.getByRole("status");
  await expect(status).toBeFocused();
  await expect(status).toContainText("Saved round discarded");
});
