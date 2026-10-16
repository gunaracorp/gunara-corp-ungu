import { CheckCircle2 } from "lucide-react";
import { ABOUT_CARDS, ABOUT_POINTS } from "@/data/content";
import { Reveal, SectionHeading, TiltCard } from "./motion";

export default function About() {
  return (
    <section id="about" className="relative scroll-mt-20 py-24 sm:py-28" aria-label="Tentang PT TOP Konsultan Internasional">
      {/* ambient glow */}
      <div
        className="pointer-events-none absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-violet-600/[0.07] blur-[130px]"
        aria-hidden="true"
      />

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
        <div>
          <SectionHeading
            align="left"
            eyebrow="Perusahaan"
            title={
              <>
                Bukan sekadar konsultan.{" "}
                <span className="text-gradient-gold">Satu jawaban terpadu.</span>
              </>
            }
            sub="Di mana firma lain menyusun tim proyek, kami menyatukan 46 Dewan Pakar internasional yang berdeliberasi sebagai satu pikiran: satu jawaban terpadu dari 46 disiplin — strategi hulu hingga eksekusi hilir, dan perizinan end-to-end untuk bisnis Anda."
          />

          <ul className="mt-9 space-y-4">
            {ABOUT_POINTS.map((p, i) => (
              <Reveal key={p} delay={0.1 + i * 0.07}>
                <li className="flex items-start gap-3 text-[15px] leading-relaxed text-slate-600">
                  <CheckCircle2
                    className="mt-0.5 h-5 w-5 shrink-0 text-violet-600"
                    aria-hidden="true"
                  />
                  {p}
                </li>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={0.4}>
            <blockquote className="mt-10 border-l-2 border-violet-500/60 pl-5">
              <p className="font-display text-lg italic leading-relaxed text-slate-700">
                &ldquo;Berikan kami 46 menit. 46 Dewan Pakar akan memberikan Anda
                dekade berikutnya.&rdquo;
              </p>
              <cite className="mt-2 block text-xs font-semibold uppercase tracking-[0.25em] text-slate-900 not-italic">
                — Piagam Pendirian, Pasal 1
              </cite>
            </blockquote>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
          {ABOUT_CARDS.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.09} className="h-full">
              <TiltCard className="h-full">
                <div className="glass group flex h-full flex-col gap-4 rounded-2xl p-6 transition-all duration-300 hover:gold-ring">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-violet-300 bg-gradient-to-br from-violet-100 to-indigo-100 text-violet-600 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
                    <c.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-display text-base font-bold text-slate-900">{c.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">{c.desc}</p>
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
