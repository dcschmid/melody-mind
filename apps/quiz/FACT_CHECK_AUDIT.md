# Quiz Fact-Check Audit

Last updated: 2026-08-08

## Current Scope

- The Quiz app contains 27 topics and 1,080 questions.
- Seven topics cover decades from the 1950s through the 2010s.
- Sixteen topics trace genre histories.
- Two topics follow individual artists, and two examine individual albums.
- Every topic contains exactly 40 questions.
- A session selects 10 questions: 4 easy, 4 medium, and 2 hard.
- Every answer has a direct explanation, a separate context paragraph, and at least one
  claim-specific source.

## Editorial Method

The source questions came from the previously reviewed MelodyMind quiz bank and later
research-led expansions. The May 15, 2026 audit covered answer indexes, historical
wording, dates, and high-risk claims across the earlier bank.

The July 31 expansion added punk/alternative-rock and highlife/Afrobeats journeys and
applied a second pass:

- removed questions that depended on phrases such as "according to the article";
- removed vague recommendation language and unsupported origin stories;
- replaced em dashes, inflated claims, and generic AI-style transitions;
- kept questions in clear American English at a B2-C1 reading level;
- expanded every answer to 70-110 words across two labeled paragraphs;
- selected questions across each source pool instead of taking one uninterrupted block;
- matched sources to the correct artist, work, format, movement, or historical subject;
- added a second source for firsts, records, best-selling claims, and material
  superlatives.

The August 2 expansion added heavy-metal/extreme-metal and
psychedelia/dream-pop journeys. The new pools follow audible changes in riffing,
rhythm, studio processing, and scene infrastructure rather than treating genre labels
as interchangeable. Each answer was checked against the named artist, recording,
technique, or regional scene.

The August 8 expansion introduced artist spotlights and album stories with Prince,
Björk, the Beatles' *Revolver*, and Lauryn Hill's *The Miseducation of Lauryn Hill*.
The four pools connect documented credits, sessions, collaborators, formats, awards,
and preservation records instead of reducing careers or albums to release-date trivia.

## Source Review

The current catalog uses 701 distinct reference pages. Source selection starts with the
correct answer and then checks the question's named people, works, places, and technical
terms. Generic disambiguation pages, unrelated entertainment titles, years, and broad
one-word results are rejected.

The `checkedAt` value records the date on which a source was selected and reviewed for the
question. It is not a publication date.

The source list is shown after each answer under **Sources**. A source should support the
specific fact being tested, not merely provide background on the broader quiz topic.

## Schema and Runtime Validation

The app validates:

- exactly 40 questions per topic;
- unique question IDs;
- valid answer indexes and answer types;
- at least 4 easy, 4 medium, and 2 hard questions per topic;
- 70-110 words across the explanation and context paragraphs;
- at least one HTTPS source per question;
- two sources for first, record, best-selling, and material superlative claims;
- exact-set scoring for multi-answer questions;
- session selection and score-band boundaries.

Run:

```bash
pnpm --filter quiz format:check
pnpm --filter quiz lint:check
pnpm --filter quiz stylelint:check
pnpm --filter quiz check
pnpm --filter quiz test
pnpm --filter quiz build
```
