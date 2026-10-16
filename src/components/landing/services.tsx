import { ArrowRight, ArrowUpRight } from "lucide-react";
import { SERVICES } from "@/data/content";
import { Reveal, SectionHeading } from "./motion";

export default function Services() {
  return (
    <section
      id="services"
      className="cv-auto relative scroll-mt-20 overflow-hidden border-t border-slate-200 py-24 sm:py-28"
      aria-label="Layanan"
    >
      <div
        className="pointer-events-none absolute -right-40 top-24 h-96 w-96 rounded-full bg-violet-600/[0.06] blur-[130px]"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Hulu ke Hilir — Strategi hingga Eksekusi"
          title={
            <>
              Setiap bidang. <span className="text-gradient-gold">Satu komando.</span>
            </>
          }
          sub="Dua Belas Praktik, satu pikiran terpadu. Di mana firma lain menyerahkan tugas, kami meneruskannya — dari masukan hulu paling mendasar hingga hasil hilir paling matang."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Reveal key={s.num} delay={(i % 3) * 0.08} className="h-full">
              <a
                href={`#/services/${s.num}`}
                aria-label={`Buka praktik ${s.title}`}
                className="group relative block h-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-violet-500/50 hover:shadow-[0_24px_60px_-24px_rgba(139,92,246,0.22)]"
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

                <h3 className="font-display text-lg font-bold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{s.desc}</p>

                <ul className="mt-5 flex flex-wrap gap-2">
                  {s.tags.map((t) => (
                    <li
                      key={t}
                      className="rounded-full border border-slate-300/70 px-2.5 py-1 text-[11px] font-medium text-slate-900 transition-colors group-hover:border-violet-300 group-hover:text-violet-700/80"
                    >
                      {t}
                    </li>
                  ))}
                </ul>

                <span className="mt-5 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-violet-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Lihat detail
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.12}>
          <p className="mt-10 text-center">
            <a
              href="#/services"
              className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-violet-600 transition-colors hover:text-violet-700"
            >
              Jelajahi Dua Belas Praktik secara mendalam
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
