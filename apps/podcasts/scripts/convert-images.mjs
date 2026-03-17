#!/usr/bin/env node
/**
 * Convert and optimize images for web (AVIF, WebP) with JPG fallback.
 * - Resizes to max 1024px width (maintains aspect ratio)
 * - PNG → JPG (for photos)
 * - JPG → AVIF (smallest, modern browsers)
 * - JPG → WebP (good compression, wide support)
 *
 * Usage: npm run convert:images
 */
import { readdir, unlink } from 'node:fs/promises';
import { join, parse, extname } from 'node:path';
import sharp from 'sharp';

const INPUT_DIR = './public/images';
const MAX_WIDTH = 1024;

const QUALITY = {
  avif: 60, // AVIF can use lower quality for same visual result
  webp: 75, // WebP needs slightly higher quality
  jpg: 80, // JPG fallback quality
};

async function convertImages() {
  console.log('🖼️  Converting images to web-optimized AVIF, WebP (max 1024px)...\n');

  try {
    const files = await readdir(INPUT_DIR);
    const imageFiles = files.filter((file) => /\.(jpg|jpeg|png)$/i.test(file));

    if (imageFiles.length === 0) {
      console.log('No image files found to convert.');
      return;
    }

    console.log(`Found ${imageFiles.length} image files to process.\n`);
    console.log(
      `Settings: Max width: ${MAX_WIDTH}px | AVIF: ${QUALITY.avif}% | WebP: ${QUALITY.webp}% | JPG: ${QUALITY.jpg}%\n`,
    );

    let converted = 0;
    let errors = 0;
    let totalSaved = { avif: 0, webp: 0 };
    const results = [];

    for (const file of imageFiles) {
      const inputPath = join(INPUT_DIR, file);
      const { name, ext } = parse(file);
      const isPng = ext.toLowerCase() === '.png';

      try {
        // Load and resize image in one pipeline
        let pipeline = sharp(inputPath).resize({
          width: MAX_WIDTH,
          withoutEnlargement: true, // Don't upscale smaller images
        });

        const metadata = await pipeline.clone().metadata();
        const originalSize = (await sharp(inputPath).toBuffer()).length;

        // If PNG, first convert to JPG (photos work better as JPG)
        if (isPng) {
          const jpgPath = join(INPUT_DIR, `${name}.jpg`);
          await pipeline.clone().jpeg({ quality: QUALITY.jpg, mozjpeg: true }).toFile(jpgPath);
          console.log(`📷 Converted PNG → JPG: ${file}`);
        }

        // Generate AVIF (smallest format)
        const avifPath = join(INPUT_DIR, `${name}.avif`);
        await pipeline
          .clone()
          .avif({
            quality: QUALITY.avif,
            effort: 6,
          })
          .toFile(avifPath);

        const avifSize = (await sharp(avifPath).toBuffer()).length;
        const avifSaved = originalSize - avifSize;
        totalSaved.avif += avifSaved;

        // Generate WebP (wide browser support)
        const webpPath = join(INPUT_DIR, `${name}.webp`);
        await pipeline
          .clone()
          .webp({
            quality: QUALITY.webp,
            effort: 6,
          })
          .toFile(webpPath);

        const webpSize = (await sharp(webpPath).toBuffer()).length;
        const webpSaved = originalSize - webpSize;
        totalSaved.webp += webpSaved;

        // Update original JPG to optimized version
        const jpgPath = join(INPUT_DIR, `${name}.jpg`);
        await pipeline.clone().jpeg({ quality: QUALITY.jpg, mozjpeg: true }).toFile(jpgPath);

        const jpgSize = (await sharp(jpgPath).toBuffer()).length;

        converted++;

        const newDimensions =
          metadata.width > MAX_WIDTH
            ? `${MAX_WIDTH}x${Math.round((metadata.height * MAX_WIDTH) / metadata.width)}`
            : `${metadata.width}x${metadata.height}`;

        console.log(`✅ ${file}`);
        console.log(`   ${newDimensions} (was ${metadata.width}x${metadata.height})`);
        console.log(`   Original: ${(originalSize / 1024).toFixed(1)}KB`);
        console.log(
          `   AVIF:     ${(avifSize / 1024).toFixed(1)}KB (${((avifSaved / originalSize) * 100).toFixed(1)}% saved)`,
        );
        console.log(
          `   WebP:     ${(webpSize / 1024).toFixed(1)}KB (${((webpSaved / originalSize) * 100).toFixed(1)}% saved)`,
        );
        console.log(`   JPG:      ${(jpgSize / 1024).toFixed(1)}KB\n`);
      } catch (error) {
        console.error(`❌ Failed to convert ${file}: ${error.message}`);
        errors++;
      }
    }

    console.log('\n📊 Summary:');
    console.log(`   Processed: ${converted} files`);
    console.log(`   Errors: ${errors} files`);
    console.log(`   Total AVIF saved: ${(totalSaved.avif / 1024).toFixed(1)}KB`);
    console.log(`   Total WebP saved: ${(totalSaved.webp / 1024).toFixed(1)}KB`);
    console.log(`   Combined saved: ${((totalSaved.avif + totalSaved.webp) / 1024).toFixed(1)}KB`);
    console.log('\n✨ Done!');
  } catch (error) {
    console.error('Error reading directory:', error.message);
    process.exit(1);
  }
}

convertImages();
