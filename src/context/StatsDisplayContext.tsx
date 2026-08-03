import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export type StatsDisplayMode = "numbers" | "graph";

interface StatsDisplayContextValue {
  mode: StatsDisplayMode;
  setMode: (mode: StatsDisplayMode) => void;
}

const StatsDisplayContext = createContext<StatsDisplayContextValue | null>(null);

export function StatsDisplayProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useLocalStorage<StatsDisplayMode>(
    "typo-dash:stats-display",
    "numbers"
  );

  const value = useMemo(() => ({ mode, setMode }), [mode, setMode]);

  return (
    <StatsDisplayContext.Provider value={value}>
      {children}
    </StatsDisplayContext.Provider>
  );
}

export function useStatsDisplay() {
  const ctx = useContext(StatsDisplayContext);
  if (!ctx) {
    throw new Error("useStatsDisplay must be used within a StatsDisplayProvider");
  }
  return ctx;
}
