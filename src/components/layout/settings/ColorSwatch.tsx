import { cn } from "@/lib/utils";

function ColorSwatch({
  primary,
  background,
  foreground,
  className,
  label,
}: {
  primary: string;
  background: string;
  foreground: string;
  className?: string;
  label: string;
}) {
  return (
    <span
      className="h-8 px-2 flex border items-center rounded-lg overflow-hidden w-full m-0!"
      style={{ backgroundColor: background }}
    >
      <span
        aria-hidden
        className={cn(
          "inline-block size-4 shrink-0 rounded-sm border border-border/50",
          className,
        )}
        style={{ backgroundColor: primary }}
      />
      <span className="mx-2 truncate" style={{ color: foreground }}>
        {label}
      </span>
    </span>
  );
}

export default ColorSwatch;
