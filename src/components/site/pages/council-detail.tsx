"use client";

import { ArrowUpRight, Award, MapPin, Quote, UserRound } from "lucide-react";
import { COUNCILS } from "@/data/content";
import { COUNCIL_PROFILES } from "@/data/council-profiles";
import { slugify } from "@/data/extended-types";
import { Reveal, SectionHeading } from "@/components/landing/motion";
import { CTABand, LinkButton, PageHero, StatBand } from "@/components/site/ui";

export default function CouncilDetailPage({ name }: { name: string }) {
  const council = COUNCILS.find((c) => c.name === name);
  const profile = COUNCIL_PROFILES.find((p) => p.name === name);

  if (!council || !profile) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center px-4 pt-24 text-center">
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-900">Dewan tidak ditemukan.</h1>
          <p className="mt-3 text-sm text-slate-900">
            Ruang dewan tidak memiliki catatan atas dewan ini.
          </p>
          <div className="mt-6 flex justify-center">
            <LinkButton to="/councils" withArrow>
              Sidangkan Semua 46
            </LinkButton>
          </div>
        </div>
      </section>
    );
  }

  const idx = COUNCILS.findIndex((c) => c.name === name);
  const prev = COUNCILS[(idx - 1 + COUNCILS.length) % COUNCILS.length];
  const next = COUNCILS[(idx + 1) % COUNCILS.length];

  return (
    <>
      <PageHero
        eyebrow={council.category}
        title={
          <>
            Dewan <span className="text-gradient-gold">{council.name}.</span>
          </>
        }
        sub={council.blurb}
        crumbs={[
          { label: "Beranda", to: "/" },
          { label: "46 Dewan Pakar", to: "/councils" },
          { label: council.name },
        ]}
        meta={[`Diketuai oleh ${profile.chair}`, `Kedudukan · ${profile.seat}`, "Penguasaan 150 tahun"]}
      >
        <LinkButton to="/contact" withArrow>
          Konsultasikan dengan Dewan Ini
        </LinkButton>
        <LinkButton to="/councils" variant="ghost">
          Lihat Semua 46
        </LinkButton>
      </PageHero>

      {/* Mastery + chair */}
      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-8 sm:px-6 lg:grid-cols-[1.4fr_1fr] lg:gap-8 lg:px-8" aria-label="Kisah penguasaan">
        <Reveal className="h-full">
          <div className="glass flex h-full flex-col gap-6 rounded-3xl p-7 sm:p-9">
            <div>
              <h2 className="font-display text-2xl font-bold text-slate-900">Penguasaan</h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">{profile.mastery}</p>
            </div>
            <blockquote className="mt-auto flex gap-4 rounded-2xl border border-violet-200 bg-violet-600/[0.05] p-5">
              <Quote className="h-6 w-6 shrink-0 text-violet-600" aria-hidden="true" />
              <div>
                <p className="font-display text-lg italic leading-relaxed text-violet-800/90">
                  {profile.signatureMove}
                </p>
                <cite className="mt-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-900 not-italic">
                  — Gerakan Khas dewan ini
                </cite>
              </div>
            </blockquote>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="h-full">
          <div className="flex h-full flex-col gap-4">
            <div className="glass rounded-3xl p-7">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-violet-300 bg-gradient-to-br from-violet-100 to-indigo-100 text-violet-600">
                <council.icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <h2 className="mt-4 flex items-center gap-2 font-display text-lg font-bold text-slate-900">
                <UserRound className="h-4 w-4 text-violet-600" aria-hidden="true" />
                Ketua Dewan
              </h2>
              <p className="mt-2 text-base font-semibold text-slate-900">{profile.chair}</p>
              <p className="text-[13px] text-violet-700">{profile.chairTitle}</p>
              <p className="mt-4 flex items-center gap-1.5 text-sm text-slate-900">
                <MapPin className="h-3.5 w-3.5 text-violet-500" aria-hidden="true" />
                Bersidang di {profile.seat}
              </p>
            </div>
            <div className="glass flex-1 rounded-3xl p-7">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold text-slate-900">
                <Award className="h-4 w-4 text-violet-600" aria-hidden="true" />
                Pencapaian Tanda Tangan
              </h2>
              <ul className="mt-4 space-y-4">
                {profile.achievements.map((a) => (
                  <li key={a.label} className="flex items-baseline gap-3">
                    <span className="whitespace-nowrap font-display text-xl font-bold text-gradient-gold">
                      {a.value}
                    </span>
                    <span className="text-[13px] leading-relaxed text-slate-500">{a.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Capabilities */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8" aria-label="Kapabilitas">
        <SectionHeading
          eyebrow="Enam Instrumen"
          title={
            <>
              Yang dewan ini <span className="text-gradient-gold">hadirkan.</span>
            </>
          }
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {profile.capabilities.map((cap, i) => (
            <Reveal key={cap} delay={(i % 3) * 0.07} className="h-full">
              <div className="group flex h-full items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/50">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-violet-300 bg-violet-50 font-display text-sm font-bold text-violet-600 transition-transform duration-300 group-hover:scale-110">
                  {i + 1}
                </span>
                <p className="text-[15px] font-medium leading-snug text-slate-700">{cap}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 pt-6 sm:px-6">
        <StatBand
          stats={[
            { value: "150", label: "tahun penguasaan yang dimurnikan" },
            { value: "2001", label: "bersidang sejak pendirian" },
            { value: "6.900", label: "tahun dewan gabungan di seluruh firma" },
          ]}
        />
      </div>

      {/* Prev / next */}
      <nav
        className="mx-auto flex max-w-7xl flex-col items-stretch justify-between gap-4 px-4 py-14 sm:flex-row sm:px-6 lg:px-8"
        aria-label="Navigasi dewan"
      >
        <a
          href={`#/councils/${slugify(prev.name)}`}
          className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:border-violet-500/50"
        >
          <span className="text-2xl text-slate-400 transition-colors group-hover:text-violet-600" aria-hidden="true">
            ←
          </span>
          <span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-900">
              Dewan sebelumnya
            </span>
            <span className="block font-display text-sm font-bold text-slate-700">{prev.name}</span>
          </span>
        </a>
        <a
          href={`#/councils/${slugify(next.name)}`}
          className="group flex items-center justify-end gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-right transition-all duration-300 hover:border-violet-500/50"
        >
          <span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-900">
              Dewan berikutnya
            </span>
            <span className="block font-display text-sm font-bold text-slate-700">{next.name}</span>
          </span>
          <span className="text-2xl text-slate-400 transition-colors group-hover:text-violet-600" aria-hidden="true">
            →
          </span>
        </a>
      </nav>

      {/* Related services pointer */}
      <Reveal className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
        <a
          href="#/services"
          className="group flex items-center justify-between gap-4 rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-600/[0.06] to-transparent p-6 transition-all duration-300 hover:border-violet-500/50"
        >
          <span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-500">
              Tempat dewan ini diterjunkan
            </span>
            <span className="mt-1 block font-display text-base font-bold text-slate-900">
              Lihat dua belas praktik kami
            </span>
          </span>
          <ArrowUpRight
            className="h-5 w-5 shrink-0 text-slate-400 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-violet-600"
            aria-hidden="true"
          />
        </a>
      </Reveal>

      <CTABand />
    </>
  );
}
