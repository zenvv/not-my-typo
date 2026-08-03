import quotesEn from "./quotes.en.json";
import type { QuoteLength } from "@/features/typing-test/engine/engineTypes";

export interface Quote {
  id: string;
  text: string;
  source: string;
  length: QuoteLength;
}

const quotes: Quote[] = quotesEn as Quote[];

export function getRandomQuote(length?: QuoteLength | null): Quote {
  const pool = length ? quotes.filter((q) => q.length === length) : quotes;
  const list = pool.length > 0 ? pool : quotes;
  return list[Math.floor(Math.random() * list.length)];
}
