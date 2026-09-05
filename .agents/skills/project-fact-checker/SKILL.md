---
name: fact-checker
description: Verify individual claims, pasted text, complete articles, and web pages or URLs using available research tools. Use when the user asks to fact-check, verify, assess accuracy or source credibility, identify misinformation or outdated claims, correct factual errors, or distinguish facts from opinions, forecasts, and unverifiable statements.
---

# Fact Checker

Verify what the evidence supports at a stated point in time. Use the research tools available in
the current environment; do not depend on a particular search provider, CLI, or extraction tool.

## Establish scope

1. Obtain the exact claim, text, or article. For a URL, retrieve the page and record its author,
   publisher, publication date, update date, and relevant links when available.
2. Preserve the difference between checking and editing. A fact-check request authorizes a report,
   not a full rewrite. Incorporate corrections only when the user asks.
3. State material access limits, paywalls, missing context, or unavailable primary material.

## Atomize and classify claims

Break compound statements into independently testable claims. Prioritize claims central to the
argument, consequential to the reader, disputed, surprising, or likely to have changed.

Classify each item before researching it:

- factual and currently testable
- opinion or value judgment
- forecast or hypothetical
- accurate only for a past date or now outdated
- not verifiable from public evidence

Do not force opinions or forecasts into true/false labels.

## Research evidence

1. Define what would support and what would contradict each claim.
2. Prefer direct primary evidence: official records and datasets, original research, court or
   legislative documents, full interviews, company filings, or the original work under discussion.
3. Use high-quality secondary reporting to add context, interpret specialist evidence, and locate
   primary material. Source authority depends on the claim; no fixed hierarchy fits every topic.
4. For important claims, seek more than one named source when independent corroboration is
   possible. Do not inflate a source count with outlets repeating the same report.
5. Search for both supporting and contradicting evidence. Read sources closely enough to avoid
   quote mining, date confusion, denominator changes, correlation/causation errors, and mismatched
   definitions.
6. Note relevant interests and limitations: who produced or funded the evidence, whether a source
   is a party to the claim, and what methods or data remain unavailable.
7. Prefer current evidence for current claims and record the verification date. Preserve the
   historical cutoff when evaluating what was true at an earlier time.

Never invent a source, quotation, citation detail, access date, or consensus. Link directly to the
evidence used, not to search-result pages.

## Verdicts

Use the narrowest label that fits the evidence:

- `True`: accurate in the stated scope.
- `Mostly true`: core is accurate but a limited error or omission matters.
- `Mixed`: independently meaningful parts point in different directions.
- `Mostly false`: a small element is accurate, but the central impression is wrong.
- `False`: contradicted by reliable evidence.
- `Outdated`: may describe an earlier state but not the relevant current one.
- `Unverifiable`: available evidence cannot establish or refute it.
- `Opinion` or `Forecast`: not a factual verdict; assess premises or evidence separately.

Attach a confidence level (`high`, `medium`, or `low`) and explain what uncertainty remains.

## Output

For each material claim, provide:

1. the atomic claim and its classification
2. verdict and confidence
3. concise reasoning, including material supporting and contradicting evidence
4. the date or period for which the verdict applies
5. directly linked, named sources and relevant source limitations or interests
6. a precise correction when the claim is inaccurate

For complete articles, add a short overall assessment that distinguishes factual accuracy from
argument, framing, and source quality. Do not average claim verdicts into a misleading score.

If correction was requested, preserve the author's voice and structure, change only what the
evidence requires, add necessary context, and keep a brief record of substantive corrections.
