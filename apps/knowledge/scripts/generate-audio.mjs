import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SAMPLE_RATE = 44100;
const DURATION = 8;
const LENGTH = SAMPLE_RATE * DURATION;
const outputDirectory = fileURLToPath(
  new URL("../public/audio/dub-space/", import.meta.url)
);
const clamp = (value) => Math.max(-1, Math.min(1, value));
const envelope = (time, start, duration, attack = 0.01, release = 0.2) => {
  const local = time - start;
  if (local < 0 || local >= duration) return 0;
  if (local < attack) return local / attack;
  return Math.min(1, (duration - local) / release);
};
let seed = 20260801;
const noise = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return (seed / 0xffffffff) * 2 - 1;
};
const layers = Object.fromEntries(
  ["rhythm", "bass", "harmony", "melody", "effects"].map((name) => [
    name,
    new Float32Array(LENGTH),
  ])
);

for (let index = 0; index < LENGTH; index += 1) {
  const time = index / SAMPLE_RATE;
  const beat = Math.floor(time / 0.5);
  const beatStart = beat * 0.5;
  const beatTime = time - beatStart;
  const kick =
    beat % 2 === 0
      ? Math.sin(2 * Math.PI * (68 - beatTime * 35) * beatTime) * Math.exp(-beatTime * 14)
      : 0;
  const snare =
    beat % 4 === 2 && beatTime < 0.16 ? noise() * Math.exp(-beatTime * 22) * 0.38 : 0;
  const hat = beatTime < 0.035 ? noise() * Math.exp(-beatTime * 70) * 0.08 : 0;
  layers.rhythm[index] = clamp(kick * 0.7 + snare + hat);

  const barPosition = time % 4;
  const bassNotes = [
    [0, 55],
    [0.75, 55],
    [1.5, 65.41],
    [2.25, 49],
    [3.25, 55],
  ];
  let bassValue = 0;
  for (const [start, frequency] of bassNotes) {
    const env = envelope(barPosition, start, 0.58, 0.02, 0.16);
    bassValue += Math.sin(2 * Math.PI * frequency * time) * env * 0.55;
    bassValue += Math.sin(2 * Math.PI * frequency * 2 * time) * env * 0.1;
  }
  layers.bass[index] = clamp(bassValue);

  const offbeat = (time + 0.25) % 0.5;
  const chordEnv = offbeat < 0.13 ? Math.sin((Math.PI * offbeat) / 0.13) : 0;
  layers.harmony[index] =
    chordEnv *
    (Math.sin(2 * Math.PI * 220 * time) +
      Math.sin(2 * Math.PI * 277.18 * time) +
      Math.sin(2 * Math.PI * 329.63 * time)) *
    0.1;

  const phrase = time % 8;
  const melodyNotes = [
    [1.05, 440],
    [1.55, 392],
    [5.05, 329.63],
    [5.55, 392],
  ];
  let melodyValue = 0;
  for (const [start, frequency] of melodyNotes)
    melodyValue +=
      Math.sin(2 * Math.PI * frequency * time) *
      envelope(phrase, start, 0.34, 0.03, 0.15) *
      0.22;
  layers.melody[index] = melodyValue;
}

const delaySamples = Math.round(SAMPLE_RATE * 0.375);
for (let index = 0; index < LENGTH; index += 1) {
  let value = 0;
  for (let repeat = 1; repeat <= 5; repeat += 1) {
    const sourceIndex = index - delaySamples * repeat;
    if (sourceIndex >= 0)
      value +=
        (layers.harmony[sourceIndex] + layers.rhythm[sourceIndex] * 0.32) *
        0.55 ** repeat;
  }
  layers.effects[index] = clamp(value * 0.85);
}

const fullMix = new Float32Array(LENGTH);
for (let index = 0; index < LENGTH; index += 1)
  fullMix[index] = clamp(
    Object.values(layers).reduce((sum, layer) => sum + layer[index], 0) * 0.72
  );

function writeWav(fileName, samples) {
  const dataSize = samples.length * 2;
  const buffer = Buffer.alloc(44 + dataSize);
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(SAMPLE_RATE * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);
  samples.forEach((sample, index) =>
    buffer.writeInt16LE(Math.round(clamp(sample) * 32767), 44 + index * 2)
  );
  fs.writeFileSync(path.join(outputDirectory, fileName), buffer);
}

function writeWavTo(directory, fileName, samples) {
  const previous = outputDirectory;
  const dataSize = samples.length * 2;
  const buffer = Buffer.alloc(44 + dataSize);
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(SAMPLE_RATE * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);
  samples.forEach((sample, index) =>
    buffer.writeInt16LE(Math.round(clamp(sample) * 32767), 44 + index * 2)
  );
  fs.writeFileSync(path.join(directory, fileName), buffer);
  void previous;
}

fs.mkdirSync(outputDirectory, { recursive: true });
for (const [name, samples] of Object.entries(layers)) writeWav(`${name}.wav`, samples);
writeWav("full-mix.wav", fullMix);
fs.writeFileSync(
  path.join(outputDirectory, "README.txt"),
  "Original procedural audio generated for MelodyMind Knowledge. No third-party samples. 44.1 kHz, 16-bit mono, 8 seconds.\n"
);
console.log("Generated five synchronized stems and one full mix.");

const guitarDirectory = fileURLToPath(
  new URL("../public/audio/guitar-width/", import.meta.url)
);
const guitarLayers = Object.fromEntries(
  ["drums", "bass", "guitar-left", "guitar-right", "room"].map((name) => [
    name,
    new Float32Array(LENGTH),
  ])
);
const riffFrequencies = [82.41, 82.41, 98, 110, 82.41, 123.47, 110, 98];
for (let index = 0; index < LENGTH; index += 1) {
  const time = index / SAMPLE_RATE;
  const eighth = Math.floor(time / 0.25);
  const local = time % 0.25;
  const frequency = riffFrequencies[eighth % riffFrequencies.length];
  const pick = Math.exp(-local * 15);
  const guitar =
    Math.tanh(
      (Math.sin(2 * Math.PI * frequency * time) +
        0.42 * Math.sin(2 * Math.PI * frequency * 2 * time)) *
        pick *
        2.2
    ) * 0.28;
  guitarLayers["guitar-left"][index] = guitar;
  const shiftedTime = Math.max(0, time - 0.018);
  guitarLayers["guitar-right"][index] =
    Math.tanh(
      (Math.sin(2 * Math.PI * frequency * shiftedTime * 1.0015) +
        0.38 * Math.sin(2 * Math.PI * frequency * 2 * shiftedTime)) *
        pick *
        2.1
    ) * 0.27;
  const beatLocal = time % 0.5;
  const kick =
    Math.sin(2 * Math.PI * (72 - beatLocal * 30) * beatLocal) * Math.exp(-beatLocal * 16);
  const snareLocal = (time + 0.5) % 1;
  const snare = snareLocal < 0.12 ? noise() * Math.exp(-snareLocal * 25) : 0;
  guitarLayers.drums[index] = clamp(kick * 0.42 + snare * 0.18);
  guitarLayers.bass[index] =
    Math.sin(((2 * Math.PI * frequency) / 2) * time) * Math.exp(-local * 5) * 0.3;
  const roomIndex = index - Math.round(SAMPLE_RATE * 0.09);
  guitarLayers.room[index] =
    roomIndex >= 0
      ? (guitarLayers["guitar-left"][roomIndex] + guitarLayers.drums[roomIndex]) * 0.18
      : 0;
}
fs.mkdirSync(guitarDirectory, { recursive: true });
for (const [name, samples] of Object.entries(guitarLayers))
  writeWavTo(guitarDirectory, `${name}.wav`, samples);
const guitarMix = new Float32Array(LENGTH);
for (let index = 0; index < LENGTH; index += 1)
  guitarMix[index] = clamp(
    Object.values(guitarLayers).reduce((sum, layer) => sum + layer[index], 0) * 0.78
  );
writeWavTo(guitarDirectory, "full-mix.wav", guitarMix);
fs.writeFileSync(
  path.join(guitarDirectory, "README.txt"),
  "Original procedural guitar comparison generated for MelodyMind Knowledge. No third-party samples. 44.1 kHz, 16-bit mono, 8 seconds.\n"
);
console.log("Generated guitar-width stems and full mix.");
