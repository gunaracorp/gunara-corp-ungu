"use client";

/**
 * Area VVIP — lounge eksklusif Member VVIP untuk mengakses Oracle AI.
 * URL-nya sengaja tidak ditautkan dari navigasi publik; akses dibagikan
 * personal oleh tim TOP bersama kode akses (rotasi via VVIP_ACCESS_CODE).
 */

import { motion } from "framer-motion";
import {
  Crown,
  Gem,
  Lock,
  LogOut,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { BRAND } from "@/data/brand";
import OracleChat from "@/components/landing/oracle-chat";

const STORAGE_KEY = "topkonsultan_vvip_code";

type Phase = "checking" | "locked" | "unlocked";

export default function VvipPage() {
  const [phase, setPhase] = useState<Phase>("checking");
  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorTick, setErrorTick] = useState(0);

  async function verify(candidate: string) {
    setVerifying(true);
    setError(null);
    try {
      const res = await fetch("/api/vvip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: candidate }),
      });
      if (res.ok) {
        window.sessionStorage.setItem(STORAGE_KEY, candidate.trim());
        setPhase("unlocked");
        return;
      }
      window.sessionStorage.removeItem(STORAGE_KEY);
      setError(
        res.status === 403
          ? "Kode akses tidak dikenal. Pastikan Anda memakai kode terbaru dari tim TOP."
          : "Masukkan kode akses VVIP Anda terlebih dahulu."
      );
      setErrorTick((t) => t + 1);
      setPhase("locked");
      setCode("");
    } catch {
      window.sessionStorage.removeItem(STORAGE_KEY);
      setError("Sinyal terputus. Periksa koneksi lalu coba sekali lagi.");
      setErrorTick((t) => t + 1);
      setPhase("locked");
    } finally {
      setVerifying(false);
    }
  }

  useEffect(() => {
    const saved = window.sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      // Re-verifikasi ke server: kode mungkin sudah di-rotate oleh tim TOP.
      void verify(saved);
    } else {
      setPhase("locked");
    }
  }, []);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!code.trim() || verifying) return;
    void verify(code);
  }

  function lockSession() {
    window.sessionStorage.removeItem(STORAGE_KEY);
    setCode("");
    setError(null);
    setPhase("locked");
  }

  return (
    <section className="noise-overlay relative overflow-hidden bg-zinc-950 text-white">
      {/* Suasana lounge: cahaya violet-indigo di ruang gelap */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[26rem] w-[46rem] -translate-x-1/2 rounded-full bg-violet-600/25 blur-[130px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-indigo-600/20 blur-[110px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-24 top-1/3 h-64 w-64 rounded-full bg-blue-600/15 blur-[100px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex min-h-[100svh] w-full max-w-3xl flex-col items-center px-5 pb-24 pt-36 sm:pt-40">
        {/* ── Gerbang: belum terverifikasi ─────────────────────────────── */}
        {phase !== "unlocked" && (
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="my-auto flex w-full flex-col items-center text-center"
          >
            <span className="inline-flex items-center gap-2.5 rounded-full border border-violet-400/30 bg-violet-500/10 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-violet-300">
              <Gem className="h-3.5 w-3.5" aria-hidden="true" />
              Area Eksklusif Member VVIP
            </span>

            <h1 className="mt-7 font-display text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl">
              <span className="bg-gradient-to-r from-violet-300 via-indigo-300 to-blue-300 bg-clip-text text-transparent">
                Oracle
              </span>
            </h1>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-zinc-400">
              Suara tersatukan 46 Dewan Pakar — konsultasi tanpa batas 24/7.
              Hanya untuk tangan terpilih: para Member VVIP PT TOP KONSULTAN
              INTERNASIONAL.
            </p>

            <motion.div
              key={errorTick}
              initial={error ? { x: 0 } : false}
              animate={error ? { x: [0, -10, 10, -6, 6, 0] } : { x: 0 }}
              transition={{ duration: 0.45 }}
              className="mt-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-xl"
            >
              <div className="flex flex-col items-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-500 shadow-[0_14px_44px_-10px_rgba(139,92,246,0.55)]">
                  <Lock className="h-6 w-6" aria-hidden="true" />
                </span>
                <h2 className="mt-4 font-display text-lg font-bold tracking-wide">
                  Masukkan Kode Akses VVIP
                </h2>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-zinc-500">
                  Kode dibagikan personal oleh tim TOP melalui WhatsApp resmi.
                  Sesi berakhir otomatis saat tab ditutup — aman di perangkat apa pun.
                </p>
              </div>

              <form onSubmit={onSubmit} className="mt-6 space-y-3">
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="TOP-VVIP-XXXX"
                  aria-label="Kode akses VVIP"
                  autoComplete="off"
                  spellCheck={false}
                  className="h-12 w-full rounded-xl border border-white/10 bg-zinc-900/80 px-4 text-center font-mono text-sm font-semibold uppercase tracking-[0.25em] text-white placeholder:tracking-[0.2em] placeholder:text-zinc-600 outline-none transition-all focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/25"
                />
                <button
                  type="submit"
                  disabled={!code.trim() || verifying}
                  className="shine inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-500 to-blue-600 px-7 text-sm font-bold text-white shadow-[0_14px_44px_-10px_rgba(139,92,246,0.5)] transition-transform duration-300 hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {verifying ? (
                    "Memverifikasi…"
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" aria-hidden="true" />
                      Buka Akses Oracle
                    </>
                  )}
                </button>
                {error && (
                  <p role="alert" className="text-center text-[12.5px] font-medium text-red-400">
                    {error}
                  </p>
                )}
              </form>
            </motion.div>

            <p className="mt-8 text-[12.5px] text-zinc-500">
              Belum menjadi Member VVIP?{" "}
              <a
                href={BRAND.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-semibold text-violet-300 transition-colors hover:text-violet-200"
              >
                <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                Ajukan kandidatur via WhatsApp
              </a>
            </p>
          </motion.div>
        )}

        {/* ── Lounge: akses terbuka ────────────────────────────────────── */}
        {phase === "unlocked" && (
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex w-full flex-col items-center text-center"
          >
            <span className="inline-flex items-center gap-2.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-emerald-300">
              <Crown className="h-3.5 w-3.5" aria-hidden="true" />
              Akses VVIP Aktif
            </span>

            <h1 className="mt-6 font-display text-3xl font-black tracking-tight sm:text-4xl">
              Selamat datang di{" "}
              <span className="bg-gradient-to-r from-violet-300 via-indigo-300 to-blue-300 bg-clip-text text-transparent">
                Lounge Oracle
              </span>
            </h1>
            <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-zinc-400">
              Dewan Pakar Anda sudah bersidang. Sampaikan pertanyaan — vonis
              akan dijatuhkan dengan presisi standar-emas.
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
              {[
                { icon: Zap, label: "Respons instan" },
                { icon: ShieldCheck, label: "Privat & terlindungi" },
                { icon: Crown, label: "Layanan VVIP" },
              ].map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-[11.5px] font-medium text-zinc-300"
                >
                  <Icon className="h-3.5 w-3.5 text-violet-300" aria-hidden="true" />
                  {label}
                </span>
              ))}
            </div>

            <div className="mt-8 w-full">
              <OracleChat embedded />
            </div>

            <button
              type="button"
              onClick={lockSession}
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-2.5 text-[12.5px] font-semibold text-zinc-400 transition-colors hover:border-red-400/40 hover:text-red-300"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
              Keluar dari sesi VVIP
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
