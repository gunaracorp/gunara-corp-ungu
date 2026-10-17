"use client";

/**
 * /perizinan/[slug] — halaman detail satu jenis izin: deskripsi, persyaratan,
 * protokol 5 langkah, harga, dan izin terkait dalam kategori yang sama.
 */

import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Building,
  CalendarClock,
  CheckCircle2,
  Clock,
  FileCheck2,
  Gauge,
  Hourglass,
  Landmark,
} from "lucide-react";
import { PERIZINAN, PERIZINAN_CATEGORIES } from "@/data/perizinan";
import { perizinanFaqItems } from "@/lib/seo-ld";
import { Link } from "@/lib/router";
import { EASE } from "@/components/landing/motion";
import { Breadcrumb, CTABand, LinkButton, Ornament } from "@/components/site/ui";

const COMPLEXITY_CLS: Record<string, string> = {
  Dasar: "border-emerald-200 bg-emerald-50 text-emerald-600",
  Menengah: "border-violet-300 bg-violet-50 text-violet-600",
  Kompleks: "border-rose-200 bg-rose-50 text-rose-600",
};

export default function PerizinanDetailPage({ slug }: { slug: string }) {
  const item = PERIZINAN.find((p) => p.slug === slug);
  if (!item) return null;

  const Icon = item.icon;
  const category = PERIZINAN_CATEGORIES.find((c) => c.id === item.categoryId);
  const related = PERIZINAN.filter((p) => p.categoryId === item.categoryId && p.slug !== item.slug).slice(0, 3);

  const facts = [
    { icon: Landmark, label: "Instansi", value: item.agency },
    { icon: Clock, label: "Estimasi Waktu", value: item.timeline },
    { icon: CalendarClock, label: "Masa Berlaku", value: item.validity },
    { icon: Gauge, label: "Tingkat Kompleksitas", value: item.complexity },
  ];

  return (
    <article>
      {/* Hero */}
      <section className="noise-overlay relative overflow-hidden pb-12 pt-36 sm:pt-40">
        <div
          className="grid-bg absolute inset-0 [mask-image:radial-gradient(ellipse_75%_70%_at_50%_25%,black_25%,transparent_80%)]"
          aria-hidden="true"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0"
          aria-hidden="true"
        >
          <div className="absolute -top-24 left-[8%] h-72 w-72 rounded-full bg-violet-600/15 blur-[120px]" />
          <div className="absolute right-[5%] top-10 h-80 w-80 rounded-full bg-violet-600/10 blur-[130px]" />
        </motion.div>

        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6">
          <Breadcrumb
            items={[
              { label: "Beranda", to: "/" },
              { label: "Perizinan", to: "/perizinan" },
              ...(category ? [{ label: category.name, to: `/perizinan?kategori=${category.id}` }] : []),
              { label: item.name },
            ]}
          />

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="flex flex-wrap items-center gap-3"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-300 bg-violet-50 text-violet-600">
              <Icon className="h-7 w-7" aria-hidden="true" />
            </span>
            <span
              className={`rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${COMPLEXITY_CLS[item.complexity]}`}
            >
              {item.complexity}
            </span>
            {category ? (
              <span className="rounded-full border border-slate-200 bg-white/60 px-3 py-1.5 text-[11px] font-semibold text-slate-500">
                {category.name}
              </span>
            ) : null}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            className="mt-6 font-display text-3xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl"
          >
            {item.name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
            className="mt-3 text-sm font-semibold uppercase tracking-[0.22em] text-violet-700"
          >
            {item.enName}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.28, ease: EASE }}
            className="mt-5 max-w-2xl text-base leading-relaxed text-slate-500 sm:text-lg"
          >
            {item.tagline}
          </motion.p>
        </div>
      </section>

      {/* Fakta utama */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Fakta kunci perizinan">
        <div className="grid gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-100/80 sm:grid-cols-2 lg:grid-cols-4">
          {facts.map((f) => {
            const FIcon = f.icon;
            return (
              <div key={f.label} className="flex flex-col gap-2 bg-white/90 px-6 py-6">
                <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-900">
                  <FIcon className="h-3.5 w-3.5 text-violet-500" aria-hidden="true" />
                  {f.label}
                </span>
                <span className="text-sm font-semibold leading-snug text-slate-700">{f.value}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Konten utama */}
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.6fr_1fr] lg:px-8">
        <div className="flex flex-col gap-14">
          {/* Deskripsi */}
          <section aria-label="Deskripsi">
            <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
              Ringkasan <span className="text-gradient-gold">Strategis</span>
            </h2>
            <div className="mt-5 flex flex-col gap-4 text-base leading-relaxed text-slate-500">
              {item.description.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </section>

          {/* Persyaratan */}
          <section aria-label="Persyaratan">
            <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
              Persyaratan <span className="text-gradient-gold">Dokumen</span>
            </h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {item.requirements.map((req, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.06, ease: EASE }}
                  className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white/60 p-4"
                >
                  <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-violet-600" aria-hidden="true" />
                  <span className="text-sm leading-relaxed text-slate-600">{req}</span>
                </motion.li>
              ))}
            </ul>
          </section>

          {/* Proses */}
          <section aria-label="Proses pengurusan">
            <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
              Protokol <span className="text-gradient-gold">5 Langkah GUNARA</span>
            </h2>
            <ol className="relative mt-7 flex flex-col gap-0 border-l border-slate-200 pl-8">
              {item.process.map((step, i) => (
                <motion.li
                  key={step.step}
                  initial={{ opacity: 0, x: -14 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
                  className="relative pb-8 last:pb-0"
                >
                  <span className="absolute -left-[41px] flex h-6 w-6 items-center justify-center rounded-full border border-violet-500/60 bg-white font-display text-[10px] font-bold text-violet-600">
                    {step.step}
                  </span>
                  <h3 className="font-semibold text-slate-900">{step.text}</h3>
                  {i === item.process.length - 1 ? null : (
                    <span className="absolute -left-[9px] top-8 h-[calc(100%-2rem)] w-px bg-gradient-to-b from-violet-600/30 to-transparent" aria-hidden="true" />
                  )}
                </motion.li>
              ))}
            </ol>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-violet-200 bg-gradient-to-b from-violet-600/[0.08] to-transparent p-6">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold text-slate-900">
              <FileCheck2 className="h-5 w-5 text-violet-600" aria-hidden="true" />
              Kartu Izin
            </h2>
            <dl className="mt-4 flex flex-col gap-3.5 text-sm">
              <div className="flex items-start justify-between gap-3">
                <dt className="text-slate-900">Instansi</dt>
                <dd className="text-right font-semibold text-slate-700">{item.agency}</dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt className="text-slate-900">Estimasi</dt>
                <dd className="text-right font-semibold text-slate-700">{item.timeline}</dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt className="text-slate-900">Berlaku</dt>
                <dd className="text-right font-semibold text-slate-700">{item.validity}</dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt className="text-slate-900">Kompleksitas</dt>
                <dd className="text-right font-semibold text-slate-700">{item.complexity}</dd>
              </div>
            </dl>
            <div className="mt-5 border-t border-violet-200 pt-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-violet-700">Investasi</p>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{item.priceNote}</p>
            </div>
            <div className="mt-6 flex flex-col gap-3">
              <LinkButton to="/contact" withArrow>
                Mulai Pengurusan
              </LinkButton>
              <LinkButton to="/perizinan" variant="ghost">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Kembali ke Katalog
              </LinkButton>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white/60 p-6">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
              <BadgeCheck className="h-4 w-4 text-violet-600" aria-hidden="true" />
              Jaminan GUNARA
            </h3>
            <ul className="mt-4 flex flex-col gap-3 text-sm text-slate-500">
              <li className="flex items-start gap-2.5">
                <Hourglass className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" aria-hidden="true" />
                Peta jalan perizinan dalam 48 jam pertama.
              </li>
              <li className="flex items-start gap-2.5">
                <Building className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" aria-hidden="true" />
                Satu penanggung jawab bernama untuk seluruh proses.
              </li>
              <li className="flex items-start gap-2.5">
                <FileCheck2 className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" aria-hidden="true" />
                Dokumen resmi dituntaskan sampai tangan — bukan sekadar dianjurkan.
              </li>
            </ul>
          </div>
        </aside>
      </div>

      {/* FAQ — sumber FAQPage JSON-LD (markup identik dengan konten ini). */}
      <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6 lg:px-8" aria-label="Pertanyaan umum">
        <Ornament className="mb-10" />
        <h2 className="text-center font-display text-2xl font-bold text-slate-900 sm:text-3xl">
          Pertanyaan Umum <span className="text-gradient-gold">{item.name}</span>
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-slate-500">
          Jawaban ringkas berdasarkan katalog perizinan resmi GUNARA — untuk kasus
          spesifik, Senior Konsultan siap memetakan peta jalan Anda dalam 48 jam.
        </p>
        <div className="mt-8 flex flex-col gap-3">
          {perizinanFaqItems(item).map((f) => (
            <details
              key={f.q}
              className="group rounded-2xl border border-slate-200 bg-white/70 transition-colors duration-300 open:border-violet-300 open:bg-violet-50/40"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-semibold text-slate-900 [&::-webkit-details-marker]:hidden">
                {f.q}
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-violet-300 text-violet-600 transition-transform duration-300 group-open:rotate-45"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <div className="px-5 pb-5">
                {f.a.length > 1 ? (
                  <ol className="flex list-decimal flex-col gap-1.5 pl-5 text-sm leading-relaxed text-slate-600">
                    {f.a.map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-sm leading-relaxed text-slate-600">{f.a[0]}</p>
                )}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Terkait */}
      {related.length > 0 ? (
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8" aria-label="Izin terkait">
          <Ornament className="mb-10" />
          <h2 className="text-center font-display text-2xl font-bold text-slate-900 sm:text-3xl">
            Izin Lainnya dalam Kategori <span className="text-gradient-gold">{category?.name}</span>
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {related.map((r) => {
              const RIcon = r.icon;
              return (
                <Link
                  key={r.slug}
                  to={`/perizinan/${r.slug}`}
                  className="group flex flex-col rounded-2xl border border-slate-200 bg-white/70 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/50"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-200 bg-violet-50 text-violet-600">
                    <RIcon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-3.5 font-display text-base font-bold leading-snug text-slate-900 transition-colors group-hover:text-violet-700">
                    {r.name}
                  </h3>
                  <span className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-violet-700">
                    {r.timeline}
                    <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}

      <CTABand />
    </article>
  );
}
