import { ArrowUpRight } from "lucide-react";
import { CASES } from "@/data/content";
import { Counter, Reveal, SectionHeading } from "./motion";

export default function Results() {
  return (
    <section
      id="results"
      className="cv-auto relative scroll-mt-20 border-t border-slate-200 py-24 sm:py-28"
      aria-label="Hasil studi kasus"
    >
      <div
        className="pointer-events-none absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-violet-600/[0.06] blur-[130px]"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Bukti, bukan janji"
          title={
            <>
              Hasil yang <span className="text-gradient-gold">Berbicara.</span>
            </>
          }
          sub="Sebagian kecil dari 12.000+ penugasan. Nama klien dianonimkan — atas permintaan mereka; angkanya sudah cukup berbicara."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {CASES.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.09} className="h-full">
              <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-violet-500/50 hover:shadow-[0_24px_60px_-24px_rgba(13,148,136,0.22)]">
                <span
                  className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/80 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  aria-hidden="true"
                />
                <Counter
                  to={c.value}
                  prefix={c.prefix}
                  suffix={c.suffix}
                  decimals={c.decimals}
                  className="text-gradient-gold block font-display text-4xl font-bold tracking-tight"
                />
                <h3 className="mt-4 flex items-start justify-between gap-2 font-display text-base font-bold text-slate-900">
                  {c.title}
                  <ArrowUpRight
                    className="h-4 w-4 shrink-0 text-slate-400 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-violet-600"
                    aria-hidden="true"
                  />
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-900">{c.desc}</p>
                <span className="mt-5 inline-flex w-fit rounded-full border border-violet-300 bg-violet-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-violet-600">
                  {c.tag}
                </span>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
