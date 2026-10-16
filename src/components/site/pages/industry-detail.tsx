"use client";

import { AlertTriangle, ArrowUpRight, Compass } from "lucide-react";
import { INDUSTRIES } from "@/data/industries";
import { SERVICES } from "@/data/content";
import { slugify } from "@/data/extended-types";
import { Reveal, SectionHeading } from "@/components/landing/motion";
import { CTABand, LinkButton, PageHero, StatBand } from "@/components/site/ui";

export default function IndustryDetailPage({ slug }: { slug: string }) {
  const industry = INDUSTRIES.find((i) => i.slug === slug);

  if (!industry) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center px-4 pt-24 text-center">
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-900">Wilayah tidak ditemukan.</h1>
          <p className="mt-3 text-sm text-slate-900">Kami belum memetakan medan ini.</p>
          <div className="mt-6 flex justify-center">
            <LinkButton to="/industries" withArrow>
              Semua wilayah
            </LinkButton>
          </div>
        </div>
      </section>
    );
  }

  const idx = INDUSTRIES.findIndex((i) => i.slug === slug);
  const prev = INDUSTRIES[(idx - 1 + INDUSTRIES.length) % INDUSTRIES.length];
  const next = INDUSTRIES[(idx + 1) % INDUSTRIES.length];
  const relatedServices = industry.services
    .map((num) => SERVICES.find((s) => s.num === num))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <>
      <PageHero
        eyebrow="Industri"
        title={
          <>
            {industry.name.split(" & ")[0]}{" "}
            <span className="text-gradient-gold">{industry.name.split(" & ").slice(1).join(" & ") || industry.name.split(" ").slice(1).join(" ")}</span>
          </>
        }
        sub={
          <>
            {industry.enName ? (
              <span className="mb-2 block font-display text-[12px] font-semibold uppercase tracking-[0.28em] text-violet-700">
                {industry.enName}
              </span>
            ) : null}
            {industry.enTagline ? (
              <span className="mb-3 block text-[13px] italic text-slate-900">
                {industry.enTagline}
              </span>
            ) : null}
            {industry.tagline}
          </>
        }
        crumbs={[
          { label: "Beranda", to: "/" },
          { label: "Industri", to: "/industries" },
          { label: industry.name },
        ]}
        meta={industry.stats.map((s) => `${s.value} ${s.label.toLowerCase()}`)}
      >
        <LinkButton to="/contact" withArrow>
          Konsultasikan Wilayah Ini
        </LinkButton>
        <LinkButton to="/industries" variant="ghost">
          Lihat dua belas wilayah
        </LinkButton>
      </PageHero>

      {/* Description */}
      <section className="mx-auto max-w-4xl px-4 pb-8 sm:px-6" aria-label="Ikhtisar">
        {industry.description.map((para, i) => (
          <Reveal key={i} delay={i * 0.08}>
            <p className="mt-6 text-base leading-relaxed text-slate-600 sm:text-lg">{para}</p>
          </Reveal>
        ))}
      </section>

      <section className="mx-auto max-w-4xl px-4 sm:px-6" aria-label="Bukti di lapangan">
        <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-violet-500">
          Bukti di Lapangan
        </p>
        <StatBand stats={industry.stats} />
      </section>

      {/* Challenges */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8" aria-label="Tantangan">
        <SectionHeading
          eyebrow="Laporan Cuaca"
          title={
            <>
              Empat badai yang <span className="text-gradient-gold">sudah menimpa industri Anda.</span>
            </>
          }
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {industry.challenges.map((c, i) => (
            <Reveal key={c.title} delay={(i % 2) * 0.08} className="h-full">
              <article className="h-full rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/50">
                <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-violet-300 bg-violet-50 text-violet-600">
                  <AlertTriangle className="h-4.5 w-4.5" aria-hidden="true" />
                </span>
                <h3 className="font-display text-base font-bold text-slate-900">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{c.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Approach */}
      <section className="mx-auto max-w-4xl px-4 pb-12 sm:px-6" aria-label="Pendekatan kami">
        <SectionHeading
          eyebrow="Pendekatan Kami"
          title={
            <>
              Cara kami berlayar. <span className="text-gradient-gold">Keempat anginnya.</span>
            </>
          }
        />
        <ol className="mt-10 space-y-4">
          {industry.approach.map((a, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <li className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-blue-600 text-[13px] font-bold text-white">
                  {i + 1}
                </span>
                <p className="pt-1 text-[15px] leading-relaxed text-slate-600">{a}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* Councils + services */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8" aria-label="Dewan dan praktik untuk industri ini">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="flex items-center gap-2.5 font-display text-xl font-bold text-slate-900">
              <Compass className="h-5 w-5 text-violet-600" aria-hidden="true" />
              Dewan Terkait
            </h2>
            <div className="mt-5 space-y-3">
              {industry.councils.map((name, i) => (
                <Reveal key={name} delay={i * 0.07}>
                  <a
                    href={`#/councils/${slugify(name)}`}
                    className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:border-violet-500/50"
                  >
                    <span>
                      <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-500">
                        Penguasaan 150 tahun
                      </span>
                      <span className="mt-1 block font-display text-base font-bold text-slate-900">
                        {name}
                      </span>
                    </span>
                    <ArrowUpRight
                      className="h-5 w-5 shrink-0 text-slate-400 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-violet-600"
                      aria-hidden="true"
                    />
                  </a>
                </Reveal>
              ))}
            </div>
          </div>

          <div>
            <h2 className="flex items-center gap-2.5 font-display text-xl font-bold text-slate-900">
              <Compass className="h-5 w-5 text-violet-600" aria-hidden="true" />
              Praktik Terkait
            </h2>
            <div className="mt-5 space-y-3">
              {relatedServices.map((s, i) => (
                <Reveal key={s.num} delay={i * 0.07}>
                  <a
                    href={`#/services/${s.num}`}
                    className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:border-violet-500/50"
                  >
                    <span className="flex items-center gap-4">
                      <span className="font-display text-lg font-bold text-slate-400 transition-colors group-hover:text-violet-600/40">
                        {s.num}
                      </span>
                      <span className="font-display text-base font-bold text-slate-900">{s.title}</span>
                    </span>
                    <ArrowUpRight
                      className="h-5 w-5 shrink-0 text-slate-400 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-violet-600"
                      aria-hidden="true"
                    />
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Prev / next */}
      <nav
        className="mx-auto flex max-w-7xl flex-col items-stretch justify-between gap-4 px-4 pb-8 sm:flex-row sm:px-6 lg:px-8"
        aria-label="Navigasi industri"
      >
        <a
          href={`#/industries/${prev.slug}`}
          className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:border-violet-500/50"
        >
          <span className="text-2xl text-slate-400 transition-colors group-hover:text-violet-600" aria-hidden="true">
            ←
          </span>
          <span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-900">
              Wilayah sebelumnya
            </span>
            <span className="block font-display text-sm font-bold text-slate-700">{prev.name}</span>
          </span>
        </a>
        <a
          href={`#/industries/${next.slug}`}
          className="group flex items-center justify-end gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-right transition-all duration-300 hover:border-violet-500/50"
        >
          <span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-900">
              Wilayah berikutnya
            </span>
            <span className="block font-display text-sm font-bold text-slate-700">{next.name}</span>
          </span>
          <span className="text-2xl text-slate-400 transition-colors group-hover:text-violet-600" aria-hidden="true">
            →
          </span>
        </a>
      </nav>

      <CTABand />
    </>
  );
}
