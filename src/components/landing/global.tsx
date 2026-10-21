import { MapPin } from "lucide-react";
import { HUBS } from "@/data/content";
import { Reveal, SectionHeading } from "./motion";

export default function GlobalReach() {
  return (
    <section
      className="cv-auto relative overflow-hidden border-t border-slate-200 py-24 sm:py-28"
      aria-label="Jangkauan global"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <SectionHeading
            align="left"
            eyebrow="Kehadiran global"
            title={
              <>
                Dari Jakarta untuk <span className="text-gradient-gold">Dunia.</span>
              </>
            }
            sub="Para Dewan bekerja sebagai satu organisme yang mengikuti matahari — dari Jakarta, London, hingga New York — menjangkau 190 negara. Di mana pun Anda berada, Mitra Utama senior kami selalu terjaga, dan sudah memikirkan persoalan Anda."
          />

          <Reveal delay={0.2}>
            <ul className="mt-9 flex flex-wrap gap-2.5">
              {HUBS.map((h, i) => (
                <li
                  key={h.name}
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/50 px-3.5 py-2 text-xs font-medium text-slate-500 transition-colors hover:border-violet-500/50 hover:text-violet-600"
                >
                  <MapPin className="h-3 w-3 text-violet-600" aria-hidden="true" />
                  {i === 0 ? `Markas Global — ${h.name}` : h.name}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.3}>
            <p className="mt-8 flex items-center gap-2.5 text-sm text-slate-900">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" aria-hidden="true" />
              24/7/365 — matahari tak pernah terbenam di atas para Dewan.
            </p>
          </Reveal>
        </div>

        {/* Globe */}
        <Reveal delay={0.15} scale={0.92}>
          <div className="relative mx-auto h-[340px] w-[340px] sm:h-[440px] sm:w-[440px]">
            {/* Sphere */}
            <div
              className="absolute inset-0 rounded-full border border-violet-200 bg-[radial-gradient(circle_at_32%_28%,rgba(167,139,250,0.35),rgba(255,255,255,0.6)_62%)]"
              aria-hidden="true"
            />
            {/* Longitudes (rotating) */}
            <svg
              viewBox="0 0 200 200"
              className="absolute inset-0 h-full w-full animate-[spin360_70s_linear_infinite]"
              aria-hidden="true"
            >
              {[34, 62, 86].map((rx) => (
                <ellipse
                  key={rx}
                  cx="100"
                  cy="100"
                  rx={rx}
                  ry="98"
                  fill="none"
                  stroke="rgba(124,58,237,0.16)"
                  strokeWidth="0.7"
                />
              ))}
            </svg>
            {/* Latitudes (static) */}
            <svg
              viewBox="0 0 200 200"
              className="absolute inset-0 h-full w-full"
              aria-hidden="true"
            >
              {[34, 62, 86].map((ry) => (
                <ellipse
                  key={ry}
                  cx="100"
                  cy="100"
                  rx="98"
                  ry={ry}
                  fill="none"
                  stroke="rgba(124,58,237,0.14)"
                  strokeWidth="0.7"
                />
              ))}
            </svg>
            {/* Orbiting satellite */}
            <div
              className="absolute -inset-3 animate-[spin360_15s_linear_infinite]"
              aria-hidden="true"
            >
              <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500 shadow-[0_0_14px_rgba(124,58,237,0.6)]" />
            </div>
            {/* Hub dots */}
            {HUBS.map((h, i) => (
              <span
                key={h.name}
                className="absolute"
                style={{ left: `${h.x}%`, top: `${h.y}%` }}
              >
                <span
                  className="absolute -inset-1.5 animate-ping-slow rounded-full bg-violet-600/40"
                  aria-hidden="true"
                />
                <span className="relative block h-2 w-2 rounded-full bg-violet-500 shadow-[0_0_10px_rgba(124,58,237,0.55)]" />
                <span className="absolute left-3.5 top-[-4px] whitespace-nowrap text-[10px] font-semibold text-slate-500">
                  {i === 0 ? "Markas Global" : h.name}
                </span>
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
