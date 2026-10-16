"use client";

/**
 * /perizinan — Gerbang Perizinan. Katalog 36+ jenis izin Indonesia & global,
 * dengan pencarian, filter kategori, dan kedalaman detail per izin.
 */

import { motion } from "framer-motion";
import { ArrowRight, Clock, Search, Sparkles, X } from "lucide-react";
import { useMemo, useState } from "react";
import { PERIZINAN, PERIZINAN_CATEGORIES, PERIZINAN_STATS } from "@/data/perizinan";
import { Link } from "@/lib/router";
import { EASE } from "@/components/landing/motion";
import { CTABand, LinkButton, PageHero, StatBand } from "@/components/site/ui";

const COMPLEXITY_CLS: Record<string, string> = {
  Dasar: "border-emerald-200 bg-emerald-50 text-emerald-600",
  Menengah: "border-violet-300 bg-violet-50 text-violet-600",
  Kompleks: "border-rose-200 bg-rose-50 text-rose-600",
};

export default function PerizinanPage({
  initialCategory,
}: {
  initialCategory?: string | null;
}) {
  const [category, setCategory] = useState<string>(
    initialCategory && PERIZINAN_CATEGORIES.some((c) => c.id === initialCategory)
      ? initialCategory
      : "semua"
  );
  const [query, setQuery] = useState("");

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PERIZINAN.filter((p) => {
      const catOk = category === "semua" || p.categoryId === category;
      const qOk =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.enName.toLowerCase().includes(q) ||
        p.agency.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q);
      return catOk && qOk;
    });
  }, [category, query]);

  const countFor = (id: string) =>
    id === "semua" ? PERIZINAN.length : PERIZINAN.filter((p) => p.categoryId === id).length;

  return (
    <>
      <PageHero
        eyebrow="Gerbang Perizinan"
        title={
          <>
            Semua Izin Dunia.{" "}
            <span className="text-gradient-gold">Satu Gerbang.</span>
          </>
        }
        sub="Dari NIB hingga OJK, dari BPOM hingga KITAS — 36+ jenis izin Indonesia dan global kami tuntaskan end-to-end: pemetaan, dokumen, pengurusan, hingga dokumen resmi di tangan Anda."
        crumbs={[{ label: "Beranda", to: "/" }, { label: "Perizinan" }]}
        meta={["36+ Jenis Izin", "8 Kategori Regulasi", "Respons ≤ 48 Jam", "190 Negara Terjangkau"]}
      >
        <LinkButton to="/contact" withArrow>
          Konsultasi Gratis
        </LinkButton>
        <LinkButton to="/method" variant="ghost">
          Lihat Metode Kami
        </LinkButton>
      </PageHero>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Statistik perizinan">
        <StatBand stats={PERIZINAN_STATS} />
      </section>

      {/* Filter + pencarian */}
      <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8" aria-label="Filter perizinan">
        <div className="flex flex-col gap-6">
          <div className="relative mx-auto w-full max-w-xl">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-900"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari izin, instansi, atau kebutuhan bisnis… (mis. NIB, halal, KITAS)"
              aria-label="Cari jenis perizinan"
              className="w-full rounded-full border border-slate-200 bg-white/60 py-3.5 pl-11 pr-11 text-sm text-slate-900 outline-none backdrop-blur transition-colors placeholder:text-slate-400 focus:border-violet-500/60"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Bersihkan pencarian"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-900 transition-colors hover:text-violet-600"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>

          <div className="flex flex-wrap justify-center gap-2.5" role="tablist" aria-label="Kategori perizinan">
            {[{ id: "semua", name: "Semua" }, ...PERIZINAN_CATEGORIES].map((c) => {
              const active = category === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setCategory(c.id)}
                  className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-5 text-[13px] font-semibold transition-all duration-300 ${
                    active
                      ? "border-violet-500/70 bg-violet-100 text-violet-700 shadow-[0_0_24px_-6px_rgba(139,92,246,0.32)]"
                      : "border-slate-200 bg-white text-slate-500 hover:border-violet-300 hover:text-violet-600"
                  }`}
                >
                  {c.name}
                  <span className="text-[10px] font-bold text-slate-400">{countFor(c.id)}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Grid katalog */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8" aria-label="Daftar perizinan">
        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white/60 px-6 py-16 text-center">
            <Sparkles className="h-8 w-8 text-violet-500" aria-hidden="true" />
            <p className="text-lg font-semibold text-slate-600">
              Tidak ada izin yang cocok dengan pencarian Anda.
            </p>
            <p className="max-w-md text-sm text-slate-900">
              Bukan berarti kami tidak bisa — 46 Dewan Pakar menangani izin apa pun di luar katalog.
              Sampaikan kebutuhan Anda, kami petakan jalannya.
            </p>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <LinkButton to="/contact" withArrow>
                Tanyakan Izin Ini
              </LinkButton>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setCategory("semua");
                }}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-300 px-7 text-sm font-semibold text-slate-600 transition-colors hover:border-violet-500/60 hover:text-violet-600"
              >
                Reset Pencarian
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.slug}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.55, delay: Math.min(i % 6, 4) * 0.05, ease: EASE }}
                >
                  <Link
                    to={`/perizinan/${p.slug}`}
                    className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white/70 p-5 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/50 hover:shadow-[0_20px_60px_-20px_rgba(139,92,246,0.22)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-200 bg-violet-50 text-violet-600">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span
                        className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${COMPLEXITY_CLS[p.complexity]}`}
                      >
                        {p.complexity}
                      </span>
                    </div>
                    <h3 className="mt-4 font-display text-lg font-bold leading-snug text-slate-900 transition-colors group-hover:text-violet-700">
                      {p.name}
                    </h3>
                    <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                      {p.enName}
                    </p>
                    <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-500">
                      {p.tagline}
                    </p>
                    <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3.5">
                      <span className="line-clamp-1 text-[11px] font-medium text-slate-900">{p.agency}</span>
                      <span className="flex items-center gap-1.5 text-[11px] font-semibold text-violet-700">
                        <Clock className="h-3 w-3" aria-hidden="true" />
                        {p.timeline}
                      </span>
                    </div>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-violet-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      Lihat proses lengkap
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      <CTABand
        title={
          <>
            Izin Anda di luar katalog?{" "}
            <span className="text-gradient-gold">Justru itu spesialitas kami.</span>
          </>
        }
        sub="Setiap regulasi baru, setiap sektor khusus, setiap kombinasi lintas negara — 46 Dewan Pakar sudah pernah melaluinya. Ceritakan, kami petakan."
      />
    </>
  );
}
