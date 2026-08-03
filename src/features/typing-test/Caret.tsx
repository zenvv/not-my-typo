import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import type { CaretStyle } from "@/context/CaretContext";

export interface CaretRect {
  left: number;
  top: number;
  height: number;
  /** Width of the upcoming character, or null when there isn't one to overlay (e.g. end of test). */
  width: number | null;
}

interface CaretProps {
  variant: CaretStyle;
  rect: CaretRect;
}

// Falls back to an em-relative width (rather than a hardcoded px value) so it
// still scales sensibly with the active font when there's no next character
// to measure.
const FALLBACK_WIDTH = "0.55em";

function Caret({ variant, rect }: CaretProps) {
  const charWidth = rect.width != null ? `${rect.width}px` : FALLBACK_WIDTH;

  const style: CSSProperties =
    variant === "underscore"
      ? {
          transform: `translate(${rect.left}px, ${rect.top + rect.height - 3}px)`,
          width: charWidth,
          height: "3px",
        }
      : variant === "block"
        ? {
            transform: `translate(${rect.left}px, ${rect.top}px)`,
            width: charWidth,
            height: `${rect.height}px`,
          }
        : {
            transform: `translate(${rect.left}px, ${rect.top}px)`,
            height: `${rect.height}px`,
          };

  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute top-0 left-0 m-0! will-change-transform animate-caret-blink transition-[transform,width,height] duration-100 ease-out",
        variant === "line" && "w-[2.5px] rounded-4xl bg-primary",
        variant === "block" && "rounded-sm bg-primary/25",
        variant === "underscore" && "rounded-full bg-primary"
      )}
      style={style}
    />
  );
}

export default Caret;
