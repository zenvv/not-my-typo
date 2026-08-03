import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/prefersReducedMotion";

/** Reveals `text` left to right, one character at a time with a slight
 * random cadence — echoing the app's own typing-test input rather than a
 * generic decode/scramble effect. `startDelayMs` lets a caller wait for some
 * other animation (e.g. the logo mark settling) before the first character
 * appears. */
export function useTypewriterText(
  text: string,
  {
    startDelayMs = 0,
    minCharDelay = 40,
    maxCharDelay = 110,
    spaceDelay = 110,
  } = {},
) {
  const [display, setDisplay] = useState("");
  const timeout = useRef<number | undefined>(undefined);
  const reduced = useRef(prefersReducedMotion());

  useEffect(() => {
    if (reduced.current) {
      setDisplay(text);
      return;
    }

    function step(i: number) {
      setDisplay(text.slice(0, i + 1));
      if (i + 1 < text.length) {
        const delay =
          text[i] === " "
            ? spaceDelay
            : minCharDelay + Math.random() * (maxCharDelay - minCharDelay);
        timeout.current = window.setTimeout(() => step(i + 1), delay);
      }
    }

    timeout.current = window.setTimeout(() => step(0), startDelayMs + 120);
    return () => window.clearTimeout(timeout.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { display };
}
