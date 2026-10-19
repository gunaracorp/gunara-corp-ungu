import raw from "./languages.json";

/**
 * Registry 195 bahasa GUNARA — sumber tunggal (dipakai UI, API, dan skrip AI).
 * Format JSON: [kode, namaNative, namaInggris, bendera, region, rtl(0/1), core(0/1)]
 * core = dikurasi native (ditulis tangan), sisanya hasil terjemahan AI GLM-4.6.
 */

export type Region = "asia" | "europe" | "africa" | "americas" | "oceania";

export interface LangMeta {
  code: string;
  native: string;
  name: string;
  flag: string;
  region: Region;
  rtl: boolean;
  core: boolean;
}

type Row = [string, string, string, string, string, number, number];

export const LANGUAGES: LangMeta[] = (raw as unknown as Row[]).map(
  ([code, native, name, flag, region, rtl, core]) => ({
    code,
    native,
    name,
    flag,
    region: region as Region,
    rtl: rtl === 1,
    core: core === 1,
  })
);

export const TOTAL_LANGUAGES = LANGUAGES.length; // 195

const byCode = new Map(LANGUAGES.map((l) => [l.code, l]));

export function langMeta(code: string): LangMeta | undefined {
  return byCode.get(code);
}

/** Samakan berbagai bentuk input ("ID", "id-ID", "pt-br") → kode kanonik registry. */
export function normalizeLang(input: string): string {
  const q = (input ?? "").trim();
  if (!q) return "id";
  const direct = byCode.get(q);
  if (direct) return direct.code;
  const lower = q.toLowerCase();
  for (const l of LANGUAGES) {
    if (l.code.toLowerCase() === lower) return l.code;
  }
  const base = lower.split(/[-_]/)[0];
  for (const l of LANGUAGES) {
    if (l.code.toLowerCase() === base) return l.code;
  }
  return lower;
}

export function isKnownLang(input: string): boolean {
  return byCode.has(normalizeLang(input));
}

export function isRtlCode(code: string): boolean {
  return byCode.get(normalizeLang(code))?.rtl ?? false;
}

export const RTL_CODES = LANGUAGES.filter((l) => l.rtl).map((l) => l.code);

export const REGION_LABEL_KEYS: { id: Region | "all"; key: string }[] = [
  { id: "all", key: "lang.all" },
  { id: "asia", key: "lang.region.asia" },
  { id: "europe", key: "lang.region.europe" },
  { id: "africa", key: "lang.region.africa" },
  { id: "americas", key: "lang.region.americas" },
  { id: "oceania", key: "lang.region.oceania" },
];

/** 20 bahasa populer untuk baris atas pemilih bahasa. */
export const POPULAR_CODES = [
  "id", "en", "jv", "su", "ms", "ar", "zh", "es", "hi", "fr",
  "de", "ja", "ko", "pt", "ru", "th", "vi", "tr", "it", "nl",
];
