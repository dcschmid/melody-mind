export function initializeGoldenLPOverlay() {
  const popup = document.getElementById("golden-lp-popup");
  const restartButton = document.getElementById("restart-button-lp");
  const popupContent = document.querySelector(".popupContent") as HTMLElement;

  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === "Escape" && restartButton) {
      restartButton.click();
    }
  };

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "class" &&
        !popup?.classList.contains("hidden")
      ) {
        popupContent?.focus();
      }
    });
  });

  document.addEventListener("keydown", handleEscape);
  if (popup) {
    observer.observe(popup, { attributes: true });
  }

  document.addEventListener("astro:before-swap", () => {
    document.removeEventListener("keydown", handleEscape);
    observer.disconnect();
  });
}
