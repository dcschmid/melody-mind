import type { APIRoute } from "astro";
import {
  and,
  db,
  eq,
  HighscorePerCategory,
  TotalHighscore,
  User,
} from "astro:db";
import { generateIdFromEntropySize } from "lucia";

/**
 * The POST endpoint for saving the total user points.
 * @param {Request} request - The request object.
 * @returns {Response} - The response object with the body "User points saved".
 */
export const POST: APIRoute = async ({ request }) => {
  const { userId, totalUserPoints, category, categoryPoints } =
    await request.json();

  // Prüfe zuerst, ob der Benutzer existiert
  const existingUser = await db.select().from(User).where(eq(User.id, userId));

  if (!existingUser.length) {
    return new Response("Benutzer nicht gefunden", {
      status: 404,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  // Führe dann die batch-Operation durch
  await db.batch([
    db
      .update(User)
      .set({ total_user_points: totalUserPoints })
      .where(eq(User.id, userId)),

    // Prüfe und aktualisiere TotalHighscore
    db.transaction(async (tx) => {
      const existingHighscore = await tx
        .select()
        .from(TotalHighscore)
        .where(eq(TotalHighscore.userId, userId));

      if (existingHighscore.length > 0) {
        return tx
          .update(TotalHighscore)
          .set({ score: totalUserPoints })
          .where(eq(TotalHighscore.userId, userId));
      } else {
        return tx.insert(TotalHighscore).values({
          id: generateIdFromEntropySize(10),
          userId,
          score: totalUserPoints,
        });
      }
    }),

    // Prüfe und aktualisiere HighscorePerCategory
    db.transaction(async (tx) => {
      const existingCategoryScore = await tx
        .select()
        .from(HighscorePerCategory)
        .where(
          and(
            eq(HighscorePerCategory.userId, userId),
            eq(HighscorePerCategory.category, category),
          ),
        );

      if (existingCategoryScore.length > 0) {
        return tx
          .update(HighscorePerCategory)
          .set({ score: categoryPoints })
          .where(
            and(
              eq(HighscorePerCategory.userId, userId),
              eq(HighscorePerCategory.category, category),
            ),
          );
      } else {
        return tx.insert(HighscorePerCategory).values({
          id: generateIdFromEntropySize(10),
          userId,
          category,
          score: categoryPoints,
        });
      }
    }),
  ]);

  return new Response("User points saved", {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
