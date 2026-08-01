\version "2.26.0"
\paper { tagline = ##f }
\layout { indent = 0 }
openPart = \relative c { \clef "treble_8" \key e \minor \time 4/4 <e b' e>4 r <g d' g> <e b' e> | <e b' e> <b' fis' b> r <d a' d> | }
mutedPart = \relative c { \clef "treble_8" \key e \minor e,8-. e-. r e-. e-. e-. r e-. | e-. e-. e-. r e-. r e-. e-. | }
accents = \drummode { bd4 r8 sn bd4 sn | r8 bd4 sn8 r bd4 sn8 | }
\score { << \new Staff \with { instrumentName = "Open" } { \openPart } \new Staff \with { instrumentName = "Muted" } { \mutedPart } \new DrumStaff { \accents } >> }
