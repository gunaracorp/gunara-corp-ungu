/**
 * Generator 181 locale GUNARA via AI (GLM) — god mode edition.
 *
 * Pemakaian:
 *   bun scripts/generate-locales.mjs                 # isi semua yang kurang
 *   bun scripts/generate-locales.mjs --only=jv,th    # bahasa tertentu
 *   bun scripts/generate-locales.mjs --force         # timpa yang sudah ada
 *   bun scripts/generate-locales.mjs --conc=8        # pekerja paralel
 *
 * Sifat: resumable (berkas lengkap dilewati), validasi kunci terhadap
 * en.json, kunci kurang diisi nilai EN agar UI tidak pernah kosong.
 */

import ZAI from "z-ai-web-dev-sdk";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = "/home/z/my-project/gunara-corp-ungu";
const LOCALES = path.join(ROOT, "src/lib/i18n/locales");

const args = process.argv.slice(2);
const flag = (name, def) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split("=").slice(1).join("=") : def;
};
const ONLY = flag("only", "") ? flag("only", "").split(",").map((s) => s.trim()) : null;
const FORCE = args.includes("--force");
const CONC = Math.max(1, Math.min(6, Number(flag("conc", "1"))));
const PAUSE = Math.max(0, Number(flag("pause", "3500")));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const langs = JSON.parse(readFileSync(path.join(ROOT, "src/lib/i18n/languages.json"), "utf8"));
const en = JSON.parse(readFileSync(path.join(LOCALES, "en.json"), "utf8"));
const idn = JSON.parse(readFileSync(path.join(LOCALES, "id.json"), "utf8"));
const KEYS = Object.keys(en);

const log = (msg) => {
  const line = `[i18n-gen ${new Date().toISOString().slice(11, 19)}] ${msg}`;
  console.log(line);
};

/** Berkas dianggap lengkap bila memuat >= 90% kunci (hasil AI yang sah). */
function completeFile(code) {
  const p = path.join(LOCALES, `${code}.json`);
  if (!existsSync(p)) return null;
  try {
    const dict = JSON.parse(readFileSync(p, "utf8"));
    const n = KEYS.filter((k) => typeof dict[k] === "string" && dict[k].trim()).length;
    if (n / KEYS.length >= 0.9) return dict;
    return null;
  } catch {
    return null;
  }
}

function parseDict(raw) {
  let s = String(raw ?? "").trim();
  s = s.replace(/^```(?:json)?/i, "").replace(/```$/g, "").trim();
  const a = s.indexOf("{");
  const b = s.lastIndexOf("}");
  if (a === -1 || b <= a) throw new Error("no_json_object");
  s = s.slice(a, b + 1);
  try {
    return JSON.parse(s);
  } catch {
    /* coba perbaikan ringan */
  }
  // Kunci tanpa kutip → beri kutip; buang koma tertinggal.
  const t = s
    .replace(/([{,]\s*)([A-Za-z_.\-][A-Za-z0-9_.\-]*)(\s*):/g, '$1"$2"$3:')
    .replace(/,\s*([}\]])/g, "$1");
  try {
    return JSON.parse(t);
  } catch {
    throw new Error("json_unrepairable");
  }
}

async function generateOne(zai, meta) {
  const [code, native, name, , , rtl] = meta;
  const system =
    "You are a professional software localizer. " +
    "You translate dashboard UI strings with a formal, confident corporate tone. " +
    "Reply with ONE valid JSON object and NOTHING else — no markdown fences, no commentary.";
  const user = [
    `Target language: ${name} (${native}), BCP code "${code}"${rtl === 1 ? " — language is written RIGHT-TO-LEFT" : ""}.`,
    `Translate every UI string of a corporate dashboard (GUNARA CORPORATION — business licensing & consulting firm).`,
    `Use natural ${name} as real professionals write it. Keep brand words as-is: GUNARA, CEO, VVIP, WA, Invoice, JSON, GUNARA-EMP-XXXX-XXXX, {n}.`,
    `References: "en" = English source, "id" = Indonesian source. Pick the best phrasing for ${name}.`,
    `Return ONE JSON object whose keys are EXACTLY the keys of the EN object below (${KEYS.length} keys), with values translated to ${name}.`,
    `EN source: ${JSON.stringify(en)}`,
    `ID source: ${JSON.stringify(idn)}`,
  ].join("\n");

  let lastErr = null;
  for (let attempt = 1; attempt <= 8; attempt++) {
    const t0 = Date.now();
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
      const dict = {};
      let missing = 0;
      for (const k of KEYS) {
        const v = parsed[k];
        if (typeof v === "string" && v.trim()) dict[k] = v.trim();
        else {
          dict[k] = en[k];
          missing++;
        }
      }
      writeFileSync(path.join(LOCALES, `${code}.json`), JSON.stringify(dict, null, 2) + "\n");
      return { code, ok: true, ms: Date.now() - t0, missing };
    } catch (err) {
      lastErr = err;
      const msg = String(err?.message ?? err);
      const is429 = /429|too many/i.test(msg);
      const wait = is429 ? 40000 + attempt * 15000 : 1500 * attempt;
      log(`  ${code} percobaan ${attempt} gagal (${msg.slice(0, 80)}) — tunggu ${Math.round(wait / 1000)}s`);
      await sleep(wait);
    }
  }
  return { code, ok: false, error: String(lastErr?.message ?? lastErr) };
}

async function main() {
  const targets = langs.filter((m) => {
    const [code, , , , , , core] = m;
    if (ONLY && !ONLY.includes(code)) return false;
    if (FORCE) return true;
    if (completeFile(code)) return false;
    return true;
  });

  log(`target=${targets.length}/${langs.length} keys=${KEYS.length} conc=${CONC}`);
  if (targets.length === 0) {
    log("semua locale sudah lengkap — selesai.");
    return;
  }

  const zai = await ZAI.create();
  const results = [];
  let idx = 0;
  let done = 0;

  async function worker(wid) {
    await sleep(wid * 900); // stagger agar tidak meledak bersamaan
    while (idx < targets.length) {
      const meta = targets[idx++];
      let r;
      try {
        r = await generateOne(zai, meta);
      } catch (err) {
        r = { code: meta[0], ok: false, error: String(err?.message ?? err) };
      }
      done++;
      results.push(r);
      log(
        r.ok
          ? `[${done}/${targets.length}] ${r.code} OK ${r.ms}ms${r.missing ? ` (fallback EN: ${r.missing})` : ""}`
          : `[${done}/${targets.length}] ${r.code} GAGAL: ${r.error}`
      );
      await sleep(PAUSE + Math.floor(Math.random() * 1200));
    }
  }

  await Promise.all(Array.from({ length: Math.min(CONC, targets.length) }, (_, i) => worker(i)));

  const ok = results.filter((r) => r.ok).length;
  const fail = results.filter((r) => !r.ok);
  log(`SELESAI ok=${ok} gagal=${fail.length}${fail.length ? " → " + fail.map((f) => f.code).join(",") : ""}`);
}

main().catch((e) => {
  log(`FATAL: ${e?.stack ?? e}`);
  process.exit(1);
});
