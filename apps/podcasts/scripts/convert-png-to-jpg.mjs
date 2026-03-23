#!/usr/bin/env node
/**
 * Converts all PNG images under public/images (recursively) into optimized JPGs and deletes the PNG originals.
 *
 * Remaining flags:
 *  - --force        Overwrite existing .jpg files.
 *  - --quality=<n>  JPEG quality (default 82, min 40, max 95; recommended 60-90).
 *  - --move-square  Moves files whose basename ends with "-square" into public/images/square and drops the suffix.
 *
 * Behavior:
 *  - Progressive JPEGs, chromaSubsampling 4:2:0.
 *  - PNG is always removed after successful conversion.
 *  - Existing JPGs are skipped unless --force.
 *  - Summary at the end (converted, skipped, errors, size saved).
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { existsSync, statSync } from 'node:fs';
import sharp from 'sharp';

// Root directories
const imagesRoot = path.join(process.cwd(), 'public', 'images');
const squareDir = path.join(process.cwd(), 'public', 'square');

// Flags & args (reduced set)
const args = process.argv.slice(2);
const force = args.includes('--force');
const moveSquare = args.includes('--move-square');
const qualityArg = args.find(a => a.startsWith('--quality='));
const quality = qualityArg ? Math.max(40, Math.min(95, parseInt(qualityArg.split('=')[1],10))) : 82;

function log(...m){ console.log('[png2jpg]', ...m); }

async function collectPngFiles(dir){
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for(const e of entries){
    const full = path.join(dir, e.name);
    if(e.isDirectory()){
      out.push(...await collectPngFiles(full));
    } else if(/\.png$/i.test(e.name)) {
      out.push(full);
    }
  }
  return out;
}

async function convertFile(pngPath){
  const dir = path.dirname(pngPath);
  const base = path.basename(pngPath, path.extname(pngPath));
  let jpgPath = path.join(dir, base + '.jpg');
  if(!force && existsSync(jpgPath)){
    return { skipped:true, reason:'jpg already exists' };
  }
  try {
    const inputSize = statSync(pngPath).size;
    const jpgBuffer = await sharp(pngPath).jpeg({ quality, progressive:true, chromaSubsampling:'4:2:0' }).toBuffer();
    await fs.writeFile(jpgPath, jpgBuffer);
    // Optionally move square derivatives (basename containing '-square') into squareDir with cleaned name
    if(moveSquare && base.includes('-square')){
      const cleanBase = base.replace(/-square$/, '');
      const targetPath = path.join(squareDir, cleanBase + '.jpg');
      if(!existsSync(squareDir)) await fs.mkdir(squareDir, { recursive:true });
      if(existsSync(targetPath) && !force){
        log('Exists, skip move (use --force):', targetPath);
      } else {
        await fs.rename(jpgPath, targetPath);
        jpgPath = targetPath;
      }
    }
    await fs.unlink(pngPath);
    const deleted = true;
    const outputSize = jpgBuffer?.length ?? 0;
    return { converted:true, base, pngPath, jpgPath, inputSize, outputSize, saved: inputSize - outputSize, deleted };
  } catch(e){
    return { error:true, pngPath, message:e.message };
  }
}

async function main(){
  if(!existsSync(imagesRoot)){
    log('Images directory not found:', imagesRoot);
    process.exitCode = 1;
    return;
  }
  // Gather PNGs from images root AND square dir (if exists) so repeated runs can re-process
  const files = [
    ...await collectPngFiles(imagesRoot),
    ...(existsSync(squareDir) ? await collectPngFiles(squareDir) : [])
  ];
  log(`Found ${files.length} PNG file(s). Starting conversion (quality=${quality})` + (moveSquare ? ' (move-square enabled)' : '') + ' ...');
  const results = [];
  for(const f of files){
    results.push(await convertFile(f));
  }
  const converted = results.filter(r=>r.converted);
  const skipped = results.filter(r=>r.skipped);
  const errors = results.filter(r=>r.error);
  const totalSaved = converted.reduce((a,r)=> a + (r.saved || 0), 0);
  log('--- Summary ---');
  log(`Converted: ${converted.length}`);
  log(`Skipped:   ${skipped.length}`);
  log(`Errors:    ${errors.length}`);
  log(`Size saved: ${(totalSaved/1024).toFixed(1)} KiB`);
  if(errors.length){
    errors.forEach(e=>log('Error:', e.pngPath, e.message));
    process.exitCode = 1;
  }
}

main();
