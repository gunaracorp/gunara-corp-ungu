"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { COUNCILS, COUNCIL_CATEGORIES } from "@/data/content";
import { slugify } from "@/data/extended-types";
import { EASE, Reveal, SectionHeading } from "./motion";

type Filter = "All" | (typeof COUNCIL_CATEGORIES)[number];
const FILTERS: Filter[] = ["All", ...COUNCIL_CATEGORIES];

export default function Councils() {
  const [filter, setFilter] = useState<Filter>("All");
  const shown = filter === "All" ? COUNCILS : COUNCILS.filter((c) => c.category === filter);
  const countFor = (f: Filter) =>
    f === "All" ? COUNCILS.length : COUNCILS.filter((c) => c.category === f).length;

  return (
    <section
      id="councils"
      className="cv-auto relative scroll-mt-20 overflow-hidden border-t border-slate-200 py-24 sm:py-28"
      aria-label="46 Dewan Pakar"
    >
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/[0.05] blur-[140px]"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Dewan Pakar"
          title={
            <>
              46 Pikiran. <span className="text-gradient-gold">Satu Vonis.</span>
            </>
          }
          sub="Setiap dewan membawa 150 tahun penguasaan yang terdistilasi di ranahnya. Bersama-sama: 6.900 tahun kejeniusan manusia — bersidang untuk kepentingan Anda sejak jam nol."
        />

        {/* Filters */}
        <Reveal delay={0.15}>
          <div
            className="mt-12 flex flex-wrap items-center justify-center gap-2.5"
            role="tablist"
            aria-label="Filter dewan menurut ranah"
          >
            {FILTERS.map((f) => {
              const active = filter === f;
              return (
                <button
                  key={f}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(f)}
                  className={`inline-flex min-h-11 items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 sm:text-[13px] ${
                    active
                      ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-[0_8px_28px_-8px_rgba(13,148,136,0.42)]"
                      : "border border-slate-200 bg-white text-slate-500 hover:border-violet-500/50 hover:text-violet-600"
                  }`}
                >
                  {f === "All" ? "Semua" : f}
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                      active ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {countFor(f)}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Grid — scrollable when showing all 46 */}
        <div
          key={filter}
          className={`mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 ${
            filter === "All"
              ? "max-h-[640px] overflow-y-auto custom-scrollbar pr-1.5 sm:pr-2"
              : ""
          }`}
        >
          {shown.map((c, i) => (
            <motion.a
              key={c.name}
              href={`#/councils/${slugify(c.name)}`}
              aria-label={`Buka Dewan ${c.name}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: Math.min(i * 0.035, 0.5), ease: EASE }}
              className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-500/50 hover:bg-slate-50 hover:shadow-[0_16px_44px_-18px_rgba(13,148,136,0.2)]"
            >
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-violet-300 bg-violet-50 text-violet-600 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                <c.icon className="h-5 w-5" aria-hidden="true" />
              </span>

              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-500">
                  {c.category}
                </p>
                <h3 className="mt-1 font-display text-[15px] font-bold leading-snug text-slate-900">
                  {c.name}
                </h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-slate-900">{c.blurb}</p>
              </div>

              <span className="shrink-0 rounded-full border border-violet-300 bg-violet-50 px-2 py-1 text-[10px] font-bold text-violet-600">
                150 th
              </span>
            </motion.a>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="mt-8 text-center text-xs text-slate-400">
            Menampilkan {shown.length} dari 46 dewan ·{" "}
            <a
              href={
                filter === "All"
                  ? "#/councils"
                  : `#/councils?filter=${encodeURIComponent(filter)}`
              }
              className="font-semibold text-violet-600 transition-colors hover:text-violet-700"
            >
              Lihat semua 46 dewan di ruang sidang lengkap →
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
