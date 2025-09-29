#!/usr/bin/env node
/**
 * Podcast Data Validator
 *
 * Validates podcast JSON data for:
 *  - Duplicate IDs
 *  - Required fields presence
 *  - ISO 8601 publishedAt format
 *  - Future publish date sanity (allows future but warns if > 1 year ahead)
 *  - Empty strings where not allowed
 *  - isAvailable true requires audioUrl & subtitleUrl non-empty
 *
 * Exit Codes:
 *  0 = success (no errors)
 *  1 = validation errors
 *  2 = unexpected runtime failure
 */

const fs = require('fs');
const path = require('path');

const PODCAST_FILE = path.join(__dirname, '..', 'src', 'data', 'podcasts', 'en.json');

/** @type {Array<string>} */
const requiredStringFields = ['id', 'title', 'description', 'imageUrl', 'language'];

function isIsoDateString(value) {
  if (typeof value !== 'string') return false;
  // Accept YYYY-MM-DDTHH:MM:SSZ
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(value);
}

function main() {
  /** @type {string[]} */
  const errors = [];
  /** @type {string[]} */
  const warnings = [];

  if (!fs.existsSync(PODCAST_FILE)) {
    console.error('Podcast data file not found:', PODCAST_FILE);
    process.exit(2);
  }

  let raw;
  try {
    raw = fs.readFileSync(PODCAST_FILE, 'utf-8');
  } catch (e) {
    console.error('Failed to read podcast file:', e.message);
    process.exit(2);
  }

  let json;
  try {
    json = JSON.parse(raw);
  } catch (e) {
    console.error('Invalid JSON format:', e.message);
    process.exit(1);
  }

  const podcasts = Array.isArray(json.podcasts) ? json.podcasts : [];

  const seenIds = new Set();
  const now = Date.now();
  const oneYearMs = 365 * 24 * 60 * 60 * 1000;

  podcasts.forEach((p, index) => {
    const ctx = `podcast[${index}] id=${p?.id || 'UNKNOWN'}`;

    // Required string fields
    requiredStringFields.forEach((field) => {
      if (!p || typeof p[field] !== 'string' || p[field].trim() === '') {
        errors.push(`${ctx}: missing/empty required field '${field}'`);
      }
    });

    // Duplicate ID check
    if (p && typeof p.id === 'string') {
      if (seenIds.has(p.id)) {
        errors.push(`${ctx}: duplicate id '${p.id}'`);
      } else {
        seenIds.add(p.id);
      }
    }

    // publishedAt format
    if (p.publishedAt) {
      if (!isIsoDateString(p.publishedAt)) {
        errors.push(`${ctx}: invalid publishedAt format '${p.publishedAt}' (expected ISO 8601 'YYYY-MM-DDTHH:MM:SSZ')`);
      } else {
        const d = new Date(p.publishedAt);
        if (isNaN(d.getTime())) {
          errors.push(`${ctx}: publishedAt not parsable '${p.publishedAt}'`);
        } else if (d.getTime() - now > oneYearMs) {
          warnings.push(`${ctx}: publishedAt more than 1 year in future (${p.publishedAt})`);
        }
      }
    } else {
      warnings.push(`${ctx}: missing publishedAt (may be intentional pre-draft)`);
    }

    // isAvailable gating
    if (p.isAvailable === true) {
      if (!p.audioUrl || typeof p.audioUrl !== 'string' || p.audioUrl.trim() === '') {
        errors.push(`${ctx}: isAvailable true but audioUrl missing/empty`);
      }
      if (!p.subtitleUrl || typeof p.subtitleUrl !== 'string' || p.subtitleUrl.trim() === '') {
        warnings.push(`${ctx}: isAvailable true but subtitleUrl missing/empty`);
      }
    }
  });

  // Output
  if (errors.length === 0 && warnings.length === 0) {
    console.log('Podcast validation: OK (no issues)');
  } else {
    if (errors.length) {
      console.error(`Errors (${errors.length}):`);
      errors.forEach((e) => console.error('  -', e));
    }
    if (warnings.length) {
      console.warn(`Warnings (${warnings.length}):`);
      warnings.forEach((w) => console.warn('  -', w));
    }
  }

  if (errors.length > 0) {
    process.exit(1);
  }
}

try {
  main();
} catch (e) {
  console.error('Unexpected validator failure:', e);
  process.exit(2);
}
