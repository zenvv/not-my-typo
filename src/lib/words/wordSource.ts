import en from "./localWordLists/en.json";
import ptBr from "./localWordLists/pt-br.json";
import fr from "./localWordLists/fr.json";
import es from "./localWordLists/es.json";
import de from "./localWordLists/de.json";
import it from "./localWordLists/it.json";
import { fetchWordsFromApi } from "./fetchWords";

export type Language = "en" | "pt-br" | "fr" | "es" | "de" | "it";

const localLists: Record<Language, string[]> = {
  en,
  "pt-br": ptBr,
  fr,
  es,
  de,
  it,
};

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function getLocalWords(lang: Language, count: number): string[] {
  const list = localLists[lang];
  const words: string[] = [];
  while (words.length < count) {
    words.push(...shuffle(list));
  }
  return words.slice(0, count);
}

export interface WordBatch {
  words: string[];
  source: "api" | "local";
}

// Tries the live API first; falls back to the bundled local list on any
// failure or timeout so a test never stalls waiting on a third-party host.
// The local list has no difficulty rating, so a difficulty-filtered batch
// that came back short is topped up with plain local words rather than
// discarded — a test should never stall waiting for a "pure" difficulty match.
export async function getWords(
  lang: Language,
  count: number,
  diff?: number
): Promise<WordBatch> {
  try {
    const words = await fetchWordsFromApi(lang, count, { diff });
    if (words.length === 0) throw new Error("random-word-api returned no words");
    if (words.length < count) {
      return {
        words: [...words, ...getLocalWords(lang, count - words.length)],
        source: "api",
      };
    }
    return { words: words.slice(0, count), source: "api" };
  } catch {
    return { words: getLocalWords(lang, count), source: "local" };
  }
}
