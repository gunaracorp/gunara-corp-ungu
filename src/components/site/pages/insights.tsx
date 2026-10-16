"use client";

import Image from "next/image";
import { ArrowUpRight, CalendarDays, Clock3 } from "lucide-react";
import { INSIGHTS } from "@/data/insights";
import { Reveal } from "@/components/landing/motion";
import { CTABand, LinkButton, PageHero } from "@/components/site/ui";

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(`${iso}T00:00:00Z`));
  } catch {
    return iso;
  }
}

export default function InsightsPage() {
  const [featured, ...rest] = INSIGHTS;

  return (
    <>
      <PageHero
        eyebrow="Wawasan"
        title={
          <>
            Wawasan dari <span className="text-gradient-gold">Ruang Dewan.</span>
          </>
        }
        sub="Putusan yang diterbitkan dari ruang dewan — penilaian yang sama dengan yang kami bawa ke setiap penugasan, kini dibuka untuk dunia. Baca apa yang sudah diputuskan dekade berikutnya."
        crumbs={[{ label: "Beranda", to: "/" }, { label: "Wawasan" }]}
        meta={["6 esai utama", "Ditulis ketua dewan", "Tanpa basa-basi — berbasis bukti"]}
      />

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8" aria-label="Semua wawasan">
        {/* Featured */}
        <Reveal>
          <a
            href={`#/insights/${featured.slug}`}
            className="group relative grid overflow-hidden rounded-3xl border border-violet-200 bg-white transition-all duration-300 hover:border-violet-500/60 hover:shadow-[0_30px_80px_-30px_rgba(139,92,246,0.28)] lg:grid-cols-2"
            aria-label={`Baca: ${featured.title}`}
          >
            <div className="relative h-64 overflow-hidden lg:h-auto lg:min-h-[380px]">
              <Image
                src={featured.cover}
                alt={`Ilustrasi sampul untuk ${featured.title}`}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              <span className="absolute left-5 top-5 rounded-full border border-violet-500/50 bg-white/80 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-violet-600 backdrop-blur">
                Sorotan Utama
              </span>
            </div>
            <div className="flex flex-col justify-center gap-4 p-7 sm:p-10">
              <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-900">
                <span className="text-violet-500">{featured.category}</span>
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                  {formatDate(featured.date)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
                  {featured.readTime} mnt
                </span>
              </p>
              <h2 className="font-display text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">
                {featured.title}
              </h2>
              {featured.enTitle ? (
                <p className="-mt-2 text-[12px] font-medium italic text-slate-900 sm:text-sm">
                  {featured.enTitle}
                </p>
              ) : null}
              <p className="text-sm leading-relaxed text-slate-500 sm:text-base">{featured.excerpt}</p>
              <p className="text-[13px] text-slate-900">
                <span className="font-semibold text-slate-600">{featured.author.name}</span> ·{" "}
                {featured.author.role}
              </p>
              <span className="mt-2 inline-flex w-fit items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.18em] text-violet-600">
                Baca wawasan
                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </span>
            </div>
          </a>
        </Reveal>

        {/* Grid */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {rest.map((ins, i) => (
            <Reveal key={ins.slug} delay={(i % 3) * 0.08} className="h-full">
              <a
                href={`#/insights/${ins.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1.5 hover:border-violet-500/50 hover:shadow-[0_24px_60px_-24px_rgba(139,92,246,0.22)]"
                aria-label={`Baca: ${ins.title}`}
              >
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={ins.cover}
                    alt={`Ilustrasi sampul untuk ${ins.title}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 rounded-full border border-violet-500/50 bg-white/80 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-violet-600 backdrop-blur">
                    {ins.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="h-3 w-3" aria-hidden="true" />
                      {formatDate(ins.date)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock3 className="h-3 w-3" aria-hidden="true" />
                      {ins.readTime} mnt
                    </span>
                  </p>
                  <h2 className="mt-3 font-display text-lg font-bold leading-snug text-slate-900">
                    {ins.title}
                  </h2>
                  {ins.enTitle ? (
                    <p className="mt-1 text-[11px] italic text-slate-400">{ins.enTitle}</p>
                  ) : null}
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-900">{ins.excerpt}</p>
                  <span className="mt-4 text-[13px] text-slate-900">
                    <span className="font-semibold text-slate-600">{ins.author.name}</span>
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <div className="mt-14 flex flex-col items-center gap-5 rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-600/[0.06] to-transparent p-8 text-center sm:p-10">
            <p className="max-w-2xl font-display text-xl italic leading-relaxed text-slate-700 sm:text-2xl">
              &ldquo;Membaca itu murah. Sidang yang menentukan.&rdquo;
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <LinkButton to="/contact" withArrow>
                Sidangkan para dewan
              </LinkButton>
              <LinkButton to="/method" variant="ghost">
                Lihat cara putusan ditempa
              </LinkButton>
            </div>
          </div>
        </Reveal>
      </section>

      <CTABand />
    </>
  );
}
