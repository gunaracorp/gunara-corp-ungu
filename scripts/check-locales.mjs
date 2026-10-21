/**
 * Validator locale GUNARA — hitung berkas, cocokkan kunci dengan kanonik en.json.
 * Pemakaian: bun scripts/check-locales.mjs
 */
import { readdirSync, readFileSync, existsSync } from "node:fs";
import path from "node:path";

const ROOT = "/home/z/my-project/gunara-corp-ungu";
const LOCALES = path.join(ROOT, "src/lib/i18n/locales");

const langs = JSON.parse(readFileSync(path.join(ROOT, "src/lib/i18n/languages.json"), "utf8"));
const en = JSON.parse(readFileSync(path.join(LOCALES, "en.json"), "utf8"));
const keys = Object.keys(en);

const files = readdirSync(LOCALES).filter((f) => f.endsWith(".json"));
let ok = 0;
const partial = [];
const missing = [];
const broken = [];

for (const [code] of langs) {
  const p = path.join(LOCALES, `${code}.json`);
  if (!existsSync(p)) {
    missing.push(code);
    continue;
  }
  try {
    const dict = JSON.parse(readFileSync(p, "utf8"));
    const n = keys.filter((k) => typeof dict[k] === "string" && dict[k].trim()).length;
    if (n === keys.length) ok++;
    else partial.push(`${code} (${n}/${keys.length})`);
  } catch {
    broken.push(code);
  }
}

const extra = files.map((f) => f.replace(".json", "")).filter((c) => !langs.some(([code]) => code === c));

console.log(`registry      : ${langs.length} bahasa (target 195)`);
console.log(`kunci kanonik : ${keys.length}`);
console.log(`berkas locale : ${files.length}`);
console.log(`lengkap       : ${ok}`);
console.log(`parsial       : ${partial.length}${partial.length ? " → " + partial.join(", ") : ""}`);
console.log(`hilang        : ${missing.length}${missing.length ? " → " + missing.slice(0, 24).join(",") + (missing.length > 24 ? "…" : "") : ""}`);
console.log(`rusak         : ${broken.length}${broken.length ? " → " + broken.join(",") : ""}`);
console.log(`tak terdaftar : ${extra.length}${extra.length ? " → " + extra.join(",") : ""}`);
