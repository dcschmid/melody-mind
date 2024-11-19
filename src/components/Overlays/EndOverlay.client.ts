import { shareScore } from "../../utils/share/shareUtils";

// Client-seitige Logik
export function initializeShareButtons() {
  const shareButtons = document.querySelectorAll("[data-share]");

  shareButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const popup = document.getElementById("endgame-popup");
      const score = Number(popup?.dataset.score || 0);
      const category = popup?.dataset.category || "";
      const difficulty = popup?.dataset.difficulty || "";

      const platform = button.getAttribute("data-share") as
        | "twitter"
        | "facebook";
      shareScore(platform, { score, category, difficulty });
    });
  });
}

// Nur im Browser-Kontext ausführen
if (typeof window !== "undefined") {
  window.addEventListener("load", initializeShareButtons);
}
