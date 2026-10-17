"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Send, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { ORACLE_PROMPTS } from "@/data/content";
import { BRAND } from "@/data/brand";
import { LogoMark } from "./logo";
import { EASE } from "./motion";

type Msg = { role: "user" | "assistant"; content: string };

const WELCOME: Msg = {
  role: "assistant",
  content:
    "Selamat datang, Member VVIP. Saya Oracle — suara tersatukan 46 Dewan Pakar. Tanyakan apa pun: bisnis, perizinan, strategi, kehidupan.",
};

/** Kode VVIP disimpan di sessionStorage saat member lolos gerbang #/vvip. */
export function getVvipCode(): string {
  if (typeof window === "undefined") return "";
  return window.sessionStorage.getItem("gunara_vvip_code") ?? "";
}

interface OracleChatProps {
  /** true → panel chat utuh dirender inline (halaman lounge VVIP), tanpa tombol melayang. */
  embedded?: boolean;
}

export default function OracleChat({ embedded = false }: OracleChatProps) {
  const [open, setOpen] = useState(embedded);
  const [msgs, setMsgs] = useState<Msg[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [fallback, setFallback] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
      });
    }
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, loading]);

  async function send(text?: string) {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    const next: Msg[] = [...msgs, { role: "user", content }];
    setMsgs(next);
    setInput("");
    setLoading(true);
    setFallback(false);

    try {
      const res = await fetch("/api/oracle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-vvip-code": getVvipCode(),
        },
        body: JSON.stringify({ messages: next.slice(-10) }),
      });

      if (res.status === 403) {
        setMsgs((m) => [
          ...m,
          {
            role: "assistant",
            content:
              "Kode akses VVIP tidak valid atau telah diperbarui. Muat ulang halaman ini lalu masukkan kode terbaru dari tim GUNARA.",
          },
        ]);
        return;
      }

      const data = (await res.json()) as {
        ok: boolean;
        reply?: string;
        fallback?: boolean;
      };
      if (data.fallback) setFallback(true);
      setMsgs((m) => [
        ...m,
        {
          role: "assistant",
          content:
            data.reply ??
            "Dewan sedang berdeliberasi. Coba rumuskan dengan cara lain — atau tanyakan kembali.",
        },
      ]);
    } catch {
      setMsgs((m) => [
        ...m,
        { role: "assistant", content: "Sinyal terputus. Coba sekali lagi." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    void send();
  }

  const panelClassName = embedded
    ? "glass flex h-[min(620px,62svh)] w-full flex-col overflow-hidden rounded-3xl gold-ring"
    : "glass fixed bottom-24 right-4 z-[86] flex h-[min(600px,72svh)] w-[min(92vw,400px)] flex-col overflow-hidden rounded-2xl shadow-[0_30px_90px_-20px_rgba(0,0,0,0.9)]";

  const body: ReactNode = (
    <>
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-violet-200 bg-gradient-to-r from-violet-100 to-transparent p-4">
        <LogoMark className="h-8 w-8" />
        <div className="flex-1">
          <p className="font-display text-sm font-bold tracking-[0.22em] text-slate-900">
            ORACLE
          </p>
          <p className="flex items-center gap-1.5 text-[11px] text-emerald-600">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" aria-hidden="true" />
            {embedded ? "Akses VVIP aktif — 46 Dewan Pakar" : "Kecerdasan 46 Dewan Pakar"}
          </p>
        </div>
        {!embedded && (
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Tutup"
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="custom-scrollbar flex-1 space-y-3 overflow-y-auto p-4"
      >
        {msgs.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed ${
              m.role === "user"
                ? "ml-auto rounded-tr-sm bg-violet-600 font-medium text-white"
                : "mr-auto rounded-tl-sm bg-slate-100 text-slate-700"
            }`}
          >
            {m.content}
          </div>
        ))}

        {loading && (
          <div className="mr-auto flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-slate-100 px-4 py-3">
            {[0, 1, 2].map((d) => (
              <span
                key={d}
                className="h-1.5 w-1.5 animate-typing-dot rounded-full bg-violet-500"
                style={{ animationDelay: `${d * 0.18}s` }}
                aria-hidden="true"
              />
            ))}
          </div>
        )}

        {msgs.length <= 1 && !loading && (
          <div className="flex flex-wrap gap-2 pt-2">
            {ORACLE_PROMPTS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => void send(p)}
                className="rounded-full border border-violet-300 bg-violet-50/60 px-3 py-1.5 text-left text-[11px] font-medium text-violet-700/90 transition-colors hover:bg-violet-100"
              >
                {p}
              </button>
            ))}
          </div>
        )}

        {fallback && !loading && (
          <a
            href={BRAND.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-[12px] font-bold text-white transition-transform hover:scale-[1.02] active:scale-95"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Chat Tim Manusia via WhatsApp
          </a>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={onSubmit}
        className="flex items-center gap-2 border-t border-slate-200 p-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tanyakan apa saja — izin, strategi, pajak…"
          aria-label="Pertanyaan Anda untuk Oracle"
          className="h-11 flex-1 rounded-xl border border-slate-200 bg-white/70 px-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-violet-500/70 focus:ring-2 focus:ring-violet-400/20"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          aria-label="Kirim"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white transition-all hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Send className="h-4 w-4" aria-hidden="true" />
        </button>
      </form>
    </>
  );

  if (embedded) {
    return (
      <div className={panelClassName} role="dialog" aria-label="Konsultasi dengan Oracle">
        {body}
      </div>
    );
  }

  return (
    <>
      {/* Floating button */}
      <div className="fixed bottom-5 right-4 z-[85] sm:right-6">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Tutup Oracle" : "Buka Oracle"}
          aria-expanded={open}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-500 text-white shadow-[0_10px_40px_-8px_rgba(139,92,246,0.5)] transition-transform duration-300 hover:scale-105 active:scale-95"
        >
          {!open && (
            <span
              className="absolute inset-0 animate-ping-slow rounded-full bg-violet-50/600"
              aria-hidden="true"
            />
          )}
          {open ? (
            <X className="relative h-6 w-6" aria-hidden="true" />
          ) : (
            <Sparkles className="relative h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="oracle-panel"
            initial={{ opacity: 0, y: 26, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 26, scale: 0.96 }}
            transition={{ duration: 0.35, ease: EASE }}
            className={panelClassName}
            role="dialog"
            aria-label="Konsultasi dengan Oracle"
          >
            {body}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
