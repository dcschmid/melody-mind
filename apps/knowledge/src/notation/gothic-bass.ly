\version "2.26.0"
\paper { tagline = ##f }
\layout { indent = 0 }
gothBass = \relative c { \clef bass \key d \minor \time 4/4 d,8 a' d, a' f c' f, c' | d, a' d, a' g d' g, d' | }
metalGuitar = \relative c { \clef "treble_8" \key d \minor <d a' d>4 r8 q <f c' f>4 <g d' g> | <d a' d>8 q r4 <a' e' a>2 | }
drumPart = \drummode { <bd sn>4 hh sn hh | bd hh <bd sn> r | }
\score { << \new Staff \with { instrumentName = "Goth bass" } { \gothBass } \new Staff \with { instrumentName = "Metal guitar" } { \metalGuitar } \new DrumStaff { \drumPart } >> }
