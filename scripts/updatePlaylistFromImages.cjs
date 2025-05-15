#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Directory containing category images
const categoryDir = path.join(__dirname, "../public/category");
// Path to playlist JSON file
const playlistPath = path.join(__dirname, "../src/json/en_playlist.json");

// Read existing playlist data
let playlistData = [];
try {
  const playlistContent = fs.readFileSync(playlistPath, "utf8");
  playlistData = JSON.parse(playlistContent);
} catch (error) {
  console.error("Error reading playlist file:", error);
  process.exit(1);
}

// Read all image files from category directory
try {
  const files = fs.readdirSync(categoryDir);
  const imageFiles = files.filter((file) => /\.(jpg|jpeg|png|gif)$/i.test(file));

  console.log(`Found ${imageFiles.length} image files`);

  // Create template entries for each image
  const newEntries = imageFiles.map((file) => {
    // Extract decade or category name from filename (removing extension)
    const category = path.basename(file, path.extname(file));

    return {
      headline: `${category} Music Collection`,
      imageUrl: `/category/${file}`,
      introSubline: `Discover the amazing sounds of ${category} music in this specially curated playlist.`,
      spotifyPlaylist: "",
      deezerPlaylist: "",
      appleMusicPlaylist: "",
    };
  });

  // Combine existing and new entries (you may want to modify this logic)
  // This approach adds new entries without duplicating existing image references
  const existingImageUrls = playlistData.map((entry) => entry.imageUrl);
  const uniqueNewEntries = newEntries.filter(
    (entry) => !existingImageUrls.includes(entry.imageUrl)
  );

  const updatedPlaylist = [...playlistData, ...uniqueNewEntries];

  // Write updated playlist back to file
  fs.writeFileSync(playlistPath, JSON.stringify(updatedPlaylist, null, 2));

  console.log(`Updated playlist with ${uniqueNewEntries.length} new entries`);
} catch (error) {
  console.error("Error processing image files:", error);
  process.exit(1);
}
