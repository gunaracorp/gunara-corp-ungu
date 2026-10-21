"use client";

import { motion } from "framer-motion";
import { Compass } from "lucide-react";
import { EASE } from "@/components/landing/motion";
import { LinkButton, Ornament } from "@/components/site/ui";

const WAYPOINTS = [
  { to: "/councils", label: "46 Dewan Pakar" },
  { to: "/services", label: "Dua Belas Praktik" },
  { to: "/insights", label: "Wawasan" },
  { to: "/about", label: "Tentang Kami" },
  { to: "/contact", label: "Hubungi Kami" },
];

export default function NotFoundPage() {
  return (
    <section className="noise-overlay relative flex min-h-[92vh] items-center justify-center overflow-hidden px-4 py-32">
      <div
        className="grid-bg absolute inset-0 [mask-image:radial-gradient(ellipse_65%_60%_at_50%_45%,black_25%,transparent_80%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 h-96 w-[700px] -translate-x-1/2 rounded-full bg-violet-600/[0.07] blur-[140px]"
        aria-hidden="true"
      />
      <div className="relative z-10 flex max-w-2xl flex-col items-center text-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="inline-flex h-20 w-20 items-center justify-center rounded-full border border-violet-300 bg-violet-50 text-violet-600"
        >
          <Compass className="h-9 w-9" aria-hidden="true" />
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.12, ease: EASE }}
          className="mt-8 font-display text-5xl font-bold text-slate-900 sm:text-6xl"
        >
          404 — Halaman <span className="text-gradient-gold">Tidak Ditemukan.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.22, ease: EASE }}
          className="mt-5 max-w-md text-base leading-relaxed text-slate-500"
        >
          Jalur ini tidak ada di peta kami. Namun 46 Dewan Pakar selalu tahu
          jalan.
        </motion.p>

        <Ornament className="mt-8" />

        <motion.nav
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.32, ease: EASE }}
          className="mt-8 flex flex-wrap items-center justify-center gap-2.5"
          aria-label="Jalur kembali"
        >
          {WAYPOINTS.map((w) => (
            <a
              key={w.to}
              href={`#${w.to}`}
              className="inline-flex min-h-11 items-center rounded-full border border-slate-200 bg-white/50 px-5 py-2 text-sm font-medium text-slate-600 backdrop-blur transition-all duration-300 hover:border-violet-500/60 hover:text-violet-600"
            >
              {w.label}
            </a>
          ))}
        </motion.nav>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="mt-10"
        >
          <LinkButton to="/" withArrow>
            Kembali ke Beranda
          </LinkButton>
        </motion.div>
      </div>
    </section>
  );
}
