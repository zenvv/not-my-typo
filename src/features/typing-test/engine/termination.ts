import type { TestConfig } from "./engineTypes";

export interface TerminationSnapshot {
  config: TestConfig;
  wordIndex: number;
  wordCount: number;
  elapsedMs: number;
}

export function initialWordBatchSize(config: TestConfig): number {
  switch (config.mode) {
    case "words":
      return config.wordCount ?? 30;
    case "time":
    case "zen":
      return 60;
    case "quotes":
      return 0;
  }
}

// Time/zen modes stream words in as the user approaches the end of the
// current batch; words/quotes modes have a fixed list and never top up.
export function shouldFetchMore(snapshot: TerminationSnapshot): boolean {
  if (snapshot.config.mode !== "time" && snapshot.config.mode !== "zen") return false;
  return snapshot.wordIndex >= snapshot.wordCount - 10;
}

export function shouldTerminate(snapshot: TerminationSnapshot): boolean {
  const { config, wordIndex, wordCount, elapsedMs } = snapshot;
  switch (config.mode) {
    case "words":
    case "quotes":
      return wordIndex >= wordCount;
    case "time":
      return elapsedMs >= (config.duration ?? 30) * 1000;
    case "zen":
      return false;
  }
}
