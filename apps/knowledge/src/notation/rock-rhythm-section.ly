\version "2.26.0"
\paper { tagline = ##f }
\layout { indent = 0 }
drumPart = \drummode { <bd sn>4 hh sn hh | bd hh <bd sn> r }
bass = \relative c { \clef bass e4 e g a | e r b d }
guitar = \relative c { \clef "treble_8" <e b' e>4 r <g d' g> <a e' a> | <e b' e> <g d' g> <b fis' b> r }
\score { << \new DrumStaff { \drumPart } \new Staff { \bass } \new Staff { \guitar } >> }
