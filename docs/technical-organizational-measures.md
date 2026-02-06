# Technical and Organizational Measures (TOM)

Internal TOM overview for MelodyMind Knowledge.

- Scope: Website operations, analytics consent, editorial workflows
- Related record: `docs/data-processing-directory.md`
- Version: 1.0
- Last updated: 2026-02-06

## 1) Organizational Measures

| Measure Area           | Implemented Controls                                                                                   |
| ---------------------- | ------------------------------------------------------------------------------------------------------ |
| Responsibilities       | Controller accountability defined in legal pages and internal directory                                |
| Data minimization      | Only required data is processed for each purpose; avoid unnecessary personal data in editorial prompts |
| Need-to-know principle | Access to operational accounts and email inboxes limited to maintainer(s)                              |
| Vendor management      | Processor list maintained; provider terms and safeguards reviewed on changes                           |
| Incident handling      | Security-relevant incidents are documented and assessed for notification obligations                   |
| Change management      | Legal/privacy docs updated when processors, storage keys, or tracking behavior changes                 |

## 2) Technical Measures

| Measure Area               | Implemented Controls                                                                   |
| -------------------------- | -------------------------------------------------------------------------------------- |
| Transport security         | HTTPS for website delivery and third-party integrations                                |
| Consent enforcement        | Analytics script loading is gated by explicit consent state in local storage           |
| DNT respect                | Do Not Track signal is checked and analytics remains disabled when DNT is active       |
| Tracking reduction         | No non-essential tracking before opt-in; privacy-oriented analytics setup              |
| Storage limitation         | LocalStorage keys are purpose-specific and user-resettable                             |
| Integrity and availability | Static site architecture with managed hosting and platform-level availability controls |
| Logging and monitoring     | Hosting provider access/security logs with rolling retention                           |

## 3) Confidentiality, Integrity, Availability, Resilience

### Confidentiality

- Restricted account access for maintainer-operated systems.
- Avoid processing sensitive personal data in content workflows.

### Integrity

- Human review process for published content and legal pages.
- Controlled updates through repository changes and review.

### Availability and Resilience

- Static build/deployment model reduces attack surface.
- Hosting provider operational safeguards for uptime and continuity.

## 4) Data Subject Rights Support

- Contact channel is provided via imprint/privacy pages.
- Consent can be changed/withdrawn via cookie settings.
- Locally stored preferences can be removed by users directly in browser settings.

## 5) Retention and Deletion Controls

- Local storage data remains user-controlled and can be removed by user actions.
- Contact emails are retained only as long as required for purpose/legal obligations.
- Provider logs and analytics retention follow configured/provider retention windows.

## 6) Processor and Transfer Safeguards

- Processors are documented in the processing directory.
- Third-country transfers are assessed per provider setup.
- Contractual safeguards (for example SCCs) are expected where required.

## 7) Validation Checklist (Quarterly)

- Confirm processor list is complete and current.
- Confirm no new storage keys/tracking without documented purpose and legal basis.
- Confirm consent gating still blocks analytics before opt-in.
- Confirm DNT behavior remains active.
- Confirm legal pages and internal records are aligned.
- Confirm retention statements match actual configuration/provider behavior.
