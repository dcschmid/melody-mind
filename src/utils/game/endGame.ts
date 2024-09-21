/**
 * Handles the logic for when the user finishes answering all the questions.
 * Checks if the user answered all questions correctly and if so, saves a golden LP
 * to the user's profile and shows a popup to the user. If not, it only shows a
 * popup to the user.
 *
 * @param correctAnswers - The number of questions the user answered correctly.
 * @param totalRounds - The total number of questions in the game.
 * @param saveGoldenLP - A function to save a golden LP to the user's profile.
 * @param saveScoreToDB - A function to save the user's score to the database.
 * @param showGoldenLpPopup - A function to show a popup to the user when they win a golden LP.
 * @param showEndgamePopup - A function to show a popup to the user when the game is over.
 * @param userId - The ID of the user.
 * @param categoryName - The name of the category the user played in.
 * @param restartGame - A function to restart the game.
 * @param score - The user's current score.
 */
export function endGame(
  correctAnswers: number,
  totalRounds: number,
  saveGoldenLP: Function,
  saveScoreToDB: Function,
  showGoldenLpPopup: Function,
  showEndgamePopup: Function,
  userId: string,
  categoryName: string,
  restartGame: Function,
  score: string,
) {
  /**
   * Check if the user answered all questions correctly. If they did,
   * save a golden LP to their profile and show a popup to the user.
   * If not, only show a popup to the user.
   */
  if (correctAnswers === totalRounds) {
    // The user answered all questions correctly, so save a golden LP to their profile
    // and show a popup to the user.
    saveGoldenLP(userId, categoryName);
    saveScoreToDB();
    showGoldenLpPopup();
  } else {
    // The user did not answer all questions correctly, so only show a popup to the user.
    saveScoreToDB();
    showEndgamePopup(score, restartGame);
  }
}
