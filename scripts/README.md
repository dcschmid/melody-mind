# Scripts

This directory contains utility scripts for the MelodyMind project.

## Crosslinking Script

### `crosslink-artists.ts`

Creates bidirectional links between Artist and Knowledge pages.

**Features:**

- **Knowledge → Artists**: Adds markdown links in content when artist name is found
- **Artist → Knowledge**: Adds knowledge articles to `relatedArticles` array
- **Dry-run mode**: Preview changes without modifying files
- **Atomic writes**: Writes to temporary files first, then renames (prevents data loss)
- **Backup**: Creates `.backup` files before modifications
- **Smart matching**: Whole-word matching with word boundaries
- **Validation**: Validates required fields (`name` for artists, `title` for knowledge)
- **Logging**: Warns when files are skipped due to errors

**Usage:**

```bash
# Preview changes (recommended first)
yarn crosslink-artists:dry

# Apply changes
yarn crosslink-artists

# Or with tsx directly
npx tsx scripts/crosslink-artists.ts --dry-run
npx tsx scripts/crosslink-artists.ts

# Force overwrite existing backups
npx tsx scripts/crosslink-artists.ts --force

# Skip backup creation (not recommended)
npx tsx scripts/crosslink-artists.ts --no-backup
```

**Example Output:**

```
🔗 Crosslinking Script: Artists ↔ Knowledge
==================================================
Mode: DRY-RUN
Backup: enabled
Force backup overwrite: disabled

⚠️  Missing or invalid 'title' field in 2010s.mdx

🔍 Scanning 14 artists and 7 knowledge pages...

==================================================
📊 SUMMARY
==================================================
Knowledge pages to update: 3
Artist pages to update: 4
Total artist links to add: 21
Total related articles to add: 4
```

**Command Line Options:**

- `--dry-run`: Run in preview mode without modifying files
- `--no-backup`: Skip creating backup files (not recommended)
- `--force`: Overwrite existing `.backup` files instead of skipping

**How it works:**

1. Scans all artist pages in `src/content/artists/`
2. Scans all knowledge pages in `src/content/knowledge-en/`
3. Finds artist name mentions in knowledge content (whole-word matches)
4. Converts plain text mentions to markdown links: `[Ella Fitzgerald](/artists/ella-fitzgerald)`
5. Adds knowledge articles to artist's `relatedArticles` if artist is mentioned

**Safety Features:**

- ✅ Only creates links for exact name matches (whole words)
- ✅ Won't link if text is already inside a markdown link
- ✅ Creates `.backup` files before any modifications
- ✅ Atomic file writes (temp file → rename) prevents data loss
- ✅ Won't overwrite existing backups without `--force` flag
- ✅ Validates required fields (`name`, `title`) with warnings
- ✅ Logs warnings when files are skipped due to errors
- ✅ Dry-run mode lets you preview before committing
- ✅ Graceful error handling with detailed error messages

**What gets linked:**

- **Artist names**: "Ella Fitzgerald" → `/artists/ella-fitzgerald`
- **Related articles**: Knowledge pages mentioning artists → added to `relatedArticles` array
- **Keywords**: Also searches in frontmatter keywords for additional matches

## Other Scripts

### `check_content.mjs`

Validates content files for consistency and proper formatting.

### `check_scoped_css.mjs`

Verifies that CSS is properly scoped in Astro components.

### `convert_pngs.py`

Converts PNG images to WebP format for better performance.

## Contributing

When adding new scripts:

1. Use TypeScript or JavaScript with ES modules
2. Follow the project's code style guidelines
3. Include a dry-run mode for file-modifying scripts
4. Create backups before modifying files
5. Add documentation to this README
6. Test thoroughly before running on production data
