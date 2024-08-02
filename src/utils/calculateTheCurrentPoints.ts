/**
 * Calculates the current points by summing up the points earned in each round,
 * doubling the points if all answers were correct in that round.
 * The points earned in each round are retrieved from localStorage.
 * The calculated points are stored back into localStorage.
 */
export function calculateTheCurrentPoints() {
  // Retrieve points earned in each round from localStorage
  const pointsRound1 = parseInt(localStorage.getItem("PointsRound1") || "0", 10);
  const pointsRound2 = parseInt(localStorage.getItem("PointsRound2") || "0", 10);
  const pointsRound3 = parseInt(localStorage.getItem("PointsRound3") || "0", 10);

  // Retrieve the status of whether all answers were correct in each round from localStorage
  const triviaRound1Won = localStorage.getItem("triviaRound1Won") === "true";
  const triviaRound2Won = localStorage.getItem("triviaRound2Won") === "true";
  const triviaRound3Won = localStorage.getItem("triviaRound3Won") === "true";

  // Calculate points for each round, doubling if all answers were correct
  const calculatedPointsRound1 = triviaRound1Won ? pointsRound1 * 2 : pointsRound1;
  const calculatedPointsRound2 = triviaRound2Won ? pointsRound2 * 2 : pointsRound2;
  const calculatedPointsRound3 = triviaRound3Won ? pointsRound3 * 2 : pointsRound3;

  // Sum all round points
  const totalPoints = calculatedPointsRound1 + calculatedPointsRound2 + calculatedPointsRound3;

  // Update localStorage with the new calculated points
  localStorage.setItem("currentPoints", String(totalPoints));
}
