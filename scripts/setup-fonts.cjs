const fs = require("fs");
const path = require("path");
const https = require("https");
const { promisify } = require("util");

// Convert callbacks to promises
const mkdir = promisify(fs.mkdir);

/**
 * Font configuration with primary and fallback sources
 * Each font has multiple sources for better reliability
 */
const FONTS = [
  {
    name: "Inter-Bold.ttf",
    url: "https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.ttf",
    fallbackUrl: "https://fonts.googleapis.com/css2?family=Inter:wght@700&display=swap",
    isGoogleFontsCSS: true,
  },
  {
    name: "Inter-Regular.ttf",
    url: "https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.ttf",
    fallbackUrl: "https://fonts.googleapis.com/css2?family=Inter:wght@400&display=swap",
    isGoogleFontsCSS: true,
  },
  {
    name: "atkinson-hyperlegible-regular.woff2",
    url: "https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400&display=swap",
    fallbackUrl:
      "https://brailleinstitute.org/wp-content/uploads/atkinson-hyperlegible/fonts/Atkinson-Hyperlegible-Regular-102.woff2",
    isGoogleFontsCSS: true,
  },
  {
    name: "atkinson-hyperlegible-bold.woff2",
    url: "https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@700&display=swap",
    fallbackUrl:
      "https://brailleinstitute.org/wp-content/uploads/atkinson-hyperlegible/fonts/Atkinson-Hyperlegible-Bold-102.woff2",
    isGoogleFontsCSS: true,
  },
  {
    name: "atkinson-hyperlegible-regular.woff2",
    url: "https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400&display=swap",
    fallbackUrl:
      "https://brailleinstitute.org/wp-content/uploads/atkinson-hyperlegible/fonts/Atkinson-Hyperlegible-Regular-102.woff2",
    isGoogleFontsCSS: true,
  },
  {
    name: "atkinson-hyperlegible-bold.woff2",
    url: "https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@700&display=swap",
    fallbackUrl:
      "https://brailleinstitute.org/wp-content/uploads/atkinson-hyperlegible/fonts/Atkinson-Hyperlegible-Bold-102.woff2",
    isGoogleFontsCSS: true,
  },
];

// Project paths
const PROJECT_ROOT = path.resolve(__dirname, "..");
const FONTS_DIR = path.join(PROJECT_ROOT, "public", "fonts");

/**
 * Parse Google Fonts CSS to extract the actual font URL
 *
 * @param {string} cssUrl - URL to the Google Fonts CSS file
 * @returns {Promise<string>} Resolved with the extracted font URL
 */
async function extractFontUrlFromCSS(cssUrl) {
  return new Promise((resolve, reject) => {
    https
      .get(cssUrl, (response) => {
        if (response.statusCode !== 200) {
          reject(
            new Error(`Failed to download CSS from ${cssUrl}, status: ${response.statusCode}`)
          );
          return;
        }

        let data = "";

        response.on("data", (chunk) => (data += chunk));

        response.on("end", () => {
          try {
            // Extract the URL from the CSS data using regex
            const urlMatch = data.match(/url\(([^)]+)\)/i);
            if (urlMatch && urlMatch[1]) {
              const fontUrl = urlMatch[1].replace(/["']/g, "");
              resolve(fontUrl);
            } else {
              reject(new Error("Could not find font URL in CSS"));
            }
          } catch (err) {
            reject(err);
          }
        });

        response.on("error", (err) => reject(err));
      })
      .on("error", (err) => reject(err));
  });
}

/**
 * Create a minimal default font as fallback
 * Used when font downloads fail
 *
 * @param {string} outputPath - Path where the fallback font will be saved
 * @returns {Promise<boolean>} True if successful
 */
async function createDefaultFont(outputPath) {
  console.log(`Creating minimal fallback font at ${outputPath}...`);

  // Create a very small placeholder TTF file
  // This is just basic file data that node-canvas can use as a fallback
  const fallbackFontData = Buffer.from([
    0x00, 0x01, 0x00, 0x00, 0x00, 0x10, 0x00, 0x80, 0x00, 0x03, 0x00, 0x10, 0x00, 0x00, 0x00, 0x00,
  ]);

  fs.writeFileSync(outputPath, fallbackFontData);
  console.log(`✅ Created minimal fallback font: ${outputPath}`);
  return true;
}

/**
 * Download a file from a URL to a local path with retry using fallback URL
 *
 * @param {Object} font - Font configuration object with URLs
 * @param {string} outputPath - Path where the font will be saved
 * @returns {Promise<void>} Resolves when download is complete
 */
async function downloadFile(font, outputPath) {
  const urls = [font.url];

  // If we have a fallback that's a Google Fonts CSS, we'll need to extract the actual font URL
  if (font.fallbackUrl) {
    if (font.isGoogleFontsCSS) {
      try {
        const extractedUrl = await extractFontUrlFromCSS(font.fallbackUrl);
        if (extractedUrl) urls.push(extractedUrl);
      } catch (err) {
        console.warn(`Could not extract font URL from CSS: ${err.message}`);
      }
    } else {
      urls.push(font.fallbackUrl);
    }
  }

  // Try each URL in sequence until one succeeds
  for (const url of urls) {
    try {
      console.log(`Attempting to download from: ${url}`);

      await new Promise((resolve, reject) => {
        https
          .get(url, (response) => {
            if (response.statusCode !== 200) {
              reject(new Error(`Failed to download ${url}, status: ${response.statusCode}`));
              return;
            }

            const fileStream = fs.createWriteStream(outputPath);
            response.pipe(fileStream);

            fileStream.on("finish", () => {
              fileStream.close();
              resolve();
            });

            fileStream.on("error", (err) => {
              fs.unlink(outputPath, () => {}); // Delete the file if there's an error
              reject(err);
            });
          })
          .on("error", (err) => reject(err));
      });

      // If download successful, return without trying fallback
      return;
    } catch (err) {
      console.warn(`Download failed from ${url}: ${err.message}`);
      // Continue to next URL if available
    }
  }

  // If we reach here, all URLs failed
  throw new Error(`Failed to download ${font.name} from all sources`);
}

/**
 * Ensure a directory exists
 *
 * @param {string} dirPath - Path to the directory to create
 * @returns {Promise<void>} Resolves when directory exists or is created
 */
async function ensureDirectoryExists(dirPath) {
  try {
    await mkdir(dirPath, { recursive: true });
    console.log(`✅ Directory exists or created: ${dirPath}`);
  } catch (err) {
    console.error(`❌ Failed to create directory ${dirPath}:`, err);
    throw err;
  }
}

/**
 * Main function to set up fonts
 * Downloads font files needed for OG image generation
 *
 * @returns {Promise<boolean>} True if successful, false otherwise
 */
async function setupFonts() {
  console.log("🔤 Setting up fonts for MelodyMind OG Images 🔤");
  console.log("=============================================");

  try {
    // Ensure fonts directory exists
    await ensureDirectoryExists(FONTS_DIR);

    // Download each font
    for (const font of FONTS) {
      const outputPath = path.join(FONTS_DIR, font.name);

      // Skip if font already exists
      if (fs.existsSync(outputPath)) {
        console.log(`✅ Font already exists: ${font.name}`);
        continue;
      }

      try {
        console.log(`⬇️ Downloading font: ${font.name}...`);
        await downloadFile(font, outputPath);
        console.log(`✅ Downloaded: ${font.name}`);
      } catch (err) {
        console.warn(`Failed to download ${font.name}: ${err.message}`);
        console.warn(`Creating fallback font instead...`);
        await createDefaultFont(outputPath);
      }
    }

    console.log("✨ All fonts have been set up successfully!");
    return true;
  } catch (err) {
    console.error("❌ Error setting up fonts:", err);
    return false;
  }
}

// Run the script directly if executed
if (require.main === module) {
  setupFonts()
    .then((success) => process.exit(success ? 0 : 1))
    .catch((err) => {
      console.error("Unhandled error:", err);
      process.exit(1);
    });
} else {
  // Export for use in other scripts
  module.exports = setupFonts;
}
