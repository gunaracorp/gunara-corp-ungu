"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Clock, Gauge, Hourglass, Sparkles, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BRAND } from "@/data/brand";
import { EASE, SplitWords } from "./motion";

function WhatsAppGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

const SOLVING = [
  "NIB & OSS RBA.",
  "Pendirian PT & PMA.",
  "Izin BPOM & Halal.",
  "SNI & KITAS.",
  "Strategi & Ekspansi Global.",
];

const HERO_CHIPS = [
  { Icon: Users, label: "46 Dewan Pakar" },
  { Icon: Hourglass, label: "6.900 Tahun Pengalaman" },
  { Icon: Gauge, label: "99,97% Keberhasilan" },
  { Icon: Clock, label: "Respons ≤ 48 Jam" },
];

/* ------------------------------- Typewriter ------------------------------- */

function useTypewriter(words: string[]) {
  const [text, setText] = useState("");

  useEffect(() => {
    let w = 0;
    let c = 0;
    let deleting = false;
    let timer = 0;

    const tick = () => {
      const word = words[w];
      if (!deleting) {
        c++;
        setText(word.slice(0, c));
        if (c === word.length) {
          deleting = true;
          timer = window.setTimeout(tick, 1600);
          return;
        }
        timer = window.setTimeout(tick, 62);
      } else {
        c--;
        setText(word.slice(0, c));
        if (c === 0) {
          deleting = false;
          w = (w + 1) % words.length;
          timer = window.setTimeout(tick, 420);
          return;
        }
        timer = window.setTimeout(tick, 26);
      }
    };

    timer = window.setTimeout(tick, 600);
    return () => window.clearTimeout(timer);
  }, [words]);

  return text;
}

/* -------------------------------- Mandala --------------------------------- */

const MANDALA_RINGS = [
  { r: 58, n: 6, dot: 5, o: 0.95 },
  { r: 98, n: 12, dot: 4, o: 0.7 },
  { r: 138, n: 18, dot: 3.4, o: 0.5 },
  { r: 176, n: 10, dot: 3, o: 0.35 },
];

function Mandala() {
  return (
    <svg viewBox="0 0 400 400" className="h-full w-full" aria-hidden="true">
      <defs>
        <radialGradient id="core-gold" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stopColor="#ede9fe" />
          <stop offset="55%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#5b21b6" />
        </radialGradient>
      </defs>

      {MANDALA_RINGS.map((ring) => (
        <circle
          key={`guide-${ring.r}`}
          cx="200"
          cy="200"
          r={ring.r}
          fill="none"
          stroke="rgba(124,58,237,0.16)"
          strokeWidth="1"
          strokeDasharray="2 7"
        />
      ))}

      {MANDALA_RINGS.map((ring, ri) => (
        <g
          key={`dots-${ring.r}`}
          className={
            ri % 2 === 0
              ? "animate-[spin360_64s_linear_infinite]"
              : "animate-[spin-reverse360_78s_linear_infinite]"
          }
          style={{ transformOrigin: "200px 200px" }}
        >
          {Array.from({ length: ring.n }).map((_, i) => {
            const a = (i / ring.n) * Math.PI * 2;
            // Deterministic rounding prevents SSR/client float precision mismatch
            const cx = Number((200 + ring.r * Math.cos(a)).toFixed(2));
            const cy = Number((200 + ring.r * Math.sin(a)).toFixed(2));
            return (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r={ring.dot}
                fill="#a78bfa"
                opacity={ring.o}
              />
            );
          })}
        </g>
      ))}

      <circle
        cx="200"
        cy="200"
        r="34"
        fill="none"
        stroke="#a78bfa"
        strokeWidth="1"
        opacity="0.5"
        className="animate-[ping-slow_3.2s_ease-out_infinite]"
        style={{ transformOrigin: "200px 200px" }}
      />
      <circle cx="200" cy="200" r="26" fill="url(#core-gold)" opacity="0.95" />
      <path
        d="M200 185 L203.8 194.8 L214.3 195.4 L206.1 202 L208.8 212.1 L200 206.4 L191.2 212.1 L193.9 202 L185.7 195.4 L196.2 194.8 Z"
        fill="#07070a"
        opacity="0.85"
      />
    </svg>
  );
}

/* ---------------------------------- Hero ---------------------------------- */

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const typed = useTypewriter(SOLVING);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const yDrift = useTransform(scrollYProgress, [0, 1], [0, 170]);
  const yContent = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      id="top"
      className="noise-overlay relative flex min-h-[100svh] items-center justify-center overflow-hidden pb-24 pt-28"
      aria-label="PT TOP Konsultan Internasional — konsultan dan perizinan terlengkap di dunia"
    >
      {/* Grid backdrop */}
      <div
        className="grid-bg absolute inset-0 [mask-image:radial-gradient(ellipse_72%_62%_at_50%_42%,black_28%,transparent_78%)]"
        aria-hidden="true"
      />

      {/* Floating orbs */}
      <motion.div style={{ y: yDrift }} className="absolute inset-0" aria-hidden="true">
        <div className="absolute left-[6%] top-[16%] h-72 w-72 animate-float rounded-full bg-violet-600/15 blur-[110px]" />
        <div className="absolute right-[4%] top-[28%] h-80 w-80 animate-float-slow rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute bottom-[6%] left-[36%] h-64 w-64 animate-float rounded-full bg-indigo-50 blur-[100px]" />
      </motion.div>

      {/* 46-node Mandala */}
      <motion.div
        style={{ y: yDrift }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[min(92vw,640px)] w-[min(92vw,640px)] -translate-x-1/2 -translate-y-1/2"
        aria-hidden="true"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.82 }}
          animate={{ opacity: 0.24, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.5, ease: EASE }}
        >
          <Mandala />
        </motion.div>
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ y: yContent, opacity: fade }}
        className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6"
      >
        <div className="intro-rise" style={{ animationDelay: "0.05s" }}>
          <span className="inline-flex items-center gap-2.5 rounded-full border border-violet-300 bg-violet-600/[0.07] px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-violet-700">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            EST. 2001 — TASIKMALAYA · JAKARTA · MELAYANI 190 NEGARA
          </span>
        </div>

        <h1 className="mt-7 font-display text-[11.5vw] font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl">
          <span className="sr-only">
            Satu Gerbang untuk Segala Izin dan Kejayaan Bisnis Anda
          </span>
          <SplitWords text="Satu Gerbang untuk" delay={0.12} className="block text-slate-900" />
          <SplitWords text="Segala Izin dan" delay={0.2} className="block text-slate-900" />
          <SplitWords text="Kejayaan Bisnis Anda" delay={0.28} allGold className="block" />
        </h1>

        <p
          className="intro-rise mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-500 sm:text-lg"
          style={{ animationDelay: "0.3s" }}
        >
          Konsultan &amp; perizinan terlengkap di dunia — 46 Dewan Pakar internasional
          dengan 6.900 tahun pengalaman gabungan menuntaskan semua kebutuhan bisnis
          Anda,{" "}
          <span className="font-semibold text-slate-700">
            dari pendirian PT hingga penguasaan pasar di 190 negara.
          </span>
        </p>

        <p
          className="intro-fade mt-4 text-sm tracking-wide text-slate-900"
          style={{ animationDelay: "0.48s" }}
          aria-live="off"
        >
          Sedang menuntaskan:{" "}
          <span className="font-semibold text-violet-600">{typed}</span>
          <span className="animate-blink font-semibold text-violet-600" aria-hidden="true">
            ▍
          </span>
        </p>

        <div
          className="intro-fade-up mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row"
          style={{ animationDelay: "0.56s" }}
        >
          <a
            href="#/contact"
            className="shine inline-flex min-h-12 items-center gap-2.5 rounded-full bg-gradient-to-r from-violet-600 via-indigo-500 to-blue-600 px-8 py-3.5 text-sm font-bold text-white shadow-[0_12px_44px_-10px_rgba(139,92,246,0.8)] transition-transform duration-300 hover:scale-[1.04] active:scale-95"
          >
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Mulai Konsultasi
          </a>
          <a
            href={`https://wa.me/${BRAND.whatsappIntl}?text=${encodeURIComponent("Halo TOP Konsultan, saya ingin konsultasi perizinan bisnis.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center gap-2.5 rounded-full border border-emerald-300 bg-emerald-50 px-8 py-3.5 text-sm font-bold text-emerald-600 backdrop-blur transition-all duration-300 hover:border-emerald-500/60 hover:bg-emerald-100"
          >
            <WhatsAppGlyph />
            Chat WhatsApp
          </a>
          <a
            href="#/perizinan"
            className="inline-flex min-h-12 items-center gap-2.5 rounded-full border border-slate-300 bg-white px-8 py-3.5 text-sm font-semibold text-slate-700 backdrop-blur transition-all duration-300 hover:border-violet-500/60 hover:text-violet-600"
          >
            Jelajahi 36 Izin
          </a>
        </div>

        <ul
          className="intro-fade-up mt-10 flex flex-wrap items-center justify-center gap-2.5"
          style={{ animationDelay: "0.68s" }}
        >
          {HERO_CHIPS.map(({ Icon, label }) => (
            <li
              key={label}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200/90 bg-white/50 px-4 py-2 text-xs font-medium text-slate-500 backdrop-blur"
            >
              <Icon className="h-3.5 w-3.5 text-violet-600" aria-hidden="true" />
              {label}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Scroll cue */}
      <div
        className="intro-fade absolute bottom-7 left-1/2 z-10 -translate-x-1/2"
        style={{ animationDelay: "0.9s" }}
      >
        <a
          href="#benchmarks"
          aria-label="Gulir ke bawah untuk melihat konten"
          className="flex flex-col items-center gap-2 text-slate-900 transition-colors hover:text-violet-600"
        >
          <span className="text-[10px] font-semibold uppercase tracking-[0.4em]">Gulir</span>
          <span className="flex h-9 w-6 items-start justify-center rounded-full border border-current p-1.5">
            <span className="h-2 w-1 animate-bounce rounded-full bg-current" aria-hidden="true" />
          </span>
        </a>
      </div>
    </section>
  );
}
