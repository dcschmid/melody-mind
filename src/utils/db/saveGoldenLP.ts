import { db, User, eq } from "astro:db";

/**
 * Function to save or update the golden LPs for a user.
 *
 * @param {string} userId - The ID of the user
 * @param {string} genre - The genre of the golden LP to be saved or updated
 * @param {string} difficulty - The difficulty of the game
 *
 * @returns {Promise<void>} - A Promise that resolves when the golden LPs have been updated
 */
export async function saveGoldenLP(
  userId: string,
  genre: string,
  difficulty: string,
): Promise<void> {
  // Query the current golden LPs of the user
  const existingData = await db.select().from(User).where(eq(User.id, userId));

  let updatedGoldenLPs: { [key: string]: any } = {};

  // If there are already golden LPs, update the existing JSON
  if (existingData && existingData[0].golden_lps) {
    updatedGoldenLPs = existingData[0].golden_lps;
  }

  // Set or update the golden LP for the given genre
  updatedGoldenLPs[genre] = {
    won: true,
    // Set the `won` property to `true` to indicate that the user has won the golden LP
    date: new Date().toISOString(),
    // Set the `date` property to the current date and time
    difficulty: difficulty,
    // Set the `difficulty` property to the difficulty of the game
  };

  // Update the user record with the new JSON value
  await db
    .update(User)
    .set({ golden_lps: updatedGoldenLPs })
    .where(eq(User.id, userId));
}
