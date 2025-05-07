import { createClient } from "@libsql/client";

// Diese Datei wird nur serverseitig verwendet
// Astro verwendet import.meta.env anstelle von process.env
export const turso = createClient({
  url: import.meta.env.TURSO_DATABASE_URL ?? "",
  authToken: import.meta.env.TURSO_AUTH_TOKEN,
});

// Füge eine Prüfung hinzu, um sicherzustellen, dass dieser Code nur serverseitig ausgeführt wird
if (typeof window !== "undefined") {
  console.error("turso.js sollte nur auf der Serverseite importiert werden!");
}
