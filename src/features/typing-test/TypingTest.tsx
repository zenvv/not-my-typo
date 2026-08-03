import { useEffect, useRef, useState } from "react";
import { Keyboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { getLocalWords, getWords } from "@/lib/words/wordSource";
import { getRandomQuote, type Quote } from "@/lib/quotes/getQuote";
import { useTestSettings } from "@/context/TestSettingsContext";
import { useStatsDisplay } from "@/context/StatsDisplayContext";
import { useAppearance } from "@/context/AppearanceContext";
import { useEngineStore } from "./engine/engineStore";
import { useEngineKeyboardCapture } from "./engine/useEngineKeyboardCapture";
import { initialWordBatchSize, shouldFetchMore } from "./engine/termination";
import type { TestConfig } from "./engine/engineTypes";
import { useLiveStats } from "./stats/useLiveStats";
import WordsDisplay from "./WordsDisplay";
import LiveGraph from "./LiveGraph";
import ResultsScreen from "./ResultsScreen";

function buildWords(config: TestConfig): { words: string[]; quoteSource: string | null } {
  if (config.mode === "quotes") {
    const quote: Quote = getRandomQuote(config.quoteLength);
    return { words: quote.text.split(" "), quoteSource: quote.source };
  }
  return {
    words: getLocalWords(config.language, initialWordBatchSize(config)),
    quoteSource: null,
  };
}

function TypingTest() {
  const settings = useTestSettings();
  const { resolvedScheme, setColorScheme } = useAppearance();
  const config: TestConfig = {
    mode: settings.mode,
    wordCount: settings.wordCount as TestConfig["wordCount"],
    duration: settings.duration as TestConfig["duration"],
    language: settings.language,
    difficulty: settings.difficulty || undefined,
    quoteLength: settings.quoteLength,
  };

  const start = useEngineStore((s) => s.start);
  const status = useEngineStore((s) => s.status);
  const wordIndex = useEngineStore((s) => s.wordIndex);
  const words = useEngineStore((s) => s.words);
  const runId = useEngineStore((s) => s.runId);
  const appendWords = useEngineStore((s) => s.appendWords);
  const tick = useEngineStore((s) => s.tick);
  const stop = useEngineStore((s) => s.stop);
  const { inputRef, currentInput, handleKeyDown, handleChange, focus } =
    useEngineKeyboardCapture();
  const { wpm, accuracy, elapsedMs } = useLiveStats();
  const { mode: statsMode } = useStatsDisplay();
  const requestId = useRef(0);
  const [quoteSource, setQuoteSource] = useState<string | null>(null);

  function startTest(nextConfig: TestConfig) {
    const built = buildWords(nextConfig);
    setQuoteSource(built.quoteSource);
    start(nextConfig, built.words);
  }

  // (Re)generate the test whenever settings change while not actively running.
  // Local words render instantly; if the live API answers in time and the
  // user hasn't started typing yet, silently upgrade to the live word list.
  useEffect(() => {
    if (status === "running") return;
    startTest(config);

    if (config.mode === "quotes") return;
    const thisRequest = ++requestId.current;
    getWords(config.language, initialWordBatchSize(config), config.difficulty).then((batch) => {
      if (batch.source !== "api") return;
      if (requestId.current !== thisRequest) return;
      if (useEngineStore.getState().status !== "idle") return;
      start(config, batch.words);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    settings.mode,
    settings.wordCount,
    settings.duration,
    settings.language,
    settings.difficulty,
    settings.quoteLength,
  ]);

  // Stream in more words for time/zen modes as the batch runs low.
  useEffect(() => {
    if (
      !shouldFetchMore({
        config,
        wordIndex,
        wordCount: words.length,
        elapsedMs: 0,
      })
    )
      return;
    getWords(config.language, 30, config.difficulty).then((batch) => appendWords(batch.words));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wordIndex]);

  // Time mode ends on the clock, not on keystrokes — poll while running.
  useEffect(() => {
    if (status !== "running" || config.mode !== "time") return;
    const interval = setInterval(tick, 250);
    return () => clearInterval(interval);
  }, [status, config.mode, tick]);

  function handleRestart() {
    startTest(config);
    focus();
  }

  // A global escape hatch: bail out of the current run mid-word and go back
  // to a fresh, idle test — regardless of which element has focus.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        handleRestart();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  // R (restart) and D (theme toggle) shortcuts. Both are letters the user
  // could otherwise be typing, so they're only live while the test isn't
  // running, and are ignored while some other text field (e.g. a settings
  // search box) has focus rather than the test's own hidden input.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey || e.metaKey || e.altKey || status === "running") return;

      const target = e.target as HTMLElement | null;
      const isOtherTextField =
        target &&
        target !== inputRef.current &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      if (isOtherTextField) return;

      const key = e.key.toLowerCase();
      if (key === "r" && status === "finished") {
        e.preventDefault();
        handleRestart();
      } else if (key === "d") {
        e.preventDefault();
        setColorScheme(resolvedScheme === "dark" ? "light" : "dark");
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, config, resolvedScheme, setColorScheme]);

  const remainingSeconds =
    config.mode === "time"
      ? Math.max(0, (config.duration ?? 30) - Math.floor(elapsedMs / 1000))
      : null;

  return (
    <div
      className="flex flex-col items-center justify-center w-full h-full gap-6"
      onClick={focus}
    >
      <input
        ref={inputRef}
        className="sr-only caret-transparent"
        value={currentInput}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        autoFocus
        aria-label="Typing test input"
      />

      <div className="sr-only" aria-live="polite">
        {status === "finished"
          ? "Test complete"
          : status === "running"
            ? `Word ${wordIndex + 1} of ${words.length}`
            : ""}
      </div>

      {status === "running" && (
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-6 text-lg font-bold text-muted-foreground">
            {remainingSeconds !== null ? (
              <span>{remainingSeconds}s</span>
            ) : (
              <span>{wpm} wpm</span>
            )}
            <span>{accuracy}% acc</span>
            {config.mode === "zen" && (
              <Button variant="ghost" size="sm" onClick={stop}>
                Finish
              </Button>
            )}
          </div>
          {statsMode === "graph" && <LiveGraph />}
        </div>
      )}

      {status === "finished" ? (
        <ResultsScreen onRestart={handleRestart} />
      ) : (
        <>
          <div className="relative w-full">
            <div
              key={runId}
              className="w-full animate-in fade-in-0 slide-in-from-bottom-1 duration-300"
            >
              <WordsDisplay />
            </div>

            {status === "idle" && (
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 flex items-center justify-center  backdrop-blur-[2px]"
              >
                <div className="flex items-center gap-2 rounded-lg border bg-popover-foreground px-4 py-2 text-sm font-medium text-muted! ring-1 ring-foreground/10 ">
                  <Keyboard className="size-4" />
                  <span className="shimmer">Start typing to begin</span>
                </div>
              </div>
            )}
          </div>

          {config.mode === "quotes" && quoteSource && (
            <p className="text-xs text-muted-foreground/60 italic">— {quoteSource}</p>
          )}

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground/70">
            <Kbd>Esc</Kbd>
            <span>restarts the test</span>
          </div>
        </>
      )}
    </div>
  );
}

export default TypingTest;
