import { BadgeCheck } from "lucide-react";
import { BENCHMARKS } from "@/data/content";
import { Reveal } from "./motion";

export default function BenchmarkMarquee() {
  const doubled = [...BENCHMARKS, ...BENCHMARKS];

  return (
    <section
      id="benchmarks"
      className="cv-auto relative scroll-mt-20 border-y border-violet-200 bg-white/70 py-10"
      aria-label="Tolok ukur industri yang kami lampaui"
    >
      <Reveal className="mb-8 px-4 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-slate-900">
          Tolok ukur yang kamijadikan acuan — lalu kami melampauinya
        </p>
      </Reveal>

      <div className="mask-fade-x group relative overflow-hidden">
        <div className="flex w-max animate-marquee items-center gap-14 pr-14 group-hover:[animation-play-state:paused]">
          {doubled.map((b, i) => (
            <div
              key={`${b}-${i}`}
              className="flex items-center gap-2.5"
              aria-hidden={i >= BENCHMARKS.length}
            >
              <span className="whitespace-nowrap font-display text-lg font-semibold text-slate-900 transition-colors hover:text-slate-700">
                {b}
              </span>
              <BadgeCheck
                className="h-[18px] w-[18px] shrink-0 text-violet-500"
                aria-label="terlampaui"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
