#!/usr/bin/env node
/**
 * Style consistency check for podcast metadata (STYLEGUIDE v2).
 *
 * Rules v2:
 *  - Title total chars (including emoji) 55–65.
 *  - Decade titles use en dash (–) after decade token (e.g. 1950s – ...)
 *  - Description total chars 250–300.
 *  - Mandatory host mention phrase: 'Daniel and Annabelle guide you'
 *  - CTA sentence contains 'Press play and ' and ends with exactly one mapped emoji.
 *  - Emoji matches mapping for category/decade.
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const root = path.join(process.cwd());
const dataFile = path.join(root, 'src', 'content', 'podcasts', 'en.json');

const emojiMap = {
  // decades
  '1950s': '🎸','1960s': '✌️','1970s': '🌈','1980s': '🔊','1990s': '🌀','2000s': '💽','2010s': '🌍',
  // genres
  'orchestral': '🎼','soundtrack': '🎧','opera': '🎶','classical': '🕯️','chamber-music': '🤲','new-age': '🌌','piano':'🎹',
  // female focus / categories
  'female-blues-legends':'🎤','female-country-stars':'🤠','female-djs':'🎧','female-grunge-artists':'⚡','female-hip-hop-artists':'🎤','female-rappers':'🔥','female-jazz-vocalists':'🎷','female-pop-superstars':'✨','female-rb-divas':'💜','female-rock-metal-vocalists':'🤘','female-soul-legends':'🎙️','female-vocal-icons':'👑',
  // artists
  'cristina-scabbia':'🌘','sharon-den-adel':'🌩️','amy-lee':'🕯️','charlotte-wessels':'🦋','doro-pesch':'✊','floor-jansen':'🌋','simone-simons':'🌌','tarja-turunen':'❄️'
};

function charLen(str){ return [...str].length; }

function isDecade(id){
  return /^[0-9]{4}s$/.test(id);
}

async function main(){
  const raw = await fs.readFile(dataFile,'utf8');
  const json = JSON.parse(raw);
  const problems = [];
  for(const p of json.podcasts){
  const { id, title, description } = p;
    if(!id || !title || !description){
      problems.push({ id, issue: 'Missing core fields' });
      continue;
    }
    // Title checks
    const tLen = charLen(title);
    if(tLen < 55 || tLen > 65){
      problems.push({ id, issue: `Title length ${tLen} outside 55–65` });
    }
    if(isDecade(id)){
      // Must have en dash pattern: '1950s – '
      if(!/^\d{4}s\s–\s/.test(title)){
        problems.push({ id, issue: 'Decade title missing en dash after decade token' });
      }
      if(/:/.test(title.split(' ')[0])){
        problems.push({ id, issue: 'Decade title uses colon instead of en dash' });
      }
    }
    // Description checks
    const dLen = charLen(description);
    if(dLen < 250 || dLen > 300){
      problems.push({ id, issue: `Description length ${dLen} outside 250–300` });
    }
    if(!/Daniel and Annabelle guide you/i.test(description)){
      problems.push({ id, issue: 'Missing host mention (Daniel and Annabelle guide you ...)' });
    }
    if(!/Press play and /.test(description)){
      problems.push({ id, issue: 'Missing CTA phrase "Press play and "' });
    }
    // Final emoji check
  const emojiMatch = description.match(/(\p{Extended_Pictographic}|[\uFE0F\u200D]|[\uD800-\uDBFF][\uDC00-\uDFFF])$/u);
    if(!emojiMatch){
      problems.push({ id, issue: 'Missing final emoji' });
    } else {
      const expected = emojiMap[id];
      if(expected && !description.endsWith(expected)){
        problems.push({ id, issue: `Final emoji mismatch (expected ${expected})` });
      }
    }
  }
  if(problems.length){
    console.error('Style violations:');
    for(const v of problems){
      console.error(` - [${v.id}] ${v.issue}`);
    }
    process.exitCode = 1;
  } else {
    console.log('All podcast entries pass style checks.');
  }
}

main().catch(e=>{ console.error(e); process.exitCode=1; });
