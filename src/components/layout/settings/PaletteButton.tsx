import { Palette } from "lucide-react";
import { Combobox } from "@/components/ui/combobox";
import { useAppearance } from "@/context/AppearanceContext";
import { themes } from "@/config/themes";
import ColorSwatch from "./ColorSwatch";

function PaletteButton() {
  const { themeId, setThemeId, resolvedScheme } = useAppearance();

  const options = themes.map((theme) => ({
    value: theme.id,
    label: theme.label,
    dominant:
      resolvedScheme === "dark" ? theme.dark.primary : theme.light.primary,
    background:
      resolvedScheme === "dark"
        ? theme.dark.background
        : theme.light.background,
    foreground:
      resolvedScheme === "dark"
        ? theme.dark.foreground
        : theme.light.foreground,
  }));
  const selectedLabel = options.find(
    (option) => option.value === themeId,
  )?.label;

  return (
    <Combobox
      id="palette-combobox"
      ariaLabel="Color palette"
      options={options}
      value={themeId}
      onValueChange={setThemeId}
      searchPlaceholder="Search palettes..."
      emptyText="No palette found."
      triggerVariant="ghost"
      triggerSize="icon"
      contentClassName="w-64 m-0! h-max!"
      tooltip={`Color Palette: ${selectedLabel}`}
      renderTrigger={() => (
        <Palette className="transition-transform duration-300 group-hover/button:-rotate-12 group-hover/button:scale-110" />
      )}
      renderOption={(option) => (
        <>
          <ColorSwatch
            primary={option.dominant}
            background={option.background}
            foreground={option.foreground}
            label={option.label}
          />
        </>
      )}
    />
  );
}

export default PaletteButton;
