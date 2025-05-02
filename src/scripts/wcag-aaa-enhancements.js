/**
 * WCAG AAA Enhancements Script
 *
 * Dieses Skript implementiert erweiterte Zugänglichkeitsfunktionen für die Knowledge-Seite,
 * um die WCAG AAA Standards zu erfüllen. Es enthält:
 *
 * 1. Focus Trap für das Suchfeld
 * 2. Erweiterte Tastatur-Shortcuts
 * 3. Verbesserte ARIA-Live-Regions
 * 4. Erweiterte Keyboard-Navigation
 */

document.addEventListener("DOMContentLoaded", function () {
  // Elemente für die Focus Trap
  const searchInput = document.getElementById("searchInput");
  const resetSearchButton = document.getElementById("reset-search-inline");
  const articlesGrid = document.getElementById("articlesGrid");
  const searchStatus = document.getElementById("search-status");
  const noResults = document.getElementById("no-results");
  const backToTopButton = document.getElementById("back-to-top");

  // Elemente für die Keyboard-Navigation
  const allCards = Array.from(document.querySelectorAll(".knowledge-card"));
  let currentFocusIndex = -1;

  // Implementiere Focus Trap für das Suchfeld
  implementFocusTrap();

  // Implementiere erweiterte Tastatur-Shortcuts
  implementKeyboardShortcuts();

  // Implementiere erweiterte Keyboard-Navigation
  implementKeyboardNavigation();

  // Verbessere ARIA-Live-Regions
  enhanceAriaLiveRegions();

  // Implementiere Skip-Links
  implementSkipLinks();

  /**
   * Implementiert eine Focus Trap für das Suchfeld
   */
  function implementFocusTrap() {
    if (!searchInput || !resetSearchButton) return;

    // Füge Event-Listener für Tab-Taste hinzu
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

    // Verbessere Suchfeld-Interaktion
    searchInput.addEventListener("input", function () {
      const searchTerm = this.value.trim().toLowerCase();
      const matchCount = filterArticles(searchTerm);

      // Aktualisiere ARIA-Live-Region
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

    // Reset-Button-Funktionalität
    resetSearchButton.addEventListener("click", function () {
      searchInput.value = "";
      searchInput.focus();
      filterArticles("");
      searchStatus.textContent = "Search reset, all articles are shown";
      noResults.classList.add("hidden");
    });

    // Zweiter Reset-Button (in der "No Results"-Nachricht)
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
   * Filtert Artikel basierend auf dem Suchbegriff
   * @param {string} searchTerm - Der Suchbegriff
   * @returns {number} - Die Anzahl der gefundenen Artikel
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
   * Implementiert erweiterte Tastatur-Shortcuts
   */
  function implementKeyboardShortcuts() {
    document.addEventListener("keydown", function (event) {
      // Alt + S: Fokus auf Suchfeld setzen
      if (event.altKey && event.key === "s" && searchInput) {
        event.preventDefault();
        searchInput.focus();
        announceChange("Search field focused");
      }

      // Alt + R: Suche zurücksetzen
      if (event.altKey && event.key === "r" && resetSearchButton) {
        event.preventDefault();
        resetSearchButton.click();
        announceChange("Search reset");
      }

      // Alt + T: Zum Seitenanfang scrollen
      if (event.altKey && event.key === "t") {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        document.querySelector("h1")?.focus();
        announceChange("Scrolled to top of page");
      }

      // Alt + B: Zum Seitenende scrollen
      if (event.altKey && event.key === "b") {
        event.preventDefault();
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
        announceChange("Scrolled to bottom of page");
      }

      // Escape: Suche zurücksetzen und Fokus entfernen
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
   * Implementiert erweiterte Keyboard-Navigation für die Artikel-Karten
   */
  function implementKeyboardNavigation() {
    if (!articlesGrid) return;

    document.addEventListener("keydown", function (event) {
      // Nur wenn der Fokus nicht auf einem Eingabefeld liegt
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

      // Finde den aktuellen Fokus-Index
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
          // Anzahl der Karten pro Zeile bestimmen (basierend auf CSS Grid)
          const cardsPerRow =
            getComputedStyle(articlesGrid).gridTemplateColumns.split(
              " ",
            ).length;
          navigateCards(cardsPerRow, visibleCards);
          break;
        case "ArrowUp":
          event.preventDefault();
          // Anzahl der Karten pro Zeile bestimmen (basierend auf CSS Grid)
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
   * Navigiert zwischen den Karten
   * @param {number} direction - Die Richtung der Navigation (1 = vorwärts, -1 = rückwärts)
   * @param {Array} visibleCards - Die sichtbaren Karten
   */
  function navigateCards(direction, visibleCards) {
    if (visibleCards.length === 0) return;

    // Wenn kein Element fokussiert ist, starte bei -1 oder am Ende
    if (currentFocusIndex === -1) {
      currentFocusIndex = direction > 0 ? -1 : visibleCards.length;
    }

    // Berechne den neuen Index
    let newIndex = currentFocusIndex + direction;

    // Stelle sicher, dass der Index im gültigen Bereich liegt
    if (newIndex < 0) {
      newIndex = visibleCards.length - 1;
    } else if (newIndex >= visibleCards.length) {
      newIndex = 0;
    }

    // Fokussiere die neue Karte
    const cardToFocus =
      visibleCards[newIndex].querySelector("a") || visibleCards[newIndex];
    cardToFocus.focus();
    currentFocusIndex = newIndex;

    // Scrolle die Karte ins Sichtfeld, falls nötig
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

    // Aktualisiere ARIA-Live-Region
    announceChange(`Card ${newIndex + 1} of ${visibleCards.length} focused`);
  }

  /**
   * Verbessert ARIA-Live-Regions für dynamische Updates
   */
  function enhanceAriaLiveRegions() {
    // Erstelle eine globale ARIA-Live-Region für Ankündigungen
    const globalAnnouncer = document.createElement("div");
    globalAnnouncer.id = "global-announcer";
    globalAnnouncer.className = "sr-only";
    globalAnnouncer.setAttribute("aria-live", "polite");
    globalAnnouncer.setAttribute("aria-atomic", "true");
    document.body.appendChild(globalAnnouncer);

    // Verbessere die bestehende ARIA-Live-Region für Suchergebnisse
    if (searchStatus) {
      searchStatus.setAttribute("aria-live", "assertive");
    }

    // Füge Event-Listener für Scroll-Events hinzu, um den "Back to Top"-Button zu steuern
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

    // Füge Event-Listener für den "Back to Top"-Button hinzu
    if (backToTopButton) {
      backToTopButton.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
        document.querySelector("h1")?.focus();
        announceChange("Scrolled to top of page");
      });
    }
  }

  /**
   * Kündigt eine Änderung über die ARIA-Live-Region an
   * @param {string} message - Die Nachricht, die angekündigt werden soll
   */
  function announceChange(message) {
    const announcer = document.getElementById("global-announcer");
    if (announcer) {
      announcer.textContent = message;
    }
  }
});
