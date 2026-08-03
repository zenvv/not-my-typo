import PaletteButton from "./PaletteButton";
import FontButton from "./FontButton";
import RadiusButton from "./RadiusButton";
import AppearanceButton from "./AppearanceButton";
import SoundButton from "./SoundButton";
import CaretButton from "./CaretButton";
import StatsDisplayButton from "./StatsDisplayButton";
import MobileSettingsButton from "./MobileSettingsButton";

function SettingsBar() {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      <div className="hidden md:flex items-center gap-1 flex-wrap">
        <PaletteButton />
        <FontButton />
        <RadiusButton />
        <CaretButton />
        <SoundButton />
        <StatsDisplayButton />
        <AppearanceButton />
      </div>
      <div className="md:hidden">
        <MobileSettingsButton />
      </div>
    </div>
  );
}

export default SettingsBar;
