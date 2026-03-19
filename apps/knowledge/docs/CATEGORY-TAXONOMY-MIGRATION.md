# Category To Taxonomy Migration

## Summary

`/categories/*` is no longer the primary information architecture for Knowledge.
The live content model is now driven by `taxonomySubsection` and `taxonomyGroup`, while
the old category layer mostly survives as a legacy URL surface.

The migration is now implemented:

- article breadcrumbs point to taxonomy targets
- legacy `/categories/*` URLs are handled through redirects
- analytics classifies taxonomy routes
- category-specific schema output was removed
- `pages/categories/[slug].astro` and `categories.json` were deleted

## Current Redirect Surface

Legacy `/categories/*` URLs still exist only as redirect entries in Astro config:

- `apps/knowledge/astro.config.mjs`
- `apps/knowledge/src/constants/categoryRedirects.js`

## Content Reality

- `taxonomySubsection` and `taxonomyGroup` are actively used across the knowledge
  content collection.
- The legacy `category` frontmatter has been removed from active content.
- Only `5` of those `36` slugs directly overlap with IDs in `musicTaxonomy.ts`.

## Route Constraint

Taxonomy currently routes only at the section level:

- `/taxonomy/[section]`

Section pages already expose internal anchors for:

- subsection IDs like `#music-through-decades`
- group IDs like `#cross-decade-lenses--genre-evolution-pathways`

That means the practical migration target is:

- `/taxonomy/<section>`
- or `/taxonomy/<section>#<subsection-or-group>`

## Migration Matrix

### High-confidence direct replacements

| Legacy category slug                  | Recommended taxonomy target                                               | Confidence | Note                                               |
| ------------------------------------- | ------------------------------------------------------------------------- | ---------- | -------------------------------------------------- |
| `music-through-decades`               | `/taxonomy/time-change-evolution#music-through-decades`                   | High       | Exact subsection match                             |
| `decade-spanning-perspectives`        | `/taxonomy/time-change-evolution#cross-decade-lenses`                     | High       | Same topic, renamed subsection                     |
| `global-female-music-icons`           | `/taxonomy/voices-identity-representation#global-female-icons`            | High       | Same concept                                       |
| `voice-as-instrument`                 | `/taxonomy/voices-identity-representation#voice-as-instrument`            | High       | Exact subsection match                             |
| `classical-orchestral-mastery`        | `/taxonomy/classical-orchestral-mastery`                                  | High       | Exact section match                                |
| `classic-hard-rock-traditions`        | `/taxonomy/rock-traditions#classic-rock-expansion`                        | High       | Best topical subsection                            |
| `classic-metal-heavy-music`           | `/taxonomy/metal-heavy-music`                                             | High       | Exact section intent                               |
| `mainstream-pop-global-hits`          | `/taxonomy/mainstream-pop-global-hits`                                    | High       | Exact section match                                |
| `indie-alternative-music`             | `/taxonomy/indie-alternative`                                             | High       | Section rename only                                |
| `hip-hop-rap-culture`                 | `/taxonomy/hiphop-rap-culture`                                            | High       | Exact section match                                |
| `jazz-soul-funk-expressions`          | `/taxonomy/jazz-soul-funk`                                                | High       | Section rename only                                |
| `house-techno-electronic-culture`     | `/taxonomy/electronic-club-nightlife#house-techno-foundations`            | High       | Taxonomy absorbed this into the electronic section |
| `latin-music-global-rhythms`          | `/taxonomy/latin-caribbean-afro-roots#latin-vibes`                        | High       | Best subsection match                              |
| `caribbean-afro-roots-music`          | `/taxonomy/latin-caribbean-afro-roots#caribbean-afro-roots`               | High       | Exact subsection match                             |
| `folk-regional-music-expressions`     | `/taxonomy/folk-regional-expressions`                                     | High       | Exact section match                                |
| `countries-regional-music-traditions` | `/taxonomy/countries-regional-traditions`                                 | High       | Exact section match                                |
| `emotional-heartfelt-music`           | `/taxonomy/emotional-seasonal-situational#emotional-genres-mood-states`   | High       | Best subsection match                              |
| `seasonal-music-atmospheres`          | `/taxonomy/emotional-seasonal-situational#seasonal-genres-moments`        | High       | Best subsection match                              |
| `situational-activity-music`          | `/taxonomy/emotional-seasonal-situational#situational-activity-playlists` | High       | Exact subsection intent                            |
| `music-media-tech-industry`           | `/taxonomy/music-media-technology-industry`                               | High       | Exact section match                                |

### Strong replacements via Canon and Key Artists

These legacy categories are artist- or vocalist-centric. In the taxonomy, that
material now fits best under `canon-key-artists`.

| Legacy category slug               | Recommended taxonomy target                                          | Confidence | Note                    |
| ---------------------------------- | -------------------------------------------------------------------- | ---------- | ----------------------- |
| `classical-vocal-virtuosos`        | `/taxonomy/canon-key-artists#classical-orchestral-leading-vocalists` | High       | Strong intent match     |
| `rock-icons-golden-age`            | `/taxonomy/canon-key-artists#rock-icons-golden-age-heavy`            | High       | Strong intent match     |
| `metal-icons-queens-kings`         | `/taxonomy/canon-key-artists#metal-queens-kings-rule-breakers`       | High       | Strong intent match     |
| `pop-vocal-powerhouses`            | `/taxonomy/canon-key-artists#pop-powerhouses`                        | High       | Strong intent match     |
| `indie-alternative-leading-voices` | `/taxonomy/canon-key-artists#indie-alternative-leading-voices`       | High       | Exact subsection intent |
| `hip-hop-rap-vocal-lyric-icons`    | `/taxonomy/canon-key-artists#hiphop-rap-leading-voices-lyric-icons`  | High       | Strong intent match     |
| `jazz-soul-funk-vocal-legends`     | `/taxonomy/canon-key-artists#jazz-soul-funk-leading-voices-legends`  | High       | Strong intent match     |
| `house-techno-vocal-pioneers`      | `/taxonomy/canon-key-artists#house-techno-leading-vocal-innovators`  | High       | Strong intent match     |
| `club-sounds-vocal-icons`          | `/taxonomy/canon-key-artists#club-sounds-leading-voices-night`       | High       | Strong intent match     |
| `latin-music-vocal-icons`          | `/taxonomy/canon-key-artists#latin-vibes-leading-voices-global`      | High       | Strong intent match     |
| `caribbean-afro-vocal-icons`       | `/taxonomy/canon-key-artists#caribbean-afro-roots-leading-voices`    | High       | Strong intent match     |
| `folk-regional-vocal-storytellers` | `/taxonomy/canon-key-artists#folk-regional-leading-voices-global`    | High       | Strong intent match     |

### Usable but imperfect replacements

These legacy categories do not have a clean 1:1 taxonomy destination.

| Legacy category slug                  | Recommended taxonomy target                                            | Confidence | Note                                              |
| ------------------------------------- | ---------------------------------------------------------------------- | ---------- | ------------------------------------------------- |
| `club-sounds-nightlife-beats`         | `/taxonomy/electronic-club-nightlife`                                  | Medium     | Fits the parent section, but no exact subsection  |
| `breaks-experimental-soundscapes`     | `/taxonomy/electronic-club-nightlife`                                  | Medium     | No dedicated taxonomy subsection yet              |
| `breaks-experimental-avant-voices`    | `/taxonomy/canon-key-artists#breaks-experimental-leading-avant-voices` | Medium     | Artist-focused replacement only                   |
| `countries-regional-vocal-traditions` | `/taxonomy/countries-regional-traditions`                              | Medium     | Regional section exists, but no vocal-only anchor |

## Practical Conclusion

The old category layer has been removed from the content model and page tree.
What remains is the redirect layer for backward compatibility.

The remaining cleanup path is:

1. Keep redirects while old links may still exist externally.
2. Update historical docs and QA notes away from `/categories/*`.
3. Optionally remove redirects later if there is no longer SEO or user value in preserving them.

## Suggested Next Implementation Step

Monitor whether the redirect layer is still needed long term.

- If yes: keep `apps/knowledge/src/constants/categoryRedirects.js` as the source of truth.
- If no: remove the redirect entries from `astro.config.mjs` in a later cleanup pass.
