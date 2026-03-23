/**
 * Music Taxonomy Data - Master Music Taxonomy Structure
 *
 * 21 Main Sections with hierarchical subsections and optional groups.
 * Topics/Articles come from knowledge-en/ folder and are linked via frontmatter.
 *
 * Based on: Melody Mind Categories.md
 */
import type { TaxonomySection } from "../types/taxonomy";

export const musicTaxonomy: TaxonomySection[] = [
  // ============================================================
  // I. Time, Change & Musical Evolution
  // ============================================================
  {
    id: "time-change-evolution",
    numeral: "I",
    title: "Time, Change & Musical Evolution",
    description:
      "Explore how music changed over time, from the birth of rock to the digital age. Discover the forces that shaped those changes and how music continues to influence the world around us.",
    image: "/taxonomy/time-change-evolution.jpg",
    subsections: [
      {
        id: "music-through-decades",
        title: "Music Through the Decades",
        description:
          "Travel from the 1950s to today and experience the sounds, artists, and cultural shifts that defined each era. Learn what made each period in music history distinct.",
      },
      {
        id: "cross-decade-lenses",
        title: "Cross-Decade Lenses",
        description:
          "Explore different ways of studying music across long stretches of time, including genre change, technology, society, business, and culture. Each lens offers a clearer view of how music evolves and why those changes matter.",
        groups: [
          {
            id: "genre-evolution-pathways",
            title: "Genre Evolution Pathways",
            description:
              "Follow how different musical styles changed over time, from blues to metal and from classical to neo-classical. See how genres connect, influence one another, and branch into new forms.",
          },
          {
            id: "technology-lens",
            title: "Technology Lens",
            description:
              "See how multitrack recording, synthesizers, sampling, digital audio workstations (DAWs), and streaming changed the sound of music. Learn how major technological shifts reshaped both music-making and listening habits.",
          },
          {
            id: "society-lens",
            title: "Society Lens",
            description:
              "Discover how social justice, women's rights, migration, youth culture, and activist movements have shaped music over time. As society changes, music changes with it.",
          },
          {
            id: "industry-lens",
            title: "Industry Lens",
            description:
              "Examine how radio, record labels, MTV, streaming platforms, and gatekeepers shape what we hear. Learn more about the business side of musical trends, access, and discovery.",
          },
          {
            id: "memory-lens",
            title: "Memory Lens",
            description:
              "Explore how the past continues to shape the present. See how musical memory influences current sounds, listening habits, and wider cultural trends.",
          },
          {
            id: "scene-lens",
            title: "Scene Lens",
            description:
              "Follow the path from small local scenes to major global movements. Discover how communities build their own culture and turn local energy into lasting musical impact.",
          },
          {
            id: "decade-diagnostic",
            title: "Decade Diagnostic",
            description:
              "Take a closer look at each decade by examining production methods, popular instruments, and vocal styles. Learn how technical details gave every era its own sound.",
          },
          {
            id: "legacy-lens",
            title: "Legacy Lens",
            description:
              "Look at songs as cultural markers, albums as historical landmarks, and music as something that keeps finding new uses. See how music continues to shape lives and inspire new generations.",
          },
        ],
      },
    ],
  },

  // ============================================================
  // II. Voices, Identity & Representation
  // ============================================================
  {
    id: "voices-identity-representation",
    numeral: "II",
    title: "Voices, Identity & Representation",
    description:
      "Celebrate the voices that shaped music history across every genre and era. Explore global female icons, genre-defining artists, and discover the human voice as the ultimate instrument of expression.",
    image: "/taxonomy/voices-identity.jpg",
    subsections: [
      {
        id: "global-female-icons",
        title: "Global Female Icons",
        description:
          "Discover the women who redefined music across every genre, from classical to hip hop, from rock to electronic. Explore trailblazing vocalists, songwriters, and cultural pioneers who broke barriers and inspired generations.",
        image: "/taxonomy/global-female-icons.jpg",
        groups: [
          {
            id: "vocal-genre-icons",
            title: "Vocal & Genre Icons",
            description:
              "Meet the powerhouse vocalists and genre-defining artists who set new standards for excellence across all musical styles. Understand how their voices became the benchmark for generations of singers.",
          },
          {
            id: "rock-alternative-female",
            title: "Rock & Alternative",
            description:
              "Explore the women who challenged conventions in rock, punk, grunge, and alternative music. Discover how they broke through barriers and created space for female artists in predominantly male-dominated scenes.",
          },
          {
            id: "hiphop-urban-female",
            title: "Hip Hop & Urban",
            description:
              "Meet the MCs, producers, and visionaries who shaped hip hop and R&B culture. Learn how women in urban music built influential careers and redefined the possibilities for female artists.",
          },
          {
            id: "roots-songwriting-female",
            title: "Roots & Songwriting",
            description:
              "Discover folk, country, and singer-songwriter traditions through female perspectives. Explore how women carried forward acoustic storytelling traditions and created powerful songwriting legacies.",
          },
          {
            id: "electronic-experimental-female",
            title: "Electronic & Experimental",
            description:
              "Meet the pioneers in electronic music, ambient, and avant-garde sound exploration. Understand how women pushed the boundaries of electronic music and created new sonic landscapes.",
          },
          {
            id: "classical-art-female",
            title: "Classical & Art",
            description:
              "Explore opera singers, composers, and classical musicians who achieved excellence in traditionally male-dominated spaces. Discover how women shaped classical music through performance, composition, and leadership.",
          },
          {
            id: "global-regional-female",
            title: "Global & Regional Perspectives",
            description:
              "Meet artists carrying forward traditions from every corner of the world, preserving cultural heritage while innovating. Explore how regional female artists bridge traditional sounds with contemporary expression.",
          },
          {
            id: "narrative-axes-female",
            title: "Narrative Axes (Across All Genres)",
            description:
              "Discover common themes and stories that connect female artists across musical boundaries. Explore how shared experiences of womanhood create powerful cross-genre narratives and artistic connections.",
          },
          {
            id: "voice-body-representation",
            title: "Voice, Body & Representation",
            description:
              "Understand how women navigate visual culture, body politics, and artistic authenticity in the music industry. Explore the complex relationship between female artists, image, and self-presentation.",
          },
          {
            id: "lineage-community-female",
            title: "Lineage & Community",
            description:
              "Explore mentorship, collaboration, and the networks that support and empower female artists. Discover how communities of women in music create opportunities and sustain artistic development.",
          },
          {
            id: "beyond-the-mic",
            title: "Beyond the Mic",
            description:
              "Meet the producers, executives, and industry leaders shaping music behind the scenes. Understand how women have built power and influence in the business and creative sides of music.",
          },
        ],
      },
      {
        id: "voice-as-instrument",
        title: "Voice as an Instrument",
        description:
          "Explore the human voice in all its possibilities, from classical virtuosity to contemporary techniques. Discover how vocal performance, emotional expression, and extended techniques create musical meaning without words.",
        image: "/taxonomy/voice-instrument.jpg",
        groups: [
          {
            id: "technical-expression",
            title: "Technical Expression",
            description:
              "Understand range, control, agility, and the mechanics of exceptional vocal performance. Explore the technical foundations that make the human voice one of music's most versatile instruments.",
          },
          {
            id: "emotional-human-dimensions",
            title: "Emotional & Human Dimensions",
            description:
              "Discover how vulnerability, storytelling, and authenticity create a deep connection between singer and listener. Explore the emotional power of the voice to convey feeling and meaning.",
          },
          {
            id: "identity-lived-experience",
            title: "Identity & Lived Experience",
            description:
              "Understand the voice as a carrier of culture, identity, and personal history. Explore how vocal style, accent, and expression reflect both individual and collective identities in music.",
          },
          {
            id: "studio-mediation",
            title: "Studio & Mediation",
            description:
              "Explore Auto-Tune, layering, processing, and the crafted vocal sound in modern recording. Understand how studio techniques transform and enhance the natural voice while raising questions about authenticity.",
          },
          {
            id: "collective-expression",
            title: "Collective Expression",
            description:
              "Experience harmonies, choirs, call-and-response, and the power of voices united in musical expression. Discover how group singing creates community and transcends individual performance.",
          },
          {
            id: "extended-vocal-techniques",
            title: "Extended Vocal Techniques",
            description:
              "Explore beatboxing, throat singing, vocal percussion, and experimental approaches to vocal performance. Discover how artists push beyond conventional singing to create new sounds and expressions.",
          },
        ],
      },
    ],
  },

  // ============================================================
  // III. Classical & Orchestral Mastery
  // ============================================================
  {
    id: "classical-orchestral-mastery",
    numeral: "III",
    title: "Classical & Orchestral Mastery",
    description:
      "Move through centuries of musical excellence, from medieval polyphony to contemporary minimalism. Explore the traditions, instruments, and landmark works that define classical and orchestral music across time and cultures.",
    image: "/taxonomy/classical-orchestral.jpg",
    subsections: [
      {
        id: "instrumental-focus",
        title: "Instrumental Focus",
        description:
          "Discover concertos, sonatas, and solo works that highlight the expressive range of individual instruments. Explore how composers and performers reveal each instrument's unique voice through focused repertoire.",
        image: "/taxonomy/classical-instrumental.jpg",
      },
      {
        id: "ensemble-forms",
        title: "Ensemble Forms",
        description:
          "Explore chamber music, string quartets, and the intimate art of small-ensemble collaboration. Discover how composers write masterful works for limited forces and how performers communicate without words.",
        image: "/taxonomy/classical-ensemble.jpg",
      },
      {
        id: "vocal-classical-works",
        title: "Vocal Classical Works",
        description:
          "Explore opera, oratorio, art song, and the meeting point of voice and orchestral tradition. Understand how composers combine vocal virtuosity with orchestral scale to create dramatic and expressive works.",
        image: "/taxonomy/classical-vocal.jpg",
      },
      {
        id: "historical-periods",
        title: "Historical Periods",
        description:
          "Travel through the Baroque, Classical, and Romantic eras as musical style evolves across centuries. Discover how each period developed distinct characteristics, forms, and aesthetics.",
        image: "/taxonomy/classical-periods.jpg",
      },
      {
        id: "modern-classical",
        title: "Modern Classical",
        description:
          "Explore impressionism, serialism, minimalism, and contemporary composers who pushed classical tradition in new directions. Understand how 20th- and 21st-century composers reimagined classical music for new audiences.",
        image: "/taxonomy/modern-classical.jpg",
      },
      {
        id: "performance-interpretation",
        title: "Performance & Interpretation",
        description:
          "Understand the art of interpretation, historically informed performance, and the performer's role in classical music. Discover how musicians bring scores to life through personal expression and informed understanding.",
        image: "/taxonomy/classical-performance.jpg",
      },
      {
        id: "applied-classical",
        title: "Applied Classical",
        description:
          "Explore how classical music intersects with film, pop, education, and everyday life. Discover how classical techniques and aesthetics continue to shape contemporary culture and media.",
        image: "/taxonomy/applied-classical.jpg",
      },
      {
        id: "global-cross-cultural-classical",
        title: "Global & Cross-Cultural Classical Traditions",
        description:
          "Discover classical traditions from India, China, Indonesia, and beyond, alongside diverse Western traditions. Explore how different cultures developed sophisticated systems of theory, notation, and performance practice.",
        image: "/taxonomy/global-classical.jpg",
      },
    ],
  },

  // ============================================================
  // IV. Rock Traditions
  // ============================================================
  {
    id: "rock-traditions",
    numeral: "IV",
    title: "Rock Traditions",
    description:
      "Trace the evolution of rock music from rockabilly and garage rock to grunge and post-rock. Explore the defining movements, sounds, and cultural impact that made rock one of the most influential genres in music history.",
    image: "/taxonomy/rock-traditions.jpg",
    subsections: [
      {
        id: "foundations-early-movements",
        title: "Foundations & Early Movements",
        description:
          "Discover rockabilly, surf rock, and the birth of rock 'n' roll from blues and country roots. See how early rock pioneers created a sound that transformed popular music.",
        image: "/taxonomy/rock-foundations.jpg",
      },
      {
        id: "classic-rock-expansion",
        title: "Classic Rock Expansion",
        description:
          "Explore psychedelic, progressive, and hard rock, the stadium-filling sounds of rock's golden age. Discover how bands pushed the genre's boundaries and created some of its most legendary albums and live shows.",
        image: "/taxonomy/classic-rock.jpg",
      },
      {
        id: "experimental-regional-currents",
        title: "Experimental & Regional Currents",
        description:
          "Explore Krautrock, Canterbury scene, and the experimental rock that defied conventions. Understand how regional scenes created unique sounds and how artists challenged what rock could be.",
        image: "/taxonomy/experimental-rock.jpg",
      },
      {
        id: "punk-post-punk-lineage",
        title: "Punk & Post-Punk Lineage",
        description:
          "Trace the journey from three-chord rebellion to the atmospheric experiments of post-punk and new wave. Discover how punk's raw energy evolved into sophisticated musical explorations and influenced alternative music.",
        image: "/taxonomy/punk-lineage.jpg",
      },
      {
        id: "alternative-indie-rock",
        title: "Alternative & Indie Rock",
        description:
          "Explore college rock, grunge, and the alternative explosion that brought indie into the mainstream. See how independent artists broke through the dominance of major labels and reshaped rock in the 1990s and beyond.",
        image: "/taxonomy/alternative-indie.jpg",
      },
      {
        id: "texture-atmosphere-deconstruction",
        title: "Texture, Atmosphere & Deconstruction",
        description:
          "Discover shoegaze, post-rock, and the emphasis on sonic texture over traditional song structures. Understand how bands prioritized atmosphere, soundscapes, and mood to create immersive musical experiences.",
        image: "/taxonomy/texture-atmosphere.jpg",
      },
      {
        id: "roots-scenes-arena-rock",
        title: "Roots, Scenes & Arena Rock",
        description:
          "Explore heartland rock, Southern rock, and the anthems that fill stadiums worldwide. Discover how rock's connection to regional identity and working-class values created enduring, community-unifying music.",
        image: "/taxonomy/arena-rock.jpg",
      },
    ],
  },

  // ============================================================
  // V. Metal & Heavy Music
  // ============================================================
  {
    id: "metal-heavy-music",
    numeral: "V",
    title: "Metal & Heavy Music",
    description:
      "Trace heavy music from proto-metal roots to modern djent and other extreme forms. Explore the subcultures, sonic innovations, and musical developments that define this passionate global community.",
    image: "/taxonomy/metal-heavy.jpg",
    subsections: [
      {
        id: "foundations-early-metal",
        title: "Foundations & Early Metal",
        description:
          "Discover Black Sabbath, Led Zeppelin, Deep Purple, and the blues-influenced origins of heavy metal. Understand how late 60s and early 70s bands created the foundation for all heavy music that followed.",
        image: "/taxonomy/metal-foundations.jpg",
      },
      {
        id: "extreme-underground-metal",
        title: "Extreme & Underground Metal",
        description:
          "Explore thrash, death metal, black metal, and the drive to push speed, aggression, and darkness to their limits. Discover how underground scenes cultivated intense sounds that challenged mainstream ideas about music.",
        image: "/taxonomy/extreme-metal.jpg",
      },
      {
        id: "melodic-atmospheric-metal",
        title: "Melodic & Atmospheric Metal",
        description:
          "Explore power metal, doom, and gothic metal, where heaviness meets melody and atmosphere. Understand how metal bands create epic, emotional, and immersive soundscapes beyond sheer aggression.",
        image: "/taxonomy/melodic-metal.jpg",
      },
      {
        id: "alternative-modern-metal",
        title: "Alternative & Modern Metal",
        description:
          "Explore nu metal, metalcore, djent, and the contemporary sounds that blend metal with other genres. Discover how modern metal musicians evolved while maintaining heavy music's core power and intensity.",
        image: "/taxonomy/modern-metal.jpg",
      },
      {
        id: "experimental-hybrid-metal",
        title: "Experimental & Hybrid Metal",
        description:
          "Explore avant-garde, progressive, and the genre-defying approaches to heavy music. Understand how artists pushed beyond metal's boundaries, incorporating elements from jazz, folk, electronic, and classical traditions.",
        image: "/taxonomy/experimental-metal.jpg",
      },
      {
        id: "metal-culture-identity",
        title: "Metal Culture & Identity",
        description:
          "Discover the community, aesthetics, philosophy, and the cultural impact of metal worldwide. Explore the visual identity, values, and passionate fandom that make metal one of music's most dedicated subcultures.",
        image: "/taxonomy/metal-culture.jpg",
      },
    ],
  },

  // ============================================================
  // VI. Mainstream Pop & Global Hits
  // ============================================================
  {
    id: "mainstream-pop-global-hits",
    numeral: "VI",
    title: "Mainstream Pop & Global Hits",
    description:
      "Explore chart-topping icons and viral phenomena, discovering the sounds, artists, and cultural moments that define global pop music. Understand how pop music evolves across decades while maintaining its universal appeal and dancefloor dominance.",
    image: "/taxonomy/mainstream-pop.jpg",
    subsections: [
      {
        id: "core-pop-forms",
        title: "Core Pop Forms",
        description:
          "Learn the essential building blocks of pop music, from hooks and choruses to the craft of shaping a standout pop song. Understand what makes songs memorable, singable, and globally successful across languages and cultures.",
        image: "/taxonomy/core-pop.jpg",
      },
      {
        id: "dance-club-pop",
        title: "Dance & Club-Oriented Pop",
        description:
          "Experience the point where pop meets the dancefloor through uptempo anthems built for movement and euphoria. Discover how producers create irresistible beats that power nightlife and party culture worldwide.",
        image: "/taxonomy/dance-pop.jpg",
      },
      {
        id: "youth-indie-alternative-pop",
        title: "Youth, Indie & Alternative Pop",
        description:
          "Discover bedroom pop, indie crossover, and the alternative sounds that influence the pop mainstream. Explore how independent and DIY artists shape pop music from the ground up and create viral sensations.",
        image: "/taxonomy/youth-pop.jpg",
      },
      {
        id: "producer-format-pop",
        title: "Producer-Driven & Format Pop",
        description:
          "Explore hit factories, super-producers, and the craft behind chart dominance. Understand how behind-the-scenes creators and production teams shape pop songs for broad commercial reach and radio appeal.",
        image: "/taxonomy/producer-pop.jpg",
      },
      {
        id: "era-based-pop",
        title: "Era-Based Pop",
        description:
          "Trace the evolving sound of pop music across the decades, from the Brill Building era to the streaming age. Discover how each generation developed its own pop style, production approach, and defining cultural moments.",
        image: "/taxonomy/era-pop.jpg",
      },
      {
        id: "global-pop-movements",
        title: "Global Pop Movements",
        description:
          "Explore K-pop, Latin pop, Afrobeats, and how pop music conquered the world in every language. Understand how non-English pop became dominant globally and how local traditions influence international popular music.",
        image: "/taxonomy/global-pop.jpg",
      },
      {
        id: "crossover-hybrid-pop",
        title: "Crossover & Hybrid Pop",
        description:
          "Discover genre-blending hits that bring together pop, country, hip hop, and beyond musical boundaries. Explore how artists create crossover appeal by combining different genres and reaching diverse audiences simultaneously.",
        image: "/taxonomy/crossover-pop.jpg",
      },
      {
        id: "visual-performance-spectacle",
        title: "Visual, Performance & Spectacle",
        description:
          "Explore music videos, choreography, and the visual artistry of pop superstars. Discover how image, fashion, dance, and multimedia spectacle became central to pop stardom and brand identity.",
        image: "/taxonomy/pop-spectacle.jpg",
      },
    ],
  },

  // ============================================================
  // VII. Indie & Alternative
  // ============================================================
  {
    id: "indie-alternative",
    numeral: "VII",
    title: "Indie & Alternative",
    description:
      "Explore the intimate, experimental, and emotionally rich world of indie and alternative music. Discover how authenticity and creative freedom came together as independent artists built movements that challenged mainstream conventions.",
    image: "/taxonomy/indie-alternative.jpg",
    subsections: [
      {
        id: "origins-post-punk-lineage",
        title: "Origins & Post-Punk Lineage",
        description:
          "Trace the birth of alternative music, from post-punk's experimental edge to early indie ideals. Understand how the DIY ethos and independent spirit created space for authentic expression outside the major label system.",
        image: "/taxonomy/indie-origins.jpg",
      },
      {
        id: "indie-expansion-revival",
        title: "Indie Expansion & Revival",
        description:
          "Experience Britpop, garage rock revival, and when indie music broke into mainstream consciousness. Discover how independent movements gained commercial success while maintaining their artistic integrity and distinctive sounds.",
        image: "/taxonomy/indie-expansion.jpg",
      },
      {
        id: "emotional-hardcore-crossovers",
        title: "Emotional & Hardcore Crossovers",
        description:
          "Explore emo, post-hardcore, and the passionate intensity where punk energy meets emotional vulnerability. Understand how artists created powerful, confessional music that spoke to a generation's feelings and experiences.",
        image: "/taxonomy/emotional-hardcore.jpg",
      },
      {
        id: "atmosphere-deconstruction",
        title: "Atmosphere & Deconstruction",
        description:
          "Discover dream pop, slowcore, and the artists who prioritize mood and texture over conventional song structures. Experience how alternative musicians create immersive soundscapes and challenge traditional notions of pop music.",
        image: "/taxonomy/indie-atmosphere.jpg",
      },
    ],
  },

  // ============================================================
  // VIII. Hip Hop & Rap Culture
  // ============================================================
  {
    id: "hiphop-rap-culture",
    numeral: "VIII",
    title: "Hip Hop & Rap Culture",
    description:
      "Trace hip hop from its Bronx roots to global influence through lyrical storytelling, cultural movements, and sonic innovation. Discover how a local street culture became one of the most powerful musical and cultural forces in the world.",
    image: "/taxonomy/hiphop-rap.jpg",
    subsections: [
      {
        id: "foundations-cultural-elements",
        title: "Foundations & Cultural Elements",
        description:
          "Understand the four pillars of hip hop culture, MCing, DJing, breakdancing, and graffiti, while exploring the genre's birth in the Bronx. Discover how these elements come together to form a cultural movement that extends beyond music.",
        image: "/taxonomy/hiphop-foundations.jpg",
      },
      {
        id: "styles-eras",
        title: "Styles & Eras",
        description:
          "Trace the evolution of hip hop and rap from old school to trap, from golden age to drill. Explore how the sound, style, and lyrical approach of rap evolved across decades and regional scenes.",
        image: "/taxonomy/hiphop-eras.jpg",
      },
      {
        id: "sound-production-aesthetics",
        title: "Sound & Production Aesthetics",
        description:
          "Explore boom bap, G-funk, trap beats, and the production innovations that defined each era of hip hop. Understand how producers built the sonic worlds that gave hip hop its distinctive character and influenced many other genres.",
        image: "/taxonomy/hiphop-production.jpg",
      },
      {
        id: "battle-competition-reputation",
        title: "Battle, Competition & Reputation",
        description:
          "Explore rap battles, beefs, cyphers, and the competitive culture that drives lyrical excellence. Discover how MCs built their reputation through live performance, lyrical skill, and the art of competitive wordplay.",
        image: "/taxonomy/hiphop-battle.jpg",
      },
      {
        id: "narrative-perspectives",
        title: "Narrative Perspectives",
        description:
          "Explore storytelling traditions, concept albums, and the diverse voices that shape hip hop's narratives. Understand how rappers build stories, characters, and social commentary through lyrics and artistic vision.",
        image: "/taxonomy/hiphop-narrative.jpg",
      },
      {
        id: "industry-power-independence",
        title: "Industry, Power & Independence",
        description:
          "Explore labels, ownership, streaming economics, and the business of hip hop culture. Understand how artists gained control over their careers and built independent empires that changed the music industry forever.",
        image: "/taxonomy/hiphop-industry.jpg",
      },
    ],
  },

  // ============================================================
  // IX. Jazz, Soul & Funk Expressions
  // ============================================================
  {
    id: "jazz-soul-funk",
    numeral: "IX",
    title: "Jazz, Soul & Funk Expressions",
    description:
      "Explore the improvisation, emotion, and groove that shaped modern music, from blues and gospel roots to contemporary jazz fusion. Discover how Black musical traditions helped build the foundation of modern popular music and continue to influence sounds around the world.",
    image: "/taxonomy/jazz-soul-funk.jpg",
    subsections: [
      {
        id: "roots-foundations",
        title: "Roots & Foundations",
        description:
          "Explore blues, gospel, and the spiritual traditions that gave birth to jazz and soul. Understand how African American musical roots created the emotional and rhythmic foundation for American popular music.",
        image: "/taxonomy/jazz-roots.jpg",
      },
      {
        id: "jazz-evolution",
        title: "Jazz Evolution",
        description:
          "Follow jazz from New Orleans to bebop and from cool jazz to free jazz, tracing the continual reinvention of America's classical music. Discover how each movement introduced new approaches to improvisation, harmony, and expression.",
        image: "/taxonomy/jazz-evolution.jpg",
      },
      {
        id: "jazz-practice-language",
        title: "Jazz as Practice & Language",
        description:
          "Understand improvisation, theory, and the musical vocabulary that jazz musicians speak and hear. Discover the sophisticated communication system that enables spontaneous creation and the shared language of jazz performance.",
        image: "/taxonomy/jazz-practice.jpg",
      },
      {
        id: "soul-rnb-funk-lineages",
        title: "Soul, R&B & Funk Lineages",
        description:
          "Explore Motown, Stax, Philadelphia, and the labels, artists, and grooves that defined soul and funk. Discover how these institutions built legendary catalogs and shaped the sound of Black popular music.",
        image: "/taxonomy/soul-funk.jpg",
      },
      {
        id: "vocal-traditions",
        title: "Vocal Traditions",
        description:
          "Discover scat singing, soul divas, and the vocal innovations of jazz, soul, and R&B. Understand how vocalists developed distinctive styles and techniques that defined the expressive possibilities of Black singers.",
        image: "/taxonomy/jazz-vocal.jpg",
      },
      {
        id: "modern-hybrid-expressions",
        title: "Modern & Hybrid Expressions",
        description:
          "Explore neo-soul, jazz rap, fusion, and the contemporary artists blending tradition with innovation. Discover how modern musicians continue to evolve jazz and soul traditions while incorporating hip hop, electronic, and global influences.",
        image: "/taxonomy/modern-jazz.jpg",
      },
      {
        id: "cultural-social-dimensions",
        title: "Cultural & Social Dimensions",
        description:
          "Understand civil rights, club culture, and the social movements intertwined with Black music traditions. Explore how jazz, soul, and funk reflected and influenced struggles for justice, equality, and cultural pride.",
        image: "/taxonomy/jazz-culture.jpg",
      },
    ],
  },

  // ============================================================
  // X. Electronic, Club & Nightlife Culture
  // ============================================================
  {
    id: "electronic-club-nightlife",
    numeral: "X",
    title: "Electronic, Club & Nightlife Culture",
    description:
      "Trace electronic music from Chicago house and Detroit techno to global club culture through the beats, DJs, and communities that shaped it. Understand how underground dance music became a worldwide force and influenced popular music more broadly.",
    image: "/taxonomy/electronic-club.jpg",
    subsections: [
      {
        id: "house-techno-foundations",
        title: "House & Techno Foundations",
        description:
          "Explore the Chicago and Detroit origins of modern dance music, from warehouse parties to 808s and 909s. Discover how pioneering DJs and producers created sounds that would define electronic music for decades.",
        image: "/taxonomy/house-techno.jpg",
      },
      {
        id: "global-dance-rave-lineages",
        title: "Global Dance & Rave Lineages",
        description:
          "Trace electronic dance music from UK rave culture to European festivals and beyond. Understand how regional scenes grew into global movements and how club culture became an international phenomenon.",
        image: "/taxonomy/global-rave.jpg",
      },
      {
        id: "dj-culture-performance",
        title: "DJ Culture & Performance",
        description:
          "Explore mixing, scratching, beatmatching, and the art of the DJ as performer. Understand how DJs evolved from playing records to creating live sets and headlining major venues.",
        image: "/taxonomy/dj-culture.jpg",
      },
      {
        id: "club-culture-social-space",
        title: "Club Culture as Social Space",
        description:
          "Explore the club as a space for community, identity, and liberation through inclusive environments and underground movements. Understand how nightlife created sanctuaries for self-expression and communities built around dance music.",
        image: "/taxonomy/club-culture.jpg",
      },
      {
        id: "nightlife-escapism-ritual",
        title: "Nightlife, Escapism & Ritual",
        description:
          "Experience the transformative energy of the dancefloor, from PLUR and altered states to collective joy. Discover how electronic dance music created rituals of release, connection, and transformation through nightlife.",
        image: "/taxonomy/nightlife-ritual.jpg",
      },
      {
        id: "technology-space-aesthetics",
        title: "Technology, Space & Aesthetics",
        description:
          "Understand synthesizers, DAWs, lighting design, and the sensory architecture of electronic music. Discover how technology and environment combine to create immersive dance experiences and define the aesthetic of club culture.",
        image: "/taxonomy/electronic-tech.jpg",
      },
      {
        id: "power-economics-survival",
        title: "Power, Economics & Survival",
        description:
          "Explore the business of nightlife, from promoters and venues to the challenges facing club culture. Understand how underground economies sustain creative communities and the complex relationships between art, commerce, and survival.",
        image: "/taxonomy/nightlife-economics.jpg",
      },
    ],
  },

  // ============================================================
  // XI. Latin, Caribbean & Afro Roots
  // ============================================================
  {
    id: "latin-caribbean-afro-roots",
    numeral: "XI",
    title: "Latin, Caribbean & Afro Roots",
    description:
      "Discover the vibrant rhythms and cultural heritage of Latin America, the Caribbean, and Africa, from salsa and reggae to Afrobeats and global bass. Understand how these traditions influenced popular music and sparked dance movements around the world.",
    image: "/taxonomy/latin-caribbean-afro.jpg",
    subsections: [
      {
        id: "latin-vibes",
        title: "Latin Vibes",
        description:
          "Explore everything from son and salsa to reggaeton and Latin pop while discovering the infectious rhythms of Latin America. Understand how Latin music reached global charts while preserving cultural depth and regional diversity.",
        image: "/taxonomy/latin-vibes.jpg",
        groups: [
          {
            id: "afro-latin-roots",
            title: "Afro-Latin Roots & Foundations",
            description:
              "Discover the African influences in Latin music, exploring rhythms, instruments, and cultural heritage. Understand how African traditions merged with European and indigenous elements to create distinctive Latin sounds.",
          },
          {
            id: "caribbean-dance-traditions",
            title: "Caribbean Dance Traditions",
            description:
              "Experience salsa, merengue, bachata, and the partner dances that define Caribbean culture. Understand how dance traditions created social bonds and expressed cultural identity through movement and music.",
          },
          {
            id: "brazilian-lineages",
            title: "Brazilian Lineages",
            description:
              "Discover samba, bossa nova, MPB, and Brazil's rich musical traditions and global influence. Understand how Brazilian music created distinctive styles that influenced global pop and jazz.",
          },
          {
            id: "south-american-traditions",
            title: "South American & Regional Traditions",
            description:
              "Experience Andean music, tango, cumbia, and the diverse sounds across South America. Discover how regional traditions maintain cultural identity while evolving with contemporary influences.",
          },
          {
            id: "political-songwriter-movements",
            title: "Political & Songwriter Movements",
            description:
              "Explore nueva canción, protest music, and Latin America's tradition of musical activism. Understand how artists used music as a tool for social change, political expression, and cultural resistance.",
          },
          {
            id: "modern-latin-urban",
            title: "Modern Latin & Urban Expressions",
            description:
              "Discover reggaeton, Latin trap, urbano, and the contemporary sounds dominating global charts. Understand how modern Latin artists blend traditional rhythms with hip hop, pop, and electronic production.",
          },
          {
            id: "dance-body-social-meaning",
            title: "Dance, Body & Social Meaning",
            description:
              "Understand how Latin music embodies celebration, community, and cultural identity. Discover the social functions of dance music, from parties and Carnival to everyday expression of joy and connection.",
          },
        ],
      },
      {
        id: "caribbean-afro-roots",
        title: "Caribbean & Afro Roots",
        description:
          "Trace a path from Yoruba traditions to dancehall while exploring the Caribbean as a center of musical innovation. Understand how Caribbean rhythms influenced reggae, dancehall, and later shaped global pop and hip hop.",
        image: "/taxonomy/caribbean-afro.jpg",
        groups: [
          {
            id: "african-foundations",
            title: "African Foundations",
            description:
              "Experience the musical traditions carried across the Atlantic and preserved in new forms. Understand how African rhythmic and melodic systems created the foundation for Caribbean, Latin, and global popular music.",
          },
          {
            id: "caribbean-roots-evolution",
            title: "Caribbean Roots & Evolution",
            description:
              "Discover calypso, reggae, soca, and the island sounds that influenced global music. Understand how Caribbean artists created distinctive styles and how their music spread worldwide through diaspora and influence.",
          },
          {
            id: "carnival-rhythm-community",
            title: "Carnival, Rhythm & Community",
            description:
              "Experience festival traditions, mas bands, and the music of celebration. Understand how Carnival and festivals create cultural identity, build community, and preserve musical traditions through joyful expression.",
          },
          {
            id: "sound-system-bass-culture",
            title: "Sound System & Bass Culture",
            description:
              "Discover Jamaican sound systems, dub, and the bass-heavy sounds that shaped modern music. Understand how sound system culture created immersive audio experiences and influenced production across all genres.",
          },
          {
            id: "diaspora-politics-spirituality",
            title: "Diaspora, Politics & Spirituality",
            description:
              "Explore Rastafarianism, Black consciousness, and music as resistance and spiritual expression. Understand how Caribbean music carried messages of liberation, identity, and cultural pride across the diaspora.",
          },
          {
            id: "global-hybrids-fusion",
            title: "Global Hybrids & Fusion",
            description:
              "Discover Afrobeats, dancehall fusion, and the Caribbean influences in worldwide pop. Understand how modern artists blend Caribbean rhythms with contemporary genres to create global crossover hits.",
          },
        ],
      },
    ],
  },

  // ============================================================
  // XII. Folk & Regional Expressions
  // ============================================================
  {
    id: "folk-regional-expressions",
    numeral: "XII",
    title: "Folk & Regional Expressions",
    description:
      "Explore traditional, folk, and regional music from around the world through storytelling, cultural identity, and acoustic craftsmanship. Discover how local traditions preserve heritage while evolving through reinterpretation and cross-cultural exchange.",
    image: "/taxonomy/folk-regional.jpg",
    subsections: [
      {
        id: "traditional-foundations",
        title: "Traditional Foundations",
        description:
          "Discover the oldest musical traditions, from ballads and work songs to the music passed through generations. Understand how these ancient forms carry cultural memory and provide the foundation for regional musical identities worldwide.",
        image: "/taxonomy/folk-traditions.jpg",
      },
      {
        id: "revival-songwriting-modern",
        title: "Revival, Songwriting & Modern Folk",
        description:
          "Explore the folk revival, the singer-songwriter movement, and contemporary folk artists. Discover how musicians reimagined traditional acoustic music for modern audiences while preserving authenticity and storytelling.",
        image: "/taxonomy/folk-revival.jpg",
      },
      {
        id: "american-roots-regional",
        title: "American Roots & Regional Folk",
        description:
          "Explore Appalachian, bluegrass, Cajun, and the regional sounds of American folk tradition. Understand how different American regions developed distinctive musical styles that reflected local culture, history, and working-class experiences.",
        image: "/taxonomy/american-roots.jpg",
      },
      {
        id: "northern-european-folk",
        title: "Northern & European Folk Traditions",
        description:
          "Explore Celtic, Nordic, Baltic, and Eastern European folk music and its modern revival. Discover how European folk traditions influenced popular music and how contemporary artists preserve and reinterpret these musical heritages.",
        image: "/taxonomy/european-folk.jpg",
      },
      {
        id: "folk-metal-modern-hybrids",
        title: "Folk, Metal & Modern Hybrids",
        description:
          "Explore folk metal, pagan folk, and the fusion of traditional sounds with contemporary genres. Understand how artists blend ancient folk traditions with heavy music to create unique hybrid styles.",
        image: "/taxonomy/folk-hybrids.jpg",
      },
      {
        id: "middle-eastern-eastern",
        title: "Middle Eastern & Eastern Traditions",
        description:
          "Discover maqam, ragas, and the sophisticated melodic traditions of the East. Understand how classical systems from the Middle East and Asia create distinctive musical languages and influence contemporary world music.",
        image: "/taxonomy/eastern-traditions.jpg",
      },
      {
        id: "popular-folk-cultural",
        title: "Popular Folk Forms & Cultural Specificity",
        description:
          "Explore chanson, canzone, fado, and other national folk styles that grew into popular traditions. Understand how regional folk music became a national symbol and shaped each country's musical identity.",
        image: "/taxonomy/popular-folk.jpg",
      },
      {
        id: "migration-identity-language",
        title: "Migration, Identity & Language",
        description:
          "Understand diaspora communities, language preservation, and music as cultural memory. Discover how migrants use music to maintain identity, preserve traditions, and create new cultural expressions in their adopted homes.",
        image: "/taxonomy/folk-identity.jpg",
      },
    ],
  },

  // ============================================================
  // XIII. Countries & Regional Music Traditions
  // ============================================================
  {
    id: "countries-regional-traditions",
    numeral: "XIII",
    title: "Countries & Regional Music Traditions",
    description:
      "Take a global journey through traditional, contemporary, and culturally rooted musical styles from around the world. Discover how each region developed distinctive sounds that reflect its history, culture, and identity while influencing global music.",
    image: "/taxonomy/countries-regional.jpg",
    subsections: [
      {
        id: "europe-regional",
        title: "Europe",
        description:
          "Explore Europe's diverse regional traditions, from flamenco to fado and from Balkan brass to Nordic folk. Understand how different parts of Europe developed musical styles that shaped both classical and popular music around the world.",
        image: "/taxonomy/europe-music.jpg",
      },
      {
        id: "latin-america-regional",
        title: "Latin America",
        description:
          "Explore son, tango, cumbia, and the rich musical heritage of Central and South America. Discover how Latin American regions developed unique styles that became globally influential and continue to define cultural identity.",
        image: "/taxonomy/latin-america-music.jpg",
      },
      {
        id: "africa-regional",
        title: "Africa",
        description:
          "Discover highlife, soukous, Afrobeats, and the continent's immense musical diversity. Understand how African regions created distinctive rhythms and sounds that became the foundation for virtually all popular music.",
        image: "/taxonomy/africa-music.jpg",
      },
      {
        id: "middle-east-regional",
        title: "Middle East",
        description:
          "Explore Arabic maqam, Persian classical, Turkish traditions, and the music of the region. Understand how Middle Eastern musical systems created sophisticated art forms and influenced music across Asia, Africa, and Europe.",
        image: "/taxonomy/middle-east-music.jpg",
      },
      {
        id: "north-america-pacific",
        title: "North America & Pacific",
        description:
          "Discover Native American traditions, Hawaiian music, and the sounds of the Pacific region. Understand how indigenous and Pacific musical traditions created distinctive styles and influenced contemporary popular music.",
        image: "/taxonomy/north-america-music.jpg",
      },
      {
        id: "south-asia-regional",
        title: "South Asia",
        description:
          "Explore Hindustani and Carnatic classical music, Bollywood, and the wider musical traditions of South Asia. Understand how classical systems and popular forms from the region created distinctive sounds and influenced global music and film.",
        image: "/taxonomy/south-asia-music.jpg",
      },
      {
        id: "east-southeast-asia",
        title: "East & Southeast Asia",
        description:
          "Discover Chinese opera, Japanese traditions, K-pop, and the diverse sounds of East Asia. Understand how East Asian musical traditions evolved from classical forms to contemporary pop and gained global influence.",
        image: "/taxonomy/east-asia-music.jpg",
      },
      {
        id: "indigenous-ancestral",
        title: "Indigenous & Ancestral Traditions",
        description:
          "Explore First Nations, Aboriginal, and other Indigenous musical traditions from around the world. Discover how ancestral practices preserve cultural knowledge and continue to shape contemporary music and revitalization movements.",
        image: "/taxonomy/indigenous-music.jpg",
      },
    ],
  },

  // ============================================================
  // XIV. Emotional, Seasonal & Situational Dimensions
  // ============================================================
  {
    id: "emotional-seasonal-situational",
    numeral: "XIV",
    title: "Emotional, Seasonal & Situational Dimensions",
    description:
      "Explore music that speaks to emotion, season, and circumstance, from quiet reflection to celebration and healing. Understand how people use music to navigate feelings, mark occasions, and create meaning in daily life.",
    image: "/taxonomy/emotional-seasonal.jpg",
    subsections: [
      {
        id: "emotional-genres-mood-states",
        title: "Emotional Genres & Mood States",
        description:
          "Experience music categorized by feeling, from euphoria and peace to melancholy and catharsis. Discover how different musical styles correspond to and influence our emotional states and support wellbeing through expression.",
        image: "/taxonomy/emotional-states.jpg",
        groups: [
          {
            id: "light-positive-states",
            title: "Light & Positive States",
            description:
              "Explore joy, hope, energy, and the music that lifts the spirit and supports positive moods. Understand how bright, upbeat music can create emotional balance and motivation.",
          },
          {
            id: "dream-memory-reflection",
            title: "Dream, Memory & Reflection",
            description:
              "Discover nostalgia, contemplation, and the music of memory and introspection. Explore how nostalgic and reflective music helps us process memories, find meaning, and connect with our past.",
          },
          {
            id: "vulnerability-loss-healing",
            title: "Vulnerability, Loss & Healing",
            description:
              "Explore sad songs, grief, and the music that helps people process pain and heal. Understand how melancholic and vulnerable music can provide comfort, validate emotion, and support recovery.",
          },
          {
            id: "energy-power-release",
            title: "Energy, Power & Release",
            description:
              "Discover empowerment, anger, and the music that channels intensity and provides cathartic release. Experience how high-energy, aggressive, and powerful music gives voice to strong emotions and releases tension.",
          },
          {
            id: "escape-transcendence-connection",
            title: "Escape, Transcendence & Connection",
            description:
              "Find music that transports, transforms, and unites through shared experience. Discover how trance, ambient, and spiritual music creates transcendence, builds community, and connects listeners across boundaries.",
          },
        ],
      },
      {
        id: "seasonal-genres-moments",
        title: "Seasonal Genres & Moments",
        description:
          "Discover the sounds of seasons and holidays, from summer anthems to winter warmth. Understand how music marks the passage of time, creates seasonal memories, and provides the soundtrack for celebrations throughout the year.",
        image: "/taxonomy/seasonal-music.jpg",
        groups: [
          {
            id: "spring-renewal",
            title: "Spring & Renewal",
            description:
              "Explore fresh starts, blooming, and the music that accompanies new beginnings and growth. Discover how spring-themed music captures the energy of renewal and hope.",
          },
          {
            id: "summer-collective-joy",
            title: "Summer & Collective Joy",
            description:
              "Experience beach vibes, festivals, and the soundtrack of summer's peak moments. Understand how summer music embodies celebration, freedom, and the collective joy of the season's social experiences.",
          },
          {
            id: "autumn-reflection",
            title: "Autumn & Reflection",
            description:
              "Discover music shaped by harvest, change, and reflection. See how autumn-themed music captures the mood of transition, nostalgia, and preparation that defines the season.",
          },
          {
            id: "winter-intimacy",
            title: "Winter & Intimacy",
            description:
              "Explore cozy sounds, holiday music, and the warmth of indoor listening. Discover how winter music creates comfort, celebrates tradition, and offers solace during the coldest months.",
          },
        ],
      },
      {
        id: "situational-activity-playlists",
        title: "Situational & Activity Playlists",
        description:
          "Discover music for every moment, from workouts and focus to parties and relaxation. Understand how we curate music to support different activities, enhance experiences, and create the perfect atmosphere for any situation.",
        image: "/taxonomy/situational-playlists.jpg",
        groups: [
          {
            id: "social-shared-moments",
            title: "Social & Shared Moments",
            description:
              "Explore parties, dinners, and the music that brings people together and enriches social gatherings. Discover how music helps shape mood, build connection, and soundtrack shared experiences.",
          },
          {
            id: "travel-movement",
            title: "Travel & Movement",
            description:
              "Explore road trips, flights, commuting, and the soundtracks of movement. See how music travels with us and transforms the experience of moving from place to place.",
          },
          {
            id: "energy-fitness",
            title: "Energy & Fitness",
            description:
              "Explore workout motivation, running, and high-energy listening that powers physical activity. Discover how rhythmic, upbeat music can enhance exercise and performance.",
          },
          {
            id: "focus-work-creation",
            title: "Focus, Work & Creation",
            description:
              "Discover productivity playlists, study music, and the creative soundtracks for deep work. Understand how ambient, instrumental, and focused music supports concentration, productivity, and creative thinking.",
          },
          {
            id: "relax-unwind",
            title: "Relax & Unwind",
            description:
              "Explore evening chill, stress relief, and music for winding down and restoration. Discover how calming, peaceful music helps people decompress and prepare for rest after demanding days.",
          },
          {
            id: "daily-rituals",
            title: "Daily Rituals",
            description:
              "Discover morning routines, cooking, shower concerts, and the music that shapes everyday moments and self-care. See how personal soundtracks enrich daily life and bring meaning to ordinary routines.",
          },
          {
            id: "holidays-celebrations",
            title: "Holidays & Celebrations",
            description:
              "Find Christmas, birthdays, weddings, and the music for special occasions and milestones. Discover how music marks celebrations, creates traditions, and provides the emotional soundtrack for life's most meaningful moments.",
          },
          {
            id: "life-moments-transitions",
            title: "Life Moments & Transitions",
            description:
              "Discover the music that accompanies graduations, breakups, new chapters, and other major transitions. See how music helps us process change, mark turning points, and navigate the emotional weight of important life events.",
          },
          {
            id: "calm-wellness",
            title: "Calm & Wellness",
            description:
              "Find yoga, meditation, sleep, and the music for holistic wellness and inner peace. Discover how soothing, ambient, and mindful music supports mental health, relaxation, and spiritual practices.",
          },
          {
            id: "family-kids",
            title: "Family & Kids",
            description:
              "Discover children's music, family sing-alongs, and kid-friendly playlists that support young listeners. See how music encourages child development, strengthens family bonds, and builds musical appreciation from an early age.",
          },
        ],
      },
    ],
  },

  // ============================================================
  // XV. Music, Media, Technology & Industry
  // ============================================================
  {
    id: "music-media-technology-industry",
    numeral: "XV",
    title: "Music, Media, Technology & Industry",
    description:
      "Explore the business, technology, and media systems that shape music, from streaming platforms and AI to labels, publishing, and industry economics. Understand how technological change transformed the way music is created, distributed, and consumed.",
    image: "/taxonomy/music-media-tech.jpg",
    subsections: [
      {
        id: "media-memory-visibility",
        title: "Media, Memory & Visibility",
        description:
          "Discover MTV, YouTube, TikTok, and how visual media transformed music discovery and fame. Understand how music videos, social media, and visual platforms changed how artists build audiences and achieve commercial success.",
        image: "/taxonomy/music-media.jpg",
      },
      {
        id: "creation-production",
        title: "Creation & Production",
        description:
          "Explore home recording, AI tools, and the broader democratization of music-making technology. Discover how affordable tools allow independent artists to create professional work from almost anywhere and challenge older production models.",
        image: "/taxonomy/music-creation.jpg",
      },
      {
        id: "distribution-platforms-listening",
        title: "Distribution, Platforms & Listening Habits",
        description:
          "Understand streaming, algorithms, playlists, and how we discover and consume music today. Discover how digital platforms transformed music distribution and created new ways for artists to reach audiences and generate revenue.",
        image: "/taxonomy/music-platforms.jpg",
      },
      {
        id: "industry-power-labor",
        title: "Industry, Power & Labor",
        description:
          "Explore labels, publishing, artist rights, and the economics of the music business. Understand how power dynamics shape the industry and how artists navigate contracts, ownership, and fair compensation in the modern music economy.",
        image: "/taxonomy/music-industry.jpg",
      },
      {
        id: "future-horizons-ethics",
        title: "Future Horizons & Ethical Questions",
        description:
          "Discover AI music, copyright, sustainability, and the ethical challenges ahead. Understand how emerging technologies and business models raise questions about creativity, artist compensation, and the future of musical expression.",
        image: "/taxonomy/music-future.jpg",
      },
    ],
  },

  // ============================================================
  // XVI. Musical Instruments & Timbre
  // ============================================================
  {
    id: "musical-instruments-timbre",
    numeral: "XVI",
    title: "Musical Instruments & Timbre",
    description:
      "Discover the tools that create sound, from strings and keyboards to winds, percussion, and electronic instruments, along with the science of timbre. Understand how design, materials, and acoustics create music's wide palette of color and texture.",
    image: "/taxonomy/instruments-timbre.jpg",
    subsections: [
      {
        id: "string-instruments",
        title: "String Instruments",
        description:
          "Explore everything from classical violin to electric guitar and the vibrating strings that resonate across genres. Discover how string instruments became central to musical ensembles and opened up distinctive playing techniques and expressive possibilities.",
        image: "/taxonomy/string-instruments.jpg",
        groups: [
          {
            id: "guitar-family",
            title: "Guitar Family",
            description:
              "Discover acoustic, electric, and bass guitars, one of the world's most influential instrument families. Understand how the guitar's versatility, portability, and expressive range made it essential across rock, pop, blues, and many other genres.",
          },
          {
            id: "orchestral-strings",
            title: "Orchestral Strings",
            description:
              "Explore violin, viola, cello, and double bass, the core of the orchestral string section. Discover how these instruments provide the melodic and harmonic foundation of symphonic music.",
          },
          {
            id: "plucked-strings-global",
            title: "Plucked Strings (Global)",
            description:
              "Discover harp, sitar, kora, and the plucked strings from around the world. Understand how diverse cultures developed sophisticated plucked instruments that became central to their musical traditions.",
          },
        ],
      },
      {
        id: "keyboard-instruments",
        title: "Keyboard Instruments",
        description:
          "Explore piano, organ, synthesizer, and other keyboard instruments that shaped classical, jazz, and pop music. Understand how their harmonic and melodic range made them central to composition across many traditions.",
        image: "/taxonomy/keyboard-instruments.jpg",
      },
      {
        id: "wind-instruments",
        title: "Wind Instruments",
        description:
          "Explore brass and woodwinds, the breath-powered instruments that give music much of its voice. Discover how wind instruments bring distinctive timbres and expressive possibilities to classical, jazz, folk, and global traditions.",
        image: "/taxonomy/wind-instruments.jpg",
        groups: [
          {
            id: "brass-family",
            title: "Brass Family",
            description:
              "Discover trumpet, saxophone, trombone, and other bold, brilliant brass voices. Understand how brass instruments project power, carry melody, and add drama to musical performance.",
          },
          {
            id: "woodwind-family",
            title: "Woodwind Family",
            description:
              "Explore flute, clarinet, oboe, and other expressive woodwinds within the ensemble. Understand how woodwinds add agility, nuance, and color to orchestral music.",
          },
          {
            id: "global-wind-traditions",
            title: "Global Wind Traditions",
            description:
              "Experience shakuhachi, duduk, ney, and the wind instruments from world traditions. Understand how different cultures developed unique wind instruments that became central to their musical and spiritual practices.",
          },
        ],
      },
      {
        id: "percussion-drums",
        title: "Percussion & Drums",
        description:
          "Explore everything from trap kits to taiko, the instruments that give music its heartbeat and groove. Understand how percussion provides rhythmic foundation and drives momentum across cultures and genres.",
        image: "/taxonomy/percussion-drums.jpg",
        groups: [
          {
            id: "drum-kit-modern",
            title: "Drum Kit & Modern Percussion",
            description:
              "Explore the modern drum set and its role in rock, jazz, and pop music. Understand how the kit became a rhythmic foundation of contemporary music and enabled new playing techniques and styles.",
          },
          {
            id: "hand-drums-frame",
            title: "Hand Drums & Frame Drums",
            description:
              "Discover djembe, congas, frame drums, and other hand-played instruments found across cultures. Understand how hand percussion traditions create complex rhythms and remain central to folk, classical, and world music.",
          },
          {
            id: "orchestral-classical-percussion",
            title: "Orchestral & Classical Percussion",
            description:
              "Explore timpani, snare, cymbals, and other percussion instruments used in the orchestra. Understand how orchestral percussion adds rhythmic drive, dramatic accents, and color to symphonic performance.",
          },
          {
            id: "global-percussion-traditions",
            title: "Global Percussion Traditions",
            description:
              "Experience tabla, taiko, steel pan, and the percussion traditions worldwide. Discover how different cultures developed sophisticated percussion instruments and rhythmic systems that became central to their musical identity.",
          },
        ],
      },
      {
        id: "electronic-instruments-sound",
        title: "Electronic Instruments & Sound Generation",
        description:
          "Discover synths, samplers, drum machines, and the electronic tools that revolutionized music. Understand how electronic instruments enabled new sounds, production techniques, and entire genres that didn't exist before the technological age.",
        image: "/taxonomy/electronic-instruments.jpg",
        groups: [
          {
            id: "synthesizers",
            title: "Synthesizers",
            description:
              "Discover analog, digital, and modular synthesis, along with the electronic tones these instruments can create. Understand how synthesizers opened new possibilities for musical expression and shaped the sound of electronic music.",
          },
          {
            id: "drum-machines-sequencers",
            title: "Drum Machines & Sequencers",
            description:
              "Discover 808, 909, MPC, and the machines that defined electronic music. Understand how drum machines and sequencers revolutionized rhythm programming and became iconic tools in electronic and hip hop production.",
          },
          {
            id: "samplers-sampling",
            title: "Samplers & Sampling Technology",
            description:
              "Explore the art and technology of sampling, from the Fairlight to the SP-1200. Discover how sampling enabled creative reuse, inspired new techniques, and became a foundation of hip hop and electronic production.",
          },
          {
            id: "other-electronic",
            title: "Other Electronic Instruments",
            description:
              "Discover theremin, omnichord, and the experimental electronic instruments beyond synths and drum machines. Understand how innovative instruments expanded the sonic palette and created new ways of making music.",
          },
        ],
      },
      {
        id: "instrument-craft-innovation",
        title: "Instrument Craft, Innovation & Culture",
        description:
          "Discover luthiers, builders, and the craftsmanship behind great instruments. Understand how design, materials, and construction techniques shape the tools musicians use across musical traditions.",
        image: "/taxonomy/instrument-craft.jpg",
      },
      {
        id: "timbre-sound-design-sonic",
        title: "Timbre, Sound Design & Sonic Identity",
        description:
          "Understand the color of sound and how timbre shapes musical character and sonic identity. Discover how the unique qualities of instruments and textures give music its emotional impact and distinctive fingerprint.",
        image: "/taxonomy/timbre-sound.jpg",
      },
    ],
  },

  // ============================================================
  // XVII. Music Theory & Composition
  // ============================================================
  {
    id: "music-theory-composition",
    numeral: "XVII",
    title: "Music Theory & Composition",
    description:
      "Discover the language of music, from harmony, melody, and rhythm to form, structure, and the compositional ideas that create meaning. Understand how theory supports musical creation, analysis, and appreciation across traditions.",
    image: "/taxonomy/music-theory.jpg",
    subsections: [
      {
        id: "harmony-chord-progressions",
        title: "Harmony & Chord Progressions",
        description:
          "Explore the vertical dimension of music and how chords create both emotional color and harmonic foundation. Discover how systems ranging from simple triads to advanced jazz voicings shape musical structure and feeling.",
        image: "/taxonomy/harmony-chords.jpg",
        groups: [
          {
            id: "basic-harmony",
            title: "Basic Harmony",
            description:
              "Master triads, intervals, and the fundamental harmonic concepts that underpin Western music. Understand how basic harmonic relationships create the building blocks for musical composition and provide emotional color.",
          },
          {
            id: "advanced-harmony",
            title: "Advanced Harmony",
            description:
              "Discover extended chords, modulation, and sophisticated progressions used in complex music. Understand how advanced harmonic techniques create movement, tension, resolution, and sophisticated emotional landscapes.",
          },
          {
            id: "genre-specific-harmony",
            title: "Genre-Specific Harmony",
            description:
              "Experience jazz voicings, rock power chords, pop progressions, and the harmonic approaches that define different genres. Discover how each style developed distinctive harmonic languages and conventions that shape its sound.",
          },
        ],
      },
      {
        id: "melody-counterpoint",
        title: "Melody & Counterpoint",
        description:
          "Explore the horizontal dimension of music and how melodic lines move, interact, and create meaning alone and together. Discover how melody and counterpoint shape the narrative and expressive content of a piece.",
        image: "/taxonomy/melody-counterpoint.jpg",
        groups: [
          {
            id: "melodic-construction",
            title: "Melodic Construction",
            description:
              "Discover motifs, phrases, and the craft of creating memorable melodies. Understand how melodic patterns, development, and phrasing create musical themes that listeners remember and find emotionally compelling.",
          },
          {
            id: "counterpoint-polyphony",
            title: "Counterpoint & Polyphony",
            description:
              "Explore Bach, fugues, and the art of combining melodic lines in independent musical voices. Understand how counterpoint creates complexity, beauty, and intellectual satisfaction in music from Baroque to contemporary styles.",
          },
          {
            id: "modal-non-western-melody",
            title: "Modal & Non-Western Melody",
            description:
              "Discover modes, ragas, and the melodic systems beyond Western major and minor scales. Understand how non-Western melodic traditions create distinctive musical landscapes and alternative approaches to pitch and tonality.",
          },
        ],
      },
      {
        id: "rhythm-meter-groove",
        title: "Rhythm, Meter & Groove",
        description:
          "Explore the temporal dimension of music and how time, pulse, and feel create motion and energy. Discover how rhythmic complexity and groove help music move listeners both physically and emotionally.",
        image: "/taxonomy/rhythm-meter.jpg",
        groups: [
          {
            id: "fundamentals-rhythm",
            title: "Fundamentals",
            description:
              "Master time signatures, subdivision, and the rhythmic notation that organizes musical time. Understand how rhythmic frameworks provide the structure for composition and performance across all musical traditions.",
          },
          {
            id: "groove-feel",
            title: "Groove & Feel",
            description:
              "Discover swing, syncopation, pocket, and the subtle rhythmic qualities that make music feel good. Understand how groove creates the connection between rhythm and emotion that makes music physically engaging and emotionally satisfying.",
          },
          {
            id: "complex-cross-cultural-rhythm",
            title: "Complex & Cross-Cultural Rhythm",
            description:
              "Experience polyrhythms, odd meters, and the global rhythmic traditions beyond simple Western patterns. Discover how different cultures developed sophisticated rhythmic systems that create fascinating complexity and cross-cultural musical exchange.",
          },
        ],
      },
      {
        id: "form-structure",
        title: "Form & Structure",
        description:
          "Explore the architectural side of music and how sections grow into complete works that create narrative through structure. Discover how forms, from sonata design to popular song structure, shape development and listener expectation.",
        image: "/taxonomy/form-structure.jpg",
        groups: [
          {
            id: "classical-forms",
            title: "Classical Forms",
            description:
              "Discover sonata, rondo, theme and variations, the formal structures of classical music. Understand how classical forms provide frameworks for extended development and create the sophisticated architecture of masterworks.",
          },
          {
            id: "popular-music-forms",
            title: "Popular Music Forms",
            description:
              "Experience verse-chorus, AABA, and the structures of hit songs and popular music. Understand how song forms create familiarity, balance, and the perfect length for radio and streaming success.",
          },
          {
            id: "extended-modern-forms",
            title: "Extended & Modern Forms",
            description:
              "Discover concept albums, suites, and the experimental structures that go beyond conventional song forms. Understand how artists created unified works that challenge listeners and expanded the possibilities of musical expression.",
          },
        ],
      },
      {
        id: "orchestration-arrangement",
        title: "Orchestration & Arrangement",
        description:
          "Explore the instrumental dimension of music and how sounds are assigned, combined, and balanced within a work. Discover how orchestration and arrangement transform compositions and shape their final sonic impact.",
        image: "/taxonomy/orchestration.jpg",
        groups: [
          {
            id: "instrumentation",
            title: "Instrumentation",
            description:
              "Discover ranges, transposition, and the instrumental combinations that define musical works. Understand how composers select instruments and how performers adapt to different instrumental contexts and musical demands.",
          },
          {
            id: "arranging-techniques",
            title: "Arranging Techniques",
            description:
              "Explore voicing, doubling, and the techniques of bringing compositions to life. Understand how arrangers enhance existing works and create the distinctive sound and character that define recordings and performances.",
          },
          {
            id: "genre-specific-arrangement",
            title: "Genre-Specific Arrangement",
            description:
              "Experience orchestral, band, and electronic arrangement approaches across different styles. Discover how each genre developed distinctive arranging conventions that create its characteristic sound and texture.",
          },
        ],
      },
      {
        id: "composition-approaches-philosophy",
        title: "Composition Approaches & Philosophy",
        description:
          "Explore the creative dimension of music through methods, mindsets, and philosophies of composition. Discover how composers approach their craft and what ideas guide the process of bringing new music into being.",
        image: "/taxonomy/composition-philosophy.jpg",
        groups: [
          {
            id: "creative-process",
            title: "Creative Process",
            description:
              "Discover inspiration, revision, and the process of developing your compositional voice. Understand how composers work through ideas, experimentation, and refinement to create distinctive and meaningful musical works.",
          },
          {
            id: "philosophical-approaches",
            title: "Philosophical Approaches",
            description:
              "Understand aesthetics, meaning, and what music can express beyond entertainment. Discover how philosophical concepts guide composers to create works with intellectual depth and cultural significance.",
          },
          {
            id: "technology-composition",
            title: "Technology & Composition",
            description:
              "Discover DAWs, notation software, and the digital composition tools of modern music. Understand how technology has transformed the compositional process and created new possibilities for musical creation and experimentation.",
          },
        ],
      },
      {
        id: "ear-training-literacy",
        title: "Ear Training & Musical Literacy",
        description:
          "Develop the perceptual side of musicianship by training the ear and learning to read notation clearly. Understand how aural skill and literacy support musical understanding, communication, and participation across styles.",
        image: "/taxonomy/ear-training.jpg",
      },
    ],
  },

  // ============================================================
  // XVIII. Music Therapy, Wellness & Healing
  // ============================================================
  {
    id: "music-therapy-wellness-healing",
    numeral: "XVIII",
    title: "Music Therapy, Wellness & Healing",
    description:
      "Explore the therapeutic and wellness applications of music, from clinical practice to daily self-care and the neuroscience of healing. Understand how music can support mental health, recovery, and quality of life through both evidence-based practice and personal engagement.",
    image: "/taxonomy/music-therapy.jpg",
    subsections: [
      {
        id: "therapeutic-applications",
        title: "Therapeutic Applications",
        description:
          "Discover clinical music therapy and evidence-based interventions for health and healing. Understand how trained therapists use music to address physical, emotional, cognitive, and social needs in clinical, educational, and community settings.",
        image: "/taxonomy/therapeutic-applications.jpg",
        groups: [
          {
            id: "clinical-music-therapy",
            title: "Clinical Music Therapy",
            description:
              "Explore professional practice in healthcare, education, and community settings. Understand how board-certified music therapists design interventions to achieve specific therapeutic goals and improve wellbeing through musical engagement.",
          },
          {
            id: "methods-approaches-therapy",
            title: "Methods & Approaches",
            description:
              "Discover Nordoff-Robbins, Guided Imagery, and the established therapeutic methods in music therapy. Understand how different approaches use music's elements to support development, emotional expression, and healing across diverse populations.",
          },
        ],
      },
      {
        id: "music-mental-health",
        title: "Music & Mental Health",
        description:
          "Discover how music can support people dealing with depression, anxiety, trauma, and other mental health challenges. Understand how musical engagement can offer coping tools, emotional regulation, and relief from daily stress.",
        image: "/taxonomy/music-mental-health.jpg",
      },
      {
        id: "wellness-self-care",
        title: "Wellness & Self-Care Applications",
        description:
          "Explore daily practices for balance, stress relief, and emotional regulation through music. Discover how intentional listening, musical activity, and sound-based rituals can support sustainable wellbeing.",
        image: "/taxonomy/wellness-self-care.jpg",
        groups: [
          {
            id: "daily-wellness",
            title: "Daily Wellness Practices",
            description:
              "Explore morning music, mood management, and intentional listening for everyday balance. Understand how music can help shape daily routines, guide energy, and create structure.",
          },
          {
            id: "mindfulness-meditation",
            title: "Mindfulness & Meditation",
            description:
              "Discover sound baths, chanting, and music for contemplative practice and inner peace. See how sonic environments and sacred sounds support meditation, mindfulness, and spiritual wellbeing through focused listening.",
          },
          {
            id: "movement-body",
            title: "Movement & Body",
            description:
              "Discover music for yoga, dance therapy, and somatic practices that integrate physical and musical experience. Understand how movement combined with music creates holistic wellness and supports body awareness, expression, and healing.",
          },
        ],
      },
      {
        id: "community-social-wellness",
        title: "Community & Social Wellness",
        description:
          "Explore group singing, community music, and the healing power of making music together. Discover how collective musical activity can build social bonds, create belonging, and support community wellbeing.",
        image: "/taxonomy/community-wellness.jpg",
      },
      {
        id: "neuroscience-music",
        title: "Neuroscience & Music",
        description:
          "Understand brain science and how music affects cognition, memory, emotion, and neural pathways. Discover how research reveals music's impact on the brain, from learning instruments to the neurological benefits of active and passive listening.",
        image: "/taxonomy/neuroscience-music.jpg",
      },
    ],
  },

  // ============================================================
  // XIX. Production Techniques & Audio Engineering
  // ============================================================
  {
    id: "production-audio-engineering",
    numeral: "XIX",
    title: "Production Techniques & Audio Engineering",
    description:
      "Explore the craft of capturing and shaping sound, from microphone technique and mixing to mastering and genre-specific production. Understand how audio engineering turns raw performances into polished recordings and shapes the sound of the music we hear.",
    image: "/taxonomy/production-engineering.jpg",
    subsections: [
      {
        id: "recording-fundamentals",
        title: "Recording Fundamentals",
        description:
          "Explore the art of capture through microphones, acoustics, and strong source recording. Learn how good recording technique preserves the essence of a performance and lays the foundation for everything that follows.",
        image: "/taxonomy/recording-fundamentals.jpg",
        groups: [
          {
            id: "microphone-techniques",
            title: "Microphone Techniques",
            description:
              "Master placement, polar patterns, and capturing sound faithfully for different instruments and voices. Understand how microphone choice and positioning determine the tone, clarity, and character of every recording.",
          },
          {
            id: "recording-environments",
            title: "Recording Environments",
            description:
              "Discover studios, home recording, and the acoustic treatment for optimal capture. Understand how the recording space affects sound quality and how to create professional environments in any location for great results.",
          },
          {
            id: "session-workflow",
            title: "Session Workflow",
            description:
              "Learn organization, file management, and the efficient production processes that make professional recording possible. Discover how proper workflow saves time, reduces errors, and ensures smooth collaboration in music production.",
          },
        ],
      },
      {
        id: "mixing-techniques",
        title: "Mixing Techniques",
        description:
          "Explore the art of balance as individual tracks are shaped into a cohesive whole. Discover how mixing transforms recorded performances into polished songs through EQ, dynamics, and spatial processing.",
        image: "/taxonomy/mixing-techniques.jpg",
        groups: [
          {
            id: "balance-level",
            title: "Balance & Level",
            description:
              "Master setting levels, automation, and creating dynamic mixes that translate across playback systems. Understand how balance ensures every element is heard clearly and the mix maintains impact and musicality.",
          },
          {
            id: "equalization",
            title: "Equalization",
            description:
              "Discover frequency shaping, surgical EQ, and tonal balance for professional mixes. Understand how equalization carves space in the frequency spectrum, fixes problems, and shapes the tonal character of recordings.",
          },
          {
            id: "dynamics-processing",
            title: "Dynamics Processing",
            description:
              "Explore compression, limiting, and controlling dynamic range for consistent listening experiences. Discover how dynamics tools make mixes punchy, controlled, and competitive in the modern music landscape.",
          },
          {
            id: "spatial-processing",
            title: "Spatial Processing",
            description:
              "Discover reverb, delay, and creating depth and space in the mix. Understand how spatial effects place sounds in three-dimensional space and create immersive, professional listening experiences.",
          },
          {
            id: "color-character",
            title: "Color & Character",
            description:
              "Experience saturation, distortion, and the analog modeling that adds personality and warmth. Discover how coloration tools enhance mixes by adding harmonic richness, excitement, and distinctive sonic characteristics.",
          },
          {
            id: "mix-bus-final",
            title: "Mix Bus & Final Touches",
            description:
              "Explore bus processing, reference checking, and the polish that completes a great mix. Understand how final touches glue the mix together, add sheen, and prepare for mastering with professional quality.",
          },
        ],
      },
      {
        id: "mastering",
        title: "Mastering",
        description:
          "Explore the final stage of polish that prepares mixes for distribution and reliable playback across systems. Learn how mastering adds the last EQ, compression, and level adjustments that help recordings translate well on every platform.",
        image: "/taxonomy/mastering.jpg",
        groups: [
          {
            id: "mastering-fundamentals",
            title: "Mastering Fundamentals",
            description:
              "Understand the role of mastering and the mastering chain in the production process. Discover how mastering provides quality control, consistency, and the final creative decisions before music reaches listeners.",
          },
          {
            id: "mastering-techniques",
            title: "Mastering Techniques",
            description:
              "Explore EQ, compression, limiting, and the final touch that defines professional audio. Learn how mastering engineers add the final polish and ensure translations sound optimal across all playback systems.",
          },
          {
            id: "delivery-formats",
            title: "Delivery & Formats",
            description:
              "Discover streaming optimization, loudness standards, and the file formats for modern distribution. Understand how mastering prepares music for Spotify, Apple Music, radio, and all contemporary listening environments.",
          },
        ],
      },
      {
        id: "genre-specific-production",
        title: "Genre-Specific Production",
        description:
          "Discover rock, hip hop, electronic, pop, and the production approaches for every style. Understand how each genre developed distinctive recording and mixing techniques that create its characteristic sound and define its production standards.",
        image: "/taxonomy/genre-production.jpg",
      },
      {
        id: "mixing-philosophy-approach",
        title: "Mixing Philosophy & Approach",
        description:
          "Explore artistic vision, serving the song, and developing your sonic signature. Understand how great mixers develop a personal sound while supporting the artist's vision and creating mixes that stand the test of time.",
        image: "/taxonomy/mixing-philosophy.jpg",
      },
    ],
  },

  // ============================================================
  // XX. Live Performance & Stagecraft
  // ============================================================
  {
    id: "live-performance-stagecraft",
    numeral: "XX",
    title: "Live Performance & Stagecraft",
    description:
      "Explore the art of live performance, from stage presence and touring logistics to sound, lighting, and the history of major shows. Understand how live music creates memorable experiences and connects artists with audiences in shared moments.",
    image: "/taxonomy/live-performance.jpg",
    subsections: [
      {
        id: "performance-skills",
        title: "Performance Skills",
        description:
          "Learn how to command the stage through presence, communication, and audience connection. Discover how strong performers captivate listeners and create lasting impact through authentic live expression.",
        image: "/taxonomy/performance-skills.jpg",
        groups: [
          {
            id: "stage-presence",
            title: "Stage Presence",
            description:
              "Discover movement, engagement, and the charisma that creates compelling live performance. Understand how body language, eye contact, and authentic energy transform a musician into a magnetic stage presence.",
          },
          {
            id: "musicianship-live",
            title: "Musicianship in Live Settings",
            description:
              "Master playing live, improvisation, and adapting to the moment in performance. Understand how exceptional musicianship allows spontaneous creativity while maintaining precision and connecting with fellow performers.",
          },
        ],
      },
      {
        id: "touring-logistics",
        title: "Touring & Logistics",
        description:
          "Explore life on the road through planning, routing, and the realities of touring. Discover how successful tours balance artistic goals with practical logistics, crew management, and the demands of bringing shows to audiences.",
        image: "/taxonomy/touring-logistics.jpg",
        groups: [
          {
            id: "tour-planning",
            title: "Tour Planning",
            description:
              "Discover booking, routing, budgets, and the tour management that makes touring possible. Understand how strategic planning ensures efficient logistics, maximizes revenue, and creates sustainable touring careers for artists.",
          },
          {
            id: "life-on-road",
            title: "Life on the Road",
            description:
              "Explore travel, accommodation, health, and the touring lifestyle that accompanies life on tour. Understand how musicians maintain wellbeing, relationships, and creativity while navigating the demanding routine of constant travel and performance.",
          },
          {
            id: "crew-team",
            title: "Crew & Team",
            description:
              "Discover tour managers, engineers, and the professionals behind the show. Understand how the touring team provides essential support, expertise, and problem-solving that make every performance successful and memorable.",
          },
        ],
      },
      {
        id: "sound-technical-production",
        title: "Sound & Technical Production",
        description:
          "Master live sound engineering, from FOH and monitors to making shows sound great for audiences. Understand how technical teams transform any venue into an acoustic space where music sounds its best and performers hear themselves clearly.",
        image: "/taxonomy/live-sound.jpg",
        groups: [
          {
            id: "front-of-house",
            title: "Front of House (FOH)",
            description:
              "Discover mixing for the audience, system tuning, and venue acoustics for optimal concert sound. Learn how FOH engineers create the mix that the crowd hears and solve acoustic challenges in any performance space.",
          },
          {
            id: "monitoring-systems",
            title: "Monitoring Systems",
            description:
              "Discover wedges, IEMs, and the systems giving performers what they need to hear on stage. Understand how monitoring enables confident performance and helps musicians deliver their best in any live situation.",
          },
          {
            id: "stage-technical",
            title: "Stage Technical",
            description:
              "Discover input lists, stage plots, and the technical coordination that makes complex shows possible. Understand how stage management ensures every element works together and technical issues are prevented before they affect the performance.",
          },
        ],
      },
      {
        id: "lighting-visual-production",
        title: "Lighting & Visual Production",
        description:
          "Look beyond the music to understand lighting, video, and the visual spectacle of live shows. Explore how visual production creates immersive environments, deepens the musical experience, and has become an essential part of modern concert presentation.",
        image: "/taxonomy/lighting-visual.jpg",
        groups: [
          {
            id: "lighting-design",
            title: "Lighting Design",
            description:
              "Discover creating atmosphere, mood, and visual drama through lighting. Understand how lighting designers use color, intensity, and movement to support the music and guide audience attention and emotion.",
          },
          {
            id: "visual-video",
            title: "Visual & Video",
            description:
              "Discover LED walls, projection mapping, and the visual content that enhances live performances. Explore how video and graphics technologies create immersive experiences and add narrative depth to concerts.",
          },
          {
            id: "stage-design",
            title: "Stage Design",
            description:
              "Discover set pieces, risers, and the physical stage environment that frames the performance. Understand how stage design creates context, supports the artist, and transforms any space into a venue for live musical experiences.",
          },
        ],
      },
      {
        id: "festival-event-performance",
        title: "Festival & Event Performance",
        description:
          "Discover the unique challenges and opportunities of festival and large event stages. Understand how festivals differ from club shows and require adapted approaches for sound, logistics, and audience engagement in massive environments.",
        image: "/taxonomy/festival-performance.jpg",
      },
      {
        id: "club-venue-performance",
        title: "Club & Venue Performance",
        description:
          "Explore intimate venues, club shows, and the special energy of small-room performance. Discover how closeness to the audience creates opportunities for direct communication and musical intimacy.",
        image: "/taxonomy/club-performance.jpg",
      },
      {
        id: "streaming-digital-performance",
        title: "Streaming & Digital Performance",
        description:
          "Understand livestreams, virtual concerts, and performing for digital audiences worldwide. Discover how technology enables artists to reach global audiences from home and creates new paradigms for live musical connection and monetization.",
        image: "/taxonomy/streaming-performance.jpg",
      },
      {
        id: "legendary-performances-history",
        title: "Legendary Performances & History",
        description:
          "Explore Woodstock, Live Aid, and other shows that changed music history. Understand how certain performances moved beyond entertainment to become defining cultural moments.",
        image: "/taxonomy/legendary-performances.jpg",
      },
      {
        id: "safety-professional-conduct",
        title: "Safety & Professional Conduct",
        description:
          "Master protecting artists, crews, and audiences through safety protocols and professionalism. Understand how proper preparation, risk management, and professional standards ensure that live music remains a positive experience for everyone involved.",
        image: "/taxonomy/performance-safety.jpg",
      },
    ],
  },

  // ============================================================
  // XXI. Canon & Key Artists
  // ============================================================
  {
    id: "canon-key-artists",
    numeral: "XXI",
    title: "Canon & Key Artists",
    fullTitle: "XXI. Canon & Key Artists",
    description:
      "Discover the legendary artists who shaped music history across genres and eras. Explore the iconic voices, innovators, and visionaries whose work defined major movements and continues to inspire new generations of musicians and listeners.",
    image: "/taxonomy/canon-key-artists.jpg",
    subsections: [
      {
        id: "classical-orchestral-leading-vocalists",
        title: "Classical & Orchestral Mastery: Leading Vocal Virtuosos",
        description:
          "Discover opera legends, classical singers, and the voices that defined operatic and art-music traditions. Explore how these virtuosos pushed the limits of vocal technique and set standards for classical excellence.",
        image: "/taxonomy/canon-classical.jpg",
      },
      {
        id: "rock-icons-golden-age-heavy",
        title: "Rock Icons: The Golden Age & Heavy Edge",
        description:
          "Explore the guitar heroes and frontmen of rock's golden eras, from Zeppelin to Metallica. Discover how these icons shaped the archetype of rock stardom and influenced generations of guitarists and bands.",
        image: "/taxonomy/canon-rock.jpg",
      },
      {
        id: "metal-queens-kings-rule-breakers",
        title: "Metal: Queens, Kings & Rule-Breakers",
        description:
          "Discover Ozzy, Dio, Bruce Dickinson, and other icons who defined heavy metal's evolution. Explore how these artists shaped the vocal styles, imagery, and innovations that became templates for metal worldwide.",
        image: "/taxonomy/canon-metal.jpg",
      },
      {
        id: "pop-powerhouses",
        title: "Pop Powerhouses",
        description:
          "Discover Michael, Madonna, Beyoncé, and other superstars who defined pop music across decades. Explore how these artists set standards for performance, visual presentation, and global celebrity.",
        image: "/taxonomy/canon-pop.jpg",
      },
      {
        id: "indie-alternative-leading-voices",
        title: "Indie & Alternative: Leading Voices",
        description:
          "Discover Cobain, St. Vincent, Thom Yorke, and other artists who shaped alternative and indie music. Explore how these musicians helped define authenticity and artistic independence.",
        image: "/taxonomy/canon-indie.jpg",
      },
      {
        id: "hiphop-rap-leading-voices-lyric-icons",
        title: "Hip Hop & Rap: Leading Voices & Lyric Icons",
        description:
          "Explore Tupac, Biggie, Jay-Z, Kendrick, and other MCs who elevated rap to a high art. Discover how these artists advanced lyrical storytelling, shaped hip hop culture, and became defining voices of their generations.",
        image: "/taxonomy/canon-hiphop.jpg",
      },
      {
        id: "jazz-soul-funk-leading-voices-legends",
        title: "Jazz, Soul & Funk: Leading Voices & Legends",
        description:
          "Discover Coltrane, Miles, Aretha, Prince, and other visionaries of jazz, soul, and funk. Explore how these artists transformed popular music through improvisation, vocal performance, and composition.",
        image: "/taxonomy/canon-jazz-soul.jpg",
      },
      {
        id: "house-techno-leading-vocal-innovators",
        title: "House & Techno Culture: Leading Vocal Innovators",
        description:
          "Discover Daft Punk, Frankie Knuckles, and other pioneers of electronic dance music. Explore how these innovators created the sounds, production techniques, and culture that defined house, techno, and electronic music around the world.",
        image: "/taxonomy/canon-house-techno.jpg",
      },
      {
        id: "club-sounds-leading-voices-night",
        title: "Club Sounds: Leading Voices of the Night",
        description:
          "Discover the DJs and producers who defined club culture and shaped the soundtracks of nightlife. Explore how these artists built global dance movements and influenced electronic music, pop, and hip hop.",
        image: "/taxonomy/canon-club.jpg",
      },
      {
        id: "breaks-experimental-leading-avant-voices",
        title: "Breaks & Experimental: Leading Avant-Voices",
        description:
          "Discover Aphex Twin, Bjork, and other artists pushing music into uncharted territory. Explore how these experimentalists expanded the boundaries of sound, created new musical languages, and influenced both avant-garde and popular music.",
        image: "/taxonomy/canon-experimental.jpg",
      },
      {
        id: "latin-vibes-leading-voices-global",
        title: "Latin Vibes: Leading Voices & Global Rhythms",
        description:
          "Discover Celia Cruz, Bad Bunny, and other icons of Latin music's global rise. Explore how these artists blended regional traditions with contemporary sounds while reaching international audiences.",
        image: "/taxonomy/canon-latin.jpg",
      },
      {
        id: "caribbean-afro-roots-leading-voices",
        title: "Caribbean & Afro Roots: Leading Voices & Global Rhythms",
        description:
          "Discover Bob Marley, Fela Kuti, and other voices that carried global rhythms and powerful messages around the world. Explore how these icons used music as a force for social change, cultural pride, and liberation across the African diaspora.",
        image: "/taxonomy/canon-caribbean-afro.jpg",
      },
      {
        id: "folk-regional-leading-voices-global",
        title: "Folk & Regional Expressions: Leading Voices & Global Rhythms",
        description:
          "Discover Joni Mitchell, Ali Farka Toure, and other keepers of folk and regional music heritage. Explore how these artists preserved older traditions while innovating and influencing contemporary music across genres and cultures.",
        image: "/taxonomy/canon-folk.jpg",
      },
    ],
  },
];

export default musicTaxonomy;
