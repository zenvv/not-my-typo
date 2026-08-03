import { useEffect, useRef, type ChangeEvent, type KeyboardEvent } from "react";
import { useEngineStore } from "./engineStore";
import { useSound } from "@/context/SoundContext";

export function useEngineKeyboardCapture() {
  const inputRef = useRef<HTMLInputElement>(null);
  const currentInput = useEngineStore((s) => s.currentInput);
  const setCurrentInput = useEngineStore((s) => s.setCurrentInput);
  const advanceWord = useEngineStore((s) => s.advanceWord);
  const goToPreviousWord = useEngineStore((s) => s.goToPreviousWord);
  const status = useEngineStore((s) => s.status);
  const { playKeystroke } = useSound();

  useEffect(() => {
    if (status !== "finished") {
      inputRef.current?.focus();
    }
  }, [status]);

  // Every physical keydown plays exactly one sound here, tagged by key —
  // handleChange (fired after the browser applies the edit) stays silent so a
  // single keystroke never double-triggers.
  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === " ") {
      e.preventDefault();
      playKeystroke("space");
      advanceWord();
    } else if (e.key === "Backspace") {
      playKeystroke("backspace");
      if (currentInput.length === 0) {
        e.preventDefault();
        goToPreviousWord();
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      playKeystroke("enter");
    } else if (e.key.length === 1) {
      playKeystroke("char");
    }
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setCurrentInput(e.target.value);
  }

  function focus() {
    inputRef.current?.focus();
  }

  return { inputRef, currentInput, status, handleKeyDown, handleChange, focus };
}
