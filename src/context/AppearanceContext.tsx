import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { fonts, defaultFontId, defaultWeightId, type FontWeightId } from "@/config/fonts";
import {
  themes,
  defaultThemeId,
  radiusOptions,
  defaultRadiusId,
} from "@/config/themes";

type ColorScheme = "light" | "dark" | "system";

interface AppearanceContextValue {
  themeId: string;
  setThemeId: (id: string) => void;
  fontId: string;
  setFontId: (id: string) => void;
  weightId: FontWeightId;
  setWeightId: (id: FontWeightId) => void;
  radiusId: string;
  setRadiusId: (id: string) => void;
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
  resolvedScheme: "light" | "dark";
}

const AppearanceContext = createContext<AppearanceContextValue | null>(null);

const FONT_LINK_ID = "app-selected-font";

function toCssVarName(key: string) {
  return `--${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
}

export function AppearanceProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useLocalStorage("typo-dash:theme", defaultThemeId);
  const [fontId, setFontId] = useLocalStorage("typo-dash:font", defaultFontId);
  const [weightId, setWeightId] = useLocalStorage<FontWeightId>(
    "typo-dash:font-weight",
    defaultWeightId
  );
  const [radiusId, setRadiusId] = useLocalStorage(
    "typo-dash:radius",
    defaultRadiusId
  );
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>(
    "typo-dash:color-scheme",
    "system"
  );

  const [systemPrefersDark, setSystemPrefersDark] = useState(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = (e: MediaQueryListEvent) => setSystemPrefersDark(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  const resolvedScheme: "light" | "dark" =
    colorScheme === "system"
      ? systemPrefersDark
        ? "dark"
        : "light"
      : colorScheme;

  useEffect(() => {
    document.documentElement.classList.toggle("dark", resolvedScheme === "dark");
  }, [resolvedScheme]);

  useEffect(() => {
    const theme = themes.find((t) => t.id === themeId) ?? themes[0];
    const tokens = resolvedScheme === "dark" ? theme.dark : theme.light;
    for (const [key, value] of Object.entries(tokens)) {
      document.documentElement.style.setProperty(toCssVarName(key), value);
    }
  }, [themeId, resolvedScheme]);

  useEffect(() => {
    const radius = radiusOptions.find((r) => r.id === radiusId) ?? radiusOptions[0];
    document.documentElement.style.setProperty("--radius", radius.value);
  }, [radiusId]);

  useEffect(() => {
    const font = fonts.find((f) => f.id === fontId) ?? fonts[0];
    document.documentElement.style.setProperty("--font-selected", font.cssValue);

    let link = document.getElementById(FONT_LINK_ID) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.id = FONT_LINK_ID;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
    link.href = font.googleFontUrl;

    // Fall back to "normal" if the newly selected font doesn't ship the
    // currently selected weight tier (e.g. Playfair Display has no "light").
    if (!font.weights.some((w) => w.id === weightId)) {
      setWeightId(defaultWeightId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fontId]);

  useEffect(() => {
    const font = fonts.find((f) => f.id === fontId) ?? fonts[0];
    const weight = font.weights.find((w) => w.id === weightId) ?? font.weights[0];
    document.documentElement.style.setProperty(
      "--font-weight-selected",
      String(weight.value)
    );
  }, [fontId, weightId]);

  const value = useMemo(
    () => ({
      themeId,
      setThemeId,
      fontId,
      setFontId,
      weightId,
      setWeightId,
      radiusId,
      setRadiusId,
      colorScheme,
      setColorScheme,
      resolvedScheme,
    }),
    [
      themeId,
      setThemeId,
      fontId,
      setFontId,
      weightId,
      setWeightId,
      radiusId,
      setRadiusId,
      colorScheme,
      setColorScheme,
      resolvedScheme,
    ]
  );

  return (
    <AppearanceContext.Provider value={value}>
      {children}
    </AppearanceContext.Provider>
  );
}

export function useAppearance() {
  const ctx = useContext(AppearanceContext);
  if (!ctx) {
    throw new Error("useAppearance must be used within an AppearanceProvider");
  }
  return ctx;
}
