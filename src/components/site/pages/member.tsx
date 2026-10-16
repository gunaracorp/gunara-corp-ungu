"use client";

/**
 * Dashboard Member VVIP (#/member) — login dengan kode personal.
 * Menampilkan profil keanggotaan, tiket brief milik member, jalan pintas
 * ke Lounge Oracle, dan jalur kontak prioritas.
 */

import { motion } from "framer-motion";
import {
  Briefcase,
  CalendarClock,
  Crown,
  Gem,
  Lock,
  LogOut,
  MessageCircle,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Ticket,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { BRAND } from "@/data/brand";
import { getVvipCode } from "@/components/landing/oracle-chat";

const fmtDate = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Bangkok",
});
const fmtDateTime = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Bangkok",
});

interface MemberProfile {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  tier: string;
  status: string;
  validUntil: string | null;
  lastAccessAt: string | null;
}
interface MemberTicket {
  id: string;
  refCode: string;
  type: string;
  status: string;
  challenge: string;
  createdAt: string;
}

const TIER_BADGE: Record<string, string> = {
  VVIP: "border-violet-400/40 bg-violet-500/15 text-violet-200",
  GOLD: "border-amber-400/40 bg-amber-500/15 text-amber-200",
  PLATINUM: "border-slate-300/40 bg-slate-400/15 text-slate-200",
};

export default function MemberPage() {
  const [phase, setPhase] = useState<"checking" | "login" | "member" | "primary">("checking");
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [tickets, setTickets] = useState<MemberTicket[]>([]);

  const fetchProfile = useCallback(async (code: string): Promise<"member" | "primary" | "denied" | "error"> => {
    try {
      const res = await fetch("/api/member/profile", {
        headers: { "x-vvip-code": code },
        cache: "no-store",
      });
      const json = (await res.json()) as {
        ok: boolean;
        kind?: "member" | "primary";
        member?: MemberProfile;
        tickets?: MemberTicket[];
        message?: string;
      };
      if (!res.ok || !json.ok) return "denied";
      if (json.kind === "primary") return "primary";
      if (json.member) {
        setProfile(json.member);
        setTickets(json.tickets ?? []);
        return "member";
      }
      return "denied";
    } catch {
      return "error";
    }
  }, []);

  useEffect(() => {
    const saved = getVvipCode();
    // Defer satu tick agar setState tidak sinkron di badan effect.
    const t = window.setTimeout(() => {
      if (!saved) {
        setPhase("login");
        return;
      }
      void fetchProfile(saved).then((kind) => {
        if (kind === "member") setPhase("member");
        else if (kind === "primary") setPhase("primary");
        else {
          window.sessionStorage.removeItem("topkonsultan_vvip_code");
          setPhase("login");
        }
      });
    }, 0);
    return () => window.clearTimeout(t);
  }, [fetchProfile]);

  function lock() {
    window.sessionStorage.removeItem("topkonsultan_vvip_code");
    setProfile(null);
    setTickets([]);
    setPhase("login");
  }

  return (
    <section className="noise-overlay relative min-h-[calc(100svh-0px)] overflow-hidden bg-zinc-950 text-white">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[26rem] w-[46rem] -translate-x-1/2 rounded-full bg-violet-600/25 blur-[130px]" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-blue-600/15 blur-[110px]" aria-hidden="true" />

      <div className="relative mx-auto w-full max-w-3xl px-5 pb-24 pt-36 sm:pt-40">
        {phase === "checking" && (
          <p className="flex items-center justify-center gap-3 py-24 text-sm font-medium text-zinc-400">
            <RefreshCw className="h-4 w-4 animate-spin text-violet-300" aria-hidden="true" />
            Memeriksa keanggotaan Anda…
          </p>
        )}

        {phase === "login" && <MemberLogin onVerified={() => {
          const code = getVvipCode();
          void fetchProfile(code).then((kind) => {
            if (kind === "member") setPhase("member");
            else if (kind === "primary") setPhase("primary");
          });
        }} />}

        {phase === "primary" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-md text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/10 px-5 py-2 text-[11px] font-bold uppercase tracking-[0.3em] text-violet-300">
              <Gem className="h-3.5 w-3.5" aria-hidden="true" />
              Kode Utama Terdeteksi
            </span>
            <h1 className="mt-5 font-display text-3xl font-black tracking-tight">
              Selamat datang, <span className="bg-gradient-to-r from-violet-300 to-blue-300 bg-clip-text text-transparent">tim inti</span>
            </h1>
            <p className="mt-3 text-[14px] leading-relaxed text-zinc-400">
              Dashboard member hanya untuk member terdaftar. Dengan kode utama,
              Anda dapat langsung memasuki Lounge Oracle.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3">
              <a
                href="#/vvip"
                className="shine inline-flex h-12 items-center gap-2.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-500 to-blue-600 px-8 text-sm font-bold text-white shadow-[0_14px_44px_-10px_rgba(139,92,246,0.5)] transition-transform hover:scale-[1.02] active:scale-95"
              >
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Masuk Lounge Oracle
              </a>
              <button
                type="button"
                onClick={lock}
                className="text-[12.5px] font-semibold text-zinc-500 transition-colors hover:text-zinc-300"
              >
                Gunakan kode member lain
              </button>
            </div>
          </motion.div>
        )}

        {phase === "member" && profile && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col">
            {/* Kartu identitas member */}
            <div className="flex flex-col items-center text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-5 py-2 text-[11px] font-bold uppercase tracking-[0.3em] text-emerald-300">
                <Crown className="h-3.5 w-3.5" aria-hidden="true" />
                Keanggotaan Aktif
              </span>
              <h1 className="mt-5 font-display text-3xl font-black tracking-tight sm:text-4xl">
                {profile.name}
              </h1>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                <span className={`rounded-full border px-3 py-1 text-[11px] font-black tracking-wider ${TIER_BADGE[profile.tier] ?? TIER_BADGE.VVIP}`}>
                  TIER {profile.tier}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11.5px] font-medium text-zinc-300">
                  <CalendarClock className="h-3.5 w-3.5 text-violet-300" aria-hidden="true" />
                  {profile.validUntil ? `Berlaku hingga ${fmtDate.format(new Date(profile.validUntil))}` : "Berlaku seumur hidup"}
                </span>
                {profile.company && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11.5px] font-medium text-zinc-300">
                    <Briefcase className="h-3.5 w-3.5 text-violet-300" aria-hidden="true" />
                    {profile.company}
                  </span>
                )}
              </div>
            </div>

            {/* Jalan pintas */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <a
                href="#/vvip"
                className="group rounded-2xl border border-violet-400/30 bg-gradient-to-br from-violet-600/25 to-blue-600/10 p-5 transition-transform hover:scale-[1.02]"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 shadow-[0_10px_30px_-8px_rgba(139,92,246,0.6)]">
                  <Sparkles className="h-5 w-5" aria-hidden="true" />
                </span>
                <p className="mt-3 text-[15px] font-black">Buka Lounge Oracle</p>
                <p className="text-[12.5px] leading-relaxed text-zinc-400">
                  46 Dewan Pakar menanti — konsultasi tanpa batas 24/7.
                </p>
              </a>
              <a
                href={BRAND.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl border border-emerald-400/30 bg-gradient-to-br from-emerald-600/20 to-emerald-500/5 p-5 transition-transform hover:scale-[1.02]"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-[0_10px_30px_-8px_rgba(16,185,129,0.5)]">
                  <MessageCircle className="h-5 w-5" aria-hidden="true" />
                </span>
                <p className="mt-3 text-[15px] font-black">Jalur Prioritas WhatsApp</p>
                <p className="text-[12.5px] leading-relaxed text-zinc-400">
                  Layanan manusia 24/7 — respons tercepat untuk member.
                </p>
              </a>
            </div>

            {/* Benefit */}
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <h2 className="text-[13px] font-black uppercase tracking-[0.2em] text-zinc-400">
                Hak istimewa Anda
              </h2>
              <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
                {[
                  { icon: Sparkles, text: "Oracle AI — 46 Dewan Pakar, tanpa batas" },
                  { icon: Zap, text: "Prioritas antrean untuk semua izin & legalitas" },
                  { icon: ShieldCheck, text: "Konsultasi privat & terlindungi" },
                  { icon: Ticket, text: "Tiket brief terpantau langsung di halaman ini" },
                ].map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-2.5 text-[13px] text-zinc-300">
                    <Icon className="h-4 w-4 shrink-0 text-violet-300" aria-hidden="true" />
                    {text}
                  </li>
                ))}
              </ul>
            </div>

            {/* Tiket milik member */}
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <h2 className="flex items-center gap-2 text-[13px] font-black uppercase tracking-[0.2em] text-zinc-400">
                <Ticket className="h-4 w-4" aria-hidden="true" />
                Tiket brief Anda {tickets.length > 0 && `(${tickets.length})`}
              </h2>
              <div className="mt-3 space-y-3">
                {tickets.map((t) => (
                  <div key={t.id} className="rounded-xl border border-white/10 bg-zinc-900/60 p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[11.5px] font-bold text-violet-300">{t.refCode}</span>
                      <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase text-zinc-300">
                        {t.status === "new" ? "Baru" : t.status === "read" ? "Dibaca" : "Dibalas"}
                      </span>
                      <span className="ml-auto text-[11px] text-zinc-500">{fmtDateTime.format(new Date(t.createdAt))}</span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-[12.5px] leading-relaxed text-zinc-400">{t.challenge}</p>
                  </div>
                ))}
                {tickets.length === 0 && (
                  <p className="py-4 text-[13px] text-zinc-500">
                    Belum ada brief yang cocok dengan email member Anda
                    {profile.email ? ` (${profile.email})` : ""}. Kirim brief lewat halaman Kontak —
                    nomor tiketnya otomatis muncul di sini.
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={lock}
              className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-2.5 text-[12.5px] font-semibold text-zinc-400 transition-colors hover:border-red-400/40 hover:text-red-300"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
              Keluar dari sesi member
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}

/* ── Gerbang login kode member ────────────────────────────────────────── */

function MemberLogin({ onVerified }: { onVerified: () => void }) {
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!code.trim() || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/vvip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const json = (await res.json()) as { ok: boolean; message?: string };
      if (res.ok && json.ok) {
        window.sessionStorage.setItem("topkonsultan_vvip_code", code.trim().toUpperCase());
        onVerified();
        return;
      }
      setError(json.message ?? "Kode akses tidak dikenal.");
      setTick((t) => t + 1);
      setCode("");
    } catch {
      setError("Sinyal terputus. Coba sekali lagi.");
      setTick((t) => t + 1);
    } finally {
      setBusy(false);
    }
  }

  return (
    <motion.div
      key={tick}
      initial={error ? { x: 0 } : false}
      animate={error ? { x: [0, -10, 10, -6, 6, 0] } : { x: 0 }}
      transition={{ duration: 0.45 }}
      className="mx-auto my-auto flex w-full max-w-md flex-col items-center text-center"
    >
      <span className="inline-flex items-center gap-2.5 rounded-full border border-violet-400/30 bg-violet-500/10 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-violet-300">
        <Gem className="h-3.5 w-3.5" aria-hidden="true" />
        Area Member VVIP
      </span>
      <h1 className="mt-6 font-display text-4xl font-black tracking-tight sm:text-5xl">
        <span className="bg-gradient-to-r from-violet-300 via-indigo-300 to-blue-300 bg-clip-text text-transparent">
          Dashboard Member
        </span>
      </h1>
      <p className="mt-3 max-w-md text-[14px] leading-relaxed text-zinc-400">
        Masukkan kode personal Anda untuk melihat profil keanggotaan, tiket
        brief, dan membuka Lounge Oracle.
      </p>

      <div className="mt-9 w-full rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-xl">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-500 shadow-[0_14px_44px_-10px_rgba(139,92,246,0.55)]">
          <Lock className="h-6 w-6" aria-hidden="true" />
        </span>
        <form onSubmit={submit} className="mt-5 space-y-3">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="TOP-VVIP-XXXX-XXXX"
            aria-label="Kode akses member"
            autoComplete="off"
            spellCheck={false}
            className="h-12 w-full rounded-xl border border-white/10 bg-zinc-900/80 px-4 text-center font-mono text-sm font-semibold uppercase tracking-[0.2em] text-white placeholder:text-zinc-600 outline-none transition-all focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/25"
          />
          <button
            type="submit"
            disabled={!code.trim() || busy}
            className="shine h-12 w-full rounded-xl bg-gradient-to-r from-violet-600 via-indigo-500 to-blue-600 text-sm font-bold text-white shadow-[0_14px_44px_-10px_rgba(139,92,246,0.5)] transition-transform hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {busy ? "Memverifikasi…" : "Buka Dashboard"}
          </button>
          {error && (
            <p role="alert" className="text-center text-[12.5px] font-medium text-red-400">
              {error}
            </p>
          )}
        </form>
        <p className="mt-4 text-[12px] leading-relaxed text-zinc-500">
          Belum menjadi member?{" "}
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
      </div>
    </motion.div>
  );
}
