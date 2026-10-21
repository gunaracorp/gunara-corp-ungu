"use client";

/**
 * LanguagePicker — pemilih 195 bahasa GUNARA (god mode).
 * Pencarian instan (kode/native/inggris), filter region, baris populer,
 * riwayat pemakaian, badge kualitas (⭐ kurasi native / 🤖 terjemahan AI),
 * penanda RTL, dan sinkron langsung ke mesin i18n.
 */

import { AnimatePresence, motion } from "framer-motion";
import { Check, Globe, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { tr, trf, useLang } from "@/lib/i18n";
import {
  LANGUAGES,
  POPULAR_CODES,
  REGION_LABEL_KEYS,
  TOTAL_LANGUAGES,
  langMeta,
  normalizeLang,
  type Region,
} from "@/lib/i18n/languages";

const RECENT_KEY = "gunara-lang-recent";
const RECENT_MAX = 8;

function bacaRecent(): string[] {
  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    const arr = raw ? (JSON.parse(raw) as unknown) : [];
    if (!Array.isArray(arr)) return [];
    return arr
      .filter((x): x is string => typeof x === "string")
      .map((c) => normalizeLang(c))
      .filter((c) => langMeta(c) !== undefined)
      .slice(0, RECENT_MAX);
  } catch {
    return [];
  }
}

function catatRecent(code: string): void {
  try {
    const next = [code, ...bacaRecent().filter((c) => c !== code)].slice(0, RECENT_MAX);
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    /* abaikan */
  }
}

export function LanguagePicker({
  open,
  onClose,
  dark = false,
}: {
  open: boolean;
  onClose: () => void;
  dark?: boolean;
}) {
  const [lang, setLang] = useLang();
  const [q, setQ] = useState("");
  const [region, setRegion] = useState<Region | "all">("all");
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => {
      setQ("");
      setRecent(bacaRecent());
      inputRef.current?.focus();
    }, 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return LANGUAGES.filter((l) => {
      if (region !== "all" && l.region !== region) return false;
      if (!query) return true;
      return (
        l.code.toLowerCase().includes(query) ||
        l.native.toLowerCase().includes(query) ||
        l.name.toLowerCase().includes(query) ||
        l.flag.includes(query)
      );
    });
  }, [q, region]);

  const popular = useMemo(
    () => POPULAR_CODES.map((c) => langMeta(c)).filter((m): m is NonNullable<typeof m> => !!m),
    []
  );

  const pilih = (code: string) => {
    setLang(code);
    catatRecent(code);
    setRecent(bacaRecent());
    onClose();
  };

  const surface = dark
    ? "bg-zinc-900 border-white/10 text-zinc-100"
    : "bg-white border-slate-200 text-slate-900";
  const muted = dark ? "text-zinc-400" : "text-slate-500";
  const chipBase = dark
    ? "border-white/10 bg-white/5 hover:border-violet-400/50"
    : "border-slate-200 bg-white hover:border-violet-400";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={tr(lang, "lang.pickerTitle")}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className={`flex max-h-[86vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border shadow-2xl ${surface}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Kepala */}
            <div className={`border-b px-5 pb-4 pt-5 ${dark ? "border-white/10" : "border-slate-100"}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="flex items-center gap-2 text-lg font-black tracking-tight">
                    <Globe className="h-5 w-5 text-violet-500" aria-hidden="true" />
                    {tr(lang, "lang.pickerTitle")}
                  </h2>
                  <p className={`mt-1 text-[12.5px] font-semibold ${muted}`}>
                    {trf(lang, "lang.count", TOTAL_LANGUAGES)} ·{" "}
                    {LANGUAGES.filter((l) => l.core).length} {tr(lang, "lang.native").toLowerCase()} ·{" "}
                    {LANGUAGES.filter((l) => !l.core).length} {tr(lang, "lang.ai").toLowerCase()}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Tutup"
                  className={`rounded-full p-2 transition-colors ${dark ? "hover:bg-white/10" : "hover:bg-slate-100"}`}
                >
                  <X className="h-4.5 w-4.5" aria-hidden="true" />
                </button>
              </div>

              {/* Bahasa aktif */}
              <div className={`mt-3 flex items-center gap-2 rounded-xl px-3 py-2 text-[12.5px] font-bold ${dark ? "bg-white/5" : "bg-violet-600/5 text-violet-700"}`}>
                <span className="text-base leading-none">{langMeta(lang)?.flag ?? "🌐"}</span>
                <span className={dark ? "text-zinc-300" : "text-slate-500"}>{tr(lang, "lang.current")}:</span>
                <span className="truncate">{langMeta(lang)?.native ?? lang}</span>
                <span className={`ml-auto rounded-full border px-2 py-0.5 text-[10px] font-black uppercase ${dark ? "border-white/10 text-zinc-400" : "border-violet-300 text-violet-600"}`}>
                  {lang}
                </span>
                {langMeta(lang)?.rtl && (
                  <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-black text-amber-600">
                    RTL
                  </span>
                )}
              </div>

              {/* Pencarian */}
              <div className="relative mt-3">
                <Search className={`pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 ${muted}`} aria-hidden="true" />
                <input
                  ref={inputRef}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={tr(lang, "lang.search")}
                  aria-label={tr(lang, "lang.search")}
                  className={`h-11 w-full rounded-xl border pl-10 pr-3 text-sm outline-none transition-all focus:ring-2 focus:ring-violet-500/25 ${
                    dark
                      ? "border-white/10 bg-white/5 text-zinc-100 placeholder:text-zinc-500 focus:border-violet-500/60"
                      : "border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-violet-500"
                  }`}
                />
              </div>

              {/* Filter region */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {REGION_LABEL_KEYS.map(({ id, key }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setRegion(id)}
                    aria-pressed={region === id}
                    className={`rounded-full border px-3 py-1 text-[11.5px] font-bold transition-all ${
                      region === id
                        ? "border-violet-600 bg-violet-600 text-white"
                        : chipBase + (dark ? " text-zinc-300" : " text-slate-600")
                    }`}
                  >
                    {tr(lang, key)}
                  </button>
                ))}
              </div>
            </div>

            {/* Isi: populer + riwayat + grid 195 */}
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 [scrollbar-width:thin]">
              {!q && region === "all" && (
                <>
                  <p className={`mb-2 text-[11px] font-black uppercase tracking-wider ${muted}`}>
                    {tr(lang, "lang.popular")}
                  </p>
                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {popular.map((m) => (
                      <button
                        key={`pop-${m.code}`}
                        type="button"
                        onClick={() => pilih(m.code)}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-bold transition-all ${chipBase} ${
                          lang === m.code ? "border-violet-600 bg-violet-600 text-white" : ""
                        }`}
                      >
                        <span aria-hidden="true">{m.flag}</span>
                        {m.native}
                      </button>
                    ))}
                  </div>

                  {recent.length > 0 && (
                    <>
                      <p className={`mb-2 text-[11px] font-black uppercase tracking-wider ${muted}`}>
                        {tr(lang, "lang.recent")}
                      </p>
                      <div className="mb-4 flex flex-wrap gap-1.5">
                        {recent.map((c) => {
                          const m = langMeta(c);
                          if (!m) return null;
                          return (
                            <button
                              key={`rec-${m.code}`}
                              type="button"
                              onClick={() => pilih(m.code)}
                              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-bold transition-all ${chipBase} ${
                                lang === m.code ? "border-violet-600 bg-violet-600 text-white" : ""
                              }`}
                            >
                              <span aria-hidden="true">{m.flag}</span>
                              {m.native}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </>
              )}

              <p className={`mb-2 text-[11px] font-black uppercase tracking-wider ${muted}`}>
                {q || region !== "all"
                  ? `${filtered.length} / ${TOTAL_LANGUAGES}`
                  : tr(lang, "lang.all")}
              </p>
              {filtered.length === 0 ? (
                <p className={`py-8 text-center text-sm font-semibold ${muted}`}>{tr(lang, "ui.empty")}</p>
              ) : (
                <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                  {filtered.map((m) => {
                    const active = lang === m.code;
                    return (
                      <li key={m.code}>
                        <button
                          type="button"
                          onClick={() => pilih(m.code)}
                          aria-pressed={active}
                          className={`flex w-full items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-all ${
                            active
                              ? "border-violet-600 bg-violet-600/10 ring-1 ring-violet-600/40"
                              : chipBase
                          }`}
                        >
                          <span className="text-lg leading-none" aria-hidden="true">
                            {m.flag}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[13px] font-bold leading-tight">
                              {m.native}
                            </span>
                            <span className={`block truncate text-[11px] leading-tight ${muted}`}>
                              {m.name} · {m.code}
                            </span>
                          </span>
                          <span className="flex shrink-0 items-center gap-1">
                            {m.rtl && (
                              <span
                                title={tr(lang, "lang.rtl")}
                                className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-black text-amber-600"
                              >
                                RTL
                              </span>
                            )}
                            <span
                              title={m.core ? tr(lang, "lang.native") : tr(lang, "lang.ai")}
                              className={`rounded px-1.5 py-0.5 text-[9px] font-black ${
                                m.core
                                  ? "bg-emerald-500/15 text-emerald-600"
                                  : "bg-violet-500/10 text-violet-600"
                              }`}
                            >
                              {m.core ? "⭐" : "🤖"}
                            </span>
                            {active && <Check className="h-4 w-4 text-violet-600" aria-hidden="true" />}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Kaki */}
            <div className={`border-t px-5 py-3 text-[11px] font-semibold ${dark ? "border-white/10 text-zinc-500" : "border-slate-100 text-slate-400"}`}>
              ⭐ {tr(lang, "lang.native")} · 🤖 {tr(lang, "lang.ai")} — GLM-4.6 ·{" "}
              {langMeta(lang)?.rtl ? `${tr(lang, "lang.rtl")} aktif` : "195 bahasa, satu GUNARA"}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
