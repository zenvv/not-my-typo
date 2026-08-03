export type FontWeightId = "light" | "normal" | "semibold";

export interface FontWeight {
  id: FontWeightId;
  label: string;
  value: number;
}

export interface FontOption {
  id: string;
  label: string;
  cssValue: string;
  googleFontUrl: string;
  // Only the weight tiers this family actually ships — e.g. Playfair Display
  // has no 300, so its list omits "light".
  weights: FontWeight[];
}

function weights(...entries: [FontWeightId, number][]): FontWeight[] {
  const labels: Record<FontWeightId, string> = {
    light: "Light",
    normal: "Normal",
    semibold: "Semibold",
  };
  return entries.map(([id, value]) => ({ id, label: labels[id], value }));
}

// Add a new font by appending an entry here with a unique `id` — it will
// automatically show up in the font settings popover.
export const fonts: FontOption[] = [
  {
    id: "dm-mono",
    label: "DM Mono",
    cssValue: '"DM Mono", monospace',
    googleFontUrl:
      "https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap",
    weights: weights(["light", 300], ["normal", 400], ["semibold", 500]),
  },
  {
    id: "dm-sans",
    label: "DM Sans",
    cssValue: '"DM Sans", sans-serif',
    googleFontUrl:
      "https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;0,1000;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900;1,1000&display=swap",
    weights: weights(["light", 300], ["normal", 400], ["semibold", 600]),
  },
  {
    id: "inter",
    label: "Inter",
    cssValue: '"Inter", sans-serif',
    googleFontUrl:
      "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap",
    weights: weights(["light", 300], ["normal", 400], ["semibold", 600]),
  },
  {
    id: "roboto",
    label: "Roboto",
    cssValue: '"Roboto", sans-serif',
    googleFontUrl:
      "https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;600&display=swap",
    weights: weights(["light", 300], ["normal", 400], ["semibold", 600]),
  },
  {
    id: "jetbrains-mono",
    label: "JetBrains Mono",
    cssValue: '"JetBrains Mono", monospace',
    googleFontUrl:
      "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;600&display=swap",
    weights: weights(["light", 300], ["normal", 400], ["semibold", 600]),
  },
  {
    id: "ibm-plex-mono",
    label: "IBM Plex Mono",
    cssValue: '"IBM Plex Mono", monospace',
    googleFontUrl:
      "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;600&display=swap",
    weights: weights(["light", 300], ["normal", 400], ["semibold", 600]),
  },
  {
    id: "lexend",
    label: "Lexend",
    cssValue: '"Lexend", sans-serif',
    googleFontUrl:
      "https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;600&display=swap",
    weights: weights(["light", 300], ["normal", 400], ["semibold", 600]),
  },
  {
    id: "poppins",
    label: "Poppins",
    cssValue: '"Poppins", sans-serif',
    googleFontUrl:
      "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap",
    weights: weights(["light", 300], ["normal", 400], ["semibold", 600]),
  },
  {
    id: "raleway",
    label: "Raleway",
    cssValue: '"Raleway", sans-serif',
    googleFontUrl:
      "https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;600&display=swap",
    weights: weights(["light", 300], ["normal", 400], ["semibold", 600]),
  },
  {
    id: "noto-serif",
    label: "Noto Serif",
    cssValue: '"Noto Serif", serif',
    googleFontUrl:
      "https://fonts.googleapis.com/css2?family=Noto+Serif:wght@300;400;600&display=swap",
    weights: weights(["light", 300], ["normal", 400], ["semibold", 600]),
  },
  {
    id: "playfair-display",
    label: "Playfair Display",
    cssValue: '"Playfair Display", serif',
    googleFontUrl:
      "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&display=swap",
    // Playfair Display has no weight below 400 — no "light" tier.
    weights: weights(["normal", 400], ["semibold", 600]),
  },
];

export const defaultFontId = fonts[0].id;
export const defaultWeightId: FontWeightId = "normal";
