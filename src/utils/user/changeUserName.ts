/**
 * Function to change the user name when the edit icon is clicked.
 * Prompts the user for a new yellow name and updates the local storage and user name element.
 */
export function changeUserName() {
  // Get the edit icon element and the yellow name element from the DOM
  const editIcon = document.querySelector(".editIcon") as HTMLElement;
  const userName = document.querySelector(".yellowName") as HTMLElement;

  // Add a click event listener to the edit icon
  editIcon.addEventListener("click", () => {
    // Prompt the user for a new yellow name and store it in the newUserName variable
    const newUserName = prompt("Gib deinen neuen Namen ein:");

    // If the new user name is not empty, update the local storage and user name element
    if (newUserName) {
      // Update the local storage with the new user name
      localStorage.setItem("userName", String(newUserName));

      // Update the text content of the yellow name element with the new yellow name
      userName.textContent = newUserName;
    }
  });
}
