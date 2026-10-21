"use client";

import { ArrowUpRight, CheckCircle2, FileText, ScrollText, Target } from "lucide-react";
import { SERVICES } from "@/data/content";
import { SERVICE_DETAILS } from "@/data/service-details";
import { slugify } from "@/data/extended-types";
import { Reveal, SectionHeading } from "@/components/landing/motion";
import { CTABand, LinkButton, PageHero, StatBand } from "@/components/site/ui";

export default function ServiceDetailPage({ num }: { num: string }) {
  const service = SERVICES.find((s) => s.num === num);
  const detail = SERVICE_DETAILS.find((d) => d.num === num);

  if (!service || !detail) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center px-4 pt-24 text-center">
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-900">Praktik tidak ditemukan.</h1>
          <p className="mt-3 text-sm text-slate-900">
            Ruang dewan tidak memiliki catatan atas praktik ini.
          </p>
          <div className="mt-6 flex justify-center">
            <LinkButton to="/services" withArrow>
              Lihat dua belas praktik
            </LinkButton>
          </div>
        </div>
      </section>
    );
  }

  const idx = SERVICES.findIndex((s) => s.num === num);
  const prev = SERVICES[(idx - 1 + SERVICES.length) % SERVICES.length];
  const next = SERVICES[(idx + 1) % SERVICES.length];

  const enKickline = Array.from(
    new Set([service.enName, detail.enName].filter((v): v is string => Boolean(v)))
  ).join(" · ");

  return (
    <>
      <PageHero
        eyebrow={`Praktik ${service.num} dari 12`}
        title={
          <>
            {service.title.split(" ").slice(0, -1).join(" ")}{" "}
            <span className="text-gradient-gold">
              {service.title.split(" ").slice(-1)}
            </span>
          </>
        }
        sub={
          <>
            {enKickline ? (
              <span className="mb-3 block font-display text-[12px] font-semibold uppercase tracking-[0.28em] text-violet-700">
                {enKickline}
              </span>
            ) : null}
            {service.desc}
          </>
        }
        crumbs={[
          { label: "Beranda", to: "/" },
          { label: "Praktik", to: "/services" },
          { label: service.title },
        ]}
        meta={detail.kpis.map((k) => `${k.value} ${k.label.toLowerCase()}`)}
      >
        <LinkButton to="/contact" withArrow>
          Konsultasikan Praktik Ini
        </LinkButton>
        <LinkButton to="/councils" variant="ghost">
          Dewan di baliknya
        </LinkButton>
      </PageHero>

      {/* Overview */}
      <section className="mx-auto max-w-4xl px-4 pb-6 sm:px-6" aria-label="Ikhtisar">
        {detail.overview.map((para, i) => (
          <Reveal key={i} delay={i * 0.08}>
            <p className="mt-6 text-base leading-relaxed text-slate-600 sm:text-lg">{para}</p>
          </Reveal>
        ))}
      </section>

      <section className="mx-auto max-w-4xl px-4 sm:px-6" aria-label="KPI hasil">
        <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-violet-500">
          KPI Hasil
        </p>
        <StatBand stats={detail.kpis} />
      </section>

      {/* Capabilities + deliverables */}
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:px-8" aria-label="Kapabilitas dan luaran">
        <Reveal className="h-full">
          <div className="glass h-full rounded-3xl p-7 sm:p-8">
            <h2 className="flex items-center gap-3 font-display text-xl font-bold text-slate-900">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-violet-300 bg-violet-50 text-violet-600">
                <Target className="h-5 w-5" aria-hidden="true" />
              </span>
              Kapabilitas
            </h2>
            <ul className="mt-6 space-y-3.5">
              {detail.capabilities.map((c) => (
                <li key={c} className="flex items-start gap-3 text-[15px] leading-relaxed text-slate-600">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-violet-600" aria-hidden="true" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="h-full">
          <div className="glass h-full rounded-3xl p-7 sm:p-8">
            <h2 className="flex items-center gap-3 font-display text-xl font-bold text-slate-900">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-violet-300 bg-violet-50 text-violet-600">
                <FileText className="h-5 w-5" aria-hidden="true" />
              </span>
              Luaran
            </h2>
            <ul className="mt-6 space-y-3.5">
              {detail.deliverables.map((d, i) => (
                <li key={d} className="flex items-start gap-3.5 text-[15px] leading-relaxed text-slate-600">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-violet-500/50 text-[11px] font-bold text-violet-600">
                    {i + 1}
                  </span>
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>

      {/* Protocol */}
      <section className="mx-auto max-w-4xl px-4 pb-10 sm:px-6" aria-label="Alur penugasan">
        <SectionHeading
          eyebrow="Protokol Penugasan"
          title={
            <>
              Bagaimana penugasan <span className="text-gradient-gold">berjalan.</span>
            </>
          }
        />
        <ol className="mt-10 space-y-4">
          {detail.protocol.map((p, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <li className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-blue-600 text-[13px] font-bold text-white">
                  {i + 1}
                </span>
                <p className="pt-1 text-[15px] leading-relaxed text-slate-600">{p}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* Related councils */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8" aria-label="Dewan di balik praktik ini">
        <SectionHeading
          eyebrow="Dewan Terkait"
          title={
            <>
              Dikerahkan untuk <span className="text-gradient-gold">penugasan ini.</span>
            </>
          }
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {detail.relatedCouncils.map((name, i) => (
            <Reveal key={name} delay={i * 0.08} className="h-full">
              <a
                href={`#/councils/${slugify(name)}`}
                className="group flex h-full items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/50"
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
      </section>

      {/* Prev / next */}
      <nav
        className="mx-auto flex max-w-7xl flex-col items-stretch justify-between gap-4 px-4 pb-8 sm:flex-row sm:px-6 lg:px-8"
        aria-label="Navigasi praktik"
      >
        <a
          href={`#/services/${prev.num}`}
          className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:border-violet-500/50"
        >
          <span className="text-2xl text-slate-400 transition-colors group-hover:text-violet-600" aria-hidden="true">
            ←
          </span>
          <span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-900">
              Praktik sebelumnya
            </span>
            <span className="block font-display text-sm font-bold text-slate-700">{prev.title}</span>
          </span>
        </a>
        <a
          href={`#/services/${next.num}`}
          className="group flex items-center justify-end gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-right transition-all duration-300 hover:border-violet-500/50"
        >
          <span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-900">
              Praktik berikutnya
            </span>
            <span className="block font-display text-sm font-bold text-slate-700">{next.title}</span>
          </span>
          <span className="text-2xl text-slate-400 transition-colors group-hover:text-violet-600" aria-hidden="true">
            →
          </span>
        </a>
      </nav>

      <Reveal className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
          <ScrollText className="h-3.5 w-3.5" aria-hidden="true" />
          Praktik {service.num} · {service.title} · Disidangkan di bawah Piagam GUNARA 2001
        </div>
      </Reveal>

      <CTABand />
    </>
  );
}
