"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import { METHODOLOGY } from "@/data/content";
import { SectionHeading } from "./motion";

export default function Methodology() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 78%", "end 62%"],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 22 });

  return (
    <section
      id="method"
      className="cv-auto relative scroll-mt-20 overflow-hidden border-t border-slate-200 py-24 sm:py-28"
      aria-label="Metode Oracle"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Metode Oracle"
          title={
            <>
              Lima Gerakan. <span className="text-gradient-gold">Nol Kegagalan.</span>
            </>
          }
          sub="Setiap penugasan berjalan di atas protokol yang sama — tanpa ruang untuk tebakan, disempurnakan sepanjang 6.900 tahun pengalaman gabungan."
        />

        <div ref={ref} className="relative mx-auto mt-16 max-w-4xl">
          {/* Track */}
          <div
            className="absolute left-[22px] top-2 h-[calc(100%-16px)] w-px bg-slate-100 md:left-1/2"
            aria-hidden="true"
          />
          {/* Animated progress */}
          <motion.div
            style={{ scaleY }}
            className="absolute left-[22px] top-2 h-[calc(100%-16px)] w-px origin-top bg-gradient-to-b from-violet-600 via-indigo-500 to-blue-600 shadow-[0_0_14px_rgba(13,148,136,0.8)] md:left-1/2"
            aria-hidden="true"
          />

          {METHODOLOGY.map((m, i) => {
            const left = i % 2 === 0;
            return (
              <div
                key={m.step}
                className={`relative mb-8 flex md:mb-14 ${
                  left ? "md:justify-start" : "md:justify-end"
                }`}
              >
                {/* Node */}
                <span
                  className="absolute left-[22px] top-9 z-10 -translate-x-1/2 md:left-1/2"
                  aria-hidden="true"
                >
                  <span className="absolute -inset-1.5 animate-ping-slow rounded-full bg-violet-600/40" />
                  <span className="relative block h-4 w-4 rounded-full border-2 border-violet-500 bg-white shadow-[0_0_12px_rgba(13,148,136,0.9)]" />
                </span>

                <motion.div
                  initial={{ opacity: 0, y: 32, x: 0 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-90px" }}
                  transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
                  className="glass ml-12 w-full rounded-2xl p-6 sm:p-7 md:ml-0 md:w-[calc(50%-3.5rem)]"
                >
                  <span className="text-[11px] font-bold tracking-[0.34em] text-violet-600">
                    TAHAP {m.step}
                  </span>
                  <h3 className="mt-2 flex items-center gap-3 font-display text-xl font-bold text-slate-900">
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-violet-300 bg-violet-50 text-violet-600">
                      <m.icon className="h-[18px] w-[18px]" aria-hidden="true" />
                    </span>
                    {m.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-500">{m.desc}</p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
