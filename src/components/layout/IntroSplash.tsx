import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/prefersReducedMotion";
import Logo from "./Logo";

/** A brief, skippable splash shown once per page load (~4s total): the logo
 * types itself out large and centered, then fades into the real app
 * underneath. Any keypress or click dismisses it immediately for users
 * eager to start. */
function IntroSplash({ onDone }: { onDone: () => void }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      onDone();
      return;
    }

    let finished = false;
    function finish() {
      if (finished) return;
      finished = true;
      onDone();
    }

    function leave() {
      setLeaving(true);
      window.clearTimeout(autoTimer);
      window.setTimeout(finish, 300);
    }

    const autoTimer = window.setTimeout(leave, 1800);
    window.addEventListener("keydown", leave, { once: true });
    window.addEventListener("pointerdown", leave, { once: true });

    return () => {
      window.clearTimeout(autoTimer);
      window.removeEventListener("keydown", leave);
      window.removeEventListener("pointerdown", leave);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      aria-hidden
      className={cn(
        "fixed inset-0 z-100 flex items-center justify-center bg-background transition-opacity duration-300",
        leaving ? "pointer-events-none opacity-0" : "opacity-100",
      )}
    >
      <Logo />
    </div>
  );
}

export default IntroSplash;
