/**
 * Adds a click event listener to each frame item and selects the clicked item.
 * Removes the 'frameSelected' class from all frame items and adds it to the clicked item.
 */
export function selectFrameItem(): void {
  // Get all frame items
  const frameItems = document.querySelectorAll(".frameItem");

  // Add a click event listener to each frame item
  frameItems.forEach((frameItem) => {
    frameItem.addEventListener("click", () => {
      // Remove the 'frameSelected' class from all frame items
      frameItems.forEach((item) => item.classList.remove("frameSelected"));
      // Add the 'frameSelected' class to the clicked item
      frameItem.classList.add("frameSelected");
    });
  });
}
