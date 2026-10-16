"use client";

/**
 * Landing section — Gerbang Perizinan: 8 kategori regulasi, satu gerbang.
 * Flagship differentiator PT TOP KONSULTAN INTERNASIONAL.
 */

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { PERIZINAN, PERIZINAN_CATEGORIES } from "@/data/perizinan";
import { Link } from "@/lib/router";
import { EASE, SectionHeading } from "./motion";
import { LinkButton } from "@/components/site/ui";

export default function PerizinanSection() {
  return (
    <section className="cv-auto relative overflow-hidden py-24 sm:py-28" aria-label="Gerbang Perizinan">
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-[640px] -translate-x-1/2 rounded-full bg-violet-600/[0.06] blur-[130px]"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Gerbang Perizinan"
          title={
            <>
              36+ Jenis Izin. <span className="text-gradient-gold">Nol Drama.</span>
            </>
          }
          sub="Satu-satunya konsultan di dunia yang menggabungkan strategi kelas McKinsey dengan pengurusan perizinan Indonesia end-to-end — dari NIB hingga OJK, dari BPOM hingga KITAS."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PERIZINAN_CATEGORIES.map((c, i) => {
            const Icon = c.icon;
            const count = PERIZINAN.filter((p) => p.categoryId === c.id).length;
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: (i % 4) * 0.07, ease: EASE }}
              >
                <Link
                  to={`/perizinan?kategori=${c.id}`}
                  className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white/70 p-5 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/50 hover:shadow-[0_20px_60px_-24px_rgba(139,92,246,0.28)]"
                  ariaLabel={`${c.name} — ${count} jenis izin`}
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-200 bg-violet-50 text-violet-600 transition-transform duration-500 group-hover:scale-110">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-display text-base font-bold leading-snug text-slate-900 transition-colors group-hover:text-violet-700">
                    {c.name}
                  </h3>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                    {c.enName}
                  </p>
                  <p className="mt-2.5 flex-1 text-[13px] leading-relaxed text-slate-900">{c.desc}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 border-t border-slate-200 pt-3.5 text-xs font-bold text-violet-700">
                    {count} jenis izin
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <LinkButton to="/perizinan" withArrow>
            Jelajahi Semua 36 Izin
          </LinkButton>
          <span className="text-xs text-slate-400">
            Peta jalan perizinan pertama dalam 48 jam — dijamin tertib regulasi.
          </span>
        </div>
      </div>
    </section>
  );
}
