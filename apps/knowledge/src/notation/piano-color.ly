\version "2.26.0"
\paper { tagline = ##f }
\layout { indent = 0 }
upper = \relative c'' { \key c \major \time 4/4 g4 a b g | e g a2 }
middle = \relative c' { <c e g>2 <d g b> | <c e a> <c f a> }
lower = \relative c { c2 g | a f }
\score {
  \new PianoStaff <<
    \new Staff << \upper \\ \middle >>
    \new Staff { \clef bass \lower }
  >>
}
