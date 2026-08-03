import { Hash, Activity, type LucideIcon } from "lucide-react";
import { Combobox } from "@/components/ui/combobox";
import { useStatsDisplay, type StatsDisplayMode } from "@/context/StatsDisplayContext";

const statsIcons: Record<StatsDisplayMode, LucideIcon> = {
  numbers: Hash,
  graph: Activity,
};

const options: { value: StatsDisplayMode; label: string }[] = [
  { value: "numbers", label: "Numbers" },
  { value: "graph", label: "Numbers + graph" },
];

function StatsDisplayButton() {
  const { mode, setMode } = useStatsDisplay();
  const ActiveIcon = statsIcons[mode];
  const selectedLabel = options.find((option) => option.value === mode)?.label;

  return (
    <Combobox
      id="stats-display-combobox"
      ariaLabel="Live stats display"
      options={options}
      value={mode}
      onValueChange={(value) => setMode(value as StatsDisplayMode)}
      showSearch={false}
      triggerVariant="ghost"
      triggerSize="icon"
      contentClassName="w-48"
      tooltip={`Stats Display: ${selectedLabel}`}
      renderTrigger={() => (
        <ActiveIcon className="transition-transform duration-300 group-hover/button:scale-110" />
      )}
      renderOption={(option) => {
        const Icon = statsIcons[option.value];
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

export default StatsDisplayButton;
