"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BadgeCheck, BriefcaseBusiness, MapPin } from "lucide-react";
import { PERKS, ROLES } from "@/data/careers";
import { Reveal, SectionHeading } from "@/components/landing/motion";
import { CTABand, LinkButton, PageHero, StatBand } from "@/components/site/ui";

export default function CareersPage() {
  return (
    <>
      <PageHero
        eyebrow="Karier di TOP"
        title={
          <>
            Jenius mencari <span className="text-gradient-gold">jenius.</span>
          </>
        }
        sub="Firma tidak merekrut karyawan — firma mendidik calon maestro. Duduklah di dalam sesi bersama 150 tahun keahlian tersuling, dan tancapkan nama Anda pada putusan yang akan dirasakan dunia."
        crumbs={[{ label: "Beranda", to: "/" }, { label: "Karier" }]}
        meta={["10 hub dunia", "Pembinaan dewan pakar", "Kompensasi berbasis hasil"]}
      >
        <LinkButton to="/contact" withArrow>
          Perkenalkan diri Anda
        </LinkButton>
        <LinkButton to="/about" variant="ghost">
          Firma yang akan Anda masuki
        </LinkButton>
      </PageHero>

      <StatBand
        className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8"
        stats={[
          { value: "10", label: "hub dunia, satu paspor" },
          { value: "46", label: "disiplin ilmu untuk didalami" },
          { value: "18 bln", label: "rekor magang menuju mandat" },
        ]}
      />

      {/* Perks */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8" aria-label="Yang firma berikan">
        <SectionHeading
          eyebrow="Perjanjian kami"
          title={
            <>
              Yang kami <span className="text-gradient-gold">berikan kembali.</span>
            </>
          }
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PERKS.map((p, i) => (
            <Reveal key={p.title} delay={(i % 3) * 0.08} className="h-full">
              <article className="glass group h-full rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:gold-ring">
                <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-violet-300 bg-gradient-to-br from-violet-100 to-indigo-100 text-violet-600 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
                  <p.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="font-display text-lg font-bold text-slate-900">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{p.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Open mandates */}
      <section className="mx-auto max-w-5xl px-4 pb-24 sm:px-6" aria-label="Mandat terbuka">
        <SectionHeading
          eyebrow="Mandat terbuka"
          title={
            <>
              Delapan pintu menuju <span className="text-gradient-gold">firma.</span>
            </>
          }
          sub="Setiap mandat dinilai dari bukti, bukan seremoni. Lamar melalui Dewan — Mitra merespons dalam 48 jam, hukum firma."
        />

        <Reveal delay={0.1} className="mt-12">
          <Accordion type="single" collapsible className="space-y-3">
            {ROLES.map((r) => (
              <AccordionItem
                key={r.id}
                value={r.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white px-6 transition-colors data-[state=open]:border-violet-500/50"
              >
                <AccordionTrigger className="py-5 text-left hover:no-underline">
                  <span className="flex flex-col gap-1.5 pr-4">
                    <span className="font-display text-base font-bold text-slate-900 sm:text-lg">
                      {r.title}
                    </span>
                    <span className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-slate-900">
                      <span className="inline-flex items-center gap-1.5">
                        <BriefcaseBusiness className="h-3.5 w-3.5 text-violet-500" aria-hidden="true" />
                        {r.team}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-violet-500" aria-hidden="true" />
                        {r.location}
                      </span>
                      <span>
                        {r.type} · {r.level}
                      </span>
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-6">
                  <p className="text-sm leading-relaxed text-slate-500">{r.description}</p>
                  <h4 className="mt-5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-violet-600">
                    <BadgeCheck className="h-4 w-4" aria-hidden="true" />
                    Syarat dari firma
                  </h4>
                  <ul className="mt-3 space-y-2">
                    {r.requirements.map((req) => (
                      <li key={req} className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-500">
                        <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rotate-45 bg-violet-600" aria-hidden="true" />
                        {req}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    <LinkButton to={`/contact?role=${encodeURIComponent(r.title)}`} className="!px-5 !py-2.5 text-[13px]">
                      Lamar Sekarang
                    </LinkButton>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="mt-8 text-center text-sm text-slate-900">
            Tidak ada pintu yang setara jenius Anda?{" "}
            <a
              href="#/contact"
              className="font-semibold text-violet-600 underline decoration-violet-400/40 underline-offset-4 hover:text-violet-700"
            >
              Tulis mandat Anda sendiri
            </a>{" "}
            — firma memiliki sejarah menciptakan pintu yang belum pernah ada.
          </p>
        </Reveal>
      </section>

      <CTABand />
    </>
  );
}
