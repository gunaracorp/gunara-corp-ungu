"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";
import { LangToggle } from "@/components/site/portal-ui";
import { Link, useRoute } from "@/lib/router";
import { LogoMark, Wordmark } from "./logo";
import { EASE } from "./motion";

const NAV_LINKS = [
  { to: "/perizinan", label: "Perizinan" },
  { to: "/services", label: "Praktik" },
  { to: "/layanan", label: "Katalog 120+" },
  { to: "/councils", label: "46 Dewan Pakar" },
  { to: "/industries", label: "Industri" },
  { to: "/insights", label: "Wawasan" },
  { to: "/about", label: "Tentang" },
];

const MENU_EXTRA = [
  { to: "/harga", label: "Harga Terbaik" },
  { to: "/method", label: "Metode Oracle" },
  { to: "/results", label: "Hasil & Bukti" },
  { to: "/careers", label: "Karier" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Kontak" },
];

export default function Navbar({ fallbackPath }: { fallbackPath?: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  // fallbackPath = path nyata dari SSR (app/[...slug]) agar state "active"
  // item nav identik antara server & client — tanpa hydration mismatch.
  const route = useRoute(fallbackPath);
  const activeSeg = route.segments[0] ?? "";
  const [lang] = useLang();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the menu whenever the route changes (render-time adjustment pattern)
  const [prevTarget, setPrevTarget] = useState(route.target);
  if (prevTarget !== route.target) {
    setPrevTarget(route.target);
    if (open) setOpen(false);
  }

  const linkCls = (to: string) => {
    const active = activeSeg === to.slice(1);
    return `group relative text-[13px] font-medium tracking-wide transition-colors ${
      active ? "text-violet-600" : "text-slate-500 hover:text-violet-600"
    }`;
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[80] transition-all duration-500 ${
        scrolled || open
          ? "glass shadow-[0_10px_40px_-15px_rgba(0,0,0,0.8)]"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Navigasi utama"
      >
        <Link to="/" className="group flex items-center gap-3">
          <LogoMark className="h-9 w-9 transition-transform duration-700 group-hover:rotate-[360deg]" />
          <Wordmark />
        </Link>

        <ul className="hidden items-center gap-6 xl:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.to}>
              <Link to={l.to} className={linkCls(l.to)}>
                {l.label}
                <span
                  className={`absolute -bottom-1.5 left-0 h-px w-full origin-left bg-gradient-to-r from-violet-600 to-indigo-500 transition-transform duration-300 ${
                    activeSeg === l.to.slice(1) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 sm:gap-3">
          <LangToggle lang={lang} onChange={() => {}} />
          <Link
            to="/contact"
            className="shine hidden items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 via-indigo-500 to-blue-600 px-5 py-2.5 text-[13px] font-bold text-white shadow-[0_8px_30px_-8px_rgba(13,148,136,0.42)] transition-transform duration-300 hover:scale-[1.04] active:scale-95 sm:inline-flex"
          >
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Konsultasi Sekarang
          </Link>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-colors hover:border-violet-500/50 hover:text-violet-600 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Tutup menu" : "Buka menu"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="overflow-hidden lg:hidden xl:hidden"
          >
            <ul className="mx-4 mb-4 max-h-[70vh] space-y-1 overflow-y-auto rounded-2xl border border-violet-200 bg-white/95 p-3 shadow-[0_24px_70px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl custom-scrollbar">
              {[...NAV_LINKS, ...MENU_EXTRA].map((l, i) => (
                <motion.li
                  key={l.to}
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.035, ease: EASE }}
                >
                  <Link
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-colors hover:bg-violet-50 hover:text-violet-600 ${
                      activeSeg === l.to.slice(1) ? "bg-violet-50 text-violet-600" : "text-slate-600"
                    }`}
                  >
                    {l.label}
                    <span className="text-[10px] font-bold text-slate-400">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </Link>
                </motion.li>
              ))}
              <li className="flex justify-center pt-1">
                <LangToggle lang={lang} onChange={() => {}} />
              </li>
              <li className="pt-1">
                <Link
                  to="/contact"
                  onClick={() => setOpen(false)}
                  className="block rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-3 text-center text-sm font-bold text-white"
                >
                  Konsultasi Sekarang
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
