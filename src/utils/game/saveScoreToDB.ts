/**
 * Saves the user's score to the database.
 * @param userId - The ID of the user.
 * @param totalUserPoints - The current total user points.
 * @param score - The score the user got in the game.
 * @param categoryName - The name of the category the user played in.
 * @param currentCategoryPointsValue - The current points of the user in the category.
 */
export async function saveScoreToDB(
  userId: string,
  totalUserPoints: number,
  score: number,
  categoryName: string,
  currentCategoryPointsValue: number
): Promise<void> {
  // Save the score to the database
  await fetch(`/api/saveTotalUserPointsAndHighscore`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      // Add the score to the total user points
      totalUserPoints: totalUserPoints + score,
      category: categoryName,
      // Add the score to the points of the user in the category
      categoryPoints: currentCategoryPointsValue + score,
    }),
  });
}
