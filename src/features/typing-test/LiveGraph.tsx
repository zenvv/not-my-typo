import { useId, useMemo } from "react";
import { useLiveWpmBuckets } from "./stats/useLiveWpmBuckets";

/** A compact, continuously-extending line graph of correct-WPM per second —
 * the same reading the Results screen draws in full size, kept live while a
 * test is running for users who'd rather watch a trend than a number. */
function LiveGraph() {
  const buckets = useLiveWpmBuckets();
  const gradientId = useId();

  const path = useMemo(() => {
    if (buckets.length < 2) return null;

    const width = 220;
    const height = 32;
    const maxWpm = Math.max(...buckets.map((b) => b.correctWpm), 1);
    const stepX = width / (buckets.length - 1);

    const coords = buckets.map((b, i) => [
      i * stepX,
      height - (b.correctWpm / maxWpm) * (height - 4) - 2,
    ]);
    const line = coords.map(([x, y]) => `${x},${y}`).join(" ");
    const area = `0,${height} ${line} ${width},${height}`;

    return { width, height, line, area };
  }, [buckets]);

  if (!path) return null;

  return (
    <svg
      viewBox={`0 0 ${path.width} ${path.height}`}
      preserveAspectRatio="none"
      className="h-8 w-40 text-primary sm:w-56"
      aria-hidden
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.18" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={path.area} fill={`url(#${gradientId})`} />
      <polyline
        points={path.line}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default LiveGraph;
