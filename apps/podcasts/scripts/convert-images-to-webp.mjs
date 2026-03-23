#!/usr/bin/env node
/**
 * Convert all JPG images to WebP format for better performance.
 * Uses Sharp for high-quality image conversion.
 */
import { readdir, mkdir } from 'node:fs/promises';
import { join, parse } from 'node:path';
import sharp from 'sharp';

const INPUT_DIR = './public/images';
const OUTPUT_DIR = './public/images';

const QUALITY = 85; // WebP quality (0-100)

async function convertImages() {
  console.log('🖼️  Converting images to WebP...\n');

  try {
    const files = await readdir(INPUT_DIR);
    const jpgFiles = files.filter((file) => /\.(jpg|jpeg)$/i.test(file));

    if (jpgFiles.length === 0) {
      console.log('No JPG files found to convert.');
      return;
    }

    console.log(`Found ${jpgFiles.length} JPG files to convert.\n`);

    let converted = 0;
    let skipped = 0;
    let totalSaved = 0;

    for (const file of jpgFiles) {
      const inputPath = join(INPUT_DIR, file);
      const { name } = parse(file);
      const outputPath = join(OUTPUT_DIR, `${name}.webp`);

      try {
        const inputStats = await sharp(inputPath).metadata();
        const inputSize = (await sharp(inputPath).toBuffer()).length;

        await sharp(inputPath)
          .webp({
            quality: QUALITY,
            effort: 6, // Balance between speed and compression
          })
          .toFile(outputPath);

        const outputStats = await sharp(outputPath).metadata();
        const outputSize = (await sharp(outputPath).toBuffer()).length;
        const saved = inputSize - outputSize;
        const savedPercent = ((saved / inputSize) * 100).toFixed(1);

        totalSaved += saved;
        converted++;

        console.log(`✅ ${file}`);
        console.log(
          `   ${inputStats.width}x${inputStats.height} | ${(inputSize / 1024).toFixed(1)}KB → ${(outputSize / 1024).toFixed(1)}KB (${savedPercent}% saved)\n`,
        );
      } catch (error) {
        console.error(`❌ Failed to convert ${file}: ${error.message}`);
        skipped++;
      }
    }

    console.log('\n📊 Summary:');
    console.log(`   Converted: ${converted} files`);
    console.log(`   Skipped: ${skipped} files`);
    console.log(`   Total saved: ${(totalSaved / 1024).toFixed(1)}KB`);
    console.log('\n✨ Done!');
  } catch (error) {
    console.error('Error reading directory:', error.message);
    process.exit(1);
  }
}

convertImages();
