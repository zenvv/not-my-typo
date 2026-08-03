import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { TestMode, QuoteLength } from "@/features/typing-test/engine/engineTypes";
import type { Language } from "@/lib/words/wordSource";
import {
  defaultMode,
  defaultWordCount,
  defaultDuration,
  defaultLanguage,
  defaultDifficulty,
} from "@/config/modes";

interface TestSettingsContextValue {
  mode: TestMode;
  setMode: (mode: TestMode) => void;
  wordCount: number;
  setWordCount: (count: number) => void;
  duration: number;
  setDuration: (duration: number) => void;
  language: Language;
  setLanguage: (language: Language) => void;
  difficulty: number;
  setDifficulty: (difficulty: number) => void;
  /** null = any length. */
  quoteLength: QuoteLength | null;
  setQuoteLength: (length: QuoteLength | null) => void;
}

const TestSettingsContext = createContext<TestSettingsContextValue | null>(null);

export function TestSettingsProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useLocalStorage<TestMode>("typo-dash:test-mode", defaultMode);
  const [wordCount, setWordCount] = useLocalStorage(
    "typo-dash:test-word-count",
    defaultWordCount
  );
  const [duration, setDuration] = useLocalStorage(
    "typo-dash:test-duration",
    defaultDuration
  );
  const [language, setLanguage] = useLocalStorage<Language>(
    "typo-dash:test-language",
    defaultLanguage
  );
  const [difficulty, setDifficulty] = useLocalStorage(
    "typo-dash:test-difficulty",
    defaultDifficulty
  );
  const [quoteLength, setQuoteLength] = useLocalStorage<QuoteLength | null>(
    "typo-dash:test-quote-length",
    null
  );

  const value = useMemo(
    () => ({
      mode,
      setMode,
      wordCount,
      setWordCount,
      duration,
      setDuration,
      language,
      setLanguage,
      difficulty,
      setDifficulty,
      quoteLength,
      setQuoteLength,
    }),
    [
      mode,
      setMode,
      wordCount,
      setWordCount,
      duration,
      setDuration,
      language,
      setLanguage,
      difficulty,
      setDifficulty,
      quoteLength,
      setQuoteLength,
    ]
  );

  return (
    <TestSettingsContext.Provider value={value}>{children}</TestSettingsContext.Provider>
  );
}

export function useTestSettings() {
  const ctx = useContext(TestSettingsContext);
  if (!ctx) {
    throw new Error("useTestSettings must be used within a TestSettingsProvider");
  }
  return ctx;
}
