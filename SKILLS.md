# Skills Overview

This document provides an overview of all available skills and their purpose. Skills are invoked automatically when a task matches their description, or manually via `/skill-name`.

---

## Design & Frontend UI Skills

### /impeccable
The master design skill. Designs and iterates production-grade frontend interfaces with real working code and committed design choices.

**Triggers**: design, redesign, shape, critique, audit, polish, clarify, distill, harden, optimize, adapt, animate, colorize, extract, improve frontend interface.

**Key areas**: websites, landing pages, dashboards, product UI, app shells, components, forms, settings, onboarding, empty states, UX review, visual hierarchy, information architecture, cognitive load, accessibility, performance, responsive behavior, theming, typography, fonts, spacing, layout, alignment, color, motion, micro-interactions, UX copy, error states, edge cases, i18n, design systems or tokens.

**Setup required**: Context gathering via `node .agents/skills/impeccable/scripts/load-context.mjs` (loads PRODUCT.md and DESIGN.md). Every design task is categorized as **brand** (marketing, landing, campaign — design IS the product) or **product** (app UI, admin, dashboard — design SERVES the product).

**Commands**: `craft`, `shape`, `teach`, `document`, `extract`, `critique`, `audit`, `polish`, `bolder`, `quieter`, `distill`, `harden`, `onboard`, `animate`, `colorize`, `typeset`, `layout`, `delight`, `overdrive`, `clarify`, `adapt`, `optimize`, `live`

**Design Laws**:
- Color: Use OKLCH, tint neutrals toward brand hue (no pure #000/#fff)
- Theme: Choose based on physical scene (who uses it, where, under what light)
- Typography: Cap body line length at 65-75ch, hierarchy via scale + weight contrast (≥1.25 ratio)
- Motion: Never animate CSS layout properties, use ease-out-quart/quint/expo
- Bans: Side-stripe borders, gradient text, glassmorphism as default, hero-metric template, identical card grids, modal as first thought

---

### /polish
Performs a meticulous final quality pass before shipping. Fixes alignment, spacing, consistency, and micro-detail issues.

**Triggers**: polish, finishing touches, pre-launch review, something looks off, from good to great.

**Dimensions checked**: Visual alignment & spacing, typography refinement, color & contrast, interaction states (default/hover/focus/active/disabled/loading/error/success), micro-interactions & transitions, content & copy, icons & images, forms & inputs, edge cases & error states, responsiveness, performance, code quality.

**Prerequisite**: /impeccable (must be invoked first for context gathering)

---

### /audit
Runs systematic technical quality checks and generates a scored report with P0-P3 severity ratings.

**Triggers**: accessibility check, performance audit, technical quality review.

**Dimensions** (each scored 0-4):
1. **Accessibility (A11y)**: Contrast ratios, missing ARIA, keyboard navigation, semantic HTML, alt text, form issues. Score 0-4 against WCAG standards.
2. **Performance**: Layout thrashing, expensive animations, missing optimization, bundle size, render performance.
3. **Theming**: Hard-coded colors, broken dark mode, inconsistent tokens, theme switching issues.
4. **Responsive Design**: Fixed widths, touch targets (<44x44px), horizontal scroll, text scaling, missing breakpoints.
5. **Anti-Patterns**: AI slop detection (AI color palette, gradient text, glassmorphism, hero metrics, card grids), design anti-patterns.

**Output**: Audit Health Score (0-20), rating bands (18-20 Excellent, 14-17 Good, 10-13 Acceptable, 6-9 Poor, 0-5 Critical), detailed findings by severity (P0 Blocking → P3 Polish), recommended commands.

**Prerequisite**: /impeccable

---

### /critique
Evaluates design from a UX perspective with quantitative scoring, persona-based testing, automated anti-pattern detection, and actionable feedback.

**Triggers**: review, critique, evaluate, give feedback on design or component.

**Dimensions**: visual hierarchy, information architecture, emotional resonance, cognitive load, overall quality. Includes AI slop detection, cognitive load checklist, persona-based testing.

**Prerequisite**: /impeccable

---

### /animate
Reviews a feature and enhances it with purposeful animations, micro-interactions, and motion effects.

**Triggers**: add animation, transitions, micro-interactions, motion design, hover effects, make UI feel more alive.

**Focus areas**: missing feedback, jarring transitions, unclear relationships, lack of delight, missed guidance. Always respects `prefers-reduced-motion`.

**Prerequisite**: /impeccable

---

### /bolder
Amplifies safe or boring designs to make them more visually interesting and stimulating.

**Triggers**: design looks bland, generic, too safe, lacks personality, wants more visual impact.

**Warning**: AI slop trap — cyan/purple gradients, glassmorphism, neon accents are NOT bold, they're generic. Bold means distinctive, not "more effects."

**Prerequisite**: /impeccable

---

### /quieter
Tones down visually aggressive or overstimulating designs, reducing intensity while preserving quality.

**Triggers**: too bold, too loud, overwhelming, aggressive, garish, calmer aesthetic.

**Prerequisite**: /impeccable

---

### /colorize
Adds strategic color to features that are too monochromatic or lack visual interest.

**Triggers**: design looks gray, dull, lacking warmth, needs more color, more vibrant palette.

**Prerequisite**: /impeccable

---

### /distill
Strips designs to their essence by removing unnecessary complexity.

**Triggers**: simplify, declutter, reduce noise, remove elements, cleaner UI, more focused.

**Prerequisite**: /impeccable

---

### /layout
Improves layout, spacing, and visual rhythm. Fixes monotonous grids, inconsistent spacing, and weak visual hierarchy.

**Triggers**: layout feeling off, spacing issues, visual hierarchy, crowded UI, alignment problems, better composition.

**Prerequisite**: /impeccable

---

### /typeset
Improves typography by fixing font choices, hierarchy, sizing, weight, and readability.

**Triggers**: fonts, type, readability, text hierarchy, sizing looks off, more polished typography.

**Prerequisite**: /impeccable

---

### /adapt
Adapts designs to work across different screen sizes, devices, contexts, or platforms.

**Triggers**: responsive design, mobile layouts, breakpoints, viewport adaptation, cross-device compatibility.

**Prerequisite**: /impeccable

---

### /optimize
Diagnoses and fixes UI performance across loading speed, rendering, animations, images, and bundle size.

**Triggers**: slow, laggy, janky, performance, bundle size, load time, faster smoother experience.

**Focus areas**: Core Web Vitals (LCP, FID/INP, CLS), load time, bundle size, runtime performance, network requests. Image optimization, lazy loading, responsive images, code splitting.

**Prerequisite**: /impeccable

---

### /overdrive
Pushes interfaces past conventional limits with technically ambitious implementations.

**Triggers**: wow, impress, go all-out, extraordinary, shaders, spring physics, scroll-driven reveals, 60fps animations.

**IMPORTANT**: Propose 2-3 directions before building. Get user confirmation before implementation. Use browser automation to iterate visually.

**Prerequisite**: /impeccable

---

### /delight
Adds moments of joy, personality, and unexpected touches that make interfaces memorable and enjoyable.

**Triggers**: add polish, personality, animations, micro-interactions, delight, fun or memorable interface.

**Prerequisite**: /impeccable

---

### /shape
Plans UX/UI for a feature before writing code. Runs a structured discovery interview, then produces a design brief.

**Triggers**: planning phase, establish design direction, constraints, strategy before any code is written.

**Note**: This skill does NOT write code. It produces the thinking that makes code good. Output is a design brief for handoff to /impeccable craft or other implementation skills.

**Discovery areas**: Purpose & context, content & data, design goals, constraints, anti-goals.

**Prerequisite**: /impeccable

---

### /clarify
Improves unclear UX copy, error messages, microcopy, labels, and instructions.

**Triggers**: confusing text, unclear labels, bad error messages, hard-to-follow instructions, better UX writing.

**Prerequisite**: /impeccable

---

## Document & Research Skills

### /knowledge-article-writer
Researches a topic deeply via web search, fact-checks findings, and writes complete knowledge articles.

**Triggers**: user provides a topic and asks to write a knowledge article, well-researched article on a subject, Wikipedia-style deep-dive.

**Workflow**: Clarify topic → Deep research via web search (Tavily, Exa) → Organize findings → Write article (Astro/MDX format with frontmatter, components like SubsectionFigure, DidYouKnowCard, QuoteCard) → Final fact-check.

**Requires**: web-search skill for research.

---

### /fact-checker
Systematic fact verification and misinformation identification using evidence-based analysis.

**Triggers**: fact check, verify, is this true, claims that need validation.

**Process**: Identify claim → Determine required evidence → Evaluate available evidence → Rate claim → Provide context.

---

### /article-fact-checker
Fact-checks articles and web content using systematic verification with web search.

**Triggers**: verifying article claims, check news for misinformation, research article accuracy.

**Requires**: web-search skill.

---

### /anti-ai-slop
Detects and removes AI writing patterns from text to produce human-sounding output.

**Triggers**: humanize this text, not AI, remove AI writing patterns, bland AI tone, filler, clickbait, fake authenticity.

---

### /article-expander
Expands existing articles with relevant content, valid facts, and extended sections.

**Triggers**: expand article, add sections, extend content, deepen article.

---

### /web-search
Web search and content extraction via Tavily and Exa for research, RAG, fact-checking, and content aggregation.

**Uses**: `infsh app run tavily/search-assistant`, `infsh app run exa/search`, `infsh app run exa/answer`, `infsh app run exa/extract`

---

## MiniMax Media Skills

### /minimax-music-gen
Generates music, songs, and audio tracks via MiniMax API.

**Triggers**: generate music, song writing, lyrics generation, audio production, covers, background music.

**Requires**: `mmx` CLI tool (`npm install -g mmx-cli`), authentication via `mmx auth login --api-key <key>`

**Modes**: Basic (one-sentence-in, song-out) and Advanced Control (edit lyrics, refine prompt, plan before generating).

---

### /minimax-music-playlist
Generates personalized music playlists based on music taste and generation feedback history.

**Triggers**: playlist generation, music taste profiling, personalized music recommendations.

---

### /minimax-docx
Creates and edits Word documents (.docx) using OpenXML SDK.

**Triggers**: create docx, edit Word document, create report, draft proposal, make contract.

**Pipelines**: CREATE (from scratch), FILL (edit existing), REFORMAT (apply template formatting with XSD validation).

---

### /minimax-pdf
Creates professional PDFs.

**Triggers**: make a PDF, generate report, create resume, beautiful PDF, professional document.

**Pipelines**: CREATE (from scratch), FILL (complete form fields), REFORMAT (apply design to existing doc).

---

### /minimax-xlsx
Creates and edits Excel spreadsheets (.xlsx).

**Triggers**: spreadsheet, Excel, create spreadsheet, analyze data, financial model, pivot table.

---

### /minimax-pptx
Creates and edits PowerPoint presentations.

**Triggers**: PPT, PPTX, PowerPoint, presentation, slides, deck.

**Uses**: PptxGenJS for cover, TOC, content, section divider, summary slides.

---

### /gif-sticker-maker
Converts photos into animated GIF stickers with captions.

**Triggers**: sticker, GIF, cartoon, emoji, expression pack, avatar animation.

---

### /image-prompt-generator
Generates creative, detailed image prompts for MiniMax image generation.

**Triggers**: help creating image prompt, describes topic/theme for image generation.

---

### /vision-analysis
Analyzes and extracts information from images via MiniMax Vision MCP.

**Triggers**: analyze image, describe image, extract text from image, OCR, what is in image.

---

### /minimax-multimodal-toolkit
Unified tool for text, images, video, speech, and music generation via MiniMax AI platform.

**Uses**: mmx CLI for all MiniMax capabilities.

---

## Framework & Development Skills

### /astro-5-strict-reviewer
Reviews Astro 5.x code with zero tolerance for external/global CSS, BEM-only naming, and strict accessibility/performance defaults.

**Triggers**: Astro code review, Astro development.

---

### /frontend-dev
Full-stack frontend development with premium UI design, cinematic animations, AI-generated media assets, and persuasive copywriting.

**Triggers**: building landing pages, marketing sites, product pages, dashboards.

---

### /frontend-skill
Designs visually strong landing pages, websites, apps, prototypes with restrained composition, image-led hierarchy, and tasteful motion.

**Triggers**: visually strong landing page, website, app UI, prototype, demo.

---

### /fullstack-dev
Full-stack backend architecture and frontend-backend integration.

**Triggers**: building full-stack app, REST API with frontend, backend service, CRUD app, real-time app, chat app, Express + React, Next.js API, auth flows, file uploads, SSE/WebSocket.

---

### /flutter-dev
Flutter cross-platform development.

**Triggers**: Flutter development, implementing UI, state management (Riverpod/Bloc), GoRouter navigation, custom widgets, performance optimization, iOS/Android deployment.

---

### /react-native-dev
React Native and Expo development.

**Triggers**: React Native app, Expo, state management, navigation, performance, iOS/Android deployment.

---

### /android-native-dev
Android native development with Material Design 3, Kotlin/Compose.

**Triggers**: Android development, UI implementation, accessibility.

---

### /ios-application-dev
iOS development with UIKit, SnapKit, SwiftUI.

**Triggers**: iOS development, iPhone interfaces, Dynamic Type, Dark Mode, accessibility.

---

### /shader-dev
Comprehensive GLSL shader techniques.

**Triggers**: shaders, ray marching, SDF modeling, fluid simulation, particle systems, procedural generation.

---

### /context-manager
Context discovery, fetching, extraction, compression, and organization.

**Triggers**: context management, project context, knowledge management.

---

### /find-skills
Helps discover and install agent skills.

**Triggers**: how do I do X, find a skill for X, is there a skill that can.

---

### /task-management
Task tracking CLI with status, dependencies, and validation.

**Triggers**: task tracking, feature subtasks, project management.

---

## Invocation

Skills are invoked in two ways:

1. **Automatic**: When a task matches the skill's description
2. **Manual**: Type `/skill-name` in the conversation

Examples:
```
/impeccable craft my-feature
/polish the navigation bar
/audit homepage accessibility
/minimax-music-gen create a sad lo-fi track
/web-search "who invented jazz"
```

---

## Skill Dependencies

Many design skills (impeccable, polish, audit, critique, animate, bolder, etc.) require `/impeccable` to be invoked first for context gathering. The impeccable skill contains the **Context Gathering Protocol** and design principles that other skills depend on.

Media generation skills (minimax-*) require the `mmx` CLI tool to be installed and authenticated.
