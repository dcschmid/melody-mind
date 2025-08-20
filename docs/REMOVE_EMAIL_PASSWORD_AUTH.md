# Entfernung der Email/Passwort-Authentifizierung

Diese Dokumentation beschreibt den Prozess, die Email/Passwort-Authentifizierung aus MelodyMind zu
entfernen und nur OAuth und Gastzugang zu behalten.

## Übersicht der Änderungen

### Was wird entfernt:

- Email/Passwort-Anmeldung und -Registrierung
- Passwort-Reset-Funktionalität
- Email-Verifikation
- Alle zugehörigen Datenbankfelder und -tabellen

### Was bleibt:

- OAuth-Authentifizierung (Google, Spotify, Apple, Discord, Yahoo)
- Gastzugang (keine Registrierung erforderlich)
- Benutzerprofile und Spielstände für OAuth-Benutzer

## Migrationsschritte

### 1. Datenbank-Migration ausführen

```bash
# Führe das Migrationsskript aus
node scripts/remove-email-password-auth.js
```

Das Skript wird:

- Alle Email/Passwort-bezogenen Spalten aus der `users` Tabelle entfernen
- OAuth-Benutzer und Gastbenutzer beibehalten
- Die Datenbankstruktur bereinigen
- Alle verwaisten Spielstände entfernen

### 2. Nicht mehr benötigte Komponenten entfernen

```bash
# Führe das Cleanup-Skript aus
node scripts/cleanup-auth-components.js
```

Das Skript entfernt:

- `PasswordResetForm.astro`
- `PasswordToggleButton.astro`
- `EmailVerification.astro`
- `PasswordRequirementsPanel.astro`

### 3. Vereinfachte AuthForm verwenden

Die `AuthForm.astro` wurde bereits aktualisiert und unterstützt jetzt nur noch:

- OAuth-Provider-Buttons
- Gastzugang-Button
- Keine Email/Passwort-Felder mehr

## Neue Datenbankstruktur

### Users Tabelle (vereinfacht)

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY NOT NULL,
  username TEXT,
  avatar_url TEXT,
  preferred_language TEXT DEFAULT 'en',
  created_at DATETIME NOT NULL DEFAULT (datetime('now')),
  updated_at DATETIME NOT NULL DEFAULT (datetime('now')),
  last_login_at DATETIME,
  login_count INTEGER DEFAULT 0
);
```

### Beibehaltene Tabellen

- `oauth_providers` - Für OAuth-Authentifizierung
- `oauth_sessions` - Für OAuth-Flow-Management
- `game_results` - Spielergebnisse
- `user_mode_stats` - Benutzerstatistiken
- `highscores` - Bestenlisten

## API-Endpunkte

### Neuer Gastzugang-Endpunkt

```
POST /api/auth/guest
```

Erstellt eine temporäre Gast-Session mit:

- Eindeutiger Gast-ID
- 30-Tage-Cookie-Gültigkeit
- Weiterleitung zur Spielstartseite

## Übersetzungen

Die folgenden Übersetzungsschlüssel werden noch benötigt:

- `auth.form.title` - Haupttitel der Anmeldeform
- `auth.form.subtitle` - Untertitel der Anmeldeform
- `auth.oauth.title` - OAuth-Bereichstitel
- `auth.oauth.description` - OAuth-Beschreibung
- `auth.guest.title` - Gastzugang-Bereichstitel
- `auth.guest.description` - Gastzugang-Beschreibung
- `auth.guest.button` - Gastzugang-Button-Text
- `auth.form.or` - "Oder"-Trennzeichen
- `auth.form.footer` - Fußzeile der Form

## Sicherheitsaspekte

### OAuth-Sicherheit

- Alle OAuth-Provider verwenden PKCE-Flow
- Zugriffstoken werden sicher gespeichert
- Automatische Bereinigung abgelaufener Sessions

### Gastzugang-Sicherheit

- Gast-Sessions sind temporär (30 Tage)
- Keine persönlichen Daten werden gespeichert
- Automatische Bereinigung inaktiver Sessions

## Rollback-Plan

Falls ein Rollback erforderlich ist:

1. **Datenbank wiederherstellen:**

   ```bash
   # Führe die ursprünglichen Migrationen erneut aus
   node db/setup.ts
   ```

2. **Komponenten wiederherstellen:**
   - Stelle die ursprünglichen Auth-Komponenten aus dem Git-Repository wieder her
   - Stelle die ursprüngliche `AuthForm.astro` wieder her

3. **Übersetzungen wiederherstellen:**
   - Stelle alle ursprünglichen Auth-Übersetzungen wieder her

## Testing

### Nach der Migration testen:

1. **OAuth-Anmeldung:** Funktioniert die Anmeldung mit Google/Spotify/etc.?
2. **Gastzugang:** Kann ein neuer Gast das Spiel starten?
3. **Spieldaten:** Werden Spielstände für OAuth-Benutzer korrekt geladen?
4. **Navigation:** Funktioniert die Navigation nach der Anmeldung?

### Bekannte Einschränkungen:

- Gastbenutzer haben keine dauerhaften Profile
- Spielstände von Gastbenutzern gehen verloren, wenn der Browser-Cache gelöscht wird
- OAuth-Benutzer können keine lokalen Passwörter mehr verwenden

## Support

Bei Problemen mit der Migration:

1. Überprüfe die Konsolenausgabe der Migrationsskripte
2. Prüfe die Datenbankstruktur mit `db/setup.ts`
3. Stelle sicher, dass alle OAuth-Konfigurationen korrekt sind
4. Überprüfe die Browser-Konsole auf JavaScript-Fehler
