import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/prefersReducedMotion";

type Phase = "idle" | "typing" | "holding" | "erasing";

/** Types `text` out, holds it for `holdMs`, then erases it (like holding
 * backspace) and calls `onCycleEnd`. Ignores `start()` calls while a cycle
 * is already running, so repeated triggers (e.g. re-hovering) don't overlap. */
export function useTypewriterCycle(
  text: string,
  { holdMs = 3000, onCycleEnd }: { holdMs?: number; onCycleEnd?: () => void },
) {
  const [display, setDisplay] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const timeout = useRef<number | undefined>(undefined);
  const reduced = useRef(prefersReducedMotion());
  const onCycleEndRef = useRef(onCycleEnd);
  onCycleEndRef.current = onCycleEnd;

  function start() {
    if (phase !== "idle") return;
    window.clearTimeout(timeout.current);

    function end() {
      setPhase("idle");
      setDisplay("");
      onCycleEndRef.current?.();
    }

    if (reduced.current) {
      setDisplay(text);
      setPhase("holding");
      timeout.current = window.setTimeout(end, holdMs);
      return;
    }

    function eraseStep(i: number) {
      setDisplay(text.slice(0, i - 1));
      if (i - 1 > 0) {
        timeout.current = window.setTimeout(() => eraseStep(i - 1), 28);
      } else {
        end();
      }
    }

    function typeStep(i: number) {
      setDisplay(text.slice(0, i + 1));
      if (i + 1 < text.length) {
        const delay = text[i] === " " ? 110 : 40 + Math.random() * 70;
        timeout.current = window.setTimeout(() => typeStep(i + 1), delay);
      } else {
        setPhase("holding");
        timeout.current = window.setTimeout(() => {
          setPhase("erasing");
          eraseStep(text.length);
        }, holdMs);
      }
    }

    setPhase("typing");
    setDisplay("");
    timeout.current = window.setTimeout(() => typeStep(0), 120);
  }

  useEffect(() => () => window.clearTimeout(timeout.current), []);

  return { display, phase, start };
}
