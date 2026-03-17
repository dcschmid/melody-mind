# Interaktive Musik-Komponenten - Implementierungsplan

## Technische Spezifikation für MelodyMind

---

## 1. Architektur-Übersicht

```
┌─────────────────────────────────────────────────────────────────┐
│                        Artikel (.mdx)                           │
│                                                                 │
│  <InteractiveScale notes={["C","D","E"]} />                    │
│  <ChordBuilder root="C" type="major" />                        │
│  <CircleOfFifths />                                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Astro Komponenten                            │
│                                                                 │
│  src/components/Interactive/                                    │
│  ├── InteractiveScale.astro                                     │
│  ├── ChordBuilder.astro                                         │
│  └── CircleOfFifths.astro                                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Client-Side Scripts                          │
│                                                                 │
│  src/scripts/interactive/                                       │
│  ├── scalePlayer.ts                                             │
│  ├── chordPlayer.ts                                             │
│  └── circleOfFifthsPlayer.ts                                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Audio Core (Tone.js)                         │
│                                                                 │
│  src/utils/audio/                                               │
│  ├── audioContext.ts    # Singleton AudioContext                │
│  ├── notePlayer.ts      # Einzelne Töne                         │
│  ├── frequencies.ts     # Note → Frequency Mapping              │
│  └── synth.ts           # Synth-Konfiguration                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Dateistruktur

```
src/
├── components/
│   └── Interactive/
│       ├── InteractiveScale.astro        # Tonleiter-Komponente
│       ├── InteractiveScale.client.ts    # Client-Script
│       ├── ChordBuilder.astro            # Akkord-Builder
│       ├── ChordBuilder.client.ts        # Client-Script
│       ├── CircleOfFifths.astro          # Quintenzirkel
│       ├── CircleOfFifths.client.ts      # Client-Script
│       ├── shared/
│       │   ├── PianoKey.astro            # Einzelne Klaviertaste
│       │   ├── StaffNote.astro           # Note auf Notensystem
│       │   └── PlayButton.astro          # Play-Button
│       └── styles/
│           ├── scale.css                 # Tonleiter-Styles
│           ├── chord.css                 # Akkord-Styles
│           └── circle.css                # Quintenzirkel-Styles
│
├── utils/
│   └── audio/
│       ├── index.ts                      # Public API Export
│       ├── audioContext.ts               # AudioContext Singleton
│       ├── notePlayer.ts                 # Ton-Wiedergabe
│       ├── chordPlayer.ts                # Akkord-Wiedergabe
│       ├── frequencies.ts                # Noten → Frequenzen
│       ├── intervals.ts                  # Intervall-Berechnungen
│       └── types.ts                      # TypeScript Types
│
├── data/
│   └── music/
│       ├── notes.ts                      # Alle Noten-Daten
│       ├── scales.ts                     # Tonleiter-Definitionen
│       ├── chords.ts                     # Akkord-Definitionen
│       └── circleOfFifths.ts             # Quintenzirkel-Daten
│
└── types/
    └── interactive.d.ts                  # Shared Types
```

---

## 3. Komponenten-Spezifikation

### 3.1 InteractiveScale (Tonleiter)

**Props:**

```typescript
interface InteractiveScaleProps {
  notes: NoteName[]; // ["C", "D", "E", "F", "G", "A", "B"]
  title?: string; // "C-Dur Tonleiter"
  description?: string; // "Klicke auf die Noten"
  showPiano?: boolean; // Zeige Klaviatur (default: true)
  showStaff?: boolean; // Zeige Notensystem (default: false)
  playAllButton?: boolean; // "Alle abspielen" Button (default: true)
  autoPlayDelay?: number; // Verzögerung zwischen Tönen in ms (default: 300)
  octave?: number; // Startoktave (default: 4)
}
```

**Visuelles Design:**

```
┌─────────────────────────────────────────────────────┐
│  C-Dur Tonleiter                                    │
│                                                     │
│  ┌─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┐            │
│  │ │█│ │█│ │ │ │█│ │█│ │█│ │ │ │            │
│  │C│ │D│ │E│F│ │G│ │A│ │B│C│ │ │            │
│  └─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┘            │
│   ▲   ▲   ▲   ▲   ▲   ▲   ▲   ▲                    │
│   └───┴───┴───┴───┴───┴───┴───┘ Klickbar         │
│                                                     │
│  [▶ Ganze Tonleiter abspielen]                      │
│                                                     │
│  Klicke auf die Töne, um sie zu hören              │
└─────────────────────────────────────────────────────┘
```

**Features:**

- Klickbare Klaviertasten
- Visuelles Feedback beim Abspielen (Taste leuchtet)
- "Alle abspielen" spielt Tonleiter aufwärts
- Optional: Notensystem-Ansicht

---

### 3.2 ChordBuilder (Akkord-Builder)

**Props:**

```typescript
interface ChordBuilderProps {
  root: NoteName; // "C"
  type: ChordType; // "major" | "minor" | "dim" | "aug" | "7" | "maj7" | "m7"
  title?: string; // "C-Dur Akkord"
  showSteps?: boolean; // Schritt-für-Schritt Modus (default: true)
  showPiano?: boolean; // Klaviatur anzeigen (default: true)
  showStaff?: boolean; // Notensystem anzeigen (default: false)
  playTogether?: boolean; // Akkord zusammen spielen (default: true)
}
```

**Visuelles Design (Schritt-Modus):**

```
┌─────────────────────────────────────────────────────┐
│  C-Dur Akkord aufgebaut                             │
│                                                     │
│  Schritt 1: Grundton                                │
│  ┌─┬─┬─┬─┬─┬─┬─┐                                   │
│  │C│ │ │ │ │ │ │  [▶] Hören                        │
│  └─┴─┴─┴─┴─┴─┴─┘                                   │
│                                                     │
│  Schritt 2: + Terz (E)                              │
│  ┌─┬─┬─┬─┬─┬─┬─┐                                   │
│  │C│ │ │E│ │ │ │  [▶] Hören                        │
│  └─┴─┴─┴─┴─┴─┴─┘                                   │
│                                                     │
│  Schritt 3: + Quinte (G)                            │
│  ┌─┬─┬─┬─┬─┬─┬─┐                                   │
│  │C│ │ │E│ │G│ │  [▶] Hören                        │
│  └─┴─┴─┴─┴─┴─┴─┘                                   │
│                                                     │
│  Fertiger Akkord:                                   │
│  [▶ C-Dur Akkord spielen]                           │
│                                                     │
│  Töne: C - E - G (Grundton, große Terz, Quinte)    │
└─────────────────────────────────────────────────────┘
```

**Features:**

- Schritt-für-Schritt Aufbau
- Jeder Schritt einzeln abspielbar
- Finale Akkord-Wiedergabe
- Erklärung der Intervalle

---

### 3.3 CircleOfFifths (Quintenzirkel)

**Props:**

```typescript
interface CircleOfFifthsProps {
  title?: string; // "Der Quintenzirkel"
  description?: string; // "Klicke auf eine Tonart"
  showMinor?: boolean; // Moll-Tonarten anzeigen (default: true)
  showSignatures?: boolean; // Vorzeichen anzeigen (default: true)
  selectedKey?: NoteName; // Vorselektierte Tonart
  onKeySelect?: (key: KeyInfo) => void; // Callback
}

interface KeyInfo {
  note: NoteName;
  type: "major" | "minor";
  signature: string; // "2#" | "3b" | "0"
  relativeMinor?: NoteName; // Parallel-Moll
  scale: NoteName[]; // Tonleiter
}
```

**Visuelles Design:**

```
┌─────────────────────────────────────────────────────┐
│  Der Quintenzirkel                                  │
│                                                     │
│                     C                               │
│                   /   \                             │
│                 F       G                           │
│               /   0#    \                           │
│             Bb           D                          │
│           / 2b          2# \                        │
│         Eb               A                          │
│           \ 3b          3# /                        │
│             Ab              E                       │
│               \ 4b    4#  /                         │
│                 Db    B                             │
│                   \   /                             │
│                    Gb                               │
│                                                     │
│  ┌─ C-Dur gewählt ────────────────────────┐       │
│  │ Tonleiter: C D E F G A B C             │       │
│  │ Vorzeichen: keine                       │       │
│  │ Parallel-Moll: a-Moll                   │       │
│  │                                         │       │
│  │ [▶ Tonleiter anhören]                   │       │
│  │ [▶ Akkord anhören]                      │       │
│  └─────────────────────────────────────────┘       │
│                                                     │
│  Klicke auf eine Tonart für Details                │
└─────────────────────────────────────────────────────┘
```

**Features:**

- Klickbare Tonarten
- Info-Panel mit Details
- Tonleiter + Akkord abspielbar
- Vorzeichen-Anzeige
- Dur/Moll-Beziehung

---

## 4. Audio-Utilities API

### 4.1 Core Functions

```typescript
// src/utils/audio/index.ts

// AudioContext initialisieren (muss nach User-Interaktion sein)
export function initAudio(): Promise<void>;

// Einzelnen Ton abspielen
export function playNote(
  note: NoteName, // "C", "C#", "D", etc.
  octave?: number, // default: 4
  duration?: number // in Sekunden, default: 0.5
): Promise<void>;

// Mehrere Töne nacheinander abspielen
export function playNotes(
  notes: NoteName[],
  octave?: number,
  delay?: number // Verzögerung zwischen Tönen in ms
): Promise<void>;

// Akkord abspielen (Töne gleichzeitig)
export function playChord(
  notes: NoteName[],
  octave?: number,
  duration?: number
): Promise<void>;

// Akkord arpeggiieren (nacheinander)
export function playArpeggio(
  notes: NoteName[],
  octave?: number,
  delay?: number
): Promise<void>;
```

### 4.2 Note-to-Frequency Mapping

```typescript
// src/utils/audio/frequencies.ts

type NoteName =
  | "C"
  | "C#"
  | "D"
  | "D#"
  | "E"
  | "F"
  | "F#"
  | "G"
  | "G#"
  | "A"
  | "A#"
  | "B";

// A4 = 440Hz als Referenz
const A4_FREQUENCY = 440;
const A4_MIDI = 69;

// Note + Oktave → Frequenz
export function noteToFrequency(note: NoteName, octave: number): number;

// Note + Oktave → MIDI Note Number
export function noteToMidi(note: NoteName, octave: number): number;

// Alle Frequenzen vorberechnet (für Performance)
export const NOTE_FREQUENCIES: Record<string, number>;
```

### 4.3 Synth-Konfiguration

```typescript
// src/utils/audio/synth.ts

// Synth-Presets für verschiedene Sounds
export const SYNTH_PRESETS = {
  piano: {
    oscillator: { type: "triangle" as ToneType },
    envelope: { attack: 0.01, decay: 0.3, sustain: 0.2, release: 0.8 },
  },
  organ: {
    oscillator: { type: "sine" as ToneType },
    envelope: { attack: 0.05, decay: 0.1, sustain: 0.8, release: 0.3 },
  },
  soft: {
    oscillator: { type: "sine" as ToneType },
    envelope: { attack: 0.1, decay: 0.2, sustain: 0.5, release: 1.0 },
  },
};

// Standard-Synth (Piano-ähnlich)
export const DEFAULT_SYNTH = SYNTH_PRESETS.piano;
```

---

## 5. Musik-Daten

### 5.1 Tonleiter-Definitionen

```typescript
// src/data/music/scales.ts

export interface ScaleDefinition {
  name: string; // "Dur" | "Moll" | "Pentatonik"
  intervals: number[]; // [0, 2, 4, 5, 7, 9, 11] für Dur
  pattern: string[]; // ["Ganz", "Ganz", "Halb", "Ganz", "Ganz", "Ganz", "Halb"]
}

export const SCALES: Record<string, ScaleDefinition> = {
  major: {
    name: "Dur",
    intervals: [0, 2, 4, 5, 7, 9, 11],
    pattern: ["Ganz", "Ganz", "Halb", "Ganz", "Ganz", "Ganz", "Halb"],
  },
  minor: {
    name: "Moll (natürlich)",
    intervals: [0, 2, 3, 5, 7, 8, 10],
    pattern: ["Ganz", "Halb", "Ganz", "Ganz", "Halb", "Ganz", "Ganz"],
  },
  pentatonicMajor: {
    name: "Dur-Pentatonik",
    intervals: [0, 2, 4, 7, 9],
    pattern: ["Ganz", "Ganz", "1.5", "Ganz", "1.5"],
  },
};

// Tonleiter berechnen
export function getScale(root: NoteName, scaleType: string): NoteName[];
```

### 5.2 Akkord-Definitionen

```typescript
// src/data/music/chords.ts

export interface ChordDefinition {
  name: string; // "Dur" | "Moll" | "Dominant Septime"
  symbol: string; // "" | "m" | "7" | "maj7"
  intervals: number[]; // [0, 4, 7] für Dur
  notes: string[]; // ["Grundton", "große Terz", "Quinte"]
}

export const CHORDS: Record<string, ChordDefinition> = {
  major: {
    name: "Dur",
    symbol: "",
    intervals: [0, 4, 7],
    notes: ["Grundton", "große Terz", "Quinte"],
  },
  minor: {
    name: "Moll",
    symbol: "m",
    intervals: [0, 3, 7],
    notes: ["Grundton", "kleine Terz", "Quinte"],
  },
  dominant7: {
    name: "Dominant Septime",
    symbol: "7",
    intervals: [0, 4, 7, 10],
    notes: ["Grundton", "große Terz", "Quinte", "kleine Septime"],
  },
  major7: {
    name: "Große Septime",
    symbol: "maj7",
    intervals: [0, 4, 7, 11],
    notes: ["Grundton", "große Terz", "Quinte", "große Septime"],
  },
};

// Akkord berechnen
export function getChord(root: NoteName, chordType: string): NoteName[];
```

### 5.3 Quintenzirkel-Daten

```typescript
// src/data/music/circleOfFifths.ts

export interface CirclePosition {
  note: NoteName;
  majorKey: string; // "C-Dur"
  minorKey: string; // "a-Moll"
  signature: string; // "0" | "1#" | "2#" | "1b" | etc.
  signatureCount: number; // 0, 1, 2, 3, etc.
  signatureType: "sharp" | "flat" | "none";
}

// Quintenzirkel im Uhrzeigersinn (C startet oben)
export const CIRCLE_OF_FIFTHS: CirclePosition[] = [
  {
    note: "C",
    majorKey: "C-Dur",
    minorKey: "a-Moll",
    signature: "0",
    signatureCount: 0,
    signatureType: "none",
  },
  {
    note: "G",
    majorKey: "G-Dur",
    minorKey: "e-Moll",
    signature: "1#",
    signatureCount: 1,
    signatureType: "sharp",
  },
  {
    note: "D",
    majorKey: "D-Dur",
    minorKey: "h-Moll",
    signature: "2#",
    signatureCount: 2,
    signatureType: "sharp",
  },
  {
    note: "A",
    majorKey: "A-Dur",
    minorKey: "f#-Moll",
    signature: "3#",
    signatureCount: 3,
    signatureType: "sharp",
  },
  {
    note: "E",
    majorKey: "E-Dur",
    minorKey: "c#-Moll",
    signature: "4#",
    signatureCount: 4,
    signatureType: "sharp",
  },
  {
    note: "B",
    majorKey: "H-Dur",
    minorKey: "g#-Moll",
    signature: "5#",
    signatureCount: 5,
    signatureType: "sharp",
  },
  {
    note: "F#",
    majorKey: "F#-Dur",
    minorKey: "d#-Moll",
    signature: "6#",
    signatureCount: 6,
    signatureType: "sharp",
  },
  {
    note: "Gb",
    majorKey: "Gb-Dur",
    minorKey: "eb-Moll",
    signature: "6b",
    signatureCount: 6,
    signatureType: "flat",
  },
  {
    note: "Db",
    majorKey: "Db-Dur",
    minorKey: "bb-Moll",
    signature: "5b",
    signatureCount: 5,
    signatureType: "flat",
  },
  {
    note: "Ab",
    majorKey: "Ab-Dur",
    minorKey: "f-Moll",
    signature: "4b",
    signatureCount: 4,
    signatureType: "flat",
  },
  {
    note: "Eb",
    majorKey: "Eb-Dur",
    minorKey: "c-Moll",
    signature: "3b",
    signatureCount: 3,
    signatureType: "flat",
  },
  {
    note: "Bb",
    majorKey: "B-Dur",
    minorKey: "g-Moll",
    signature: "2b",
    signatureCount: 2,
    signatureType: "flat",
  },
  {
    note: "F",
    majorKey: "F-Dur",
    minorKey: "d-Moll",
    signature: "1b",
    signatureCount: 1,
    signatureType: "flat",
  },
];
```

---

## 6. Integration in Artikel

### 6.1 MDX-Konfiguration

```typescript
// astro.config.mjs (Erweiterung)

import { defineConfig } from "astro/config";

export default defineConfig({
  // ... existing config
  markdown: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
  // Komponenten global verfügbar machen
  vite: {
    define: {
      __COMPONENTS__: {
        InteractiveScale: "./src/components/Interactive/InteractiveScale.astro",
        ChordBuilder: "./src/components/Interactive/ChordBuilder.astro",
        CircleOfFifths: "./src/components/Interactive/CircleOfFifths.astro",
      },
    },
  },
});
```

### 6.2 Beispiel-Artikel

```markdown
---
title: "Die C-Dur Tonleiter verstehen"
description: "Lerne die C-Dur Tonleiter interaktiv kennen"
---

## Die C-Dur Tonleiter

Die C-Dur Tonleiter besteht aus 7 Tönen und ist die einfachste Tonleiter,
da sie keine Vorzeichen hat.

<InteractiveScale
notes={["C", "D", "E", "F", "G", "A", "B", "C"]}
title="C-Dur Tonleiter"
description="Klicke auf die Töne um sie zu hören"
/>

## Der C-Dur Akkord

Aus der Tonleiter können wir Akkorde bilden. Der C-Dur Akkord
besteht aus Grundton, großer Terz und Quinte.

<ChordBuilder 
  root="C"
  type="major"
  title="C-Dur Akkord Aufbau"
  showSteps={true}
/>

## Im Quintenzirkel

C-Dur steht oben im Quintenzirkel, da es keine Vorzeichen hat.

<CircleOfFifths 
  selectedKey="C"
  description="Klicke auf eine Tonart für mehr Informationen"
/>
```

---

## 7. Styling-Konzepte

### 7.1 CSS-Variablen

```css
/* src/components/Interactive/styles/variables.css */

:root {
  /* Piano Keys */
  --piano-white-key: #f8f9fa;
  --piano-black-key: #212529;
  --piano-key-border: #dee2e6;
  --piano-key-active: #4dabf7;
  --piano-key-playing: #ffd43b;

  /* Circle of Fifths */
  --circle-bg: #f8f9fa;
  --circle-node: #e9ecef;
  --circle-node-active: #4dabf7;
  --circle-node-hover: #d0ebff;
  --circle-text: #212529;
  --circle-line: #adb5bd;

  /* Common */
  --interactive-border-radius: 8px;
  --interactive-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  --play-button-bg: #228be6;
  --play-button-hover: #1c7ed6;
}
```

### 7.2 Responsive Design

```css
/* Mobile-first */
.interactive-scale {
  width: 100%;
  max-width: 600px;
  overflow-x: auto;
}

/* Tablet+ */
@media (min-width: 768px) {
  .interactive-scale {
    max-width: 700px;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .interactive-scale {
    max-width: 800px;
  }
}
```

---

## 8. Accessibility

### 8.1 ARIA-Labels

```astro
<!-- Klaviertaste -->
<button class="piano-key" aria-label="Note C spielen" aria-pressed="false" data-note="C">
  C
</button>

<!-- Play Button -->
<button class="play-button" aria-label="C-Dur Tonleiter abspielen">
  <span class="icon" aria-hidden="true">▶</span>
  Ganze Tonleiter abspielen
</button>
```

### 8.2 Keyboard Navigation

```typescript
// Keyboard Support
document.addEventListener("keydown", (e) => {
  // Space = Play
  if (e.code === "Space" && e.target.classList.contains("play-button")) {
    e.preventDefault();
    playScale();
  }

  // Pfeiltasten = Navigation zwischen Tönen
  if (e.code === "ArrowRight") {
    focusNextNote();
  }
});
```

---

## 9. Performance-Optimierungen

### 9.1 Lazy Loading

```astro
---
// Tone.js nur laden wenn Komponente sichtbar
const loadAudioLib = import("tone");
---

<script define:vars={{ loadAudioLib }}>
  // Intersection Observer für Lazy Loading
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        loadAudioLib.then((tone) => {
          // Initialize Tone.js
        });
        observer.unobserve(entry.target);
      }
    });
  });
</script>
```

### 9.2 AudioContext-Pooling

```typescript
// Singleton AudioContext
let audioContext: AudioContext | null = null;

export function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

// Bei Seitenwechsel aufräumen
export function disposeAudioContext(): void {
  if (audioContext) {
    audioContext.close();
    audioContext = null;
  }
}
```

---

## 10. Testing-Plan

### 10.1 Unit Tests

```typescript
// tests/utils/audio/frequencies.test.ts

describe("noteToFrequency", () => {
  it("should return 440 Hz for A4", () => {
    expect(noteToFrequency("A", 4)).toBe(440);
  });

  it("should return 261.63 Hz for C4 (approximately)", () => {
    expect(noteToFrequency("C", 4)).toBeCloseTo(261.63, 1);
  });
});

// tests/data/music/scales.test.ts

describe("getScale", () => {
  it("should return correct C major scale", () => {
    const scale = getScale("C", "major");
    expect(scale).toEqual(["C", "D", "E", "F", "G", "A", "B"]);
  });
});
```

### 10.2 E2E Tests

```typescript
// tests/e2e/interactive-scale.spec.ts

test("interactive scale plays notes on click", async ({ page }) => {
  await page.goto("/knowledge/c-major-scale");

  // Click on C note
  await page.click('[data-note="C"]');

  // Check if audio was played (check for visual feedback)
  await expect(page.locator('[data-note="C"]')).toHaveClass(/playing/);
});

test("play all button plays entire scale", async ({ page }) => {
  await page.goto("/knowledge/c-major-scale");

  await page.click(".play-all-button");

  // Wait for scale to finish (8 notes * 300ms = 2400ms)
  await page.waitForTimeout(2500);

  // All notes should have been played
  const playedNotes = await page.locator(".note.played").count();
  expect(playedNotes).toBe(8);
});
```

---

## 11. Timeline

### Tag 1: Grundlagen

| Zeit          | Aufgabe                                                 |
| ------------- | ------------------------------------------------------- |
| 09:00 - 10:00 | Tone.js installieren, Projekt-Setup                     |
| 10:00 - 12:00 | Audio-Utilities (audioContext, notePlayer, frequencies) |
| 13:00 - 15:00 | Musik-Daten (scales, chords, circleOfFifths)            |
| 15:00 - 17:00 | InteractiveScale Komponente                             |

**Deliverable:** Abspielbare Tonleiter funktioniert

---

### Tag 2: Komponenten

| Zeit          | Aufgabe                   |
| ------------- | ------------------------- |
| 09:00 - 12:00 | ChordBuilder Komponente   |
| 13:00 - 16:00 | CircleOfFifths Komponente |
| 16:00 - 17:00 | Styling & Polish          |

**Deliverable:** Alle 3 Komponenten funktionsfähig

---

### Tag 3: Integration & Testing

| Zeit          | Aufgabe                                   |
| ------------- | ----------------------------------------- |
| 09:00 - 11:00 | In Beispiel-Artikel einbinden             |
| 11:00 - 13:00 | Accessibility Testing                     |
| 14:00 - 16:00 | Browser Testing (Chrome, Firefox, Safari) |
| 16:00 - 17:00 | Dokumentation schreiben                   |

**Deliverable:** Fertige Integration, getestet, dokumentiert

---

## 12. Dependencies

```json
{
  "dependencies": {
    "tone": "^14.7.77"
  }
}
```

**Bundle Size:**

- Tone.js: ~40KB gzip (nur Synth-Teil)
- Eigener Code: ~15KB gzip
- **Gesamt:** ~55KB gzip

---

## 13. Risiken & Mitigation

| Risiko                                                | Wahrscheinlichkeit | Mitigation                                |
| ----------------------------------------------------- | ------------------ | ----------------------------------------- |
| AudioContext funktioniert nicht ohne User-Interaktion | Hoch               | Play-Button required, initAudio() onClick |
| Tone.js zu groß                                       | Niedrig            | Tree-shaking, nur Synth importieren       |
| Mobile Performance                                    | Mittel             | Lazy Loading, Touch-optimiert             |
| Browser-Kompatibilität                                | Niedrig            | Web Audio API ist gut unterstützt         |
| Accessibility                                         | Mittel             | ARIA-Labels, Keyboard-Navigation          |

---

## 14. Nächste Schritte

1. **Review** – Plan bestätigen
2. **Setup** – Tone.js installieren
3. **Implementierung** – Tag 1-3 ausführen
4. **Testing** – Manuelles Testen im Dev-Server
5. **Dokumentation** – Nutzung für Autoren

---

## 15. Rechtliche Sicherheit

### Warum diese Implementierung 100% rechtssicher ist

| Aspekt                   | Erklärung                                                          |
| ------------------------ | ------------------------------------------------------------------ |
| **Keine Audio-Samples**  | Alle Töne werden synthetisch erzeugt                               |
| **Keine Urheberrechte**  | Einzelne Töne und Intervalle sind nicht urheberrechtlich geschützt |
| **Keine GEMA-Pflicht**   | Keine Aufführung geschützter Werke                                 |
| **Keine Lizenzen nötig** | Tone.js ist MIT-lizenziert                                         |

### Was NICHT verwendet wird

- Keine MP3/WAV-Dateien von Dritten
- Keine Song-Ausschnitte
- Keine Samples aus geschützten Werken
- Keine YouTube/Spotify Embeds

### Ausnahme: Genre-Sound-Vergleiche

Falls in Zukunft Genre-Vergleiche gewünscht:

- Nur **selbst synthetisierte** Patterns (Tone.js)
- Oder **CC0/Public Domain** Quellen (freesound.org)
- **NIEMALS** geschützte Aufnahmen
