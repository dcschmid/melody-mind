import type { APIRoute } from "astro";
import { authService } from "../../../../lib/auth/auth-service.js";
import { getLangFromUrl, useTranslations } from "../../../../utils/i18n.js";

export const POST: APIRoute = async ({ request, params }) => {
  // Extrahiere die Sprache aus den URL-Parametern
  const lang = params.lang as string;
  const t = useTranslations(lang);

  try {
    // Extrahiere das Refresh-Token aus dem Cookie
    const cookies = request.headers.get("cookie") || "";
    const refreshTokenMatch = cookies.match(/refresh_token=([^;]+)/);

    if (!refreshTokenMatch || !refreshTokenMatch[1]) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Kein Refresh-Token vorhanden",
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    const refreshToken = refreshTokenMatch[1];

    // Erneuere das Access-Token
    const result = await authService.refreshToken(refreshToken);

    if (!result.success) {
      return new Response(
        JSON.stringify({
          success: false,
          error: result.error,
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    // Setze das neue Access-Token als Cookie
    const accessTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 Stunden

    return new Response(
      JSON.stringify({
        success: true,
        message: "Token erfolgreich erneuert",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": `access_token=${result.accessToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Expires=${accessTokenExpiry.toUTCString()}`,
        },
      },
    );
  } catch (error) {
    console.error("Fehler beim Erneuern des Tokens:", error);

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
