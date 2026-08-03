import { useEffect, useState } from "react";
import { useEngineStore } from "../engine/engineStore";
import { bucketBySecond, type SecondBucket } from "./computeStats";

// Same per-second bucketing the Results graph draws from, but sampled
// against the live clock instead of a final finishedAt — recomputed on an
// interval so the mini live graph can keep extending while a test runs.
export function useLiveWpmBuckets(): SecondBucket[] {
  const status = useEngineStore((s) => s.status);
  const startedAt = useEngineStore((s) => s.startedAt);
  const keystrokeLog = useEngineStore((s) => s.keystrokeLog);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (status !== "running") return;
    const interval = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(interval);
  }, [status]);

  if (!startedAt) return [];
  return bucketBySecond(keystrokeLog, startedAt, Math.max(now, startedAt + 1000));
}
