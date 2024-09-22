/**
 * Saves a golden LP for the given user ID and genre.
 * @param {string} userId - The ID of the user.
 * @param {string} genre - The genre of the golden LP to be saved.
 * @param {string} difficulty - The difficulty of the game.
 */
export async function saveGoldenLP(userId: string, genre: string, difficulty: string) {
  // Send a POST request to the /api/saveUserGoldenLP endpoint with the userId, genre, and difficulty
  await fetch(`/api/saveUserGoldenLP`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, genre, difficulty }),
  });
}
