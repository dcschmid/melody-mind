import { db, User, eq } from "astro:db";

// Define the type for a single Golden LP record
type GoldenLP = {
  won: boolean;
  date: string;
  difficulty: string;
};

// Define the type for the collection of Golden LPs, indexed by genre
type GoldenLPs = {
  [genre: string]: GoldenLP;
};

/**
 * Saves or updates a golden LP achievement for a specific user and genre.
 * Creates a new record if none exists, or updates an existing one.
 *
 * @param userId - The unique identifier of the user
 * @param genre - The music genre for which the golden LP was earned
 * @param difficulty - The difficulty level at which the achievement was earned
 * @throws {Error} If the user is not found in the database
 */
export async function saveGoldenLP(
  userId: string,
  genre: string,
  difficulty: string,
): Promise<void> {
  // Fetch the existing user data
  const existingData = await db.select().from(User).where(eq(User.id, userId));

  if (!existingData.length) {
    throw new Error(`User with ID ${userId} not found`);
  }

  // Merge existing golden LPs with the new achievement
  const updatedGoldenLPs: GoldenLPs = {
    ...(existingData[0].golden_lps || {}),
    [genre]: {
      won: true,
      date: new Date().toISOString(),
      difficulty,
    },
  };

  // Update the user's golden LPs in the database
  await db
    .update(User)
    .set({ golden_lps: updatedGoldenLPs })
    .where(eq(User.id, userId));
}
