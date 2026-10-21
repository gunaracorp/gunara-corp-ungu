"use client";

/**
 * Pusat Unduhan (#/unduh) — gerbang semua aset GUNARA:
 * source code zip, panduan PDF, suplemen, dan panduan HTML.
 * Berkas dilayani statis dari /unduh/* (folder public/unduh).
 */

import { Download, FileArchive, FileCode2, FileText, Globe2, Rocket, ShieldCheck, Terminal } from "lucide-react";
import { motion } from "framer-motion";
import { tr, useLang } from "@/lib/i18n";

const FILES = [
  {
    href: "/unduh/gunara-corp-ungu-source.zip",
    icon: FileArchive,
    titleKey: "unduh.source",
    descKey: "unduh.sourceDesc",
    meta: "v7 · ZIP",
    accent: "from-violet-600 to-indigo-500",
    primary: true,
  },
  {
    href: "/unduh/GUNARA-Panduan-Super-Lengkap-dari-Hulu-ke-Hilir.pdf",
    icon: FileText,
    titleKey: "unduh.guide",
    descKey: "unduh.guideDesc",
    meta: "PDF · 20 Bab",
    accent: "from-blue-600 to-cyan-500",
    primary: false,
  },
  {
    href: "/unduh/GUNARA-Suplemen-Panduan-v1.1-Grafik-Multibahasa-Backup.pdf",
    icon: FileText,
    titleKey: "unduh.suplemen",
    descKey: "unduh.suplemenDesc",
    meta: "PDF · v1.1",
    accent: "from-emerald-600 to-teal-500",
    primary: false,
  },
  {
    href: "/unduh/panduan-gunara.html",
    icon: Globe2,
    titleKey: "unduh.html",
    descKey: "unduh.htmlDesc",
    meta: "HTML · Interaktif",
    accent: "from-amber-500 to-orange-500",
    primary: false,
  },
] as const;

const STEPS = [
  { cmd: "unzip gunara-corp-ungu-source.zip && cd gunara-corp-ungu", note: "ekstrak arsip" },
  { cmd: "bun install", note: "pasang 800+ dependensi" },
  { cmd: "bunx prisma db push", note: "siapkan database SQLite" },
  { cmd: "bun dev", note: "hidup di http://localhost:3000" },
];

export default function UnduhPage() {
  const [lang] = useLang();

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
      {/* Kepala */}
      <div className="mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-500 text-white shadow-[0_12px_40px_-10px_rgba(13,148,136,0.5)]"
        >
          <Download className="h-7 w-7" aria-hidden="true" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.06 }}
          className="text-balance text-4xl font-black tracking-tight text-slate-900 sm:text-5xl"
        >
          {tr(lang, "unduh.title")}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12 }}
          className="mt-4 text-pretty text-[15px] leading-relaxed text-slate-600"
        >
          {tr(lang, "unduh.subtitle")}
        </motion.p>
      </div>

      {/* Kartu berkas */}
      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {FILES.map((f, i) => {
          const Icon = f.icon;
          return (
            <motion.a
              key={f.href}
              href={f.href}
              download
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              className={`group relative flex flex-col overflow-hidden rounded-3xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-20px_rgba(13,148,136,0.35)] ${
                f.primary
                  ? "border-violet-300 bg-gradient-to-br from-violet-50 via-white to-indigo-50 ring-1 ring-violet-200"
                  : "border-slate-200 bg-white hover:border-violet-300"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${f.accent} text-white shadow-lg`}
                >
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <span className="rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-slate-500">
                  {f.meta}
                </span>
              </div>
              <h2 className="mt-5 text-lg font-black tracking-tight text-slate-900">
                {tr(lang, f.titleKey)}
              </h2>
              <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-slate-600">
                {tr(lang, f.descKey)}
              </p>
              <span
                className={`mt-5 inline-flex w-fit items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-bold text-white shadow-[0_10px_30px_-10px_rgba(13,148,136,0.5)] transition-transform duration-300 group-hover:scale-[1.03] ${
                  f.primary
                    ? "bg-gradient-to-r from-violet-600 via-indigo-500 to-blue-600"
                    : "bg-slate-900 group-hover:bg-violet-600"
                }`}
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                {tr(lang, "ui.download")}
              </span>
            </motion.a>
          );
        })}
      </div>

      {/* Cara menjalankan */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5 }}
        className="mt-14 overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 text-slate-100"
        aria-labelledby="unduh-cara"
      >
        <div className="border-b border-white/10 px-6 py-5 sm:px-8">
          <h2 id="unduh-cara" className="flex items-center gap-2.5 text-xl font-black tracking-tight">
            <Terminal className="h-5 w-5 text-violet-400" aria-hidden="true" />
            {tr(lang, "unduh.caraJudul")}
          </h2>
          <p className="mt-1.5 text-[13.5px] text-zinc-400">{tr(lang, "unduh.caraDesc")}</p>
        </div>
        <ol className="divide-y divide-white/5">
          {STEPS.map((s, i) => (
            <li key={s.cmd} className="flex flex-col gap-2 px-6 py-4 sm:flex-row sm:items-center sm:gap-5 sm:px-8">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-600/20 text-[13px] font-black text-violet-300 ring-1 ring-violet-500/40">
                {i + 1}
              </span>
              <code className="min-w-0 flex-1 overflow-x-auto rounded-lg bg-black/60 px-3.5 py-2 font-mono text-[12.5px] text-emerald-300">
                $ {s.cmd}
              </code>
              <span className="shrink-0 text-[12px] font-semibold text-zinc-500">{s.note}</span>
            </li>
          ))}
        </ol>
        <div className="flex flex-col gap-2 border-t border-white/10 px-6 py-5 text-[13px] text-zinc-400 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
            {tr(lang, "unduh.akunDesc")}
          </p>
          <p className="flex items-center gap-2 font-semibold text-zinc-300">
            <Rocket className="h-4 w-4 shrink-0 text-violet-400" aria-hidden="true" />
            {tr(lang, "unduh.akun")}
          </p>
        </div>
      </motion.section>
    </div>
  );
}
