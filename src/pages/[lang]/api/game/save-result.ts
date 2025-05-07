import { turso } from "../../../../turso.ts";
import { nanoid } from "nanoid";
import type { APIRoute } from "astro";

export interface GameResultData {
  userId: string;
  categoryName: string;
  difficulty: string;
  score: number;
  correctAnswers: number;
  totalRounds: number;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const data: GameResultData = await request.json();

    console.log("Received game result data:", data);

    // Validiere die Eingabedaten
    if (
      !data.userId ||
      !data.categoryName ||
      !data.difficulty ||
      typeof data.score !== "number"
    ) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Ungültige Eingabedaten",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Bestimme den Spielmodus basierend auf dem Referer
    const referer = request.headers.get("referer") || "";
    const gameMode = referer.includes("/game-") ? "quiz" : "chronology";

    // Generiere eine eindeutige ID für das Spielergebnis
    const id = nanoid();

    // Speichere das Spielergebnis in der Datenbank
    await turso.execute({
      sql: `
        INSERT INTO game_results (
          id,
          user_id,
          game_mode,
          score,
          category,
          difficulty
        ) VALUES (?, ?, ?, ?, ?, ?)
      `,
      args: [
        id,
        data.userId,
        gameMode,
        data.score,
        data.categoryName,
        data.difficulty,
      ],
    });

    // Aktualisiere die Benutzerstatistiken
    await updateUserModeStats(data.userId, gameMode, data.score);

    // Speichere den Highscore
    await saveHighscore(data.userId, gameMode, data.score, data.categoryName);

    return new Response(
      JSON.stringify({
        success: true,
        gameMode,
        id,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("API Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: error instanceof Error ? error.message : "Unbekannter Fehler",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};

/**
 * Aktualisiert die Benutzerstatistiken für einen bestimmten Spielmodus
 */
async function updateUserModeStats(
  userId: string,
  gameMode: string,
  score: number,
): Promise<void> {
  // Prüfe zuerst, ob bereits ein Datensatz für diesen Benutzer und Spielmodus existiert
  const existingStats = await turso.execute({
    sql: `
      SELECT * FROM user_mode_stats
      WHERE user_id = ? AND game_mode = ?
    `,
    args: [userId, gameMode],
  });

  if (existingStats.rows.length > 0) {
    // Aktualisiere vorhandenen Datensatz
    await turso.execute({
      sql: `
        UPDATE user_mode_stats
        SET
          total_score = total_score + ?,
          games_played = games_played + 1,
          highest_score = CASE WHEN ? > highest_score THEN ? ELSE highest_score END
        WHERE user_id = ? AND game_mode = ?
      `,
      args: [score, score, score, userId, gameMode],
    });
  } else {
    // Füge neuen Datensatz ein
    await turso.execute({
      sql: `
        INSERT INTO user_mode_stats (
          user_id,
          game_mode,
          total_score,
          games_played,
          highest_score
        ) VALUES (?, ?, ?, ?, ?)
      `,
      args: [userId, gameMode, score, 1, score],
    });
  }
}

/**
 * Speichert einen neuen Highscore-Eintrag
 */
async function saveHighscore(
  userId: string,
  gameMode: string,
  score: number,
  category: string,
): Promise<void> {
  // Generiere eine eindeutige ID für den Highscore
  const id = nanoid();

  // Füge den Highscore in die Datenbank ein
  await turso.execute({
    sql: `
      INSERT INTO highscores (
        id,
        user_id,
        game_mode,
        score,
        category
      ) VALUES (?, ?, ?, ?, ?)
    `,
    args: [id, userId, gameMode, score, category],
  });
}
