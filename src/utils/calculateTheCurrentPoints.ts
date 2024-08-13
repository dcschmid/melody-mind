/**
 * Calculates the current points by summing up the points earned in each round,
 * doubling the points if all answers were correct in that round.
 * The points earned in each round are retrieved from localStorage.
 * The calculated points are stored back into localStorage, with the key "currentPoints".
 *
 * @param {string} category - The category for which to calculate the current points.
 */
export function calculateTheCurrentPoints(category: string) {
  // Retrieve points earned in each round from localStorage
  const pointsRound1 = parseInt(localStorage.getItem(`${category}-Points-round-one`) || "0", 10);
  const pointsRound2 = parseInt(localStorage.getItem(`${category}-Points-round-two`) || "0", 10);
  const pointsRound3 = parseInt(localStorage.getItem(`${category}-Points-round-three`) || "0", 10);

  // Retrieve the status of whether all answers were correct in each round from localStorage
  const triviaRound1Won = localStorage.getItem(`${category}-TriviaWon-round-one`) === "true";
  const triviaRound2Won = localStorage.getItem(`${category}-TriviaWon-round-two`) === "true";
  const triviaRound3Won = localStorage.getItem(`${category}-TriviaWon-round-three`) === "true";

  // Calculate the points earned in each round
  // If the round was won and no points were earned, add 50 points
  // If the round was won, double the points earned
  const calculatedPointsRound1 =
    (pointsRound1 === 0 && triviaRound1Won) ? Math.floor(pointsRound1 + 50) :
    triviaRound1Won ? Math.floor(pointsRound1 * 2) : pointsRound1;

  // Calculate the points earned in each round
  // If the round was won and no points were earned, add 50 points
  // If the round was won, double the points earned
  const calculatedPointsRound2 =
    (pointsRound2 === 0 && triviaRound2Won) ? Math.floor(pointsRound2 + 50)  :
    triviaRound2Won ? Math.floor(pointsRound2 * 2) : pointsRound2;

  // Calculate the points earned in each round
  // If the round was won and no points were earned, add 50 points
  // If the round was won, double the points earned
  const calculatedPointsRound3 =
   (pointsRound3 === 0 && triviaRound3Won) ? Math.floor(pointsRound3 + 50) :
    triviaRound3Won ? Math.floor(pointsRound3 * 2)
    : pointsRound3;

  // Sum all round points
  const totalPoints = calculatedPointsRound1 + calculatedPointsRound2 + calculatedPointsRound3;

  // Update localStorage with the new calculated points
  localStorage.setItem("currentPoints", String(totalPoints));
}
