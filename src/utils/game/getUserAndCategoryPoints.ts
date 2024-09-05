/**
 * Fetches the total user points and the category points for the given user and category name
 * @param userId The ID of the user
 * @param categoryName The name of the category
 * @returns An object with the total user points and the category points
 */
export async function getUserAndCategoryPoints(
  userId: string,
  categoryName: string,
): Promise<{ totalUserPoints: number; currentCategoryPointsValue: number }> {
  // Send a POST request to the /api/getUserPoints endpoint with the userId and categoryName
  const response = await fetch(`/api/getUserPoints`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, categoryValue: categoryName }),
  });

  // Parse the response as JSON
  const { totalUserPoints, currentCategoryPointsValue } = await response.json();

  // Return the total user points and the category points
  return { totalUserPoints, currentCategoryPointsValue };
}
