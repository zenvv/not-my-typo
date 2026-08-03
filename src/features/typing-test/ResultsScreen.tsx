import { useId, useMemo } from "react";
import {
  Gauge,
  Target,
  Activity,
  X,
  Clock,
  Hash,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { useCountUp } from "@/hooks/useCountUp";
import { useEngineStore } from "./engine/engineStore";
import {
  bucketBySecond,
  computeAccuracy,
  computeConsistency,
  computeCorrectWpm,
  computeMisses,
  computeWpm,
  type SecondBucket,
} from "./stats/computeStats";

function ResultsGraph({ buckets }: { buckets: SecondBucket[] }) {
  const gradientId = useId();

  const path = useMemo(() => {
    if (buckets.length < 2) return null;

    const width = 480;
    const height = 120;
    const maxWpm = Math.max(...buckets.map((b) => b.correctWpm), 1);
    const stepX = width / (buckets.length - 1);

    const coords = buckets.map((b, i) => [
      i * stepX,
      height - (b.correctWpm / maxWpm) * height,
    ]);
    const length = coords.slice(1).reduce((total, [x, y], i) => {
      const [px, py] = coords[i];
      return total + Math.hypot(x - px, y - py);
    }, 0);

    const line = coords.map(([x, y]) => `${x},${y}`).join(" ");
    const area = `0,${height} ${line} ${width},${height}`;

    return { width, height, line, area, length };
  }, [buckets]);

  if (!path) return null;

  return (
    <svg
      viewBox={`0 0 ${path.width} ${path.height}`}
      preserveAspectRatio="none"
      className="h-28 w-full max-w-xl text-primary"
      aria-hidden
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.18" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={path.area}
        fill={`url(#${gradientId})`}
        className="animate-in fade-in duration-700 fill-mode-backwards"
        style={{ animationDelay: "650ms" }}
      />
      <polyline
        points={path.line}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-draw-line"
        style={{ "--line-length": path.length } as React.CSSProperties}
      />
    </svg>
  );
}

function Stat({
  label,
  value,
  suffix = "",
  icon: Icon,
}: {
  label: string;
  value: number;
  suffix?: string;
  icon: typeof Gauge;
}) {
  const animated = useCountUp(value);

  return (
    <div className="flex flex-col items-center gap-1 hover:bg-muted/60 p-3 h-auto rounded-xl group transition-all">
      <span className="flex items-center gap-1 text-lg font-bold text-foreground group-hover:text-primary transition-all">
        <Icon
          className="size-4 text-muted-foreground group-hover:text-primary transition-all"
          aria-hidden
        />
        {Math.round(animated)}
        {suffix}
      </span>
      <span className="text-xs uppercase tracking-wide">{label}</span>
    </div>
  );
}

function ResultsScreen({ onRestart }: { onRestart: () => void }) {
  const keystrokeLog = useEngineStore((s) => s.keystrokeLog);
  const startedAt = useEngineStore((s) => s.startedAt);
  const finishedAt = useEngineStore((s) => s.finishedAt);
  const typedWords = useEngineStore((s) => s.typedWords);

  const stats = useMemo(() => {
    const elapsedMs = startedAt && finishedAt ? finishedAt - startedAt : 0;
    const buckets =
      startedAt && finishedAt
        ? bucketBySecond(keystrokeLog, startedAt, finishedAt)
        : [];
    return {
      wpm: computeCorrectWpm(keystrokeLog, elapsedMs),
      rawWpm: computeWpm(keystrokeLog, elapsedMs),
      accuracy: computeAccuracy(keystrokeLog),
      consistency: computeConsistency(buckets),
      misses: computeMisses(keystrokeLog),
      timeSeconds: Math.round(elapsedMs / 1000),
      wordsTyped: typedWords.filter(Boolean).length,
      buckets,
    };
  }, [keystrokeLog, startedAt, finishedAt, typedWords]);

  const wpm = useCountUp(stats.wpm, 900);

  return (
    <div className="flex flex-col items-center gap-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
      <div className="flex items-baseline gap-3">
        <span className="text-5xl font-black tabular-nums">
          {Math.round(wpm)}
        </span>
        <span className="text-muted-foreground">wpm</span>
      </div>

      <ResultsGraph buckets={stats.buckets} />

      <div className="grid grid-cols-3 gap-x-4 gap-y-3 text-muted-foreground sm:grid-cols-6">
        <Stat label="raw" value={stats.rawWpm} icon={Gauge} />
        <Stat
          label="accuracy"
          value={stats.accuracy}
          suffix="%"
          icon={Target}
        />
        <Stat
          label="consistency"
          value={stats.consistency}
          suffix="%"
          icon={Activity}
        />
        <Stat label="misses" value={stats.misses} icon={X} />
        <Stat label="time" value={stats.timeSeconds} suffix="s" icon={Clock} />
        <Stat label="words" value={stats.wordsTyped} icon={Hash} />
      </div>

      <Button onClick={onRestart} className="gap-1.5 mt-8">
        <RotateCcw className="size-4 transition-transform duration-300 group-hover/button:-rotate-180" />
        Restart
        <Kbd className="bg-primary-foreground/20 text-primary-foreground">R</Kbd>
      </Button>
    </div>
  );
}

export default ResultsScreen;
