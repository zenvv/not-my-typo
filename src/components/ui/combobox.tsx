import { useState, type ReactNode } from "react";
import { ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button, type buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export interface ComboboxOption {
  value: string;
  label: string;
}

interface ComboboxProps<T extends ComboboxOption> {
  options: T[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  className?: string;
  contentClassName?: string;
  id?: string;
  ariaLabel?: string;
  /** Hide the search input — for short lists where filtering adds no value. */
  showSearch?: boolean;
  triggerVariant?: VariantProps<typeof buttonVariants>["variant"];
  triggerSize?: VariantProps<typeof buttonVariants>["size"];
  /** Replaces the trigger button's contents entirely (e.g. an icon-only button). */
  renderTrigger?: (selected: T | undefined) => ReactNode;
  /** Replaces an item's row contents (e.g. a color swatch + label). */
  renderOption?: (option: T, isSelected: boolean) => ReactNode;
  /** Wraps the trigger in a Tooltip describing the setting and its current value. */
  tooltip?: ReactNode;
}

function Combobox<T extends ComboboxOption>({
  options,
  value,
  onValueChange,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  emptyText = "No results found.",
  className,
  contentClassName,
  id,
  ariaLabel,
  showSearch = true,
  triggerVariant = "outline",
  triggerSize = "default",
  renderTrigger,
  renderOption,
  tooltip,
}: ComboboxProps<T>) {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value);

  const triggerButton = (
    <Button
      id={id}
      variant={triggerVariant}
      size={triggerSize}
      role="combobox"
      aria-expanded={open}
      aria-label={ariaLabel}
      className={cn(
        !renderTrigger && "w-full justify-between font-normal",
        className
      )}
    >
      {renderTrigger ? (
        renderTrigger(selected)
      ) : (
        <>
          {selected ? selected.label : placeholder}
          <ChevronsUpDown className="opacity-50" />
        </>
      )}
    </Button>
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {tooltip ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>{tooltip}</TooltipContent>
        </Tooltip>
      ) : (
        <PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
      )}
      <PopoverContent
        className={cn(
          "w-(--radix-popover-trigger-width) p-0",
          contentClassName
        )}
      >
        <Command>
          {showSearch && <CommandInput placeholder={searchPlaceholder} />}
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    data-checked={isSelected}
                    onSelect={() => {
                      onValueChange(option.value);
                      setOpen(false);
                    }}
                  >
                    {renderOption ? renderOption(option, isSelected) : option.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export { Combobox };
