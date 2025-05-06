/**
 * WCAG AAA Enhancements Script
 *
 * This script implements advanced accessibility features for the Knowledge page
 * to meet WCAG AAA standards. It includes:
 *
 * 1. Focus trap for the search field
 * 2. Advanced keyboard shortcuts
 * 3. Enhanced ARIA live regions
 * 4. Advanced keyboard navigation
 * 5. Enhanced ARIA live regions
 * 6. Advanced keyboard navigation
 */

document.addEventListener("DOMContentLoaded", function () {
  // Elements for the focus trap
  const searchInput = document.getElementById("searchInput");
  const resetSearchButton = document.getElementById("reset-search-inline");
  const articlesGrid = document.getElementById("articlesGrid");
  const searchStatus = document.getElementById("search-status");
  const noResults = document.getElementById("no-results");
  const backToTopButton = document.getElementById("back-to-top");

  // Elements for keyboard navigation
  const allCards = Array.from(document.querySelectorAll(".knowledge-card"));
  let currentFocusIndex = -1;

  // Implement focus trap for the search field
  implementFocusTrap();

  // Implement advanced keyboard shortcuts
  implementKeyboardShortcuts();

  // Implement advanced keyboard navigation
  implementKeyboardNavigation();

  // Enhance ARIA live regions
  enhanceAriaLiveRegions();

  // Implement skip links
  implementSkipLinks();

  /**
   * Implements a focus trap for the search field
   */
  function implementFocusTrap() {
    if (!searchInput || !resetSearchButton) return;

    // Add event listener for tab key
    searchInput.addEventListener("keydown", function (event) {
      if (event.key === "Tab" && !event.shiftKey) {
        event.preventDefault();
        resetSearchButton.focus();
      }
    });

    resetSearchButton.addEventListener("keydown", function (event) {
      if (event.key === "Tab" && event.shiftKey) {
        event.preventDefault();
        searchInput.focus();
      }
    });

    // Improve search field interaction
    searchInput.addEventListener("input", function () {
      const searchTerm = this.value.trim().toLowerCase();
      const matchCount = filterArticles(searchTerm);

      // Update ARIA live region
      if (searchTerm) {
        if (matchCount === 0) {
          searchStatus.textContent = `No articles found for "${searchTerm}"`;
          noResults.classList.remove("hidden");
        } else {
          searchStatus.textContent = `Found ${matchCount} article${matchCount === 1 ? "" : "s"} for "${searchTerm}"`;
          noResults.classList.add("hidden");
        }
      } else {
        searchStatus.textContent = "All articles are shown";
        noResults.classList.add("hidden");
      }
    });

    // Reset button functionality
    resetSearchButton.addEventListener("click", function () {
      searchInput.value = "";
      searchInput.focus();
      filterArticles("");
      searchStatus.textContent = "Search reset, all articles are shown";
      noResults.classList.add("hidden");
    });

    // Second reset button (in the "No Results" message)
    const resetSearchNoResults = document.getElementById("reset-search");
    if (resetSearchNoResults) {
      resetSearchNoResults.addEventListener("click", function () {
        searchInput.value = "";
        searchInput.focus();
        filterArticles("");
        searchStatus.textContent = "Search reset, all articles are shown";
        noResults.classList.add("hidden");
      });
    }
  }

  /**
   * Filters articles based on the search term
   * @param {string} searchTerm - The search term
   * @returns {number} - The number of matching articles
   */
  function filterArticles(searchTerm) {
    if (!articlesGrid) return 0;

    const articles = Array.from(articlesGrid.querySelectorAll("li"));
    let matchCount = 0;

    articles.forEach((article) => {
      const card = article.querySelector(".knowledge-card");
      if (!card) return;

      const title = card.dataset.title?.toLowerCase() || "";
      const description = card.dataset.description?.toLowerCase() || "";
      const keywords = card.dataset.keywords?.toLowerCase() || "";

      if (
        !searchTerm ||
        title.includes(searchTerm) ||
        description.includes(searchTerm) ||
        keywords.includes(searchTerm)
      ) {
        article.style.display = "";
        matchCount++;
      } else {
        article.style.display = "none";
      }
    });

    return matchCount;
  }

  /**
   * Implements advanced keyboard shortcuts
   */
  function implementKeyboardShortcuts() {
    document.addEventListener("keydown", function (event) {
      // Alt + S: Focus on search field
      if (event.altKey && event.key === "s" && searchInput) {
        event.preventDefault();
        searchInput.focus();
        announceChange("Search field focused");
      }

      // Alt + R: Reset search
      if (event.altKey && event.key === "r" && resetSearchButton) {
        event.preventDefault();
        resetSearchButton.click();
        announceChange("Search reset");
      }

      // Alt + T: Scroll to top of page
      if (event.altKey && event.key === "t") {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        document.querySelector("h1")?.focus();
        announceChange("Scrolled to top of page");
      }

      // Alt + B: Scroll to bottom of page
      if (event.altKey && event.key === "b") {
        event.preventDefault();
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
        announceChange("Scrolled to bottom of page");
      }

      // Escape: Reset search and remove focus
      if (event.key === "Escape" && document.activeElement === searchInput) {
        event.preventDefault();
        searchInput.value = "";
        searchInput.blur();
        filterArticles("");
        searchStatus.textContent = "Search reset, all articles are shown";
        noResults.classList.add("hidden");
        announceChange("Search cleared and focus removed");
      }
    });
  }

  /**
   * Implements advanced keyboard navigation for article cards
   */
  function implementKeyboardNavigation() {
    if (!articlesGrid) return;

    document.addEventListener("keydown", function (event) {
      // Only if focus is not on an input field
      if (
        document.activeElement.tagName === "INPUT" ||
        document.activeElement.tagName === "TEXTAREA"
      ) {
        return;
      }

      const visibleCards = allCards.filter((card) => {
        const listItem = card.closest("li");
        return listItem && listItem.style.display !== "none";
      });

      if (visibleCards.length === 0) return;

      // Find the current focus index
      currentFocusIndex = visibleCards.findIndex((card) =>
        card.contains(document.activeElement),
      );

      switch (event.key) {
        case "ArrowRight":
          event.preventDefault();
          navigateCards(1, visibleCards);
          break;
        case "ArrowLeft":
          event.preventDefault();
          navigateCards(-1, visibleCards);
          break;
        case "ArrowDown":
          event.preventDefault();
          // Determine number of cards per row (based on CSS Grid)
          const cardsPerRow =
            getComputedStyle(articlesGrid).gridTemplateColumns.split(
              " ",
            ).length;
          navigateCards(cardsPerRow, visibleCards);
          break;
        case "ArrowUp":
          event.preventDefault();
          // Determine number of cards per row (based on CSS Grid)
          const cardsPerRowUp =
            getComputedStyle(articlesGrid).gridTemplateColumns.split(
              " ",
            ).length;
          navigateCards(-cardsPerRowUp, visibleCards);
          break;
        case "Home":
          event.preventDefault();
          if (visibleCards.length > 0) {
            const firstCard =
              visibleCards[0].querySelector("a") || visibleCards[0];
            firstCard.focus();
            currentFocusIndex = 0;
            announceChange(`Card 1 of ${visibleCards.length} focused`);
          }
          break;
        case "End":
          event.preventDefault();
          if (visibleCards.length > 0) {
            const lastCard =
              visibleCards[visibleCards.length - 1].querySelector("a") ||
              visibleCards[visibleCards.length - 1];
            lastCard.focus();
            currentFocusIndex = visibleCards.length - 1;
            announceChange(
              `Card ${visibleCards.length} of ${visibleCards.length} focused`,
            );
          }
          break;
      }
    });
  }

  /**
   * Navigates between cards
   * @param {number} direction - The direction of navigation (1 = forward, -1 = backward)
   * @param {Array} visibleCards - The visible cards
   */
  function navigateCards(direction, visibleCards) {
    if (visibleCards.length === 0) return;

    // If no element is focused, start at -1 or at the end
    if (currentFocusIndex === -1) {
      currentFocusIndex = direction > 0 ? -1 : visibleCards.length;
    }

    // Calculate the new index
    let newIndex = currentFocusIndex + direction;

    // Ensure the index is within valid range
    if (newIndex < 0) {
      newIndex = visibleCards.length - 1;
    } else if (newIndex >= visibleCards.length) {
      newIndex = 0;
    }

    // Focus the new card
    const cardToFocus =
      visibleCards[newIndex].querySelector("a") || visibleCards[newIndex];
    cardToFocus.focus();
    currentFocusIndex = newIndex;

    // Scroll the card into view if necessary
    const cardRect = visibleCards[newIndex].getBoundingClientRect();
    const isInView =
      cardRect.top >= 0 &&
      cardRect.left >= 0 &&
      cardRect.bottom <= window.innerHeight &&
      cardRect.right <= window.innerWidth;

    if (!isInView) {
      visibleCards[newIndex].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }

    // Update ARIA live region
    announceChange(`Card ${newIndex + 1} of ${visibleCards.length} focused`);
  }

  /**
   * Enhances ARIA live regions for dynamic updates
   */
  function enhanceAriaLiveRegions() {
    // Create a global ARIA live region for announcements
    const globalAnnouncer = document.createElement("div");
    globalAnnouncer.id = "global-announcer";
    globalAnnouncer.className = "sr-only";
    globalAnnouncer.setAttribute("aria-live", "polite");
    globalAnnouncer.setAttribute("aria-atomic", "true");
    document.body.appendChild(globalAnnouncer);

    // Enhance the existing ARIA live region for search results
    if (searchStatus) {
      searchStatus.setAttribute("aria-live", "assertive");
    }

    // Add event listener for scroll events to control the "Back to Top" button
    window.addEventListener("scroll", function () {
      if (!backToTopButton) return;

      if (window.scrollY > 300) {
        backToTopButton.classList.remove("opacity-0", "invisible");
        backToTopButton.classList.add("opacity-100", "visible");
        backToTopButton.setAttribute("aria-hidden", "false");
      } else {
        backToTopButton.classList.add("opacity-0", "invisible");
        backToTopButton.classList.remove("opacity-100", "visible");
        backToTopButton.setAttribute("aria-hidden", "true");
      }
    });

    // Add event listener for the "Back to Top" button
    if (backToTopButton) {
      backToTopButton.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
        document.querySelector("h1")?.focus();
        announceChange("Scrolled to top of page");
      });
    }
  }

  /**
   * Announces a change via the ARIA live region
   * @param {string} message - The message to announce
   */
  function announceChange(message) {
    const announcer = document.getElementById("global-announcer");
    if (announcer) {
      announcer.textContent = message;
    }
  }
});
