/**
 * Shows the joker by triggering the shake animation and making it visible.
 * After the animation is done, the shake class is removed.
 *
 * This function gets the joker element from the DOM and shows it by setting its display style to "flex".
 * It then sets a timeout to add the "shake" class to the joker element after 20 seconds,
 * and a timeout to remove the "shake" class after 1 seconds.
 * This triggers the shake animation.
 * Finally, it sets another timeout to add the "shake" class to the joker element after 40 seconds,
 * and another timeout to remove the "shake" class after 1 seconds.
 * This triggers the shake animation again.
 */
export function showJoker() {
  // Get the joker element
  const jokerElement = document.getElementById("joker") as HTMLElement;

  // Show the joker by setting its display style to "flex"
  jokerElement.style.display = "flex";

  // Shake the joker after 30 seconds
  setTimeout(() => {
    // Add the "shake" class to the joker element to trigger the shake animation
    jokerElement.classList.add("shake");
    // Remove the "shake" class after 0.5 seconds to stop the animation
    setTimeout(() => {
      jokerElement.classList.remove("shake");
    }, 1000); // Assuming the shake animation lasts 1 seconds
  }, 30000);

  // Shake the joker after 60 seconds
  setTimeout(() => {
    // Add the "shake" class to the joker element to trigger the shake animation
    jokerElement.classList.add("shake");
    // Remove the "shake" class after 0.5 seconds to stop the animation
    setTimeout(() => {
      jokerElement.classList.remove("shake");
    }, 1000); // Assuming the shake animation lasts 1 seconds
  }, 60000);
}
