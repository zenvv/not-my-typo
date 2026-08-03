import { Squircle } from "lucide-react";
import { Combobox } from "@/components/ui/combobox";
import { useAppearance } from "@/context/AppearanceContext";
import { radiusOptions } from "@/config/themes";

function RadiusButton() {
  const { radiusId, setRadiusId } = useAppearance();

  const options = radiusOptions.map((radius) => ({
    value: radius.id,
    label: radius.label,
    cssRadius: radius.value,
  }));
  const selectedLabel = options.find((option) => option.value === radiusId)?.label;

  return (
    <Combobox
      id="radius-combobox"
      ariaLabel="Corner radius"
      options={options}
      value={radiusId}
      onValueChange={setRadiusId}
      showSearch={false}
      triggerVariant="ghost"
      triggerSize="icon"
      contentClassName="w-48"
      tooltip={`Corner Radius: ${selectedLabel}`}
      renderTrigger={() => (
        <Squircle className="transition-transform duration-300 group-hover/button:rotate-90" />
      )}
      renderOption={(option) => (
        <>
          <span
            aria-hidden
            className="inline-block size-4 shrink-0 border-2 border-current"
            style={{ borderRadius: option.cssRadius }}
          />
          {option.label}
        </>
      )}
    />
  );
}

export default RadiusButton;
