# Data Processing Directory (Art. 30 GDPR)

Internal record of processing activities for MelodyMind Knowledge.

- Scope: Non-commercial private website project
- Controller: Daniel Schmid, Hiltenspergerstr. 78, 80796 Muenchen, Germany
- Contact: dcschmid@murena.io
- Version: 1.0
- Last updated: 2026-02-06

## 1) Processing Activities Overview

| ID    | Processing Activity                           | Purpose                                                                              | Legal Basis                               | Data Subjects                                                          | Personal Data Categories                                                                        |
| ----- | --------------------------------------------- | ------------------------------------------------------------------------------------ | ----------------------------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| PA-01 | Website hosting and security logging (Render) | Secure operation, abuse prevention, error diagnostics                                | Art. 6(1)(f) GDPR                         | Website visitors                                                       | IP address, timestamp, URL, user agent, technical log metadata                                  |
| PA-02 | Consent management for analytics              | Store and enforce analytics consent choices                                          | Art. 6(1)(c), Art. 6(1)(a) GDPR, ePrivacy | Website visitors                                                       | Consent status (`cookie_consent`), timestamp, client-side preference flags                      |
| PA-03 | Privacy-friendly analytics (Fathom)           | Aggregated usage insights and performance measurement                                | Art. 6(1)(a) GDPR (opt-in), ePrivacy      | Website visitors                                                       | Pseudonymous usage data, page views, referrer, technical metrics                                |
| PA-04 | Contact by email                              | Respond to inquiries and communication                                               | Art. 6(1)(b), Art. 6(1)(f) GDPR           | Inquirers                                                              | Email address, message content, email headers/metadata                                          |
| PA-05 | Client-side personalization storage           | Optional UX continuity (bookmarks, reading progress, recent reads, reading settings) | Art. 6(1)(f) GDPR (user experience)       | Website visitors                                                       | LocalStorage keys (`mm_bookmarks`, `mm_read_progress`, `mm_recent_reads`, `readingPreferences`) |
| PA-06 | AI-assisted editorial workflow (internal)     | Drafting/refinement for public content under human review                            | Art. 6(1)(f) GDPR (editorial workflow)    | Maintainers/editors, optional correspondents if intentionally provided | Prompt text, draft fragments, editorial notes (avoid unnecessary personal data)                 |

## 2) Processors and Recipients

| Processor / Recipient                          | Role                                                           | Processing Activity IDs | Processing Location / Transfer                                 | Safeguards                                                |
| ---------------------------------------------- | -------------------------------------------------------------- | ----------------------- | -------------------------------------------------------------- | --------------------------------------------------------- |
| Render                                         | Processor (hosting)                                            | PA-01                   | EU and/or third-country processing depending on provider setup | DPA + SCCs where required, provider security controls     |
| Fathom Analytics                               | Processor (analytics)                                          | PA-03                   | Provider-defined regions                                       | DPA, privacy-first configuration, DNT honored             |
| Email provider (controller's mailbox provider) | Independent controller / processor (depends on provider terms) | PA-04                   | Provider-defined regions                                       | Provider contractual and technical safeguards             |
| OpenAI / Anthropic (editorial tooling)         | Processor/sub-processor context-dependent                      | PA-06                   | Provider-defined regions, potential third-country transfers    | Contractual safeguards, minimize personal data in prompts |

Notes:

- Processors are reviewed periodically and updated in this directory when integrations change.
- No sale of personal data.

## 3) Data Retention and Deletion Windows

| Activity ID | Retention Rule                                                              | Deletion / Review Trigger                          |
| ----------- | --------------------------------------------------------------------------- | -------------------------------------------------- |
| PA-01       | Rolling retention according to hosting provider defaults and security needs | Automatic rotation and periodic review             |
| PA-02       | Stored until user changes preference or clears local storage                | User action (Cookie Settings / browser clear)      |
| PA-03       | Provider-defined analytics retention                                        | Provider controls + regular compliance review      |
| PA-04       | Kept only as long as needed to handle inquiry and legal obligations         | Manual review and deletion when no longer needed   |
| PA-05       | Stored locally until changed/removed by user                                | User action or browser clear                       |
| PA-06       | Retain only editorially necessary artifacts                                 | Content lifecycle review; remove non-needed drafts |

## 4) Categories of Data Subjects

- Website visitors
- Contact inquirers
- Project maintainer(s) and editor(s)

## 5) Categories of Personal Data

- Technical access data (IP, user agent, timestamp, requested resource)
- Consent and preference data (analytics opt-in/out state)
- Communication data (email address, message content, metadata)
- Limited editorial workflow data where intentionally processed

## 6) Recipients and Transfers

- Processors listed in section 2 may receive data within required scope.
- Potential third-country processing can occur depending on provider setup.
- Where required, transfers are based on recognized safeguards (for example SCCs).

## 7) Security Reference (TOM)

Technical and organizational measures are documented in:

- `docs/technical-organizational-measures.md`

## 8) Governance and Maintenance

- Owner: Project controller
- Review cadence: At least quarterly or upon integration changes
- Change triggers:
  - New vendor/tool
  - New tracking or storage mechanism
  - New contact/data collection workflow
  - Legal requirement updates
