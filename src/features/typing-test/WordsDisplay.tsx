import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { cn } from "@/lib/utils";
import { useEngineStore } from "./engine/engineStore";
import type { CharState } from "./engine/engineTypes";
import { useCaret } from "@/context/CaretContext";
import { useAppearance } from "@/context/AppearanceContext";
import Caret, { type CaretRect } from "./Caret";

function getCharState(actual: string, typed: string, index: number): CharState {
  if (index >= typed.length) return "pending";
  return typed[index] === actual[index] ? "correct" : "incorrect";
}

function charStateClass(state: CharState) {
  switch (state) {
    case "correct":
      return "text-foreground";
    case "incorrect":
      return "text-destructive";
    default:
      return "text-muted-foreground";
  }
}

// Zero-width marker inserted at the caret's logical position within the
// current word. It carries no visual weight of its own — WordsDisplay
// measures its DOM position each render and uses that to drive a single,
// independently-animated overlay caret (see below), instead of the caret
// itself being mounted/unmounted inline as the user types.
function CaretMarker({ markerRef }: { markerRef: RefObject<HTMLSpanElement | null> }) {
  return (
    <span
      ref={markerRef}
      aria-hidden
      className="inline-block w-0 text-2xl font-medium"
    >
      {"​"}
    </span>
  );
}

function Word({
  word,
  typed,
  isCurrent,
  markerRef,
}: {
  word: string;
  typed: string;
  isCurrent: boolean;
  markerRef: RefObject<HTMLSpanElement | null>;
}) {
  const chars = word.split("");
  const extraChars =
    typed.length > word.length ? typed.slice(word.length).split("") : [];
  const nodes: ReactNode[] = [];
  const marker = <CaretMarker key="caret-marker" markerRef={markerRef} />;

  chars.forEach((char, i) => {
    if (isCurrent && typed.length === i) {
      nodes.push(marker);
    }
    const state = getCharState(word, typed, i);
    // Show what the user actually typed for a mismatch (not the target
    // character) so a wrong keystroke is visible, not hidden behind it.
    const displayChar = state === "incorrect" ? typed[i] : char;
    nodes.push(
      <span
        key={i}
        className={cn("text-2xl font-medium", charStateClass(state))}
      >
        {displayChar}
      </span>,
    );
  });

  if (isCurrent && typed.length === chars.length && extraChars.length === 0) {
    nodes.push(marker);
  }

  extraChars.forEach((char, i) => {
    nodes.push(
      <span
        key={`extra-${i}`}
        className="text-2xl font-medium text-destructive/70"
      >
        {char}
      </span>,
    );
  });

  if (isCurrent && extraChars.length > 0) {
    nodes.push(marker);
  }

  return <span className="inline-flex mr-[0.6em]">{nodes}</span>;
}

function WordsDisplay() {
  const words = useEngineStore((s) => s.words);
  const wordIndex = useEngineStore((s) => s.wordIndex);
  const typedWords = useEngineStore((s) => s.typedWords);
  const currentInput = useEngineStore((s) => s.currentInput);
  const { caretStyle } = useCaret();
  const { fontId, weightId } = useAppearance();

  const containerRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLSpanElement>(null);
  const [caretRect, setCaretRect] = useState<CaretRect | null>(null);

  const measureCaret = useCallback(() => {
    const marker = markerRef.current;
    const container = containerRef.current;
    if (!marker || !container) {
      setCaretRect(null);
      return;
    }
    const markerBox = marker.getBoundingClientRect();
    const containerBox = container.getBoundingClientRect();
    const nextChar = marker.nextElementSibling as HTMLElement | null;
    setCaretRect({
      left: markerBox.left - containerBox.left,
      top: markerBox.top - containerBox.top,
      height: markerBox.height,
      width: nextChar ? nextChar.getBoundingClientRect().width : null,
    });
  }, []);

  // Keystrokes/word changes reposition the caret; a layout effect runs before
  // paint so the overlay never visibly "jumps" from a stale position.
  useLayoutEffect(() => {
    measureCaret();
  }, [measureCaret, wordIndex, currentInput, typedWords, words]);

  // The container's own size rarely changes, but the text inside it reflows
  // on window resize or a font swap — both would otherwise leave the overlay
  // caret stranded at its last measured spot until the next keystroke.
  useEffect(() => {
    window.addEventListener("resize", measureCaret);
    return () => window.removeEventListener("resize", measureCaret);
  }, [measureCaret]);

  useEffect(() => {
    document.fonts.ready.then(measureCaret);
  }, [measureCaret, fontId, weightId]);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="relative flex flex-wrap content-start gap-y-2 max-h-64 overflow-hidden select-none p-6"
    >
      {words.map((word, i) => (
        <Word
          key={i}
          word={word}
          typed={i === wordIndex ? currentInput : (typedWords[i] ?? "")}
          isCurrent={i === wordIndex}
          markerRef={markerRef}
        />
      ))}
      {caretRect && <Caret variant={caretStyle} rect={caretRect} />}
    </div>
  );
}

export default WordsDisplay;
