#!/usr/bin/env node

import { readdir, rename } from "fs/promises";
import { join } from "path";

/**
 * Recursively renames all JSON files in the genres folder by removing the 'top200_' prefix
 */
async function renameGenreFiles() {
  const genresPath = join(process.cwd(), "public", "json", "genres");

  try {
    // Get all language folders
    const languageFolders = await readdir(genresPath);

    let totalRenamed = 0;

    for (const langFolder of languageFolders) {
      const langPath = join(genresPath, langFolder);

      try {
        // Get all files in the language folder
        const files = await readdir(langPath);

        // Filter for JSON files that start with 'top200_'
        const filesToRename = files.filter(
          (file) => file.endsWith(".json") && file.startsWith("top200_")
        );

        console.log(`\n📁 Processing folder: ${langFolder}`);
        console.log(`   Found ${filesToRename.length} files to rename`);

        // Process each file
        const renameResults = await processFiles(filesToRename, langPath);
        totalRenamed += renameResults.successCount;

        if (filesToRename.length === 0) {
          console.log(`   ℹ️  No files with 'top200_' prefix found`);
        }
      } catch (error) {
        console.error(`❌ Error processing folder ${langFolder}:`, error.message);
      }
    }

    console.log(`\n🎉 Completed! Total files renamed: ${totalRenamed}`);
  } catch (error) {
    console.error("❌ Error accessing genres folder:", error.message);
    console.error("Make sure you are running this script from the project root directory.");
    process.exit(1);
  }
}

/**
 * Process files for renaming to avoid nested depth issues
 * @param {string[]} filesToRename - Array of filenames to rename
 * @param {string} langPath - Path to the language folder
 * @returns {Promise<{successCount: number}>} Results of the operation
 */
async function processFiles(filesToRename, langPath) {
  let successCount = 0;

  for (const oldFileName of filesToRename) {
    const newFileName = oldFileName.replace("top200_", "");
    const oldFilePath = join(langPath, oldFileName);
    const newFilePath = join(langPath, newFileName);

    try {
      await rename(oldFilePath, newFilePath);
      console.log(`   ✅ ${oldFileName} → ${newFileName}`);
      successCount++;
    } catch (error) {
      console.error(`   ❌ Failed to rename ${oldFileName}:`, error.message);
    }
  }

  return { successCount };
}

// Run the script
renameGenreFiles().catch(console.error);
