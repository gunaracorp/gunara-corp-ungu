"use client";

import { ArrowUpRight } from "lucide-react";
import { SERVICES } from "@/data/content";
import { SERVICE_DETAILS } from "@/data/service-details";
import { Reveal } from "@/components/landing/motion";
import { CTABand, LinkButton, PageHero } from "@/components/site/ui";

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="12 Praktik Layanan"
        title={
          <>
            Dua Belas Praktik. <span className="text-gradient-gold">Satu Standar: Mutlak.</span>
          </>
        }
        sub="Dua belas praktik, satu pikir terpadu. Saat firma lain menyerahkan tangan, kami meneruskan — dari input hulu yang paling mentah hingga luaran hilir yang paling matang."
        crumbs={[{ label: "Beranda", to: "/" }, { label: "Praktik" }]}
        meta={["Hulu → hilir", "Satu Partner-in-Chief", "Wawasan pertama 48 jam"]}
      />

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8" aria-label="Semua praktik">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => {
            const detail = SERVICE_DETAILS.find((d) => d.num === s.num);
            return (
              <Reveal key={s.num} delay={(i % 3) * 0.07} className="h-full">
                <a
                  href={`#/services/${s.num}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-violet-500/50 hover:shadow-[0_24px_60px_-24px_rgba(139,92,246,0.22)]"
                  aria-label={`Buka praktik ${s.title}`}
                >
                  <span
                    className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/80 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    aria-hidden="true"
                  />
                  <span
                    className="absolute right-5 top-4 font-display text-4xl font-bold text-slate-900/10 transition-colors duration-300 group-hover:text-violet-600/30"
                    aria-hidden="true"
                  >
                    {s.num}
                  </span>

                  <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-violet-300 bg-gradient-to-br from-violet-100 to-indigo-100 text-violet-600 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
                    <s.icon className="h-5 w-5" aria-hidden="true" />
                  </span>

                  <h2 className="font-display text-lg font-bold text-slate-900">{s.title}</h2>
                  {s.enName ? (
                    <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                      {s.enName}
                    </p>
                  ) : null}
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500">{s.desc}</p>

                  {detail ? (
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {detail.capabilities.slice(0, 3).map((c) => (
                        <li
                          key={c}
                          className="rounded-full border border-slate-300/70 px-2.5 py-1 text-[11px] font-medium text-slate-900 transition-colors group-hover:border-violet-300 group-hover:text-violet-700/80"
                        >
                          {c}
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  <span className="mt-5 inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.18em] text-violet-700">
                    Lihat detail
                    <ArrowUpRight
                      className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </a>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.15}>
          <div className="mt-14 flex flex-col items-center gap-5 rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-600/[0.06] to-transparent p-8 text-center sm:p-10">
            <p className="max-w-2xl font-display text-xl italic leading-relaxed text-slate-700 sm:text-2xl">
              &ldquo;Saat firma lain menyerahkan tangan, kami meneruskan.&rdquo;
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <LinkButton to="/contact" withArrow>
                Tugaskan sebuah praktik
              </LinkButton>
              <LinkButton to="/layanan" variant="ghost">
                Jelajahi katalog 120+ layanan
              </LinkButton>
              <LinkButton to="/councils" variant="ghost">
                Lihat 46 Dewan di baliknya
              </LinkButton>
            </div>
          </div>
        </Reveal>
      </section>

      <CTABand />
    </>
  );
}
