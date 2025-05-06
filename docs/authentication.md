# Authentifizierungssystem für Melody Mind

Diese Dokumentation beschreibt das implementierte Authentifizierungssystem für Melody Mind, das auf Astro und Turso DB basiert.

## Überblick

Das Authentifizierungssystem bietet folgende Funktionen:

- Benutzerregistrierung mit E-Mail und Passwort
- Sichere Passwortvalidierung und -speicherung
- E-Mail-Verifizierung
- Anmeldung mit E-Mail und Passwort
- Session-Management mit JWT (JSON Web Tokens)
- Passwort-Reset-Funktionalität
- CSRF-Schutz
- Rate-Limiting für Login-Versuche
- Middleware für geschützte Routen
- Rollenbasierte Zugriffssteuerung

## Architektur

Das Authentifizierungssystem besteht aus mehreren Komponenten:

1. **Datenbankschicht**: Implementiert in `src/lib/auth/db.ts`, bietet grundlegende Funktionen für Benutzeroperationen.
2. **JWT-Handling**: Implementiert in `src/lib/auth/jwt.ts`, verwaltet die Generierung und Validierung von JWT-Tokens.
3. **CSRF-Schutz**: Implementiert in `src/lib/auth/csrf.ts`, bietet Schutz vor Cross-Site Request Forgery.
4. **Rate-Limiting**: Implementiert in `src/lib/auth/rate-limit.ts`, schützt vor Brute-Force-Angriffen.
5. **Passwortvalidierung**: Implementiert in `src/lib/auth/password-validation.ts`, stellt sicher, dass Passwörter den Sicherheitsanforderungen entsprechen.
6. **Middleware**: Implementiert in `src/lib/auth/middleware.ts`, bietet Funktionen zum Schutz von Routen.
7. **Auth-Service**: Implementiert in `src/lib/auth/auth-service.ts`, fasst alle Authentifizierungsfunktionen zusammen.
8. **API-Endpoints**: Implementiert in `src/pages/api/auth/`, bieten REST-Schnittstellen für Authentifizierungsoperationen.

## Datenmodell

Das Authentifizierungssystem verwendet die `users`-Tabelle in der Turso-Datenbank mit folgenden Feldern:

- `id`: Primärschlüssel, UUID als String
- `email`: E-Mail-Adresse des Benutzers (unique)
- `password_hash`: Bcrypt-gehashtes Passwort
- `username`: Optionaler Benutzername
- `email_verified`: Status der E-Mail-Verifizierung
- `verification_token`: Token für die E-Mail-Verifizierung
- `verification_token_expires_at`: Ablaufzeit des Verifizierungstokens
- `reset_token`: Token für das Zurücksetzen des Passworts
- `reset_token_expires_at`: Ablaufzeit des Reset-Tokens
- `created_at`: Erstellungszeitpunkt
- `updated_at`: Letzter Aktualisierungszeitpunkt

## API-Endpoints

Das Authentifizierungssystem bietet folgende API-Endpoints:

### POST /api/auth/register

Registriert einen neuen Benutzer.

**Request-Body:**

```json
{
  "email": "user@example.com",
  "password": "secure_password",
  "username": "username" // optional
}
```

**Erfolgreiche Antwort (201):**

```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "username",
    "emailVerified": false,
    "createdAt": "2025-05-05T18:00:00.000Z",
    "updatedAt": "2025-05-05T18:00:00.000Z"
  },
  "message": "Registrierung erfolgreich. Bitte überprüfe dein E-Mail-Postfach, um deine E-Mail-Adresse zu bestätigen."
}
```

### POST /api/auth/login

Meldet einen Benutzer an.

**Request-Body:**

```json
{
  "email": "user@example.com",
  "password": "secure_password"
}
```

**Erfolgreiche Antwort (200):**

```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "username",
    "emailVerified": true,
    "createdAt": "2025-05-05T18:00:00.000Z",
    "updatedAt": "2025-05-05T18:00:00.000Z"
  },
  "csrfToken": "csrf_token"
}
```

Die Antwort setzt auch folgende Cookies:

- `access_token`: JWT-Token für die Authentifizierung (HttpOnly)
- `refresh_token`: Token zum Erneuern des Access-Tokens (HttpOnly)
- `csrf_token`: Token zum Schutz vor CSRF-Angriffen

### POST /api/auth/logout

Meldet einen Benutzer ab.

**Erfolgreiche Antwort (200):**

```json
{
  "success": true,
  "message": "Erfolgreich abgemeldet"
}
```

Die Antwort löscht auch die Authentifizierungs-Cookies.

### POST /api/auth/reset-password

Fordert einen Passwort-Reset an.

**Request-Body:**

```json
{
  "email": "user@example.com"
}
```

**Erfolgreiche Antwort (200):**

```json
{
  "success": true,
  "message": "Wenn ein Konto mit dieser E-Mail-Adresse existiert, wurde eine E-Mail mit Anweisungen zum Zurücksetzen des Passworts gesendet."
}
```

### PUT /api/auth/reset-password

Setzt das Passwort mit einem Reset-Token zurück.

**Request-Body:**

```json
{
  "token": "reset_token",
  "newPassword": "new_secure_password"
}
```

**Erfolgreiche Antwort (200):**

```json
{
  "success": true,
  "message": "Passwort erfolgreich zurückgesetzt. Du kannst dich jetzt mit deinem neuen Passwort anmelden."
}
```

### GET /api/auth/verify-email

Verifiziert die E-Mail-Adresse eines Benutzers.

**Query-Parameter:**

- `token`: Verifizierungstoken

**Erfolgreiche Antwort (200):**

```json
{
  "success": true,
  "message": "E-Mail-Adresse erfolgreich verifiziert. Du kannst dich jetzt anmelden."
}
```

### POST /api/auth/refresh-token

Erneuert das Access-Token mit einem Refresh-Token.

**Erfolgreiche Antwort (200):**

```json
{
  "success": true,
  "message": "Token erfolgreich erneuert"
}
```

Die Antwort setzt auch ein neues `access_token`-Cookie.

## Geschützte Routen

Um eine Route zu schützen, verwende die `protectRoute`-Middleware:

```typescript
import { protectRoute } from "../../lib/auth/middleware";

export const GET: APIRoute = async ({ request }) => {
  const authResult = await protectRoute(request);

  if (!authResult.authorized) {
    return new Response(
      JSON.stringify({
        success: false,
        error: authResult.error,
      }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }

  // Geschützte Logik hier...
};
```

Für rollenbasierte Zugriffssteuerung:

```typescript
const authResult = await protectRoute(request, "admin");
```

## Sicherheitsaspekte

### Passwort-Hashing

Passwörter werden mit bcrypt gehasht, einem sicheren und bewährten Algorithmus für Passwort-Hashing. Der Salt-Faktor ist auf 12 gesetzt, was einen guten Kompromiss zwischen Sicherheit und Performance darstellt.

### Passwortvalidierung

Die Passwortvalidierung stellt sicher, dass Passwörter den folgenden Anforderungen entsprechen:

- Mindestlänge von 8 Zeichen
- Mindestens ein Großbuchstabe
- Mindestens ein Kleinbuchstabe
- Mindestens eine Zahl
- Mindestens ein Sonderzeichen
- Keine häufig verwendeten Passwörter
- Keine dreifachen Wiederholungen desselben Zeichens
- Keine einfachen Sequenzen

### Token-Sicherheit

- JWT-Tokens haben eine begrenzte Gültigkeitsdauer (24 Stunden für Access-Tokens, 7 Tage für Refresh-Tokens).
- Verifizierungs- und Reset-Tokens sind UUIDs mit begrenzter Gültigkeitsdauer (24 Stunden für Verifizierungstokens, 1 Stunde für Reset-Tokens).

### CSRF-Schutz

Der CSRF-Schutz verwendet einen doppelten Token-Ansatz:

- Ein Token im Cookie (`csrf_token`)
- Derselbe Token im Header (`x-csrf-token`)

Alle Mutationsanfragen (POST, PUT, DELETE) müssen ein gültiges CSRF-Token im Header enthalten.

### Rate-Limiting

Das Rate-Limiting für Login-Versuche begrenzt die Anzahl der fehlgeschlagenen Anmeldeversuche auf 5 innerhalb von 15 Minuten. Nach Überschreitung des Limits wird die IP-Adresse für 1 Stunde gesperrt.

## Umgebungsvariablen

Das Authentifizierungssystem verwendet folgende Umgebungsvariablen:

- `TURSO_DATABASE_URL`: URL der Turso-Datenbank
- `TURSO_AUTH_TOKEN`: Authentifizierungstoken für die Turso-Datenbank
- `JWT_SECRET`: Geheimer Schlüssel für JWT-Tokens
- `CSRF_SECRET`: Geheimer Schlüssel für CSRF-Tokens

## Best Practices

1. **Sichere Passwörter**: Verwende die Passwortvalidierung, um sicherzustellen, dass Benutzer sichere Passwörter wählen.
2. **E-Mail-Verifizierung**: Aktiviere die E-Mail-Verifizierung, um sicherzustellen, dass Benutzer Zugriff auf die angegebene E-Mail-Adresse haben.
3. **HTTPS**: Verwende immer HTTPS für die Übertragung von Authentifizierungsdaten.
4. **Session-Management**: Implementiere sicheres Session-Management mit kurzen Session-Timeouts.
5. **Logging**: Protokolliere Authentifizierungsereignisse für Audit-Zwecke.
6. **Fehlerbehandlung**: Gib keine detaillierten Fehlerinformationen preis, die von Angreifern ausgenutzt werden könnten.
7. **Regelmäßige Updates**: Halte alle Abhängigkeiten auf dem neuesten Stand, um bekannte Sicherheitslücken zu vermeiden.
