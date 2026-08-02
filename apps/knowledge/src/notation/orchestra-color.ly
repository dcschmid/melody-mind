\version "2.26.0"
\paper { tagline = ##f }
\layout { indent = 0 }
\score {
  \new StaffGroup <<
    \new Staff \with { instrumentName = "Winds" } { \relative c'' { \key d \minor \time 4/4 a4 g f a | d, e f2 } }
    \new Staff \with { instrumentName = "Brass" } { \relative c' { d1 | <a c e>2 <d f a> } }
    \new Staff \with { instrumentName = "Strings" } { \relative c' { <d f a>2 <c e g> | <bes d f> <a c e> } }
    \new RhythmicStaff \with { instrumentName = "Perc." } { c2 r | c4 r c2 }
  >>
}
