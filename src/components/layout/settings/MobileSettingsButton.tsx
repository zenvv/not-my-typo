import { useState } from "react";
import {
  Settings,
  Sun,
  Moon,
  Monitor,
  VolumeX,
  Volume1,
  Volume2,
  Volume,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { useAppearance } from "@/context/AppearanceContext";
import { useSound } from "@/context/SoundContext";
import { useCaret, type CaretStyle } from "@/context/CaretContext";
import {
  useStatsDisplay,
  type StatsDisplayMode,
} from "@/context/StatsDisplayContext";
import { themes, radiusOptions } from "@/config/themes";
import { fonts, type FontWeightId } from "@/config/fonts";
import { soundOptions } from "@/config/sounds";
import ColorSwatch from "./ColorSwatch";
import { CaretPreviewIcon } from "./CaretButton";

const schemeOptions: {
  value: "light" | "dark" | "system";
  label: string;
  icon: LucideIcon;
}[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

const caretOptions: { value: CaretStyle; label: string }[] = [
  { value: "line", label: "Line" },
  { value: "block", label: "Block" },
  { value: "underscore", label: "Underscore" },
];

const statsOptions: { value: StatsDisplayMode; label: string }[] = [
  { value: "numbers", label: "Numbers" },
  { value: "graph", label: "Numbers + graph" },
];

const soundIcons: Record<string, LucideIcon> = {
  none: VolumeX,
  soft: Volume,
  clicky: Volume1,
  laptop: Volume1,
  soft_mechanical: Volume2,
  mechanical: Volume2,
  typewriter: Volume2,
};

function MobileSettingsButton() {
  const appearance = useAppearance();
  const sound = useSound();
  const caret = useCaret();
  const statsDisplay = useStatsDisplay();

  const [open, setOpen] = useState(false);

  const [themeId, setDraftThemeId] = useState(appearance.themeId);
  const [colorScheme, setDraftColorScheme] = useState(appearance.colorScheme);
  const [fontId, setDraftFontId] = useState(appearance.fontId);
  const [weightId, setDraftWeightId] = useState<FontWeightId>(
    appearance.weightId,
  );
  const [radiusId, setDraftRadiusId] = useState(appearance.radiusId);
  const [caretStyle, setDraftCaretStyle] = useState<CaretStyle>(
    caret.caretStyle,
  );
  const [soundId, setDraftSoundId] = useState(sound.soundId);
  const [volume, setDraftVolume] = useState(sound.volume);
  const [statsMode, setDraftStatsMode] = useState<StatsDisplayMode>(
    statsDisplay.mode,
  );

  function handleOpenChange(next: boolean) {
    if (next) {
      // Snapshot current values fresh every time the dialog opens.
      setDraftThemeId(appearance.themeId);
      setDraftColorScheme(appearance.colorScheme);
      setDraftFontId(appearance.fontId);
      setDraftWeightId(appearance.weightId);
      setDraftRadiusId(appearance.radiusId);
      setDraftCaretStyle(caret.caretStyle);
      setDraftSoundId(sound.soundId);
      setDraftVolume(sound.volume);
      setDraftStatsMode(statsDisplay.mode);
    }
    setOpen(next);
  }

  function handleApply() {
    appearance.setThemeId(themeId);
    appearance.setColorScheme(colorScheme);
    appearance.setFontId(fontId);
    appearance.setWeightId(weightId);
    appearance.setRadiusId(radiusId);
    caret.setCaretStyle(caretStyle);
    sound.setSoundId(soundId);
    sound.setVolume(volume);
    statsDisplay.setMode(statsMode);
    setOpen(false);
  }

  const activeFont = fonts.find((f) => f.id === fontId) ?? fonts[0];
  const activeFontWeights = activeFont.weights.some((w) => w.id === weightId)
    ? weightId
    : activeFont.weights[0].id;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Settings">
          <Settings className="transition-transform duration-300 group-hover/button:rotate-45" />
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[85vh] max-w-sm flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>

        <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto p-4">
          <section className="flex flex-col gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              Palette
            </span>
            <ToggleGroup
              type="single"
              orientation="vertical"
              spacing={2}
              value={themeId}
              onValueChange={(value) => value && setDraftThemeId(value)}
              className="max-h-40 w-full items-stretch overflow-y-auto"
            >
              {themes.map((theme) => {
                const tokens =
                  appearance.resolvedScheme === "dark"
                    ? theme.dark
                    : theme.light;
                return (
                  <ToggleGroupItem
                    key={theme.id}
                    value={theme.id}
                    className="w-full justify-start p-1"
                  >
                    <ColorSwatch
                      primary={tokens.primary}
                      background={tokens.background}
                      foreground={tokens.foreground}
                      label={theme.label}
                    />
                  </ToggleGroupItem>
                );
              })}
            </ToggleGroup>
          </section>

          <Separator />

          <section className="flex flex-col gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              Font
            </span>
            <ToggleGroup
              type="single"
              orientation="vertical"
              spacing={2}
              value={fontId}
              onValueChange={(value) => value && setDraftFontId(value)}
              className="max-h-40 w-full items-stretch overflow-y-auto"
            >
              {fonts.map((font) => (
                <ToggleGroupItem
                  key={font.id}
                  value={font.id}
                  className="w-full justify-start"
                  style={{ fontFamily: font.cssValue }}
                >
                  {font.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            <ToggleGroup
              type="single"
              spacing={0}
              value={activeFontWeights}
              onValueChange={(value) =>
                value && setDraftWeightId(value as FontWeightId)
              }
              className="w-full overflow-hidden rounded-xl border p-0.5"
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
          </section>

          <Separator />

          <section className="flex flex-col gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              Corner radius
            </span>
            <ToggleGroup
              type="single"
              spacing={0}
              value={radiusId}
              onValueChange={(value) => value && setDraftRadiusId(value)}
              className="w-full overflow-hidden rounded-xl border p-0.5"
            >
              {radiusOptions.map((radius) => (
                <ToggleGroupItem
                  key={radius.id}
                  value={radius.id}
                  className="flex-1"
                >
                  {radius.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </section>

          <section className="flex flex-col gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              Caret
            </span>
            <ToggleGroup
              type="single"
              spacing={0}
              value={caretStyle}
              onValueChange={(value) =>
                value && setDraftCaretStyle(value as CaretStyle)
              }
              className="w-full overflow-hidden rounded-xl border p-0.5"
            >
              {caretOptions.map((option) => (
                <ToggleGroupItem
                  key={option.value}
                  value={option.value}
                  className="flex-1 gap-1.5"
                >
                  <CaretPreviewIcon variant={option.value} />
                  {option.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </section>

          <section className="flex flex-col gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              Sound
            </span>
            <ToggleGroup
              type="single"
              orientation="vertical"
              spacing={2}
              value={soundId}
              onValueChange={(value) => value && setDraftSoundId(value)}
              className="w-full items-stretch"
            >
              {soundOptions.map((option) => {
                const Icon = soundIcons[option.id] ?? VolumeX;
                return (
                  <ToggleGroupItem
                    key={option.id}
                    value={option.id}
                    className="w-full justify-start gap-1.5"
                  >
                    <Icon className="size-4" />
                    {option.label}
                  </ToggleGroupItem>
                );
              })}
            </ToggleGroup>
            <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground">
              <span>Volume</span>
              <span className="tabular-nums">{Math.round(volume * 100)}%</span>
            </div>
            <Slider
              aria-label="Keystroke volume"
              min={0}
              max={100}
              step={5}
              value={[Math.round(volume * 100)]}
              onValueChange={([v]) => setDraftVolume(v / 100)}
              disabled={soundId === "none"}
            />
          </section>

          <Separator />

          <section className="flex flex-col gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              Live stats
            </span>
            <ToggleGroup
              type="single"
              spacing={0}
              value={statsMode}
              onValueChange={(value) =>
                value && setDraftStatsMode(value as StatsDisplayMode)
              }
              className="w-full overflow-hidden rounded-xl border p-0.5"
            >
              {statsOptions.map((option) => (
                <ToggleGroupItem
                  key={option.value}
                  value={option.value}
                  className="flex-1"
                >
                  {option.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </section>

          <section className="flex flex-col gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              Theme
            </span>
            <ToggleGroup
              type="single"
              spacing={0}
              value={colorScheme}
              onValueChange={(value) =>
                value && setDraftColorScheme(value as typeof colorScheme)
              }
              className="w-full overflow-hidden rounded-xl border p-0.5"
            >
              {schemeOptions.map((option) => (
                <ToggleGroupItem
                  key={option.value}
                  value={option.value}
                  className="flex-1 gap-1.5"
                >
                  <option.icon className="size-4" />
                  {option.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </section>
        </div>

        <DialogFooter className="rounded-t-none grid grid-cols-2 gap-4 m-0!">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleApply}>Apply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default MobileSettingsButton;
