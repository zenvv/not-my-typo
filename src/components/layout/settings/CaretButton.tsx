import { Combobox } from "@/components/ui/combobox";
import { cn } from "@/lib/utils";
import { useCaret, type CaretStyle } from "@/context/CaretContext";

const caretOptions: { value: CaretStyle; label: string }[] = [
  { value: "line", label: "Line" },
  { value: "block", label: "Block" },
  { value: "underscore", label: "Underscore" },
];

export function CaretPreviewIcon({ variant }: { variant: CaretStyle }) {
  return (
    <span className="inline-flex h-4 w-4 shrink-0 items-end justify-center">
      <span
        aria-hidden
        className={cn(
          "bg-current",
          variant === "line" && "h-3.5 w-[2px] rounded-full",
          variant === "block" && "h-3.5 w-2.5 rounded-[2px] opacity-30",
          variant === "underscore" && "h-[2px] w-3 rounded-full"
        )}
      />
    </span>
  );
}

function CaretButton() {
  const { caretStyle, setCaretStyle } = useCaret();
  const selectedLabel = caretOptions.find((option) => option.value === caretStyle)?.label;

  return (
    <Combobox
      id="caret-combobox"
      ariaLabel="Caret style"
      options={caretOptions}
      value={caretStyle}
      onValueChange={(value) => setCaretStyle(value as CaretStyle)}
      showSearch={false}
      triggerVariant="ghost"
      triggerSize="icon"
      contentClassName="w-40"
      tooltip={`Caret: ${selectedLabel}`}
      renderTrigger={() => (
        <span className="transition-transform duration-300 group-hover/button:scale-110">
          <CaretPreviewIcon variant={caretStyle} />
        </span>
      )}
      renderOption={(option) => (
        <>
          <CaretPreviewIcon variant={option.value} />
          {option.label}
        </>
      )}
    />
  );
}

export default CaretButton;
