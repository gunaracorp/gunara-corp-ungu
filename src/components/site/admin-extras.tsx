"use client";

/**
 * Admin Ekosistem — tab Panel CEO untuk mengelola:
 * 1. Laporan PDF (ringkasan eksekutif perusahaan)
 * 2. WA Center — blast pengumuman, kirim manual, antrean wa.me, riwayat
 * 3. Kode Aktivasi Tier (PRO / ELITE / GOD MODE) + set tier langsung
 * 4. Arsip dokumen ekosistem
 *
 * Data ditarik dari /api/admin/team (sudah menyertakan tierCodes, waItems,
 * documents, stats) + /api/wa untuk aksi kirim.
 */

import { motion } from "framer-motion";
import {
  BadgeCheck,
  Check,
  Copy,
  Crown,
  DatabaseBackup,
  Download,
  FileText,
  FileUp,
  Loader2,
  MessageCircle,
  Plus,
  RefreshCw,
  Send,
  Sparkles,
  Trash2,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { ActionBtn, Field, PortalCard, fmtDateTime, inputClass } from "@/components/site/portal-ui";

/* ── Tipe ───────────────────────────────────────────────────────────────── */

interface TierCodeItem {
  id: string;
  code: string;
  tier: string;
  targetRole: string;
  note: string | null;
  usedById: string | null;
  usedByName: string | null;
  usedAt: string | null;
  createdAt: string;
}

interface WaAdminItem {
  id: string;
  toPhone: string | null;
  toName: string | null;
  toRole: string;
  event: string;
  message: string;
  status: string;
  channel: string;
  relatedRef: string | null;
  createdAt: string;
  sentAt: string | null;
}

interface DocAdminItem {
  id: string;
  originalName: string;
  size: number;
  projectRef: string | null;
  uploaderName: string;
  uploaderRole: string;
  visibility: string;
  createdAt: string;
}

interface PersonItem {
  id: string;
  name: string;
  tier: string;
  role: "karyawan" | "client";
  label: string;
}

interface EkosistemProps {
  tierCodes: TierCodeItem[];
  waItems: WaAdminItem[];
  documents: DocAdminItem[];
  employees: PersonItem[];
  stats: {
    tierCodesAktif: number;
    godAccounts: number;
    waQueued: number;
    waSent: number;
    documents: number;
  };
  reload: () => Promise<boolean>;
  notify: (m: string) => void;
}

const TIER_BADGE: Record<string, string> = {
  PRO: "bg-sky-500/10 text-sky-700 border-sky-300",
  ELITE: "bg-amber-500/10 text-amber-700 border-amber-300",
  GOD: "border-fuchsia-300 bg-gradient-to-r from-rose-500/10 via-fuchsia-500/10 to-violet-500/10 text-fuchsia-700",
};

const EVENT_LABEL: Record<string, string> = {
  proyek_status: "Status Proyek",
  proyek_baru: "Proyek Baru",
  pengumuman: "Pengumuman",
  dokumen: "Dokumen",
  tier: "Tier",
  laporan: "Laporan",
  manual: "Manual",
};

function ukuran(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/* ── Komponen utama ─────────────────────────────────────────────────────── */

export function AdminEkosistemTab({
  tierCodes,
  waItems,
  documents,
  employees,
  stats,
  reload,
  notify,
}: EkosistemProps) {
  const [sub, setSub] = useState<"wa" | "tier" | "dokumen" | "laporan" | "backup">("wa");
  const subs: { id: typeof sub; label: string; icon: typeof MessageCircle }[] = [
    { id: "wa", label: "WA Center", icon: MessageCircle },
    { id: "tier", label: "Kode Tier & GOD MODE", icon: Zap },
    { id: "dokumen", label: "Dokumen", icon: FileUp },
    { id: "laporan", label: "Laporan PDF", icon: FileText },
    { id: "backup", label: "Backup", icon: DatabaseBackup },
  ];

  return (
    <div className="space-y-5">
      {/* Kartu statistik */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <EcoStat label="Dokumen Ekosistem" value={stats.documents} hint="terarsip" icon={FileUp} />
        <EcoStat label="WA Antre" value={stats.waQueued} hint="menunggu kirim via wa.me" icon={MessageCircle} />
        <EcoStat label="WA Terkirim" value={stats.waSent} hint="terkonfirmasi" icon={Send} />
        <EcoStat label="Akun GOD MODE" value={stats.godAccounts} hint={`${stats.tierCodesAktif} kode tier aktif`} icon={Crown} accent />
      </div>

      {/* Navigasi sub-tab */}
      <nav className="flex flex-wrap gap-2" aria-label="Sub bagian ekosistem">
        {subs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setSub(id)}
            aria-current={sub === id}
            className={`inline-flex h-10 items-center gap-2 rounded-full px-4 text-[13px] font-bold transition-all ${
              sub === id
                ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-[0_10px_26px_-10px_rgba(13,148,136,0.55)]"
                : "border border-slate-300 bg-white text-slate-600 hover:border-violet-400 hover:text-violet-600"
            }`}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {label}
          </button>
        ))}
      </nav>

      {sub === "wa" && <WaCenter waItems={waItems} reload={reload} notify={notify} />}
      {sub === "tier" && <TierCenter tierCodes={tierCodes} employees={employees} reload={reload} notify={notify} />}
      {sub === "dokumen" && <DocCenter documents={documents} reload={reload} notify={notify} />}
      {sub === "laporan" && <LaporanCenter notify={notify} />}
      {sub === "backup" && <BackupCenter notify={notify} />}
    </div>
  );
}

function EcoStat({
  label,
  value,
  hint,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number;
  hint: string;
  icon: typeof MessageCircle;
  accent?: boolean;
}) {
  return (
    <div className={`rounded-2xl border bg-white p-5 shadow-[0_2px_16px_-8px_rgba(15,23,42,0.12)] ${accent ? "border-fuchsia-200" : "border-slate-200"}`}>
      <div className="flex items-center justify-between">
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent ? "bg-gradient-to-br from-rose-500/15 via-fuchsia-500/15 to-violet-500/15 text-fuchsia-600" : "bg-violet-600/10 text-violet-600"}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="font-display text-3xl font-black tabular-nums text-slate-900">{value}</span>
      </div>
      <p className="mt-3 text-[13px] font-bold text-slate-700">{label}</p>
      <p className="text-[12px] text-slate-500">{hint}</p>
    </div>
  );
}

/* ── WA Center ──────────────────────────────────────────────────────────── */

function WaCenter({ waItems, reload, notify }: { waItems: WaAdminItem[]; reload: () => Promise<boolean>; notify: (m: string) => void }) {
  const [audience, setAudience] = useState("karyawan");
  const [manualPhone, setManualPhone] = useState("");
  const [manualName, setManualName] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function kirim(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy || message.trim().length < 5) return;
    setBusy(true);
    try {
      const payload: Record<string, unknown> = { action: "kirim", audience, message: message.trim() };
      if (audience === "manual") {
        payload.manualPhone = manualPhone;
        payload.manualName = manualName;
      }
      const res = await fetch("/api/wa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as { ok: boolean; error?: string; jumlah?: number };
      if (json.ok) {
        notify(`Notifikasi WA masuk antrean untuk ${json.jumlah ?? 1} penerima.`);
        setMessage("");
        setManualPhone("");
        setManualName("");
        await reload();
      } else {
        notify(json.error ?? "Gagal mengirim notifikasi.");
      }
    } catch {
      notify("Sinyal terputus. Coba sekali lagi.");
    } finally {
      setBusy(false);
    }
  }

  async function aksi(id: string, action: "tandai-terkirim" | "hapus") {
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/wa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, id }),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      notify(json.ok ? (action === "hapus" ? "Notifikasi dihapus." : "Ditandai terkirim.") : json.error ?? "Gagal.");
      await reload();
    } catch {
      notify("Sinyal terputus. Coba sekali lagi.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-5">
      <PortalCard title="Kirim Notifikasi WhatsApp" icon={MessageCircle}>
        <form onSubmit={kirim} className="grid gap-4 lg:grid-cols-2">
          <Field label="Audiens">
            <select value={audience} onChange={(e) => setAudience(e.target.value)} className={inputClass} aria-label="Audiens blast WA">
              <option value="karyawan">Seluruh karyawan</option>
              <option value="client">Seluruh client</option>
              <option value="semua">Karyawan + client</option>
              <option value="manual">Nomor manual</option>
            </select>
          </Field>
          {audience === "manual" ? (
            <div className="grid grid-cols-2 gap-3">
              <Field label="Nomor WA">
                <input type="text" value={manualPhone} onChange={(e) => setManualPhone(e.target.value)} placeholder="0813… / 62813…" className={inputClass} aria-label="Nomor WhatsApp tujuan" />
              </Field>
              <Field label="Nama penerima">
                <input type="text" value={manualName} onChange={(e) => setManualName(e.target.value)} placeholder="Nama (opsional)" className={inputClass} aria-label="Nama penerima" />
              </Field>
            </div>
          ) : (
            <div className="flex items-end">
              <p className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[12.5px] leading-relaxed text-slate-600">
                Pesan diblast ke seluruh akun aktif audiens ini. Yang memiliki nomor tercatat mendapat tautan
                wa.me siap klik; pesan tanpa nomor tetap tercatat di antrean.
              </p>
            </div>
          )}
          <div className="lg:col-span-2">
            <Field label="Pesan (minimal 5 karakter)">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                maxLength={2000}
                placeholder="Contoh: Rapat evaluasi Q4 digeser ke Jumat 15.00. Hadir tepat waktu."
                className={`${inputClass} h-auto py-3`}
                aria-label="Isi pesan WhatsApp"
              />
            </Field>
          </div>
          <div className="lg:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={busy || message.trim().length < 5}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 text-sm font-bold text-white shadow-[0_10px_30px_-10px_rgba(16,185,129,0.5)] transition-transform hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Send className="h-4 w-4" aria-hidden="true" />}
              {busy ? "Memproses…" : "Kirim Notifikasi"}
            </button>
          </div>
        </form>
      </PortalCard>

      <PortalCard
        title="Antrean & Riwayat WA"
        icon={MessageCircle}
        action={<span className="text-[12px] font-bold text-slate-500">{waItems.length} entri</span>}
      >
        {waItems.length === 0 ? (
          <p className="py-6 text-center text-[13.5px] text-slate-500">Belum ada notifikasi WhatsApp.</p>
        ) : (
          <ul className="max-h-[28rem] space-y-2.5 overflow-y-auto pr-1 [scrollbar-width:thin]">
            {waItems.map((w) => (
              <motion.li
                key={w.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10.5px] font-black uppercase tracking-wide ${
                      w.status === "sent" ? "bg-emerald-500/10 text-emerald-700" : "bg-amber-500/10 text-amber-700"
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${w.status === "sent" ? "bg-emerald-500" : "animate-pulse bg-amber-500"}`} aria-hidden="true" />
                    {w.status === "sent" ? "Terkirim" : "Antre"}
                  </span>
                  <span className="rounded-full bg-white px-2.5 py-0.5 text-[10.5px] font-bold uppercase text-slate-500 ring-1 ring-slate-200">
                    {EVENT_LABEL[w.event] ?? w.event}
                  </span>
                  <span className="text-[11.5px] font-bold text-slate-700">
                    → {w.toName ?? "—"} <span className="font-normal text-slate-400">({w.toRole}{w.toPhone ? ` · +${w.toPhone.replace(/^62/, "62 ")}` : " · tanpa nomor"})</span>
                  </span>
                  <span className="ml-auto text-[11px] text-slate-400">{fmtDateTime.format(new Date(w.createdAt))}</span>
                </div>
                <p className="mt-1.5 whitespace-pre-line text-[12.5px] leading-relaxed text-slate-700">{w.message}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {w.status !== "sent" && w.toPhone && (
                    <a
                      href={`https://wa.me/${w.toPhone}?text=${encodeURIComponent(w.message)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-8 items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-3 text-[11.5px] font-bold text-emerald-700 hover:bg-emerald-100"
                    >
                      <MessageCircle className="h-3 w-3" aria-hidden="true" />
                      Kirim via wa.me
                    </a>
                  )}
                  {w.status !== "sent" && (
                    <ActionBtn icon={Check} label="Tandai Terkirim" tone="emerald" disabled={busy} onClick={() => void aksi(w.id, "tandai-terkirim")} />
                  )}
                  <ActionBtn icon={Trash2} label="Hapus" tone="rose" disabled={busy} onClick={() => void aksi(w.id, "hapus")} />
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </PortalCard>
    </div>
  );
}

/* ── Tier Center ────────────────────────────────────────────────────────── */

function TierCenter({
  tierCodes,
  employees,
  reload,
  notify,
}: {
  tierCodes: TierCodeItem[];
  employees: PersonItem[];
  reload: () => Promise<boolean>;
  notify: (m: string) => void;
}) {
  const [tier, setTier] = useState("PRO");
  const [targetRole, setTargetRole] = useState("semua");
  const [jumlah, setJumlah] = useState(1);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [baru, setBaru] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  // set-tier
  const [personId, setPersonId] = useState("");
  const [tierBaru, setTierBaru] = useState("PRO");

  async function buatKode(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "tier", action: "kode-create", data: { tier, targetRole, jumlah, note } }),
      });
      const json = (await res.json()) as { ok: boolean; error?: string; codes?: string[] };
      if (json.ok && json.codes) {
        setBaru(json.codes);
        notify(`${json.codes.length} kode tier ${tier} diterbitkan.`);
        await reload();
      } else {
        notify(json.error ?? "Gagal menerbitkan kode.");
      }
    } catch {
      notify("Sinyal terputus. Coba sekali lagi.");
    } finally {
      setBusy(false);
    }
  }

  async function hapusKode(id: string) {
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "tier", action: "kode-delete", data: { id } }),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      notify(json.ok ? "Kode dihapus." : json.error ?? "Gagal menghapus kode.");
      await reload();
    } catch {
      notify("Sinyal terputus. Coba sekali lagi.");
    } finally {
      setBusy(false);
    }
  }

  async function terapkanTier(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy || !personId) return;
    setBusy(true);
    try {
      const person = employees.find((p) => p.id === personId);
      const res = await fetch("/api/admin/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "tier",
          action: "set-tier",
          data: { id: personId, tier: tierBaru, targetKind: person?.role ?? "karyawan" },
        }),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (json.ok) {
        notify(`Tier ${person?.name ?? "akun"} diubah ke ${tierBaru}${tierBaru === "GOD" ? " — GOD MODE AKTIF" : ""}. Notifikasi WA dikirim.`);
        setPersonId("");
        await reload();
      } else {
        notify(json.error ?? "Gagal mengubah tier.");
      }
    } catch {
      notify("Sinyal terputus. Coba sekali lagi.");
    } finally {
      setBusy(false);
    }
  }

  function salin(code: string) {
    void navigator.clipboard?.writeText(code).then(() => {
      setCopied(code);
      window.setTimeout(() => setCopied(null), 1600);
    });
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-2">
        <PortalCard title="Terbitkan Kode Aktivasi Tier" icon={Sparkles}>
          <form onSubmit={buatKode} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Tier">
                <select value={tier} onChange={(e) => setTier(e.target.value)} className={inputClass} aria-label="Tier kode">
                  <option value="PRO">PRO</option>
                  <option value="ELITE">ELITE</option>
                  <option value="GOD">GOD — tier maks</option>
                </select>
              </Field>
              <Field label="Untuk peran">
                <select value={targetRole} onChange={(e) => setTargetRole(e.target.value)} className={inputClass} aria-label="Peran target kode">
                  <option value="semua">Semua (karyawan & client)</option>
                  <option value="karyawan">Karyawan</option>
                  <option value="client">Client</option>
                </select>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Jumlah (1–10)">
                <input type="number" min={1} max={10} value={jumlah} onChange={(e) => setJumlah(Number(e.target.value) || 1)} className={inputClass} aria-label="Jumlah kode" />
              </Field>
              <Field label="Catatan (opsional)">
                <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Untuk siapa?" className={inputClass} aria-label="Catatan kode" />
              </Field>
            </div>
            <button
              type="submit"
              disabled={busy}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-sm font-bold text-white transition-transform hover:scale-[1.01] active:scale-95 disabled:opacity-40"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Plus className="h-4 w-4" aria-hidden="true" />}
              Terbitkan Kode
            </button>
            {baru.length > 0 && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                <p className="text-[12px] font-black uppercase tracking-wide text-emerald-700">Kode baru — bagikan ke penerima</p>
                <ul className="mt-2 space-y-1.5">
                  {baru.map((c) => (
                    <li key={c} className="flex items-center justify-between gap-2 rounded-lg bg-white px-3 py-2">
                      <code className="font-mono text-[12.5px] font-bold text-slate-800">{c}</code>
                      <button type="button" onClick={() => salin(c)} className="inline-flex items-center gap-1 text-[11.5px] font-bold text-violet-700 hover:underline">
                        {copied === c ? <Check className="h-3 w-3 text-emerald-600" aria-hidden="true" /> : <Copy className="h-3 w-3" aria-hidden="true" />}
                        {copied === c ? "Tersalin" : "Salin"}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </form>
        </PortalCard>

        <PortalCard title="Set Tier Langsung" icon={Crown}>
          <form onSubmit={terapkanTier} className="space-y-3">
            <Field label="Pilih akun (karyawan / client)">
              <select value={personId} onChange={(e) => setPersonId(e.target.value)} className={inputClass} aria-label="Akun target tier">
                <option value="">— Pilih akun —</option>
                {employees.map((p) => (
                  <option key={p.id} value={p.id}>
                    [{p.role === "karyawan" ? "Karyawan" : "Client"}] {p.label} — saat ini {p.tier}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Tier baru">
              <select value={tierBaru} onChange={(e) => setTierBaru(e.target.value)} className={inputClass} aria-label="Tier baru">
                <option value="STANDARD">Standard</option>
                <option value="PRO">Pro</option>
                <option value="ELITE">Elite</option>
                <option value="GOD">GOD MODE — tier maks</option>
              </select>
            </Field>
            <button
              type="submit"
              disabled={busy || !personId}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 via-fuchsia-600 to-violet-600 text-sm font-bold text-white shadow-[0_10px_30px_-10px_rgba(217,70,239,0.55)] transition-transform hover:scale-[1.01] active:scale-95 disabled:opacity-40"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Crown className="h-4 w-4" aria-hidden="true" />}
              Terapkan Tier
            </button>
            <p className="text-[11.5px] leading-relaxed text-slate-500">
              Perubahan tier langsung memicu notifikasi WhatsApp ke akun tersebut. GOD MODE membuka
              dokumen tak terbatas, laporan eksekutif, dan blast WA.
            </p>
          </form>
        </PortalCard>
      </div>

      <PortalCard
        title="Daftar Kode Tier"
        icon={Zap}
        action={<span className="text-[12px] font-bold text-slate-500">{tierCodes.filter((t) => !t.usedAt).length} belum terpakai</span>}
      >
        {tierCodes.length === 0 ? (
          <p className="py-6 text-center text-[13.5px] text-slate-500">Belum ada kode aktivasi. Terbitkan kode pertama di atas.</p>
        ) : (
          <ul className="max-h-80 space-y-2 overflow-y-auto pr-1 [scrollbar-width:thin]">
            {tierCodes.map((t) => (
              <li key={t.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
                <span className={`rounded-full border px-2.5 py-1 text-[10.5px] font-black uppercase ${TIER_BADGE[t.tier] ?? TIER_BADGE.PRO}`}>{t.tier}</span>
                <code className="font-mono text-[12.5px] font-bold text-slate-800">{t.code}</code>
                <span className="text-[11.5px] text-slate-500">untuk {t.targetRole}{t.note ? ` · ${t.note}` : ""}</span>
                <span className="ml-auto">
                  {t.usedAt ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-500/10 px-2.5 py-1 text-[10.5px] font-bold text-slate-600">
                      <BadgeCheck className="h-3 w-3" aria-hidden="true" /> dipakai {t.usedByName ?? "—"}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10.5px] font-bold text-emerald-700">tersedia</span>
                      <ActionBtn icon={Copy} label="Salin" onClick={() => salin(t.code)} />
                      <ActionBtn icon={Trash2} label="Hapus" tone="rose" disabled={busy} onClick={() => void hapusKode(t.id)} />
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        )}
      </PortalCard>
    </div>
  );
}

/* ── Dokumen Center ─────────────────────────────────────────────────────── */

function DocCenter({ documents, reload, notify }: { documents: DocAdminItem[]; reload: () => Promise<boolean>; notify: (m: string) => void }) {
  const [busy, setBusy] = useState(false);

  async function hapus(id: string) {
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/documents?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      const json = (await res.json()) as { ok: boolean; error?: string };
      notify(json.ok ? "Dokumen dihapus." : json.error ?? "Gagal menghapus.");
      await reload();
    } catch {
      notify("Sinyal terputus. Coba sekali lagi.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <PortalCard
      title="Arsip Dokumen Ekosistem"
      icon={FileUp}
      action={<span className="text-[12px] font-bold text-slate-500">{documents.length} dokumen</span>}
    >
      {documents.length === 0 ? (
        <p className="py-6 text-center text-[13.5px] text-slate-500">
          Belum ada dokumen. Karyawan & client dapat mengunggah lewat portal masing-masing.
        </p>
      ) : (
        <ul className="max-h-[28rem] space-y-2.5 overflow-y-auto pr-1 [scrollbar-width:thin]">
          {documents.map((d) => (
            <li key={d.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
              <FileText className="h-5 w-5 shrink-0 text-violet-600" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13.5px] font-bold text-slate-800">{d.originalName}</p>
                <p className="text-[11.5px] text-slate-500">
                  {ukuran(d.size)}
                  {d.projectRef && <> · <span className="font-mono">{d.projectRef}</span></>}
                  {" · "}
                  oleh {d.uploaderRole === "admin" ? "CEO" : d.uploaderName} ({d.uploaderRole})
                  {" · "}
                  {fmtDateTime.format(new Date(d.createdAt))}
                  {d.visibility !== "semua" && <> · {d.visibility === "karyawan" ? "khusus tim" : "khusus client"}</>}
                </p>
              </div>
              <a
                href={`/api/documents/${d.id}/file?download=1`}
                className="inline-flex h-9 items-center gap-1.5 rounded-full border border-violet-300 bg-violet-600/5 px-3.5 text-[12px] font-bold text-violet-700 hover:bg-violet-600/10"
              >
                <Download className="h-3.5 w-3.5" aria-hidden="true" />
                Unduh
              </a>
              <ActionBtn icon={Trash2} label="Hapus" tone="rose" disabled={busy} onClick={() => void hapus(d.id)} />
            </li>
          ))}
        </ul>
      )}
    </PortalCard>
  );
}

/* ── Laporan PDF Center ─────────────────────────────────────────────────── */

function LaporanCenter({ notify }: { notify: (m: string) => void }) {
  const [busy, setBusy] = useState(false);

  async function unduh() {
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/reports/pdf?type=ringkasan", { cache: "no-store" });
      if (!res.ok) {
        const json = (await res.json().catch(() => null)) as { error?: string } | null;
        notify(json?.error ?? "Gagal membuat laporan.");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `GUNARA-Ringkasan-Eksekutif-${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      notify("Ringkasan eksekutif PDF berhasil diunduh.");
    } catch {
      notify("Sinyal terputus. Coba sekali lagi.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <PortalCard title="Laporan PDF Eksekutif" icon={FileText}>
      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-[15px] font-black text-slate-900">Ringkasan Eksekutif Perusahaan</p>
          <p className="mt-1 text-[12.5px] leading-relaxed text-slate-600">
            Laporan resmi berkop GUNARA CORPORATION: statistik portofolio proyek, tim & klien, aktivitas
            notifikasi WhatsApp, pengumuman terakhir, plus seksi <strong>analisis eksekutif GOD MODE</strong> —
            distribusi tier, rata-rata progres, dan rekomendasi strategis.
          </p>
          <button
            type="button"
            onClick={() => void unduh()}
            disabled={busy}
            className="mt-4 inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-6 text-sm font-bold text-white shadow-[0_10px_30px_-10px_rgba(13,148,136,0.55)] transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-40"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Download className="h-4 w-4" aria-hidden="true" />}
            {busy ? "Menyusun laporan…" : "Unduh Ringkasan Eksekutif (PDF)"}
          </button>
        </div>
        <div className="rounded-xl border border-fuchsia-200 bg-gradient-to-br from-rose-500/5 via-fuchsia-500/5 to-violet-500/5 p-5">
          <p className="flex items-center gap-2 text-[13px] font-black text-fuchsia-700">
            <Crown className="h-4 w-4" aria-hidden="true" /> GOD MODE BUILT-IN
          </p>
          <p className="mt-2 text-[12.5px] leading-relaxed text-slate-600">
            Panel CEO selalu berada di tier tertinggi: seluruh laporan memuat seksi eksekutif, tanpa kuota,
            tanpa batas. Karyawan & client membuka laporan masing-masing lewat kode tier (PRO ke atas) di
            portal mereka.
          </p>
          <ul className="mt-3 space-y-1.5 text-[12px] text-slate-600">
            <li className="flex items-center gap-2"><BadgeCheck className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" /> Karyawan: laporan penugasan</li>
            <li className="flex items-center gap-2"><BadgeCheck className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" /> Client: laporan layanan</li>
            <li className="flex items-center gap-2"><BadgeCheck className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" /> CEO: ringkasan eksekutif penuh</li>
          </ul>
        </div>
      </div>
    </PortalCard>
  );
}

/* ── Backup otomatis ────────────────────────────────────────────────────── */

interface BackupInfoUi {
  id: string;
  size: number;
  createdAt: string;
}
interface BackupStatusUi {
  enabled: boolean;
  intervalHours: number;
  keep: number;
  dir: string;
  count: number;
  lastRunAt: string | null;
  nextRunAt: string | null;
  lastError: string | null;
}

function ukuranBackup(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function BackupCenter({ notify }: { notify: (m: string) => void }) {
  const [status, setStatus] = useState<BackupStatusUi | null>(null);
  const [list, setList] = useState<BackupInfoUi[]>([]);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/backup", { cache: "no-store" });
      const json = (await res.json()) as { ok: boolean; status?: BackupStatusUi; backups?: BackupInfoUi[] };
      if (json.ok && json.status) {
        setStatus(json.status);
        setList(json.backups ?? []);
      }
    } catch {
      /* senyap */
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function buat() {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/backup", { method: "POST" });
      const json = (await res.json()) as { ok: boolean; error?: string; backup?: BackupInfoUi };
      if (json.ok && json.backup) {
        notify(`Backup dibuat: ${json.backup.id}`);
        await load();
      } else notify(json.error ?? "Backup gagal.");
    } catch {
      notify("Sinyal terputus. Coba sekali lagi.");
    } finally {
      setBusy(false);
    }
  }

  async function hapus(id: string) {
    if (!window.confirm(`Hapus arsip ${id}?`)) return;
    try {
      const res = await fetch(`/api/admin/backup?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (json.ok) {
        notify("Arsip dihapus.");
        await load();
      } else notify(json.error ?? "Hapus gagal.");
    } catch {
      notify("Sinyal terputus. Coba sekali lagi.");
    }
  }

  async function unduh(id: string) {
    try {
      const res = await fetch(`/api/admin/backup?id=${encodeURIComponent(id)}`);
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = id;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      notify("Arsip backup diunduh.");
    } catch {
      notify("Unduhan gagal. Coba sekali lagi.");
    }
  }

  return (
    <PortalCard title="Backup Otomatis" icon={DatabaseBackup}>
      <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-[15px] font-black text-slate-900">Status Scheduler</p>
          <dl className="mt-3 space-y-2 text-[12.5px]">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-slate-500">Kondisi</dt>
              <dd className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${status?.enabled ? "border-emerald-300 bg-emerald-50 text-emerald-700" : "border-slate-300 bg-white text-slate-500"}`}>
                {status ? (status.enabled ? `AKTIF · tiap ${status.intervalHours} jam` : "MATI") : "—"}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-slate-500">Retensi</dt>
              <dd className="font-bold text-slate-800">{status ? `${status.keep} arsip` : "—"}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-slate-500">Terakhir</dt>
              <dd className="font-bold text-slate-800">{status?.lastRunAt ? fmtDateTime.format(new Date(status.lastRunAt)) : "belum ada"}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-slate-500">Berikutnya</dt>
              <dd className="font-bold text-slate-800">{status?.nextRunAt ? fmtDateTime.format(new Date(status.nextRunAt)) : "—"}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-slate-500">Isi arsip</dt>
              <dd className="font-bold text-slate-800">database + uploads</dd>
            </div>
          </dl>
          {status?.lastError && (
            <p className="mt-3 rounded-lg border border-rose-200 bg-rose-50 p-2.5 text-[12px] font-semibold text-rose-700">
              Error terakhir: {status.lastError}
            </p>
          )}
          <button
            type="button"
            onClick={() => void buat()}
            disabled={busy}
            className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-6 text-sm font-bold text-white shadow-[0_10px_30px_-10px_rgba(13,148,136,0.55)] transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-40"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <DatabaseBackup className="h-4 w-4" aria-hidden="true" />}
            {busy ? "Menyusun arsip…" : "Buat Backup Sekarang"}
          </button>
          <p className="mt-3 text-[11.5px] leading-relaxed text-slate-500">
            Jadwal & retensi diatur lewat environment <code className="rounded bg-white px-1 py-0.5 font-mono text-[11px]">BACKUP_INTERVAL_HOURS</code> dan{" "}
            <code className="rounded bg-white px-1 py-0.5 font-mono text-[11px]">BACKUP_KEEP</code>.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-black text-slate-900">Arsip ({list.length})</p>
            <button
              type="button"
              onClick={() => void load()}
              className="inline-flex h-8 items-center gap-1.5 rounded-full border border-slate-300 px-3 text-[11.5px] font-semibold text-slate-600 transition-colors hover:border-violet-400 hover:text-violet-600"
            >
              <RefreshCw className="h-3 w-3" aria-hidden="true" /> Segarkan
            </button>
          </div>
          <div className="mt-3 max-h-72 space-y-2 overflow-y-auto pr-1">
            {list.length === 0 && (
              <p className="py-8 text-center text-[12.5px] text-slate-500">Belum ada arsip backup.</p>
            )}
            {list.map((b) => (
              <div key={b.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5">
                <div className="min-w-0">
                  <p className="truncate font-mono text-[12px] font-bold text-slate-800">{b.id}</p>
                  <p className="text-[11px] text-slate-500">
                    {ukuranBackup(b.size)} · {fmtDateTime.format(new Date(b.createdAt))}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => void unduh(b.id)}
                    className="inline-flex h-8 items-center gap-1 rounded-full border border-slate-300 bg-white px-3 text-[11.5px] font-semibold text-slate-700 transition-colors hover:border-violet-400 hover:text-violet-600"
                  >
                    <Download className="h-3 w-3" aria-hidden="true" /> Unduh
                  </button>
                  <button
                    type="button"
                    onClick={() => void hapus(b.id)}
                    className="inline-flex h-8 items-center gap-1 rounded-full border border-rose-200 bg-white px-3 text-[11.5px] font-semibold text-rose-600 transition-colors hover:bg-rose-50"
                  >
                    <Trash2 className="h-3 w-3" aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PortalCard>
  );
}
