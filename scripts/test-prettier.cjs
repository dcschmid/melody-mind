const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("Testing Prettier with Astro plugin...");

// Erstelle einen temporären Test-Report-Ordner, falls er nicht existiert
const reportDir = path.join(__dirname, "..", "tmp");
if (!fs.existsSync(reportDir)) {
  fs.mkdirSync(reportDir);
}

// Report-Datei
const reportFile = path.join(reportDir, "prettier-report.txt");

// Ausführen von Prettier für Astro-Dateien im Check-Modus
exec(
  'npx prettier --check "src/**/*.astro" --plugin=prettier-plugin-astro',
  (error, stdout, stderr) => {
    const report = `
===============================
PRETTIER ASTRO PLUGIN TEST
===============================
Datum: ${new Date().toLocaleString()}

AUSGABE:
${stdout}

${stderr ? `FEHLER:\n${stderr}` : "Keine Fehler aufgetreten."}

${error ? `EXIT CODE: ${error.code}` : "EXIT CODE: 0 (Erfolg)"}
===============================
`;

    fs.writeFileSync(reportFile, report);

    console.log(`Test abgeschlossen. Report gespeichert in: ${reportFile}`);
    console.log(stdout);

    if (stderr) {
      console.error("Fehler:", stderr);
    }

    if (error) {
      console.error(`Exit Code: ${error.code}`);
    } else {
      console.log("Test erfolgreich abgeschlossen!");
    }
  },
);
