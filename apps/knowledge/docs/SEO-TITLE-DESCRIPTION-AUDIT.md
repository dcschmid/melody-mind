# SEO Title And Description Audit

## Scope

Audit of page-level SEO title and description patterns for Melody Mind after the initial
schema and internal-linking work.

## Main Findings

### 1. Generic hub-page suffixes

- Taxonomy pages used the pattern `{name} | Taxonomy`.

These patterns are technically unique, but weak in search results because they describe
site architecture instead of user intent.

### 2. Quiz landing pages were under-specified

- Quiz detail pages used `{title} | Quiz`.
- Quiz index used `Music Knowledge Quizzes`.

These titles were serviceable, but too generic compared with actual search intent such as
`music history quiz`, `1990s music quiz`, or `genre evolution quiz`.

### 3. Knowledge article descriptions were overly enriched

- Article meta descriptions were built from title + description + keywords.

That approach risks repetitive snippets and less natural SERP copy. The visible article
description is usually the stronger search snippet.

## Changes Applied

### Updated title patterns

- Knowledge articles:
  Keep editorial article title, rely on the shared builder to append the site brand.
- Taxonomy pages:
  `{Section Name} Music Topics`
- Quiz detail pages:
  `{Quiz Title} Music Quiz`
- Quiz index:
  `Music History Quizzes And Trivia`

### Updated description guidance

- Prefer the editorial summary for knowledge article descriptions.
- Keep hub-page descriptions focused on what the user can explore, not internal labels.
- Keep quiz descriptions tied to topic coverage and challenge framing.

## Rules Going Forward

- Do not use structural labels like `Taxonomy` or `Page` in SEO titles unless
  they are necessary for disambiguation.
- Prefer search-intent language:
  `music guides`, `music topics`, `music quiz`, `music history`, `genre evolution`.
- Do not build article descriptions by concatenating title, summary, and keywords unless
  the source description is missing.
- Keep titles specific enough that a user can predict the page before clicking.

## Next Audit Candidates

- Review all content descriptions in `src/content/knowledge-en/` for length and snippet
  quality.
- Check whether any quiz descriptions are too similar across decade pages.
- Spot-check Search Console CTR after the new title patterns are live.
