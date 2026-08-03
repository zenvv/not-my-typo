import type { Language } from "@/lib/words/wordSource";

export type TestMode = "words" | "time" | "zen" | "quotes";

export type QuoteLength = "short" | "medium" | "long";

export interface TestConfig {
  mode: TestMode;
  wordCount?: 30 | 60 | 90;
  duration?: 15 | 30 | 60;
  language: Language;
  /** Word rarity filter passed to the word API's `diff` param (1-5). 0/undefined = off. */
  difficulty?: number;
  /** quotes mode only; null/undefined = any length. */
  quoteLength?: QuoteLength | null;
}

export type CharState = "pending" | "correct" | "incorrect";

export interface KeystrokeSnapshot {
  timestamp: number;
  correct: boolean;
  wordIndex: number;
  charIndex: number;
}

export type TestStatus = "idle" | "running" | "finished";
