/**
 * Local Font Copy Script
 *
 * This script provides a fallback mechanism for font setup by copying locally stored fonts
 * from the assets directory to the public directory, making them available for OG images.
 *
 * This is especially useful when running in environments where external font downloads might fail.
 */

const fs = require("fs");
const path = require("path");

// Define directory paths
const PROJECT_ROOT = path.resolve(__dirname, "..");
const LOCAL_FONTS_DIR = path.join(PROJECT_ROOT, "assets", "fonts");
const PUBLIC_FONTS_DIR = path.join(PROJECT_ROOT, "public", "fonts");

/**
 * Copy local font files to the public fonts directory
 *
 * @returns {number} Number of font files copied
 */
function copyLocalFonts() {
  console.log("📋 Checking for local font files...");

  // Ensure directories exist
  if (!fs.existsSync(PUBLIC_FONTS_DIR)) {
    fs.mkdirSync(PUBLIC_FONTS_DIR, { recursive: true });
    console.log(`Created public fonts directory: ${PUBLIC_FONTS_DIR}`);
  }

  if (!fs.existsSync(LOCAL_FONTS_DIR)) {
    fs.mkdirSync(LOCAL_FONTS_DIR, { recursive: true });
    console.log(`Created ${LOCAL_FONTS_DIR} - please place your font files in this directory`);
    return 0;
  }

  // Get list of font files
  const fontFiles = fs
    .readdirSync(LOCAL_FONTS_DIR)
    .filter(
      (file) =>
        file.endsWith(".ttf") ||
        file.endsWith(".otf") ||
        file.endsWith(".woff") ||
        file.endsWith(".woff2")
    );

  if (fontFiles.length === 0) {
    console.log("No font files found in assets/fonts directory. Please add your font files there.");
    return 0;
  }

  // Copy each font file to the public directory
  let copiedCount = 0;
  for (const fontFile of fontFiles) {
    const sourcePath = path.join(LOCAL_FONTS_DIR, fontFile);
    const destPath = path.join(PUBLIC_FONTS_DIR, fontFile);

    try {
      fs.copyFileSync(sourcePath, destPath);
      console.log(`Copied ${fontFile} to public/fonts directory`);
      copiedCount++;
    } catch (error) {
      console.error(`Error copying ${fontFile}: ${error.message}`);
    }
  }

  console.log(`✅ Successfully copied ${copiedCount} font files`);
  return copiedCount;
}

// Run the script if executed directly
if (require.main === module) {
  const result = copyLocalFonts();
  process.exit(result > 0 ? 0 : 1);
} else {
  // Export for use in other scripts
  module.exports = copyLocalFonts;
}
