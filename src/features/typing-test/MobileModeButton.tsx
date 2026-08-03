import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useTestSettings } from "@/context/TestSettingsContext";
import {
  modeOptions,
  modeIcons,
  wordCountOptions,
  durationOptions,
  quoteLengthOptions,
  difficultyOptions,
} from "@/config/modes";
import type { TestMode, QuoteLength } from "./engine/engineTypes";

function MobileModeButton() {
  const settings = useTestSettings();
  const [open, setOpen] = useState(false);

  const [mode, setDraftMode] = useState<TestMode>(settings.mode);
  const [wordCount, setDraftWordCount] = useState(settings.wordCount);
  const [duration, setDraftDuration] = useState(settings.duration);
  const [difficulty, setDraftDifficulty] = useState(settings.difficulty);
  const [quoteLength, setDraftQuoteLength] = useState<QuoteLength | null>(
    settings.quoteLength,
  );

  function handleOpenChange(next: boolean) {
    if (next) {
      setDraftMode(settings.mode);
      setDraftWordCount(settings.wordCount);
      setDraftDuration(settings.duration);
      setDraftDifficulty(settings.difficulty);
      setDraftQuoteLength(settings.quoteLength);
    }
    setOpen(next);
  }

  function handleApply() {
    settings.setMode(mode);
    settings.setWordCount(wordCount);
    settings.setDuration(duration);
    settings.setDifficulty(difficulty);
    settings.setQuoteLength(quoteLength);
    setOpen(false);
  }

  const ActiveIcon = modeIcons[settings.mode];
  const activeLabel = modeOptions.find((o) => o.id === settings.mode)?.label;
  const activeDifficulty =
    difficultyOptions.find((o) => o.value === difficulty) ??
    difficultyOptions[0];

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="default" className="gap-1.5 h-8">
          <ActiveIcon className="size-3.5" />
          {activeLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm gap-0 overflow-hidden p-0">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle>Mode</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-5 p-4">
          <ToggleGroup
            type="single"
            spacing={0}
            value={mode}
            onValueChange={(value) => value && setDraftMode(value as TestMode)}
            className="w-full overflow-hidden rounded-xl border p-0.5"
            aria-label="Test mode"
          >
            {modeOptions.map((option) => {
              const Icon = modeIcons[option.id];
              return (
                <ToggleGroupItem
                  key={option.id}
                  value={option.id}
                  className="flex-1 gap-1.5"
                >
                  <Icon className="size-3.5" />
                  {option.label}
                </ToggleGroupItem>
              );
            })}
          </ToggleGroup>

          {mode === "words" && (
            <section className="flex flex-col gap-2">
              <span className="text-xs font-medium text-muted-foreground">
                Word count
              </span>
              <ToggleGroup
                type="single"
                spacing={0}
                value={String(wordCount)}
                onValueChange={(value) =>
                  value && setDraftWordCount(Number(value))
                }
                className="w-full overflow-hidden rounded-xl border p-0.5"
              >
                {wordCountOptions.map((count) => (
                  <ToggleGroupItem
                    key={count}
                    value={String(count)}
                    className="flex-1"
                  >
                    {count}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </section>
          )}

          {mode === "time" && (
            <section className="flex flex-col gap-2">
              <span className="text-xs font-medium text-muted-foreground">
                Duration
              </span>
              <ToggleGroup
                type="single"
                spacing={0}
                value={String(duration)}
                onValueChange={(value) =>
                  value && setDraftDuration(Number(value))
                }
                className="w-full overflow-hidden rounded-xl border p-0.5"
              >
                {durationOptions.map((seconds) => (
                  <ToggleGroupItem
                    key={seconds}
                    value={String(seconds)}
                    className="flex-1"
                  >
                    {seconds}s
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </section>
          )}

          {mode === "quotes" && (
            <section className="flex flex-col gap-2">
              <span className="text-xs font-medium text-muted-foreground">
                Quote length
              </span>
              <ToggleGroup
                type="single"
                spacing={0}
                value={quoteLength ?? "all"}
                onValueChange={(value) =>
                  value &&
                  setDraftQuoteLength(
                    value === "all" ? null : (value as QuoteLength),
                  )
                }
                className="w-full overflow-hidden rounded-xl border p-0.5"
              >
                <ToggleGroupItem value="all" className="flex-1">
                  All
                </ToggleGroupItem>
                {quoteLengthOptions.map((option) => (
                  <ToggleGroupItem
                    key={option.id}
                    value={option.id}
                    className="flex-1"
                  >
                    {option.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </section>
          )}

          {mode !== "quotes" && (
            <>
              <Separator />
              <section className="flex flex-col gap-2">
                <span className="text-xs font-medium text-muted-foreground">Difficulty</span>
                <ToggleGroup
                  type="single"
                  spacing={0}
                  value={String(difficulty)}
                  onValueChange={(next) => next && setDraftDifficulty(Number(next))}
                  className="w-full overflow-hidden rounded-xl border p-0.5"
                  aria-label="Word difficulty"
                >
                  {difficultyOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <ToggleGroupItem
                        key={option.value}
                        value={String(option.value)}
                        className="flex-1 gap-1"
                      >
                        <Icon weight={option.weight} className={cn("size-3.5", option.colorClassName)} />
                        {option.label !== "Off" && option.label}
                      </ToggleGroupItem>
                    );
                  })}
                </ToggleGroup>
                <p className="text-center text-xs font-medium text-muted-foreground">
                  {activeDifficulty.label === "Off" ? "Off" : `Level ${activeDifficulty.label}`}
                </p>
              </section>
            </>
          )}
        </div>

        <DialogFooter className="rounded-t-none grid grid-cols-2 gap-4 m-0!">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleApply}>Apply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default MobileModeButton;
