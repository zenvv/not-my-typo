import { useTypewriterText } from "@/hooks/useTypewriterText";
import LogoMark, { TEXT_START_DELAY_MS } from "./LogoMark";

const BRAND = "NOT MY TYPO";

/** The big centered lockup shown on the intro splash: the keycap mark above
 * the brand name. The name starts typing the moment the backspace key
 * lands (and the row shakes), rather than waiting for the mark to fully
 * settle. */
function Logo() {
  const { display } = useTypewriterText(BRAND, {
    startDelayMs: TEXT_START_DELAY_MS,
  });

  return (
    <div className="flex flex-col items-center gap-5">
      <LogoMark playKey={0} className="size-40" />
      <div className="flex flex-col items-center gap-1.5">
        <span className="relative overflow-hidden whitespace-nowrap text-4xl font-medium tracking-tight sm:text-5xl">
          {display}
          <span
            aria-hidden
            className="ml-px inline-block w-0.75 translate-y-[0.1em] animate-caret-blink rounded-full bg-primary align-middle"
            style={{ height: "0.85em" }}
          />
        </span>
        <span className="text-xs text-muted-foreground">made by zenvv</span>
      </div>
    </div>
  );
}

export default Logo;
