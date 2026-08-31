import { expect, test, type Page } from "@playwright/test";

test("keeps the catalog actionable and compact on a phone", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/");

  const randomQuiz = page.getByRole("link", { name: "Start a random quiz" });
  await expect(randomQuiz).toBeInViewport();
  await expect(page.locator("html")).toHaveJSProperty("scrollWidth", 360);
  await expect(page.locator("#artists .quiz-card")).toHaveCount(2);
  await expect(page.locator("#albums .quiz-card")).toHaveCount(2);

  const firstCard = page.locator(".quiz-grid--decades .quiz-card").first();
  await firstCard.scrollIntoViewIfNeeded();
  const box = await firstCard.boundingBox();
  expect(box?.height).toBeLessThan(190);
});

test("exposes the expanded catalog without desktop overflow", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");

  await expect(
    page
      .locator(".quiz-home__category-nav")
      .getByRole("link", { name: "Artists", exact: true })
  ).toBeVisible();
  await expect(
    page
      .locator(".quiz-home__category-nav")
      .getByRole("link", { name: "Albums", exact: true })
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Follow an artist" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Go inside an album" })).toBeVisible();
  await expect(page.locator("html")).toHaveJSProperty("scrollWidth", 1280);
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

test("resumes a saved round after a reload", async ({ page }) => {
  await page.goto("/1950s/");
  await page.getByRole("button", { name: "Start quiz" }).click();
  await page.getByRole("button", { name: "Show answer" }).click();
  await page.getByRole("button", { name: "Next question" }).click();
  await expect(page.locator("#quiz-progress-text")).toHaveText("Question 2 of 10");

  await page.reload();

  await expect(page.locator("#quiz-storage-status")).toContainText(
    "Your unfinished round is saved only in this browser."
  );
  const continueButton = page.getByRole("button", {
    name: "Continue question 2 of 10",
  });
  await expect(continueButton).toBeVisible();
  await continueButton.click();

  await expect(page.locator("#quiz-progress-text")).toHaveText("Question 2 of 10");
  await expect(page.locator("#quiz-game")).toBeVisible();
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

async function getQuizFingerprint(
  page: import("@playwright/test").Page
): Promise<string> {
  const serialized = await page
    .locator("#quiz-data")
    .evaluate((element) => element.textContent ?? "");
  return (JSON.parse(serialized) as { fingerprint: string }).fingerprint;
}

test("shows the challenge banner when a shared score link matches the quiz", async ({
  page,
}) => {
  await page.goto("/1980s/");
  const fingerprint = await getQuizFingerprint(page);

  // Visit another document first so the challenge URL triggers a full page
  // load, like opening a shared link in a new tab.
  await page.goto("/1950s/");
  await page.goto(`/1980s/#challenge=8.${fingerprint}`);

  const banner = page.locator("#quiz-challenge");
  await expect(banner).toBeVisible();
  await expect(banner).toContainText("Someone scored 8/10 on this quiz");
});

test("ignores challenge links with a tampered fingerprint", async ({ page }) => {
  await page.goto("/1980s/#challenge=8.0000000000000000");

  await expect(page.locator("#quiz-challenge")).toBeHidden();
});

test("answers with letter and number keys and advances with Enter", async ({ page }) => {
  await page.goto("/1950s/");
  await page.getByRole("button", { name: "Start quiz" }).click();

  await page.keyboard.press("1");
  await expect(page.locator('input[name="quiz-answer"]:checked')).toHaveCount(1);
  await expect(page.getByRole("button", { name: "Check answer" })).toBeEnabled();

  await page.keyboard.press("Enter");
  await expect(page.locator(".quiz-feedback__title")).toBeVisible();

  await page.keyboard.press("Enter");
  await expect(page.locator("#quiz-progress-text")).toHaveText("Question 2 of 10");

  await page.keyboard.press("a");
  await expect(page.locator('input[name="quiz-answer"]:checked')).toHaveCount(1);
  await expect(page.getByRole("button", { name: "Check answer" })).toBeEnabled();
});

test("keeps keyboard shortcuts working after focus leaves the quiz area", async ({
  page,
}) => {
  await page.goto("/1950s/");
  await page.getByRole("button", { name: "Start quiz" }).click();

  // Clicking non-interactive page chrome moves focus outside the quiz.
  await page.locator("#quiz-progress").click();

  await page.keyboard.press("1");
  await expect(page.locator('input[name="quiz-answer"]:checked')).toHaveCount(1);
  await expect(page.getByRole("button", { name: "Check answer" })).toBeEnabled();

  await page.keyboard.press("Enter");
  await expect(page.locator(".quiz-feedback__title")).toBeVisible();
});

async function revealAllRemainingQuestions(page: Page) {
  for (let question = 0; question < 10; question += 1) {
    await page.getByRole("button", { name: "Show answer" }).click();
    await page
      .getByRole("button", {
        name: question === 9 ? "See your result" : "Next question",
      })
      .click();
  }
}

test("keeps progress and legend below the sticky header on a phone", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/1980s/");

  const assertGeometry = async () => {
    const geometry = await page.evaluate(() => {
      const game = document.getElementById("quiz-game");
      const header = document.querySelector("[data-quiz-header]");
      if (!game || !header) {
        return null;
      }
      return {
        gameTop: game.getBoundingClientRect().top,
        headerBottom: header.getBoundingClientRect().bottom,
      };
    });
    expect(geometry).not.toBeNull();
    expect(geometry?.gameTop).toBeGreaterThanOrEqual((geometry?.headerBottom ?? 0) + 16);
    await expect(page.locator("#quiz-progress-text")).toBeInViewport();
    await expect(page.locator(".quiz-question__legend")).toBeInViewport();
  };

  await page.getByRole("button", { name: "Start quiz" }).click();
  await assertGeometry();

  await page.getByRole("button", { name: "Show answer" }).click();
  await page.getByRole("button", { name: "Next question" }).click();
  await expect(page.locator("#quiz-progress-text")).toHaveText("Question 2 of 10");
  await assertGeometry();
});

test("hides navigation and footer only while a round is running", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/1950s/");

  await expect(page.locator(".quiz-header__desktop-nav")).toBeVisible();
  await expect(page.locator(".quiz-footer")).toBeVisible();

  await page.getByRole("button", { name: "Start quiz" }).click();
  await expect(page.locator("body")).toHaveAttribute("data-quiz-view", "game");
  await expect(page.locator(".quiz-header__desktop-nav")).toBeHidden();
  await expect(page.locator(".quiz-header__menu-button")).toBeHidden();
  await expect(page.locator(".quiz-footer")).toBeHidden();
  await expect(page.getByRole("link", { name: "Save & exit" })).toBeVisible();

  await revealAllRemainingQuestions(page);
  await expect(page.locator("body")).toHaveAttribute("data-quiz-view", "result");
  await expect(page.locator(".quiz-header__desktop-nav")).toBeVisible();
  await expect(page.locator(".quiz-footer")).toBeVisible();
});

test("folds extra genre journeys behind a disclosure on a phone", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const featuredGrid = page.locator("#genre-journeys .quiz-grid--journeys").first();
  await expect(featuredGrid.locator(".quiz-card")).toHaveCount(4);
  await expect(page.locator("#genre-journeys .quiz-library__more")).toBeVisible();
  await expect(page.locator("#genre-journeys .quiz-library__more")).not.toHaveAttribute(
    "open"
  );

  await page.locator("#genre-journeys .quiz-library__more summary").click();
  await expect(page.locator("#genre-journeys .quiz-library__more")).toHaveAttribute(
    "open",
    ""
  );
  await expect(page.locator("#genre-journeys .quiz-card")).toHaveCount(16);
  await expect(
    page.locator("#genre-journeys .quiz-library__more .quiz-card")
  ).toHaveCount(12);
  await expect(page.locator("html")).toHaveJSProperty("scrollWidth", 390);
});

test("opens the result review progressively with an accurate count", async ({ page }) => {
  await page.goto("/1950s/");
  await page.getByRole("button", { name: "Start quiz" }).click();
  await revealAllRemainingQuestions(page);

  const review = page.locator("#quiz-result-review");
  await expect(review).toBeVisible();
  await expect(review).not.toHaveAttribute("open");
  await expect(page.locator("#quiz-result-review-count")).toHaveText(
    "10 questions to revisit"
  );
  await expect(page.locator(".quiz-review-item")).toHaveCount(10);
  await expect(page.getByRole("link", { name: "Start next quiz" })).toBeVisible();

  await page.locator("#quiz-result-review > summary").click();
  await expect(review).toHaveAttribute("open", "");
  await expect(page.locator(".quiz-review-item")).toHaveCount(10);
});
