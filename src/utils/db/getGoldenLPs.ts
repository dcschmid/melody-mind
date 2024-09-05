import { db, eq, User } from "astro:db";

/**
 * @function getGoldenLPs
 * @description Gets the golden LPs from the given user ID.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<{ [category: string]: { won: boolean; date: string } }>} - The golden LPs.
 */
export async function getGoldenLPs(userId: string): Promise<{ [category: string]: { won: boolean; date: string } } | {}>
 {
  const data = await db.select().from(User).where(eq(User.id, userId));

  if (data && data[0].golden_lps) {
    // If the user has golden LPs, return them
    return data[0].golden_lps;
  } else {
    // If the user doesn't have golden LPs, return an empty object
    return {}; // Keine LPs gefunden
  }
}
