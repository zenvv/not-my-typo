import { useState } from "react";
import { useTypewriterCycle } from "@/hooks/useTypewriterCycle";
import { cn } from "@/lib/utils";
import LogoMarkHorizontal from "./LogoMarkHorizontal";

const BRAND = "NOT MY TYPO";

/** Navbar-only logo: just the horizontal keycap mark, no wordmark. On
 * hover/focus it crossfades into an inverted pill (negative of the current
 * theme) that types the brand name out, holds it, then erases it like a
 * held backspace — replaying the mark's key-press animation once it's gone. */
function NavLogo({ onClick }: { onClick?: () => void }) {
  const [playKey, setPlayKey] = useState(0);
  const { display, phase, start } = useTypewriterCycle(BRAND, {
    onCycleEnd: () => setPlayKey((k) => k + 1),
  });
  const revealed = phase !== "idle";

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={start}
      onFocus={start}
      className="relative inline-flex h-9 items-center rounded-lg outline-none transition-transform hover:cursor-pointer focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-95"
      aria-label="not my typo home — hover to reveal name"
    >
      <LogoMarkHorizontal
        playKey={playKey}
        className={cn(
          "h-9 w-auto transition-opacity duration-150",
          revealed && "opacity-0",
        )}
      />
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-y-0 left-0 flex items-center whitespace-nowrap rounded-lg bg-foreground px-3 font-medium tracking-tight text-background transition-opacity duration-150",
          revealed ? "opacity-100" : "opacity-0",
        )}
      >
        {display}
        <span
          className="ml-px inline-block w-[2.5px] translate-y-[0.05em] animate-caret-blink rounded-full bg-background align-middle"
          style={{ height: "0.85em" }}
        />
      </span>
    </button>
  );
}

export default NavLogo;
