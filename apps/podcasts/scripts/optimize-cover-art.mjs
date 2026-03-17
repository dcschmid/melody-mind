#!/usr/bin/env node
/**
 * Optimize podcast cover art to comply with Apple recommendations:
 * - Square 1400–3000 px (we keep 1400 if already)
 * - File size ideally < 512 KB
 *
 * Workflow:
 *  1. Read public/the-melody-mind-podcast.png (or .jpg/.webp if already converted)
 *  2. Resize to max 1400x1400 (no upscaling)
 *  3. Attempt JPEG and WebP encodes at descending quality until below threshold
 *  4. Prefer JPEG (wider compatibility for podcast directories); store as public/the-melody-mind-podcast.jpg
 *  5. Keep original as backup (rename to .original if size reduction succeeds)
 *  6. Print summary.
 *
 * Flags:
 *  --max-size=<bytes>   Target max size (default 524288 = 512 KB)
 *  --min-quality=<q>    Lowest quality to try (default 55)
 *  --start-quality=<q>  Starting quality (default 85)
 *  --webp               Also produce a WebP variant (public/the-melody-mind-podcast.webp)
 *  --force              Overwrite existing optimized files
 */
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const args = process.argv.slice(2);
function getArg(name, def){
  const a = args.find(x=> x.startsWith(`--${name}=`));
  return a ? a.split('=')[1] : def;
}
const maxSize = parseInt(getArg('max-size', '524288'), 10);
const startQuality = parseInt(getArg('start-quality', '85'), 10);
const minQuality = parseInt(getArg('min-quality', '55'), 10);
const produceWebp = args.includes('--webp');
const force = args.includes('--force');

const publicDir = path.join(process.cwd(), 'public');
const baseName = 'the-melody-mind-podcast';
const candidates = [
  path.join(publicDir, baseName + '.png'),
  path.join(publicDir, baseName + '.jpg'),
  path.join(publicDir, baseName + '.jpeg'),
  path.join(publicDir, baseName + '.webp')
];

function log(...m){ console.log('[opt-cover]', ...m); }

async function findSource(){
  for(const c of candidates){
    if(fs.existsSync(c)) return c;
  }
  return null;
}

async function optimize(){
  const source = await findSource();
  if(!source){
    log('No source cover art found. Expected one of:', candidates.map(c=>path.basename(c)).join(', '));
    process.exit(1);
  }
  const origStat = fs.statSync(source);
  log('Source:', path.basename(source), 'size=', origStat.size, 'bytes');
  const img = sharp(source, { failOnError:false });
  const meta = await img.metadata();
  log('Dimensions:', meta.width + 'x' + meta.height, 'format:', meta.format);

  // Ensure square max 1400, don't upscale
  const targetSize = 1400; // Could make flag later
  const resized = img.resize({ width: Math.min(meta.width || targetSize, targetSize), height: Math.min(meta.height || targetSize, targetSize), fit:'cover' });

  // Try JPEG qualities descending until under maxSize
  let quality = startQuality;
  let lastBuffer = null;
  let chosenQuality = null;
  while(quality >= minQuality){
    const buf = await resized.clone().jpeg({ quality, progressive:true, chromaSubsampling:'4:2:0' }).toBuffer();
    log(`Try JPEG q=${quality}: ${buf.length} bytes`);
    lastBuffer = buf;
    if(buf.length <= maxSize){
      chosenQuality = quality;
      break;
    }
    quality -= 5;
  }
  if(!chosenQuality){
    log('Could not reach target size with JPEG down to quality', minQuality, '=> will keep best effort (last attempt).');
    chosenQuality = quality + 5; // previous step's quality
  }

  const outJpg = path.join(publicDir, baseName + '.jpg');
  if(fs.existsSync(outJpg) && !force){
    log('Output JPEG exists. Use --force to overwrite. Aborting.');
    return;
  }
  await fsp.writeFile(outJpg, lastBuffer);
  log('Written', path.basename(outJpg), 'size=', lastBuffer.length, 'bytes (quality used ~', chosenQuality, ')');

  if(lastBuffer.length <= maxSize){
    // Backup original if different path
    if(source !== outJpg){
      const backup = source + '.original';
      if(!fs.existsSync(backup)){
        await fsp.rename(source, backup);
        log('Renamed original to', path.basename(backup));
      }
    }
  } else {
    log('Result still exceeds target size; consider manual artwork refinement (simplify gradients, reduce detail).');
  }

  if(produceWebp){
    let wq = Math.min(startQuality, 82);
    const webpBuf = await resized.clone().webp({ quality: wq }).toBuffer();
    const outWebp = path.join(publicDir, baseName + '.webp');
    if(!fs.existsSync(outWebp) || force){
      await fsp.writeFile(outWebp, webpBuf);
      log('Written WebP', path.basename(outWebp), 'size=', webpBuf.length, 'bytes');
    } else {
      log('WebP exists. Skipped (use --force to overwrite).');
    }
  }

  log('Optimization complete.');
}

optimize().catch(e=>{ log('Error:', e); process.exit(1); });
