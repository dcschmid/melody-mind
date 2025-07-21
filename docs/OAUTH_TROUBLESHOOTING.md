# OAuth Troubleshooting Guide

## 🔍 Häufige Probleme und Lösungen

### 1. "redirect_uri_mismatch" Fehler

**Problem:** Der OAuth Provider beschwert sich über eine falsche Redirect URI.

**Ursachen:**

- URI in Provider Console stimmt nicht mit der tatsächlichen URI überein
- http vs https Unterschied
- Port-Nummern fehlen oder sind falsch
- Trailing slash (/) Unterschiede

**Lösung:**

```bash
# Überprüfen Sie die exakte URI in den Logs:
# Server-Log zeigt: "Redirecting to: http://localhost:4321/api/auth/oauth/callback/google"

# Stellen Sie sicher, dass diese EXAKT in der Provider Console steht:
http://localhost:4321/api/auth/oauth/callback/google
http://localhost:4322/api/auth/oauth/callback/google
https://yourdomain.com/api/auth/oauth/callback/google
```

**Provider-spezifische Lösungen:**

- **Google:** Google Console → Credentials → OAuth client ID → Authorized redirect URIs
- **Spotify:** Spotify Dashboard → App Settings → Redirect URIs
- **Discord:** Discord Developer Portal → OAuth2 → Redirects
- **Apple:** Apple Developer → Service ID → Configure → Return URLs
- **Yahoo:** Yahoo Developer Network → App → Redirect URI(s)

### 2. "invalid_client" Fehler

**Problem:** Client ID oder Client Secret sind falsch.

**Lösung:**

```bash
# 1. Überprüfen Sie die .env Datei
cat .env | grep CLIENT

# 2. Stellen Sie sicher, dass keine Leerzeichen am Ende stehen
# FALSCH: GOOGLE_CLIENT_ID=123456 [SPACE]
# RICHTIG: GOOGLE_CLIENT_ID=123456

# 3. Starten Sie den Server neu nach .env Änderungen
yarn dev
```

**Spezielle Fälle:**

- **Apple:** Überprüfen Sie auch APPLE_TEAM_ID, APPLE_KEY_ID und APPLE_PRIVATE_KEY
- **Alle Provider:** Kopieren Sie IDs/Secrets direkt aus der Provider Console

### 3. "access_denied" Fehler

**Problem:** User hat die Berechtigung verweigert oder OAuth Consent Screen Problem.

**Normal:** User hat "Abbrechen" geklickt - kann es erneut versuchen.

**Wenn dauerhaft:**

- **Google:** OAuth Consent Screen ist nicht richtig konfiguriert
- **Apple:** Service ID nicht korrekt mit App ID verknüpft
- **Discord:** App nicht public oder Scopes zu breit

### 4. "invalid_grant" oder "authorization_code_expired"

**Problem:** Authorization Code ist abgelaufen (normalerweise nach 10 Minuten).

**Lösung:**

- User sollte es erneut versuchen
- Überprüfen Sie, ob System-Zeit korrekt ist
- Bei häufigem Auftreten: OAuth Flow zu langsam

### 5. Buttons werden nicht angezeigt

**Problem:** OAuth Provider Buttons fehlen auf der Login-Seite.

**Debug Schritte:**

```bash
# 1. Überprüfen Sie Browser-Konsole
# Sollte zeigen: "OAuth providers loaded successfully"

# 2. Überprüfen Sie /api/auth/oauth/providers Endpoint
curl http://localhost:4321/api/auth/oauth/providers

# 3. Überprüfen Sie .env Variablen
echo $GOOGLE_CLIENT_ID
```

**Lösungen:**

- JavaScript-Fehler in Browser-Konsole beheben
- .env Variablen setzen (leere CLIENT_ID versteckt Provider)
- Server neu starten nach .env Änderungen

### 6. "CORS" Fehler

**Problem:** Cross-Origin Request blocked.

**Nur bei Custom Domains:**

```typescript
// astro.config.mjs
export default defineConfig({
  server: {
    host: true, // Für externe Zugriffe
    cors: true,
  },
});
```

### 7. Apple OAuth "invalid_client" Spezial

**Problem:** Apple Sign In funktioniert nicht.

**Apple-spezifische Checks:**

```bash
# 1. Private Key Format überprüfen
echo $APPLE_PRIVATE_KEY | head -1
# Sollte starten mit: -----BEGIN PRIVATE KEY-----

# 2. Team ID Format (10 Zeichen)
echo $APPLE_TEAM_ID | wc -c
# Sollte 11 ausgeben (10 + newline)

# 3. Key ID Format (10 Zeichen)
echo $APPLE_KEY_ID | wc -c
# Sollte 11 ausgeben (10 + newline)

# 4. Client ID (Service ID)
echo $APPLE_CLIENT_ID
# Sollte so aussehen: com.yourdomain.melodymind.web
```

**Häufige Apple Fehler:**

- Service ID nicht mit App ID verknüpft
- Private Key als String statt Multiline
- Return URLs nicht HTTPS (außer localhost)

### 8. Database Fehler

**Problem:** "User could not be created" oder ähnliche DB Fehler.

**Debug:**

```bash
# 1. Database Verbindung testen
npm run db:status

# 2. OAuth Tabellen überprüfen
# Sollten existieren: users, oauth_provider_accounts, oauth_sessions

# 3. Migration ausführen
npm run db:migrate
```

### 9. Session/Cookie Probleme

**Problem:** User wird nicht als eingeloggt erkannt nach OAuth.

**Debug:**

```bash
# 1. Browser Application Tab überprüfen
# Cookies sollten enthalten: access_token, auth_status

# 2. localStorage überprüfen
localStorage.getItem('auth_status') // sollte "authenticated" sein

# 3. Server-Logs überprüfen
# Sollte zeigen: "User authenticated successfully"
```

**Lösungen:**

- Browser-Cache leeren
- Cookies für Domain erlauben
- HTTPS in Production (HTTP nur für localhost)

### 10. Production Deployment Probleme

**Problem:** OAuth funktioniert lokal, aber nicht in Production.

**Production Checklist:**

```bash
# 1. HTTPS aktiviert?
curl -I https://yourdomain.com
# Sollte 200 OK oder 301/302 redirect zeigen

# 2. Environment Variablen gesetzt?
env | grep CLIENT_ID

# 3. Redirect URIs in Provider Console aktualisiert?
# Alle localhost URLs durch Production URLs ersetzen

# 4. Domain in Provider Console whitelisted?
# Manche Provider benötigen Domain-Verifizierung
```

## 🔧 Debug Tools

### 1. OAuth Flow Debug Logger

Verwenden Sie diese Debug-Informationen aus den Server-Logs:

```bash
# Erfolgreicher Flow sollte zeigen:
OAuth callback called for provider: google
OAuth session found for state: [uuid]
Token exchange successful
User data fetched successfully
User authenticated successfully
```

### 2. Browser Dev Tools

**Application Tab:**

- Cookies: `access_token`, `auth_status`
- Local Storage: `auth_status: "authenticated"`

**Console:**

```javascript
// OAuth Provider Status prüfen
fetch("/api/auth/oauth/providers")
  .then((r) => r.json())
  .then(console.log);

// Auth Status prüfen
console.log("Auth Status:", localStorage.getItem("auth_status"));
console.log("User:", localStorage.getItem("user"));
```

### 3. Network Tab

Überprüfen Sie diese Requests:

1. `GET /api/auth/oauth/authorize/[provider]` → 302 Redirect
2. Provider Authorization → User consent
3. `GET /api/auth/oauth/callback/[provider]` → 302 Redirect zu Success
4. Success page load mit auth cookies

### 4. Provider-spezifische Debug URLs

**Google:**

```bash
# Google OAuth Playground für Token Testing
https://developers.google.com/oauthplayground/
```

**Spotify:**

```bash
# Spotify Web Console für API Testing
https://developer.spotify.com/console/
```

**Discord:**

```bash
# Discord Token Info
curl -H "Authorization: Bearer YOUR_TOKEN" https://discord.com/api/users/@me
```

## 🚨 Sofortige Hilfe

### Wenn gar nichts funktioniert:

1. **Server komplett neu starten:**

   ```bash
   pkill -f "astro dev"
   yarn dev
   ```

2. **Browser-Cache komplett leeren:**
   - Alle Cookies für localhost/domain löschen
   - localStorage leeren
   - Hard Refresh (Ctrl+Shift+R)

3. **Environment Variablen überprüfen:**

   ```bash
   # Alle OAuth Variablen anzeigen
   env | grep -E "(SPOTIFY|GOOGLE|APPLE|DISCORD|YAHOO)"
   ```

4. **Minimale Provider-Test:**
   - Nur einen Provider aktivieren (z.B. nur Google)
   - Alle anderen CLIENT_IDs aus .env entfernen
   - Testen ob dieser eine funktioniert

### Bei anhaltenden Problemen:

1. **Server-Logs vollständig durchlesen**
2. **Browser DevTools Console checken**
3. **Provider Console Konfiguration double-checken**
4. **Network Tab während OAuth Flow beobachten**

**95% aller OAuth Probleme sind Konfigurationsfehler in den Provider Consoles oder falsche
Umgebungsvariablen!** 🎯

## 📞 Support Kontakte

- **Spotify Developer Support:** [Spotify Support](https://developer.spotify.com/support/)
- **Google Cloud Support:** [Google Cloud Console](https://console.cloud.google.com/support)
- **Apple Developer Support:** [Apple Developer](https://developer.apple.com/support/)
- **Discord Developer Support:** [Discord Developers](https://discord.com/developers/docs)
- **Yahoo Developer Support:** [Yahoo Developer Network](https://developer.yahoo.com/support/)
