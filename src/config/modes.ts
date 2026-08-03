import {
  Hash,
  Timer,
  Infinity as InfinityIcon,
  Quote,
  type LucideIcon,
} from "lucide-react";
import {
  FireSimple,
  Lightning,
  Checkerboard,
  PingPong,
  type Icon as PhosphorIcon,
  type IconWeight,
} from "@phosphor-icons/react";
import type { Language } from "@/lib/words/wordSource";
import type { TestMode, QuoteLength } from "@/features/typing-test/engine/engineTypes";

export interface ModeOption {
  id: TestMode;
  label: string;
}

export const modeOptions: ModeOption[] = [
  { id: "words", label: "Words" },
  { id: "time", label: "Time" },
  { id: "zen", label: "Zen" },
  { id: "quotes", label: "Quotes" },
];

export const modeIcons: Record<TestMode, LucideIcon> = {
  words: Hash,
  time: Timer,
  zen: InfinityIcon,
  quotes: Quote,
};

export const wordCountOptions = [30, 60, 90] as const;
export const durationOptions = [15, 30, 60] as const;

export interface LanguageOption {
  id: Language;
  label: string;
}

export const languageOptions: LanguageOption[] = [
  { id: "en", label: "English" },
  { id: "pt-br", label: "Português (BR)" },
  { id: "fr", label: "Français" },
  { id: "es", label: "Español" },
  { id: "de", label: "Deutsch" },
  { id: "it", label: "Italiano" },
];

export const defaultMode: TestMode = "words";
export const defaultWordCount = 30;
export const defaultDuration = 30;
export const defaultLanguage: Language = "en";

export interface DifficultyOption {
  value: number;
  label: string;
  description: string;
  icon: PhosphorIcon;
  weight: IconWeight;
  colorClassName: string;
}

// 0 = filter off (unfiltered random words); 1-5 map directly to the word
// API's `diff` param, from very common words to intentionally rare ones.
// Icon/weight/color escalate with rarity so the selected level reads at a
// glance: plain outline icons through level 3, a filled checkerboard at 4,
// and a filled, primary-colored flame at the rarest level, 5.
export const difficultyOptions: DifficultyOption[] = [
  {
    value: 0,
    label: "Off",
    description: "No rarity filter",
    icon: FireSimple,
    weight: "regular",
    colorClassName: "text-muted-foreground",
  },
  {
    value: 1,
    label: "1",
    description: "Very common words",
    icon: PingPong,
    weight: "regular",
    colorClassName: "text-foreground",
  },
  {
    value: 2,
    label: "2",
    description: "Common words",
    icon: Checkerboard,
    weight: "fill",
    colorClassName: "text-foreground",
  },
  {
    value: 3,
    label: "3",
    description: "Moderately common words",
    icon: Lightning,
    weight: "regular",
    colorClassName: "text-foreground",
  },
  {
    value: 4,
    label: "4",
    description: "Uncommon words",
    icon: FireSimple,
    weight: "regular",
    colorClassName: "text-foreground",
  },
  {
    value: 5,
    label: "5",
    description: "Rare words",
    icon: FireSimple,
    weight: "fill",
    colorClassName: "text-primary",
  },
];
export const defaultDifficulty = 0;

export interface QuoteLengthOption {
  id: QuoteLength;
  label: string;
}

export const quoteLengthOptions: QuoteLengthOption[] = [
  { id: "short", label: "Short" },
  { id: "medium", label: "Medium" },
  { id: "long", label: "Long" },
];
