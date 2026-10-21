"use client";

import { ArrowUpRight } from "lucide-react";
import { INDUSTRIES } from "@/data/industries";
import { Reveal } from "@/components/landing/motion";
import { CTABand, LinkButton, PageHero } from "@/components/site/ui";

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Industri"
        title={
          <>
            Setiap Industri. <span className="text-gradient-gold">Kedalaman Absolut.</span>
          </>
        }
        sub="Dua belas industri dengan kedalaman penuh — ditopang 46 dewan yang menjangkau setiap disiplin di sekitarnya. Pilih wilayah Anda; ruang dewan sudah mengenal cuacanya."
        crumbs={[{ label: "Beranda", to: "/" }, { label: "Industri" }]}
        meta={["12 industri", "190 negara", "Mengikuti matahari"]}
      />

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8" aria-label="Industri">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {INDUSTRIES.map((ind, i) => (
            <Reveal key={ind.slug} delay={(i % 3) * 0.07} className="h-full">
              <a
                href={`#/industries/${ind.slug}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-violet-500/50 hover:shadow-[0_24px_60px_-24px_rgba(13,148,136,0.22)]"
                aria-label={`Lihat karya GUNARA di ${ind.name}`}
              >
                <span
                  className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/80 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  aria-hidden="true"
                />
                <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-violet-300 bg-gradient-to-br from-violet-100 to-indigo-100 text-violet-600 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
                  <ind.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h2 className="font-display text-lg font-bold text-slate-900">{ind.name}</h2>
                {ind.enName ? (
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                    {ind.enName}
                  </p>
                ) : null}
                <p className="mt-1.5 text-[13px] font-medium italic text-violet-700/70">{ind.tagline}</p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-500">
                  {ind.description[0]}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.18em] text-violet-700">
                  Jelajahi wilayah
                  <ArrowUpRight
                    className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <div className="mt-14 flex flex-col items-center gap-5 rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-600/[0.06] to-transparent p-8 text-center sm:p-10">
            <p className="max-w-2xl font-display text-xl italic leading-relaxed text-slate-700 sm:text-2xl">
              &ldquo;Industri Anda tidak terdaftar? Para dewan kami punya rekam jejak menggambar
              peta baru.&rdquo;
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <LinkButton to="/contact" withArrow>
                Petakan yang belum terpetakan
              </LinkButton>
              <LinkButton to="/councils" variant="ghost">
                Lihat 46 Dewan Pakar
              </LinkButton>
            </div>
          </div>
        </Reveal>
      </section>

      <CTABand />
    </>
  );
}
