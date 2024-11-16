/**
 * Fetches the total user points and category-specific points for a given user
 *
 * @param userId - The unique identifier of the user
 * @param categoryName - The name of the category to fetch points for
 *
 * @returns An object containing the total user points and category-specific points
 * @property {number} totalUserPoints - The total points accumulated by the user
 * @property {number} currentCategoryPointsValue - The points accumulated in the specified category
 *
 * @throws {Error} When the API request fails or returns invalid data
 *
 * @example
 * try {
 *   const points = await getUserAndCategoryPoints('user123', 'math');
 *   console.log(points.totalUserPoints); // 100
 *   console.log(points.currentCategoryPointsValue); // 30
 * } catch (error) {
 *   console.error('Failed to fetch points:', error);
 * }
 */
export async function getUserAndCategoryPoints(
  userId: string,
  categoryName: string,
): Promise<{ totalUserPoints: number; currentCategoryPointsValue: number }> {
  const API_ENDPOINT = "/api/getUserPoints";

  try {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      credentials: "include",
      body: JSON.stringify({ userId, categoryValue: categoryName }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    const totalUserPoints = Number(data?.totalUserPoints);
    const currentCategoryPointsValue = Number(data?.currentCategoryPointsValue);

    if (isNaN(totalUserPoints) || isNaN(currentCategoryPointsValue)) {
      throw new Error('Invalid response format: Points must be valid numbers');
    }

    return {
      totalUserPoints,
      currentCategoryPointsValue
    };
  } catch (error) {
    console.error('Fehler beim Abrufen der Punktzahl:', error);
    return {
      totalUserPoints: 0,
      currentCategoryPointsValue: 0
    };
  }
}
