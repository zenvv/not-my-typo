import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { soundOptions, defaultSoundId } from "@/config/sounds";

// The distinct "feel" a keystroke sound can be dispatched with: regular
// letter/number/punctuation keys get a subtle random pitch so repeated keys
// don't sound robotically identical; the big, always-the-same-shape keys
// (space, backspace, enter) deliberately get a deeper, muffled tone instead —
// mirroring how those switches sound duller on a real keyboard.
export type KeystrokeKind = "char" | "space" | "backspace" | "enter";

interface SoundContextValue {
  soundId: string;
  setSoundId: (id: string) => void;
  volume: number;
  setVolume: (volume: number) => void;
  playKeystroke: (kind?: KeystrokeKind) => void;
  preview: (id: string) => void;
}

const SoundContext = createContext<SoundContextValue | null>(null);

const DEFAULT_VOLUME = 0.5;

const MUFFLED_KINDS: ReadonlySet<KeystrokeKind> = new Set([
  "space",
  "backspace",
  "enter",
]);

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

let sharedAudioContext: AudioContext | null = null;
function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined" || !window.AudioContext) return null;
  if (!sharedAudioContext) sharedAudioContext = new AudioContext();
  return sharedAudioContext;
}

// Decoded buffers are cached by URL at module scope (not per-provider-instance
// state) since they never change and re-decoding on every mount would be wasted work.
const bufferCache = new Map<string, Promise<AudioBuffer | null>>();
function loadBuffer(
  ctx: AudioContext,
  url: string,
): Promise<AudioBuffer | null> {
  let cached = bufferCache.get(url);
  if (!cached) {
    cached = fetch(url)
      .then((res) => res.arrayBuffer())
      .then((data) => ctx.decodeAudioData(data))
      .catch(() => null);
    bufferCache.set(url, cached);
  }
  return cached;
}

export function SoundProvider({ children }: { children: ReactNode }) {
  const [soundId, setSoundId] = useLocalStorage(
    "typo-dash:sound",
    defaultSoundId,
  );
  const [volume, setVolume] = useLocalStorage(
    "typo-dash:sound-volume",
    DEFAULT_VOLUME,
  );
  const volumeRef = useRef(volume);
  volumeRef.current = volume;

  // Preload the selected pack so the first keystroke of a run doesn't have to
  // wait on a network fetch + decode.
  useEffect(() => {
    const option = soundOptions.find((o) => o.id === soundId);
    const ctx = getAudioContext();
    if (option?.fileUrl && ctx) loadBuffer(ctx, option.fileUrl);
  }, [soundId]);

  const playUrl = useCallback((url: string, kind: KeystrokeKind) => {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === "suspended") ctx.resume().catch(() => {});

    loadBuffer(ctx, url).then((buffer) => {
      if (!buffer) return;
      const muffled = MUFFLED_KINDS.has(kind);

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.playbackRate.value = muffled
        ? randomBetween(0.8, 0.9)
        : randomBetween(0.98, 1);

      const gain = ctx.createGain();
      gain.gain.value = volumeRef.current;

      if (muffled) {
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = randomBetween(950, 1000);
        source.connect(filter).connect(gain).connect(ctx.destination);
      } else {
        source.connect(gain).connect(ctx.destination);
      }

      source.start();
    });
  }, []);

  const playKeystroke = useCallback(
    (kind: KeystrokeKind = "char") => {
      const option = soundOptions.find((o) => o.id === soundId);
      if (!option?.fileUrl) return;
      playUrl(option.fileUrl, kind);
    },
    [soundId, playUrl],
  );

  const preview = useCallback(
    (id: string) => {
      const option = soundOptions.find((o) => o.id === id);
      if (!option?.fileUrl) return;
      playUrl(option.fileUrl, "char");
    },
    [playUrl],
  );

  const value = useMemo(
    () => ({ soundId, setSoundId, volume, setVolume, playKeystroke, preview }),
    [soundId, setSoundId, volume, setVolume, playKeystroke, preview],
  );

  return (
    <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
  );
}

export function useSound() {
  const ctx = useContext(SoundContext);
  if (!ctx) {
    throw new Error("useSound must be used within a SoundProvider");
  }
  return ctx;
}
