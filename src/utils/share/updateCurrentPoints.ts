/**
 * Updates the text content of the element with the class "point" to the current points
 * stored in localStorage. If no points are stored, it defaults to "0".
 *
 * @param pointsLocalStorageName - The name of the localStorage key that stores the current points.
 */
export function updateCurrentPoints(pointsLocalStorageName: string) {
  // Select the element with the class "point"
  // This is the element that will display the current points.
  const pointSpan = document.querySelector(".point");

  // Set the text content to the current points stored in localStorage, or "0" if no points are stored
  // This line gets the current points from localStorage and assigns it to the `points` variable.
  // If `points` is falsy (null, undefined, 0, false, empty string), it will default to "0".
  // The `||` operator is the OR operator in JavaScript. It returns the first truthy value it encounters,
  // or the last falsy value if no truthy values are found.
  pointSpan!.textContent = localStorage.getItem(pointsLocalStorageName) || "0";
}
