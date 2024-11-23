document.querySelectorAll("[data-share]").forEach((button) => {
  if (!button) return; // Sicherheitsprüfung

  button.addEventListener("click", (e) => {
    const target = e.currentTarget as HTMLElement;
    if (!target) return; // Zusätzliche Sicherheitsprüfung

    const type = target.getAttribute("data-share");
    const url = window.location.href;

    if (type === "facebook") {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        "_blank",
      );
    } else if (type === "whatsapp") {
      window.open(`https://api.whatsapp.com/send?text=${url}`, "_blank");
    }
  });
});
