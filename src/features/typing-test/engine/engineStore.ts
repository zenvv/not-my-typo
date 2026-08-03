import { create } from "zustand";
import type { KeystrokeSnapshot, TestConfig, TestStatus } from "./engineTypes";
import { shouldTerminate, type TerminationSnapshot } from "./termination";

interface EngineState {
  config: TestConfig;
  words: string[];
  wordIndex: number;
  typedWords: string[];
  currentInput: string;
  status: TestStatus;
  startedAt: number | null;
  finishedAt: number | null;
  keystrokeLog: KeystrokeSnapshot[];
  // Bumped on every start() — a stable key components can use to key a fresh
  // crossfade transition whenever the word batch is fully regenerated.
  runId: number;

  start: (config: TestConfig, words: string[]) => void;
  setCurrentInput: (value: string) => void;
  advanceWord: () => void;
  goToPreviousWord: () => void;
  appendWords: (words: string[]) => void;
  tick: () => void;
  stop: () => void;
  finish: () => void;
}

function elapsedSince(startedAt: number | null): number {
  return startedAt ? Date.now() - startedAt : 0;
}

function snapshotFor(state: EngineState): TerminationSnapshot {
  return {
    config: state.config,
    wordIndex: state.wordIndex,
    wordCount: state.words.length,
    elapsedMs: elapsedSince(state.startedAt),
  };
}

export const useEngineStore = create<EngineState>((set, get) => ({
  config: { mode: "words", wordCount: 30, language: "en" },
  words: [],
  wordIndex: 0,
  typedWords: [],
  currentInput: "",
  status: "idle",
  startedAt: null,
  finishedAt: null,
  keystrokeLog: [],
  runId: 0,

  start: (config, words) =>
    set((state) => ({
      config,
      words,
      wordIndex: 0,
      typedWords: [],
      currentInput: "",
      status: "idle",
      startedAt: null,
      finishedAt: null,
      keystrokeLog: [],
      runId: state.runId + 1,
    })),

  setCurrentInput: (value) => {
    const state = get();
    if (state.status === "finished") return;

    const { wordIndex, words, config } = state;
    const targetWord = words[wordIndex] ?? "";
    const prevLength = state.currentInput.length;

    const startedAt = state.startedAt ?? (value.length > 0 ? Date.now() : null);
    const status: TestStatus =
      state.status === "idle" && value.length > 0 ? "running" : state.status;

    let keystrokeLog = state.keystrokeLog;
    if (value.length > prevLength) {
      const addedIndex = value.length - 1;
      const correct = value[addedIndex] === targetWord[addedIndex];
      keystrokeLog = [
        ...keystrokeLog,
        { timestamp: Date.now(), correct, wordIndex, charIndex: addedIndex },
      ];
    }

    set({ currentInput: value, startedAt, status, keystrokeLog });

    // words/quotes modes finish the instant the final word is fully typed,
    // with no trailing space required. time/zen modes never end this way —
    // they end on elapsed time (tick) or a manual stop.
    const finishesOnLastWord = config.mode === "words" || config.mode === "quotes";
    const isLastWord = wordIndex === words.length - 1;
    if (finishesOnLastWord && isLastWord && value.length >= targetWord.length) {
      const typedWords = [...state.typedWords];
      typedWords[wordIndex] = value;
      set({ typedWords });
      get().finish();
    }
  },

  advanceWord: () => {
    const state = get();
    if (state.status === "finished" || state.currentInput.length === 0) return;

    const typedWords = [...state.typedWords];
    typedWords[state.wordIndex] = state.currentInput;
    const wordIndex = state.wordIndex + 1;

    if (shouldTerminate({ ...snapshotFor(state), wordIndex })) {
      set({ typedWords, currentInput: "" });
      get().finish();
      return;
    }

    set({ typedWords, wordIndex, currentInput: "" });
  },

  goToPreviousWord: () => {
    const state = get();
    if (
      state.status === "finished" ||
      state.wordIndex === 0 ||
      state.currentInput.length > 0
    ) {
      return;
    }
    const prevIndex = state.wordIndex - 1;
    set({ wordIndex: prevIndex, currentInput: state.typedWords[prevIndex] ?? "" });
  },

  appendWords: (newWords) => set((state) => ({ words: [...state.words, ...newWords] })),

  tick: () => {
    const state = get();
    if (state.status !== "running") return;
    if (shouldTerminate(snapshotFor(state))) {
      get().finish();
    }
  },

  stop: () => get().finish(),

  finish: () => {
    if (get().status === "finished") return;
    set({ status: "finished", finishedAt: Date.now() });
  },
}));
