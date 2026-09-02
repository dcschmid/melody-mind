import { expect, test } from "@playwright/test";

const STORAGE_KEY = "melodymind:music-player-state:v4";

interface StoredState {
  version: number;
  queue: { queueId: string };
}

test("keeps the queue across navigation, reload, and clear", async ({ page }) => {
  // External MP3s are not a CI contract: block them so the journey stays
  // deterministic without asserting on real audio playback.
  await page.route("**/eu2.contabostorage.com/**", (route) => route.abort());

  await page.goto("/");
  const playButton = page.getByRole("button", { name: "Play album", exact: true });
  await playButton.click();

  const player = page.locator("[data-global-player]");
  await expect(player).toBeVisible();
  const trackText = await player.locator("[data-global-player-track]").textContent();
  expect(trackText?.trim()).not.toBe("Choose a track");

  const readStored = async (): Promise<StoredState | null> => {
    const raw = await page.evaluate(
      (key) => window.localStorage.getItem(key),
      STORAGE_KEY
    );
    return raw ? (JSON.parse(raw) as StoredState) : null;
  };
  // Saves are throttled (2s), so wait for the first persisted record.
  await expect.poll(readStored).not.toBeNull();
  const initial = (await readStored()) as StoredState;
  expect(initial.version).toBe(4);
  expect(initial.queue.queueId).toBeTruthy();

  // Internal album navigation keeps the loaded track and queue.
  await page.getByRole("link", { name: "View album" }).click();
  await expect(page).toHaveURL(/\/[a-z0-9-]+\/$/);
  await expect(player).toBeVisible();
  expect(await player.locator("[data-global-player-track]").textContent()).toBe(
    trackText
  );
  expect((await readStored())?.queue.queueId).toBe(initial.queue.queueId);

  // Reload restores the same paused track from the v4 record.
  await page.reload();
  await expect(player).toBeVisible();
  expect(await player.locator("[data-global-player-track]").textContent()).toBe(
    trackText
  );
  expect((await readStored())?.queue.queueId).toBe(initial.queue.queueId);

  // Clearing playback empties both UI and storage.
  await player.locator('[data-global-player-action="clear"]').click();
  await expect(player).toBeHidden();
  await expect.poll(readStored).toBeNull();
});
