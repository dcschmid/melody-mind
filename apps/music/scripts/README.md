# Audio Duration Helper Scripts

Helper-Scripts zum automatischen Aktualisieren von `durationSeconds` in Album-MDX-Dateien.

## Voraussetzungen

### Option 1: Mit ffprobe (empfohlen)

```bash
# macOS
brew install ffmpeg

# Linux (Debian/Ubuntu)
sudo apt-get install ffmpeg

# Linux (Fedora/RHEL)
sudo dnf install ffmpeg
```

## IndexNow submission

The public verification key is hosted from `apps/music/public/`, so production serves
it at:

```text
https://melody-mind.de/9eda49e5fe0da697d03be0e0182261f6220da2066439bd6ae66018671155d83a.txt
```

After a deployment is live, submit only the URLs that were added or changed:

```bash
pnpm indexnow:submit -- /neon-hearts/
pnpm indexnow:submit -- apps/music/src/content/albums/neon-hearts.mdx
pnpm indexnow:submit -- --git HEAD~1..HEAD
```

Use `--dry-run` to inspect the payload without calling IndexNow:

```bash
pnpm indexnow:submit -- --dry-run /neon-hearts/
```

Do not submit the full sitemap on every release. IndexNow is intended for new,
updated, or deleted URLs.

Das Script `update-durations.mjs` nutzt `ffprobe` (Teil von ffmpeg), um die Audiodauer aus Remote-URLs zu ermitteln. Das ist zuverlässig und braucht keine Node-Dependencies.

### Option 2: Mit Node-Packages

```bash
# Installiere optional für erweiterte Funktionen
cd /home/daniel/dev/github/melody-mind
pnpm add -D mp3-duration axios
```

## Verwendung

### Mit ffprobe (automatisch)

```bash
# Prüfmodus (keine Änderungen)
node apps/music/scripts/update-durations.mjs --dry-run

# Tatsächliche Aktualisierung
node apps/music/scripts/update-durations.mjs
```

### Mit Node-Packages

```bash
# Wenn ffprobe nicht verfügbar ist
node apps/music/scripts/update-durations-npm.mjs --dry-run
node apps/music/scripts/update-durations-npm.mjs
```

## Was das Script tut

1. Liest alle `.mdx` Dateien im `apps/music/src/content/albums/` Verzeichnis
2. Extrahiert die Audio-URLs aus dem YAML-Frontmatter
3. Ruft die Dauer jeder Audiodatei ab
4. Aktualisiert `durationSeconds` mit den korrekten Werten
5. Speichert die Änderungen zurück in die Dateien

## Troubleshooting

- **"ffprobe: command not found"**: Installiere ffmpeg (siehe Voraussetzungen)
- **Timeout bei großen Dateien**: Erhöhe das Timeout im Script
- **Falsche Durationen**: Prüfe, ob die Audio-URLs erreichbar sind

## Beispiel Output

```
🎵 Updating audio durations in album files...

📄 neon-hearts.mdx
   Track 1: 서울의 불빛 (Lights of Seoul)... ✅ 194s
   Track 2: 한강의 자정 (Midnight on the Han)... ✅ 171s
   Track 3: 유리창 너머 (Beyond the Window)... ✅ 257s
   ✅ Updated 3 tracks

✨ All durations updated!
```
