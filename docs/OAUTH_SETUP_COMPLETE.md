# Vollständige OAuth Provider Setup Anleitung für MelodyMind

## 🎯 Übersicht

MelodyMind unterstützt **5 OAuth Provider** out-of-the-box:

- ✅ **Spotify** (bereits konfiguriert)
- ✅ **Google** (vollständig implementiert)
- ✅ **Apple** (vollständig implementiert)
- ✅ **Discord** (vollständig implementiert)
- ✅ **Yahoo** (vollständig implementiert)

Alle Provider sind **vollständig implementiert** - Sie müssen nur die externen Apps konfigurieren
und Umgebungsvariablen setzen.

## 🔧 Quick Setup

### Umgebungsvariablen

Fügen Sie diese zu Ihrer `.env` Datei hinzu:

```env
# OAuth Provider Konfiguration

# Spotify OAuth
SPOTIFY_CLIENT_ID=your-spotify-client-id
SPOTIFY_CLIENT_SECRET=your-spotify-client-secret

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Apple OAuth (Sign in with Apple)
APPLE_CLIENT_ID=your-apple-client-id
APPLE_TEAM_ID=your-apple-team-id
APPLE_KEY_ID=your-apple-key-id
APPLE_PRIVATE_KEY=your-apple-private-key

# Discord OAuth
DISCORD_CLIENT_ID=your-discord-client-id
DISCORD_CLIENT_SECRET=your-discord-client-secret

# Yahoo OAuth
YAHOO_CLIENT_ID=your-yahoo-client-id
YAHOO_CLIENT_SECRET=your-yahoo-client-secret
```

### Standard Redirect URIs

Für **alle Provider** verwenden Sie diese Redirect URI-Pattern:

```
Development:
http://localhost:4321/api/auth/oauth/callback/{provider}
http://localhost:4322/api/auth/oauth/callback/{provider}

Production:
https://yourdomain.com/api/auth/oauth/callback/{provider}
```

Ersetzen Sie `{provider}` durch: `spotify`, `google`, `apple`, `discord`, oder `yahoo`.

---

## 📋 Provider-spezifische Setup Anleitungen

## 1. 🎵 Spotify OAuth Setup

### Schritt 1: Spotify App Dashboard

1. Gehen Sie zu [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Klicken Sie "Create App"
3. Füllen Sie aus:
   - **App name:** `MelodyMind`
   - **App description:** `Music trivia game with Spotify integration`
   - **Redirect URIs:**
     ```
     http://localhost:4321/api/auth/oauth/callback/spotify
     http://localhost:4322/api/auth/oauth/callback/spotify
     https://yourdomain.com/api/auth/oauth/callback/spotify
     ```
   - **APIs used:** Web API

### Schritt 2: Credentials kopieren

- **Client ID** und **Client Secret** aus dem Dashboard kopieren

### Features

- ✅ User Profile Access
- ✅ Top Tracks/Artists
- ✅ Playlists
- ✅ Music Library
- ✅ Avatar & Profile Info

---

## 2. 🔍 Google OAuth Setup

### Schritt 1: Google Cloud Console

1. Gehen Sie zu [Google Cloud Console](https://console.cloud.google.com/)
2. Erstellen Sie ein Projekt oder wählen Sie eins aus
3. Aktivieren Sie "Google+ API"
4. Gehen Sie zu "APIs & Services" → "Credentials"

### Schritt 2: OAuth Consent Screen

1. Wählen Sie "External"
2. App Information:
   - **App name:** `MelodyMind`
   - **User support email:** Ihre E-Mail
   - **App domain:** Ihre Domain
3. Scopes hinzufügen: `openid`, `email`, `profile`

### Schritt 3: OAuth Client ID

1. "Create Credentials" → "OAuth client ID"
2. **Application type:** Web application
3. **Authorized JavaScript origins:**
   ```
   http://localhost:4321
   http://localhost:4322
   https://yourdomain.com
   ```
4. **Authorized redirect URIs:**
   ```
   http://localhost:4321/api/auth/oauth/callback/google
   http://localhost:4322/api/auth/oauth/callback/google
   https://yourdomain.com/api/auth/oauth/callback/google
   ```

### Features

- ✅ Gmail Profile Access
- ✅ Google+ Profile
- ✅ Avatar & Personal Info
- ✅ Email Verification

---

## 3. 🍎 Apple OAuth Setup (Sign in with Apple)

### Schritt 1: Apple Developer Account

1. Gehen Sie zu [Apple Developer Portal](https://developer.apple.com/account/)
2. **Certificates, Identifiers & Profiles** → **Identifiers**
3. Klicken Sie das "+" und wählen Sie "App IDs"

### Schritt 2: App ID erstellen

1. **Description:** `MelodyMind`
2. **Bundle ID:** `com.yourdomain.melodymind` (reverse domain)
3. **Capabilities:** Aktivieren Sie "Sign in with Apple"

### Schritt 3: Service ID erstellen

1. **Identifiers** → "+" → **Services IDs**
2. **Description:** `MelodyMind Web`
3. **Identifier:** `com.yourdomain.melodymind.web`
4. **Configure Sign in with Apple:**
   - **Primary App ID:** Die eben erstellte App ID
   - **Domains:** `yourdomain.com`
   - **Return URLs:**
     ```
     http://localhost:4321/api/auth/oauth/callback/apple
     http://localhost:4322/api/auth/oauth/callback/apple
     https://yourdomain.com/api/auth/oauth/callback/apple
     ```

### Schritt 4: Private Key erstellen

1. **Keys** → "+" → **Sign in with Apple**
2. **Key Name:** `MelodyMind Apple Auth`
3. **Configure:** Wählen Sie Ihre App ID
4. **Download** der .p8 Datei (nur einmalig möglich!)

### Umgebungsvariablen

```env
APPLE_CLIENT_ID=com.yourdomain.melodymind.web
APPLE_TEAM_ID=ABC123DEF4  # Aus Apple Developer Account
APPLE_KEY_ID=XYZ789ABC1  # Aus der Key-Konfiguration
APPLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nIhre_Private_Key_Hier\n-----END PRIVATE KEY-----
```

### Features

- ✅ High Security (Face/Touch ID)
- ✅ Privacy-Focused
- ✅ Email Relay Option
- ✅ Name & Profile Access

---

## 4. 🎮 Discord OAuth Setup

### Schritt 1: Discord Developer Portal

1. Gehen Sie zu [Discord Developer Portal](https://discord.com/developers/applications)
2. Klicken Sie "New Application"
3. **Name:** `MelodyMind`

### Schritt 2: OAuth2 konfigurieren

1. Gehen Sie zu **OAuth2** → **General**
2. **Redirects:** Fügen Sie hinzu:
   ```
   http://localhost:4321/api/auth/oauth/callback/discord
   http://localhost:4322/api/auth/oauth/callback/discord
   https://yourdomain.com/api/auth/oauth/callback/discord
   ```

### Schritt 3: Credentials kopieren

- **Client ID** und **Client Secret** aus dem OAuth2 Tab

### Features

- ✅ Gaming Profile
- ✅ Avatar & Banner
- ✅ Username#Discriminator
- ✅ Server Memberships
- ✅ Gaming Activity

---

## 5. 📧 Yahoo OAuth Setup

### Schritt 1: Yahoo Developer Network

1. Gehen Sie zu [Yahoo Developer Network](https://developer.yahoo.com/)
2. Erstellen Sie einen Account oder loggen Sie sich ein
3. Gehen Sie zu "My Apps" → "Create an App"

### Schritt 2: App konfigurieren

1. **Application Name:** `MelodyMind`
2. **Application Type:** `Web Application`
3. **Description:** `Music trivia game with Yahoo authentication`
4. **Home Page URL:** `https://yourdomain.com`
5. **Redirect URI(s):**
   ```
   http://localhost:4321/api/auth/oauth/callback/yahoo
   http://localhost:4322/api/auth/oauth/callback/yahoo
   https://yourdomain.com/api/auth/oauth/callback/yahoo
   ```
6. **API Permissions:** OpenID Connect

### Schritt 3: Credentials kopieren

- **Client ID** und **Client Secret** aus dem App Dashboard

### Features

- ✅ Yahoo Mail Profile
- ✅ OpenID Connect
- ✅ Profile Information
- ✅ Email Access

---

## 🧪 Testing

### Alle Provider testen

1. **Server starten:**

   ```bash
   yarn dev
   ```

2. **Login-Seite öffnen:**

   ```
   http://localhost:4321/de/auth/login
   ```

3. **Jeden Provider testen:**
   - Klicken Sie "Weiter mit [Provider]"
   - Sollte zur Provider-Seite weiterleiten
   - Nach Anmeldung zurück zu MelodyMind
   - Erfolgreich eingeloggt

### Debug-Informationen

**Server-Logs überprüfen:**

```bash
# Sollte diese Nachrichten zeigen:
OAuth callback called for provider: [provider]
OAuth callback - code: present
User authenticated successfully
```

**Browser-Konsole:**

```javascript
// localStorage sollte enthalten:
auth_status: "authenticated";
user: "{...user_data...}";
```

## ⚠️ Häufige Fehler und Lösungen

### 1. "redirect_uri_mismatch"

**Problem:** Redirect URI stimmt nicht überein **Lösung:** Überprüfen Sie die exakte URI in der
Provider-Console

### 2. "invalid_client"

**Problem:** Client ID/Secret falsch **Lösung:** Überprüfen Sie die .env Variablen

### 3. "access_denied"

**Problem:** User hat Berechtigung verweigert **Lösung:** Normal - User kann es erneut versuchen

### 4. "invalid_grant"

**Problem:** Authorization Code abgelaufen **Lösung:** Erneut versuchen - Codes sind nur kurz gültig

### 5. Apple "invalid_client"

**Problem:** Private Key oder IDs falsch **Lösung:** Überprüfen Sie Team ID, Key ID und Private Key
Format

## 🚀 Produktions-Deployment

### 1. Domain-Konfiguration

**Alle Provider:** Ersetzen Sie localhost URLs durch Ihre Produktions-Domain

### 2. HTTPS erforderlich

**Alle Provider:** Verwenden Sie HTTPS in Produktion (außer localhost)

### 3. Environment Variables

```bash
# Produktions-Server
export SPOTIFY_CLIENT_ID="..."
export GOOGLE_CLIENT_ID="..."
# ... etc
```

### 4. Security Considerations

- ✅ **HTTPS Pflicht** (außer Development)
- ✅ **PKCE aktiviert** für alle kompatiblen Provider
- ✅ **State Parameter** für CSRF Protection
- ✅ **Secure Cookies** in Produktion
- ✅ **Token Expiry** automatisch behandelt

## 📊 Übersicht der Features

| Provider | Profile | Avatar | Email | Zusätzliche Features          |
| -------- | ------- | ------ | ----- | ----------------------------- |
| Spotify  | ✅      | ✅     | ✅    | Musik-Präferenzen, Top Tracks |
| Google   | ✅      | ✅     | ✅    | Gmail, Google+ Profil         |
| Apple    | ✅      | ❌     | ✅    | Höchste Sicherheit, Privacy   |
| Discord  | ✅      | ✅     | ✅    | Gaming Profil, Server         |
| Yahoo    | ✅      | ✅     | ✅    | Mail-Integration              |

## 🎉 Das war's!

Nach dem Setup haben Sie:

- ✅ **5 OAuth Provider** vollständig funktional
- ✅ **Account Linking** - User können mehrere Provider verknüpfen
- ✅ **Sichere Authentifizierung** mit modernsten Standards
- ✅ **Mehrsprachige UI** für alle Provider
- ✅ **Responsive Design** auf allen Geräten
- ✅ **Production-Ready** Implementation

**Alle Provider sind plug-and-play - einfach die Credentials setzen und es funktioniert!** 🚀

## 📝 Weitere Dokumentation

- [Spotify spezifisch](./SPOTIFY_OAUTH_SETUP.md)
- [Google spezifisch](./GOOGLE_OAUTH_SETUP.md)
- [OAuth Troubleshooting](./OAUTH_TROUBLESHOOTING.md)
- [Security Best Practices](./OAUTH_SECURITY.md)
