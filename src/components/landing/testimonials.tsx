"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useEffect, useState } from "react";
import { TESTIMONIALS } from "@/data/content";
import { EASE, SectionHeading } from "./motion";

export default function Testimonials() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = TESTIMONIALS.length;

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => setIdx((i) => (i + 1) % total), 5200);
    return () => window.clearInterval(id);
  }, [paused, total]);

  const current = TESTIMONIALS[idx];

  return (
    <section
      className="cv-auto relative border-t border-slate-200 py-24 sm:py-28"
      aria-label="Testimoni klien"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Apa kata dunia"
          title={
            <>
              Kata mereka yang pernah <span className="text-gradient-gold">menang.</span>
            </>
          }
        />

        <div
          className="relative mt-12"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <Quote
            className="mx-auto h-10 w-10 text-violet-600/60"
            aria-hidden="true"
          />

          <div className="mt-6 min-h-[190px] sm:min-h-[160px]" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.figure
                key={idx}
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -26 }}
                transition={{ duration: 0.55, ease: EASE }}
                className="text-center"
              >
                <blockquote className="mx-auto max-w-3xl font-display text-xl font-medium leading-relaxed text-slate-900 sm:text-2xl">
                  &ldquo;{current.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-7 flex items-center justify-center gap-4">
                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-500 font-display text-sm font-bold text-white"
                    aria-hidden="true"
                  >
                    {current.initials}
                  </span>
                  <span className="text-left">
                    <span className="block text-sm font-bold text-slate-900">{current.name}</span>
                    <span className="block text-xs text-slate-900">{current.role}</span>
                  </span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="mt-8 flex items-center justify-center gap-6">
            <button
              type="button"
              onClick={() => setIdx((i) => (i - 1 + total) % total)}
              aria-label="Sebelumnya"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-all hover:border-violet-500/60 hover:text-violet-600"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <div className="flex gap-1" role="tablist" aria-label="Pilih testimoni">
              {TESTIMONIALS.map((t, i) => (
                <button
                  key={t.name}
                  type="button"
                  role="tab"
                  aria-selected={i === idx}
                  aria-label={`Testimoni dari ${t.name}`}
                  onClick={() => setIdx(i)}
                  className="group flex h-6 w-6 items-center justify-center"
                >
                  <span
                    className={`h-2 rounded-full transition-all duration-400 ${
                      i === idx
                        ? "w-8 bg-gradient-to-r from-violet-600 to-blue-600"
                        : "w-2 bg-zinc-700 group-hover:bg-zinc-500"
                    }`}
                  />
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setIdx((i) => (i + 1) % total)}
              aria-label="Berikutnya"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-all hover:border-violet-500/60 hover:text-violet-600"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
