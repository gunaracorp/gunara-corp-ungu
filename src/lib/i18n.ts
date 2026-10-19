"use client";

/**
 * i18n GUNARA v2 — mesin 195 bahasa untuk chrome dashboard.
 *
 * Arsitektur:
 *   - Kamus kanonik: id.json + en.json (69 kunci, dimuat eager).
 *   - 193 bahasa lain: lazy-load via import dinamis
 *     `@/lib/i18n/locales/{kode}.json`; bila berkas belum ter-bundle
 *     (baru dibuat AI setelah server hidup) → fallback fetch
 *     /api/i18n/locales?code=xx (baca berkas di disk + merge override DB).
 *   - Rantai fallback tr(): bahasa aktif → en → id → kunci itu sendiri.
 *   - RTL otomatis (13 bahasa) via atribut dir pada <html>.
 *   - Sinkron antar-tab (event storage) + param URL ?lang=xx + cookie.
 *
 * Pemakaian:
 *   const [lang, setLang] = useLang();
 *   tr(lang, "tab.overview")         // "Ringkasan" | "Overview" | "概览" | …
 *   <LangToggle lang={lang} onChange={setLang} />
 *
 * Pilihan disimpan di localStorage (kunci "gunara-lang", default "id").
 */

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { isKnownLang, isRtlCode, normalizeLang } from "@/lib/i18n/languages";
import idBase from "@/lib/i18n/locales/id.json";
import enBase from "@/lib/i18n/locales/en.json";

export type Lang = string;
export const LANG_KEY = "gunara-lang";
export const DEFAULT_LANG: Lang = "id";

type Dict = Record<string, string>;
type Slot = Dict | "loading" | "missing";

/** Kumpulan kamus yang sudah siap (id & en dimuat eager). */
const slots = new Map<string, Slot>([
  ["id", idBase as Dict],
  ["en", enBase as Dict],
]);

const pending = new Set<string>();
let tick = 0;
const listeners = new Set<() => void>();

function emit(): void {
  tick += 1;
  listeners.forEach((cb) => cb());
}

/* ── Terjemahan dengan rantai fallback: target → en → id → kunci ───────── */

export function tr(lang: Lang, key: string): string {
  const l = normalizeLang(lang);
  const s = slots.get(l);
  if (s && typeof s === "object") {
    const v = s[key];
    if (typeof v === "string" && v) return v;
  }
  const ve = (enBase as Dict)[key];
  if (ve) return ve;
  const vi = (idBase as Dict)[key];
  if (vi) return vi;
  return key;
}

/** Ganti placeholder "{n}" pada string terjemahan. */
export function trf(lang: Lang, key: string, n: number | string): string {
  return tr(lang, key).replace("{n}", String(n));
}

/* ── Pemuatan locale lambat ────────────────────────────────────────────── */

async function loadLocale(l: string): Promise<void> {
  let base: Dict | null = null;

  // 1) Chunk bundle (berkas sudah ada saat server hidup).
  try {
    const mod = (await import(`@/lib/i18n/locales/${l}.json`)) as {
      default?: Dict;
    };
    const dict = (mod?.default ?? mod) as Dict;
    if (dict && typeof dict === "object" && Object.keys(dict).length > 0) {
      base = dict;
    }
  } catch {
    /* berkas belum ada di bundle → coba API runtime */
  }

  // 2) API runtime (berkas baru di disk, mis. hasil generate AI admin).
  if (!base) {
    try {
      const res = await fetch(`/api/i18n/locales?code=${encodeURIComponent(l)}`, {
        cache: "no-store",
      });
      const json = (await res.json()) as { ok?: boolean; data?: Dict };
      if (res.ok && json.ok && json.data && Object.keys(json.data).length > 0) {
        base = json.data;
      }
    } catch {
      /* offline / tidak ada — pakai fallback en→id */
    }
  }

  if (!base) {
    slots.set(l, "missing");
    pending.delete(l);
    emit();
    return;
  }

  // 3) Merge suntingan manual (override) dari database — best effort.
  try {
    const res = await fetch(`/api/i18n/overrides?lang=${encodeURIComponent(l)}`, {
      cache: "no-store",
    });
    const json = (await res.json()) as { ok?: boolean; data?: Dict };
    if (res.ok && json.ok && json.data && typeof json.data === "object") {
      base = { ...base, ...json.data };
    }
  } catch {
    /* tanpa override pun tetap jalan */
  }

  slots.set(l, base);
  pending.delete(l);
  emit();
}

/** Pastikan kamus untuk bahasa `code` tersedia (idempoten). */
export function ensureLocale(code: Lang): void {
  const l = normalizeLang(code);
  if (l === "id" || l === "en" || slots.has(l) || pending.has(l)) return;
  pending.add(l);
  slots.set(l, "loading");
  void loadLocale(l);
}

/** Buang cache kamus lalu muat ulang (dipakai Studio Multi-Bahasa). */
export function reloadLocale(code: Lang): void {
  const l = normalizeLang(code);
  slots.delete(l);
  pending.delete(l);
  emit();
  ensureLocale(l);
}

/** Status kamus — untuk badge UI. */
export function localeState(code: Lang): "ready" | "loading" | "missing" | "base" {
  const l = normalizeLang(code);
  if (l === "id" || l === "en") return "base";
  const s = slots.get(l);
  if (!s) return "missing";
  if (s === "loading") return "loading";
  if (s === "missing") return "missing";
  return "ready";
}

/* ── Store bahasa (localStorage + lintas-tab) ──────────────────────────── */

function bacaLang(): Lang {
  if (typeof window === "undefined") return DEFAULT_LANG;
  try {
    const stored = window.localStorage.getItem(LANG_KEY);
    if (stored) {
      const n = normalizeLang(stored);
      return isKnownLang(n) ? n : DEFAULT_LANG;
    }
    const q = new URL(window.location.href).searchParams.get("lang");
    if (q) {
      const n = normalizeLang(q);
      return isKnownLang(n) ? n : DEFAULT_LANG;
    }
  } catch {
    /* localStorage bisa terblokir — pakai default */
  }
  return DEFAULT_LANG;
}

function subscribeLang(onChange: () => void): () => void {
  window.addEventListener("storage", onChange);
  window.addEventListener("gunara-lang-change", onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener("gunara-lang-change", onChange);
  };
}

function subscribeTick(onChange: () => void): () => void {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

/** Hook bahasa aktif — re-render juga saat kamus locale selesai dimuat. */
export function useLang(): [Lang, (l: Lang) => void] {
  const lang = useSyncExternalStore(subscribeLang, bacaLang, () => DEFAULT_LANG);
  // Tick berubah setiap kamus baru siap → komponen ikut render ulang.
  useSyncExternalStore(
    subscribeTick,
    () => tick,
    () => 0
  );

  const setLang = useCallback((l: Lang) => {
    const n = normalizeLang(l);
    try {
      window.localStorage.setItem(LANG_KEY, n);
    } catch {
      /* abaikan */
    }
    try {
      document.cookie = `gunara-lang=${encodeURIComponent(n)}; Path=/; Max-Age=31536000; SameSite=Lax`;
    } catch {
      /* abaikan */
    }
    window.dispatchEvent(new Event("gunara-lang-change"));
  }, []);

  // Muat kamus + terapkan arah teks (RTL) + atribut lang dokumen.
  useEffect(() => {
    ensureLocale(lang);
    const html = document.documentElement;
    html.setAttribute("dir", isRtlCode(lang) ? "rtl" : "ltr");
    html.setAttribute("lang", lang);
  }, [lang]);

  return [lang, setLang];
}
