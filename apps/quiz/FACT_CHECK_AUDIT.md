# Quiz Fact-Check Audit

Date: 2026-05-15

## Scope

- Reviewed all quiz content files in `apps/quiz/src/content/quizzes`.
- Validated the built quiz payload across 20 quiz pages and 1014 questions.
- Checked every file for question count, answer-index validity, and high-risk historical wording.
- Externally checked concrete historical anchors such as chart records, awards, launch dates,
  label foundations, and "first" claims against official or authoritative sources where
  possible.

## Corrections Made

- Reworded Kyu Sakamoto's "Sukiyaki" claim from "first non-English song" to
  "first Japanese-language song" because earlier non-English Hot 100 number ones exist.
- Reworded 2019 US streaming revenue from "more than 80%" to "nearly 80%" to match RIAA's
  79.5% figure.
- Replaced the ambiguous Elvis "Heartbreak Hotel" chart-weeks question with an RCA Victor
  release-label question.
- Clarified that MTV's first aired video was not the first music video ever made.
- Removed or softened unsupported absolute claims such as "the first Black artist" for
  Stevie Wonder's Album of the Year context.
- Replaced broad "dominant genre/platform" wording with narrower claims such as "one of the
  dominant forces" or "one of the leading platforms" where the evidence supported influence
  but not a single uncontested rank.
- Replaced "pioneered" or "inventing" language with "helped pioneer", "developing", or
  "closely associated with" where music-history credit is shared or disputed.
- Scoped Drake's "most-streamed artist of the decade" claim specifically to Spotify's
  2010-2019 global list.
- Scoped the US streaming-revenue question to the United States instead of implying a global
  revenue claim.
- Changed subjective "greatest/all-time/definitive" phrasing to more defensible wording such
  as "classic", "widely regarded", or "a defining statement".

## External Sources Used

- RIAA, 2019 year-end recorded music revenue report:
  https://www.riaa.com/reports/riaa-releases-2019-year-end-music-industry-revenue-report/
- RIAA, 2019 revenue report PDF:
  https://www.riaa.com/wp-content/uploads/2020/02/RIAA-2019-Year-End-Music-Industry-Revenue-Report.pdf
- Spotify Newsroom, 2010-2019 decade streaming lists:
  https://newsroom.spotify.com/2019-12-03/the-top-songs-artists-playlists-and-podcasts-of-2019-and-the-last-decade/
- Pulitzer Prize, Kendrick Lamar's 2018 Music winner page:
  https://www.pulitzer.org/winners/kendrick-lamar
- GRAMMY.com, Cardi B Best Rap Album win:
  https://www.grammy.com/news/cardi-b-wins-best-rap-album-invasion-privacy-2019-grammys
- GRAMMY.com, Esperanza Spalding Best New Artist:
  https://www.grammy.com/news/2021-grammy-rewind-esperanza-spalding-best-new-artist-2011
- GRAMMY.com, Rosalia Latin Grammy Album of the Year:
  https://www.grammy.com/news/rosalia-motomami-album-of-the-year-latin-grammys-2022-winner-speech-video
- Official Charts, Sex Pistols "God Save the Queen":
  https://www.officialcharts.com/songs/sex-pistols-god-save-the-queen/
- Official Charts, Adele's `21`:
  https://www.officialcharts.com/albums/adele-21/
- Official Charts, Adele's `21` as a 21st-century best seller:
  https://www.officialcharts.com/chart-news/adele-s-21-is-now-the-biggest-selling-album-of-the-21st-century__1622/
- Motown Museum, Berry Gordy and Motown history:
  https://www.motownmuseum.org/legacy/berry-gordy/
- Library of Congress, `Bitches Brew` registry entry:
  https://www.loc.gov/programs/national-recording-preservation-board/recording-registry/complete-national-recording-registry-listing/additional-information/
- Library of Congress, `Bitches Brew` description and essay:
  https://www.loc.gov/programs/national-recording-preservation-board/recording-registry/descriptions-and-essays/
- Guinness World Records, BTS as first K-pop act to reach No. 1 on the US albums chart:
  https://www.guinnessworldrecords.com/world-records/534310-first-k-pop-act-to-reach-no-1-on-the-us-albums-chart
- Billboard Canada mirror of Billboard reporting on Bad Bunny and all-Spanish Billboard 200
  number-one albums:
  https://ca.billboard.com/music/chart-beat/bad-bunny-nadie-sabe-lo-que-va-a-pasar-manana-number-one-billboard-200-albums-chart-1235451431/
- Time report citing Billboard's BTS `Love Yourself: Tear` chart result:
  https://time.com/5292964/korean-boyband-bts-k-pop-billboard-200/

## Verification Commands

- `pnpm --filter quiz format`
- `pnpm --filter quiz lint:check`
- `pnpm --filter quiz build`
- Built JSON validator for question counts, options, answer indices, and total question count.
