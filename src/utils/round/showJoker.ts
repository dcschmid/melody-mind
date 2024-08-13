/**
 * Shows the joker by triggering the shake animation and making it visible.
 * After the animation is done, the shake class is removed.
 */
export function showJoker() {
  // Get the joker element
  const jokerElement = document.getElementById("joker") as HTMLElement;

  // Add a class to trigger the shake animation
  jokerElement.classList.add("shake");

  // Show the joker
  jokerElement.style.display = "flex";

  // Remove the shake class after the animation is done
  setTimeout(() => {
    jokerElement.classList.remove("shake");
  }, 1000); // Assuming the shake animation lasts 0.5 seconds
}
