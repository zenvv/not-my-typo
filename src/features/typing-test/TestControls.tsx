import { useEffect, useRef, useState } from "react";
import { Globe } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTestSettings } from "@/context/TestSettingsContext";
import {
  modeOptions,
  modeIcons,
  wordCountOptions,
  durationOptions,
  languageOptions,
  quoteLengthOptions,
} from "@/config/modes";
import type { TestMode, QuoteLength } from "./engine/engineTypes";
import type { Language } from "@/lib/words/wordSource";
import DifficultyButton from "./DifficultyButton";
import MobileModeButton from "./MobileModeButton";
import MobileLanguageButton from "./MobileLanguageButton";

function TestControls() {
  const {
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
  } = useTestSettings();

  const [languagePulse, setLanguagePulse] = useState(0);
  const isFirstLanguageRender = useRef(true);
  useEffect(() => {
    if (isFirstLanguageRender.current) {
      isFirstLanguageRender.current = false;
      return;
    }
    setLanguagePulse((key) => key + 1);
  }, [language]);

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
      <div className="flex md:hidden items-center gap-2">
        <MobileModeButton />
        {mode !== "quotes" && <MobileLanguageButton />}
      </div>

      <div className="hidden md:flex flex-wrap items-center justify-center gap-3">
      <ToggleGroup
        type="single"
        spacing={0}
        value={mode}
        onValueChange={(value) => value && setMode(value as TestMode)}
        variant="default"
        className="border overflow-hidden p-0.5 rounded-xl"
        aria-label="Test mode"
      >
        {modeOptions.map((option) => {
          const Icon = modeIcons[option.id];
          return (
            <ToggleGroupItem
              key={option.id}
              value={option.id}
              className="gap-1.5"
            >
              <Icon className="size-3.5" />
              {option.label}
            </ToggleGroupItem>
          );
        })}
      </ToggleGroup>

      {mode !== "quotes" && (
        <DifficultyButton value={difficulty} onValueChange={setDifficulty} />
      )}

      <div key={mode} className="animate-in fade-in-0 zoom-in-95 duration-200">
        {mode === "words" && (
          <ToggleGroup
            type="single"
            spacing={0}
            value={String(wordCount)}
            onValueChange={(value) => value && setWordCount(Number(value))}
            variant="default"
            className="border overflow-hidden p-0.5 rounded-xl"
            aria-label="Word count"
          >
            {wordCountOptions.map((count) => (
              <ToggleGroupItem key={count} value={String(count)}>
                {count}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        )}

        {mode === "time" && (
          <ToggleGroup
            type="single"
            spacing={0}
            value={String(duration)}
            onValueChange={(value) => value && setDuration(Number(value))}
            variant="default"
            className="border overflow-hidden p-0.5 rounded-xl"
            aria-label="Duration"
          >
            {durationOptions.map((seconds) => (
              <ToggleGroupItem key={seconds} value={String(seconds)}>
                {seconds}s
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        )}

        {mode === "quotes" && (
          <ToggleGroup
            type="single"
            spacing={0}
            value={quoteLength ?? "all"}
            onValueChange={(value) =>
              value && setQuoteLength(value === "all" ? null : (value as QuoteLength))
            }
            variant="default"
            className="border overflow-hidden p-0.5 rounded-xl"
            aria-label="Quote length"
          >
            <ToggleGroupItem value="all">All</ToggleGroupItem>
            {quoteLengthOptions.map((option) => (
              <ToggleGroupItem key={option.id} value={option.id}>
                {option.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        )}
      </div>

      {mode !== "quotes" && (
        <div className="relative">
          <Select
            value={language}
            onValueChange={(value) => setLanguage(value as Language)}
          >
            <SelectTrigger
              className="group w-40 gap-0 flex h-9!"
              aria-label="Language"
            >
              <Globe className="size-3.5 m-0! transition-transform duration-300 group-hover:rotate-25" />
              <SelectValue className="m-0! p-0!" />
            </SelectTrigger>
            <SelectContent>
              {languageOptions.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {languagePulse > 0 && (
            <span
              key={languagePulse}
              aria-hidden
              className="animate-select-pulse pointer-events-none absolute inset-0 rounded-lg ring-2 ring-ring"
            />
          )}
        </div>
      )}
      </div>
    </div>
  );
}

export default TestControls;
