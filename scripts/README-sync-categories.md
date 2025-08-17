# Kategorien-Synchronisations-Script

Dieses Script synchronisiert die Playlist-URLs und Knowledge-URLs für alle Sprachversionen der
`categories.json` Dateien.

## Was macht das Script?

Das Script nimmt die englische `en_categories.json` als Vorlage und aktualisiert für alle anderen
Sprachen:

- **spotifyPlaylist** - Spotify Playlist-URLs
- **deezerPlaylist** - Deezer Playlist-URLs
- **appleMusicPlaylist** - Apple Music Playlist-URLs
- **knowledgeUrl** - Knowledge-URLs mit korrektem Sprachcode

## Verwendung

### Option 1: ES Module Version

```bash
node scripts/sync-categories.js
```

### Option 2: CommonJS Version

```bash
node scripts/sync-categories.cjs
```

## Unterstützte Sprachen

Das Script verarbeitet alle folgenden Sprachen:

- `cn` - Chinesisch
- `da` - Dänisch
- `de` - Deutsch
- `en` - Englisch (Vorlage)
- `es` - Spanisch
- `fi` - Finnisch
- `fr` - Französisch
- `it` - Italienisch
- `jp` - Japanisch
- `nl` - Niederländisch
- `pt` - Portugiesisch
- `ru` - Russisch
- `sv` - Schwedisch
- `uk` - Ukrainisch

## Beispiel-Output

```
🚀 Starte Synchronisation der Kategorien...
✅ Englische Vorlage geladen mit 25 Kategorien

🔄 Verarbeite Deutsch (de)...
✅ Deutsch (de): 8 Felder aktualisiert

🔄 Verarbeite Französisch (fr)...
✅ Französisch (fr): 12 Felder aktualisiert

🎉 Synchronisation abgeschlossen!

📋 Zusammenfassung der Synchronisation:
Die folgenden Felder wurden für alle Sprachen synchronisiert:
  • spotifyPlaylist
  • deezerPlaylist
  • appleMusicPlaylist
  • knowledgeUrl (mit korrektem Sprachcode)

Die englische categories.json diente als Vorlage.
```

## Sicherheit

- Das Script überschreibt die bestehenden Sprachdateien
- Es wird empfohlen, vor der Ausführung ein Backup zu erstellen
- Das Script zeigt an, welche Dateien aktualisiert wurden

## Fehlerbehandlung

Das Script behandelt folgende Fehler:

- Fehlende englische Vorlage
- Fehlende Sprachdateien
- JSON-Parsing-Fehler
- Schreibfehler

## Anpassungen

Falls neue Sprachen hinzugefügt werden, können diese einfach im `LANGUAGES` Objekt ergänzt werden.
