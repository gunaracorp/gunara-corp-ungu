"use client";

import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { COUNCILS, COUNCIL_CATEGORIES } from "@/data/content";
import { slugify } from "@/data/extended-types";
import { COUNCIL_PROFILES } from "@/data/council-profiles";
import { EASE, Reveal } from "@/components/landing/motion";
import { CTABand, LinkButton, PageHero } from "@/components/site/ui";

type Filter = "All" | (typeof COUNCIL_CATEGORIES)[number];

export default function CouncilsPage({ initialFilter }: { initialFilter: string | null }) {
  const validInitial =
    initialFilter && (COUNCIL_CATEGORIES as string[]).includes(initialFilter)
      ? (initialFilter as Filter)
      : "All";
  const [filter, setFilter] = useState<Filter>(validInitial);
  const [query, setQuery] = useState("");

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return COUNCILS.filter((c) => {
      const matchCat = filter === "All" || c.category === filter;
      const matchQ =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.blurb.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [filter, query]);

  const countFor = (f: Filter) =>
    f === "All" ? COUNCILS.length : COUNCILS.filter((c) => c.category === f).length;

  const chairFor = (name: string) => COUNCIL_PROFILES.find((p) => p.name === name)?.chair;

  return (
    <>
      <PageHero
        eyebrow="46 Dewan Pakar"
        title={
          <>
            Parlemen para <span className="text-gradient-gold">polimat.</span>
          </>
        }
        sub="Setiap dewan membawa 150 tahun penguasaan yang dimurnikan di bidangnya. Bersama-sama: 6.900 tahun kejeniusan manusia — disidangkan untuk Anda, sejak jam nol."
        crumbs={[{ label: "Beranda", to: "/" }, { label: "46 Dewan Pakar" }]}
        meta={["46 dewan", "6 kategori", "Berdiri 2001"]}
      />

      {/* Controls */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Filter dewan">
        <Reveal delay={0.1}>
          <div
            className="flex flex-wrap items-center justify-center gap-2.5"
            role="tablist"
            aria-label="Saring dewan menurut bidang"
          >
            {(["All", ...COUNCIL_CATEGORIES] as Filter[]).map((f) => {
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
                      ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-[0_8px_28px_-8px_rgba(139,92,246,0.42)]"
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

        <Reveal delay={0.16}>
          <div className="mx-auto mt-6 max-w-md">
            <label htmlFor="council-search" className="sr-only">
              Cari 46 dewan pakar
            </label>
            <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white/60 px-5 transition-colors focus-within:border-violet-500/60">
              <Search className="h-4 w-4 shrink-0 text-slate-900" aria-hidden="true" />
              <input
                id="council-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari dewan pakar…"
                className="min-h-12 w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Hapus pencarian"
                  className="text-slate-900 transition-colors hover:text-violet-600"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              ) : null}
            </div>
          </div>
        </Reveal>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8" aria-label="Dewan pakar">
        <div key={`${filter}-${query}`} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {shown.map((c, i) => (
            <motion.a
              key={c.name}
              href={`#/councils/${slugify(c.name)}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: Math.min(i * 0.03, 0.5), ease: EASE }}
              className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-500/50 hover:bg-slate-50 hover:shadow-[0_16px_44px_-18px_rgba(139,92,246,0.2)]"
            >
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-violet-300 bg-violet-50 text-violet-600 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                <c.icon className="h-5 w-5" aria-hidden="true" />
              </span>

              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-500">
                  {c.category}
                </p>
                <h2 className="mt-1 font-display text-[15px] font-bold leading-snug text-slate-900">
                  {c.name}
                </h2>
                <p className="mt-1.5 text-[13px] leading-relaxed text-slate-900">{c.blurb}</p>
                {chairFor(c.name) ? (
                  <p className="mt-2 text-[11px] font-medium text-slate-400">
                    Diketuai oleh <span className="text-slate-900">{chairFor(c.name)}</span>
                  </p>
                ) : null}
              </div>

              <span className="shrink-0 rounded-full border border-violet-300 bg-violet-50 px-2 py-1 text-[10px] font-bold text-violet-600">
                150 th
              </span>
            </motion.a>
          ))}
        </div>

        {shown.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <p className="font-display text-xl font-bold text-slate-600">
              Tidak ada dewan yang menjawab nama itu.
            </p>
            <p className="max-w-sm text-sm text-slate-900">
              Sesuaikan pencarian — atau sampaikan langsung kepada kami, dan kami akan membentuk
              dewan yang belum ada.
            </p>
            <LinkButton to="/contact" withArrow>
              Bentuk dewan baru
            </LinkButton>
          </div>
        ) : (
          <Reveal delay={0.1}>
            <p className="mt-8 text-center text-xs text-slate-400">
              Menampilkan {shown.length} dari 46 dewan · Masing-masing terverifikasi independen
              dengan penguasaan 150 tahun*
            </p>
          </Reveal>
        )}
      </section>

      <CTABand />
    </>
  );
}
