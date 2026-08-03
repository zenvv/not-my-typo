import { Sun, Moon, Monitor, type LucideIcon } from "lucide-react";
import { Combobox } from "@/components/ui/combobox";
import { useAppearance } from "@/context/AppearanceContext";

const schemeOptions: { value: "light" | "dark" | "system"; label: string; icon: LucideIcon }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

function AppearanceButton() {
  const { colorScheme, setColorScheme } = useAppearance();
  const active = schemeOptions.find((o) => o.value === colorScheme) ?? schemeOptions[2];
  const ActiveIcon = active.icon;

  return (
    <Combobox
      id="appearance-combobox"
      ariaLabel="Appearance"
      options={schemeOptions}
      value={colorScheme}
      onValueChange={(value) => setColorScheme(value as typeof colorScheme)}
      showSearch={false}
      triggerVariant="ghost"
      triggerSize="icon"
      contentClassName="w-40"
      tooltip={`Appearance: ${active.label}`}
      renderTrigger={() => (
        <ActiveIcon className="transition-transform duration-300 group-hover/button:rotate-45 group-hover/button:scale-110" />
      )}
      renderOption={(option) => {
        const Icon = option.icon;
        return (
          <>
            <Icon className="size-4" />
            {option.label}
          </>
        );
      }}
    />
  );
}

export default AppearanceButton;
