import { STATS } from "@/data/content";
import { Counter, Reveal, SectionHeading } from "./motion";

export default function Stats() {
  return (
    <section className="cv-auto relative py-24 sm:py-28" aria-label="Angka-angka kunci">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Dalam Angka"
          title={
            <>
              Keahlian, <span className="text-gradient-gold">terukur.</span>
            </>
          }
          sub="Angka yang ditanggung langsung oleh 46 Dewan Pakar — total 6.900 tahun pengalaman gabungan."
        />

        <div className="mt-14 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-5">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="group glass h-full rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:gold-ring sm:p-7">
                <span className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-violet-300 bg-gradient-to-br from-violet-100 to-indigo-100 text-violet-600 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
                  <s.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <Counter
                  to={s.value}
                  prefix={s.prefix}
                  suffix={s.suffix}
                  decimals={s.decimals}
                  className="text-gradient-gold block font-display text-4xl font-bold tracking-tight sm:text-5xl"
                />
                <p className="mt-2 text-sm font-semibold text-slate-700">{s.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-900">{s.caption}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
