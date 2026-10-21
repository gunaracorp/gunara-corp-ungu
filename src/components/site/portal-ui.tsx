"use client";

/**
 * Portal UI — komponen bersama untuk Portal Karyawan (#/karyawan) dan
 * Portal Client (#/client). Pola visual mengikuti Panel CEO (admin.tsx):
 * login gate gelap, dashboard terang, aksen violet, kartu rounded-2xl.
 */

import { motion } from "framer-motion";
import { ChevronsUpDown, Globe, RefreshCw, type LucideIcon } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { type Lang } from "@/lib/i18n";
import { langMeta } from "@/lib/i18n/languages";
import { LanguagePicker } from "@/components/site/language-picker";

/**
 * Saklar bahasa — membuka LanguagePicker 195 bahasa.
 * API prop tetap sama (lang, onChange, dark) agar seluruh pemakaian lama bekerja.
 */
export function LangToggle({ lang, onChange, dark = false }: { lang: Lang; onChange: (l: Lang) => void; dark?: boolean }) {
  const [open, setOpen] = useState(false);
  const meta = langMeta(lang) ?? langMeta("id")!;
  void onChange; // dipertahankan demi kompatibilitas API lama; pembaruan lewat store global useLang().
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Language / Bahasa"
        className={`inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-[12px] font-bold transition-all ${
          dark
            ? "border-white/15 bg-white/5 text-zinc-300 hover:border-violet-400/60 hover:text-white"
            : "border-slate-200 bg-white text-slate-600 hover:border-violet-400 hover:text-violet-700"
        }`}
      >
        <Globe className="h-3.5 w-3.5 text-violet-500" aria-hidden="true" />
        <span aria-hidden="true">{meta.flag}</span>
        <span className="hidden max-w-[140px] truncate sm:inline">{meta.native}</span>
        <span className={`rounded px-1 text-[10px] font-black uppercase ${dark ? "bg-white/10" : "bg-violet-600/10 text-violet-700"}`}>
          {meta.code}
        </span>
        <ChevronsUpDown className="h-3 w-3 opacity-60" aria-hidden="true" />
      </button>
      <LanguagePicker
        open={open}
        onClose={() => setOpen(false)}
        dark={dark}
      />
    </>
  );
}

export const fmtDateTime = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Bangkok",
});

export const fmtDate = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Bangkok",
});

export const STATUS_PROYEK: Record<string, { label: string; badge: string; dot: string }> = {
  baru: { label: "Baru", badge: "bg-sky-500/10 text-sky-700 border-sky-300", dot: "bg-sky-500" },
  berjalan: { label: "Berjalan", badge: "bg-violet-600/10 text-violet-700 border-violet-300", dot: "bg-violet-600" },
  review: { label: "Review", badge: "bg-amber-500/10 text-amber-700 border-amber-300", dot: "bg-amber-500" },
  selesai: { label: "Selesai", badge: "bg-emerald-600/10 text-emerald-700 border-emerald-300", dot: "bg-emerald-600" },
  dibatalkan: { label: "Dibatalkan", badge: "bg-slate-500/10 text-slate-600 border-slate-300", dot: "bg-slate-500" },
};

export const PRIORITAS: Record<string, { label: string; badge: string }> = {
  rendah: { label: "Rendah", badge: "bg-slate-500/10 text-slate-600 border-slate-300" },
  normal: { label: "Normal", badge: "bg-sky-500/10 text-sky-700 border-sky-300" },
  tinggi: { label: "Tinggi", badge: "bg-amber-500/10 text-amber-700 border-amber-300" },
  urgent: { label: "Urgent", badge: "bg-rose-500/10 text-rose-700 border-rose-300" },
};

export function StatusBadge({ status }: { status: string }) {
  const s = STATUS_PROYEK[status] ?? STATUS_PROYEK.baru;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${s.badge}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} aria-hidden="true" />
      {s.label}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: string }) {
  const p = PRIORITAS[priority] ?? PRIORITAS.normal;
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold ${p.badge}`}>
      {p.label}
    </span>
  );
}

export function ProgressBar({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="flex items-center gap-2" aria-label={`Progres ${v}%`}>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-600 to-blue-600 transition-all duration-500"
          style={{ width: `${v}%` }}
        />
      </div>
      <span className="w-9 text-right text-[11px] font-black tabular-nums text-slate-600">{v}%</span>
    </div>
  );
}

export function PortalCard({
  title,
  icon: Icon,
  children,
  action,
}: {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_2px_16px_-8px_rgba(15,23,42,0.12)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <h2 className="flex items-center gap-2 text-[15px] font-black tracking-tight text-slate-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600/10 text-violet-600">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
          {title}
        </h2>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export function Flash({ msg }: { msg: string | null }) {
  if (!msg) return null;
  return (
    <motion.p
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2.5 text-[13px] font-semibold text-emerald-700"
      role="status"
    >
      {msg}
    </motion.p>
  );
}

/** Kartu statistik mini di atas dashboard. */
export function StatTile({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: number;
  hint: string;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_16px_-8px_rgba(15,23,42,0.12)]">
      <div className="flex items-center justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600/10 text-violet-600">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="font-display text-3xl font-black text-slate-900 tabular-nums">{value}</span>
      </div>
      <p className="mt-3 text-[13px] font-bold text-slate-700">{label}</p>
      <p className="text-[12px] text-slate-500">{hint}</p>
    </div>
  );
}

/** Feed aktivitas proyek (riwayat update). */
export function UpdateFeed({
  updates,
  emptyLabel,
}: {
  updates: { id: string; author: string; authorRole: string; message: string; createdAt: string }[];
  emptyLabel: string;
}) {
  if (updates.length === 0) {
    return <p className="text-[12.5px] italic text-slate-400">{emptyLabel}</p>;
  }
  const roleTone: Record<string, string> = {
    admin: "bg-slate-900 text-white",
    karyawan: "bg-violet-600/10 text-violet-700",
    client: "bg-sky-500/10 text-sky-700",
  };
  const roleLabel: Record<string, string> = {
    admin: "CEO",
    karyawan: "Tim",
    client: "Client",
  };
  return (
    <ol className="max-h-64 space-y-3 overflow-y-auto pr-1 [scrollbar-width:thin]">
      {updates.map((u) => (
        <li key={u.id} className="flex gap-3">
          <span
            className={`mt-0.5 flex h-7 shrink-0 items-center rounded-full px-2.5 text-[10px] font-black uppercase tracking-wide ${roleTone[u.authorRole] ?? "bg-slate-100 text-slate-600"}`}
          >
            {roleLabel[u.authorRole] ?? u.authorRole}
          </span>
          <div className="min-w-0">
            <p className="text-[13px] leading-snug text-slate-700">{u.message}</p>
            <p className="mt-0.5 text-[11px] text-slate-400">
              {u.author} · {fmtDateTime.format(new Date(u.createdAt))}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Tombol aksi kecil bergaya admin.tsx. */
export function ActionBtn({
  onClick,
  icon: Icon,
  label,
  tone = "slate",
  disabled,
  type = "button",
}: {
  onClick?: () => void;
  icon: LucideIcon;
  label: string;
  tone?: "slate" | "violet" | "rose" | "emerald";
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  const tones: Record<string, string> = {
    slate: "border-slate-300 text-slate-600 hover:border-violet-400 hover:text-violet-600",
    violet: "border-violet-300 bg-violet-600/5 text-violet-700 hover:bg-violet-600/10",
    rose: "border-rose-300 text-rose-600 hover:bg-rose-50",
    emerald: "border-emerald-300 text-emerald-600 hover:bg-emerald-50",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex h-9 items-center gap-1.5 rounded-full border bg-white px-3.5 text-[12px] font-bold transition-all disabled:cursor-not-allowed disabled:opacity-40 ${tones[tone]}`}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {label}
    </button>
  );
}

/** Tab strip ala Panel CEO untuk portal. */
export function PortalTabs<T extends string>({
  tabs,
  active,
  onChange,
  badge,
  ariaLabel,
}: {
  tabs: { id: T; label: string; icon: LucideIcon }[];
  active: T;
  onChange: (t: T) => void;
  badge?: Partial<Record<T, number>>;
  ariaLabel: string;
}) {
  return (
    <nav className="flex flex-wrap gap-2" aria-label={ariaLabel}>
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          aria-current={active === id}
          className={`inline-flex h-10 items-center gap-2 rounded-full px-4 text-[13px] font-bold transition-all ${
            active === id
              ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-[0_10px_26px_-10px_rgba(139,92,246,0.55)]"
              : "border border-slate-300 bg-white text-slate-600 hover:border-violet-400 hover:text-violet-600"
          }`}
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
          {label}
          {(badge?.[id] ?? 0) > 0 && (
            <span className="ml-0.5 rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-black text-white">
              {badge?.[id]}
            </span>
          )}
        </button>
      ))}
    </nav>
  );
}

/** Kolom input bergaya portal (terang). */
export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      {children}
    </label>
  );
}

export const inputClass =
  "h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20";

/** Gate sesi — menampilkan spinner saat memeriksa. */
export function CheckingScreen({ label }: { label: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setShow(true), 1200);
    return () => window.clearTimeout(t);
  }, []);
  return (
    <section className="grid min-h-[70svh] place-items-center bg-[#fafafc]">
      <p className="flex items-center gap-3 text-sm font-medium text-slate-500">
        <RefreshCw className="h-4 w-4 animate-spin text-violet-600" aria-hidden="true" />
        {show ? label : "Memeriksa sesi…"}
      </p>
    </section>
  );
}
