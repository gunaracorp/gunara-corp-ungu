"use client";

/**
 * AdminBahasaTab — Studio Multi-Bahasa Panel CEO (god mode).
 * Kelola 195 bahasa: statistik cakupan, isi otomatis via AI, suntingan
 * manual per kunci (override tersimpan di database), ekspor JSON.
 */

import { motion } from "framer-motion";
import {
  Bot,
  Check,
  Download,
  Languages,
  Loader2,
  RotateCcw,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { reloadLocale, tr, useLang } from "@/lib/i18n";
import { TOTAL_LANGUAGES, langMeta } from "@/lib/i18n/languages";

interface StatusRow {
  code: string;
  native: string;
  name: string;
  flag: string;
  region: string;
  rtl: boolean;
  core: boolean;
  keys: number;
  complete: boolean;
  present: boolean;
}

interface StatusPayload {
  ok: boolean;
  total: number;
  expected: number;
  summary: {
    complete: number;
    partial: number;
    missing: number;
    core: number;
    ai: number;
    rtl: number;
    overrides: number;
  };
  rows: StatusRow[];
  overrides: Record<string, number>;
}

type Dict = Record<string, string>;

export function AdminBahasaTab() {
  const [lang] = useLang();
  const [status, setStatus] = useState<StatusPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const loadStatus = useCallback(async (fresh = false) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/i18n/status${fresh ? "?fresh=1" : ""}`, { cache: "no-store" });
      const json = (await res.json()) as StatusPayload;
      if (json.ok) setStatus(json);
    } catch {
      /* diam */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStatus();
  }, [loadStatus]);

  const filtered = useMemo(() => {
    if (!status) return [];
    const query = q.trim().toLowerCase();
    return status.rows.filter((r) => {
      if (!query) return true;
      return (
        r.code.toLowerCase().includes(query) ||
        r.native.toLowerCase().includes(query) ||
        r.name.toLowerCase().includes(query)
      );
    });
  }, [status, q]);

  const summary = status?.summary;

  return (
    <div className="space-y-5">
      {/* Kepala studio */}
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-violet-600/5 to-blue-600/5 p-5">
        <h2 className="flex items-center gap-2 text-[16px] font-black tracking-tight text-slate-900">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600/10 text-violet-600">
            <Languages className="h-4.5 w-4.5" aria-hidden="true" />
          </span>
          {tr(lang, "lang.studioTitle")}
        </h2>
        <p className="mt-1 text-[12.5px] text-slate-500">{tr(lang, "lang.studioSubtitle")}</p>
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {[
          { label: "Bahasa", value: status?.total ?? TOTAL_LANGUAGES, tone: "text-slate-900" },
          { label: tr(lang, "lang.native"), value: summary?.core ?? 0, tone: "text-emerald-600" },
          { label: tr(lang, "lang.ai"), value: summary?.ai ?? 0, tone: "text-violet-600" },
          { label: tr(lang, "lang.coverage"), value: `${summary?.complete ?? 0}/${status?.total ?? 195}`, tone: "text-blue-600" },
          { label: "RTL", value: summary?.rtl ?? 0, tone: "text-amber-600" },
          { label: "Override", value: summary?.overrides ?? 0, tone: "text-rose-600" },
        ].map(({ label, value, tone }) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className={`font-display text-xl font-black tabular-nums ${tone}`}>{value}</p>
            <p className="mt-0.5 truncate text-[11.5px] font-bold text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Aksi massal */}
      <BulkGeneratePanel
        onFinish={() => void loadStatus(true)}
      />

      {/* Daftar bahasa */}
      <div className="rounded-2xl border border-slate-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <h3 className="text-[14px] font-black text-slate-900">
            Daftar Bahasa <span className="text-slate-400">· {filtered.length}</span>
          </h3>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={tr(lang, "ui.search")}
              className="h-9 w-56 rounded-full border border-slate-300 bg-white pl-9 pr-3 text-[12.5px] outline-none focus:border-violet-500"
            />
          </div>
        </div>

        {loading && !status ? (
          <p className="flex items-center gap-2 px-5 py-8 text-[13px] font-semibold text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin text-violet-600" aria-hidden="true" />
            Memuat 195 bahasa…
          </p>
        ) : (
          <ul className="max-h-[420px] divide-y divide-slate-100 overflow-y-auto [scrollbar-width:thin]">
            {filtered.map((r) => (
              <li key={r.code}>
                <button
                  type="button"
                  onClick={() => setSelected(r.code)}
                  className={`flex w-full items-center gap-3 px-5 py-2.5 text-left transition-colors hover:bg-violet-600/5 ${
                    selected === r.code ? "bg-violet-600/10" : ""
                  }`}
                >
                  <span className="text-base leading-none" aria-hidden="true">{r.flag}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-bold text-slate-800">
                      {r.native}
                      {r.rtl && <span className="ml-1.5 rounded bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-black text-amber-600">RTL</span>}
                    </span>
                    <span className="block truncate text-[11px] text-slate-400">
                      {r.name} · {r.code} · {r.region}
                    </span>
                  </span>
                  <span className="hidden w-32 sm:block">
                    <span className="flex items-center gap-2">
                      <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200">
                        <span
                          className={`block h-full rounded-full ${r.complete ? "bg-emerald-500" : r.present ? "bg-amber-500" : "bg-slate-300"}`}
                          style={{ width: `${Math.round((r.keys / (status?.expected || 1)) * 100)}%` }}
                        />
                      </span>
                      <span className="w-8 text-right text-[10.5px] font-black tabular-nums text-slate-500">
                        {r.keys}/{status?.expected ?? 0}
                      </span>
                    </span>
                  </span>
                  <span className="w-14 shrink-0 text-right">
                    <span className={`rounded-full px-2 py-0.5 text-[9.5px] font-black ${
                      r.core
                        ? "bg-emerald-500/15 text-emerald-700"
                        : r.complete
                          ? "bg-violet-500/10 text-violet-600"
                          : "bg-slate-100 text-slate-500"
                    }`}>
                      {r.core ? "⭐ native" : r.complete ? "🤖 AI" : r.present ? "parsial" : "kosong"}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Editor bahasa terpilih */}
      {selected && (
        <LanguageEditor
          code={selected}
          expected={status?.expected ?? 0}
          onClose={() => setSelected(null)}
          onChanged={() => void loadStatus(true)}
        />
      )}
    </div>
  );
}

/* ── Panel isi massal (AI) ─────────────────────────────────────────────── */

function BulkGeneratePanel({ onFinish }: { onFinish: () => void }) {
  const [lang] = useLang();
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number; current: string }>({ done: 0, total: 0, current: "" });
  const cancelRef = useRef(false);

  const jalankan = async () => {
    if (running) return;
    if (!window.confirm("AI akan menerjemahkan semua bahasa yang belum lengkap (berurutan, bisa memakan waktu puluhan menit). Lanjutkan?")) return;
    setRunning(true);
    cancelRef.current = false;
    try {
      const res = await fetch("/api/i18n/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ list: true }),
      });
      const json = (await res.json()) as { ok: boolean; missing?: { code: string }[] };
      const missing = json.missing ?? [];
      setProgress({ done: 0, total: missing.length, current: "" });
      for (let i = 0; i < missing.length; i++) {
        if (cancelRef.current) break;
        const code = missing[i].code;
        setProgress({ done: i, total: missing.length, current: code });
        try {
          await fetch("/api/i18n/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code }),
          });
          reloadLocale(code);
        } catch {
          /* lanjut bahasa berikutnya */
        }
      }
      setProgress((p) => ({ ...p, done: p.total }));
      onFinish();
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-violet-200 bg-violet-600/5 px-5 py-4">
      <div className="min-w-0">
        <p className="flex items-center gap-2 text-[13px] font-black text-violet-700">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          {tr(lang, "lang.generateAll")}
        </p>
        {running && (
          <p className="mt-1 text-[12px] font-semibold text-violet-600">
            {progress.done}/{progress.total}
            {progress.current ? ` — ${langMeta(progress.current)?.flag ?? ""} ${langMeta(progress.current)?.native ?? progress.current}` : ""}
            {" · "}
            {tr(lang, "lang.generating")}
          </p>
        )}
      </div>
      <div className="flex gap-2">
        {running ? (
          <button
            type="button"
            onClick={() => (cancelRef.current = true)}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-rose-300 bg-white px-4 text-[12px] font-bold text-rose-600 hover:bg-rose-50"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
            Hentikan
          </button>
        ) : (
          <button
            type="button"
            onClick={() => void jalankan()}
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-violet-600 px-4 text-[12px] font-bold text-white transition-transform hover:scale-[1.03] active:scale-95"
          >
            <Bot className="h-3.5 w-3.5" aria-hidden="true" />
            {tr(lang, "lang.generateAi")}
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Editor satu bahasa ────────────────────────────────────────────────── */

function LanguageEditor({
  code,
  expected,
  onClose,
  onChanged,
}: {
  code: string;
  expected: number;
  onClose: () => void;
  onChanged: () => void;
}) {
  const [lang] = useLang();
  const meta = langMeta(code);
  const [values, setValues] = useState<Dict>({});
  const [overrides, setOverrides] = useState<Dict>({});
  const [keys, setKeys] = useState<string[]>([]);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [genBusy, setGenBusy] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);

  const muat = useCallback(async () => {
    try {
      const [locRes, ovRes] = await Promise.all([
        fetch(`/api/i18n/locales?code=${encodeURIComponent(code)}`, { cache: "no-store" }),
        fetch(`/api/i18n/overrides?lang=${encodeURIComponent(code)}`, { cache: "no-store" }),
      ]);
      const loc = (await locRes.json()) as { ok: boolean; data?: Dict };
      const ov = (await ovRes.json()) as { ok: boolean; data?: Dict };
      const merged: Dict = {};
      // Kunci kanonik dari en (sumber kunci) — nilai tampil: merged file+override.
      const enRes = await fetch("/api/i18n/locales?code=en", { cache: "no-store" });
      const enJson = (await enRes.json()) as { ok: boolean; data?: Dict };
      const enKeys = Object.keys(enJson.data ?? {});
      setKeys(enKeys);
      for (const k of enKeys) merged[k] = loc.data?.[k] ?? "";
      setValues(merged);
      setOverrides(ov.data ?? {});
    } catch {
      /* diam */
    }
  }, [code]);

  useEffect(() => {
    void muat();
  }, [muat]);

  const simpan = async (key: string) => {
    setSavingKey(key);
    try {
      const res = await fetch("/api/i18n/overrides", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lang: code, key, value: values[key] }),
      });
      if (res.ok) {
        setOverrides((o) => ({ ...o, [key]: values[key] }));
        reloadLocale(code);
        setFlash(tr(lang, "ui.saved"));
        window.setTimeout(() => setFlash(null), 1800);
      }
    } finally {
      setSavingKey(null);
    }
  };

  const resetKey = async (key: string) => {
    setSavingKey(key);
    try {
      const res = await fetch(
        `/api/i18n/overrides?lang=${encodeURIComponent(code)}&key=${encodeURIComponent(key)}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        setOverrides((o) => {
          const n = { ...o };
          delete n[key];
          return n;
        });
        reloadLocale(code);
      }
    } finally {
      setSavingKey(null);
    }
  };

  const generate = async () => {
    setGenBusy(true);
    try {
      const res = await fetch("/api/i18n/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const json = (await res.json()) as { ok: boolean };
      if (json.ok) {
        reloadLocale(code);
        onChanged();
        await muat();
        setFlash(tr(lang, "lang.generateAi") + " ✓");
        window.setTimeout(() => setFlash(null), 2200);
      }
    } finally {
      setGenBusy(false);
    }
  };

  const ekspor = async () => {
    try {
      const res = await fetch(`/api/i18n/locales?code=${encodeURIComponent(code)}`, { cache: "no-store" });
      const json = (await res.json()) as { data?: Dict };
      const blob = new Blob([JSON.stringify(json.data ?? {}, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `gunara-${code}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      /* diam */
    }
  };

  if (!meta) return null;
  const terisi = keys.filter((k) => (values[k] ?? "").trim()).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-slate-200 bg-white"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl leading-none" aria-hidden="true">{meta.flag}</span>
          <div>
            <h3 className="text-[15px] font-black text-slate-900">
              {meta.native}
              {meta.rtl && <span className="ml-2 rounded bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-black text-amber-600">RTL</span>}
            </h3>
            <p className="text-[11.5px] text-slate-400">
              {meta.name} · {meta.code} · {terisi}/{expected} {tr(lang, "lang.coverage").toLowerCase()} ·{" "}
              {Object.keys(overrides).length} override
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void generate()}
            disabled={genBusy}
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-violet-600 px-4 text-[12px] font-bold text-white transition-transform hover:scale-[1.03] active:scale-95 disabled:opacity-50"
          >
            {genBusy ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> : <Bot className="h-3.5 w-3.5" aria-hidden="true" />}
            {genBusy ? tr(lang, "lang.generating") : tr(lang, "lang.generateAi")}
          </button>
          <button
            type="button"
            onClick={() => void ekspor()}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-slate-300 bg-white px-3.5 text-[12px] font-bold text-slate-600 hover:border-violet-400 hover:text-violet-600"
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            {tr(lang, "lang.export")}
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup editor"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-slate-500 hover:bg-slate-50"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {flash && (
        <p className="mx-5 mt-3 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-[12px] font-bold text-emerald-700" role="status">
          {flash}
        </p>
      )}
      <p className="px-5 pt-3 text-[11.5px] text-slate-400">{tr(lang, "lang.overrideHint")}</p>

      <ul className="max-h-[420px] divide-y divide-slate-100 overflow-y-auto px-5 py-2 [scrollbar-width:thin]">
        {keys.map((k) => {
          const isOverride = overrides[k] !== undefined && overrides[k] === values[k];
          return (
            <li key={k} className="py-2.5">
              <div className="mb-1 flex items-center gap-2">
                <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10.5px] font-bold text-slate-500">{k}</code>
                {isOverride && (
                  <span className="rounded bg-rose-500/10 px-1.5 py-0.5 text-[9px] font-black text-rose-600">override</span>
                )}
              </div>
              <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center">
                <span className="hidden w-56 shrink-0 truncate text-[11.5px] text-slate-400 sm:block" title={tr("id", k)}>
                  🇮🇩 {tr("id", k)}
                </span>
                <div className="flex min-w-0 flex-1 items-center gap-1.5">
                  <input
                    dir={meta.rtl ? "rtl" : "ltr"}
                    value={values[k] ?? ""}
                    onChange={(e) => setValues((v) => ({ ...v, [k]: e.target.value }))}
                    className="h-9 min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-2.5 text-[12.5px] outline-none focus:border-violet-500"
                  />
                  <button
                    type="button"
                    onClick={() => void simpan(k)}
                    disabled={savingKey === k || (values[k] ?? "") === (overrides[k] ?? "")}
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-600 text-white transition-opacity disabled:opacity-30"
                    aria-label="Simpan"
                  >
                    {savingKey === k ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> : <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                  </button>
                  {overrides[k] !== undefined && (
                    <button
                      type="button"
                      onClick={() => void resetKey(k)}
                      disabled={savingKey === k}
                      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-300 text-slate-500 hover:bg-slate-50"
                      aria-label="Kembalikan asli"
                    >
                      <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
}
