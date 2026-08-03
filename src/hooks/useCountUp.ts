import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/prefersReducedMotion";

function easeOutExpo(t: number) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

/** Animates from 0 to `target` over `durationMs`, easing out. Skips straight
 * to `target` when the user prefers reduced motion. */
export function useCountUp(target: number, durationMs = 800) {
  const [value, setValue] = useState(prefersReducedMotion() ? target : 0);
  const frame = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setValue(target);
      return;
    }

    const start = performance.now();
    const from = 0;

    function step(now: number) {
      const elapsed = now - start;
      const t = Math.min(elapsed / durationMs, 1);
      setValue(from + (target - from) * easeOutExpo(t));
      if (t < 1) {
        frame.current = requestAnimationFrame(step);
      }
    }

    frame.current = requestAnimationFrame(step);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [target, durationMs]);

  return value;
}
