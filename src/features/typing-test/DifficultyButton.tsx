import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { difficultyOptions } from "@/config/modes";

// The trigger button itself escalates in color at the top two levels so the
// active difficulty is visible even with the popover closed; below that it
// stays a plain ghost icon button like the rest of the settings triggers.
function triggerButtonClassName(value: number) {
  if (value === 4) return "bg-foreground text-background hover:bg-foreground/90";
  return "";
}

function triggerIconColorClassName(value: number) {
  if (value === 5) return "text-primary-foreground";
  if (value === 4) return "text-background";
  return undefined;
}

function DifficultyButton({
  value,
  onValueChange,
}: {
  value: number;
  onValueChange: (value: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const active = difficultyOptions.find((o) => o.value === value) ?? difficultyOptions[0];
  const ActiveIcon = active.icon;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button
              variant={value === 5 ? "default" : "ghost"}
              size="icon"
              className={triggerButtonClassName(value)}
              aria-label="Difficulty"
            >
              <ActiveIcon
                weight={active.weight}
                className={cn(
                  "transition-transform duration-300 group-hover/button:scale-110",
                  triggerIconColorClassName(value) ?? active.colorClassName,
                )}
              />
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>{`Word difficulty: ${active.description}`}</TooltipContent>
      </Tooltip>
      <PopoverContent className="w-64 flex flex-col gap-3">
        <ToggleGroup
          type="single"
          spacing={0}
          value={String(value)}
          onValueChange={(next) => next && onValueChange(Number(next))}
          className="w-full overflow-hidden rounded-xl border p-0.5"
          aria-label="Word difficulty"
        >
          {difficultyOptions.map((option) => {
            const Icon = option.icon;
            return (
              <ToggleGroupItem
                key={option.value}
                value={String(option.value)}
                className="flex-1 gap-1"
              >
                <Icon weight={option.weight} className={cn("size-3.5", option.colorClassName)} />
                {option.label !== "Off" && option.label}
              </ToggleGroupItem>
            );
          })}
        </ToggleGroup>
        <p className="text-center text-xs font-medium text-muted-foreground">
          {active.label === "Off" ? "Off" : `Level ${active.label}`}
        </p>
      </PopoverContent>
    </Popover>
  );
}

export default DifficultyButton;
