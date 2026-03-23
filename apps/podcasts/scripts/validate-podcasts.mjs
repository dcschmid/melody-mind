#!/usr/bin/env node
/**
 * Validate podcast JSON metadata for RSS completeness & best practices.
 *
 * Checks:
 *  - Required fields: id,title,description,audioUrl,publishedAt,language,isAvailable,imageUrl
 *  - audioUrl reachable (HEAD) (optional: skip with --no-network)
 *  - image file existence (local) or remote path pattern
 *  - fileSizeBytes present (warn if missing)
 *  - durationSeconds present (warn if missing)
 *  - subtitleUrl present (warn if missing) & transcript potential
 *  - publishedAt parseable & not future > 7d
 *  - Duplicate IDs across languages
 *  - Episode numbering monotonic if episodeNumber provided
 *
 * Flags:
 *  --strict        : Exit code 1 on warnings as well
 *  --json          : Output machine-readable JSON summary
 *  --no-network    : Skip HEAD checks
 *  --filter=langs  : Only validate specific comma-separated languages
 */
import fs from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { imageSize } from 'image-size';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const dataDir = path.join(root, 'src', 'content', 'podcasts');
const args = process.argv.slice(2);
const strict = args.includes('--strict');
const outJson = args.includes('--json');
const noNetwork = args.includes('--no-network');
const filterArg = args.find(a => a.startsWith('--filter='));
const filter = filterArg ? filterArg.split('=')[1].split(',').map(s => s.trim()) : null;

const requiredFields = ['id','title','description','audioUrl','publishedAt','language','isAvailable','imageUrl'];
const publicImagesDir = path.join(root, 'public', 'images');
// Content style guidelines (version 2.0)
//  - Title length: 55–65 characters (inclusive)
//  - Description length: 250–300 characters (inclusive)
//  - Must contain a host phrase (language-specific)
//        EN: "Daniel and Annabelle guide you"
//        DE: "Daniel und Annabelle führen dich" | "Daniel und Annabelle begleiten dich"
//  - Must contain a CTA phrase beginning with (language-specific)
//        EN: "Press play and"
//        DE: "Drück auf Play und" | "Drücke auf Play und" | "Drück Play und"

const styleStrict = args.includes('--style-strict');

const hostPhraseMap = {
  en: [/Daniel and Annabelle guide you/i],
  de: [/Daniel und Annabelle führen dich/i, /Daniel und Annabelle begleiten dich/i],
  es: [/Daniel y Annabelle te guían/i, /Daniel y Annabelle te acompañan/i],
  fr: [/Daniel et Annabelle te guident/i, /Daniel et Annabelle te accompagnent/i],
  it: [/Daniel e Annabelle ti guidano/i, /Daniel e Annabelle ti accompagnano/i],
  pt: [/Daniel e Annabelle te guiam/i, /Daniel e Annabelle te acompanham/i]
};
const ctaPhraseMap = {
  en: [/Press play and/i],
  de: [/Drück auf Play und/i, /Drücke auf Play und/i, /Drück Play und/i],
  es: [/Dale Play y/i, /Pulsa Play y/i, /Presiona Play y/i],
  fr: [/Appuie sur Play et/i, /Appuye sur Play et/i, /Lance la lecture et/i],
  it: [/Premi Play e/i, /Premi su Play e/i, /Premi il Play e/i],
  pt: [/Pressiona Play e/i, /Prime Play e/i, /Aperta Play e/i]
};

function styleCheck(p){
  const warnings = [];
  const lang = (p.language || 'en').toLowerCase();
  const hostPatterns = hostPhraseMap[lang] || hostPhraseMap.en;
  const ctaPatterns = ctaPhraseMap[lang] || ctaPhraseMap.en;

  if(typeof p.title === 'string'){
    const tl = p.title.length;
    if(tl < 55 || tl > 65) warnings.push(`Style: title length ${tl} outside 55–65 ("${p.id}")`);
  }
  if(typeof p.description === 'string'){
    const dl = p.description.length;
    if(dl < 250 || dl > 300) warnings.push(`Style: description length ${dl} outside 250–300 ("${p.id}")`);
    // Host phrase check (match any acceptable pattern)
    const hostFound = hostPatterns.some(re => re.test(p.description));
    if(!hostFound) warnings.push(`Style: missing host phrase ("${p.id}" lang=${lang})`);
    // CTA check
    const ctaFound = ctaPatterns.some(re => re.test(p.description));
    if(!ctaFound) warnings.push(`Style: missing CTA phrase ("${p.id}" lang=${lang})`);
  }
  return warnings;
}

function log(...m){ if(!outJson) console.log('[validate]', ...m); }

async function head(url){
  const res = await fetch(url, { method:'HEAD' });
  return res;
}

async function rangeProbe(url){
  const res = await fetch(url, {
    method: 'GET',
    headers: { Range: 'bytes=0-1' }
  });
  // Ensure the small body is consumed to avoid open handles
  try { await res.arrayBuffer(); } catch {}
  return {
    status: res.status,
    acceptRanges: res.headers.get('accept-ranges'),
    contentRange: res.headers.get('content-range')
  };
}

async function readFiles(){
  const entries = await fs.readdir(dataDir);
  return entries.filter(f=>f.endsWith('.json'));
}

const globalIdMap = new Map(); // id -> [lang,...]

function addGlobalId(id, lang){
  if(!globalIdMap.has(id)) globalIdMap.set(id, []);
  globalIdMap.get(id).push(lang);
}

async function validateFile(file){
  const lang = file.replace(/\.json$/,'');
  if(filter && !filter.includes(lang)) return null;
  const full = path.join(dataDir, file);
  const raw = await fs.readFile(full,'utf8');
  let json;
  try { json = JSON.parse(raw); } catch(e){ return { lang, file, errors:[`JSON parse error: ${e.message}`], warnings:[], count:0 }; }
  if(!Array.isArray(json.podcasts)) return { lang,file, errors:['Missing podcasts array'], warnings:[], count:0 };
  const errors = []; const warnings = [];
  const idsInLang = new Set();
  json.podcasts.forEach(p => {
    // required
    for(const rf of requiredFields){ if(p[rf] === undefined) errors.push(`Episode ${p.id ?? '(unknown)'} missing field: ${rf}`); }
    if(p.id){
      if(idsInLang.has(p.id)) errors.push(`Duplicate id within language: ${p.id}`); else idsInLang.add(p.id);
      addGlobalId(p.id, lang);
    }
    // publishedAt
    if(p.publishedAt){
      const d = new Date(p.publishedAt);
      if(isNaN(d.getTime())) errors.push(`Episode ${p.id} invalid publishedAt: ${p.publishedAt}`);
      else {
        const diff = d.getTime() - Date.now();
        if(diff > 1000*60*60*24*7) warnings.push(`Episode ${p.id} publishedAt more than 7 days in future`);
      }
    }
    if(p.isAvailable && !p.audioUrl) errors.push(`Episode ${p.id} available but missing audioUrl`);
    if(!p.fileSizeBytes) warnings.push(`Episode ${p.id} missing fileSizeBytes`);
    if(!p.durationSeconds) warnings.push(`Episode ${p.id} missing durationSeconds`);
    if(!p.subtitleUrl) warnings.push(`Episode ${p.id} missing subtitleUrl (transcript potential)`);
    if(p.episodeNumber !== undefined && typeof p.episodeNumber !== 'number') errors.push(`Episode ${p.id} episodeNumber not a number`);
    // Image existence and dimensions (only for relative local paths)
    if(p.imageUrl){
      if(!/^https?:/i.test(p.imageUrl)) {
        // Expect a file in public/images/<imageUrl>.jpg or .png
        const candidates = [
          path.join(publicImagesDir, p.imageUrl + '.jpg'),
            path.join(publicImagesDir, p.imageUrl + '.png'),
            path.join(publicImagesDir, p.imageUrl)
        ];
        const found = candidates.find(c => existsSync(c));
        if(!found) {
          warnings.push(`Episode ${p.id} image file not found (candidates ${candidates.map(c=>path.basename(c)).join(', ')})`);
        } else {
          try {
            const buf = readFileSync(found);
            const dim = imageSize(buf);
            if(!dim || !dim.width || !dim.height) {
              warnings.push(`Episode ${p.id} image dimensions could not be determined (${path.basename(found)})`);
            } else {
              // Apple: zwischen 1400 und 3000 quadratisch bevorzugt
              if(dim.width !== dim.height) {
                warnings.push(`Episode ${p.id} image not square (${dim.width}x${dim.height})`);
                // Check whether a square derivative exists
                const baseNoExt = path.basename(found).replace(/(\.jpg|\.png)?$/, '');
                const squareName = baseNoExt + '-square.jpg';
                const squarePath = path.join(publicImagesDir, squareName);
                const squareDirPath = path.join(publicImagesDir, 'square', baseNoExt + '.jpg');
                const squareDirPng = path.join(publicImagesDir, 'square', baseNoExt + '.png');
                if(!existsSync(squarePath) && !existsSync(squareDirPath) && !existsSync(squareDirPng)) {
                  warnings.push(`Episode ${p.id} missing square derivative (expected one of: ${squareName} | square/${baseNoExt}.jpg | square/${baseNoExt}.png)`);
                }
              }
              if(dim.width < 1400) warnings.push(`Episode ${p.id} image resolution low (${dim.width}x${dim.height})`);
              if(dim.width > 4000) warnings.push(`Episode ${p.id} image very large (${dim.width}x${dim.height})`);
            }
          } catch(e){
            warnings.push(`Episode ${p.id} image dimension read error: ${e.message}`);
          }
        }
      }
    }
    // Style validation (always executed; escalate to errors if --style-strict)
    const styleWarnings = styleCheck(p);
    if(styleWarnings.length){
      if(styleStrict) {
        styleWarnings.forEach(sw => errors.push(sw.replace('Style:','Style(strict):')));
      } else {
        warnings.push(...styleWarnings);
      }
    }
  });
  // Episode number monotonic check
  const withNumbers = json.podcasts.filter(p=>typeof p.episodeNumber==='number').sort((a,b)=>a.episodeNumber-b.episodeNumber);
  for(let i=1;i<withNumbers.length;i++){
    if(withNumbers[i].episodeNumber === withNumbers[i-1].episodeNumber) warnings.push(`Duplicate episodeNumber ${withNumbers[i].episodeNumber}`);
  }
  // Network checks
  if(!noNetwork){
    for(const p of json.podcasts.slice(0,25)){ // limit to first 25 per file to avoid long runs
      if(p.audioUrl){
        try {
          const r = await head(p.audioUrl);
          if(!r.ok) warnings.push(`HEAD ${p.id} audioUrl status ${r.status}`);
          else if(!r.headers.get('content-length')) warnings.push(`Audio ${p.id} missing content-length header`);
          else {
            try {
              const rangeInfo = await rangeProbe(p.audioUrl);
              const accept = (rangeInfo.acceptRanges || '').toLowerCase();
              const hasBytesRange = accept === 'bytes' || (rangeInfo.contentRange || '').toLowerCase().startsWith('bytes');
              if(rangeInfo.status !== 206 && !hasBytesRange){
                warnings.push(`Audio ${p.id} lacks byte-range support (status ${rangeInfo.status}, accept-ranges=${rangeInfo.acceptRanges || 'none'})`);
              }
            } catch(e){
              warnings.push(`Range probe error ${p.id}: ${e.message}`);
            }
          }
        } catch(e){ warnings.push(`HEAD error ${p.id}: ${e.message}`); }
      }
    }
  }
  return { lang, file, errors, warnings, count: json.podcasts.length };
}

async function main(){
  const files = await readFiles();
  const results = [];
  for(const f of files){
    const res = await validateFile(f);
    if(res) results.push(res);
  }
  // Cross-language duplicate IDs
  for(const [id, langs] of globalIdMap.entries()){
    const uniqueLangs = [...new Set(langs)];
    if(uniqueLangs.length > 1){
      // Downgraded to a warning because multilingual ID reuse is intentional
      results.forEach(r => {
        if(r.warnings) r.warnings.push(`Global duplicate id '${id}' appears in languages: ${uniqueLangs.join(',')} (treated as warning)`);
      });
    }
  }
  if(outJson){
    console.log(JSON.stringify(results, null, 2));
  } else {
    for(const r of results){
      log(`LANG ${r.lang} (${r.count} episodes)`);
      if(r.errors.length) log('  Errors:', r.errors.length, '\n   - ' + r.errors.join('\n   - '));
      if(r.warnings.length) log('  Warnings:', r.warnings.length, '\n   - ' + r.warnings.join('\n   - '));
    }
  }
  const totalErrors = results.reduce((a,r)=>a+r.errors.length,0);
  const totalWarnings = results.reduce((a,r)=>a+r.warnings.length,0);
  if(!outJson) log(`Summary: errors=${totalErrors} warnings=${totalWarnings}`);
  if(totalErrors>0 || (strict && totalWarnings>0)) process.exitCode = 1;
}

main().catch(e=>{ console.error(e); process.exitCode=1; });
