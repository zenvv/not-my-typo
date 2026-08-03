import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export type CaretStyle = "line" | "block" | "underscore";

interface CaretContextValue {
  caretStyle: CaretStyle;
  setCaretStyle: (style: CaretStyle) => void;
}

const CaretContext = createContext<CaretContextValue | null>(null);

export function CaretProvider({ children }: { children: ReactNode }) {
  const [caretStyle, setCaretStyle] = useLocalStorage<CaretStyle>(
    "typo-dash:caret-style",
    "line"
  );

  const value = useMemo(() => ({ caretStyle, setCaretStyle }), [caretStyle, setCaretStyle]);

  return <CaretContext.Provider value={value}>{children}</CaretContext.Provider>;
}

export function useCaret() {
  const ctx = useContext(CaretContext);
  if (!ctx) {
    throw new Error("useCaret must be used within a CaretProvider");
  }
  return ctx;
}
