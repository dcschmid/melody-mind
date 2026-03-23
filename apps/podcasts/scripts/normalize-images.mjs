#!/usr/bin/env node
/**
 * Normalize podcast episode images: ensure square thumbnails.
 *
 * For each image reference in the podcast JSON files:
 *  - Finds the local file at public/images/<imageUrl>.jpg|.png
 *  - Creates a centered square canvas copy when the source is not square
 *  - Writes the result to public/images/<imageUrl>-square.jpg (JPEG 85%)
 *  - Optionally replaces the original when --replace is used
 *
 * Flags:
 *  --filter=<lang>: Only process selected language files
 *  --dry-run: Preview changes without writing files
 *  --replace: Replace the original file with the square version and keep a .orig backup
 *  --background=<hex|transparent>: Background color (default: #ffffff)
 *  --mode=<contain|crop>: Creation strategy (default: contain)
 */
import fs from 'node:fs/promises';
import { existsSync, renameSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const dataDir = path.join(root, 'src', 'data', 'podcasts');
const imagesDir = path.join(root, 'public', 'images');

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const replace = args.includes('--replace');
const filterArg = args.find(a => a.startsWith('--filter='));
const filter = filterArg ? filterArg.split('=')[1].split(',').map(s => s.trim()) : null;
const bgArg = args.find(a => a.startsWith('--background='));
const background = bgArg ? bgArg.split('=')[1] : '#ffffff';
const modeArg = args.find(a => a.startsWith('--mode='));
const mode = modeArg ? modeArg.split('=')[1] : 'contain';

function log(...m){ console.log('[normalize-images]', ...m); }

async function listPodcastFiles(){
  const entries = await fs.readdir(dataDir);
  return entries.filter(f=>f.endsWith('.json'));
}

function resolveImageBase(imageUrl){
  if(/^https?:/i.test(imageUrl)) return null; // Remote image, skip
  const candidates = [
    path.join(imagesDir, imageUrl + '.jpg'),
    path.join(imagesDir, imageUrl + '.png'),
    path.join(imagesDir, imageUrl)
  ];
  return candidates.find(c => existsSync(c)) || null;
}

async function processImage(filePath, imageUrl){
  const base = resolveImageBase(imageUrl);
  if(!base){
    log('Image missing', imageUrl);
    return { skipped: true };
  }
  const img = sharp(base);
  const meta = await img.metadata();
  if(!meta.width || !meta.height){
    log('No dimension', base);
    return { skipped: true };
  }
  if(meta.width === meta.height){
    log('Already square', path.basename(base));
    return { square: true };
  }
  const size = Math.max(meta.width, meta.height);
  // Background color
  let bg;
  if(background === 'transparent') bg = { r:0,g:0,b:0, alpha:0 }; else {
    const hex = background.replace('#','');
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    bg = { r, g, b, alpha: 1 };
  }
  const dest = base.replace(/(\.jpg|\.png)?$/, '-square.jpg');
  log('Create square', path.basename(base), '=>', path.basename(dest));
  if(dryRun) return { wouldCreate: dest };
  let pipeline = img;
  if(mode === 'crop') {
    // Center crop after scaling to the target size
    pipeline = pipeline.resize(size, size, { fit: 'cover', position: 'centre' });
  } else {
    pipeline = pipeline.resize({ width: size, height: size, fit: 'contain', background: bg });
  }
  const buffer = await pipeline.jpeg({ quality: 85 }).toBuffer();
  await fs.writeFile(dest, buffer);
  if(replace){
    const backup = base + '.orig';
    if(!existsSync(backup)) renameSync(base, backup);
    await fs.rename(dest, base);
    log('Replaced original (backup .orig)');
    return { replaced: true };
  }
  return { created: dest };
}

async function processFile(jsonFile){
  const lang = jsonFile.replace(/\.json$/,'');
  if(filter && !filter.includes(lang)) return;
  const full = path.join(dataDir, jsonFile);
  const raw = await fs.readFile(full,'utf8');
  let data;
  try { data = JSON.parse(raw); } catch(e){ log('JSON parse error', jsonFile); return; }
  if(!Array.isArray(data.podcasts)) return;
  let changed = 0, skipped=0, already=0;
  for(const p of data.podcasts){
    if(!p.imageUrl) continue;
    const res = await processImage(full, p.imageUrl);
    if(res?.created || res?.replaced) changed++;
    if(res?.skipped) skipped++;
    if(res?.square) already++;
  }
  log(`Summary ${jsonFile}: changed=${changed} skipped=${skipped} alreadySquare=${already}`);
}

async function main(){
  log('Start (dry-run:', dryRun, 'replace:', replace, 'bg:', background, ')');
  const files = await listPodcastFiles();
  for(const f of files){ await processFile(f); }
  log('Done');
}

main().catch(e=>{ console.error(e); process.exitCode=1; });
