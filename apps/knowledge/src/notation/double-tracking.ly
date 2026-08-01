\version "2.26.0"
\paper { tagline = ##f }
\layout { indent = 0 }
takeOne = \relative c { \clef "treble_8" \key e \minor \time 4/4 <e b' e>4 r8 <g d' g> <a e' a>4 <e b' e> | <e b' e>4 <g d' g> <b fis' b> r | }
takeTwo = \relative c { \clef "treble_8" \key e \minor \time 4/4 r16 <e b' e>8. r8 <g d' g> <a e' a>4 <e b' e> | <e b' e>8. r16 <g d' g>4 <b fis' b> r | }
\score { << \new Staff \with { instrumentName = "Take 1" } { \takeOne } \new Staff \with { instrumentName = "Take 2" } { \takeTwo } >> }
