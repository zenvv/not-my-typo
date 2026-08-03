// Synthesizes typo-dash's 4 keystroke sound packs as small WAV files under
// public/sounds/. Self-authored (sine/noise bursts with hand-tuned envelopes,
// no sampled/licensed audio) so the sound settings feature works out of the
// box with zero external assets. Re-run with `node scripts/generate-key-sounds.mjs`
// if the envelopes ever need retuning.
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "..", "public", "sounds");
const SAMPLE_RATE = 44100;

function fadeEdges(samples, fadeInN = 4, fadeOutN = 48) {
  const n = samples.length;
  const fadeIn = Math.min(fadeInN, n);
  const fadeOut = Math.min(fadeOutN, n);
  for (let i = 0; i < fadeIn; i++) samples[i] *= i / fadeIn;
  for (let i = 0; i < fadeOut; i++) {
    const idx = n - 1 - i;
    samples[idx] *= i / fadeOut;
  }
  return samples;
}

function genSoft() {
  const dur = 0.07;
  const n = Math.floor(SAMPLE_RATE * dur);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE;
    const env = Math.exp(-t * 38);
    out[i] = Math.sin(2 * Math.PI * 190 * t) * env * 0.5;
  }
  return fadeEdges(out);
}

function genClicky() {
  const dur = 0.03;
  const n = Math.floor(SAMPLE_RATE * dur);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE;
    const env = Math.exp(-t * 160);
    const noise = Math.random() * 2 - 1;
    const tone = Math.sin(2 * Math.PI * 3200 * t);
    out[i] = (noise * 0.6 + tone * 0.4) * env * 0.5;
  }
  return fadeEdges(out, 2, 24);
}

function genMechanical() {
  const dur = 0.09;
  const n = Math.floor(SAMPLE_RATE * dur);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE;
    const transient = t < 0.004 ? (Math.random() * 2 - 1) * 0.7 : 0;
    const ring = Math.sin(2 * Math.PI * 2500 * t) * Math.exp(-t * 24) * 0.35;
    const body = Math.sin(2 * Math.PI * 600 * t) * Math.exp(-t * 35) * 0.35;
    out[i] = (transient + ring + body) * 0.5;
  }
  return fadeEdges(out, 2, 48);
}

function genTypewriter() {
  const dur = 0.11;
  const n = Math.floor(SAMPLE_RATE * dur);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE;
    const transient = t < 0.006 ? (Math.random() * 2 - 1) * 0.6 : 0;
    const freq = Math.max(260 - t * 1600, 60);
    const body = Math.sin(2 * Math.PI * freq * t) * Math.exp(-t * 20) * 0.6;
    out[i] = (transient + body) * 0.5;
  }
  return fadeEdges(out, 2, 64);
}

function writeWav(filePath, samples, sampleRate) {
  const numSamples = samples.length;
  const dataSize = numSamples * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < numSamples; i++) {
    const clamped = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(Math.round(clamped * 32767), 44 + i * 2);
  }

  writeFileSync(filePath, buffer);
}

mkdirSync(OUT_DIR, { recursive: true });

const sounds = {
  "soft.wav": genSoft(),
  "clicky.wav": genClicky(),
  "mechanical.wav": genMechanical(),
  "typewriter.wav": genTypewriter(),
};

for (const [name, samples] of Object.entries(sounds)) {
  writeWav(path.join(OUT_DIR, name), samples, SAMPLE_RATE);
  console.log(`wrote public/sounds/${name} (${samples.length} samples)`);
}
