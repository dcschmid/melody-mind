<!-- markdownlint-disable MD024 -->

# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### 🚜 Refactor (Unreleased)

- _(seo)_ Remove deprecated legacy utilities `seoText.ts`, `metaUtils.ts`, `seoBasics.ts`; logic
  consolidated into `textUnified.ts` + `buildPageSeo.ts`.

### 📚 Documentation (Unreleased)

- _(seo)_ Update `docs/seo-architecture.md` & `README.md` with unified SEO pipeline and removal
  notes.

## [4.1.0] - 2025-03-30

### ⚙️ Miscellaneous Tasks

- Add CHANGELOG.md and cliff.toml for tracking project changes and managing changelog generation

## [4.0.0] - 2025-03-28

### 🚀 Features

- _(knowledge-de)_ Add comprehensive articles for the 1950s and 1960s music eras to enhance cultural
  content and user engagement
- Add danish articles
- Add english articles
- Add english articles
- Add spanish articles
- Add spanish articles
- Add finish articles
- Add french and italian articles
- Add nl, pt and sv articles
- Enhance accessibility and error handling across the application
- Add new category image and add new playlist links
- _(seo)_ Enhance SEO for multiple pages by adding meta descriptions and keywords generation

### 🐛 Bug Fixes

- Fixes
- Prettier fixes
- _(astro)_ Update image paths to include language-specific variations for social sharing images in
  knowledge, playlists, and podcasts pages to enhance localization support
- Category json handling fixes

### 💼 Other

- Add new german articles

### 🎨 Styling

- _(global.css)_ Add margin-bottom to paragraph elements for improved spacing in the layout
- _(Joker.astro)_ Clean up whitespace and formatting for improved readability and consistency in the
  code structure
- _(knowledge/index.astro, podcasts.astro)_ Format comments and code for improved readability and
  consistency
- _(knowledge)_ Format code for better readability and consistency in spacing and line breaks

### ⚙️ Miscellaneous Tasks

- _(EndOverlay.astro)_ Remove unused removeEventListener function to clean up code and improve
  maintainability
- Clean up whitespace and improve code formatting across multiple files for better readability and
  maintainability

## [3.0.0] - 2025-03-19

### 🚀 Features

- _(overlays)_ Implement social media sharing functionality
- _(tests)_ Implement GameHeadline and Joker component tests
- _(testing)_ Add test configuration and component tests
- Multi-language Support and Localization
- Add safety checks for share button handlers
- _(i18n)_ Add internationalization support across game components
- _(i18n)_ Add language picker component
- _(elements-cache)_ Add validation and type-safe optimization for game elements
- Add content collection
- Integrate Tailwind CSS for improved styling and responsiveness

### 🐛 Bug Fixes

- Move Fathom Analytics script to head and add is:inline directive
- Add null checks for menu button handlers

### 🚜 Refactor

- Improve CSS property ordering and media query syntax
- _(game)_ Extract score display logic into separate utility
- [**breaking**] Extract loadQuestion logic into separate utility
- Extract handleAnswer logic into separate utility
- _(api)_ Simplify database operations in saveTotalUserPointsAndHighscore
- Improve game logic and DOM handling
- Improve type safety for difficulty handling
- Implement JokerManager class for improved joker functionality
- Improve type safety and error handling
- Improve type safety and code cleanup

### ⚙️ Miscellaneous Tasks

- Lint fixes
- Lint fixes
- Lint fixes
- Lint fixes
- Lint fixes
- Deps upgrade

## [2.12.0] - 2024-11-16

### 🚀 Features

- _(PlaylistItem)_ Verbessere Barrierefreiheit und Performance
- _(ErrorMessage)_ Verbesserte Fehlermeldungskomponente mit Auto-Hide
- _(components)_ Verbessere Zugänglichkeit und Performance der Spielkomponenten
- _(EndOverlay)_ Verbesserte Zugänglichkeit und Performance-Optimierungen
- _(overlay)_ Verbesserte Zugänglichkeit und Performance des Feedback-Overlays

### 🐛 Bug Fixes

- _(gamehome)_ [**breaking**] Verbessere Filterfunktion und Liste-Layout

### 💼 Other

- _(gamehome)_ Verbessere Typsicherheit und Benutzerfreundlichkeit
- _(Button)_ Cleanup

### 🚜 Refactor

- _(GameHeadline)_ Verbessere Barrierefreiheit und Performance
- _(HeaderSection)_ Verbessere Performance und Zugänglichkeit der Benutzerprofilkomponente
- _(IntroText)_ Optimiere Komponenten-Styling und entferne Kommentare
- _(LoadingSpinner)_ [**breaking**] Verbessere Komponenten-Architektur und Zugänglichkeit
- _(GoldenLPOverlay)_ Verbessere Zugänglichkeit und Performance
- _(audio)_ [**breaking**] Enhance AudioController implementation and documentation
- _(db)_ Improve getGoldenLPs function and documentation
- _(db)_ [**breaking**] Improve golden LP data handling and types
- _(ErrorHandler)_ Verbessere Code-Struktur und Zugänglichkeit
- _(game)_ [**breaking**] Optimize getRandomQuestion function and improve type safety
- _(game)_ Improve error handling and type safety in game utils
- _(game)_ [**breaking**] Improve answer handling and documentation
- _(jokerUtils)_ [**breaking**] Improve type safety and documentation
- _(utils)_ [**breaking**] Enhance TypeScript documentation and type safety
- _(utils)_ Improve type safety and error handling
- _(QueueManager)_ Enhance type safety and error handling
- Enhance user points saving and round data type safety
- _(utils)_ [**breaking**] Improve shuffleArray implementation and documentation

### 📚 Documentation

- _(auth)_ Improve email validation documentation
- _(error)_ Improve error handling documentation and type safety
- _(utils)_ [**breaking**] Improve getTitleBasedOnDifficulty documentation

## [2.11.0] - 2024-11-15

### 🚀 Features

- Add symphonic-black-metal category
- Add symphonic-metal category
- Add synth-pop category
- Add tango category
- Add technical-death-metal category
- Add techno category
- Add trance category
- Add thrash-metal category
- Add traurig category
- Add trip-hop category
- Add czech category
- Add turkey category
- Add ukraina category
- Add viking-metal category
- Add dark-mode and improve accessibility
- Add fathom analytics and improve general Layout
- _(a11y)_ [**breaking**] Improve WCAG AAA compliance across components

### 🐛 Bug Fixes

- Improve gamehome layout

### ⚙️ Miscellaneous Tasks

- Set correct streaming links on 60er category
- Change fevicons
- Improve light mode

## [2.10.0] - 2024-11-09

### 🚀 Features

- Add classic category
- Add new piano questions
- Add columbia category
- Add cuba category
- Add latino category
- Update latin-vibes question
- Add mandopop category
- Add math-metal category
- Add melodic-death-metal category
- Add metalcore category
- Add mexican category
- Add neo-classical-metal category
- Add new-age category
- Improve seo implementation
- Add new-wave-of-british-heavy-metal category
- Add noise-metal category
- Add nu-metal category
- Add opera category
- Add party-on category
- Add peruanisch category
- Add poland category
- Add new pop-rock questions
- Add pop category
- Add post-hardcore category
- Add post-metal category
- Add power-metal category
- Add power-pop category
- Add progressive-metal category
- Activate missing categories
- Add psych-rock category
- Add punk category
- Add r-n-b category
- Add rainyday category
- Add reggae category
- Add reggaeton category
- Add road-trip category
- Add rock-n-roll category
- Add rock category
- Add rockabilly category
- Add russian category
- Add salsa category
- Add samba category
- Add schlager category
- Add swedish category
- Add screamo category
- Add sertanejo category
- Add ska category
- Add sludge-metal category
- Add songwriter category
- Add soul category
- Add new spanisch questions
- Add speed-metal category
- Add stoner-metal category
- Add summer-hits category

### 🐛 Bug Fixes

- Image file names
- One error fix
- One error fix
- Set correct focus and scroll postion on feedbackOverlay

### ⚙️ Miscellaneous Tasks

- Move functions to seperate to utils files
- Add retry logic
- Lint fixes
- Add astr-compress
- Activate speed-meatl
- Set correct streaming links on 50er category

## [2.9.0] - 2024-10-31

### 🚀 Features

- Add dark-metal category
- Add new death-metal questions
- Add daenisch category
- Add new deep-house questions
- Add desert-rock category
- Add detroit-techno category
- Add new german questions
- Add new german-rap questions
- Add disco-fever category
- Add doom-metal category
- Add drum-and-bass category
- Add experimental-metal category
- Add movie-soundtrack category
- Add finish category
- Add folk-metal category
- Add folk category
- Add forro category
- Add french category
- Add funeral-doom-metal category
- Add funk category
- Add garage category
- Add guitare category
- Add gospel category
- Add gothic category
- Add gothic-metal category
- Add 80er category
- Add 90er category
- Add grindcore category
- Add groove-metal category
- Add groove category
- Add grunge category
- Add hair-metal category
- Add haiwaii category
- Add happy category
- Add hard-rock category
- Add hardstyle category
- Add heavy-psych category
- Add holiday category
- Add house category
- Add industrial-metal category
- Add j-dance category
- Add j-rock category
- Add 50er category
- Update heavy-metal questions
- Add hip-hop category
- Add jazz category
- Add indie-pop category
- Add indie category
- Add industrial category
- Add iran category
- Add irish category
- Improve accessibility
- Add 60er category
- Add 70er category
- Add argentinia category
- Add horror-metal category
- Add india category
- Add iceland category
- Add j-pop category
- Add jazz-metal category
- Add new k-pop questions
- Add kinder category
- Improve accessibility

### 🐛 Bug Fixes

- Fix daenisch umage urls
- Fix file names
- Lint fixes

## [2.8.0] - 2024-10-20

### 🚀 Features

- Add new afrobeat questions
- Add new alternative-metal questions
- Add new alternative-rock questions
- Add new ambient questions
- Add new belgium questions
- Add acoustic-metal category
- Add new afrobeat questions
- Add new alternative-metal questions
- Add new alternative-rock questions
- Add ambient-metal category
- Add avant-garde-metal category
- Add new belgium questions
- Add new black-metal questions
- Add blackeneded-death-metal category
- Add new blues questions
- Add new brazil questions
- Add new ambient questions
- Add new bluegrass questions
- Add new bosssa-nova questions
- Prepare new categories
- Add new breakbeat questions
- Add new british questions
- Add new cantopop questions
- Add celtic-metal category
- Add chamber-metal category
- Activate chamber-metal category
- Add new chicago-house questions
- Add chrisitan-metal category
- Add new classic-heavy-metal questions
- Add new classic-rock questions
- Add club category
- Add coregrind category
- Add country category
- Add crossover-trash category
- Add dancehall category
- Activate dancehall category
- Prepare new categories

### 🐛 Bug Fixes

- Set correct preview url and apple-music link
- Stop audio preview when overlay will be closed
- Sort categories json

### ⚙️ Miscellaneous Tasks

- Update deps
- Feedbackoverlay improvements
- Cleanup categories

## [2.7.0] - 2024-10-15

### 🚀 Features

- Improve header style
- Add new heavy-metal cover images and add spotify and deezer links
- Add new afrobeat questions
- Prepare new catgegories descriptions
- Add new alternative-rock questions
- Add new ambient questions
- Add new belgium questions
- Add new black-metal questions
- Add bluegrass category
- Add blues category
- Add alternative-metal category
- Add bossa-nova category
- Add new brazil questions
- Add breakbeat category
- Add new english questions
- Add cantopop category
- Add chicago-house category
- Add classic-heavy-metal category
- Prepare new categories
- Improve getRandomQuestion function

### 🐛 Bug Fixes

- Add home button to game pages too

### ⚙️ Miscellaneous Tasks

- Improve shuffle array function
- Improve shuffle array function
- Improve feedback overlay styling
- Improve feedback overlay styling
- Sort categories json
- Prettier fixes
- Layout improvements

## [2.6.0] - 2024-10-08

### 🚀 Features

- Add piano category
- Add classic-rock category
- Add ambient category
- Add black-metal category
- Add afrobeat category
- Add alternative-rock category
- Add britisch category
- Add brazil category
- Add german-rap category
- Set overlay focus and cleanup
- Improve feedback overlay and fix scroll position
- Add new afrebeat cover images and add spotify and deezer links
- Add new alternative-rock cover images and add spotify and deezer links
- Add new ambient cover images and add spotify and deezer links
- Add new belgisch cover images and add spotify and deezer links
- Add new black-metal cover images and add spotify and deezer links
- Add new brasilianisch cover images and add spotify and deezer links
- Add new britisch cover images and add spotify and deezer links
- Add new classic-rock cover images and add spotify and deezer links
- Add new death-metal cover images and add spotify and deezer links
- Add new deep-house cover images and add spotify and deezer links
- Add new german cover images and add spotify and deezer links
- Add new german rap cover images and add spotify and deezer links

### 🐛 Bug Fixes

- Hide spotify, deezer and audio player if the urls are null

### ⚙️ Miscellaneous Tasks

- Deps upgrades

## [2.5.0] - 2024-09-29

### 🚀 Features

- Move saveGoldenLP and saveScoreToDB to ts file
- Add top25 latin-vibes elements
- Add new pop-rock and latin-vibes questions
- Add heavy metal category
- Add spanish category
- Add k-pop category
- Add belgium category
- Add germany category
- Add deep-house category
- Add death-metal category

### 🐛 Bug Fixes

- Feedback overlay max-width
- Set correct max-width
- Style improvement and fixes
- Set correct deep-house cover paths
- Fix spanish covers urls

### ⚙️ Miscellaneous Tasks

- Stylelint fixes
- Update the questions and answers and covers

## [2.4.0] - 2024-09-21

### 🚀 Features

- Make seperate gameheadline component
- Improve fun fuct overlay styling and move it to an extra astro file
- Improve endgame overlay
- Improve golden lp overlay
- Move loading spinner in an extra astro file
- Move joker in a sepeate astro file
- Improve header styles
- Add setupJokers ts file
- Add calculateBonusPoints function
- Add showFeedback function
- Add showOverlay function
- ShowEndGamePopup ts function
- Add endgame ts function
- Add updateScoreDisplay ts function
- Add showGoldenLpPopup ts function
- Add setupJokerEvent ts function

### 🐛 Bug Fixes

- Improve feedback styling
- Fix the setupJokers function
- ShowFeedback funktion fixes

### ⚙️ Miscellaneous Tasks

- Move use5050Joker function to ts file
- Move loadQuestion function to ts file
- Move updateRoundProgress function to ts file
- Dependecies upgrades

## [2.3.0] - 2024-09-19

### 🚀 Features

- Remove type image questions
- Add new pop-rock genre items
- Add astro-compressor package
- Add jokers
- Ui improvements and add some loading animations
- Add speed bonus

### 🐛 Bug Fixes

- Improve joker

### ⚙️ Miscellaneous Tasks

- Update dependecies
- Update readme

## [2.2.0] - 2024-09-12

### 🚀 Features

- Remove type image questions
- Remove type image questions
- Add difficulty level system and clean mp3 folder
- Add difficulty golden lp types
- Add music links in the trivia overlay
- Add yahoo login
- Add new favicons
- Add new favicons

### 🐛 Bug Fixes

- Stylelint fixes
- Improve game overlays styles

### ⚙️ Miscellaneous Tasks

- Update gamerule and index page
- Add new svg and remove old unused svgs

## [2.1.0] - 2024-09-06

### 🚀 Features

- Add finish popup and styles improvement
- Add golden lp feature
- Melody mind rebranding

### 🐛 Bug Fixes

- Linter fixes
- Change title
- Lint fixes

### ⚙️ Miscellaneous Tasks

- Update README.md
- Deps upgrades
- Add more pop-rock items

## [2.0.0] - 2024-09-04

### 🚀 Features

- Add new heavy metal items
- Add new pop rock items
- Add switch to new game mode and cleanup

### 🐛 Bug Fixes

- Downgrade dependecy
- Set right url in astro config

### ⚙️ Miscellaneous Tasks

- Remove compress
- More cleanup

## [1.8.0] - 2024-08-31

### 🚀 Features

- Prepare new categories

## [1.7.0] - 2024-08-30

### 🚀 Features

- Improve gamerules page styles
- Improve PlaylistItem styles
- Improve gamehome styles
- Improve rounds styles
- Improve results styles
- Improve trivia styles
- Improve trivia finished styles

### 🐛 Bug Fixes

- Trivia solution logic
- More small design issues fixes
- More small design improvements
- Fix the point calculation

### ⚙️ Miscellaneous Tasks

- Mark non playable genres
- Deps upgrades

## [1.6.0] - 2024-08-29

### 🚀 Features

- Improve highscore logic and finished styling
- Add gamerules page
- Add source sans pro font
- Add new favicons
- Add health check route

### 🐛 Bug Fixes

- Some gamelogic fixes and improve text
- Image in the trivia solution is now loading correctly
- Set correct oauth urls

### ⚙️ Miscellaneous Tasks

- Remove video

## [1.5.0] - 2024-08-28

### 🚀 Features

- Add total highscore and genre highscore saving
- Add highscore logic and basic styles for highscore page
- Add husky, prettier, eslint and stylelint

### 🐛 Bug Fixes

- Stylelint fixes

### ⚙️ Miscellaneous Tasks

- Add new highscore db schemas

## [1.4.0] - 2024-08-27

### 🚀 Features

- Add new genres
- New colors and new design

### 🐛 Bug Fixes

- Set correct spotify cookie
- Set correct spotify permission
- Set correct name and points in the finish popup

## [1.3.0] - 2024-08-25

### 🚀 Features

- Increase cookie time and redirecting unauthenticated users to the login page
- Save and read total user points from db
- Remove spotify genre fetching

### 🐛 Bug Fixes

- Fix header styles
- Improve header styles

### ⚙️ Miscellaneous Tasks

- Remove zerops config file
- Add Import Aliases
- Cleanup build command

## [1.2.0] - 2024-08-24

### 🚀 Features

- Show user fav sptify genres and add a search function

### ⚙️ Miscellaneous Tasks

- Add new category images

## [1.1.0] - 2024-08-24

### 🚀 Features

- Add google auth
- Reactivate spotify auth
- Add email password auth
- Add zeroops.yml
- Add new login page Layout
- Add new login icons and auth cleanup
- Move genre albums data in seperated json files

### 🐛 Bug Fixes

- Set correct redirect urls for google and github auth
- Fix google and github auth

### ⚙️ Miscellaneous Tasks

- Cleanup
- Cleanup
- Set fix port
- Deps upgrades
- Reactivate spotify login

## [1.0.1] - 2024-08-22

### 🚀 Features

- Db schema update and cleanup

## [1.0.0] - 2024-08-21

### 🚀 Features

- Add startpage
- Add gamehome page
- Add category page
- Beginn round one page and round one results
- Add trivia page
- Add astro-compress
- Finalize round 1 solution page
- Finished cover-shuffle game styles
- Finished cover-shuffle game logic
- Add round one joker
- Add mp3s
- Add round 2 and 3
- Add nilz video page
- Add logic for round one
- Add trivia 1 logic
- Round 2 logic
- Add logic round 3
- Trivia 2 and 3 logic
- New category site
- Add user page
- Add new login screen
- Begin round refactoring
- Move rounds elements to astro components
- Move results elements to astro components
- New joker components
- Points calculation
- More improvement in the user section
- Add new share icon
- Add changeUserName function
- Move to dynamic pages
- Move joker to bottom and show them after 20 seconds
- Show current coins in all rounds in the header
- Add more jokers fun facts
- Create fetchRoundUIData helper file
- Deps upgrade
- Switch to node adapter
- Add github login
- Use username and profilepic from session
- Add spotify oauth login

### 🐛 Bug Fixes

- Set correct trivia link
- Small style fixes
- Hide buttons when the round page load
- Disable joker on the category page
- Some logic fixes
- Solution fixes
- Small design fixes for user frames
- Set correct resetLocalStorage
- Improve joker behaviour
- Improve trivia logic
- Improve coverflow layout
- Improve trivia and joker
- ClearLocalStorageAfterLastRound improvement
- Small design fixes
- Astro db --remote flag

### ⚙️ Miscellaneous Tasks

- Small improvements
- Switch to static build
- Small improvement
- Remove git lfs and put a smaller video
- Improve images
- Hide user link on pages with timer
- Change overlay text
- Change settings icons
- New joker icons
- Astro upgrade
- Clean up FinishOverlay
- Improve user styles
- Spell correction
- More user improvements
- Add poprock-rocketeer
- Removed unused files
- Refactor result pages
- Refactor trivia script code
- Refactor round logic
- Trivia utils improvement
- Change some categories on the gamehome
- Remove solid.js package and netlify folder

<!-- generated by git-cliff -->
