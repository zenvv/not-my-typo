import { useState } from "react";
import { Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useAppearance } from "@/context/AppearanceContext";
import { fonts } from "@/config/fonts";
import type { FontWeightId } from "@/config/fonts";

function FontButton() {
  const [open, setOpen] = useState(false);
  const { fontId, setFontId, weightId, setWeightId } = useAppearance();
  const activeFont = fonts.find((f) => f.id === fontId) ?? fonts[0];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Font">
              <Type className="transition-transform duration-300 group-hover/button:scale-110 group-hover/button:-translate-y-0.5" />
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>{`Font: ${activeFont.label}`}</TooltipContent>
      </Tooltip>
      <PopoverContent className="w-64 p-0">
        <Command>
          <CommandInput placeholder="Search fonts..." />
          <CommandList>
            <CommandEmpty>No font found.</CommandEmpty>
            <CommandGroup>
              {fonts.map((font) => (
                <CommandItem
                  key={font.id}
                  value={font.label}
                  data-checked={font.id === fontId}
                  onSelect={() => setFontId(font.id)}
                  style={{ fontFamily: font.cssValue }}
                >
                  {font.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>

        <Separator />

        <div className="flex flex-col gap-2 p-2.5">
          <span className="text-xs font-medium text-muted-foreground">
            Weight
          </span>
          <ToggleGroup
            type="single"
            spacing={0}
            value={weightId}
            onValueChange={(value) =>
              value && setWeightId(value as FontWeightId)
            }
            variant="default"
            className="border overflow-hidden p-0.5 rounded-xl w-full"
            aria-label="Font weight"
          >
            {activeFont.weights.map((weight) => (
              <ToggleGroupItem
                key={weight.id}
                value={weight.id}
                className="flex-1"
              >
                {weight.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default FontButton;
