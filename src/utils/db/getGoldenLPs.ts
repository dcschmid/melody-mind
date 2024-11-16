import { db, eq, User } from "astro:db";

/**
 * Retrieves the golden LPs (Learning Points) for a specific user
 *
 * @param userId - The unique identifier of the user
 * @returns A record object where:
 *          - key: category name
 *          - value: object containing:
 *            - won: whether the LP was earned
 *            - date: when it was earned
 *            - difficulty: difficulty level of the achievement
 * @example
 * const goldenLPs = await getGoldenLPs("user123");
 *  Returns: {
 *    "category1": { won: true, date: "2024-03-20", difficulty: "hard" },
 *    "category2": { won: false, date: "", difficulty: "medium" }
 *  }
 */
export async function getGoldenLPs(
  userId: string,
): Promise<Record<string, { won: boolean; date: string; difficulty: string }>> {
  const [user] = await db
    .select()
    .from(User)
    .where(eq(User.id, userId));

  return user?.golden_lps ?? {};
}
