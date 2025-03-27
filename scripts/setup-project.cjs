/**
 * MelodyMind Project Setup Script
 *
 * This script orchestrates the full setup process for the MelodyMind project:
 * 1. Sets up the font system (local fonts or downloaded fonts)
 * 2. Extracts translations from TypeScript to JSON
 * 3. Generates social media preview (OG) images
 *
 * Use this script for initial setup or when rebuilding project assets.
 */

const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

// Script paths relative to this file
const SETUP_FONTS_SCRIPT = path.join(__dirname, "setup-fonts.cjs");
const COPY_LOCAL_FONTS_SCRIPT = path.join(__dirname, "copy-local-fonts.cjs");
const EXTRACT_TRANSLATIONS_SCRIPT = path.join(
  __dirname,
  "extract-translations.cjs",
);
const GENERATE_OG_IMAGES_SCRIPT = path.join(
  __dirname,
  "generate-og-images.cjs",
);

// Assets directory paths
const PROJECT_ROOT = path.resolve(__dirname, "..");
const ASSETS_FONTS_DIR = path.join(PROJECT_ROOT, "assets", "fonts");
const PUBLIC_FONTS_DIR = path.join(PROJECT_ROOT, "public", "fonts");
const OG_IMAGES_DIR = path.join(PROJECT_ROOT, "public", "og-images");

/**
 * Run a script and return a promise that resolves when it completes
 *
 * @param {string} scriptPath - Path to the script to run
 * @param {string} description - Description of the task for logging
 * @returns {Promise<boolean>} True if the script succeeded, false otherwise
 */
function runScript(scriptPath, description) {
  console.log(`\n🚀 ${description}...`);

  return new Promise((resolve) => {
    exec(`node "${scriptPath}"`, (error, stdout, stderr) => {
      if (stdout) console.log(stdout.trim());
      if (stderr) console.error(stderr.trim());

      if (error) {
        console.error(`❌ ${description} failed with exit code: ${error.code}`);
        resolve(false);
      } else {
        console.log(`✅ ${description} completed successfully`);
        resolve(true);
      }
    });
  });
}

/**
 * Create necessary directories if they don't exist
 */
function ensureDirectories() {
  const directories = [
    path.join(PROJECT_ROOT, "public"),
    PUBLIC_FONTS_DIR,
    OG_IMAGES_DIR,
  ];

  directories.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });
}

/**
 * Main setup function that runs all tasks in sequence
 */
async function setup() {
  console.log("🎵 MelodyMind Project Setup 🎵");
  console.log("================================");

  // Make sure required directories exist
  ensureDirectories();

  // Step 1: Set up fonts (try local fonts first, then download)
  let fontSetupSuccess = false;

  if (fs.existsSync(ASSETS_FONTS_DIR)) {
    fontSetupSuccess = await runScript(
      COPY_LOCAL_FONTS_SCRIPT,
      "Copying local fonts",
    );
  }

  // If local fonts failed or weren't available, try downloading
  if (!fontSetupSuccess) {
    fontSetupSuccess = await runScript(SETUP_FONTS_SCRIPT, "Setting up fonts");
  }

  if (!fontSetupSuccess) {
    console.warn(
      "⚠️ Font setup was not completely successful. Some features may not work as expected.",
    );
  }

  // Step 2: Extract translations
  const translationsSuccess = await runScript(
    EXTRACT_TRANSLATIONS_SCRIPT,
    "Extracting translations",
  );

  if (!translationsSuccess) {
    console.warn(
      "⚠️ Translation extraction failed. OG images may use fallback text.",
    );
  }

  // Step 3: Generate OG images
  const ogImagesSuccess = await runScript(
    GENERATE_OG_IMAGES_SCRIPT,
    "Generating OG images",
  );

  if (!ogImagesSuccess) {
    console.error("❌ OG image generation failed.");
  }

  // Summarize results
  console.log("\n🏁 Setup Process Summary:");
  console.log(`📂 Fonts: ${fontSetupSuccess ? "✅ Success" : "⚠️ Warning"}`);
  console.log(
    `🌐 Translations: ${translationsSuccess ? "✅ Success" : "⚠️ Warning"}`,
  );
  console.log(`🖼️ OG Images: ${ogImagesSuccess ? "✅ Success" : "⚠️ Warning"}`);

  if (fontSetupSuccess && translationsSuccess && ogImagesSuccess) {
    console.log(
      "\n✨ Setup completed successfully! The project is ready to use.",
    );
    return true;
  } else {
    console.warn(
      "\n⚠️ Setup completed with warnings. Some features may not work correctly.",
    );
    return false;
  }
}

// Run setup if this script is executed directly
if (require.main === module) {
  setup().then((success) => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = setup;
