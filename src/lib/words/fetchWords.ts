import type { Language } from "./wordSource";

function buildUrl(lang: Language, count: number, diff?: number): string {
  const params = new URLSearchParams({ number: String(count), lang });
  if (diff) params.set("diff", String(diff));
  return `https://random-word-api.herokuapp.com/word?${params.toString()}`;
}

async function fetchBatch(
  lang: Language,
  count: number,
  timeoutMs: number,
  diff?: number
): Promise<string[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(buildUrl(lang, count, diff), {
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(`random-word-api responded with ${response.status}`);
    }
    const data: unknown = await response.json();
    if (!Array.isArray(data) || data.length === 0 || !data.every((w) => typeof w === "string")) {
      throw new Error("random-word-api returned an unexpected response shape");
    }
    return data as string[];
  } finally {
    clearTimeout(timeout);
  }
}

// The API's diff filter only applies when requesting 5 or fewer words at
// once, so a difficulty-filtered batch has to be assembled from several
// small parallel requests instead of one large one.
const DIFF_CHUNK_SIZE = 5;

export async function fetchWordsFromApi(
  lang: Language,
  count: number,
  options: { timeoutMs?: number; diff?: number } = {}
): Promise<string[]> {
  const { timeoutMs = 2500, diff } = options;

  if (!diff || count <= DIFF_CHUNK_SIZE) {
    return fetchBatch(lang, count, timeoutMs, diff);
  }

  const chunkCount = Math.ceil(count / DIFF_CHUNK_SIZE);
  const chunks = await Promise.all(
    Array.from({ length: chunkCount }, (_, i) => {
      const remaining = count - i * DIFF_CHUNK_SIZE;
      return fetchBatch(lang, Math.min(DIFF_CHUNK_SIZE, remaining), timeoutMs, diff).catch(
        () => [] as string[]
      );
    })
  );
  return chunks.flat();
}
