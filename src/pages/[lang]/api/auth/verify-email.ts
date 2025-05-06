import type { APIRoute } from "astro";
import { authService } from "../../../../lib/auth/auth-service.js";
import { getLangFromUrl, useTranslations } from "../../../../utils/i18n.js";

export const GET: APIRoute = async ({ request, url, params }) => {
  // Extrahiere die Sprache aus den URL-Parametern
  const lang = params.lang as string;
  const t = useTranslations(lang);

  try {
    // Extrahiere den Token aus den URL-Parametern
    const token = url.searchParams.get("token");

    // Validiere die Eingabe
    if (!token) {
      return new Response(
        JSON.stringify({
          success: false,
          error: t("auth.form.required"),
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    // Verifiziere die E-Mail-Adresse
    const success = await authService.verifyUserEmail(token);

    if (!success) {
      return new Response(
        JSON.stringify({
          success: false,
          error: t("auth.email_verification.error"),
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    // Erfolgreiche E-Mail-Verifizierung
    return new Response(
      JSON.stringify({
        success: true,
        message: t("auth.email_verification.message"),
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error("Fehler bei der E-Mail-Verifizierung:", error);

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
