\version "2.26.0"
\paper { tagline = ##f }
\layout { indent = 0 }
downstrokes = \relative c { \clef "treble_8" \time 4/4 <e b' e>8-> q q q <g d' g> q <a e' a> q | <e b' e> q <g d' g> q <b fis' b>4-> r | }
accents = \relative c { \clef "treble_8" \time 4/4 <e b' e>4-> q8 q <g d' g>4-> <a e' a> | <e b' e>8 q <g d' g>4-> <b fis' b>4-> r | }
drumPart = \drummode { <bd sn>4 hh sn hh | <bd sn> hh <bd sn> r | }
\score { << \new Staff \with { instrumentName = "Downstrokes" } { \downstrokes } \new Staff \with { instrumentName = "Accents" } { \accents } \new DrumStaff { \drumPart } >> }
