"use client";

/**
 * /layanan — Indeks Katalog Layanan.
 * ----------------------------------------------------------------------------
 * Katalog penuh layanan GUNARA (target 120 layanan dalam 12 kategori) dengan
 * pencarian & filter kategori SSR-friendly:
 *  - SEMUA kartu dirender di DOM pada state awal (query kosong + kategori
 *    "semua") sehingga seluruh tautan & konten terbaca mesin pencari;
 *  - filter/pencarian hanya MENYEMBUNYIKAN kartu lewat state (class hidden) —
 *    kartu tidak pernah di-unmount setelah hidrasi;
 *  - "?kategori=<id>" pada route di-hash ditangani pemanggil (app.tsx) dan
 *    diteruskan sebagai prop initialCategory.
 */

import {
  ArrowUpRight,
  Clock,
  Search,
  SearchX,
  Wallet,
  X,
  type LucideIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Reveal } from "@/components/landing/motion";
import { CTABand, PageHero, StatBand } from "@/components/site/ui";
import { BRAND } from "@/data/brand";
import {
  CATALOG_CATEGORIES,
  SERVICES_CATALOG,
  type CatalogCategory,
} from "@/data/service-catalog";

/* ------------------------- Data turunan (stabil) -------------------------- */

/** Peta kategori — O(1) lookup saat merender ratusan kartu. */
const CATEGORY_BY_ID = new Map(
  CATALOG_CATEGORIES.map((c) => [c.id, c] as const),
);

/** Chip filter: "Semua" + 12 kategori (ikon + nama + jumlah layanan). */
const CATEGORY_CHIPS: { id: string; name: string; icon?: LucideIcon }[] = [
  { id: "semua", name: "Semua" },
  ...CATALOG_CATEGORIES.map((c) => ({
    id: c.id as string,
    name: c.name,
    icon: c.icon,
  })),
];

/** Jumlah layanan per kategori (atau total untuk "semua"). */
const countFor = (id: string) =>
  id === "semua"
    ? SERVICES_CATALOG.length
    : SERVICES_CATALOG.filter((s) => s.categoryId === id).length;

/* --------------------------------- Page ----------------------------------- */

export default function CatalogPage({
  initialCategory,
}: {
  initialCategory?: string | null;
}) {
  const [category, setCategory] = useState<string>(
    initialCategory && CATALOG_CATEGORIES.some((c) => c.id === initialCategory)
      ? initialCategory
      : "semua",
  );
  const [query, setQuery] = useState("");

  /**
   * Kumpulan slug yang tampil — dipakai untuk toggle `hidden` per kartu.
   * Seluruh kartu tetap berada di DOM; state hanya menyembunyikan.
   */
  const visibleSlugs = useMemo(() => {
    const q = query.trim().toLowerCase();
    const set = new Set<string>();
    for (const s of SERVICES_CATALOG) {
      if (category !== "semua" && s.categoryId !== category) continue;
      if (!q) {
        set.add(s.slug);
        continue;
      }
      const cat = CATEGORY_BY_ID.get(s.categoryId) as CatalogCategory | undefined;
      const hit =
        s.name.toLowerCase().includes(q) ||
        s.enName.toLowerCase().includes(q) ||
        s.tagline.toLowerCase().includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q)) ||
        (cat ? cat.name.toLowerCase().includes(q) : false);
      if (hit) set.add(s.slug);
    }
    return set;
  }, [category, query]);

  const resetFilters = () => {
    setQuery("");
    setCategory("semua");
  };

  return (
    <>
      <PageHero
        eyebrow="Katalog Layanan"
        title={
          <>
            {SERVICES_CATALOG.length} Layanan.{" "}
            <span className="text-gradient-gold">
              Dua Belas Kategori. Satu Standar.
            </span>
          </>
        }
        sub="Satu katalog, dua belas kategori, harga terbuka di tiap kartu: setiap layanan GUNARA hadir dengan estimasi durasi, biaya mulai yang transparan, penanggung jawab bernama, dan peta jalan kerja pertama dalam 48 jam."
        crumbs={[{ label: "Beranda", to: "/" }, { label: "Katalog Layanan" }]}
        meta={[
          `${SERVICES_CATALOG.length} layanan`,
          `${CATALOG_CATEGORIES.length} kategori`,
          "Respons 48 jam",
        ]}
      />

      <section
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        aria-label="Statistik katalog layanan"
      >
        <StatBand
          stats={[
            { value: `${SERVICES_CATALOG.length}+`, label: "Layanan siap jalan" },
            { value: String(CATALOG_CATEGORIES.length), label: "Kategori" },
            { value: BRAND.companies, label: "Perusahaan ditangani" },
          ]}
        />
      </section>

      {/* Filter + pencarian */}
      <section
        className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8"
        aria-label="Filter katalog layanan"
      >
        <div className="flex flex-col gap-6">
          <div className="relative mx-auto w-full max-w-xl">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-900"
              aria-hidden="true"
            />
            <label htmlFor="layanan-search" className="sr-only">
              Cari layanan
            </label>
            <input
              id="layanan-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari layanan… mis. pendirian PT, halal, ISO"
              aria-label="Cari layanan di katalog"
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

          <div className="flex flex-wrap justify-center gap-2.5">
            {CATEGORY_CHIPS.map((c) => {
              const active = category === c.id;
              const ChipIcon = c.icon;
              return (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setCategory(c.id)}
                  className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-[13px] font-semibold transition-all duration-300 ${
                    active
                      ? "border-violet-500/70 bg-violet-100 text-violet-700 shadow-[0_0_24px_-6px_rgba(139,92,246,0.32)]"
                      : "border-slate-200 bg-white text-slate-500 hover:border-violet-300 hover:text-violet-600"
                  }`}
                >
                  {ChipIcon ? (
                    <ChipIcon className="h-4 w-4" aria-hidden="true" />
                  ) : null}
                  {c.name}
                  <span className="text-[10px] font-bold text-slate-400">
                    {countFor(c.id)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Grid katalog — semua kartu tinggal di DOM, state hanya menyembunyikan */}
      <section
        className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
        aria-label="Daftar layanan"
      >
        <p
          className="mb-6 text-center text-sm font-medium text-slate-500"
          role="status"
          aria-live="polite"
        >
          Menampilkan{" "}
          <span className="font-bold text-violet-700">{visibleSlugs.size}</span>{" "}
          dari {SERVICES_CATALOG.length} layanan
        </p>

        {visibleSlugs.size === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white/60 px-6 py-16 text-center">
            <SearchX className="h-8 w-8 text-violet-500" aria-hidden="true" />
            <p className="text-lg font-semibold text-slate-600">
              Tidak ada layanan yang cocok dengan pencarian Anda.
            </p>
            <p className="max-w-md text-sm leading-relaxed text-slate-500">
              Bukan berarti kami tidak bisa — kebutuhan di luar katalog tetap
              kami petakan. Sampaikan kebutuhan Anda, Dewan yang relevan akan
              menjawab dalam 48 jam.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-2 inline-flex min-h-12 items-center justify-center rounded-full border border-slate-300 px-7 text-sm font-semibold text-slate-600 transition-colors hover:border-violet-500/60 hover:text-violet-600"
            >
              Reset Pencarian
            </button>
          </div>
        ) : null}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES_CATALOG.map((s, i) => {
            const visible = visibleSlugs.has(s.slug);
            const cat = CATEGORY_BY_ID.get(s.categoryId);
            const CatIcon = cat?.icon;
            return (
              <div key={s.slug} className={visible ? "h-full" : "hidden"}>
                <Reveal delay={(i % 4) * 0.05} className="h-full">
                  <a
                    href={`#/layanan/${s.slug}`}
                    className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-violet-500/50 hover:shadow-[0_24px_60px_-24px_rgba(139,92,246,0.22)]"
                    aria-label={`Buka layanan ${s.name}`}
                  >
                    <span
                      className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/80 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      aria-hidden="true"
                    />

                    {s.popular ? (
                      <span className="absolute right-5 top-4 rounded-full border border-violet-300 bg-violet-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-violet-700">
                        Populer
                      </span>
                    ) : null}

                    {CatIcon ? (
                      <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-violet-300 bg-gradient-to-br from-violet-100 to-indigo-100 text-violet-600 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
                        <CatIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}

                    <h2 className="font-display text-lg font-bold leading-snug text-slate-900 transition-colors group-hover:text-violet-700">
                      {s.name}
                    </h2>
                    <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                      {s.enName}
                    </p>
                    <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-500">
                      {s.tagline}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                        <Clock className="h-3 w-3 text-violet-600" aria-hidden="true" />
                        {s.duration}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                        <Wallet className="h-3 w-3 text-violet-600" aria-hidden="true" />
                        Mulai {s.priceFrom}
                      </span>
                    </div>

                    <span className="mt-5 inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.18em] text-violet-700">
                      Lihat detail
                      <ArrowUpRight
                        className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </span>
                  </a>
                </Reveal>
              </div>
            );
          })}
        </div>
      </section>

      <CTABand />
    </>
  );
}
