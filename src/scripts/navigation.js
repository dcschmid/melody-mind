/**
 * Navigation functionality for Melody Mind
 *
 * This script manages the user logout workflow for the Melody Mind application.
 * It attaches event listeners to all logout buttons, handles the logout process,
 * and provides visual feedback through loading states during the request.
 * It also processes network responses and displays appropriate redirections
 * or error messages.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Find all logout buttons
  const logoutButtons = document.querySelectorAll('[data-action="logout"]');

  // Add event listener to each logout button
  logoutButtons.forEach((button) => {
    button.addEventListener("click", handleLogout);
  });
});

/**
 * Simplified logout function that sends a POST request and redirects to the home page
 *
 * @async
 * @function handleLogout
 * @description Sends a logout request to the server, displays loading status, and
 *              redirects the user to the home page upon success. In case of errors,
 *              appropriate messages are displayed and buttons are reset.
 * @returns {Promise<void>} A promise that resolves when the logout process
 *                          is completed (either successfully or with an error)
 */
async function handleLogout() {
  // Find all logout buttons and disable them
  const logoutButtons = document.querySelectorAll('[data-action="logout"]');

  // Set buttons to loading state
  logoutButtons.forEach((button) => {
    button.disabled = true;
    button.setAttribute("aria-busy", "true");

    // Update text display
    const textSpan = button.querySelector("span");
    if (textSpan) textSpan.textContent += "...";
  });

  try {
    // Extract current language from URL
    const pathSegments = window.location.pathname.split("/");
    const lang = pathSegments[1] || "de"; // Default to 'de' if no language is found

    // Send logout request with language path
    const response = await fetch(`/${lang}/api/auth/logout`, {
      method: "POST",
      credentials: "same-origin",
    });

    // Redirect to home page on successful response
    if (response.ok) {
      window.location.href = `/${lang}`;
      return; // Early exit since redirection occurs
    }

    // Reset buttons and display error on failure
    console.error("Logout failed");
    resetButtons();
    alert("Logout failed. Please try again later.");
  } catch (error) {
    // Reset buttons and display error on network error
    console.error("Network error during logout:", error);
    resetButtons();
    alert("Network error during logout. Please check your connection.");
  }

  // Helper function to reset buttons
  function resetButtons() {
    logoutButtons.forEach((button) => {
      button.disabled = false;
      button.removeAttribute("aria-busy");

      // Reset text
      const textSpan = button.querySelector("span");
      if (textSpan) {
        const text = textSpan.textContent || "";
        textSpan.textContent = text.replace("...", "");
      }
    });
  }
}
