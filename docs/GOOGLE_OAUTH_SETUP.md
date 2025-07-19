# Google OAuth Setup für MelodyMind

## Übersicht

Diese Anleitung führt Sie durch die Einrichtung von Google OAuth für MelodyMind. Das System ist bereits vollständig implementiert - Sie müssen nur die Google Console konfigurieren und die Umgebungsvariablen setzen.

## Voraussetzungen

- Google Cloud Console Zugang
- MelodyMind läuft auf einer Domain (für Produktion) oder localhost (für Entwicklung)

## Schritt-für-Schritt Anleitung

### 1. Google Cloud Console Setup

1. **Gehen Sie zur [Google Cloud Console](https://console.cloud.google.com/)**

2. **Erstellen Sie ein neues Projekt oder wählen Sie ein bestehendes:**
   - Klicken Sie auf das Projekt-Dropdown oben
   - "Neues Projekt" → Geben Sie "MelodyMind" als Namen ein
   - Projekt erstellen

3. **Aktivieren Sie die Google+ API:**
   - Gehen Sie zu "APIs & Services" → "Library"
   - Suchen Sie nach "Google+ API"
   - Klicken Sie darauf und dann "Enable"

4. **Erstellen Sie OAuth 2.0 Credentials:**
   - Gehen Sie zu "APIs & Services" → "Credentials"
   - Klicken Sie "Create Credentials" → "OAuth client ID"
   - Wenn Sie zum ersten Mal Credentials erstellen, müssen Sie zuerst den "OAuth consent screen" konfigurieren

### 2. OAuth Consent Screen konfigurieren

1. **Wählen Sie "External" (für öffentliche Apps)**

2. **App Information:**
   - App name: `MelodyMind`
   - User support email: Ihre E-Mail
   - App logo: (Optional) MelodyMind Logo hochladen
   - App domain: Ihre Domain (z.B. `https://melodymind.com`)
   - Developer contact information: Ihre E-Mail

3. **Scopes:**
   - Fügen Sie diese Scopes hinzu:
     - `openid`
     - `email`
     - `profile`

4. **Test users:** (Für Development)
   - Fügen Sie Ihre Test-E-Mail-Adressen hinzu

### 3. OAuth Client ID erstellen

1. **Zurück zu "Credentials" → "Create Credentials" → "OAuth client ID"**

2. **Application type:** "Web application"

3. **Name:** "MelodyMind Web Client"

4. **Authorized JavaScript origins:**
   ```
   Development:
   http://localhost:4321
   http://localhost:4322
   
   Production:
   https://yourdomain.com
   ```

5. **Authorized redirect URIs:**
   ```
   Development:
   http://localhost:4321/api/auth/oauth/callback/google
   http://localhost:4322/api/auth/oauth/callback/google
   
   Production:
   https://yourdomain.com/api/auth/oauth/callback/google
   ```

6. **Klicken Sie "Create"**

### 4. Credentials kopieren

Nach der Erstellung erhalten Sie:
- **Client ID** (beginnt mit etwas wie `123456789-abcdef.apps.googleusercontent.com`)
- **Client Secret** (zufälliger String)

**Kopieren Sie beide Werte!**

### 5. Umgebungsvariablen setzen

Fügen Sie diese Zeilen zu Ihrer `.env` Datei hinzu:

```env
# Google OAuth
GOOGLE_CLIENT_ID=123456789-abcdef.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret-here
```

### 6. Server neu starten

```bash
# Development Server neu starten
yarn dev
```

## Testing

### 1. OAuth Flow testen

1. **Gehen Sie zu Ihrer Login-Seite:** `http://localhost:4321/de/auth/login`

2. **Klicken Sie auf "Weiter mit Google"**

3. **Sie sollten zu Google weitergeleitet werden**

4. **Nach der Anmeldung werden Sie zurück zu MelodyMind geleitet und sind eingeloggt**

### 2. Debugging

**Überprüfen Sie die Browser-Konsole und Server-Logs für Fehler:**

```bash
# Server-Logs zeigen OAuth Debug-Informationen
# Schauen Sie nach Zeilen wie:
# "OAuth callback called for provider: google"
# "OAuth callback - code: present"
```

**Häufige Fehler:**

1. **"redirect_uri_mismatch"**
   - Überprüfen Sie, dass die Redirect URI in Google Console genau mit Ihrer URL übereinstimmt
   - Achten Sie auf http vs https, Port-Nummern, trailing slashes

2. **"invalid_client"**
   - Client ID oder Secret sind falsch
   - Überprüfen Sie die .env Datei

3. **"access_denied"**
   - User hat die Berechtigung verweigert
   - Oder OAuth Consent Screen ist nicht richtig konfiguriert

## Produktions-Setup

### 1. Domain verifizieren

In der Google Console unter "OAuth consent screen" → "App domains":
- Fügen Sie Ihre Produktions-Domain hinzu
- Google kann eine Domain-Verifizierung verlangen

### 2. App Review (Optional)

Für öffentliche Apps mit vielen Benutzern:
- Google kann eine App Review verlangen
- Dies ist nur nötig wenn Sie bestimmte sensible Scopes verwenden
- Die Standard Scopes (openid, email, profile) benötigen normalerweise keine Review

### 3. Redirect URIs aktualisieren

Vergessen Sie nicht, die Redirect URIs in der Google Console zu aktualisieren:
```
https://yourdomain.com/api/auth/oauth/callback/google
```

## Weitere Provider

Das OAuth-System unterstützt bereits:
- ✅ **Spotify** (implementiert)
- ✅ **Google** (Sie implementieren gerade)
- 🔄 **Apple** (konfiguriert, braucht Setup)
- 🔄 **Discord** (konfiguriert, braucht Setup)  
- 🔄 **Yahoo** (konfiguriert, braucht Setup)

Jeder Provider folgt dem gleichen Muster - nur die Konfiguration unterscheidet sich.

## Support

Bei Problemen:
1. Überprüfen Sie die Server-Logs
2. Überprüfen Sie die Browser-Konsole
3. Stellen Sie sicher, dass alle Umgebungsvariablen gesetzt sind
4. Überprüfen Sie die Google Console Konfiguration

Das OAuth-System ist vollständig implementiert und sollte sofort funktionieren, sobald die Google Console korrekt konfiguriert ist!