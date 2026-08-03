import { useState } from "react";
import {
  Volume,
  Volume1,
  Volume2,
  VolumeX,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { useSound } from "@/context/SoundContext";
import { soundOptions } from "@/config/sounds";

const soundIcons: Record<string, LucideIcon> = {
  none: VolumeX,
  soft: Volume,
  clicky: Volume1,
  laptop: Volume1,
  soft_mechanical: Volume2,
  mechanical: Volume2,
  typewriter: Volume2,
};

function SoundButton() {
  const [open, setOpen] = useState(false);
  const { soundId, setSoundId, volume, setVolume, preview } = useSound();
  const ActiveIcon = soundIcons[soundId] ?? VolumeX;
  const activeLabel = soundOptions.find(
    (option) => option.id === soundId,
  )?.label;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Keystroke sound">
              <ActiveIcon className="transition-transform duration-300 group-hover/button:scale-110 group-hover/button:-rotate-6" />
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>{`Sound: ${activeLabel}`}</TooltipContent>
      </Tooltip>
      <PopoverContent className="w-52 p-0">
        <Command>
          <CommandList>
            <CommandEmpty>No sound found.</CommandEmpty>
            <CommandGroup>
              {soundOptions.map((option) => {
                const Icon = soundIcons[option.id] ?? VolumeX;
                return (
                  <CommandItem
                    key={option.id}
                    value={option.label}
                    data-checked={option.id === soundId}
                    onSelect={() => {
                      setSoundId(option.id);
                      preview(option.id);
                    }}
                  >
                    <Icon className="size-4" />
                    {option.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>

        <Separator />

        <div className="flex flex-col gap-2 p-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Volume
            </span>
            <span className="text-xs tabular-nums text-muted-foreground">
              {Math.round(volume * 100)}%
            </span>
          </div>
          <Slider
            aria-label="Keystroke volume"
            className="mb-3"
            min={0}
            max={100}
            step={5}
            value={[Math.round(volume * 100)]}
            onValueChange={([v]) => setVolume(v / 100)}
            onValueCommit={() => preview(soundId)}
            disabled={soundId === "none"}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default SoundButton;
