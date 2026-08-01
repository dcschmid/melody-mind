\version "2.26.0"
\paper { tagline = ##f }
\layout { indent = 0 }
bass = \relative c { \clef bass \key e \minor \time 4/4 e,4 r8 e g4 a | e4 r b d | }
kick = \drummode { bd4 r bd r | bd4 r8 bd r4 bd | }
harmony = \relative c' { \key e \minor <e g b>2 r | <d fis a>4 r <e g b>2 | }
\score { << \new Staff { \bass } \new DrumStaff { \kick } \new Staff { \harmony } >> }
