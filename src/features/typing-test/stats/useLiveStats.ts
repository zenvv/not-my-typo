import { useEffect, useState } from "react";
import { useEngineStore } from "../engine/engineStore";
import { computeAccuracy, computeCorrectWpm, computeWpm } from "./computeStats";

export function useLiveStats() {
  const status = useEngineStore((s) => s.status);
  const startedAt = useEngineStore((s) => s.startedAt);
  const keystrokeLog = useEngineStore((s) => s.keystrokeLog);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (status !== "running") return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [status]);

  const elapsedMs = startedAt ? now - startedAt : 0;

  return {
    wpm: computeWpm(keystrokeLog, elapsedMs),
    correctWpm: computeCorrectWpm(keystrokeLog, elapsedMs),
    accuracy: computeAccuracy(keystrokeLog),
    elapsedMs,
  };
}
