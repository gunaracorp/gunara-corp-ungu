import ZAI from "z-ai-web-dev-sdk";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { LANGUAGES, langMeta, type LangMeta } from "@/lib/i18n/languages";

/**
 * Generator terjemahan AI sisi server (dipakai API admin /api/i18n/generate).
 * Menerjemahkan kamus 69 kunci ke satu bahasa target via SDK sandbox,
 * memvalidasi semua kunci (nilai kurang → EN), lalu menulis berkas locale.
 */

const LOCALES_DIR = path.join(process.cwd(), "src", "lib", "i18n", "locales");

export type Dict = Record<string, string>;

export function localePath(code: string): string {
  return path.join(LOCALES_DIR, `${code}.json`);
}

export function expectedKeys(): string[] {
  return Object.keys(readBase().en);
}

export function readBase(): { en: Dict; id: Dict } {
  return {
    en: JSON.parse(readFileSync(path.join(LOCALES_DIR, "en.json"), "utf8")) as Dict,
    id: JSON.parse(readFileSync(path.join(LOCALES_DIR, "id.json"), "utf8")) as Dict,
  };
}

export function readLocaleFile(code: string): Dict | null {
  const p = localePath(code);
  if (!existsSync(p)) return null;
  try {
    const dict = JSON.parse(readFileSync(p, "utf8")) as Dict;
    return dict && typeof dict === "object" ? dict : null;
  } catch {
    return null;
  }
}

/** Statistik satu bahasa: berapa kunci terisi dibanding kamus kanonik. */
export function coverageOf(code: string, expected: string[]): { keys: number; complete: boolean } {
  const dict = readLocaleFile(code);
  if (!dict) return { keys: 0, complete: false };
  const n = expected.filter((k) => typeof dict[k] === "string" && dict[k].trim()).length;
  return { keys: n, complete: n >= expected.length };
}

function parseDict(raw: string): Dict {
  let s = String(raw ?? "").trim();
  s = s.replace(/^```(?:json)?/i, "").replace(/```$/g, "").trim();
  const a = s.indexOf("{");
  const b = s.lastIndexOf("}");
  if (a === -1 || b <= a) throw new Error("no_json_object");
  return JSON.parse(s.slice(a, b + 1)) as Dict;
}

export interface GenResult {
  code: string;
  ok: boolean;
  keys: number;
  fallbackEn: number;
  ms: number;
  error?: string;
}

/** Terjemahkan + tulis satu bahasa. Kode wajib terdaftar di registry 195. */
export async function generateLocaleWithAI(code: string): Promise<GenResult> {
  const meta: LangMeta | undefined = langMeta(code);
  const t0 = Date.now();
  if (!meta) {
    return { code, ok: false, keys: 0, fallbackEn: 0, ms: 0, error: "kode tidak terdaftar di registry 195 bahasa" };
  }
  const { en, id: idn } = readBase();
  const keys = Object.keys(en);

  const system =
    "You are a professional software localizer. " +
    "You translate dashboard UI strings with a formal, confident corporate tone. " +
    "Reply with ONE valid JSON object and NOTHING else — no markdown fences, no commentary.";
  const user = [
    `Target language: ${meta.name} (${meta.native}), BCP code "${meta.code}"${meta.rtl ? " — language is written RIGHT-TO-LEFT" : ""}.`,
    `Translate every UI string of a corporate dashboard (GUNARA CORPORATION — business licensing & consulting firm).`,
    `Use natural ${meta.name} as real professionals write it. Keep brand words as-is: GUNARA, CEO, VVIP, WA, Invoice, JSON, GUNARA-EMP-XXXX-XXXX, {n}.`,
    `References: "en" = English source, "id" = Indonesian source. Pick the best phrasing for ${meta.name}.`,
    `Return ONE JSON object whose keys are EXACTLY the keys of the EN object below (${keys.length} keys), with values translated to ${meta.name}.`,
    `EN source: ${JSON.stringify(en)}`,
    `ID source: ${JSON.stringify(idn)}`,
  ].join("\n");

  try {
    const zai = await ZAI.create();
    let lastErr: unknown = null;
    for (let attempt = 1; attempt <= 6; attempt++) {
      try {
        const completion = await zai.chat.completions.create({
          messages: [
            { role: "assistant", content: system },
            { role: "user", content: user },
          ],
          thinking: { type: "disabled" },
        });
        const text = completion?.choices?.[0]?.message?.content ?? "";
        const parsed = parseDict(text);
        const dict: Dict = {};
        let fallbackEn = 0;
        for (const k of keys) {
          const v = parsed[k];
          if (typeof v === "string" && v.trim()) dict[k] = v.trim();
          else {
            dict[k] = en[k];
            fallbackEn++;
          }
        }
        writeFileSync(localePath(meta.code), JSON.stringify(dict, null, 2) + "\n");
        return {
          code: meta.code,
          ok: true,
          keys: keys.length - fallbackEn,
          fallbackEn,
          ms: Date.now() - t0,
        };
      } catch (err) {
        lastErr = err;
        const msg = String((err as Error)?.message ?? err);
        await new Promise((r) => setTimeout(r, /429|too many/i.test(msg) ? 20000 * attempt : 2500 * attempt));
      }
    }
    return {
      code: meta.code,
      ok: false,
      keys: 0,
      fallbackEn: 0,
      ms: Date.now() - t0,
      error: String((lastErr as Error)?.message ?? lastErr),
    };
  } catch (err) {
    return {
      code: meta.code,
      ok: false,
      keys: 0,
      fallbackEn: 0,
      ms: Date.now() - t0,
      error: String((err as Error)?.message ?? err),
    };
  }
}

/** Daftar bahasa yang locale-nya belum lengkap (untuk tombol "isi semua"). */
export function incompleteLanguages(expected?: string[]): { code: string; keys: number }[] {
  const exp = expected ?? expectedKeys();
  return LANGUAGES.filter((l) => !coverageOf(l.code, exp).complete)
    .map((l) => ({ code: l.code, keys: coverageOf(l.code, exp).keys }));
}
