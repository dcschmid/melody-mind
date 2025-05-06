import type { APIRoute } from "astro";
import { getLangFromUrl, useTranslations } from "../../../../utils/i18n.js";

export const POST: APIRoute = async ({ request, params, cookies }) => {
  // Extrahiere die Sprache aus den URL-Parametern
  const lang = params.lang as string;
  const t = useTranslations(lang);

  try {
    // Lösche die Authentifizierungs-Cookies
    const accessTokenExpiry = new Date(0); // Setze das Ablaufdatum in die Vergangenheit

    return new Response(
      JSON.stringify({
        success: true,
        message: "Erfolgreich abgemeldet",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": `access_token=; HttpOnly; Secure; SameSite=Strict; Path=/; Expires=${accessTokenExpiry.toUTCString()}`,
        },
      },
    );
  } catch (error) {
    console.error("Fehler beim Abmelden:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: t("auth.form.error"),
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
};
