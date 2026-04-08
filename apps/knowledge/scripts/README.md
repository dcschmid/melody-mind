# Knowledge Scripts

This directory contains maintenance and migration scripts for the Knowledge app. Most of
them operate on content files directly, so treat them as editorial tooling, not casual
helpers.

## Safety Expectations

Before running any file-modifying script:

1. commit or stash unrelated work
2. run a dry-run mode if one exists
3. read the script options first
4. review the resulting diff before committing

For scripts that touch many content files, validating with
`pnpm --filter knowledge build` afterwards is strongly recommended.

## `check_content.mjs`

Validates Knowledge content files for consistency and formatting expectations. Use this
when you suspect frontmatter drift, malformed content, or content-level integrity issues.

## `check_scoped_css.mjs`

Verifies that Astro component styles are properly scoped. This is useful when working on
shared UI patterns inside the Knowledge app and wanting to avoid style leakage.

Typical usage:

```bash
pnpm --filter knowledge check:scoped-css
```

## `check_seo_meta.mjs`

Performs Knowledge-specific SEO checks. Use this when touching metadata builders, layout
head rendering, article frontmatter, or page-level SEO utilities.

Typical usage:

```bash
pnpm --filter knowledge check:seo
```

## `convert_pngs.py`

Converts PNG images to optimized output for better frontend performance.

### Related Package Scripts

```bash
pnpm --filter knowledge convert-images
pnpm --filter knowledge convert-images:exec
pnpm --filter knowledge convert-images:exec:delete
```

The non-`exec` command is the safer inspection step. The `:delete` variant is destructive
and should only be used once you have reviewed the generated output carefully.

## Contributing New Scripts

When adding a new script here:

1. prefer TypeScript or modern ESM JavaScript
2. add a dry-run mode if files can be modified
3. create backups or otherwise preserve recoverability
4. log skipped/error cases clearly
5. document the script in this README
6. verify the Knowledge build after applying content changes
