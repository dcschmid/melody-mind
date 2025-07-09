#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read both playlist files
const nlFilePath = path.join(__dirname, '../public/json/playlist/nl_playlist.json');
const enFilePath = path.join(__dirname, '../public/json/playlist/en_playlist.json');

const nlData = JSON.parse(fs.readFileSync(nlFilePath, 'utf8'));
const enData = JSON.parse(fs.readFileSync(enFilePath, 'utf8'));

console.log(`Dutch entries: ${nlData.length}`);
console.log(`English entries: ${enData.length}`);

// Get all imageUrls from English version
const enImageUrls = new Set(enData.map(entry => entry.imageUrl));

// Remove duplicates based on imageUrl and keep only entries that exist in English version
const seen = new Set();
const uniqueEntries = nlData.filter(entry => {
  // Skip if imageUrl is not in English version
  if (!enImageUrls.has(entry.imageUrl)) {
    console.log(`Skipping entry not in English version: ${entry.headline}`);
    return false;
  }
  
  // Skip if we've seen this imageUrl before (duplicate)
  if (seen.has(entry.imageUrl)) {
    console.log(`Removing duplicate: ${entry.headline}`);
    return false;
  }
  
  seen.add(entry.imageUrl);
  return true;
});

console.log(`Unique entries after cleaning: ${uniqueEntries.length}`);
console.log(`Removed ${nlData.length - uniqueEntries.length} duplicates/irrelevant entries`);

// Write the cleaned data back to the file
fs.writeFileSync(nlFilePath, JSON.stringify(uniqueEntries, null, 2), 'utf8');

console.log('Duplicates removed successfully!');
