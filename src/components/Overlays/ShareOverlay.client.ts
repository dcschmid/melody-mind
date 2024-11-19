document.querySelectorAll("[data-share]").forEach((button) => {
  button.addEventListener("click", (e) => {
    const target = e.currentTarget as HTMLElement;
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
