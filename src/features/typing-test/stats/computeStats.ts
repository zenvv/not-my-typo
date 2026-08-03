import type { KeystrokeSnapshot } from "../engine/engineTypes";

export function computeWpm(log: KeystrokeSnapshot[], elapsedMs: number): number {
  if (elapsedMs <= 0) return 0;
  const minutes = elapsedMs / 60000;
  return Math.round(log.length / 5 / minutes);
}

export function computeCorrectWpm(log: KeystrokeSnapshot[], elapsedMs: number): number {
  if (elapsedMs <= 0) return 0;
  const minutes = elapsedMs / 60000;
  const correctChars = log.filter((k) => k.correct).length;
  return Math.round(correctChars / 5 / minutes);
}

export function computeAccuracy(log: KeystrokeSnapshot[]): number {
  if (log.length === 0) return 100;
  const correct = log.filter((k) => k.correct).length;
  return Math.round((correct / log.length) * 100);
}

export function computeMisses(log: KeystrokeSnapshot[]): number {
  return log.filter((k) => !k.correct).length;
}

export interface SecondBucket {
  second: number;
  correctWpm: number;
}

// One instantaneous-WPM sample per elapsed second, extrapolating that
// second's correct-char count to a per-minute rate — the same granularity
// both the live HUD and the results graph read from.
export function bucketBySecond(
  log: KeystrokeSnapshot[],
  startedAt: number,
  finishedAt: number
): SecondBucket[] {
  const totalSeconds = Math.max(1, Math.ceil((finishedAt - startedAt) / 1000));
  const buckets: SecondBucket[] = [];
  for (let second = 0; second < totalSeconds; second++) {
    const bucketStart = startedAt + second * 1000;
    const bucketEnd = bucketStart + 1000;
    const correctInBucket = log.filter(
      (k) => k.correct && k.timestamp >= bucketStart && k.timestamp < bucketEnd
    ).length;
    buckets.push({ second, correctWpm: Math.round(correctInBucket * (60 / 5)) });
  }
  return buckets;
}

// Coefficient-of-variation of the per-second WPM samples, inverted into a
// 0-100 score where higher means steadier typing (matching monkeytype's
// consistency convention).
export function computeConsistency(buckets: SecondBucket[]): number {
  if (buckets.length === 0) return 100;
  const values = buckets.map((b) => b.correctWpm);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  if (mean === 0) return 100;
  const variance = values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length;
  const stdDev = Math.sqrt(variance);
  const coefficientOfVariation = stdDev / mean;
  return Math.max(0, Math.round(100 - coefficientOfVariation * 100));
}
