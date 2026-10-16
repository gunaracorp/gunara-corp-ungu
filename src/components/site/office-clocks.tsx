"use client";

import { useEffect, useState } from "react";
import { Clock, MapPin, Navigation } from "lucide-react";
import { OFFICES } from "@/data/offices";
import { BRAND } from "@/data/brand";
import { Reveal, SectionHeading } from "@/components/landing/motion";

function useNow() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    let intervalId: number | undefined;
    // Defer the first tick so the effect body stays free of synchronous setState
    const raf = requestAnimationFrame(() => {
      setNow(new Date());
      intervalId = window.setInterval(() => setNow(new Date()), 30_000);
    });
    return () => {
      cancelAnimationFrame(raf);
      if (intervalId !== undefined) window.clearInterval(intervalId);
    };
  }, []);
  return now;
}

function formatTime(now: Date | null, timeZone: string) {
  if (!now) return "--:--";
  try {
    return new Intl.DateTimeFormat("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone,
      hour12: false,
    }).format(now);
  } catch {
    return "--:--";
  }
}

/**
 * Kantor Kami — empat lokasi resmi (Tasikmalaya I & II, Jakarta PHI Kwitang,
 * IPHI Pusat). Semua berbagi zona WIB; jam kantor ditampilkan per lokasi.
 */
export default function OfficeClocks() {
  const now = useNow();
  const wib = formatTime(now, "Asia/Jakarta");

  return (
    <section
      className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-28 lg:px-8"
      aria-label="Kantor kami"
    >
      <SectionHeading
        eyebrow="Kantor Kami — WIB"
        title={
          <>
            Empat pintu, satu standar layanan{" "}
            <span className="text-gradient-gold">terlengkap.</span>
          </>
        }
        sub="Datangi kantor kami di Tasikmalaya atau Jakarta — atau cukup satu pesan WhatsApp ke nomor bisnis resmi, tim kami yang bergerak menemui Anda."
      />

      {/* Jam WIB + jam operasional */}
      <Reveal delay={0.08}>
        <div className="glass mx-auto mt-10 flex max-w-2xl flex-wrap items-center justify-center gap-x-8 gap-y-3 rounded-2xl px-6 py-4 text-center">
          <span className="inline-flex items-center gap-2.5">
            <Clock className="h-4 w-4 text-violet-600" aria-hidden="true" />
            <span className="font-display text-2xl font-bold tabular-nums text-gradient-gold">
              {wib}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-900">
              Waktu Indonesia Barat
            </span>
          </span>
          <span className="hidden h-6 w-px bg-slate-100 sm:block" aria-hidden="true" />
          <span className="text-[12px] font-medium text-slate-500">
            Senin–Jumat 08.00–17.00 · Sabtu 08.00–14.00 WIB
          </span>
          <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-violet-600">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" aria-hidden="true" />
            WhatsApp 24/7 — {BRAND.phone}
          </span>
        </div>
      </Reveal>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {OFFICES.map((o, i) => (
          <Reveal key={o.city} delay={(i % 4) * 0.06} className="h-full">
            <article
              className={`group relative flex h-full flex-col gap-3 rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 ${
                o.flagship
                  ? "border-violet-500/50 bg-gradient-to-br from-violet-600/[0.09] to-transparent"
                  : "border-slate-200 bg-white hover:border-violet-300"
              }`}
            >
              {o.flagship ? (
                <span className="absolute right-4 top-4 rounded-full border border-violet-500/50 bg-violet-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-violet-600">
                  Kantor Pusat
                </span>
              ) : null}
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-violet-500">
                {o.country}
              </p>
              <h3 className="font-display text-lg font-bold text-slate-900">{o.city}</h3>
              <p className="flex items-start gap-1.5 text-[12px] leading-relaxed text-slate-900">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-600/60" aria-hidden="true" />
                {o.address}
              </p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(o.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex items-center gap-1.5 pt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-violet-700 transition-colors hover:text-violet-700"
              >
                <Navigation className="h-3 w-3" aria-hidden="true" />
                Buka di Maps
              </a>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
