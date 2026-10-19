"use client";

/**
 * Portal Extras — komponen bersama fitur ekosistem untuk Portal Karyawan
 * dan Portal Client: badge tier, panel aktivasi God Mode, tab Dokumen
 * (unggah/unduh/hapus + kuota tier), serta tab Laporan PDF & Notifikasi WA.
 *
 * Semua komponen menarik datanya sendiri dari /api/documents & /api/wa
 * sehingga halaman portal cukup memasang tanpa menyalurkan state tambahan.
 */

import { motion } from "framer-motion";
import {
  AlertCircle,
  BadgeCheck,
  ChevronDown,
  CircleCheckBig,
  Crown,
  Download,
  FileText,
  FileUp,
  Info,
  KeyRound,
  LifeBuoy,
  Loader2,
  MessageCircle,
  MessageSquare,
  Paperclip,
  Plus,
  Send,
  ShieldCheck,
  Sparkles,
  Trash2,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { ActionBtn, Field, Flash, PortalCard, fmtDateTime, inputClass } from "@/components/site/portal-ui";
import { COMPANY_WA_LABEL } from "@/lib/wa-const";

/* ── Tipe data API ──────────────────────────────────────────────────────── */

export interface DocItem {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;
  projectId: string | null;
  projectRef: string | null;
  visibility: string;
  uploaderId: string;
  uploaderName: string;
  uploaderRole: string;
  note: string | null;
  createdAt: string;
}

export interface WaItemLite {
  id: string;
  toName: string | null;
  toRole: string;
  event: string;
  message: string;
  status: string;
  link: string | null;
  createdAt: string;
}

export interface TierInfoLite {
  tier: string;
  label: string;
  quotaDokumen: number | null;
  dokumenTerpakai: number;
  dokumenSisa: number | null;
  laporanPdf: boolean;
  seksiEksekutif: boolean;
  blastWa: boolean;
  perkawanan: string[];
}

export interface ProjectLite {
  id: string;
  refCode: string;
  title: string;
}

/** Kuota dokumen persis seperti respons /api/documents. */
interface QuotaApi {
  tier: string;
  terpakai: number;
  sisa: number | null;
  maks: number | null;
}

/* ── Util ───────────────────────────────────────────────────────────────── */

function ukuran(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const EVENT_LABEL: Record<string, string> = {
  proyek_status: "Status Proyek",
  proyek_baru: "Proyek Baru",
  pengumuman: "Pengumuman",
  dokumen: "Dokumen",
  tier: "Tier / God Mode",
  laporan: "Laporan PDF",
  manual: "Pesan Manual",
};

const EKSTENSI_WARNA: Record<string, string> = {
  pdf: "bg-rose-500/10 text-rose-700",
  doc: "bg-sky-500/10 text-sky-700",
  docx: "bg-sky-500/10 text-sky-700",
  xls: "bg-emerald-500/10 text-emerald-700",
  xlsx: "bg-emerald-500/10 text-emerald-700",
  csv: "bg-emerald-500/10 text-emerald-700",
  png: "bg-violet-500/10 text-violet-700",
  jpg: "bg-violet-500/10 text-violet-700",
  jpeg: "bg-violet-500/10 text-violet-700",
  zip: "bg-amber-500/10 text-amber-700",
  rar: "bg-amber-500/10 text-amber-700",
};

/* ── TierBadge ──────────────────────────────────────────────────────────── */

const TIER_BADGE_CLASS: Record<string, string> = {
  STANDARD: "bg-slate-500/10 text-slate-600 border-slate-300",
  PRO: "bg-sky-500/10 text-sky-700 border-sky-300",
  ELITE: "bg-amber-500/10 text-amber-700 border-amber-300",
  GOD: "border-fuchsia-300 bg-gradient-to-r from-rose-500/15 via-fuchsia-500/15 to-violet-500/15 text-fuchsia-700",
};
const TIER_LABEL: Record<string, string> = {
  STANDARD: "Standard",
  PRO: "Pro",
  ELITE: "Elite",
  GOD: "GOD MODE",
};

export function TierBadge({ tier, glow = true }: { tier: string; glow?: boolean }) {
  const cls = TIER_BADGE_CLASS[tier] ?? TIER_BADGE_CLASS.STANDARD;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10.5px] font-black uppercase tracking-wide ${cls} ${tier === "GOD" && glow ? "shadow-[0_0_18px_-4px_rgba(217,70,239,0.6)]" : ""}`}
    >
      {tier === "GOD" ? <Crown className="h-3 w-3" aria-hidden="true" /> : <ShieldCheck className="h-3 w-3" aria-hidden="true" />}
      {TIER_LABEL[tier] ?? tier}
    </span>
  );
}

/* ── Panel aktivasi kode tier (God Mode) ────────────────────────────────── */

const TANGGA_TIER: { t: string; desc: string }[] = [
  { t: "STANDARD", desc: "5 dokumen · dashboard penuh" },
  { t: "PRO", desc: "25 dokumen · laporan PDF" },
  { t: "ELITE", desc: "100 dokumen · blast WA" },
  { t: "GOD", desc: "Tak terbatas · laporan eksekutif · semua terbuka" },
];

export function TierActivatePanel({
  tier,
  onActivated,
}: {
  tier: string;
  onActivated: () => void | Promise<boolean>;
}) {
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!code.trim() || busy) return;
    setBusy(true);
    setErr(null);
    setFlash(null);
    try {
      const res = await fetch("/api/tiers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });
      const json = (await res.json()) as { ok: boolean; error?: string; message?: string; tier?: string };
      if (json.ok) {
        setFlash(json.message ?? "Tier berhasil diaktifkan.");
        setCode("");
        await onActivated();
      } else {
        setErr(json.error ?? "Kode tidak valid.");
      }
    } catch {
      setErr("Sinyal terputus. Coba sekali lagi.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <PortalCard title="Aktivasi Tier / GOD MODE" icon={Zap}>
      <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr]">
        <form onSubmit={submit} className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <Field label="Kode aktivasi dari CEO">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="GUNARA-GOD-XXXX-XXXX"
              aria-label="Kode aktivasi tier"
              autoComplete="off"
              spellCheck={false}
              className={`${inputClass} font-mono uppercase tracking-wider`}
            />
          </Field>
          <button
            type="submit"
            disabled={!code.trim() || busy}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 via-fuchsia-600 to-violet-600 text-sm font-bold text-white shadow-[0_10px_30px_-10px_rgba(217,70,239,0.6)] transition-transform hover:scale-[1.01] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <KeyRound className="h-4 w-4" aria-hidden="true" />}
            {busy ? "Memverifikasi…" : "Aktifkan Tier"}
          </button>
          {flash && <Flash msg={flash} />}
          {err && (
            <p role="alert" className="flex items-start gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-[12.5px] font-semibold text-rose-700">
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {err}
            </p>
          )}
          <p className="text-[11.5px] leading-relaxed text-slate-500">
            Kode berformat <code className="rounded bg-white px-1 py-0.5 font-mono text-[11px]">GUNARA-TIER-XXXX-XXXX</code>,
            sekali pakai, diterbitkan CEO lewat Panel CEO → Ekosistem. Tier lebih tinggi menggantikan tier lama.
          </p>
        </form>

        <div className="rounded-xl border border-slate-200 p-4">
          <p className="text-[12px] font-black uppercase tracking-wide text-slate-500">Tangga Tier GUNARA</p>
          <ol className="mt-3 space-y-2">
            {TANGGA_TIER.map(({ t, desc }) => {
              const active = t === tier;
              return (
                <li
                  key={t}
                  className={`flex items-center gap-3 rounded-xl border px-3.5 py-2.5 transition-all ${
                    active
                      ? t === "GOD"
                        ? "border-fuchsia-300 bg-gradient-to-r from-rose-500/10 via-fuchsia-500/10 to-violet-500/10"
                        : "border-violet-300 bg-violet-600/5"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  {active ? (
                    <BadgeCheck className={`h-4 w-4 shrink-0 ${t === "GOD" ? "text-fuchsia-600" : "text-violet-600"}`} aria-hidden="true" />
                  ) : (
                    <span className="h-4 w-4 shrink-0 rounded-full border-2 border-slate-300" aria-hidden="true" />
                  )}
                  <div className="min-w-0">
                    <p className="text-[13px] font-black text-slate-800">
                      {TIER_LABEL[t]}
                      {t === "GOD" && <span className="ml-1.5 text-[10px] font-black uppercase text-fuchsia-600">tier maks</span>}
                    </p>
                    <p className="text-[11.5px] text-slate-500">{desc}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </PortalCard>
  );
}

/* ── Tab Dokumen ────────────────────────────────────────────────────────── */

export function DokumenTab({
  projects,
  tierInfo,
  onTierChanged,
  notify,
}: {
  projects: ProjectLite[];
  tierInfo: TierInfoLite | null;
  onTierChanged: () => void | Promise<boolean>;
  notify: (m: string) => void;
}) {
  const [items, setItems] = useState<DocItem[] | null>(null);
  const [quota, setQuota] = useState<TierInfoLite | null>(tierInfo);
  const [busy, setBusy] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [projectId, setProjectId] = useState("");
  const [visibility, setVisibility] = useState("semua");
  const [note, setNote] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/documents", { cache: "no-store" });
      if (!res.ok) {
        setItems([]);
        return;
      }
      const json = (await res.json()) as { ok: boolean; items: DocItem[]; quota: QuotaApi | null };
      setItems(json.items ?? []);
      if (json.quota) {
        setQuota({
          tier: json.quota.tier,
          label: TIER_LABEL[json.quota.tier] ?? json.quota.tier,
          quotaDokumen: json.quota.maks,
          dokumenTerpakai: json.quota.terpakai,
          dokumenSisa: json.quota.sisa,
          laporanPdf: false,
          seksiEksekutif: false,
          blastWa: false,
          perkawanan: [],
        });
      }
    } catch {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(t);
  }, [load]);

  useEffect(() => {
    if (tierInfo) setQuota(tierInfo);
  }, [tierInfo]);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!file || busy) return;
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      if (projectId) fd.append("projectId", projectId);
      fd.append("visibility", visibility);
      if (note.trim()) fd.append("note", note.trim());
      const res = await fetch("/api/documents/upload", { method: "POST", body: fd });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (json.ok) {
        notify(`Dokumen "${file.name}" berhasil diunggah — notifikasi WA dikirim ke pihak terkait.`);
        setFile(null);
        setNote("");
        if (inputRef.current) inputRef.current.value = "";
        await load();
        await onTierChanged();
      } else {
        notify(json.error ?? "Gagal mengunggah dokumen.");
      }
    } catch {
      notify("Sinyal terputus. Coba sekali lagi.");
    } finally {
      setBusy(false);
    }
  }

  async function hapus(id: string) {
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/documents?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      const json = (await res.json()) as { ok: boolean; error?: string };
      notify(json.ok ? "Dokumen dihapus." : json.error ?? "Gagal menghapus.");
      await load();
    } catch {
      notify("Sinyal terputus. Coba sekali lagi.");
    } finally {
      setBusy(false);
    }
  }

  const pctKuota =
    quota?.quotaDokumen != null ? Math.min(100, Math.round((quota.dokumenTerpakai / quota.quotaDokumen) * 100)) : 0;

  return (
    <div className="space-y-5">
      <PortalCard title="Unggah Dokumen" icon={FileUp}>
        <form onSubmit={submit} className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-3">
            <label className="block">
              <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wide text-slate-500">Berkas (maks 10 MB)</span>
              <input
                ref={inputRef}
                type="file"
                required
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="h-11 w-full cursor-pointer rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3.5 py-2.5 text-[13px] text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-violet-600/10 file:px-3 file:py-1.5 file:text-[12px] file:font-bold file:text-violet-700 hover:border-violet-400"
                aria-label="Pilih berkas dokumen"
              />
            </label>
            <Field label="Kaitkan ke proyek (opsional)">
              <select value={projectId} onChange={(e) => setProjectId(e.target.value)} className={inputClass} aria-label="Proyek terkait">
                <option value="">— Tanpa proyek —</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.refCode} · {p.title}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <div className="space-y-3">
            <Field label="Visibilitas">
              <select value={visibility} onChange={(e) => setVisibility(e.target.value)} className={inputClass} aria-label="Visibilitas dokumen">
                <option value="semua">Semua pihak (karyawan + client)</option>
                <option value="karyawan">Tim karyawan saja</option>
                <option value="client">Client saja</option>
              </select>
            </Field>
            <Field label="Catatan (opsional)">
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Contoh: dokumen akta pendirian revisi 2"
                maxLength={300}
                className={inputClass}
                aria-label="Catatan dokumen"
              />
            </Field>
          </div>
          <div className="lg:col-span-2 flex flex-wrap items-center justify-between gap-3">
            {/* Kuota tier */}
            <div className="min-w-[220px] flex-1">
              <div className="flex items-center justify-between text-[11.5px] font-bold text-slate-600">
                <span className="inline-flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-violet-600" aria-hidden="true" />
                  Kuota {quota ? TIER_LABEL[quota.tier] ?? quota.tier : "Standard"}
                </span>
                <span className="tabular-nums">
                  {quota?.quotaDokumen != null ? `${quota.dokumenTerpakai}/${quota.quotaDokumen} terpakai` : `${quota?.dokumenTerpakai ?? 0} terpakai · tak terbatas`}
                </span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${quota?.quotaDokumen == null ? "bg-gradient-to-r from-rose-500 via-fuchsia-600 to-violet-600" : pctKuota >= 100 ? "bg-rose-500" : "bg-gradient-to-r from-violet-600 to-blue-600"}`}
                  style={{ width: quota?.quotaDokumen == null ? "100%" : `${pctKuota}%` }}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={!file || busy}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-6 text-sm font-bold text-white shadow-[0_10px_30px_-10px_rgba(139,92,246,0.55)] transition-transform hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Paperclip className="h-4 w-4" aria-hidden="true" />}
              {busy ? "Mengunggah…" : "Unggah Dokumen"}
            </button>
          </div>
        </form>
      </PortalCard>

      <PortalCard
        title="Arsip Dokumen"
        icon={FileText}
        action={
          <span className="text-[12px] font-bold text-slate-500">
            {items ? `${items.length} dokumen` : "memuat…"}
          </span>
        }
      >
        {items === null ? (
          <p className="flex items-center gap-2 py-6 text-center text-[13px] text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin text-violet-600" aria-hidden="true" /> Memuat arsip…
          </p>
        ) : items.length === 0 ? (
          <p className="py-6 text-center text-[13.5px] text-slate-500">
            Belum ada dokumen. Unggah berkas pertama Anda — pihak terkait akan otomatis menerima notifikasi WhatsApp.
          </p>
        ) : (
          <ul className="max-h-[26rem] space-y-2.5 overflow-y-auto pr-1 [scrollbar-width:thin]">
            {items.map((d) => {
              const ext = (d.originalName.split(".").pop() ?? "").toLowerCase();
              return (
                <motion.li
                  key={d.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3"
                >
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[10px] font-black uppercase ${EKSTENSI_WARNA[ext] ?? "bg-slate-500/10 text-slate-600"}`}>
                    {ext.slice(0, 4) || "file"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13.5px] font-bold text-slate-800">{d.originalName}</p>
                    <p className="text-[11.5px] text-slate-500">
                      {ukuran(d.size)}
                      {d.projectRef && <> · <span className="font-mono">{d.projectRef}</span></>}
                      {d.uploaderRole !== "admin" && <> · oleh {d.uploaderName}</>}
                      {d.uploaderRole === "admin" && <> · oleh CEO</>}
                      {" · "}
                      {fmtDateTime.format(new Date(d.createdAt))}
                      {d.visibility !== "semua" && <> · {d.visibility === "karyawan" ? "khusus tim" : "khusus client"}</>}
                    </p>
                    {d.note && <p className="mt-0.5 truncate text-[11.5px] italic text-slate-400">{d.note}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={`/api/documents/${d.id}/file?download=1`}
                      className="inline-flex h-9 items-center gap-1.5 rounded-full border border-violet-300 bg-violet-600/5 px-3.5 text-[12px] font-bold text-violet-700 transition-colors hover:bg-violet-600/10"
                    >
                      <Download className="h-3.5 w-3.5" aria-hidden="true" />
                      Unduh
                    </a>
                    {(d.uploaderRole !== "admin") && (
                      <button
                        type="button"
                        onClick={() => void hapus(d.id)}
                        disabled={busy}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-rose-200 text-rose-500 transition-colors hover:bg-rose-50 disabled:opacity-40"
                        aria-label={`Hapus ${d.originalName}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                </motion.li>
              );
            })}
          </ul>
        )}
      </PortalCard>
    </div>
  );
}

/* ── Tab Laporan PDF & WA ───────────────────────────────────────────────── */

export function LaporanWaTab({
  role,
  tier,
  notify,
}: {
  role: "karyawan" | "client";
  tier: string;
  notify: (m: string) => void;
}) {
  const [waItems, setWaItems] = useState<WaItemLite[] | null>(null);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [busyMsg, setBusyMsg] = useState(false);
  const [waFlash, setWaFlash] = useState<string | null>(null);
  const [waLinkUser, setWaLinkUser] = useState<string | null>(null);
  const bisaPdf = tier === "PRO" || tier === "ELITE" || tier === "GOD";
  const god = tier === "GOD";

  const loadWa = useCallback(async () => {
    try {
      const res = await fetch("/api/wa", { cache: "no-store" });
      if (!res.ok) {
        setWaItems([]);
        return;
      }
      const json = (await res.json()) as { ok: boolean; items: WaItemLite[] };
      setWaItems(json.items ?? []);
    } catch {
      setWaItems([]);
    }
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => void loadWa(), 0);
    return () => window.clearTimeout(t);
  }, [loadWa]);

  async function unduhPdf() {
    if (pdfBusy) return;
    setPdfBusy(true);
    try {
      const res = await fetch(`/api/reports/pdf?type=${role}`, { cache: "no-store" });
      if (!res.ok) {
        const json = (await res.json().catch(() => null)) as { error?: string } | null;
        notify(json?.error ?? "Gagal membuat laporan PDF.");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `GUNARA-Laporan-${role}-${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      notify("Laporan PDF berhasil dibuat dan diunduh.");
      await loadWa();
    } catch {
      notify("Sinyal terputus. Coba sekali lagi.");
    } finally {
      setPdfBusy(false);
    }
  }

  async function kirimKeAdmin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busyMsg || msg.trim().length < 5) return;
    setBusyMsg(true);
    setWaFlash(null);
    try {
      const res = await fetch("/api/wa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "hubungi-admin", message: msg.trim() }),
      });
      const json = (await res.json()) as { ok: boolean; error?: string; linkUser?: string };
      if (json.ok) {
        setMsg("");
        setWaFlash("Pesan tercatat & siap dikirim ke CEO via WhatsApp.");
        if (json.linkUser) setWaLinkUser(json.linkUser);
        await loadWa();
      } else {
        setWaFlash(json.error ?? "Gagal mengirim pesan.");
      }
    } catch {
      setWaFlash("Sinyal terputus. Coba sekali lagi.");
    } finally {
      setBusyMsg(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* Laporan PDF */}
      <PortalCard title="Laporan PDF" icon={FileText}>
        <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[14px] font-black text-slate-900">
                  {role === "karyawan" ? "Laporan Penugasan Saya" : "Laporan Layanan Saya"}
                </p>
                <p className="text-[12px] text-slate-500">
                  PDF resmi berkop GUNARA — statistik, rincian proyek, dokumen
                  {god && ", plus seksi analisis eksekutif GOD MODE"}.
                </p>
              </div>
              <button
                type="button"
                onClick={() => void unduhPdf()}
                disabled={pdfBusy || !bisaPdf}
                className={`inline-flex h-11 items-center gap-2 rounded-xl px-5 text-sm font-bold text-white transition-transform hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 ${
                  god
                    ? "bg-gradient-to-r from-rose-500 via-fuchsia-600 to-violet-600 shadow-[0_10px_30px_-10px_rgba(217,70,239,0.6)]"
                    : "bg-gradient-to-r from-violet-600 to-blue-600 shadow-[0_10px_30px_-10px_rgba(139,92,246,0.55)]"
                }`}
              >
                {pdfBusy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Download className="h-4 w-4" aria-hidden="true" />}
                {pdfBusy ? "Menyusun…" : "Unduh Laporan PDF"}
              </button>
            </div>
            {!bisaPdf && (
              <p className="mt-3 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-[12.5px] font-semibold text-amber-700">
                <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                Laporan PDF terbuka mulai tier PRO. Aktifkan kode tier di panel Aktivasi Tier untuk membukanya.
              </p>
            )}
            {god && (
              <p className="mt-3 flex items-start gap-2 rounded-xl border border-fuchsia-200 bg-fuchsia-50 px-3.5 py-2.5 text-[12.5px] font-semibold text-fuchsia-700">
                <Crown className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                GOD MODE aktif: laporan Anda memuat seksi eksekutif lengkap dengan analisis tier & portofolio.
              </p>
            )}
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-[12px] font-black uppercase tracking-wide text-slate-500">Isi laporan</p>
            <ul className="mt-2.5 space-y-1.5 text-[12.5px] text-slate-600">
              <li className="flex items-center gap-2"><BadgeCheck className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" /> Statistik pekerjaan & progres</li>
              <li className="flex items-center gap-2"><BadgeCheck className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" /> Rincian proyek + tenggat</li>
              <li className="flex items-center gap-2"><BadgeCheck className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" /> Riwayat dokumen & kolaborasi</li>
              {god && <li className="flex items-center gap-2"><Crown className="h-3.5 w-3.5 text-fuchsia-600" aria-hidden="true" /> Analisis eksekutif GOD MODE</li>}
            </ul>
          </div>
        </div>
      </PortalCard>

      {/* WA Center */}
      <PortalCard
        title="Notifikasi WhatsApp"
        icon={MessageCircle}
        action={
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" aria-hidden="true" />
            Kanal bisnis {COMPANY_WA_LABEL}
          </span>
        }
      >
        <form onSubmit={kirimKeAdmin} className="flex gap-2">
          <input
            type="text"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Tulis pesan untuk CEO/admin (minimal 5 karakter)…"
            aria-label="Pesan untuk CEO"
            maxLength={500}
            className={inputClass}
          />
          <button
            type="submit"
            disabled={busyMsg || msg.trim().length < 5}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white transition-transform hover:scale-105 active:scale-95 disabled:opacity-40"
            aria-label="Kirim pesan ke CEO"
          >
            {busyMsg ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Send className="h-4 w-4" aria-hidden="true" />}
          </button>
        </form>
        {waFlash && <div className="mt-3"><Flash msg={waFlash} /></div>}
        {waLinkUser && (
          <a
            href={waLinkUser}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-4 py-2 text-[12.5px] font-bold text-emerald-700 transition-colors hover:bg-emerald-100"
          >
            <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
            Buka WhatsApp untuk mengirim sekarang
          </a>
        )}

        <div className="mt-5">
          <p className="mb-2.5 text-[12px] font-black uppercase tracking-wide text-slate-500">Riwayat Notifikasi</p>
          {waItems === null ? (
            <p className="flex items-center gap-2 text-[13px] text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin text-violet-600" aria-hidden="true" /> Memuat riwayat…
            </p>
          ) : waItems.length === 0 ? (
            <p className="py-4 text-center text-[13px] text-slate-500">Belum ada notifikasi WhatsApp.</p>
          ) : (
            <ul className="max-h-72 space-y-2.5 overflow-y-auto pr-1 [scrollbar-width:thin]">
              {waItems.map((w) => (
                <li key={w.id} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="rounded-full bg-white px-2.5 py-0.5 text-[10.5px] font-black uppercase tracking-wide text-slate-600 ring-1 ring-slate-200">
                      {EVENT_LABEL[w.event] ?? w.event}
                    </span>
                    <span className="text-[11px] text-slate-400">{fmtDateTime.format(new Date(w.createdAt))}</span>
                  </div>
                  <p className="mt-1.5 whitespace-pre-line text-[12.5px] leading-relaxed text-slate-700">{w.message}</p>
                  {w.link && (
                    <a
                      href={w.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1.5 text-[12px] font-bold text-emerald-700 hover:underline"
                    >
                      <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                      Buka di WhatsApp {w.status === "sent" ? "(gateway — terkirim)" : ""}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </PortalCard>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   DUKUNGAN — Tiket support (dipakai Portal Karyawan & Portal Client)
   ══════════════════════════════════════════════════════════════════════════ */

export interface TicketLite {
  id: string;
  refCode: string;
  subject: string;
  body: string;
  category: string;
  priority: string;
  status: string;
  creatorName: string;
  creatorRole: string;
  assigneeName: string | null;
  createdAt: string;
  updatedAt: string;
  replies: { id: string; author: string; authorRole: string; message: string; createdAt: string }[];
}

const STATUS_TIKET_META: Record<string, { label: string; badge: string }> = {
  open: { label: "Terbuka", badge: "bg-rose-500/10 text-rose-700 border-rose-300" },
  diproses: { label: "Diproses", badge: "bg-amber-500/10 text-amber-700 border-amber-300" },
  selesai: { label: "Selesai", badge: "bg-emerald-600/10 text-emerald-700 border-emerald-300" },
  ditutup: { label: "Ditutup", badge: "bg-slate-500/10 text-slate-600 border-slate-300" },
};

const KATEGORI_LABEL: Record<string, string> = {
  umum: "Umum",
  proyek: "Proyek",
  tagihan: "Tagihan",
  teknis: "Teknis",
};

const ROLE_TONE_TIKET: Record<string, string> = {
  admin: "bg-slate-900 text-white",
  karyawan: "bg-violet-600/10 text-violet-700",
  client: "bg-sky-500/10 text-sky-700",
};

export function PortalDukunganTab({
  role,
  tickets,
  reload,
  notify,
}: {
  role: "karyawan" | "client";
  tickets: TicketLite[];
  reload: () => Promise<boolean>;
  notify: (m: string) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("umum");
  const [priority, setPriority] = useState("normal");
  const [busy, setBusy] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [balasan, setBalasan] = useState<Record<string, string>>({});

  async function post(payload: Record<string, unknown>, okMsg: string) {
    setBusy(true);
    try {
      const res = await fetch("/api/portal/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as { ok: boolean; error?: string; refCode?: string };
      if (json.ok) {
        notify(okMsg);
        await reload();
        return true;
      }
      notify(json.error ?? "Gagal.");
      return false;
    } catch {
      notify("Jaringan bermasalah.");
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function buatTiket(e: FormEvent) {
    e.preventDefault();
    const ok = await post(
      { action: "tiket", sub: "buat", subject, body, category, priority },
      `Tiket dibuat — CEO langsung menerima notifikasi WA`
    );
    if (ok) {
      setSubject("");
      setBody("");
      setCategory("umum");
      setPriority("normal");
      setShowForm(false);
    }
  }

  return (
    <div className="space-y-4">
      <PortalCard
        title={role === "client" ? "Butuh Bantuan? Buat Tiket" : "Tiket Dukungan"}
        icon={LifeBuoyIcon}
        action={<ActionBtn2 icon={showForm ? ChevronDownIcon : PlusIcon} label={showForm ? "Tutup Form" : "Tiket Baru"} onClick={() => setShowForm(!showForm)} />}
      >
        {showForm && (
          <form onSubmit={buatTiket} className="space-y-3">
            <Field label="Subjek tiket">
              <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Contoh: Permintaan revisi laporan" className={inputClass} />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Kategori">
                <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
                  <option value="umum">Umum</option>
                  <option value="proyek">Proyek</option>
                  <option value="tagihan">Tagihan</option>
                  <option value="teknis">Teknis</option>
                </select>
              </Field>
              <Field label="Prioritas">
                <select value={priority} onChange={(e) => setPriority(e.target.value)} className={inputClass}>
                  <option value="rendah">Rendah</option>
                  <option value="normal">Normal</option>
                  <option value="tinggi">Tinggi</option>
                  <option value="urgent">Urgent</option>
                </select>
              </Field>
            </div>
            <Field label="Uraian masalah / permintaan">
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={4}
                placeholder="Jelaskan detail kebutuhan Anda (minimal 10 karakter)…"
                className={`${inputClass} h-auto py-2.5`}
              />
            </Field>
            <ActionBtn2 icon={Send} label={busy ? "Mengirim…" : "Kirim Tiket"} tone="violet" disabled={busy} type="submit" />
          </form>
        )}
        {!showForm && (
          <p className="text-[12.5px] leading-relaxed text-slate-500">
            {role === "client"
              ? "Setiap tiket otomatis mengirim notifikasi WhatsApp ke CEO GUNARA. Pantau balasan tim di daftar tiket di bawah."
              : "Buat tiket untuk eskalasi kendala ke CEO, atau pantau tiket yang perlu Anda tangani."}
          </p>
        )}
      </PortalCard>

      {tickets.length === 0 ? (
        <PortalCard title="Tiket Anda" icon={MessageSquareIcon}>
          <p className="text-[13px] italic text-slate-400">Belum ada tiket dukungan.</p>
        </PortalCard>
      ) : (
        tickets.map((t) => {
          const st = STATUS_TIKET_META[t.status] ?? STATUS_TIKET_META.open;
          const open = openId === t.id;
          return (
            <div key={t.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_16px_-8px_rgba(15,23,42,0.12)]">
              <button
                type="button"
                onClick={() => setOpenId(open ? null : t.id)}
                className="flex w-full flex-wrap items-center gap-3 px-5 py-4 text-left"
                aria-expanded={open}
              >
                <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold ${st.badge}`}>{st.label}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] font-black text-slate-900">{t.subject}</span>
                  <span className="block text-[11.5px] text-slate-500">
                    {t.refCode} · {KATEGORI_LABEL[t.category] ?? t.category}
                    {t.assigneeName ? ` · ditangani ${t.assigneeName}` : ""}
                  </span>
                </span>
                <ChevronDownIcon className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
              </button>
              {open && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="border-t border-slate-100">
                  <div className="space-y-3 px-5 py-4">
                    <ol className="max-h-64 space-y-3 overflow-y-auto pr-1 [scrollbar-width:thin]">
                      {t.replies.map((r) => (
                        <li key={r.id} className="flex gap-3">
                          <span className={`mt-0.5 flex h-7 shrink-0 items-center rounded-full px-2.5 text-[10px] font-black uppercase ${ROLE_TONE_TIKET[r.authorRole] ?? "bg-slate-100 text-slate-600"}`}>
                            {r.authorRole === "admin" ? "CEO" : r.authorRole}
                          </span>
                          <div className="min-w-0">
                            <p className="whitespace-pre-wrap text-[13px] leading-snug text-slate-700">{r.message}</p>
                            <p className="mt-0.5 text-[11px] text-slate-400">{r.author} · {fmtDateTime.format(new Date(r.createdAt))}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                    {t.status !== "ditutup" && (
                      <div className="flex flex-wrap items-end gap-2 border-t border-slate-100 pt-3">
                        <div className="min-w-56 flex-1">
                          <Field label="Tulis balasan">
                            <textarea
                              value={balasan[t.id] ?? ""}
                              onChange={(e) => setBalasan((m) => ({ ...m, [t.id]: e.target.value }))}
                              rows={2}
                              placeholder="Tambahkan informasi…"
                              className={`${inputClass} h-auto py-2.5`}
                            />
                          </Field>
                        </div>
                        <ActionBtn2
                          icon={Send}
                          label="Kirim"
                          tone="violet"
                          disabled={busy || (balasan[t.id] ?? "").trim().length < 2}
                          onClick={() => {
                            void post({ action: "tiket", sub: "balas", ticketId: t.id, message: (balasan[t.id] ?? "").trim() }, "Balasan terkirim");
                            setBalasan((m) => ({ ...m, [t.id]: "" }));
                          }}
                        />
                        {(t.creatorRole === role ? t.status !== "selesai" : true) && (
                          <ActionBtn2
                            icon={CircleCheckIcon}
                            label={t.status === "selesai" ? "Buka Lagi" : "Selesaikan"}
                            tone={t.status === "selesai" ? "slate" : "emerald"}
                            disabled={busy}
                            onClick={() =>
                              void post(
                                { action: "tiket", sub: "status", ticketId: t.id, status: t.status === "selesai" ? "open" : "selesai" },
                                `Status ${t.refCode} diperbarui`
                              )
                            }
                          />
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   TAGIHAN — Invoice client (Portal Client saja)
   ══════════════════════════════════════════════════════════════════════════ */

export interface InvoiceLite {
  id: string;
  refCode: string;
  clientName: string;
  projectRef: string | null;
  items: { desc: string; qty: number; price: number }[];
  amount: number;
  status: string;
  dueDate: string | null;
  note: string | null;
  createdAt: string;
}

const INVOICE_STATUS_META: Record<string, { label: string; badge: string }> = {
  draft: { label: "Draft", badge: "bg-slate-500/10 text-slate-600 border-slate-300" },
  terkirim: { label: "Terkirim", badge: "bg-sky-500/10 text-sky-700 border-sky-300" },
  dibayar: { label: "Dibayar", badge: "bg-emerald-600/10 text-emerald-700 border-emerald-300" },
  batal: { label: "Batal", badge: "bg-rose-500/10 text-rose-700 border-rose-300" },
};

export function PortalTagihanTab({ invoices }: { invoices: InvoiceLite[] }) {
  const belum = invoices.filter((i) => i.status === "terkirim").reduce((a, i) => a + i.amount, 0);
  const dibayar = invoices.filter((i) => i.status === "dibayar").reduce((a, i) => a + i.amount, 0);
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-sky-200 bg-sky-50/60 p-4">
          <p className="text-[12px] font-bold uppercase tracking-wide text-sky-600">Belum dibayar</p>
          <p className="font-display text-xl font-black text-slate-900">Rp {new Intl.NumberFormat("id-ID").format(belum)}</p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
          <p className="text-[12px] font-bold uppercase tracking-wide text-emerald-600">Sudah dibayar</p>
          <p className="font-display text-xl font-black text-slate-900">Rp {new Intl.NumberFormat("id-ID").format(dibayar)}</p>
        </div>
      </div>

      {invoices.length === 0 ? (
        <PortalCard title="Invoice Anda" icon={FileTextIcon}>
          <p className="text-[13px] italic text-slate-400">Belum ada invoice yang diterbitkan untuk akun Anda.</p>
        </PortalCard>
      ) : (
        invoices.map((inv) => {
          const st = INVOICE_STATUS_META[inv.status] ?? INVOICE_STATUS_META.draft;
          return (
            <PortalCard key={inv.id} title={`${inv.refCode}${inv.projectRef ? ` · ${inv.projectRef}` : ""}`} icon={FileTextIcon}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold ${st.badge}`}>{st.label}</span>
                <span className="font-display text-lg font-black text-slate-900">
                  Rp {new Intl.NumberFormat("id-ID").format(inv.amount)}
                </span>
              </div>
              <ul className="mt-3 space-y-1 border-t border-slate-100 pt-3">
                {inv.items.map((it, i) => (
                  <li key={i} className="flex justify-between text-[12.5px] text-slate-600">
                    <span>
                      {it.desc} <span className="text-slate-400">× {it.qty}</span>
                    </span>
                    <span className="font-semibold">Rp {new Intl.NumberFormat("id-ID").format(Math.round(it.qty * it.price))}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-[11.5px] text-slate-400">
                Terbit {fmtDateTime.format(new Date(inv.createdAt))}
                {inv.dueDate ? ` · jatuh tempo ${new Date(inv.dueDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}` : ""}
              </p>
              {inv.note && <p className="mt-1 text-[12px] italic text-slate-500">Catatan: {inv.note}</p>}
              <div className="mt-3 border-t border-slate-100 pt-3">
                <a
                  href={`/api/reports/pdf?type=invoice&id=${inv.id}`}
                  className="inline-flex h-9 items-center gap-1.5 rounded-full border border-violet-300 bg-violet-600/5 px-3.5 text-[12px] font-bold text-violet-700 transition-all hover:bg-violet-600/10"
                >
                  <Download aria-hidden="true" className="h-3.5 w-3.5" />
                  Unduh PDF Invoice
                </a>
              </div>
            </PortalCard>
          );
        })
      )}
    </div>
  );
}

/* Ikon alias agar tidak bentuk import lama di berkas ini */
const LifeBuoyIcon = LifeBuoy;
const MessageSquareIcon = MessageSquare;
const PlusIcon = Plus;
const ChevronDownIcon = ChevronDown;
const CircleCheckIcon = CircleCheckBig;
const FileTextIcon = FileText;
const ActionBtn2 = ActionBtn;
