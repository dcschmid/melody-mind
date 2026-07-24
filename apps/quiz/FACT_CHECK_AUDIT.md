# Quiz Fact-Check Audit

Last updated: 2026-07-24

## Current Scope

- The new Quiz app contains 10 topics and 400 questions.
- Each topic contains exactly 40 questions.
- A session selects 10 questions: 4 easy, 4 medium, and 2 hard.
- Every question has a valid answer, an explanation, and at least one topic-reading link.
- The current 400 questions were selected from the previously reviewed MelodyMind quiz bank.

## Earlier Editorial Audit

The source quiz bank was audited on 2026-05-15. That review covered 20 topic files and
1,014 questions. It checked question counts, answer indexes, high-risk historical wording,
and concrete historical anchors against official or authoritative sources where possible.

Corrections from that audit included:

- Narrowing Kyu Sakamoto's "Sukiyaki" claim to the first Japanese-language song to reach
  number one on the US Billboard Hot 100.
- Changing the 2019 US streaming-revenue claim from "more than 80%" to "nearly 80%" to
  match the RIAA's 79.5% figure.
- Clarifying that MTV's first aired video was not the first music video ever made.
- Removing unsupported absolute claims and narrowing disputed "first," "dominant," and
  "invented" language.
- Scoping Drake's decade streaming record to Spotify's 2010–2019 global list.
- Replacing subjective "greatest" and "definitive" wording with proportionate language.

## Reading Links

The links shown after an answer are labeled **Topic reading**. They provide authoritative
background for the topic; they are not presented as a line-by-line citation for every
sentence in an explanation.

The migration date attached to these links records when they were checked for HTTPS and
availability. Editorial claims retain the scope of the 2026-05-15 source-bank audit.

## Current Validation

The app validates the following in its content schema and automated checks:

- exactly 40 questions per topic;
- unique question IDs;
- valid answer indexes and answer types;
- at least 4 easy, 4 medium, and 2 hard questions per topic;
- HTTPS reading links;
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
